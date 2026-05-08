import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/formateur.profile.css";
export default function FormateurProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function saveInfo(e) {
    e.preventDefault();
    try {
      const res = await axios.put(
        API + "/dashboard/apprenant/profile",
        { name, email },
        { headers },
      );
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("✓ Profil mis à jour avec succès !");
    } catch (_) {
      alert("Erreur lors de la mise à jour.");
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
      alert("✓ Mot de passe mis à jour !");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur.");
    }
  }
  return (
    <>
      <div className="fp-page">
        <button className="fp-back-btn" onClick={() => navigate(-1)}>
          ← Retour
        </button>

        <div className="fp-wrapper">
          {/* LEFT card */}
          <div className="fp-avatar-card">
            <div className="fp-avatar-initials">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="fp-avatar-name">{user.name}</h2>
            <span className="fp-avatar-role">{user.role}</span>
            <p className="fp-avatar-email">{user.email}</p>
          </div>

          {/* RIGHT forms */}
          <div className="fp-forms">
            <div className="fp-section">
              <h3>Informations personnelles</h3>

              <form onSubmit={saveInfo}>
                <div className="fp-field">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="fp-field">
                  <label>Adresse email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="fp-btn-save">
                  Enregistrer
                </button>
              </form>
            </div>

            <div className="fp-section">
              <h3>Changer le mot de passe</h3>

              <form onSubmit={savePassword}>
                <div className="fp-field">
                  <label>Mot de passe actuel</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="fp-field">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="fp-btn-save">
                  Mettre à jour
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
