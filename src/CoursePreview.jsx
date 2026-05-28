import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import { courseImage } from "./helpers";
import "./css/coursepreview.css";

export default function CoursePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [course, setCourse] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    axios
      .get(API + `/courses/${id}/details`, { headers })
      .then((res) => setCourse(res.data));
  }, [id]);

  async function handleEnroll() {
    try {
      await axios.post(
        API + `/dashboard/apprenant/enroll/${id}`,
        {},
        { headers },
      );
      showToast("Inscription reussie !", "success");
      setTimeout(() => navigate(`/courses/${id}/details`), 900);
    } catch (_) {
      showToast("Vous etes deja inscrit a ce cours.", "error");
    }
  }

  function contactFormateur() {
    if (!course.formateur?.phone) return;

    const cleanPhone = course.formateur.phone.replace(/\D/g, "");
    const message = `Bonjour, je veux plus d'informations sur votre cours: ${course.title}`;
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  }

  if (!course) return <div className="preview-loading">Chargement...</div>;

  const firstChapter = course.chapters[0];

  return (
    <div className="preview-page">
      {toast && (
        <div className={"toast toast-" + toast.type}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
          </div>
          <p>{toast.message}</p>
        </div>
      )}

      <button className="preview-back" onClick={() => navigate(-1)}>
        Retour
      </button>

      <div className="preview-hero">
        <div className="preview-media">
          {course.image ? (
            <img src={courseImage(course.image)} alt={course.title} />
          ) : (
            <div className="preview-placeholder">
              {course.title.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="preview-info">
          <span className="preview-category">
            {course.category || "Cours"}
          </span>
          <h1>{course.title}</h1>
          <p>{course.description || "Pas de description."}</p>

          <div className="preview-teacher">
            <span>Formateur</span>
            <strong>{course.formateur?.name}</strong>
          </div>

          <div className="preview-actions">
            <button className="preview-enroll" onClick={handleEnroll}>
              Enroll now
            </button>
            {course.formateur?.phone && (
              <button className="preview-contact" onClick={contactFormateur}>
                WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="preview-grid">
        <div className="preview-card">
          <h2>Premier chapitre</h2>
          {firstChapter ? (
            <>
              <h3>{firstChapter.title}</h3>
              <p>{firstChapter.content || "Ce chapitre n'a pas encore de texte."}</p>
            </>
          ) : (
            <p>Aucun chapitre disponible pour le moment.</p>
          )}
        </div>

        <div className="preview-card preview-small">
          <h2>Apercu rapide</h2>
          <div className="preview-stat">
            <span>{course.chapters.length}</span>
            <p>Chapitres</p>
          </div>
          <div className="preview-stat">
            <span>{course.quizzes.length}</span>
            <p>Quiz</p>
          </div>
          <div className="preview-note">
            Inscrivez-vous pour acceder au contenu complet du cours.
          </div>
        </div>
      </div>
    </div>
  );
}
