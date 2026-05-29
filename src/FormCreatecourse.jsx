import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/createcourse.css";

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
  const [image, setImage] = useState(null);

  const [success, setSuccess] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const handleCreate = async (e) => {
    e.preventDefault();

    // FormData because we have a file
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("category", form.category);
    if (image) data.append("image", image);

    try {
      await axios.post(API + "/courses", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("✓ Cours créé avec succès !");
      setForm({ title: "", description: "", category: "" });
      setImage(null);
      setTimeout(() => navigate("/dashboard/formateur/courses"), 2000);
    } catch (_) {
      showToast("Erreur lors de la creation.", "error");
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
      {toast && (
        <div className={"toast toast-" + toast.type}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
          </div>
          <p>{toast.message}</p>
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
              <label>Image du cours</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
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
