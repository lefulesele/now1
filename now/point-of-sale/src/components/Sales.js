import React, { useState, useEffect } from "react";

const API_PRODUCTS = "http://localhost:3001/api/products";
const API_CUSTOMERS = "http://localhost:3001/api/customers";
const API_SALES = "http://localhost:3001/api/sales";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [saleQty, setSaleQty] = useState(1);
  const [saleSuccess, setSaleSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Load products, customers, and sales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, custRes, salesRes] = await Promise.all([
          fetch(API_PRODUCTS),
          fetch(API_CUSTOMERS),
          fetch(API_SALES),
        ]);
        const [prodData, custData, salesData] = await Promise.all([
          prodRes.json(),
          custRes.json(),
          salesRes.json(),
        ]);
        setProducts(prodData);
        setCustomers(custData);
        setSalesHistory(salesData);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSell = async () => {
    if (!selectedProductId || !selectedCustomerId || saleQty < 1) {
      alert("Please select a product, customer, and enter a valid quantity");
      return;
    }

    const product = products.find((p) => p._id === selectedProductId);
    const customer = customers.find((c) => c._id === selectedCustomerId);

    if (!product || !customer) return;
    if (product.quantity < saleQty) {
      alert("Not enough stock");
      return;
    }

    const totalAmount = product.price * saleQty; // product.price is a number

    const saleRecord = {
      productId: product._id,
      productName: product.name,
      customerId: customer._id,
      customerName: customer.name,
      quantity: saleQty,
      date: new Date().toLocaleString(),
      amount: totalAmount, // store as number
    };

    try {
      const res = await fetch(API_SALES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleRecord),
      });
      if (!res.ok) throw new Error("Failed to save sale");
      const savedSale = await res.json();

      // Update product stock locally
      setProducts(prev =>
        prev.map(p =>
          p._id === savedSale.productId
            ? { ...p, quantity: p.quantity - saleQty }
            : p
        )
      );

      // Add sale to history
      setSalesHistory(prev => [savedSale, ...prev]);
      setSaleSuccess(`Sold ${saleQty} ${product.name} to ${customer.name}`);

      // Reset form
      setSelectedProductId("");
      setSelectedCustomerId("");
      setSaleQty(1);
    } catch (err) {
      console.error(err);
      alert("Error saving sale. Check backend.");
    }
  };

  if (loading) return <p>Loading data…</p>;

  // Calculate total sales amount
  const totalSalesAmount = salesHistory.reduce(
    (sum, sale) => sum + (sale.amount || 0),
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow mb-8">
      <h2 className="text-2xl font-bold mb-4">Sales</h2>

      {saleSuccess && (
        <div className="bg-green-100 p-2 mb-4 rounded">{saleSuccess}</div>
      )}

      {/* Product selection */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Select Product</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} (In stock: {p.quantity})
            </option>
          ))}
        </select>
      </div>

      {/* Customer selection */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Select Customer</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Quantity</label>
        <input
          type="number"
          min={1}
          className="w-full border p-2 rounded"
          value={saleQty}
          onChange={(e) => setSaleQty(parseInt(e.target.value))}
        />
      </div>

      {/* Sell button */}
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={handleSell}
      >
        Sell Product
      </button>

      {/* Receipt for last sale */}
      {saleSuccess && salesHistory[0] && (
        <div className="border p-4 rounded bg-gray-50 mb-8">
          <h3 className="font-semibold mb-2">Receipt</h3>
          <p>
            <strong>Date:</strong> {salesHistory[0].date}
          </p>
          <p>
            <strong>Customer:</strong> {salesHistory[0].customerName}
          </p>
          <p>
            <strong>Product:</strong> {salesHistory[0].productName}
          </p>
          <p>
            <strong>Quantity:</strong> {salesHistory[0].quantity}
          </p>
          <p>
            <strong>Total Amount:</strong> M{salesHistory[0].amount}
          </p>
        </div>
      )}

      {/* Sales History Table */}
      <h3 className="text-xl font-semibold mb-2">Sales History</h3>
      {salesHistory.length === 0 ? (
        <p>No sales yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Customer</th>
              <th className="border px-2 py-1">Product</th>
              <th className="border px-2 py-1">Quantity</th>
              <th className="border px-2 py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {salesHistory.map((sale) => (
              <tr key={sale._id}>
                <td className="border px-2 py-1">{sale.date}</td>
                <td className="border px-2 py-1">{sale.customerName}</td>
                <td className="border px-2 py-1">{sale.productName}</td>
                <td className="border px-2 py-1">{sale.quantity}</td>
                <td className="border px-2 py-1">M{sale.amount}</td>
              </tr>
            ))}
            {/* Total sales sum row */}
            <tr className="font-semibold bg-gray-100">
              <td colSpan={4} className="px-2 py-1 text-right">
                Total Sales:
              </td>
              <td className="px-2 py-1">M{totalSalesAmount}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Sales;