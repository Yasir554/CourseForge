import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LessonPageStudent = () => {
  const { courseId, lessonId } = useParams(); // ⬅️ include courseId
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lessonId) {
      setLoading(true);
      fetch(`http://127.0.0.1:5000/lessons/${lessonId}`)
        .then((response) => response.json())
        .then((data) => {
          setContent(data.content);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching lesson:", error);
          setLoading(false);
        });
    }
  }, [lessonId]);

  const handleNext = () => {
    const nextLessonId = parseInt(lessonId) + 1;
    navigate(`/student/dashboard/courses/${courseId}/lessons/${nextLessonId}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="lesson-page" style={{ padding: "2rem" }}>
      <h1>Lesson</h1>
      <p>Lesson content:</p>
      <div className="whiteboard">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => navigate(-1)}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default LessonPageStudent;
