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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Your Items</h1>

      <div className="bg-white p-6 shadow-lg rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter Items:</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Categories:</h3>
          {categories.length > 0 ? (
            <div className="flex flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`p-2 m-2 rounded-md border ${
                    selectedCategories.includes(category)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          ) : (
            <p>No categories available</p>
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">In Stock:</h3>
          <div className="space-x-2">
            <button
              onClick={() => handleInStockChange("true")}
              className={`p-2 rounded-md ${
                inStock === "true" ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => handleInStockChange("false")}
              className={`p-2 rounded-md ${
                inStock === "false" ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              Out of Stock
            </button>
            <button
              onClick={() => handleInStockChange("")}
              className={`p-2 rounded-md ${
                inStock === "" ? "bg-gray-500 text-white" : "bg-gray-200"
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleCreate}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-6 transition-colors"
      >
        Create New Item
      </button>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="bg-white p-6 shadow-lg rounded-md">
            <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
            <p>{item.description}</p>
            <p>Quantity: {item.quantity}</p>

            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleEdit(item.id)}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 mt-6 transition-colors"
      >
        Log out
      </button>
    </div>
  );
}
