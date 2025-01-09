import React, { useState, useEffect } from "react";
import axios from "axios";
import Logout from "../components/Logout";

const DeliveryDashboard = () => {
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryStaff = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://hospital-food-management-production.up.railway.app/api/pantry/p", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const deliveryStaff = response.data.filter(
          (staff) => staff.role === "Delivery"
        );
        setDeliveryStaff(deliveryStaff);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching delivery staff:", error);
        setLoading(false);
      }
    };

    fetchDeliveryStaff();
  }, []);

  const markDeliveryAsCompleted = async (staffId, deliveryId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://hospital-food-management-production.up.railway.app/api/delivery/update-delivery/${staffId}/${deliveryId}`,
        { status: "Completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Delivery marked as completed.");
      setDeliveryStaff((prevStaff) =>
        prevStaff.map((staff) => {
          if (staff._id === staffId) {
            return {
              ...staff,
              assignedDeliveries: staff.assignedDeliveries.map((delivery) =>
                delivery._id === deliveryId
                  ? { ...delivery, status: "Completed" }
                  : delivery
              ),
            };
          }
          return staff;
        })
      );
    } catch (error) {
      console.error("Error marking delivery as completed:", error);
      alert("Failed to mark delivery as completed.");
    }
  };

  const deleteCompletedDelivery = async (staffId, deliveryId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://hospital-food-management-production.up.railway.app/api/delivery/delete-delivery/${staffId}/${deliveryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Delivery deleted successfully.");
      setDeliveryStaff((prevStaff) =>
        prevStaff.map((staff) => {
          if (staff._id === staffId) {
            return {
              ...staff,
              assignedDeliveries: staff.assignedDeliveries.filter(
                (delivery) => delivery._id !== deliveryId
              ),
            };
          }
          return staff;
        })
      );
    } catch (error) {
      console.error("Error deleting delivery:", error);
      alert("Failed to delete delivery.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Delivery Dashboard</h1>
      {deliveryStaff.length === 0 ? (
        <p>No delivery staff available.</p>
      ) : (
        deliveryStaff.map((staff) => (
          <div key={staff._id} className="mb-6 border p-4 rounded">
            <h3 className="font-semibold">Staff name: {staff.name}</h3>
            <p>Contact: {staff.contactInfo}</p>
            <p>deliveries:</p>
            <ul className="mt-4">
              {staff.assignedDeliveries.length > 0 ? (
                staff.assignedDeliveries.map((delivery) => (
                  <li key={delivery._id} className="mb-3">
                    <p>
                      <strong>Patient ID:</strong>{" "}
                      {delivery.patientId?.bedNumber || "Unknown"}
                    </p>
                    <p>
                      <strong>Patient name:</strong>{" "}
                      {delivery.patientId?.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Status:</strong> {delivery.status}
                    </p>
                    <p>
                      <strong>Notes:</strong>{" "}
                      {delivery.deliveryNotes || "None"}
                    </p>
                    {delivery.status !== "Completed" ? (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                        onClick={() =>
                          markDeliveryAsCompleted(staff._id, delivery._id)
                        }
                      >
                        Mark as Completed
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                        onClick={() =>
                          deleteCompletedDelivery(staff._id, delivery._id)
                        }
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <p>No deliveries assigned.</p>
              )}
            </ul>
          </div>
        ))
      )}
      <Logout/>
    </div>
  );
};

export default DeliveryDashboard;
