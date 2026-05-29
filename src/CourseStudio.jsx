import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/studio.css";
import img1 from "./assests/delete.png";
import img2 from "./assests/pencil.png";
import img3 from "./assests/Quiz.png";
import img4 from "./assests/plus.png";
import img5 from "./assests/application.png";
import img6 from "./assests/time.png";

export default function CourseStudio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);

  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [chapterFile, setChapterFile] = useState(null);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizDuration, setQuizDuration] = useState("");

  const [quizzes, setQuizzes] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_attempts: 0,
    passed: 0,
    avg_score: 0,
    success_rate: 0,
  });
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

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

    const data = new FormData();
    data.append("title", chapterTitle);
    data.append("content", chapterContent);
    if (chapterFile) data.append("file", chapterFile);

    const res = await axios.post(
      API + `/courses/${id}/chapters`,
      data,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setChapters([...chapters, res.data]);
    setChapterTitle("");
    setChapterContent("");
    setChapterFile(null);
    e.target.reset();
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
      if (err.response && err.response.status === 400) {
        showToast(err.response.data.error, "error");
      } else {
        showToast("Erreur lors de la suppression.", "error");
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
      {toast && (
        <div className={"toast toast-" + toast.type}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
          </div>
          <p>{toast.message}</p>
        </div>
      )}
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
            <img className="img-edit" src={img2} alt="edit" />
            <p> Modifier</p>
          </button>
          <button
            className="btn-delete-course"
            onClick={() => handleDeleteCourse(course.id)}
          >
            <img className="img-delete" src={img1} alt="delete" />
            <p>Supprimer</p>
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
              {course.quizzes ? course.quizzes.length : 0}
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
          <div className="form_header">
            <img className="img_add" src={img4} alt="add" />
            <h2>Ajouter un chapitre</h2>
          </div>

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
            <div className="studio-field">
              <label>PDF ou video</label>
              <input
                type="file"
                accept=".pdf,video/*"
                onChange={(e) => setChapterFile(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn-add-chapter">
              Ajouter le chapitre
            </button>
          </form>
        </div>

        {/* CHAPTERS LIST */}
        <div className="studio-card">
          <div className="list_header">
            <img className="chapite_img" src={img5} alt="chapitre" />
            <h2>Chapitres ({chapters.length})</h2>
          </div>

          {chapters.length === 0 ? (
            <p className="studio-empty">Aucun chapitre pour l'instant.</p>
          ) : (
            <div className="studio-chapters">
              {chapters.map((chapter, index) => (
                <div className="studio-chapter-row" key={chapter.id}>
                  <div className="studio-chapter-num">
                    {index < 10 ? "0" + (index + 1) : index}
                  </div>
                  <div className="studio-chapter-info">
                    <p className="studio-chapter-title">{chapter.title}</p>
                    <p className="studio-chapter-content">
                      {chapter.content || "Pas de contenu."}
                      ...
                    </p>
                    {chapter.file_path && (
                      <p className="studio-chapter-file">
                        Fichier: {chapter.file_type}
                      </p>
                    )}
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
                  {analytics.total_attempts}
                </p>
                <p className="analytics-hint">étudiants ont passé un quiz</p>
              </div>
              <div className="analytics-card analytics-green">
                <p className="analytics-label">Quiz réussis</p>
                <p className="analytics-num">{analytics.passed}</p>
                <p className="analytics-hint">score ≥ 70%</p>
              </div>
              <div className="analytics-card analytics-indigo">
                <p className="analytics-label">Score moyen</p>
                <p className="analytics-num">{analytics.avg_score}%</p>
                <p className="analytics-hint">moyenne globale</p>
              </div>
              <div className="analytics-card analytics-amber">
                <p className="analytics-label">Taux de réussite</p>
                <p className="analytics-num">{analytics.success_rate}%</p>
                <p className="analytics-hint">réussis / total</p>
              </div>
            </div>
          </div>

          {/* Body block: form + list side by side */}
          <div className="quiz-body">
            <div className="studio-card">
              <div className="form_header">
                <img className="img_add" src={img4} alt="add" />
                <h2>Ajouter un chapitre</h2>
              </div>
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
              <div className="quiz_header">
                <img className="quiz_img" src={img3} alt="quiz" />
                <h2>Quiz ({quizzes.length})</h2>
              </div>

              {quizzes.length === 0 ? (
                <p className="studio-empty">Aucun quiz pour l'instant.</p>
              ) : (
                <div className="studio-chapters">
                  {quizzes.map((quiz, index) => (
                    <div className="studio-chapter-row" key={quiz.id}>
                      <div className="studio-chapter-num">
                        {index < 10 ? "0" + (index + 1) : index}
                      </div>
                      <div className="studio-chapter-info">
                        <p className="studio-chapter-title">{quiz.title}</p>
                        <div className="duration_section">
                          <img className="duration_img" src={img6} alt="time" />
                          <p className="studio-chapter-content">
                            {quiz.duration_minutes} min
                          </p>
                        </div>
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
