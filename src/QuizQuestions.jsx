import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/quizquestions.css";
import img1 from "./assests/delete.png";
import img2 from "./assests/time.png";

export default function QuizQuestions() {
  const { id } = useParams(); // quiz id
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  // form state
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correct, setCorrect] = useState("a");

  useEffect(() => {
    axios.get(API + `/quizzes/${id}/questions`, { headers }).then((res) => {
      setQuiz(res.data);
      setQuestions(res.data.questions);
    });
  }, []);

  async function handleAddQuestion(e) {
    e.preventDefault();
    const res = await axios.post(
      API + `/quizzes/${id}/questions`,
      {
        question_text: questionText,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_option: correct,
      },
      { headers },
    );
    setQuestions([...questions, res.data]);
    // reset form
    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrect("a");
  }

  async function handleDeleteQuestion(questionId) {
    await axios.delete(API + `/questions/${questionId}`, { headers });
    setQuestions(questions.filter((q) => q.id !== questionId));
  }

  if (!quiz) return <div className="qq-loading">Chargement...</div>;

  return (
    <div className="qq-page">
      <button className="qq-back" onClick={() => navigate(-1)}>
        ← Retour au studio
      </button>

      {/* HEADER */}
      <div className="qq-header">
        <div className="qq-badge">Quiz</div>

        <h1>{quiz.title}</h1>
        <div className="duration_section">
          <img className="duration_img" src={img2} alt="time" />
          <p>
            {quiz.duration_minutes} min · {questions.length} question
          </p>
        </div>
      </div>

      <div className="qq-body">
        {/* ADD QUESTION FORM */}
        <div className="qq-form-card">
          <h2>Ajouter une question</h2>
          <form onSubmit={handleAddQuestion}>
            <div className="qq-field">
              <label>Question</label>
              <textarea
                placeholder="Écrivez votre question..."
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
              />
            </div>

            <div className="qq-options-grid">
              <div className="qq-field">
                <label>Option A</label>
                <input
                  type="text"
                  placeholder="Option A"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  required
                />
              </div>
              <div className="qq-field">
                <label>Option B</label>
                <input
                  type="text"
                  placeholder="Option B"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  required
                />
              </div>
              <div className="qq-field">
                <label>Option C</label>
                <input
                  type="text"
                  placeholder="Option C"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  required
                />
              </div>
              <div className="qq-field">
                <label>Option D</label>
                <input
                  type="text"
                  placeholder="Option D"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="qq-field">
              <label>Bonne réponse</label>
              <select
                value={correct}
                onChange={(e) => setCorrect(e.target.value)}
              >
                <option value="a">Option A</option>
                <option value="b">Option B</option>
                <option value="c">Option C</option>
                <option value="d">Option D</option>
              </select>
            </div>

            <button type="submit" className="qq-submit">
              Ajouter la question
            </button>
          </form>
        </div>

        {/* QUESTIONS LIST */}
        <div className="qq-list-card">
          <h2>Questions ({questions.length})</h2>
          {questions.length === 0 ? (
            <p className="qq-empty">Aucune question pour l'instant.</p>
          ) : (
            questions.map((q, index) => (
              <div className="qq-question-row" key={q.id}>
                <div className="qq-question-num">
                  {index < 10 ? "0" + (index + 1) : index}
                </div>
                <div className="qq-question-info">
                  <p className="qq-question-text">{q.question_text}</p>
                  <div className="qq-options-preview">
                    {["a", "b", "c", "d"].map((opt) => (
                      <span
                        key={opt}
                        className={
                          "qq-opt " +
                          (q.correct_option === opt ? "qq-opt-correct" : "")
                        }
                      >
                        {opt.toUpperCase()}. {q[`option_${opt}`]}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className="qq-delete-btn"
                  onClick={() => handleDeleteQuestion(q.id)}
                >
                  <img className="img-delete" src={img1} alt="delete" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
