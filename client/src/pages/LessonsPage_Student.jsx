import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/LessonsPage_Student.css";

const LessonsPage_Student = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lessonId) {
      fetch(`http://localhost:5000/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => setContent(d.content))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [lessonId, token]);

  const handleNext = () => {
    // Adjust navigation logic according to your app's requirements.
    navigate(`/student/dashboard/courses/${courseId}/lessons/${+lessonId + 1}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="lesson-page">
      <div className="lesson-header"><h1>Lesson</h1></div>
      
      <div className="whiteboard-wrapper" dangerouslySetInnerHTML={{ __html: content }} />
      <button className="lesson-course-btn" onClick={() => navigate(-1)}>Back</button>
      <button  className="lesson-course-btn" onClick={handleNext}>Next</button>
    </div>
  );
};

export default LessonsPage_Student;
