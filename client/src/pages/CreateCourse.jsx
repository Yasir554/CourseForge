import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DeleteCourse = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Failed to load courses:", err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      fetch(`http://127.0.0.1:5000/courses/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          setCourses((prev) => prev.filter((course) => course.id !== id));
        })
        .catch((err) => console.error("Error deleting course:", err));
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">CourseForge</h2>
        <p className="role">Instructor</p>
        <nav className="nav-links">
          <button onClick={() => navigate("/create")} className="nav-btn">
            Create Course
          </button>
          <button className="nav-btn active">Delete Course</button>
        </nav>
      </aside>

      <main className="main-content">
        <h1 className="dashboard-heading">Delete Course</h1>
        <div className="course-list">
          {courses.map(({ id, courseTitle }, index) => (
            <div key={id} className="course-card">
              <span className="course-title">Course title : {index + 1}</span>
              <button
                onClick={() => handleDelete(id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <button className="save-button">Save</button>
      </main>
    </div>
  );
};

export default DeleteCourse;
