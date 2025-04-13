import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InstructorCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [courseTitle, setCourseTitle] = useState("Course Title");

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/courses/${courseId}/lessons`)
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((error) => console.error("Error fetching lessons:", error));

    fetch(`http://127.0.0.1:5000/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => setCourseTitle(data.courseTitle || "Course Title"))
      .catch((error) => console.error("Error fetching course details:", error));
  }, [courseId]);

  return (
    <div className="course-page-container">
      <aside className="sidebar">
        <h2>CourseForge</h2>
        <p>Instructor</p>
        <nav>
          <p onClick={() => navigate("/instructor/dashboard")}>All Courses</p>
          <p>
            <button onClick={() => navigate(`/instructor/dashboard/courses/${courseId}/lessons/new`)}>
              New Lesson
            </button>
          </p>
          <p>
            <button onClick={() => navigate("/instructor/dashboard/courses/new")}>
              New Course
            </button>
          </p>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-card">
          <header className="card-header">
            <h1>{courseTitle}</h1>
            <button onClick={() => navigate("/instructor/dashboard")}>All Courses</button>
          </header>

          <section className="lesson-list">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="lesson-item">
                <span>{lesson.lessonTitle || lesson.title}</span>
                <div className="lesson-actions">
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
        </div>
      </main>
    </div>
  );
};

export default InstructorCoursePage;
