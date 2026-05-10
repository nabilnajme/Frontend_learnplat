import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/formateur.css";
import img1 from "./assests/exit.png";

function FormateurDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get(API + "/formateur/stats", { headers })
      .then((res) => setStats(res.data));
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
        {/* WELCOME */}
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

        {/* STAT CARDS */}
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

        {/* PLATFORM INFO SECTIONS */}
        {/* <div className="f-info-row">
          <div className="f-info-card">
            <div className="f-info-icon">🎯</div>
            <h3>Publiez vos cours</h3>
            <p>
              Créez un cours, ajoutez des chapitres et des quiz, puis publiez-le
              pour que vos apprenants puissent s'y inscrire.
            </p>
          </div>
          <div className="f-info-card">
            <div className="f-info-icon">📊</div>
            <h3>Suivez la progression</h3>
            <p>
              Consultez combien d'apprenants sont inscrits à chacun de vos cours
              et suivez leur engagement.
            </p>
          </div>
          <div className="f-info-card">
            <div className="f-info-icon">🧩</div>
            <h3>Créez des quiz</h3>
            <p>
              Ajoutez des quiz interactifs à vos cours pour évaluer la
              compréhension de vos apprenants à chaque étape.
            </p>
          </div>
        </div> */}
      </main>
    </div>
  );
}

export default FormateurDashboard;
