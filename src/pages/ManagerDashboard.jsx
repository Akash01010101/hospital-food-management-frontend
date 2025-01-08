import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDietCharts: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats({
        totalPatients: response.data.patients.length,
        totalDietCharts: response.data.charts.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Toggle Button for Sidebar on Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 p-2 bg-gray-800 text-white rounded z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Close Menu" : "Open Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-5 transform transition-transform duration-300 z-40 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative md:w-1/4`}
      >
        <h1 className="text-2xl font-bold mb-5">Manager Dashboard</h1>
        <nav>
          <ul className="space-y-3">
            <li>
              <Link to="/manager/patients" className="hover:underline">
                Manage Patients
              </Link>
            </li>
            <li>
              <Link to="/manager/diet-charts" className="hover:underline">
                Manage Diet Charts
              </Link>
            </li>
            <li>
              <Link to="/manager/tasks" className="hover:underline">
                Assign Tasks
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8 ml-0 md:ml-1/4">
        <h2 className="text-3xl font-bold mb-6">Overview</h2>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold">Total Patients</h3>
            <p className="text-2xl font-bold mt-2">{stats.totalPatients}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold">Total Diet Charts</h3>
            <p className="text-2xl font-bold mt-2">{stats.totalDietCharts}</p>
          </div>
        </div>

        {/* Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/manager/add-patient"
              className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600"
            >
              Add/Edit Patient
            </Link>
            <Link
              to="/manager/add-diet-chart"
              className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600"
            >
              Create Diet Chart
            </Link>
            <Link
              to="/manager/add-delivery-staff"
              className="bg-yellow-500 text-white p-4 rounded-lg text-center hover:bg-yellow-600"
            >
              Add Delivery Staff
            </Link>
            <Link
              to="/manager/add-pantry-staff"
              className="bg-purple-500 text-white p-4 rounded-lg text-center hover:bg-purple-600"
            >
              Add Pantry Staff
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
