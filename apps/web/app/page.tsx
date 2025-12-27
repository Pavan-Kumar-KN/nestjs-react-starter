"use client";

import { useEffect, useState } from "react";
import { Product } from "@repo/types";


const API_URL = process.env.API_URL + "/products";

console.log("API_URL:", process.env.API_URL);
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Create or Update
  const handleSubmit = async () => {
    setLoading(true);

    const payload = { name, price };

    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setName("");
    setPrice(0);
    setEditingId(null);
    setLoading(false);
    fetchProducts();
  };

  // Edit
  const handleEdit = (product: Product) => {
    setName(product.name);
    setPrice(product.price);
    setEditingId(product.id);
  };

  // Delete
  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h2>Products</h2>

      {/* Form */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={{ padding: 8, marginRight: 8 }}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {editingId ? "Update" : "Create"}
        </button>
      </div>

      {/* Table */}
      <table width="100%" border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan={3} align="center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
