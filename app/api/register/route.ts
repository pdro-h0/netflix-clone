import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export const POST = async(req: Request) => {
  try {
    if (req.method !== "POST") {
      return new NextResponse("", { status: 405 });
    }

    const { email, name, password } = await req.json();

    const existingUser = await prismadb.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return new NextResponse("Email taken", { status: 422 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse(`Something went wrong: ${error}`, { status: 400 });
  }
}
