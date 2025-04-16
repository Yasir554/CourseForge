// client/src/pages/DeleteLessonChooser.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeleteLessonChooser = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/courses/${courseId}/lessons`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setLessons)
      .catch((err) => {
        console.error("Error fetching lessons:", err);
        setLessons([]);
      });
  }, [courseId, token]);

  return (
    <div>
      <h1>Delete a Lesson</h1>
      {lessons.length === 0 ? (
        <p>No lessons found for this course.</p>
      ) : (
        <ul>
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              {lesson.title}{" "}
              <button
                onClick={() =>
                  navigate(
                    `/instructor/dashboard/courses/${courseId}/lessons/${lesson.id}/delete`
                  )
                }
              >
                Delete This Lesson
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeleteLessonChooser;
