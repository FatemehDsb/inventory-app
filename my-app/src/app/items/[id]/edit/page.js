"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import { validateItemData } from "@/utils/helpers/apiHelpers";

export default function EditItemPage() {
  const { token } = useAuth(); 
  const router = useRouter();
  const { id } = useParams(); 

  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    quantity: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItem() {
      if (!token) {
        setError("No token available");
        return;
      }
      
      try {
        const response = await fetch(`/api/items/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch item");
        }

        const data = await response.json(); 
        setItemData(data); 
        setLoading(false); 
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchItem();
  }, [id, token]);

  const handleChange = (e) => {
    setItemData({
      ...itemData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateItemData(itemData);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    if (!token) {
      setError("Token missing");
      return;
    }

    console.log("Token:", token); 
    console.log("Sending PUT request with data:", itemData); 

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update item");
      }

      router.push("/items");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (

    <div style={{ maxWidth: "400px", margin: "20px auto", padding: "20px", border: "1px solid #ccc" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "15px" }}>Edit Item</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={itemData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="description" style={{ display: "block", marginBottom: "5px" }}>Description</label>
          <textarea
            id="description"
            name="description"
            value={itemData.description}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", height: "80px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="quantity" style={{ display: "block", marginBottom: "5px" }}>Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={itemData.quantity}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="category" style={{ display: "block", marginBottom: "5px" }}>Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={itemData.category}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc" }}
          />
        </div>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <button type="submit" style={{ padding: "8px 12px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
          Update Item
        </button>
      </form>
    </div>


  );
}