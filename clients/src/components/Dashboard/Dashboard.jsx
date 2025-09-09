// src/components/Dashboard.js
import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const COLORS = {
    available: "#28a745",
    low: "#ffc107",
    out: "#dc3545",
    primary: "#0d6efd",
  };

  const barData = {
    labels: ["iPhone 14", "Samsung TV", "Dell Laptop", "Washing Machine", "AC"],
    datasets: [
      {
        label: "Stock",
        data: [50, 8, 0, 12, 4],
        backgroundColor: COLORS.primary,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "#eee" } },
      x: { grid: { display: false } },
    },
  };

  const doughnutData = {
    labels: ["Available", "Low", "Out"],
    datasets: [
      {
        data: [50, 15, 5],
        backgroundColor: [COLORS.available, COLORS.low, COLORS.out],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 10 },
        },
      },
    },
  };

  const cards = [
    { title: "Total Products", count: 450, color: "#0d6efd", icon: "bi-box-seam" },
    { title: "Low Stock", count: 15, color: "#ffc107", icon: "bi-exclamation-triangle" },
    { title: "Categories", count: 12, color: "#20c997", icon: "bi-tags" },
    { title: "Out of Stock", count: 5, color: "#dc3545", icon: "bi-x-circle" },
  ];

  return (
    <div className="container-fluid p-4">
      <div className="row g-4 mb-4">
        {cards.map((card, i) => (
          <div key={i} className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body d-flex align-items-center">
                <div
                  className="me-3 d-flex justify-content-center align-items-center rounded-circle"
                  style={{ width: 50, height: 50, backgroundColor: card.color, color: "#fff" }}
                >
                  <i className={`bi ${card.icon} fs-4`}></i>
                </div>
                <div>
                  <h6 className="mb-1 text-muted">{card.title}</h6>
                  <h4 className="fw-bold mb-0">{card.count}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">Stock by Product</h5>
              <div style={{ height: "200px" }}>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">Stock Status</h5>
              <div style={{ height: "200px", maxWidth: "200px", margin: "0 auto" }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h5 className="mb-3">Recent Products</h5>
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>iPhone 14</td>
                <td>Mobile</td>
                <td>50</td>
                <td>₹80,000</td>
                <td><span className="badge bg-success">Available</span></td>
              </tr>
              <tr>
                <td>Samsung TV</td>
                <td>Electronics</td>
                <td>8</td>
                <td>₹45,000</td>
                <td><span className="badge bg-warning text-dark">Low Stock</span></td>
              </tr>
              <tr>
                <td>Dell Laptop</td>
                <td>Computers</td>
                <td>0</td>
                <td>₹65,000</td>
                <td><span className="badge bg-danger">Out of Stock</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
