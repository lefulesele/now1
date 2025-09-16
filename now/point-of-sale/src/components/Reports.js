import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js modules
ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend);

const InventoryReport = () => {
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/products"); // <-- backend URL
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const products = await res.json();

        // Prepare data for Pie chart
        const labels = products.map((p) => p.name);
        const dataPoints = products.map((p) => p.quantity);
        const backgroundColors = products.map((p) =>
          p.quantity < 5 ? "red" : "green"
        );

        setInventoryData({
          labels,
          datasets: [
            {
              label: "Inventory Quantity",
              data: dataPoints,
              backgroundColor: backgroundColors,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Inventory Distribution</h2>
        <p>Loading inventory data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Inventory Distribution</h2>
      {inventoryData ? (
        <div className="bg-white p-4 rounded shadow">
          <Pie data={inventoryData} />
        </div>
      ) : (
        <p>Failed to load inventory data.</p>
      )}
    </div>
  );
};

export default InventoryReport;
