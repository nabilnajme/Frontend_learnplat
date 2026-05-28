import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "./App";
import "./css/login.css";

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
    <div className="login-container">
      {toast && (
        <div className={"toast toast-" + toast.type}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
          </div>
          <p>{toast.message}</p>
        </div>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
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
      </form>
    </div>
  );
}

export default Login;
