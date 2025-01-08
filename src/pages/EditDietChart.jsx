import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditDietChart = () => {
  const { id } = useParams(); // Get the diet chart ID from the URL
  const navigate = useNavigate();

  const [dietChart, setDietChart] = useState({
    patientId: "",
    morningMeal: { foodItems: [], instructions: "" },
    afternoonMeal: { foodItems: [], instructions: "" },
    eveningMeal: { foodItems: [], instructions: "" },
    nightMeal: { foodItems: [], instructions: "" },
  });
  const [patients, setPatients] = useState([]);

  // Fetch the diet chart details
  useEffect(() => {
    const fetchDietChart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/diet-charts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDietChart(response.data);
      } catch (err) {
        console.error("Error fetching diet chart:", err);
      }
    };

    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(response.data.patients);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchDietChart();
    fetchPatients();
  }, [id]);

  const handleInputChange = (meal, field, value) => {
    setDietChart((prevState) => ({
      ...prevState,
      [meal]: {
        ...prevState[meal],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/diet-charts/${id}`, dietChart, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Diet Chart updated successfully!");
      navigate("/manager/diet-charts");
    } catch (err) {
      console.error("Error updating diet chart:", err);
      alert("Failed to update diet chart.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Diet Chart</h1>
      <form className="bg-white shadow rounded-lg p-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-1">Patient</label>
          <select
            className="w-full border rounded p-2"
            value={dietChart.patientId}
            onChange={(e) => setDietChart({ ...dietChart, patientId: e.target.value })}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {["morningMeal", "afternoonMeal", "eveningMeal", "nightMeal"].map((meal) => (
          <div key={meal}>
            <label className="block font-semibold mb-1 capitalize">{meal.replace("Meal", " Meal")}</label>
            <input
              type="text"
              className="w-full border rounded p-2 mb-2"
              placeholder="Food Items (comma-separated)"
              value={dietChart[meal].foodItems.join(", ")}
              onChange={(e) =>
                handleInputChange(meal, "foodItems", e.target.value.split(",").map((item) => item.trim()))
              }
              required
            />
            <textarea
              className="w-full border rounded p-2"
              placeholder="Special Instructions"
              value={dietChart[meal].instructions}
              onChange={(e) => handleInputChange(meal, "instructions", e.target.value)}
            ></textarea>
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditDietChart;
