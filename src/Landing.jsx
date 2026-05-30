import { useState } from "react";
import { Link } from "react-router-dom";
import "./css/landing.css";

import heroImage from "./assests/landing-hero.webp";
import courseImageOne from "./assests/landing-design.jpg";
import courseImageTwo from "./assests/landing-react.jpg";
import courseImageThree from "./assests/landing-marketing.jpg";

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");

  const features = [
    {
      title: "Learn With Real Course Content",
      text: "Students can access chapters, PDFs, videos, and quizzes from one course page.",
    },
    {
      title: "Follow Your Progress",
      text: "Apprenants can mark chapters as completed and see their learning progress.",
    },
    {
      title: "Connect With Formateurs",
      text: "Students can contact the formateur by WhatsApp and discuss through course comments.",
    },
  ];

  const courses = [
    {
      title: "UI/UX Design",
      category: "Design",
      instructor: "Ali Husni",
      price: "Free",
      image: courseImageOne,
    },
    {
      title: "React for Beginners",
      category: "Development",
      instructor: "John Doe",
      price: "Free",
      image: courseImageTwo,
    },
    {
      title: "Digital Marketing",
      category: "Marketing",
      instructor: "Sara Smith",
      price: "Free",
      image: courseImageThree,
    },
  ];

  const stats = [
    { number: "10K+", text: "Students" },
    { number: "200+", text: "Courses" },
    { number: "50+", text: "Instructors" },
    { number: "95%", text: "Success Rate" },
  ];

  const testimonials = [
    {
      name: "Yassine Amrani",
      role: "Apprenant",
      text: "The platform helped me follow my chapters, take quizzes, and see my progress clearly.",
    },
    {
      name: "Sara El Mansouri",
      role: "Formateur",
      text: "I can publish courses, add chapters, upload files, and answer students from one dashboard.",
    },
    {
      name: "Omar Bennani",
      role: "Apprenant",
      text: "The course preview and comments make it easier to choose the right course before starting.",
    },
  ];

  function closeMenu() {
    setMenuOpen(false);
  }

  function sendContact(e) {
    e.preventDefault();

    setContactSuccess("Thank you " + contactName + ", your message is ready.");
    setContactName("");
    setContactEmail("");
    setContactMessage("");

    setTimeout(function () {
      setContactSuccess("");
    }, 3000);
  }

  return (
    <div className="landing-page">
      <nav className="landing-navbar">
        <a href="#home" className="landing-logo" onClick={closeMenu}>
          Cour<span>sera</span>
        </a>

        <div className="landing-links">
          <a href="#home">Home</a>
          <a href="#courses">Courses</a>
          <a href="#features">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="landing-actions">
          <Link to="/register" className="landing-signup">
            Sign up
          </Link>
          <Link to="/login" className="landing-login">
            Log in
          </Link>
        </div>

        <button
          className="landing-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "X" : "Menu"}
        </button>
      </nav>

      {menuOpen && (
        <div className="landing-mobile-menu">
          <a href="#home" onClick={closeMenu}>
            Home
          </a>
          <a href="#courses" onClick={closeMenu}>
            Courses
          </a>
          <a href="#features" onClick={closeMenu}>
            About
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
          <Link to="/register" onClick={closeMenu}>
            Sign up
          </Link>
          <Link to="/login" onClick={closeMenu}>
            Log in
          </Link>
        </div>
      )}

      <section className="landing-hero" id="home">
        <div className="landing-hero-text">
          <p className="landing-small-title">Online learning platform</p>
          <h1>
            Learn smarter with <span>Coursera</span>
          </h1>
          <p>
            Explore courses, test your knowledge, and track your results in one
            simple learning space.
          </p>

          <div className="landing-hero-buttons">
            <a href="#courses" className="landing-primary-btn">
              Browse Courses
            </a>
            <Link to="/register" className="landing-secondary-btn">
              Join as Instructor
            </Link>
          </div>
        </div>

        <div className="landing-hero-image">
          <img src={heroImage} alt="Students learning online" />
        </div>
      </section>

      <section className="landing-section" id="features">
        <div className="landing-section-title">
          <h2>Why Choose Coursera?</h2>
          <p>Everything students and formateurs need to work together.</p>
        </div>

        <div className="landing-feature-grid">
          {features.map(function (feature, index) {
            return (
              <div className="landing-feature-card" key={index}>
                <div className="landing-feature-icon">{index + 1}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="landing-section" id="courses">
        <div className="landing-section-title">
          <h2>Popular Courses</h2>
          <p>Start with a course and continue learning at your own rhythm.</p>
        </div>

        <div className="landing-course-grid">
          {courses.map(function (course, index) {
            return (
              <div className="landing-course-card" key={index}>
                <img src={course.image} alt={course.title} />
                <div className="landing-course-content">
                  <span>{course.category}</span>
                  <h3>{course.title}</h3>
                  <p>By {course.instructor}</p>
                  <div className="landing-course-bottom">
                    <strong>{course.price}</strong>
                    <Link to="/login">Enroll Now</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="landing-stats">
        {stats.map(function (item, index) {
          return (
            <div className="landing-stat-box" key={index}>
              <h3>{item.number}</h3>
              <p>{item.text}</p>
            </div>
          );
        })}
      </section>

      <section className="landing-section landing-testimonials">
        <div className="landing-section-title">
          <h2>What Learners Say</h2>
          <p>Simple feedback from people using the platform.</p>
        </div>

        <div className="landing-testimonial-grid">
          {testimonials.map(function (item, index) {
            return (
              <div className="landing-testimonial-card" key={index}>
                <div className="landing-quote">"</div>
                <p>{item.text}</p>
                <div className="landing-person">
                  <div>{item.name.charAt(0)}</div>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.role}</small>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="landing-contact" id="contact">
        <div className="landing-contact-text">
          <p className="landing-small-title">Contact us</p>
          <h2>Have a question about Coursera?</h2>
          <p>
            Send us a message and we will help you understand the platform,
            courses, or dashboard.
          </p>
        </div>

        <form className="landing-contact-form" onSubmit={sendContact}>
          {contactSuccess !== "" && (
            <p className="landing-contact-success">{contactSuccess}</p>
          )}

          <input
            type="text"
            placeholder="Your name"
            value={contactName}
            onChange={function (e) {
              setContactName(e.target.value);
            }}
            required
          />

          <input
            type="email"
            placeholder="Your email"
            value={contactEmail}
            onChange={function (e) {
              setContactEmail(e.target.value);
            }}
            required
          />

          <textarea
            placeholder="Your message"
            value={contactMessage}
            onChange={function (e) {
              setContactMessage(e.target.value);
            }}
            required
          ></textarea>

          <button type="submit">Send Message</button>
        </form>
      </section>

      <footer className="landing-footer">
        <h2>
          Cour<span>sera</span>
        </h2>
        <p>Learn smarter, grow faster.</p>
        <p className="landing-copy">
          Copyright 2026 Coursera. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Landing;
