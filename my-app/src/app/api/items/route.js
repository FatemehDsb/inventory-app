import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { validateItemData, handleError } from "@/utils/helpers/apiHelpers";
import { verifyJWT } from "@/utils/helpers/authHelpers";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    //const categories = searchParams.getAll('category');
    const categories = searchParams.get('category')?.split(",") || [];
    const inStock = searchParams.get('inStock');

    let filter = {};

  if (categories.length > 0) {
    filter.category = {
      in: categories,
    };
  }

  if (inStock !== null) {
  filter.quantity = inStock === "true" ? { gt: 0 } : { lte: 0 };
  }

    const items = await prisma.item.findMany({
      where: filter,
    });

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}

export async function POST(req) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  
  console.log("Received token:", token);

  const user = await verifyJWT(token);

  if (!user) {
    console.log("Unauthorized - No valid token found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, quantity, category } = await req.json();
    console.log("Received item data:", { name, description, quantity, category });
    // Validate
    /*if (!name || !description || quantity === undefined || !category) {
      console.log("Missing fields in request body");
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }*/

      const validation = validateItemData({ name, description, quantity, category});

      if (!validation.valid) {
        console.log(validation.message);  
        return NextResponse.json({ message: validation.message }, { status: 400 });  
      }

    console.log("Creating new item with data:", { name, description, quantity, category });

    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        quantity: parseInt(quantity),
        category,
      },
    });

    console.log("Item created:", newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}