import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import PatientManagement from "./pages/PatientManagement";
import AddPatient from "./pages/AddPatient";
import ManageDietCharts from "./pages/ManageDietCharts";
import EditDietChart from "./pages/EditDietChart";

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
            </>
            ):(
              <Route path="*" element={<Navigate to="/login" />} />
            )}
      </Routes>
    </Router>
  );
}

export default App;
