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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // load course + chapters
  useEffect(() => {
    axios.get(API + `/courses/${id}/details`, { headers }).then((res) => {
      setCourse(res.data);
      setChapters(res.data.chapters);
    });
  }, []);

  // add chapter
  async function handleAddChapter(e) {
    e.preventDefault();
    const res = await axios.post(
      API + `/courses/${id}/chapters`,
      { title, content },
      { headers },
    );
    setChapters([...chapters, res.data]);
    setTitle("");
    setContent("");
  }

  // delete chapter
  async function handleDeleteChapter(chapterId) {
    await axios.delete(API + `/chapters/${chapterId}`, { headers });
    setChapters(chapters.filter((c) => c.id !== chapterId));
  }

  // delete course
  async function handleDeleteCourse() {
    if (!window.confirm("Supprimer ce cours définitivement ?")) return;
    await axios.delete(API + `/courses/${id}`, { headers });
    navigate("/dashboard/formateur/courses");
  }

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
          <button className="btn-delete-course" onClick={handleDeleteCourse}>
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="studio-field">
              <label>Contenu</label>
              <textarea
                placeholder="Écrivez le contenu du chapitre..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
      </div>
    </div>
  );
}
