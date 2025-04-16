import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/LessonsPage_Instructor.css";

const LessonsPage_Instructor = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/lessons/${lessonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLesson(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [lessonId, token]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="lesson-page-container">
      <div className="lesson-header">
        <h2 className="logo">CourseForge</h2>
        <button className="topics-btn">Topics</button>
      </div>

      <div className="lesson-content">
        <h1 className="lesson-title">Lesson Title : {lesson.title}</h1>
        <p className="lesson-description">Description</p>

        <div className="lesson-box">
          <div className="lesson-section">
            <h3>Modules</h3>
            <ul>
              <li>Lorence 1</li>
              <li>Lorence 2</li>
              <li>Lorence 3</li>
              <li>Lorence 4</li>
            </ul>
          </div>

          <div className="lesson-section">
            <h3>Assessment</h3>
            <ul>
              <li>Lorence 1</li>
              <li>Lorence 2</li>
            </ul>
          </div>

          <div className="lesson-section">
            <h3>Conclusion</h3>
            <ul>
              <li>Lorence 1</li>
              <li>Lorence 1</li>
            </ul>
          </div>
        </div>

        <div className="btn-container">
          <button className="next-btn" onClick={() => navigate(-1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage_Instructor;
