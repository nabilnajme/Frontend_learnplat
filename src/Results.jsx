import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "./App";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./css/results.css";

export default function Results() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const user = JSON.parse(localStorage.getItem("user"));

  const [results, setResults] = useState([]);

  useEffect(() => {
    axios
      .get(API + "/my-results", { headers })
      .then((res) => setResults(res.data));
  }, []);

  // ---- computed stats ----
  const total = results.length;
  const passed = results.filter(
    (r) => r.score / r.total_questions >= 0.7,
  ).length;
  const avgScore =
    total === 0
      ? 0
      : Math.round(
          results.reduce((s, r) => s + (r.score / r.total_questions) * 100, 0) /
            total,
        );
  const successRate = total === 0 ? 0 : Math.round((passed / total) * 100);
  const totalTime = results.reduce(
    (s, r) => s + (r.quiz?.duration_minutes || 0),
    0,
  );

  // last 5 results for area chart (score over time)
  const scoreOverTime = [...results]
    .reverse()
    .slice(0, 7)
    .map((r, i) => ({
      name: `Q${i + 1}`,
      score: Math.round((r.score / r.total_questions) * 100),
    }));

  // bar chart — score per quiz (last 6)
  const barData = [...results]
    .slice(0, 6)
    .reverse()
    .map((r) => ({
      name: r.quiz?.title?.split(" ").slice(0, 2).join(" ") || "Quiz",
      score: Math.round((r.score / r.total_questions) * 100),
    }));

  // radial chart for success rate
  const radialData = [
    { name: "Réussis", value: successRate, fill: "#6366f1" },
    { name: "Total", value: 100, fill: "#f0f0f8" },
  ];

  // recent 5
  const recent = results.slice(0, 5);

  return (
    <div className="rp-page">
      {/* ---- HEADER ---- */}
      <div className="rp-topbar">
        <button
          className="rp-back"
          onClick={() => navigate("/dashboard/apprenant")}
        >
          ← Retour
        </button>
      </div>

      <div className="rp-hero">
        <div className="rp-hero-left">
          <p className="rp-label">Tableau de bord</p>
          <h1 className="rp-name">{user.name}</h1>
          <p className="rp-sub">Votre progression en un coup d'œil</p>
        </div>
        <div className="rp-hero-badge">
          <span className="rp-badge-num">{avgScore}%</span>
          <span className="rp-badge-label">Score moyen global</span>
        </div>
      </div>

      {/* ---- STAT CARDS ---- */}
      <div className="rp-stats">
        <div className="rp-stat-card rp-stat-indigo">
          <p className="rp-stat-label">Quiz complétés</p>
          <p className="rp-stat-num">{total}</p>
          <p className="rp-stat-hint">depuis le début</p>
        </div>
        <div className="rp-stat-card rp-stat-emerald">
          <p className="rp-stat-label">Quiz réussis</p>
          <p className="rp-stat-num">{passed}</p>
          <p className="rp-stat-hint">score ≥ 70%</p>
        </div>
        <div className="rp-stat-card rp-stat-amber">
          <p className="rp-stat-label">Taux de réussite</p>
          <p className="rp-stat-num">{successRate}%</p>
          <p className="rp-stat-hint">réussis / total</p>
        </div>
      </div>

      {/* ---- CHARTS ROW ---- */}
      <div className="rp-charts-row">
        {/* Area chart — score evolution */}
        <div className="rp-chart-card rp-chart-wide">
          <p className="rp-chart-title">Évolution du score</p>
          <p className="rp-chart-sub">Score % sur vos derniers quiz</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={scoreOverTime}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#999" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#999" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
                formatter={(v) => [`${v}%`, "Score"]}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#scoreGrad)"
                dot={{ fill: "#6366f1", r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar chart — score per quiz */}
      <div className="rp-chart-card rp-chart-full">
        <p className="rp-chart-title">Score par quiz</p>
        <p className="rp-chart-sub">Vos 6 derniers quiz</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} barSize={36}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#999" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#999" }} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
              formatter={(v) => [`${v}%`, "Score"]}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ---- RECENT RESULTS ---- */}
      <div className="rp-recent">
        <p className="rp-section-title">Résultats récents</p>

        {recent.length === 0 ? (
          <div className="rp-empty">
            <span>📭</span>
            <p>Aucun quiz passé pour l'instant.</p>
          </div>
        ) : (
          <div className="rp-recent-list">
            {recent.map((r) => {
              const pct = Math.round((r.score / r.total_questions) * 100);
              const ok = pct >= 70;
              return (
                <div className="rp-row" key={r.id}>
                  <div className={"rp-dot " + (ok ? "dot-ok" : "dot-fail")} />
                  <div className="rp-row-info">
                    <p className="rp-row-title">{r.quiz?.title || "Quiz"}</p>
                    <p className="rp-row-date">
                      {new Date(r.passed_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="rp-row-right">
                    <div className="rp-mini-bar">
                      <div
                        className={
                          "rp-mini-fill " + (ok ? "fill-ok" : "fill-fail")
                        }
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={"rp-pct " + (ok ? "pct-ok" : "pct-fail")}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
