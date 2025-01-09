import React, { useState, useEffect } from "react";
import axios from "axios";
import Logout from "../components/Logout";

const PantryDashboard = () => {
  const [pantryStaff, setPantryStaff] = useState([]);
  const [selectedDietChartId, setSelectedDietChartId] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(true);
  const [dietCharts, setDietCharts] = useState([]);

  useEffect(() => {
    const fetchDietCharts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://hospital-food-management-production.up.railway.app/api/diet-charts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDietCharts(response.data);
      } catch (error) {
        console.error("Error fetching diet charts:", error);
      }
    };
    fetchData();
    fetchDietCharts();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const staffResponse = await axios.get(
        "https://hospital-food-management-production.up.railway.app/api/pantry/p",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPantryStaff(staffResponse.data);

      const patientResponse = await axios.get(
        "https://hospital-food-management-production.up.railway.app/api/patients",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPatients(patientResponse.data.patients);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const markTaskAsCompleted = async (staffId, taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://hospital-food-management-production.up.railway.app/api/pantry/update-task/${staffId}/${taskId}`,
        { status: "Completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Task marked as completed.");
      fetchData();
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const deleteFoodPrepTask = async (staffId, taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://hospital-food-management-production.up.railway.app/api/pantry/delete-task/${staffId}/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Task deleted successfully.");
      fetchData();
    } catch (error) {
      console.error("Error deleting food prep task:", error);
    }
  };

  const deleteDeliveryTask = async (staffId, deliveryId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://hospital-food-management-production.up.railway.app/api/delivery/delete-delivery/${staffId}/${deliveryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Delivery deleted successfully.");
      fetchData();
    } catch (error) {
      console.error("Error deleting delivery task:", error);
    }
  };

  const handleAssignDelivery = async () => {
    if (!selectedStaff || !selectedDietChartId) {
      alert("Please select both a staff member and a diet chart.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://hospital-food-management-production.up.railway.app/api/delivery/assign-delivery/${selectedStaff}`,
        {
          dietChartId: selectedDietChartId,
          patientId: dietCharts.find(
            (chart) => chart._id === selectedDietChartId
          ).patientId._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Delivery assigned successfully.");
      fetchData();
      setSelectedStaff("");
      setSelectedDietChartId("");
    } catch (error) {
      if (error.response && error.response.data) {
        alert("Chart already assigned to a delivery staff. Wait till delivery is finished");
      } else {
        alert("Failed to assign delivery.");
      }
      console.error("Error assigning delivery:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pantry Dashboard</h1>

    
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Assign Delivery</h2>
        
        <select
          className="border rounded p-2 w-full"
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
        >
          <option value="">Select Staff</option>
          {pantryStaff
            .filter((staff) => staff.role === "Delivery")
            .map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.name}
              </option>
            ))}
        </select>

        <select
          className="w-full border border-gray-300 rounded p-2"
          value={selectedDietChartId}
          onChange={(e) => setSelectedDietChartId(e.target.value)}
        >
          <option value="">Select Diet Chart</option>
          {dietCharts.map((chart) => (
            <option key={chart._id} value={chart._id}>
              {chart.patientId.name} (ID: {chart._id})
            </option>
          ))}
        </select>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAssignDelivery}
        >
          Assign Delivery
        </button>
      </section>


      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Food Preparation Staff</h2>
        {pantryStaff
          .filter((staff) => staff.role === "Chef")
          .map((staff) => (
            <div key={staff._id} className="mb-6 border p-4 rounded">
              <h3 className="font-semibold">Chef Name: {staff.name}</h3>
              <p>Tasks:</p>
              {staff.assignedTasks.length === 0 ? (
                <p className="text-gray-500">Wait for manager to assign tasks</p>
              ) : (
                <ul className="mt-4">
                  {staff.assignedTasks.map((task) => (
                    <li key={task._id} className="mb-3">
                      <p>
                        <strong>Task:</strong>{" "}
                        {task.dietChartId?.morningMeal?.instructions || "N/A"}
                      </p>
                      <p>
                        <strong>Status:</strong> {task.status}
                      </p>
                      {task.status !== "Completed" ? (
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                          onClick={() => markTaskAsCompleted(staff._id, task._id)}
                        >
                          Mark as Completed
                        </button>
                      ) : (
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                          onClick={() => deleteFoodPrepTask(staff._id, task._id)}
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Delivery Staff</h2>
        {pantryStaff
          .filter((staff) => staff.role === "Delivery")
          .map((staff) => (
            <div key={staff._id} className="mb-6 border p-4 rounded">
              <h3 className="font-semibold">Staff Name:{staff.name}</h3>
              <p>Tasks:</p>
              <ul className="mt-4">
                {staff.assignedDeliveries.map((delivery) => (
                  <li key={delivery._id} className="mb-3">
                    <p>
                      <strong>Patient Name:</strong> {delivery.patientId.name}
                      <span><strong>   Patient bedNumber:</strong>{delivery.patientId.bedNumber}</span> 
                    </p>
                    <p>
                      <strong>Status:</strong> {delivery.status}
                    </p>
                    {delivery.status !== "Completed" ? null : (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                        onClick={() =>
                          deleteDeliveryTask(staff._id, delivery._id)
                        }
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </section>

      <Logout />
    </div>
  );
};

export default PantryDashboard;
