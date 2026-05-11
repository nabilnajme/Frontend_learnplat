import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/createcourse.css";
import img1 from "./assests/exit.png";

export default function FormCreatecourse() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [success, setSuccess] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API + "/courses", form, { headers });
      setSuccess("✓ Cours créé avec succès !");
      setForm({ title: "", description: "", category: "" });

      setTimeout(() => {
        (setSuccess(""), 3000);

        navigate("/dashboard/formateur/courses");
      });
    } catch (_) {
      alert("Erreur lors de la création.");
    }
  };

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

      <main className="main-content">
        <div className="page-header">
          <h1>Créer un nouveau cours</h1>
          <p>Remplissez les détails ci-dessous pour ajouter votre cours.</p>
        </div>
        {success && <div className="f-success">{success}</div>}

        <div className="f-form-card">
          <h2>Nouveau cours</h2>
          <form onSubmit={handleCreate}>
            <div className="f-field">
              <label>Titre</label>
              <input
                type="text"
                placeholder="Ex: Introduction à React"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="f-field">
              <label>Catégorie</label>
              <input
                type="text"
                placeholder="Ex: React, PHP, Design..."
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="f-field">
              <label>Description</label>
              <textarea
                placeholder="Décrivez votre cours..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <button type="submit" className="f-submit-btn">
              Créer le cours
            </button>
          </form>
        </div>

        <div className="animated_side">
          <h1>Create Course</h1>
        </div>
      </main>
    </div>
  );
}
