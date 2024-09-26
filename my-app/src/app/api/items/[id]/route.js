import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "@/utils/helpers/authHelpers";
import { NextResponse } from "next/server";
import { validateItemData, handleError } from "@/utils/helpers/apiHelpers";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { id } = params;

try {
  const item = await prisma.item.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!item) {
    return NextResponse.json({ message: "Item not found" }, { status: 404 });
  }

  return NextResponse.json(item, { status: 200 });
} catch (error) {
  console.error("Error fetching item:", error);
  return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}
}

// PUT:
export async function PUT(req, { params }) {
  const { id } = params;
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
 
  console.log("Received token:", token);

    const user = await verifyJWT(token);
    console.log("Verified user:", user);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, quantity, category } = await req.json();

    const validation = validateItemData({ name, description, quantity, category });
    if (!validation.valid) {
      console.log("Validation error:", validation.message);
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id, 10) },
      data: { name, description, quantity: parseInt(quantity), category },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}


// DELETE
export async function DELETE(req, { params }) {
  const { id } = params;
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const user = await verifyJWT(token);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.item.delete({
      where: { id: parseInt(id, 10) },
    });
    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}


