import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/admin.css";
import img1 from "./assests/acceuil.png";
import img2 from "./assests/team.png";
import img3 from "./assests/course1.png";
import img4 from "./assests/user-empty.png";
import img5 from "./assests/graduated.png";
import img6 from "./assests/teacher.png";
import img7 from "./assests/check.png";
import img8 from "./assests/list.png";
import img9 from "./assests/puzzle.png";
import img10 from "./assests/cup.png";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [stats, setStats] = useState({
    total_users: "—",
    total_apprenants: "—",
    total_formateurs: "—",
    total_courses: "—",
    published_courses: "—",
    total_enrollments: "—",
    total_quizzes: "—",
    total_comments: "—",
  });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState("accueil"); // accueil | users | courses | comments

  useEffect(() => {
    axios.get(API + "/admin/stats", { headers }).then((r) => setStats(r.data));
    axios.get(API + "/admin/users", { headers }).then((r) => setUsers(r.data));
    axios
      .get(API + "/admin/courses", { headers })
      .then((r) => setCourses(r.data));
    axios
      .get(API + "/admin/comments", { headers })
      .then((r) => setComments(r.data));
  }, []);

  async function handleLogout() {
    await axios.post(API + "/logout", {}, { headers });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    await axios.delete(API + `/admin/users/${id}`, { headers });
    setUsers(users.filter((u) => u.id !== id));
  }

  async function handleDeleteCourse(id) {
    if (!window.confirm("Supprimer ce cours ?")) return;
    await axios.delete(API + `/admin/courses/${id}`, { headers });
    setCourses(courses.filter((c) => c.id !== id));
  }

  async function handleDeleteComment(id) {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    await axios.delete(API + `/admin/comments/${id}`, { headers });
    setComments(comments.filter((c) => c.id !== id && c.parent_id !== id));
  }

  return (
    <div className="ad-layout">
      {/* ---- SIDEBAR ---- */}
      <nav className="ad-sidebar">
        <div className="ad-brand">
          <div className="ad-brand-icon">C</div>
          <span>oursera</span>
        </div>

        <ul className="ad-links">
          <li>
            <button
              className={"ad-link" + (page === "accueil" ? " active" : "")}
              onClick={() => setPage("accueil")}
            >
              <img src={img1} className="ad-link-icon" alt="acceuil" />
              Acceuil
            </button>
          </li>
          <li>
            <button
              className={"ad-link" + (page === "users" ? " active" : "")}
              onClick={() => setPage("users")}
            >
              <img src={img2} className="ad-link-icon" alt="users" />
              Utilisateurs
            </button>
          </li>
          <li>
            <button
              className={"ad-link" + (page === "courses" ? " active" : "")}
              onClick={() => setPage("courses")}
            >
              <img src={img3} className="ad-link-icon" alt="courses" /> Cours
            </button>
          </li>
          <li>
            <button
              className={"ad-link" + (page === "comments" ? " active" : "")}
              onClick={() => setPage("comments")}
            >
              <img src={img8} className="ad-link-icon" alt="comments" />
              Commentaires
            </button>
          </li>
        </ul>

        <div className="ad-sidebar-bottom">
          <div className="ad-user-info">
            <div className="ad-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <p className="ad-username">{user.name}</p>
              <p className="ad-role">Administrateur</p>
            </div>
          </div>
          <button
            className="ad-logout"
            onClick={handleLogout}
            title="Déconnexion"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ---- MAIN ---- */}
      <main className="ad-main">
        {/* ======= ACCUEIL ======= */}
        {page === "accueil" && (
          <div>
            <div className="ad-page-header">
              <h1>Vue d'ensemble</h1>
              <p>Bienvenue sur le tableau de bord administrateur</p>
            </div>

            {/* stat cards */}
            <div className="ad-stats">
              <div
                className="ad-stat-card"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                }}
              >
                <img src={img4} className="ad-link-icon" alt="user_main" />

                <p className="ad-stat-num">{stats.total_users}</p>
                <p className="ad-stat-label">Utilisateurs</p>
              </div>
              <div
                className="ad-stat-card"
                style={{
                  background: "linear-gradient(135deg, #0d2b1f, #1a6636)",
                }}
              >
                <img src={img5} className="ad-link-icon" alt="students" />
                <p className="ad-stat-num">{stats.total_apprenants}</p>
                <p className="ad-stat-label">Apprenants</p>
              </div>
              <div
                className="ad-stat-card"
                style={{
                  background: "linear-gradient(135deg, #0f1f45, #1a3570)",
                }}
              >
                <img src={img6} className="ad-link-icon" alt="teacher" />{" "}
                <p className="ad-stat-num">{stats.total_formateurs}</p>
                <p className="ad-stat-label">Formateurs</p>
              </div>
              <div
                className="ad-stat-card"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                }}
              >
                <img src={img3} className="ad-link-icon" alt="courses" />{" "}
                <p className="ad-stat-num">{stats.total_courses}</p>
                <p className="ad-stat-label">Cours totaux</p>
              </div>
              <div
                className="ad-stat-card"
                style={{
                  background: "linear-gradient(135deg, #9644e2, #87ddbe)",
                }}
              >
                <img src={img7} className="ad-link-icon" alt="valide" />{" "}
                <p className="ad-stat-num">{stats.published_courses}</p>
                <p className="ad-stat-label">Cours publiés</p>
              </div>
              <div
                className="ad-stat-card"
                style={{
                  background: "linear-gradient(135deg, #f43f5e, #fb7185)",
                }}
              >
                <img src={img8} className="ad-link-icon" alt="list" />{" "}
                <p className="ad-stat-num">{stats.total_enrollments}</p>
                <p className="ad-stat-label">Inscriptions</p>
              </div>
              <div
                className="ad-stat-card"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                }}
              >
                <img src={img9} className="ad-link-icon" alt="puzzle" />
                <p className="ad-stat-num">{stats.total_quizzes}</p>
                <p className="ad-stat-label">Quiz créés</p>
              </div>

              <div
                className="ad-stat-card"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #fb7185)",
                }}
              >
                <img src={img8} className="ad-link-icon" alt="comments" />{" "}
                <p className="ad-stat-num">{stats.total_comments}</p>
                <p className="ad-stat-label">Commentaires</p>
              </div>
            </div>

            {/* quick overview tables */}
            <div className="ad-overview-row">
              <div className="ad-overview-card">
                <h2>Derniers utilisateurs</h2>
                {users.slice(0, 5).map((u) => (
                  <div className="ad-overview-row-item" key={u.id}>
                    <div className="ad-mini-avatar">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="ad-overview-name">{u.name}</p>
                      <p className="ad-overview-sub">{u.email}</p>
                    </div>
                    <span className={"ad-role-badge ad-role-" + u.role}>
                      {u.role}
                    </span>
                  </div>
                ))}
                <button className="ad-see-all" onClick={() => setPage("users")}>
                  Voir tous →
                </button>
              </div>

              <div className="ad-overview-card">
                <h2>Derniers cours</h2>
                {courses.slice(0, 5).map((c) => (
                  <div className="ad-overview-row-item" key={c.id}>
                    <div className="ad-course-letter">
                      {c.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="ad-overview-name">{c.title}</p>
                      <p className="ad-overview-sub">
                        Par {c.formateur ? c.formateur.name : "—"} ·{" "}
                        {c.enrollments_count} inscrits
                      </p>
                    </div>
                    <span
                      className={
                        "ad-pub-badge " +
                        (c.is_published ? "pub-yes" : "pub-no")
                      }
                    >
                      {c.is_published ? "Publié" : "Brouillon"}
                    </span>
                  </div>
                ))}
                <button
                  className="ad-see-all"
                  onClick={() => setPage("courses")}
                >
                  Voir tous →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======= USERS PAGE ======= */}
        {page === "users" && (
          <div>
            <div className="ad-page-header">
              <h1>Utilisateurs</h1>
              <p>{users.length} utilisateurs inscrits sur la plateforme</p>
            </div>

            <div className="ad-table-card">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Inscrit le</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="ad-table-user">
                          <div className="ad-mini-avatar">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td className="ad-table-sub">{u.email}</td>
                      <td>
                        <span className={"ad-role-badge ad-role-" + u.role}>
                          {u.role}
                        </span>
                      </td>
                      <td className="ad-table-sub">
                        {new Date(u.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td>
                        <button
                          className="ad-delete-btn"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======= COURSES PAGE ======= */}
        {page === "courses" && (
          <div>
            <div className="ad-page-header">
              <h1>Cours</h1>
              <p>{courses.length} cours sur la plateforme</p>
            </div>

            <div className="ad-table-card">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Formateur</th>
                    <th>Inscrits</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="ad-table-user">
                          <div className="ad-course-letter">
                            {c.title.charAt(0).toUpperCase()}
                          </div>
                          {c.title}
                        </div>
                      </td>
                      <td className="ad-table-sub">
                        {c.formateur ? c.formateur.name : "—"}
                      </td>
                      <td className="ad-table-sub">{c.enrollments_count}</td>
                      <td>
                        <span
                          className={
                            "ad-pub-badge " +
                            (c.is_published ? "pub-yes" : "pub-no")
                          }
                        >
                          {c.is_published ? "Publié" : "Brouillon"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="ad-delete-btn"
                          onClick={() => handleDeleteCourse(c.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======= COMMENTS PAGE ======= */}
        {page === "comments" && (
          <div>
            <div className="ad-page-header">
              <h1>Commentaires</h1>
              <p>{comments.length} commentaires sur la plateforme</p>
            </div>

            <div className="ad-comments-list">
              {comments.length === 0 ? (
                <div className="ad-empty-box">
                  Aucun commentaire pour le moment.
                </div>
              ) : (
                comments.map((comment) => (
                  <div className="ad-comment-card" key={comment.id}>
                    <div className="ad-comment-top">
                      <div className="ad-table-user">
                        <div className="ad-mini-avatar">
                          {comment.user
                            ? comment.user.name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <div>
                          <p className="ad-comment-user">
                            {comment.user
                              ? comment.user.name
                              : "Utilisateur supprimé"}
                          </p>
                          <p className="ad-overview-sub">
                            {comment.course
                              ? comment.course.title
                              : "Cours supprimé"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={
                          "ad-role-badge ad-role-" +
                          (comment.user ? comment.user.role : "apprenant")
                        }
                      >
                        {comment.parent_id
                          ? "réponse"
                          : comment.user
                            ? comment.user.role
                            : "apprenant"}
                      </span>
                    </div>

                    <p className="ad-comment-text">{comment.comment}</p>

                    <div className="ad-comment-bottom">
                      <span>
                        {new Date(comment.created_at).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                      <button
                        className="ad-delete-btn"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
