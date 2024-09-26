export function lowerCaseCompare(a = "",b = "") {
    return a.toLowerCase().includes(b.toLowerCase())
}

export async function validateJSONData(req) {
    let body
    try {
        body = await req.json() // Parse incoming data to json
        return [false, body]
    }catch (error) {
        return [true,null]
    }
}

export function validateItemData({ name, description, quantity, category }) {
  if (!name || !description || quantity === null || quantity === undefined || !category) {
    return { valid: false, message: "All fields are required" };
  }

  if (isNaN(quantity) || quantity < 0) {
    return { valid: false, message: "Quantity must be a number 0 och more" };
  }
  return { valid: true };
}

export function handleError(error) {
  console.error("An error occurred:", error);
  return { message: "Internal Server Error", error };
}

