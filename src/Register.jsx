import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API } from "./App";
import "./css/register.css";
import "./css/auth.css";

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
    <div className="auth-page">
      {toast && (
        <div className={"toast toast-" + toast.type}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
          </div>
          <p>{toast.message}</p>
        </div>
      )}
      <header className="auth-header">
        <Link to="/" className="auth-logo">
          Cour<span>sera</span>
        </Link>
        <div className="auth-header-links">
          <Link to="/">Home</Link>
          <Link to="/login" className="auth-header-btn">
            Login
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <section className="auth-text">
          <p className="auth-small-title">Start today</p>
          <h1>Create your account and enter the platform.</h1>
          <p>
            Join as an apprenant to learn courses or as a formateur to publish
            your own content.
          </p>
        </section>

        <section className="auth-card">
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <p className="auth-form-subtitle">Choose your role and sign up.</p>

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
            <p className="auth-form-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </form>
        </section>
      </main>

      <footer className="auth-footer">
        <h2>
          Cour<span>sera</span>
        </h2>
        <p>Learn smarter, grow faster.</p>
        <p className="auth-copy">Copyright 2026 Coursera. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Register;
