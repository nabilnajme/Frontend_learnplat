import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "./App";
import "./css/register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "apprenant",
  });
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API + "/register", formData);

      localStorage.setItem("token", res.data.token);

      showToast("Registration successful!", "success");
      navigate("/login");
    } catch (error) {
      showToast("Registration failed!", "error");
    }
  };

  return (
    <div className="register-container">
      {toast && (
        <div className={"toast toast-" + toast.type}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
          </div>
          <p>{toast.message}</p>
        </div>
      )}
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <select name="role" onChange={handleChange}>
          <option value="apprenant">Apprenant</option>
          <option value="formateur">Formateur</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
