import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import "./css/quiz.css";

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // ⏱ timer state

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Load quiz questions
  useEffect(() => {
    axios.get(`${API}/quizzes/${id}/questions`, { headers }).then((res) => {
      setQuiz(res.data);
      // set timer in seconds
      setTimeLeft(res.data.duration_minutes * 60);
    });
  }, [id]);

  // Countdown effect
  useEffect(() => {
    if (!timeLeft || finished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFinished(true); // auto finish when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  // ---- RESULTS ----

  // replace the finished block at the top of the component:
  useEffect(() => {
    if (!finished) return;

    const percent = Math.round((score / total) * 100);

    // save result to DB
    axios
      .post(
        `${API}/quizzes/${id}/result`,
        { score: score, total_questions: total },
        { headers },
      )
      .then(() => {
        // navigate to results page after saving
        navigate("/my-results");
      });
  }, [finished]);

  if (!quiz) return <div className="quiz-loading">Chargement...</div>;

  const questions = quiz.questions;
  const total = questions.length;
  const question = questions[current];

  // Handle answer selection
  function handleSelect(option) {
    setSelected(option);
  }

  // Go to next question or finish
  function handleNext() {
    if (!selected) return;

    if (selected === question.correct_option) {
      setScore(score + 1);
    }

    if (current + 1 === total) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  }

  // Format timer (mm:ss)
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // ---- QUIZ ----
  return (
    <div className="quiz-page">
      <button className="quit-btn" onClick={() => navigate(-1)}>
        ← Quitter
      </button>
      <div className="quiz-card">
        {/* header */}
        <div className="quiz-card-header">
          <h2>{quiz.title}</h2>
          <span className="question-counter">
            Question {current + 1} / {total}
          </span>
          <span className="quiz-timer">⏱ {formatTime(timeLeft)}</span>
        </div>

        {/* progress bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>

        {/* question */}
        <div className="question-box">
          <p className="question-text">{question.question_text}</p>

          <div className="options-list">
            {["a", "b", "c", "d"].map((opt) => (
              <button
                key={opt}
                className={"option-btn" + (selected === opt ? " selected" : "")}
                onClick={() => handleSelect(opt)}
              >
                {question[`option_${opt}`]}
              </button>
            ))}
          </div>
        </div>

        {/* footer */}
        <div className="quiz-footer">
          <button
            className="btn-prev"
            onClick={() => setCurrent(current - 1)}
            disabled={current === 0}
          >
            ← Précédent
          </button>

          <button
            className={"btn-next" + (selected ? "" : " disabled")}
            onClick={handleNext}
          >
            {current + 1 === total ? "Terminer" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}
