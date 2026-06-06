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
  const user = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);
  const [toast, setToast] = useState(null);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    axios
      .get(API + `/courses/${id}/preview`, { headers })
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
    if (!course.formateur || !course.formateur.phone) return;

    const whatsappPhone = "212" + course.formateur.phone.slice(1);
    const message = `Bonjour, je veux plus d'informations sur votre cours: ${course.title}`;
    window.open(
      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  }

  async function addComment(e) {
    e.preventDefault();

    if (comment.trim() === "") {
      setCommentError("Ecris un commentaire avant de publier.");
      return;
    }

    try {
      const res = await axios.post(
        API + `/courses/${id}/comments`,
        { comment },
        { headers },
      );

      setCourse({
        ...course,
        comments: [res.data, ...(course.comments || [])],
      });
      setComment("");
      setCommentError("");
    } catch (err) {
      setCommentError(
        err.response && err.response.data
          ? err.response.data.message
          : "Inscris-toi pour commenter ce cours.",
      );
    }
  }

  async function deleteComment(commentId) {
    try {
      await axios.delete(API + `/comments/${commentId}`, { headers });

      setCourse({
        ...course,
        comments: (course.comments || []).filter(
          (item) => item.id !== commentId && item.parent_id !== commentId,
        ),
      });
    } catch (_) {
      setCommentError("Erreur lors de la suppression du commentaire.");
    }
  }

  if (!course) return <div className="preview-loading">Chargement...</div>;

  const firstChapter = course.chapters[0];
  const mainComments = (course.comments || []).filter((item) => !item.parent_id);

  function getReplies(commentId) {
    return (course.comments || []).filter((item) => item.parent_id === commentId);
  }

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
            <strong>{course.formateur ? course.formateur.name : "—"}</strong>
          </div>

          <div className="preview-actions">
            <button className="preview-enroll" onClick={handleEnroll}>
              Enroll now
            </button>
            {course.formateur && course.formateur.phone && (
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
            <span>{course.chapters_count}</span>
            <p>Chapitres</p>
          </div>
          <div className="preview-stat">
            <span>{course.quizzes_count}</span>
            <p>Quiz</p>
          </div>
          <div className="preview-note">
            Inscrivez-vous pour acceder au contenu complet du cours.
          </div>
        </div>
      </div>

      <div className="preview-comments preview-card">
        <div className="preview-comments-head">
          <div>
            <h2>Commentaires</h2>
            <p>Regarde les avis des apprenants sur ce cours.</p>
          </div>
          <span>{mainComments.length}</span>
        </div>

        {course.is_enrolled ? (
          <form className="preview-comment-form" onSubmit={addComment}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ecrire un commentaire..."
            ></textarea>
            {commentError && <p className="preview-comment-error">{commentError}</p>}
            <button type="submit">Publier</button>
          </form>
        ) : (
          <div className="preview-comment-locked">
            Inscris-toi au cours pour pouvoir ajouter un commentaire.
          </div>
        )}

        <div className="preview-comments-list">
          {mainComments.length === 0 ? (
            <p className="preview-empty">Aucun commentaire pour le moment.</p>
          ) : (
            mainComments.map((item) => (
              <div className="preview-comment" key={item.id}>
                <div className="preview-comment-avatar">
                  {item.user ? item.user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="preview-comment-body">
                  <div className="preview-comment-top">
                    <strong>{item.user ? item.user.name : "Apprenant"}</strong>
                    <div className="preview-comment-actions">
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      {item.user_id === user.id && (
                        <button onClick={() => deleteComment(item.id)}>
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                  <p>{item.comment}</p>

                  {getReplies(item.id).map((reply) => (
                    <div className="preview-reply" key={reply.id}>
                      <div className="preview-reply-top">
                        <small>Reponse formateur</small>
                        {reply.user_id === user.id && (
                          <button onClick={() => deleteComment(reply.id)}>
                            Supprimer
                          </button>
                        )}
                      </div>
                      <p>{reply.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
