import React, { useEffect, useState } from "react";
import axios from "axios";
import HomeButton from "../components/HomeButton";

const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [dietCharts, setDietCharts] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedDietChartId, setSelectedDietChartId] = useState("");
  const [newStaff, setNewStaff] = useState({ name: "", contactInfo: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false); 
  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://hospital-food-management-production.up.railway.app/api/pantry", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const fetchDietCharts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://hospital-food-management-production.up.railway.app/api/diet-charts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDietCharts(response.data);
    } catch (error) {
      console.error("Error fetching diet charts:", error);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchDietCharts();
  }, []);

const assignTask = async () => {
  if (!selectedStaffId || !selectedDietChartId) {
    alert("Please select both a staff member and a diet chart.");
    return;
  }

  const selectedStaff = staffList.find((staff) => staff._id === selectedStaffId);
  if (!selectedStaff) {
    alert("Invalid staff selection.");
    return;
  }

 
  const isTaskAssignedToSameRole = staffList.some(
    (staff) =>
      staff._id !== selectedStaffId && 
      staff.role === selectedStaff.role && 
      staff.assignedTasks.some(
        (task) =>
          task.dietChartId && task.dietChartId._id === selectedDietChartId
      )
  );

  if (isTaskAssignedToSameRole) {
    alert(
      `This task is already assigned to another staff member with the role: ${selectedStaff.role}.`
    );
    return;
  }

  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (selectedStaff.role === "Delivery") {
      await axios.put(
        `https://hospital-food-management-production.up.railway.app/api/delivery/assign-delivery/${selectedStaffId}`,
        {
          dietChartId: selectedDietChartId,
          patientId: dietCharts.find((chart) => chart._id === selectedDietChartId)?.patientId?._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.put(
        `https://hospital-food-management-production.up.railway.app/api/pantry/assign-task/${selectedStaffId}`,
        { dietChartId: selectedDietChartId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    alert("Task assigned successfully!");
    fetchStaff();
  } catch (error) {
    console.error("Error assigning task:", error);
    alert("Failed to assign task.");
  } finally {
    setLoading(false);
  }
};
  const addNewStaff = async () => {
    if (!newStaff.name || !newStaff.contactInfo || !newStaff.role) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://hospital-food-management-production.up.railway.app/api/pantry", newStaff, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("New staff member added successfully!");
      fetchStaff();
      setIsAdding(false); // Close form
      setNewStaff({ name: "", contactInfo: "", role: "" }); // Reset form
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to add staff.");
    } finally {
      setLoading(false);
    }
  };
  const removeStaff = async (staffId) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://hospital-food-management-production.up.railway.app/api/pantry/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Staff member removed successfully!");
      fetchStaff();
    } catch (error) {
      console.error("Error removing staff:", error);
      alert("Failed to remove staff.");
    }
  };
  const deleteAllTasks = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete all tasks for this staff member?")) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://hospital-food-management-production.up.railway.app/api/pantry/${staffId}/delete-all-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("All tasks deleted successfully!");
      fetchStaff();
    } catch (error) {
      console.error("Error deleting all tasks:", error);
      alert("Failed to delete all tasks.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">Manage Staff</h1>
      <div className="bg-white shadow rounded p-5 mb-8">
        <h2 className="text-xl font-semibold mb-4">Assign Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Staff</label>
            <select
              className="w-full border border-gray-300 rounded p-2"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
            >
              <option value="">Select Staff</option>
              {staffList.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name} ({staff.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Select Diet Chart</label>
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
          </div>
          <div className="flex items-end">
            <button
              onClick={assignTask}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
              disabled={loading}
            >
              {loading ? "Assigning..." : "Assign Task"}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded p-5 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Staff</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {isAdding ? "Cancel" : "Add Staff"}
        </button>
        {isAdding && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded p-2"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Contact Info"
              className="w-full border border-gray-300 rounded p-2"
              value={newStaff.contactInfo}
              onChange={(e) => setNewStaff({ ...newStaff, contactInfo: e.target.value })}
            />
            <select
              className="w-full border border-gray-300 rounded p-2"
              value={newStaff.role}
              onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="Chef">Chef</option>
              <option value="Delivery">Delivery</option>
            </select>
            <button
              onClick={addNewStaff}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Staff"}
            </button>
          </div>
        )}
      </div>
      <div className="bg-white shadow rounded p-5">
        <h2 className="text-xl font-semibold mb-4">Staff List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Contact Info</th>
              <th className="border border-gray-300 p-2">Assigned Tasks</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff._id}>
                <td className="border border-gray-300 p-2">{staff.name}</td>
                <td className="border border-gray-300 p-2">{staff.role}</td>
                <td className="border border-gray-300 p-2">{staff.contactInfo}</td>
                <td className="border border-gray-300 p-2">
                  {staff.assignedTasks.length > 0  && staff.role=='Chef'? (
                    staff.assignedTasks.map((task, index) => (
                      <div key={index}>
                        Task: {task.dietChartId ? task.dietChartId._id : "N/A"} -{" "}
                        <strong>{task.status}</strong>
                      </div>
                    ))
                  ) : (
                    <span></span>
                  )}
                  {staff.assignedDeliveries.length > 0 && staff.role=='Delivery'?  (
      <div>
        <h4 className="font-semibold">Assigned Deliveries:</h4>
        {staff.assignedDeliveries.map((delivery, index) => (
          <div key={`delivery-${index}`} className="mb-2">
            Delivery: {delivery.dietChartId ? delivery.dietChartId : "N/A"} -{" "}
            <strong>{delivery.status}</strong>{" "}
            (Patient: {delivery.patientId ? delivery.patientId : "Unknown"})
          </div>
        ))}
      </div>
    ):<></>}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => removeStaff(staff._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
  onClick={() => deleteAllTasks(staff._id)}
  className="bg-blue-500 text-white px-4 py-2 m-2 rounded hover:bg-blue-600"
>
  Delete All Tasks
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <HomeButton/>
    </div>
  );
};

export default ManageStaff;
