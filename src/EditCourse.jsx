import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/studio.css";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios.get(API + `/courses/${id}/details`, { headers }).then((res) => {
      setTitle(res.data.title);
      setDescription(res.data.description || "");
      setCategory(res.data.category || "");
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    await axios.put(
      API + `/courses/${id}`,
      { title, description, category },
      { headers },
    );
    setSuccess("✓ Cours mis à jour !");
    setTimeout(() => navigate(`/studio/${id}`), 1500);
  }

  return (
    <div className="edit-page">
      <button className="studio-back" onClick={() => navigate(`/studio/${id}`)}>
        ← Retour au studio
      </button>

      <div className="edit-card">
        <h1>Modifier le cours</h1>
        {success && <div className="edit-success">{success}</div>}

        <form onSubmit={handleSave}>
          <div className="studio-field">
            <label>Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="studio-field">
            <label>Catégorie</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="studio-field">
            <label>Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-add-chapter">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
