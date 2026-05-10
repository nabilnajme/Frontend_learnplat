import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/studio.css";
import img1 from "./assests/edit_chapter.png";

export default function EditChapter() {
  const { id } = useParams(); // chapter id
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios.get(API + `/chapters/${id}`, { headers }).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content || "");
      setCourseId(res.data.course_id);
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    await axios.put(API + `/chapters/${id}`, { title, content }, { headers });
    setSuccess("✓ Chapitre mis à jour !");
    setTimeout(() => navigate(`/studio/${courseId}`), 1500);
  }

  return (
    <div className="edit-page">
      <button className="studio-back" onClick={() => navigate(-1)}>
        ← Retour au studio
      </button>

      <div className="edit-card">
        <h1>Modifier le chapitre</h1>
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
            <label>Contenu</label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-add-chapter">
            Enregistrer
          </button>
        </form>
      </div>

      <div className="panels-container">
        <div className="panel-chapter right-panel-chapter">
          <div className="content-chapter">
            <h3>Edit Your Chapitre</h3>
          </div>
          <img src={img1} className="image-chapter" alt="" />
        </div>
      </div>
    </div>
  );
}
