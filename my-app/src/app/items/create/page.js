"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { validateItemData } from "@/utils/helpers/apiHelpers";

export default function CreateItemPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState();
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { token } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

      const itemData = {
        name,
        description,
        quantity,
        category,
      };

      const validation = validateItemData(itemData);
      if (!validation.valid) {
      setError(validation.message);
      return;
    }

    console.log("Token:", token);

    if (!token) {
      setError("You must be logged in to create an item");
      return;
    }

    try {
      console.log("Sending POST request with data:", {
        name,
        description,
        quantity: parseInt(quantity, 10),
        category
      }); 


      const response = await fetch("/api/items", {
        method: "POST",
          headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        name,
        description,
        quantity: parseInt(quantity, 10),
        category,
      }),
    });

    console.log("Response from server:", response); 

    if (response.ok) {
      router.push("/items");
    } else {
      const errorData = await response.json();
      console.error("Error from server:", errorData); 
      setError(errorData.message || "Failed to create item");
    }
  } catch (err) {
    setError("Error occured while creating item");
    console.error("Error caught in catch:", err);
  }
}

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold">Create New Item</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Item Description"
        required
      />
      <input
        type="number"
        value={quantity || ''} // Ensure it doesn't go undefined
        onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value, 10) : '')} // Handle empty case
        placeholder="Quantity"
        required
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Item
      </button>
    </form>
  );
}
