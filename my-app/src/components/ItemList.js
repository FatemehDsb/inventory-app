"use client";

import { useEffect, useState } from "react";

export default function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch("/api/items");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    }

    fetchItems();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">Item List</h2>
      <ul className="mt-4">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="border p-2 mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <p>Description: {item.description}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Category: {item.category}</p>
            </li>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </ul>
    </div>
  );
}
