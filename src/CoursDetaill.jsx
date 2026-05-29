import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import { chapterFile } from "./helpers";
import "./css/coursdetaill.css";

import img1 from "./assests/time.png";
import img2 from "./assests/play.png";

export default function CoursDetaill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const user = JSON.parse(localStorage.getItem("user"));
  const [course, setCourse] = useState(null);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replyError, setReplyError] = useState("");
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    axios
      .get(API + `/courses/${id}/details`, { headers })
      .then((res) => setCourse(res.data));
  }, [id]);

  if (!course) return <div className="detail-loading">Chargement...</div>;

  function contactFormateur() {
    if (!course.formateur || !course.formateur.phone) return;

    const cleanPhone = course.formateur.phone.replace(/\D/g, "");
    const message = `Bonjour, je suis un etudiant dans votre cours: ${course.title}`;
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
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
          : "Erreur lors de l'ajout du commentaire.",
      );
    }
  }

  async function addReply(e, commentId) {
    e.preventDefault();

    if (!replyText[commentId] || replyText[commentId].trim() === "") {
      setReplyError("Ecris une reponse avant de publier.");
      return;
    }

    try {
      const res = await axios.post(
        API + `/courses/${id}/comments`,
        { comment: replyText[commentId], parent_id: commentId },
        { headers },
      );

      setCourse({
        ...course,
        comments: [res.data, ...(course.comments || [])],
      });
      setReplyText({ ...replyText, [commentId]: "" });
      setReplyError("");
    } catch (err) {
      setReplyError(
        err.response && err.response.data
          ? err.response.data.message
          : "Erreur lors de l'ajout de la reponse.",
      );
    }
  }

  async function markChapterDone(chapterId) {
    try {
      await axios.post(API + `/chapters/${chapterId}/complete`, {}, { headers });

      setCourse({
        ...course,
        completed_chapters: [...(course.completed_chapters || []), chapterId],
      });
      setProgressError("");
    } catch (err) {
      setProgressError(
        err.response && err.response.data
          ? err.response.data.message
          : "Erreur lors de la progression.",
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

  function isChapterDone(chapterId) {
    return (course.completed_chapters || []).includes(chapterId);
  }

  const completedCount = (course.completed_chapters || []).length;
  const totalChapters = course.chapters.length;
  const progressPercent =
    totalChapters === 0 ? 0 : Math.round((completedCount / totalChapters) * 100);

  const mainComments = (course.comments || []).filter((item) => !item.parent_id);
  const isCourseFormateur =
    user.role === "formateur" && course.formateur_id === user.id;

  function getReplies(commentId) {
    return (course.comments || []).filter((item) => item.parent_id === commentId);
  }

  return (
    <div className="detail-page">
      <div className="nav_details">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Retour
        </button>
        <div className="nav_link">
          <button
            className="profile_button"
            onClick={() =>
              navigate(
                user.role === "formateur"
                  ? "/dashboard/formateur/profile"
                  : "/dashboard/apprenant/profile",
              )
            }
          >
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          </button>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="hero-card">
        <div className="hero-top">
          <span className="hero-badge">Cours</span>
          <span className="hero-author">
            Par {course.formateur ? course.formateur.name : "—"}
          </span>
          {course.formateur && course.formateur.phone && (
            <button className="whatsapp-btn" onClick={contactFormateur}>
              Contacter
            </button>
          )}
        </div>
        <h1>{course.title}</h1>
        <p>{course.description || "Pas de description."}</p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-icon"></span>
            <span>{course.chapters.length} chapitres</span>
          </div>
          {user.role !== "formateur" && (
            <div className="stat">
              <span className="stat-icon"></span>
              <span>{progressPercent}% termine</span>
            </div>
          )}
          <div className="stat">
            <span className="stat-icon"></span>
            <span>
              {course.quizzes.length} quiz
              {course.quizzes.length > 1 ? "" : ""}
            </span>
          </div>
        </div>
      </div>
      <div className="detail-body">
        <div className="detail-left">
          {/* CHAPTERS */}
          <div className="section-card narrow-card">
            <div className="progress-head">
              <h2 className="section-title"> Chapitres</h2>
              {user.role !== "formateur" && (
                <span>
                  {completedCount}/{totalChapters} termines
                </span>
              )}
            </div>

            {user.role !== "formateur" && (
              <div className="course-progress">
                <div className="course-progress-bar">
                  <div style={{ width: progressPercent + "%" }}></div>
                </div>
                <p>{progressPercent}% du cours termine</p>
                {progressError && (
                  <p className="progress-error">{progressError}</p>
                )}
              </div>
            )}

            {course.chapters.length === 0 ? (
              <p className="empty-msg">Aucun chapitre disponible.</p>
            ) : (
              course.chapters.map((chapter) => (
                <div className="accordion" key={chapter.id}>
                  <input type="checkbox" id={`ch-${chapter.id}`} />
                  <label
                    className="accordion-header"
                    htmlFor={`ch-${chapter.id}`}
                  >
                    {chapter.title}
                  </label>
                  <div className="accordion-body">
                    <p>{chapter.content}</p>
                    {chapter.file_path && chapter.file_type === "pdf" && (
                      <a
                        className="chapter-file-link"
                        href={chapterFile(chapter.file_path)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ouvrir le PDF
                      </a>
                    )}
                    {chapter.file_path && chapter.file_type !== "pdf" && (
                      <video className="chapter-video" controls>
                        <source src={chapterFile(chapter.file_path)} />
                      </video>
                    )}
                    {user.role !== "formateur" && course.is_enrolled && (
                      <button
                        className={
                          isChapterDone(chapter.id)
                            ? "chapter-done-btn completed"
                            : "chapter-done-btn"
                        }
                        onClick={() => markChapterDone(chapter.id)}
                        disabled={isChapterDone(chapter.id)}
                      >
                        {isChapterDone(chapter.id)
                          ? "Termine"
                          : "Marquer comme termine"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* COMMENTS */}
          <div className="section-card comments-card">
            <div className="comments-head">
              <div>
                <h2 className="section-title comments-title">Commentaires</h2>
                <p>Partage ton avis sur ce cours.</p>
              </div>
              <span>{mainComments.length}</span>
            </div>

            {user.role !== "formateur" && (
              <form className="comment-form" onSubmit={addComment}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ecrire un commentaire..."
                ></textarea>
                {commentError && <p className="comment-error">{commentError}</p>}
                <button type="submit">Publier</button>
              </form>
            )}

            <div className="comments-list">
              {mainComments.length === 0 ? (
                <p className="empty-msg">Aucun commentaire pour le moment.</p>
              ) : (
                mainComments.map((item) => (
                  <div className="comment-item" key={item.id}>
                    <div className="comment-avatar">
                      {item.user
                        ? item.user.name.charAt(0).toUpperCase()
                        : "A"}
                    </div>
                    <div className="comment-content">
                      <div className="comment-top">
                        <strong>
                          {item.user ? item.user.name : "Apprenant"}
                        </strong>
                        <div className="comment-actions">
                          <span>
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          {item.user_id === user.id && (
                            <button onClick={() => deleteComment(item.id)}>
                              Supprimer
                            </button>
                          )}
                        </div>
                      </div>
                      <p>{item.comment}</p>

                      {getReplies(item.id).map((reply) => (
                        <div className="reply-item" key={reply.id}>
                          <div className="reply-top">
                            <div className="reply-label">Reponse formateur</div>
                            {reply.user_id === user.id && (
                              <button onClick={() => deleteComment(reply.id)}>
                                Supprimer
                              </button>
                            )}
                          </div>
                          <p>{reply.comment}</p>
                        </div>
                      ))}

                      {isCourseFormateur && (
                        <form
                          className="reply-form"
                          onSubmit={(e) => addReply(e, item.id)}
                        >
                          <input
                            type="text"
                            value={replyText[item.id] || ""}
                            onChange={(e) =>
                              setReplyText({
                                ...replyText,
                                [item.id]: e.target.value,
                              })
                            }
                            placeholder="Repondre a ce commentaire..."
                          />
                          <button type="submit">Repondre</button>
                        </form>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {replyError && <p className="comment-error">{replyError}</p>}
          </div>
        </div>

        {/* QUIZZES */}
        <div className="section-card quiz-one">
          <h2 className="section-title"> Quiz du cours</h2>
          {course.quizzes.length === 0 ? (
            <p className="empty-msg">Aucun quiz disponible.</p>
          ) : (
            course.quizzes.map((quiz, index) => (
              <div className="quiz-row" key={quiz.id}>
                <div className="quiz-left">
                  <div className="img_container">
                    <img src={img2} alt="play" className="play_img" />
                  </div>
                  <div>
                    <p className="quiz-title">{quiz.title}</p>
                    <div className="duration_section">
                      <img className="duration_img" src={img1} alt="time" />
                      <p className="quiz-duration">
                        {quiz.duration_minutes} min
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  className="quiz-btn"
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                >
                  Commencer
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
