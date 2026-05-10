import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/formateur.css";
import img1 from "./assests/exit.png";
import img2 from "./assests/teach.png";

function FormateurCourses() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get(API + "/formateur/courses", { headers })
      .then((res) => setCourses(res.data));
  }, []);

  async function handleLogout() {
    await axios.post(API + "/logout", {}, { headers });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function handlePublish(id) {
    await axios.put(API + `/courses/${id}/publish`, {}, { headers });
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, is_published: 1 } : c)),
    );
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar__brand">EduLearn</div>

        <ul className="sidebar__links">
          <li>
            <NavLink to="/dashboard/formateur" className="link" end>
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
        <div className="f-welcome">
          <div>
            <h1>Mes cours</h1>
            <p>Tous les cours que vous avez créés</p>
          </div>
          <button
            className="f-create-btn"
            onClick={() => navigate("/dashboard/formateur/create")}
          >
            Create course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="f-empty">
            <img className="img-warning" src={img2} alt="teach" />
            <p>Vous n'avez pas encore créé de cours.</p>
          </div>
        ) : (
          <div className="f-courses-list">
            {courses.map((course) => (
              <div
                className="f-course-row"
                key={course.id}
                onClick={() => navigate(`/studio/${course.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="f-course-icon">
                  {course.title.charAt(0).toUpperCase()}
                </div>
                <div className="f-course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description || "Pas de description."}</p>
                  <span className="f-course-students">
                    👤 {course.enrollments_count} apprenant
                    {course.enrollments_count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="f-course-actions">
                  {course.is_published ? (
                    <span className="f-badge-published">✓ Publié</span>
                  ) : (
                    <>
                      <span className="f-badge-draft">Brouillon</span>
                      <button
                        className="f-publish-btn"
                        onClick={() => handlePublish(course.id)}
                      >
                        Publier
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default FormateurCourses;
