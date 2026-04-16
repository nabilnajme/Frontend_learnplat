import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/formateur.css";

function FormateurDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    const token = localStorage.getItem("token");
    await axios.post(
      API + "/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="layout">
      <nav className="sidebar_form">
        <div className="sidebar__brand">EduLearn</div>

        <ul className="sidebar__links">
          <li>
            <NavLink
              to="/dashboard/formateur"
              className={({ isActive }) => (isActive ? "link active" : "link")}
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/formateur/courses"
              className={({ isActive }) => (isActive ? "link active" : "link")}
            >
              My courses
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/creer-quiz"
              className={({ isActive }) => (isActive ? "link active" : "link")}
            >
              Créer quiz
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/manage-students"
              className={({ isActive }) => (isActive ? "link active" : "link")}
            >
              Manage Students
            </NavLink>
          </li> */}
        </ul>

        <div className="sidebar__bottom">
          <button
            className="profile-btn"
            onClick={() => navigate("/dashboard/formateur/profile")}
          >
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <p className="username">{user.name}</p>
              <p className="role">formateur</p>
            </div>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            ⇥
          </button>
        </div>
      </nav>

      <main className="main">
        <h1>Bienvenue, {user.name} </h1>
        <p>Tableau de bord — Formateur</p>
      </main>
    </div>
  );
}

export default FormateurDashboard;
