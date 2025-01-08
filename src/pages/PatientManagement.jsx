import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(response.data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Patient Management</h1>

      {/* Search and Add Buttons */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-lg w-1/3"
        />
        <Link
          to="/manager/add-patient"
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          Add New Patient
        </Link>
      </div>

      {/* Patient List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Age</th>
              <th className="py-3 px-4 text-left">Gender</th>
              <th className="py-3 px-4 text-left">Room</th>
              <th className="py-3 px-4 text-left">Bed</th>
              <th className="py-3 px-4 text-left">Floor</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient._id} className="border-b">
                <td className="py-3 px-4">{patient.name}</td>
                <td className="py-3 px-4">{patient.age}</td>
                <td className="py-3 px-4">{patient.gender}</td>
                <td className="py-3 px-4">{patient.roomNumber}</td>
                <td className="py-3 px-4">{patient.bedNumber}</td>
                <td className="py-3 px-4">{patient.floorNumber}</td>
                <td className="py-3 px-4">
                  <Link
                    to={`/manager/edit-patient/${patient._id}`}
                    className="text-blue-500 hover:underline mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(patient._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPatients.length === 0 && (
        <p className="text-gray-500 mt-4">No patients found.</p>
      )}
    </div>
  );
};

const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this patient?")) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Patient deleted successfully.");
      fetchPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  }
};

export default PatientManagement;
