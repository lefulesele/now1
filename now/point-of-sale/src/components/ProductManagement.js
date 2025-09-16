import React, { useState, useEffect } from "react";
import "./ProductManagement.css";

const API_URL = "http://localhost:3001/api/products";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: ""
  });
  const [editIndex, setEditIndex] = useState(null);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.quantity) {
      alert("Please fill in required fields!");
      return;
    }

    if (editIndex !== null) {
      // Update
      const updatedProduct = { ...form, _id: products[editIndex]._id };
      await fetch(`${API_URL}/${updatedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      const updatedProducts = [...products];
      updatedProducts[editIndex] = updatedProduct;
      setProducts(updatedProducts);
    } else {
      // Add
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
    }

    setForm({ name: "", description: "", category: "", price: "", quantity: "" });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setForm(products[index]);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const productId = products[index]._id;
    await fetch(`${API_URL}/${productId}`, { method: "DELETE" });
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {editIndex !== null ? "Edit Product" : "Add Product"}
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input className="border p-2 rounded" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />
        <input className="border p-2 rounded" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input className="border p-2 rounded" name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input className="border p-2 rounded" name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
        <input className="border p-2 rounded" name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          {editIndex !== null ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Stock Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p, index) => (
                <tr key={p._id}>
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">{p.description}</td>
                  <td className="border px-4 py-2">{p.category}</td>
                  <td className="border px-4 py-2">M{p.price}</td>
                  <td className="border px-4 py-2" style={{ color: p.quantity < 5 ? "red" : "green" }}>{p.quantity}</td>
                  <td style={{ color: p.quantity < 5 ? "red" : "green" }}>
                    {p.quantity < 5 ? "Low Stock" : "In Stock"}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded" onClick={() => handleEdit(index)}>Edit</button>
                    <button className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded" onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="text-center p-4">No products available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
