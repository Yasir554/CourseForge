import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/LessonsPage_Instructor.css";

const LessonsPage_Instructor = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const [whiteboardContent, setWhiteboardContent] = useState("");

  const storageKey = `lesson_${lessonId}_whiteboard`;

  useEffect(() => {
    fetch(`http://localhost:5000/lessons/${lessonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLesson(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [lessonId, token]);

  // Load saved content from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setWhiteboardContent(saved);
  }, [storageKey]);

  // Save to localStorage whenever the content changes
  useEffect(() => {
    localStorage.setItem(storageKey, whiteboardContent);
  }, [whiteboardContent, storageKey]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="lesson-page-container">
      <div className="lesson-header">
        <h2 className="logo">CourseForge</h2>
      </div>

      <div className="lesson-content">
        <h1 className="lesson-title">Lesson Title: {lesson.title}</h1>

        <div className="whiteboard-wrapper">
          <textarea
            className="whiteboard-textarea"
            placeholder="Start typing your lesson content here..."
            value={whiteboardContent}
            onChange={(e) => setWhiteboardContent(e.target.value)}
          ></textarea>
        </div>

        <div className="btn-container">
          <button className="next-btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default LessonsPage_Instructor;
