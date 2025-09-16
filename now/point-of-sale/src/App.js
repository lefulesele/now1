import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components//Navbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import Sales from "./components/Sales";
import Inventory from "./components/Inventory";
import Customers from "./components/Customers";
import Reports from "./components/Reports";
import "./App.css";

const App = () => {
  // Load data from local storage
  const [products, setProducts] = useState(() => {
    const data = localStorage.getItem("products");
    return data ? JSON.parse(data) : [];
  });
  const [customers, setCustomers] = useState(() => {
    const data = localStorage.getItem("customers");
    return data ? JSON.parse(data) : [];
  });

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard products={products} customers={customers} />
              }
            />
            <Route
              path="/product-management"
              element={
                <ProductManagement
                  products={products}
                  setProducts={setProducts}
                />
              }
            />
            <Route
              path="/sales"
              element={
                <Sales
                  products={products}
                  setProducts={setProducts}
                  customers={customers}
                  setCustomers={setCustomers}
                />
              }
            />
            <Route
              path="/inventory"
              element={
                <Inventory products={products} setProducts={setProducts} />
              }
            />
            <Route
              path="/customers"
              element={
                <Customers
                  customers={customers}
                  setCustomers={setCustomers}
                />
              }
            />
            <Route
              path="/reports"
              element={<Reports products={products} />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;