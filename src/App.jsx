import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ApprenantDashboard from "./ApprenantDashboard";
import FormateurDashboard from "./FormateurDashboard";
import CoursesList from "./CoursesList";
import FormateurCourses from "./FormateurCourses";
import Profile from "./Profile";
import CoursDetaill from "./CoursDetaill";
import Quiz from "./Quiz";
import Results from "./Results";

export const API = "http://localhost:8000/api";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* ===================================Apprenant Dashboard========================== */}
          <Route path="/dashboard/apprenant" element={<ApprenantDashboard />} />
          <Route
            path="dashboard/apprenant/enrollments"
            element={<CoursesList />}
          />
          <Route path="dashboard/apprenant/profile" element={<Profile />} />
          <Route path="/courses/:id/details" element={<CoursDetaill />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/my-results" element={<Results />} />

          {/*==================Formateur Dashboard ===============================  */}
          <Route path="/dashboard/formateur" element={<FormateurDashboard />} />
          <Route
            path="/dashboard/formateur/courses"
            element={<FormateurCourses />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
