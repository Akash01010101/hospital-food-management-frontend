import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HomeButton from "../components/HomeButton";

const ManageDietCharts = () => {
  const [dietCharts, setDietCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDietCharts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://hospital-food-management-production.up.railway.app/api/diet-charts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDietCharts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch diet charts");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this diet chart?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://hospital-food-management-production.up.railway.app/api/diet-charts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDietCharts((prev) => prev.filter((chart) => chart._id !== id));
      } catch (err) {
        alert(err.response?.data?.error || "Failed to delete diet chart");
      }
    }
  };

  useEffect(() => {
    fetchDietCharts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Diet Charts</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p>Loading diet charts...</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Diet Charts</h2>
              <Link
                to="/manager/add-diet-chart"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add New Diet Chart
              </Link>
            </div>

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200"> 
                <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Morning Meal</th>
                  <th className="border border-gray-300 px-4 py-2">Afternoon Meal</th>
                  <th className="border border-gray-300 px-4 py-2">Evening Meal</th>
                  <th className="border border-gray-300 px-4 py-2">Night Meal</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
  {dietCharts.map((chart) => (
    <tr key={chart._id} className="hover:bg-gray-100">
      <td className="border border-gray-300 px-4 py-2">
        {chart.patientId?.name || "Unknown"}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {chart.morningMeal.foodItems.join(", ")}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {chart.afternoonMeal.foodItems.join(", ")}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {chart.eveningMeal.foodItems.join(", ")}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {chart.nightMeal.foodItems.join(", ")}
      </td>
      <td className="border border-gray-300 px-4 py-2 space-x-2">
        <Link
          to={`/manager/edit-diet-chart/${chart._id}`}
          className="bg-blue-500 m-2 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDelete(chart._id)}
          className="bg-red-500 m-2 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </>
        )}
      </div>
      <HomeButton/>
    </div>
  );
};

export default ManageDietCharts;
