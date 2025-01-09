import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";

const AddDietChart = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    morningMeal: { foodItems: [], instructions: "" },
    afternoonMeal: { foodItems: [], instructions: "" },
    eveningMeal: { foodItems: [], instructions: "" },
    nightMeal: { foodItems: [], instructions: "" },
  });
  const navigate = useNavigate();

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://hospital-food-management-production.up.railway.app/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://hospital-food-management-production.up.railway.app/api/diet-charts", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Diet Chart added successfully!");
      navigate("/manager/diet-charts");
    } catch (error) {
      console.error("Error adding diet chart:", error);
      alert("Failed to add diet chart.");
    }
  };

  const handleChange = (e, meal = null, field = null) => {
    const { name, value } = e.target;
    if (meal && field) {
      setFormData((prev) => ({
        ...prev,
        [meal]: { ...prev[meal], [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <>
    <div className="max-w-3xl mx-auto mt-10 p-5 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-5">Add Diet Chart</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Patient</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="" disabled>
              Select a patient
            </option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {["morningMeal", "afternoonMeal", "eveningMeal", "nightMeal"].map((meal) => (
          <div key={meal} className="mb-6">
            <h2 className="text-lg font-semibold capitalize">{meal.replace("Meal", " Meal")}</h2>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Food Items</label>
              <input
                type="text"
                placeholder="Comma-separated items"
                value={formData[meal].foodItems}
                onChange={(e) => handleChange(e, meal, "foodItems")}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instructions</label>
              <textarea
                placeholder="Any instructions for this meal"
                value={formData[meal].instructions}
                onChange={(e) => handleChange(e, meal, "instructions")}
                className="w-full border border-gray-300 rounded p-2"
              ></textarea>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Diet Chart
        </button>
      </form>
      
    </div>
    <HomeButton/>
    </>
  );
};

export default AddDietChart;
