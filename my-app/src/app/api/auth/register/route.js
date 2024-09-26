import { NextResponse } from "next/server";
import { signJWT } from "@/utils/helpers/authHelpers";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

export async function POST(req) {
    try {
    const { name, email, password} = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ message: 'All fields required'}, { status: 400});
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return NextResponse.json({ message: "User already exists"}, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    //const token = await signJWT({ userId: newUser.id });
    //const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" }); 
    const token = await signJWT({ userId: newUser.id });

    return NextResponse.json(
        { 
        message: "User registered successfully",
        user: { name: newUser.name, email: newUser.email },
        token: token, 
    },
     { status: 201 }
    );
} catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
}
}

