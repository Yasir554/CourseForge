import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/coursePage_Student.css";

const StudentCoursePage = () => {
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
    <div className="page-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>CourseForge</h2>
        <p>Student</p>
        <nav>
          <button onClick={() => navigate("/student/dashboard")}>
            All Courses
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="course-title">
          <h1 className="course-title">{courseTitle}</h1>
        </div>

        <section className="lesson-card">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
            >
              <span className="lesson-title">{lesson.lessonTitle || lesson.title}</span>
              <div>
                <button
                  onClick={() =>
                    navigate(`/student/dashboard/courses/${courseId}/lessons/${lesson.id}`)
                  }
                  className="continue-button"
                >
                  Continue
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default StudentCoursePage;
