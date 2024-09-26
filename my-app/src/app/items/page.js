"use client";

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStock, setInStock] = useState(""); // Changed to string
  const { token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchItems() {
      try {
        const categoryQuery = selectedCategories.length
          ? `category=${selectedCategories.join(",")}`
          : "";
        const inStockQuery = inStock ? `inStock=${inStock}` : "";
        const queryString = [categoryQuery, inStockQuery].filter(Boolean).join("&");

        const response = await fetch(`/api/items${queryString ? `?${queryString}` : ""}`);

        if (response.ok) {
          const data = await response.json();
          setItems(data);
          setCategories([...new Set(data.map((item) => item.category))]);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [selectedCategories, inStock]);

  function handleCategoryChange(category) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  }

  function handleInStockChange(value) {
    setInStock(value);
  }

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }

      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(id) {
    router.push(`/items/${id}/edit`);
  }

  function handleCreate() {
    router.push("/items/create");
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (


    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "10px" }}>
    <h1 style={{ fontSize: "24px", textAlign: "center", marginBottom: "20px" }}>Items Management</h1>

    {/* Filter Section */}
    <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
      <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Filter Items:</h2>

      {/* Categories */}
      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ marginBottom: "5px" }}>Categories:</h3>
        {categories.length > 0 ? (
          <div>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                style={{
                  padding: "5px",
                  margin: "5px",
                  border: "1px solid #000",
                  backgroundColor: selectedCategories.includes(category) ? "#007bff" : "#ddd",
                  color: selectedCategories.includes(category) ? "#fff" : "#000",
                }}
              >
                {category}
              </button>
            ))}
          </div>
        ) : (
          <p>No categories available</p>
        )}
      </div>

      {/* In Stock Filter */}
      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ marginBottom: "5px" }}>In Stock:</h3>
        <div>
          <button
            onClick={() => handleInStockChange("true")}
            style={{
              padding: "5px",
              marginRight: "5px",
              backgroundColor: inStock === "true" ? "#28a745" : "#ddd",
              color: inStock === "true" ? "#fff" : "#000",
            }}
          >
            In Stock
          </button>
          <button
            onClick={() => handleInStockChange("false")}
            style={{
              padding: "5px",
              marginRight: "5px",
              backgroundColor: inStock === "false" ? "#dc3545" : "#ddd",
              color: inStock === "false" ? "#fff" : "#000",
            }}
          >
            Out of Stock
          </button>
          <button
            onClick={() => handleInStockChange("")}
            style={{
              padding: "5px",
              backgroundColor: inStock === "" ? "#6c757d" : "#ddd",
              color: inStock === "" ? "#fff" : "#000",
            }}
          >
            All
          </button>
        </div>
      </div>
    </div>

    {/* Create New Item Button */}
    <button
      onClick={handleCreate}
      style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", marginBottom: "20px" }}
    >
      Create New Item
    </button>

    {/* Items List */}
    <ul style={{ listStyleType: "none", padding: "0" }}>
      {items.map((item) => (
        <li key={item.id} style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "10px" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "5px" }}>{item.name}</h2>
          <p>{item.description}</p>
          <p>Quantity: {item.quantity}</p>

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => handleEdit(item.id)}
              style={{ padding: "5px", marginRight: "5px", backgroundColor: "#ffc107", color: "#fff" }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              style={{ padding: "5px", backgroundColor: "#dc3545", color: "#fff" }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      style={{ width: "100%", padding: "10px", backgroundColor: "#dc3545", color: "#fff", marginTop: "20px" }}
    >
      Log out
    </button>
  </div>
  );
}
