import React from "react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/apprenant.css";

import { courseImage } from "./helpers";

function ApprenantDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

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
      showToast("Inscription reussie !", "success");
    } catch (_) {
      showToast("Vous etes deja inscrit a ce cours.", "error");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="layout">
      {toast && (
        <div className={"toast toast-" + toast.type}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
          </div>
          <p>{toast.message}</p>
        </div>
      )}
      <nav className="sidebar apprenant-sidebar">
        <div className="sidebar__brand">
          <span>C</span>
          <strong>oursera</strong>
        </div>

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
            <NavLink to="/my-results" className="link ">
              My results
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/apprenant/profile" className="link">
              Settings
            </NavLink>
          </li>
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
          <button className="logout-btn-modern" onClick={handleLogout}>
            <div className="logout-sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
            </div>
            <div className="logout-text">Exit</div>
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

        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search course by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {courses.length === 0 ? (
          <p className="empty">Aucun cours disponible pour l'instant.</p>
        ) : filteredCourses.length === 0 ? (
          <p className="empty">Aucun cours trouve avec ce nom.</p>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <div
                className="course-card"
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}/preview`)}
              >
                {course.image ? (
                  <img
                    src={courseImage(course.image)}
                    alt={course.title}
                    className="course-card-img"
                  />
                ) : (
                  <div className="course-card-img-placeholder">
                    {course.title.charAt(0).toUpperCase()}
                  </div>
                )}
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <div className="card-footer">
                  <span>Par {course.formateur.name}</span>
                  <button
                    type="button"
                    className="enroll-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnroll(course.id);
                    }}
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
