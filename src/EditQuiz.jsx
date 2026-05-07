import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/studio.css";

export default function EditQuiz() {
  const { id } = useParams(); // quiz id
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios.get(API + `/quizzes/${id}/questions`, { headers }).then((res) => {
      setTitle(res.data.title);
      setDuration(res.data.duration_minutes);
      setCourseId(res.data.course_id);
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    await axios.put(
      API + `/quizzes/${id}`,
      { title, duration_minutes: duration },
      { headers },
    );
    setSuccess("✓ Quiz mis à jour !");
    setTimeout(() => navigate(`/studio/${courseId}`), 1500);
  }

  return (
    <div className="edit-page">
      <button className="studio-back" onClick={() => navigate(-1)}>
        ← Retour au studio
      </button>
      <div className="edit-card">
        <h1>Modifier le quiz</h1>
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
            <label>Durée (minutes)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
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
