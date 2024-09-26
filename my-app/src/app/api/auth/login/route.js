import { NextResponse } from "next/server";
import { signJWT } from "@/utils/helpers/authHelpers";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
        where: { email } });

    if (!user) {
        return NextResponse.json({ message: 'Invalid email or user'}, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
    return NextResponse.json({ message: 'Invalid credentials for password' }, { status: 401 });
  }

  // Create JWT-token
  //const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const token = await signJWT({ userId: user.id });
  
  return NextResponse.json({ token }, { status: 200 });
}