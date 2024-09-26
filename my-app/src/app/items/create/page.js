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

    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "20px auto", padding: "10px", border: "1px solid #ccc" }}>
    <h1 style={{ fontSize: "20px", marginBottom: "10px" }}>Create New Item</h1>
    {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Item Name"
      required
      style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
    />
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Item Description"
      required
      style={{ marginBottom: "10px", padding: "5px", width: "100%", height: "80px" }}
    />
    <input
      type="number"
      value={quantity || ""}
      onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value, 10) : "")}
      placeholder="Quantity"
      required
      style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
    />
    <input
      type="text"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      placeholder="Category"
      required
      style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
    />
    <button type="submit" style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
      Create Item
    </button>
  </form>
  );
}
