import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/coursdetaill.css";

export default function CoursDetaill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const user = JSON.parse(localStorage.getItem("user"));
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios
      .get(API + `/courses/${id}/details`, { headers })
      .then((res) => setCourse(res.data));
  }, [id]);

  if (!course) return <div className="detail-loading">Chargement...</div>;

  return (
    <div className="detail-page">
      <div className="nav_details">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Retour
        </button>
        <div className="nav_link">
          <button
            className="profile_button"
            onClick={() => navigate("/dashboard/apprenant/profile")}
          >
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          </button>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="hero-card">
        <div className="hero-top">
          <span className="hero-badge">Cours</span>
          <span className="hero-author">Par {course.formateur?.name}</span>
        </div>
        <h1>{course.title}</h1>
        <p>{course.description || "Pas de description."}</p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-icon">📖</span>
            <span>{course.chapters.length} chapitres</span>
          </div>
          <div className="stat">
            <span className="stat-icon">📝</span>
            <span>
              {course.quizzes.length} quiz
              {course.quizzes.length > 1 ? "" : ""}
            </span>
          </div>
        </div>
      </div>
      <div className="detail-body">
        {/* CHAPTERS */}
        <div className="section-card narrow-card">
          <h2 className="section-title"> Chapitres</h2>
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
                  <p>{chapter.content || "Pas de contenu."}</p>
                </div>
              </div>
            ))
          )}
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
                  <div className="quiz-icon">▶</div>
                  <div>
                    <p className="quiz-title">{quiz.title}</p>
                    <p className="quiz-duration">
                      ⏱ {quiz.duration_minutes} min
                    </p>
                  </div>
                </div>
                <button className="quiz-btn">Commencer</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
