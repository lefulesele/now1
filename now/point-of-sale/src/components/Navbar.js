import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">Wings Cafe POS</h1>
      <ul className="nav-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/sales">Sales</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/customers">Customers</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/product-management">Products</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
