import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { validateItemData, handleError } from "@/utils/helpers/apiHelpers";
import { verifyJWT } from "@/utils/helpers/authHelpers";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
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

// POST REQUEST
export async function POST(req) {
  //Extract Token from Request Headers 
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  //a function that verifies the validity of the JWT token
  const user = await verifyJWT(token);
  //user will contain user information
  if (!user) {
    console.log("Unauthorized - No valid token found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
//Extract Data from Request Body
  try {
    const { name, description, quantity, category } = await req.json();
    console.log("Received item data:", { name, description, quantity, category });
    //Data Validation
    const validation = validateItemData({ name, description, quantity, category});

      if (!validation.valid) {
    
        return NextResponse.json({ message: validation.message }, { status: 400 });  
      }

    console.log("Creating new item with data:", { name, description, quantity, category });

    //Use Prisma to create new item in database
    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        quantity: parseInt(quantity),
        category,
      },
    });

    console.log("Item created:", newItem);
    //
    //Responding to the Client
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, { status: 500 });
  }
}