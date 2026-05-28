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

  useEffect(() => {
    axios
      .get(API + `/courses/${id}/details`, { headers })
      .then((res) => setCourse(res.data));
  }, [id]);

  if (!course) return <div className="detail-loading">Chargement...</div>;

  function contactFormateur() {
    if (!course.formateur?.phone) return;

    const cleanPhone = course.formateur.phone.replace(/\D/g, "");
    const message = `Bonjour, je suis un etudiant dans votre cours: ${course.title}`;
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
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
          {course.formateur?.phone && (
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
