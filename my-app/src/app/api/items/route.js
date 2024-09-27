import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { validateItemData, handleError } from "@/utils/helpers/apiHelpers";
import { verifyJWT } from "@/utils/helpers/authHelpers";

const prisma = new PrismaClient();

//Extrahering av Query-parametrar från URL
//förbereder  filtreringsparametrar (categories och inStock)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    //hämtas värdet av parametern category från URL
    const categories = searchParams.get('category')?.split(",") || [];
    //Hämtar värdet på inStock-parametern från URL
    const inStock = searchParams.get('inStock');

    
    let filter = {};

  if (categories.length > 0) {
    //uppdatera filter objekt med en property som heter category
    filter.category = {
      in: categories, 
    };
  }
  //Kontroll av inStock-värde
  if (inStock !== null) {
    //Om inStock är "true", endast produkter där quantity  är större än 0 kommer att hämtas
  filter.quantity = inStock === "true" ? { gt: 0 } : { lte: 0 };
  }

  //***hämta datan från databasen för att filtera basera på filter objekt */
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