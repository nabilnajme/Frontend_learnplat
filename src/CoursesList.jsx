import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { API } from "./App";
import { courseImage } from "./helpers";

export default function CoursesList() {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredEnrollments = enrollments.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="layout">
      <nav className="sidebar apprenant-sidebar">
        <div className="sidebar__brand">
          <span>C</span>
          <strong>oursera</strong>
        </div>

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
            <NavLink to="/my-results" className="link ">
              My results
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/apprenant/profile" className="link" end>
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
        <h1>Mes cours</h1>
        <p className="page-subtitle">Les cours auxquels vous êtes inscrit</p>

        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search your enrolled courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {enrollments.length === 0 ? (
          <p className="empty">
            Vous n'êtes inscrit à aucun cours pour l'instant.
          </p>
        ) : filteredEnrollments.length === 0 ? (
          <p className="empty">Aucun cours trouve avec ce nom.</p>
        ) : (
          <div className="courses-grid">
            {filteredEnrollments.map((enrollment) => (
              <NavLink
                to={`/courses/${enrollment.id}/details`}
                className="details-link"
              >
                <div className="course-card" key={enrollment.id}>
                  {enrollment.image ? (
                    <img
                      src={courseImage(enrollment.image)}
                      alt={enrollment.title}
                      className="course-card-img"
                    />
                  ) : (
                    <div className="course-card-img-placeholder">
                      {enrollment.title.charAt(0).toUpperCase()}
                    </div>
                  )}
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
              </NavLink>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
