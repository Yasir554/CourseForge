import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LessonPageStudent = () => {
  const { lessonId } = useParams();
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="lesson-page" style={{ padding: "2rem" }}>
      <h1>Lesson</h1>
      <p>Lesson content:</p>
      <div className="whiteboard">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <button onClick={() => navigate(-1)} >
        Back
      </button>
      

    </div>
  );
};

export default LessonPageStudent;
