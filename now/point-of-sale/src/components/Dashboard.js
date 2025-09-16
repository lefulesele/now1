// components/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // Ensure your CSS is imported

const Dashboard = ({ products, customers }) => {
  return (
    <div className="dashboard-container p-6 max-w-7xl mx-auto">
      <h2 className="dashboard-title mb-6">Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="summary-cards mb-8">
        <div className="card">
          <h3 className="card-heading">Products</h3>
          <p className="card-count">{products.length}</p>
        </div>
        <div className="card">
          <h3 className="card-heading">Customers</h3>
          <p className="card-count">{customers.length}</p>
        </div>
      </div>
      
      {/* Well-organized Tables */}
      <div className="tables-section">
        {/* Products Table */}
        <div className="table-container">
          <h4 className="section-title">Products</h4>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p, index) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.description}</td>
                    <td>{p.category}</td>
                    <td>M{p.price}</td>
                    <td style={{ color: p.quantity < 5 ? 'red' : 'green' }}>{p.quantity}</td>
                    <td style={{ color: p.quantity < 5 ? 'red' : 'green' }}>
                      {p.quantity < 5 ? "Low Stock" : "In Stock"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No products available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Customers Table */}
        <div className="table-container">
          <h4 className="section-title">Customers</h4>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.slice(0, 5).map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">No customers yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="nav-buttons mt-8 flex gap-4 justify-center">
        <Link
          to="/product-management"
          className="btn btn-blue"
        >
          Manage Products
        </Link>
        <Link
          to="/customers"
          className="btn btn-green"
        >
          Manage Customers
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;