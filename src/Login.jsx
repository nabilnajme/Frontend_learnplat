import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API } from "./App";
import "./css/login.css";
import "./css/auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API + "/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "apprenant") navigate("/dashboard/apprenant");
      else if (role === "formateur") navigate("/dashboard/formateur");
      else navigate("/dashboard/admin");
    } catch (error) {
      showToast("Email or password incorrect", "error");
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
          <Link to="/register" className="auth-header-btn">
            Create account
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <section className="auth-text">
          <p className="auth-small-title">Welcome back</p>
          <h1>Continue your learning journey.</h1>
          <p>
            Login to see your courses, chapters, quiz results, comments, and
            progress in one place.
          </p>
        </section>

        <section className="auth-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <p className="auth-form-subtitle">Enter your account information.</p>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            <p className="auth-form-link">
              No account yet? <Link to="/register">Register here</Link>
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

export default Login;
