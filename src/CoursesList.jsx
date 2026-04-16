import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

import { API } from "./App";

export default function CoursesList() {
  const [enrollments, setEnrollments] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const headers = { Authorization: `Bearer ${token}` };

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

  useEffect(() => {
    axios
      .get(API + "/dashboard/apprenant/enroll/enrollments", { headers })
      .then((res) => setEnrollments(res.data));
  }, []);

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar__brand">EduLearn</div>

        <ul className="sidebar__links">
          <li>
            <NavLink to="/dashboard/apprenant" className="link" end>
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/apprenant/enrollments" className="link" end>
              My courses
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/apprenant/profile" className="link" end>
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
        <h1>Mes cours</h1>
        <p className="page-subtitle">Les cours auxquels vous êtes inscrit</p>

        {enrollments.length === 0 ? (
          <p className="empty">
            Vous n'êtes inscrit à aucun cours pour l'instant.
          </p>
        ) : (
          <div className="courses-grid">
            {enrollments.map((enrollment) => (
              <div className="course-card" key={enrollment.id}>
                <h2>{enrollment.title}</h2>
                <p>{enrollment.description}</p>
                <div className="card-footer">
                  <span>Par {enrollment.formateur.name}</span>
                  <NavLink
                    to={`/courses/${enrollment.id}/details`}
                    className="details-link"
                  >
                    Voir détails <span className="arrow">→</span>
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
