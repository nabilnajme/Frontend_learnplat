import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/profil.css";

function Profil() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function saveInfo(e) {
    e.preventDefault();
    try {
      const res = await axios.put(
        API + "/dashboard/apprenant/profile",
        { name, email },
        { headers },
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      showToast("Profil mis a jour avec succes !", "success");
    } catch (_) {
      showToast("Erreur lors de la mise a jour.", "error");
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    try {
      await axios.put(
        API + "/dashboard/apprenant/profile/password",
        { current_password: currentPassword, new_password: newPassword },
        { headers },
      );
      showToast("Mot de passe mis a jour !", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur.", "error");
    }
  }

  return (
    <div className="profil-page">
      {toast && (
        <div className={"toast toast-" + toast.type}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
          </div>
          <p>{toast.message}</p>
        </div>
      )}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <div className="profil-wrapper">
        {/* LEFT card */}
        <div className="avatar-card">
          <div className="avatar-initials">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="avatar-name">{user.name}</h2>
          <span className="avatar-role">{user.role}</span>
          <p className="avatar-email">{user.email}</p>
        </div>

        {/* RIGHT forms */}
        <div className="profil-forms">
          <div className="profil-section">
            <h3>Informations personnelles</h3>

            <form onSubmit={saveInfo}>
              <div className="field">
                <label>Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-save">
                Enregistrer
              </button>
            </form>
          </div>

          <div className="profil-section">
            <h3>Changer le mot de passe</h3>

            <form onSubmit={savePassword}>
              <div className="field">
                <label>Mot de passe actuel</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-save">
                Mettre à jour
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil;
