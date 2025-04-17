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
    // Common headers with JWT
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Fetch lessons
    fetch(`http://127.0.0.1:5000/courses/${courseId}/lessons`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lessons");
        return res.json();
      })
      .then(setLessons)
      .catch((err) => {
        console.error("Error fetching lessons:", err);
        setLessons([]);
      });

    // Fetch course title
    fetch(`http://127.0.0.1:5000/courses/${courseId}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch course info");
        return res.json();
      })
      .then((data) => setCourseTitle(data.title))
      .catch((err) => {
        console.error("Error fetching course title:", err);
        setCourseTitle("Course Not Found");
      });
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
          <button
            onClick={() =>
              navigate(`/instructor/dashboard/courses/${courseId}/lessons/new`)
            }
            className="btn"
          >
            Create Lesson
          </button>
          <button
            onClick={() =>
              navigate(`/instructor/dashboard/courses/${courseId}/lessons/delete/choose`)
            }
            className="btn"
          >
            Delete Lesson
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <h1 className="course-title">{courseTitle}</h1>
        <section className="lesson-card">
          {lessons.length === 0 ? (
            <p>No lessons found.</p>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className="lesson-title">
                <span>{lesson.title}</span>
                <div className="btn">
                  <button className="buttons"
                    onClick={() =>
                      navigate(`/instructor/dashboard/courses/${courseId}/lessons/${lesson.id}/edit`)
                    }
                  >
                    Edit Lesson 
                  </button>
                  <button className="buttons"
                    onClick={() =>
                      navigate(`/instructor/dashboard/courses/${courseId}/lessons/${lesson.id}`)
                    }
                  >
                    Lesson content Edit 
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default InstructorCoursePage;
