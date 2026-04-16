import React from "react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";

import "./css/apprenant.css";

function ApprenantDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const [test, setTest] = useState("");

  const [courses, setCourses] = useState([]);

  const token = localStorage.getItem("token");

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

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios
      .get(API + "/courses", { headers })
      .then((res) => setCourses(res.data));
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        API + `/dashboard/apprenant/enroll/${courseId}`,
        {},
        { headers },
      );
      alert("Inscription réussie !");
    } catch (_) {
      alert("vous avez deja inscris a cette cours");
    }
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar__brand">EduLearn</div>

        <ul className="sidebar__links">
          <li>
            <NavLink to="/dashboard/apprenant" className="link">
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/apprenant/enrollments" className="link">
              My courses
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/apprenant/profile" className="link">
              Settings
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/progression" className="link ">
              Ma progression
            </NavLink>
          </li> */}
        </ul>

        <div className="sidebar__bottom">
          <button
            className="profile-btn"
            onClick={() => navigate("/dashboard/apprenant/profile")}
          >
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <p className="username">{user.name}</p>
              <p className="role">apprenant</p>
            </div>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            ⇥
          </button>
        </div>
      </nav>

      <main className="main">
        <h1>Bienvenue, {user.name} </h1>
        <p>Tableau de bord — Apprenant</p>

        <h1>Cours disponibles</h1>
        <p className="page-subtitle">
          Découvrez tous les cours publiés par nos formateurs
        </p>

        {courses.length === 0 ? (
          <p className="empty">Aucun cours disponible pour l'instant.</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div className="course-card" key={course.id}>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <div className="card-footer">
                  <span>Par {course.formateur.name}</span>
                  <button
                    type="button"
                    className="enroll-btn"
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ApprenantDashboard;
