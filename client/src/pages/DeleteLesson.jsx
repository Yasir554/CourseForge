import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/DeleteLesson.css";

const DeleteLesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await fetch(`http://localhost:5000/lessons/${lessonId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/instructor/dashboard/courses/${courseId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to delete lesson.");
    }
  };

  return (
    <button onClick={handleDelete} className="delete-lesson-btn">
      Delete Lesson
    </button>
  );
};

export default DeleteLesson;
