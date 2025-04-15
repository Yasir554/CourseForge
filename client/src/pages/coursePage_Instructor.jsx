import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/coursePage_Instructor.css";

const InstructorCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/courses/${courseId}/lessons`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setLessons)
      .catch(console.error);

    fetch(`http://127.0.0.1:5000/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCourseTitle(data.title))
      .catch(console.error);
  }, [courseId, token]);

  return (
    <div className="page-container">
      <aside className="sidebar">
        <h2>CourseForge</h2>
        <p>Instructor</p>
        <nav>
          <button onClick={() => navigate("/instructor/dashboard")} className="btn">
            All Courses
          </button>
          <button onClick={() => navigate(`/instructor/dashboard/courses/${courseId}/lessons/new`)} className="btn">
            Create Lesson
          </button>
        </nav>
      </aside>
      <main className="main-content">
        <h1 className="course-title">{courseTitle}</h1>
        <section className="lesson-card">
          {lessons.map(lesson => (
            <div key={lesson.id} className="lesson-title">
              <span>{lesson.title}</span>
              <div className="btn">
                <button onClick={() => navigate(`/instructor/dashboard/courses/${courseId}/lessons/${lesson.id}/edit`)}>
                  Edit
                </button>
                <button onClick={() => navigate(`/instructor/dashboard/courses/${courseId}/lessons/${lesson.id}`)}>
                  Continue
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default InstructorCoursePage;
