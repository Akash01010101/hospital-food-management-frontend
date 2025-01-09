import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import Logout from "../components/Logout";

const ManagerDashboard = () => {
  const nav = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDietCharts: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://hospital-food-management-production.up.railway.app/api/patients", {
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
    <>
    <div className="min-h-screen flex">
      <button
        className="md:hidden fixed top-4 left-4 p-2 bg-gray-800 text-white rounded z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Close Menu" : "Open Menu"}
      </button>
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
              <Link to="/manager/manage-staff" className="hover:underline">
                Assign Tasks
              </Link>

            </li>
            <li>
            <Logout/>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-8 ml-0 md:ml-1/4">
        <h2 className="text-3xl font-bold mb-6">Overview</h2>
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
              to="/manager/diet-charts"
              className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600"
            >
              Create Diet Chart
            </Link>
            <Link
              to="/manager/manage-staff"
              className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600"
            >
              Add Delivery Staff
            </Link>
            <Link
              to="/manager/manage-staff"
               className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600"
            >
              Add Pantry Staff
            </Link>
           
          </div>
         
        </div>
       
      </main>
      
    </div>
    
    </>
  );
};

export default ManagerDashboard;
