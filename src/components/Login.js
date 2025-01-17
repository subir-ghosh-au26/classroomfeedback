import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://class-server-2t3f.onrender.com/api/auth/login",
        formData
      );
      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin");
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Error logging in admin:", error);
      alert("Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
};
export default Login;
