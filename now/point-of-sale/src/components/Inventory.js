import React from "react";

const Inventory = ({ products, setProducts }) => {
  const handleUpdateQty = (id, qty) => {
    const idx = products.findIndex(p => p._id === id);
    if (idx !== -1) {
      const updated = [...products];
      updated[idx] = { ...updated[idx], quantity: qty };
      setProducts(updated);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <table className="min-w-full border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Stock Quantity</th>
            <th className="border px-2 py-1">Update Qty</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="border px-2 py-1">{p.name}</td>
              <td className="border px-2 py-1">{p.quantity}</td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  min={0}
                  value={p.quantity}
                  onChange={(e) => handleUpdateQty(p._id, parseInt(e.target.value))}
                  className="w-full border p-1 rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Additional inventory tasks can be added here */}
    </div>
  );
};

export default Inventory;