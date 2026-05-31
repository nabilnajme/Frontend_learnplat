import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/formateur.css";
import img2 from "./assests/course.png";
import img3 from "./assests/chapter.png";

function FormateurDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [stats, setStats] = useState({
    total_courses: "—",
    total_students: "—",
    published: "—",
    draft: "—",
  });

  const [latest, setLatest] = useState({ courses: [], chapters: [] });
  const [showPhonePopup, setShowPhonePopup] = useState(
    user.role === "formateur" && !user.phone,
  );
  const [phone, setPhone] = useState("");

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

  async function handleSavePhone(e) {
    e.preventDefault();

    const res = await axios.put(
      API + "/dashboard/apprenant/profile",
      { name: user.name, email: user.email, phone: phone },
      { headers },
    );

    localStorage.setItem("user", JSON.stringify(res.data));
    setShowPhonePopup(false);
  }

  return (
    <div className="layout">
      {showPhonePopup && (
        <div className="phone-popup-bg">
          <form className="phone-popup" onSubmit={handleSavePhone}>
            <h2>Ajouter votre numero</h2>
            <p>Les apprenants pourront vous contacter sur WhatsApp.</p>
            <input
              type="text"
              placeholder="Ex: 212612345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button type="submit">Enregistrer</button>
          </form>
        </div>
      )}
      <nav className="sidebar formateur-sidebar">
        <div className="sidebar__brand">
          <span>C</span>
          <strong>oursera</strong>
        </div>

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
            <div className="star-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                version="1.1"
                style={{
                  shapeRendering: "geometricPrecision",
                  textRendering: "geometricPrecision",
                  imageRendering: "optimizeQuality",
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
                viewBox="0 0 784.11 815.53"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g id="Layer_x0020_1">
                  <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                  <path
                    className="fil0"
                    d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="star-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                version="1.1"
                style={{
                  shapeRendering: "geometricPrecision",
                  textRendering: "geometricPrecision",
                  imageRendering: "optimizeQuality",
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
                viewBox="0 0 784.11 815.53"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g id="Layer_x0020_1">
                  <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                  <path
                    className="fil0"
                    d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="star-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                version="1.1"
                style={{
                  shapeRendering: "geometricPrecision",
                  textRendering: "geometricPrecision",
                  imageRendering: "optimizeQuality",
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
                viewBox="0 0 784.11 815.53"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g id="Layer_x0020_1">
                  <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                  <path
                    className="fil0"
                    d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="star-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                version="1.1"
                style={{
                  shapeRendering: "geometricPrecision",
                  textRendering: "geometricPrecision",
                  imageRendering: "optimizeQuality",
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
                viewBox="0 0 784.11 815.53"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g id="Layer_x0020_1">
                  <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                  <path
                    className="fil0"
                    d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="star-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                version="1.1"
                style={{
                  shapeRendering: "geometricPrecision",
                  textRendering: "geometricPrecision",
                  imageRendering: "optimizeQuality",
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
                viewBox="0 0 784.11 815.53"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g id="Layer_x0020_1">
                  <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                  <path
                    className="fil0"
                    d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  ></path>
                </g>
              </svg>
            </div>
            <div className="star-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                version="1.1"
                style={{
                  shapeRendering: "geometricPrecision",
                  textRendering: "geometricPrecision",
                  imageRendering: "optimizeQuality",
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                }}
                viewBox="0 0 784.11 815.53"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g id="Layer_x0020_1">
                  <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                  <path
                    className="fil0"
                    d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  ></path>
                </g>
              </svg>
            </div>
          </button>
        </div>

        {/*============================ STAT CARDS=================== */}
        <div className="f-stats">
          <div className="f-stat-card f-stat-blue">
            <p className="f-stat-label">Cours créés</p>
            <p className="f-stat-num">{stats.total_courses}</p>
            <p className="f-stat-hint">au total</p>
          </div>
          <div className="f-stat-card f-stat-green">
            <p className="f-stat-label">Apprenants</p>
            <p className="f-stat-num">{stats.total_students}</p>
            <p className="f-stat-hint">inscrits à vos cours</p>
          </div>
          <div className="f-stat-card f-stat-indigo">
            <p className="f-stat-label">Publiés</p>
            <p className="f-stat-num">{stats.published}</p>
            <p className="f-stat-hint">cours visibles</p>
          </div>
          <div className="f-stat-card f-stat-amber">
            <p className="f-stat-label">Brouillons</p>
            <p className="f-stat-num">{stats.draft}</p>
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
                        {chapter.course ? chapter.course.title : "—"}
                      </p>
                    </div>
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
