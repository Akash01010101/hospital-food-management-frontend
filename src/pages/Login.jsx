import { useState, useEffect } from "react";  
import axios from "axios";  
import { useNavigate } from "react-router-dom";  

const Login = () => {  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const [error, setError] = useState(null);  
  const navigate = useNavigate();  

  // Check local storage for token and role on component mount  
  useEffect(() => {  
    const token = localStorage.getItem("token");  
    const role = localStorage.getItem("userRole");  

    if (token && role) {  
      // Navigate to the respective dashboard based on the role  
      if (role === "Manager") {  
        navigate("/manager/dashboard");  
      } else if (role === "Pantry") {  
        navigate("/pantry/dashboard");  
      } else {  
        navigate("/Delivery/dashboard");  
      }  
    }  
  }, [navigate]);  

  const handleSubmit = async (e) => {  
    e.preventDefault();  
    try {  
      const response = await axios.post(  
        "http://localhost:5000/api/auth/login",  
        { email, password }  
      );  

      // Store token and role in localStorage  
      localStorage.setItem("token", response.data.token);  
      localStorage.setItem("userRole", response.data.role);  

      // Navigate based on the user role  
      if (response.data.role == "Manager") {  
        navigate("/manager/dashboard");  
      } else if (response.data.role == "Pantry") {  
        navigate("/pantry/dashboard");  
      } else {  
        navigate("/Delivery/dashboard");  
      }  

      console.log(response.data);  
    } catch (err) {  
      // Handle errors  
      setError(err.response?.data?.error || "Login failed");  
    }  
  };  

  return (  
    <div className="flex justify-center items-center h-screen bg-gray-100">  
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">  
        <h2 className="text-2xl font-bold text-center text-gray-700">  
          Helix Hospital  
        </h2>  
        {error && <p className="text-red-500 text-sm">{error}</p>}  
        <form className="space-y-4" onSubmit={handleSubmit}>  
          <div>  
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">  
              Email  
            </label>  
            <input  
              type="email"  
              id="email"  
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-indigo-200"  
              value={email}  
              onChange={(e) => setEmail(e.target.value)}  
              required  
            />  
          </div>  
          <div>  
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">  
              Password  
            </label>  
            <input  
              type="password"  
              id="password"  
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-indigo-200"  
              value={password}  
              onChange={(e) => setPassword(e.target.value)}  
              required  
            />  
          </div>  
          <button  
            type="submit"  
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-200"  
          >  
            Login  
          </button>  
        </form>  
      </div>  
    </div>  
  );  
};  

export default Login;