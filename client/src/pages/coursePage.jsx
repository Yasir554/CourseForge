import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const storedRole = localStorage.getItem("userRole");
  const isInstructor = storedRole === "Instructor";
  const [lessons, setLessons] = useState([]);
  const [courseTitle, setCourseTitle] = useState("Course Title");

  // Fetch lessons for the course
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/courses/${courseId}/lessons`)
      .then((res) => res.json())
      .then((data) => {
        setLessons(data); // expecting an array of lessons
      })
      .catch((error) => console.error("Error fetching lessons:", error));

    // Optionally, fetch course details such as title
    fetch(`http://127.0.0.1:5000/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        setCourseTitle(data.courseTitle || "Course Title");
      })
      .catch((error) => console.error("Error fetching course details:", error));
  }, [courseId]);

  return (
    <div className="course-page-container" style={{ display: "flex" }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{ width: "250px", padding: "1rem", borderRight: "1px solid #ccc" }}>
        <h2>CourseForge</h2>
        <p>{isInstructor ? "Instructor" : "Student"}</p>
        <nav>
          <p>All Courses</p>
          {isInstructor && (
            <>
              <p>
                <button onClick={() => navigate("/instructor/lessons/new")}>New Lesson</button>
              </p>
              <p>
                <button onClick={() => navigate("/instructor/courses/new")}>New Course</button>
              </p>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, padding: "1rem" }}>
        <div className="content-card">
          <header className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>{courseTitle}</h1>
            {isInstructor && (
              <button onClick={() => navigate(isInstructor ? "/instructor/dashboard" : "/student/dashboard")}>
                Dashboard
              </button>
            )}
          </header>

          <section className="lesson-list">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="lesson-item" style={{ border: "1px solid #ddd", margin: "0.5rem 0", padding: "0.5rem" }}>
                <span>{lesson.lessonTitle || lesson.title}</span>
                <div className="lesson-actions">
                  {isInstructor && (
                    <button onClick={() => navigate(`/instructor/lessons/${lesson.id}/edit`)} style={{ marginRight: "0.5rem" }}>
                      Edit
                    </button>
                  )}
                  <button onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}>Continue</button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;
