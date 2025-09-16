import React, { useState, useEffect } from "react";

/**
 * Customers component
 * Props:
 *  - customers: array (optional)
 *  - setCustomers: function to update parent customers state (optional)
 *
 * This component:
 *  - loads customers from backend on mount
 *  - posts new customers to backend (saves to customers.json)
 *  - updates parent state via setCustomers if provided (or keeps internal list)
 */

const API_URL = "http://localhost:3001/api/customers";

const Customers = ({ customers, setCustomers }) => {
  const [localCustomers, setLocalCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(""); // success/error messages

  // Helper to get the list we should display (uses parent state if provided)
  const displayedCustomers = Array.isArray(customers) ? customers : localCustomers;

  // Load customers from backend on mount (and populate parent state if provided)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setMessage("");
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (setCustomers) {
          setCustomers(data);
        } else {
          setLocalCustomers(data);
        }
      } catch (err) {
        console.error("Error loading customers:", err);
        setMessage("Could not load customers (start backend?)");
      } finally {
        setLoading(false);
      }
    };
    load();
    // only on mount
  }, [setCustomers]);

  // Add customer handler
  const handleAddCustomer = async () => {
    setMessage("");
    // simple validation
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setMessage("Please fill all fields.");
      return;
    }

    setSaving(true);
    const newCustomer = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim()
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer)
      });

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      const saved = await res.json(); // server returns saved customer with _id

      // Update parent state if available, otherwise update local
      if (setCustomers) {
        setCustomers(prev => (Array.isArray(prev) ? [...prev, saved] : [saved]));
      } else {
        setLocalCustomers(prev => [...prev, saved]);
      }

      // clear inputs + show success
      setName("");
      setEmail("");
      setPhone("");
      setMessage("Customer added successfully.");
    } catch (err) {
      console.error("Error saving customer:", err);
      setMessage("Failed to save customer. Check backend.");
    } finally {
      setSaving(false);
      // clear message after 4s
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Add Customer</h2>
        <button
          type="button"
          onClick={handleAddCustomer}
          disabled={saving}
          className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {saving ? "Saving..." : "Add Customer"}
        </button>
      </div>

      {/* feedback */}
      {message && (
        <div className={`p-2 mb-4 rounded ${message.includes("success") ? "bg-green-100" : "bg-red-100"}`}>
          {message}
        </div>
      )}

      {/* Input Fields */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Customer List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Customer List</h3>

        {loading ? (
          <p>Loading customers…</p>
        ) : displayedCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-2 text-left text-gray-700 font-semibold">Name</th>
                  <th className="border-b px-4 py-2 text-left text-gray-700 font-semibold">Email</th>
                  <th className="border-b px-4 py-2 text-left text-gray-700 font-semibold">Phone</th>
                </tr>
              </thead>
              <tbody>
                {displayedCustomers.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="bordzer-b px-4 py-2">{c.name}</td>
                    <td className="border-b px-4 py-2">{c.email}</td>
                    <td className="border-b px-4 py-2">{c.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No customers added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Customers;
