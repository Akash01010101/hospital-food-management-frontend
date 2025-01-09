import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import PatientManagement from "./pages/PatientManagement";
import AddPatient from "./pages/AddPatient";
import ManageDietCharts from "./pages/ManageDietCharts";
import EditDietChart from "./pages/EditDietChart";
import AddDietChart from "./pages/AddDietChart";
import ManageStaff from "./pages/ManageStaff";
import PantryDashboard from "./pages/Pantrydashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";

function App() {
  const isAuthenticated = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {isAuthenticated&&role=="Manager" ? (
          <>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/patients" element={<PatientManagement />} />
            <Route path="/manager/add-patient" element={<AddPatient />} />
            <Route path="/manager/diet-charts" element={<ManageDietCharts />} />
            <Route path="/manager/edit-diet-chart/:id" element={<EditDietChart/>} />
            <Route path="/manager/add-diet-chart" element={<AddDietChart/>} />
            <Route path="/manager/manage-staff" element={<ManageStaff />} />
            </>
            ):(isAuthenticated && role=="Pantry" ? (
              <Route path="/pantry/dashboard" element={<PantryDashboard />} />
            ):(
              isAuthenticated?(
                <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
              ):(<Route path="/" element={<Login />} />)
            ))}
      </Routes>
    </Router>
  );
}

export default App;
