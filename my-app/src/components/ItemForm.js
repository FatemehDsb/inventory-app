"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

function ItemForm({ existingItem = null }) {
  const router = useRouter();
  const auth = useAuth();

  const [name, setName] = useState(existingItem?.name || "");
  const [description, setDescription] = useState(existingItem?.description || "");
  const [quantity, setQuantity] = useState(existingItem?.quantity || 1);
  const [category, setCategory] = useState(existingItem?.category || "");
  const [error, setError] = useState("");

  const isEditMode = !!existingItem;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const url = isEditMode ? `/api/items/${existingItem.id}` : "/api/items";
    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        name,
        description,
        quantity,
        category,
      }),
    });

    if (response.ok) {
      router.push("/items");
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Failed to save item");
    }
  }

  return (
    <div>
      <h2>{isEditMode ? "Edit Item" : "Create Item"}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="btn btn-primary">
          {isEditMode ? "Update Item" : "Create Item"}
        </button>
      </form>
    </div>
  );
}

export default ItemForm;
