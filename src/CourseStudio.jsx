import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/studio.css";

export default function CourseStudio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);

  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizDuration, setQuizDuration] = useState("");

  const [quizzes, setQuizzes] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // load course + chapters
  useEffect(() => {
    axios.get(API + `/courses/${id}/details`, { headers }).then((res) => {
      setCourse(res.data);
      setChapters(res.data.chapters);
    });

    axios.get(API + `/courses/${id}/quizzes`, { headers }).then((res) => {
      setQuizzes(res.data);
    });

    axios
      .get(API + `/courses/${id}/quiz-analytics`, { headers })
      .then((res) => {
        setAnalytics(res.data);
      });
  }, []);

  // add chapter
  const handleAddChapter = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      API + `/courses/${id}/chapters`,
      { title: chapterTitle, content: chapterContent },
      { headers },
    );
    setChapters([...chapters, res.data]);
    setChapterTitle("");
    setChapterContent("");
  };

  // delete chapter
  const handleDeleteChapter = async (chapterId) => {
    await axios.delete(API + `/chapters/${chapterId}`, { headers });
    setChapters(chapters.filter((c) => c.id !== chapterId));
  };

  // delete course
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Supprimer ce cours définitivement ?")) return;
    try {
      await axios.delete(API + `/courses/${id}`, { headers });
      navigate("/dashboard/formateur/courses");
    } catch (err) {
      console.error(err.response);
      if (err.response?.status === 400) {
        alert(err.response.data.error);
      } else {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      API + `/courses/${id}/quizzes`,
      { title: quizTitle, duration_minutes: quizDuration },
      { headers },
    );
    setQuizzes([...quizzes, res.data]);
    setQuizTitle("");
    setQuizDuration("");
  };

  const handleDeleteQuiz = async (quizId) => {
    await axios.delete(API + `/quizzes/${quizId}`, { headers });
    setQuizzes(quizzes.filter((q) => q.id !== quizId));
  };

  if (!course) return <div className="studio-loading">Chargement...</div>;

  return (
    <div className="studio-page">
      {/* TOP NAV */}
      <div className="studio-topnav">
        <button
          className="studio-back"
          onClick={() => navigate("/dashboard/formateur/courses")}
        >
          ← Mes cours
        </button>
        <div className="studio-top-actions">
          <button
            className="btn-edit"
            onClick={() => navigate(`/studio/${id}/edit`)}
          >
            ✏️ Modifier le cours
          </button>
          <button
            className="btn-delete-course"
            onClick={() => handleDeleteCourse(course.id)}
          >
            🗑 Supprimer
          </button>
        </div>
      </div>

      {/* COURSE HERO */}
      <div className="studio-hero">
        <div className="studio-hero-left">
          <span className="studio-category">
            {course.category || "Sans catégorie"}
          </span>
          <h1>{course.title}</h1>
          <p>{course.description || "Pas de description."}</p>
        </div>
        <div className="studio-hero-stats">
          <div className="studio-stat">
            <span className="studio-stat-num">{chapters.length}</span>
            <span className="studio-stat-label">Chapitres</span>
          </div>
          <div className="studio-stat">
            <span className="studio-stat-num">
              {course.quizzes?.length ?? 0}
            </span>
            <span className="studio-stat-label">Quiz</span>
          </div>
          <div className="studio-stat">
            <span className="studio-stat-num">
              {course.enrollments_count ?? 0}
            </span>
            <span className="studio-stat-label">Apprenants</span>
          </div>
          <div className="studio-stat">
            <span
              className={
                "studio-pub " + (course.is_published ? "pub-yes" : "pub-no")
              }
            >
              {course.is_published ? "✓ Publié" : "Brouillon"}
            </span>
          </div>
        </div>
      </div>

      <h2 className="section-title">Chapitre Section</h2>

      <div className="studio-body">
        {/* ADD CHAPTER FORM */}
        <div className="studio-card">
          <h2>➕ Ajouter un chapitre</h2>
          <form onSubmit={handleAddChapter}>
            <div className="studio-field">
              <label>Titre du chapitre</label>
              <input
                type="text"
                placeholder="Ex: Introduction aux variables"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                required
              />
            </div>
            <div className="studio-field">
              <label>Contenu</label>
              <textarea
                placeholder="Écrivez le contenu du chapitre..."
                rows={4}
                value={chapterContent}
                onChange={(e) => setChapterContent(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-add-chapter">
              Ajouter le chapitre
            </button>
          </form>
        </div>

        {/* CHAPTERS LIST */}
        <div className="studio-card">
          <h2>📖 Chapitres ({chapters.length})</h2>

          {chapters.length === 0 ? (
            <p className="studio-empty">Aucun chapitre pour l'instant.</p>
          ) : (
            <div className="studio-chapters">
              {chapters.map((chapter, index) => (
                <div className="studio-chapter-row" key={chapter.id}>
                  <div className="studio-chapter-num">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="studio-chapter-info">
                    <p className="studio-chapter-title">{chapter.title}</p>
                    <p className="studio-chapter-content">
                      {chapter.content || "Pas de contenu."}
                      ...
                    </p>
                  </div>
                  <div className="studio-chapter-actions">
                    <button
                      className="btn-edit-chapter"
                      onClick={() =>
                        navigate(`/studio/chapter/${chapter.id}/edit`)
                      }
                    >
                      Modifier
                    </button>
                    <button
                      className="btn-delete-chapter"
                      onClick={() => handleDeleteChapter(chapter.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== QUIZ SECTION ===== */}
        <div className="quiz-section">
          {/* Header block: title + analytics stacked */}
          <div className="quiz-header">
            <h1 className="studio-section-title">Quiz Section</h1>
            <div className="studio-analytics">
              <div className="analytics-card analytics-blue">
                <p className="analytics-label">Tentatives totales</p>
                <p className="analytics-num">
                  {analytics?.total_attempts ?? 0}
                </p>
                <p className="analytics-hint">étudiants ont passé un quiz</p>
              </div>
              <div className="analytics-card analytics-green">
                <p className="analytics-label">Quiz réussis</p>
                <p className="analytics-num">{analytics?.passed ?? 0}</p>
                <p className="analytics-hint">score ≥ 70%</p>
              </div>
              <div className="analytics-card analytics-indigo">
                <p className="analytics-label">Score moyen</p>
                <p className="analytics-num">{analytics?.avg_score ?? 0}%</p>
                <p className="analytics-hint">moyenne globale</p>
              </div>
              <div className="analytics-card analytics-amber">
                <p className="analytics-label">Taux de réussite</p>
                <p className="analytics-num">{analytics?.success_rate ?? 0}%</p>
                <p className="analytics-hint">réussis / total</p>
              </div>
            </div>
          </div>

          {/* Body block: form + list side by side */}
          <div className="quiz-body">
            <div className="studio-card">
              <h2>➕ Ajouter un quiz</h2>
              <form onSubmit={handleAddQuiz}>
                <div className="studio-field">
                  <label>Titre du quiz</label>
                  <input
                    type="text"
                    placeholder="Ex: Quiz final - Variables"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="studio-field">
                  <label>Durée (minutes)</label>
                  <input
                    type="number"
                    placeholder="Ex: 30"
                    min="1"
                    value={quizDuration}
                    onChange={(e) => setQuizDuration(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-add-chapter">
                  Ajouter le quiz
                </button>
              </form>
            </div>

            <div className="studio-card">
              <h2>📝 Quiz ({quizzes.length})</h2>
              {quizzes.length === 0 ? (
                <p className="studio-empty">Aucun quiz pour l'instant.</p>
              ) : (
                <div className="studio-chapters">
                  {quizzes.map((quiz, index) => (
                    <div className="studio-chapter-row" key={quiz.id}>
                      <div className="studio-chapter-num">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="studio-chapter-info">
                        <p className="studio-chapter-title">{quiz.title}</p>
                        <p className="studio-chapter-content">
                          ⏱ {quiz.duration_minutes} min
                        </p>
                      </div>
                      <div className="studio-chapter-actions">
                        <button
                          className="btn-edit-chapter"
                          onClick={() =>
                            navigate(`/studio/quiz/${quiz.id}/questions`)
                          }
                        >
                          Questions
                        </button>
                        <button
                          className="btn-edit-chapter"
                          onClick={() =>
                            navigate(`/studio/quiz/${quiz.id}/edit`)
                          }
                        >
                          Modifier
                        </button>
                        <button
                          className="btn-delete-chapter"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
