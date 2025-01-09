import React from 'react'
import { useNavigate } from 'react-router-dom';
function Logout() {
    const nav = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        nav("/");
    };
  return (
    <button onClick={handleLogout} className="bg-blue-500 text-white p-4 m-10 rounded-lg text-center hover:bg-blue-600">
              Logout
            </button>
  )
}

export default Logout