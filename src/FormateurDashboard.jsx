import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/formateur.css";
import img1 from "./assests/exit.png";
import img2 from "./assests/course.png";
import img3 from "./assests/chapter.png";

function FormateurDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [stats, setStats] = useState(null);

  const [latest, setLatest] = useState({ courses: [], chapters: [] });

  useEffect(() => {
    axios
      .get(API + "/formateur/stats", { headers })
      .then((res) => setStats(res.data));
    axios
      .get(API + "/formateur/latest", { headers })
      .then((res) => setLatest(res.data));
  }, []);

  async function handleLogout() {
    await axios.post(API + "/logout", {}, { headers });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar__brand">EduLearn</div>

        <ul className="sidebar__links">
          <li>
            <NavLink to="/dashboard/formateur" className="link">
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/formateur/courses" className="link">
              Mes cours
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/formateur/profile" className="link">
              My profile
            </NavLink>
          </li>
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
            <img className="img-exit" src={img1} alt="exit" />
          </button>
        </div>
      </nav>

      <main className="f-main">
        {/*======================================================== WELCOME =============================*/}
        <div className="f-welcome">
          <div>
            <h1>Bonjour, Our Dear {user.name} </h1>
            <p>Gérez vos cours et suivez vos apprenants.</p>
          </div>
          <button
            className="f-create-btn"
            onClick={() => navigate("/dashboard/formateur/create")}
          >
            Create course
          </button>
        </div>

        {/*============================ STAT CARDS=================== */}
        <div className="f-stats">
          <div className="f-stat-card f-stat-blue">
            <p className="f-stat-label">Cours créés</p>
            <p className="f-stat-num">{stats?.total_courses ?? "—"}</p>
            <p className="f-stat-hint">au total</p>
          </div>
          <div className="f-stat-card f-stat-green">
            <p className="f-stat-label">Apprenants</p>
            <p className="f-stat-num">{stats?.total_students ?? "—"}</p>
            <p className="f-stat-hint">inscrits à vos cours</p>
          </div>
          <div className="f-stat-card f-stat-indigo">
            <p className="f-stat-label">Publiés</p>
            <p className="f-stat-num">{stats?.published ?? "—"}</p>
            <p className="f-stat-hint">cours visibles</p>
          </div>
          <div className="f-stat-card f-stat-amber">
            <p className="f-stat-label">Brouillons</p>
            <p className="f-stat-num">{stats?.draft ?? "—"}</p>
            <p className="f-stat-hint">cours en attente</p>
          </div>
        </div>

        {/* ============ LATEST ACTIVITY ============ */}
        <div className="f-latest-wrap">
          <p className="f-latest-label">Activité récente</p>
          <p className="f-latest-sub">
            Les derniers contenus que vous avez ajoutés.
          </p>

          <div className="f-latest-grid">
            {/* --- Derniers cours --- */}
            <div className="f-lcard">
              <div className="f-lcard-head">
                <div>
                  <div className="section_header">
                    <img src={img2} alt="course" className="cours_img" />

                    <p className="f-lcard-title">Derniers cours</p>
                  </div>

                  <p className="f-lcard-hint">
                    {latest.courses.length} cours récents
                  </p>
                </div>
              </div>

              {latest.courses.length === 0 ? (
                <p className="f-lempty">Aucun cours pour l'instant.</p>
              ) : (
                latest.courses.map((course) => (
                  <div className="f-lrow" key={course.id}>
                    <div className="f-linitials f-lin-blue">
                      {course.title.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="f-lrow-info">
                      <p className="f-lrow-name">{course.title}</p>
                      <p className="f-lrow-meta">
                        {course.chapters.length ?? 0} chapitres ·{" "}
                        {course.quizzes.length ?? 0} quiz
                      </p>
                    </div>
                    <span
                      className={`f-lbadge ${course.is_published ? "f-lb-green" : "f-lb-amber"}`}
                    >
                      {course.is_published ? "Publié" : "Brouillon"}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* --- Derniers chapitres --- */}
            <div className="f-lcard">
              <div className="f-lcard-head">
                <div>
                  <div className="section_header">
                    <img src={img3} alt="chapitre" className="cours_img" />

                    <p className="f-lcard-title">Derniers chapitres</p>
                  </div>
                  <p className="f-lcard-hint">
                    {latest.chapters.length} chapitres récents
                  </p>
                </div>
              </div>

              {latest.chapters.length === 0 ? (
                <p className="f-lempty">Aucun chapitre pour l'instant.</p>
              ) : (
                latest.chapters.map((chapter, i) => (
                  <div className="f-lrow" key={chapter.id}>
                    <div className="f-linitials f-lin-purple">C{i + 1}</div>
                    <div className="f-lrow-info">
                      <p className="f-lrow-name">{chapter.title}</p>
                      <p className="f-lrow-meta">
                        {chapter.course?.title ?? "—"}
                      </p>
                    </div>
                    <span className="f-lbadge f-lb-blue">Cours lié</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FormateurDashboard;
