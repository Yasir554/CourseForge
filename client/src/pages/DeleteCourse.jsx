import React, { useState, useEffect } from "react";
import "../style/DeleteCourse.css";

const DeleteCourse = () => {
  const [courses, setCourses] = useState([]);
  const [toDelete, setToDelete] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      setCourses(u.courses || []);
    }
  }, []);

  const mark = (id) => {
    setToDelete((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = async () => {
    if (!toDelete.length) return setMsg("No courses marked.");

    const token = localStorage.getItem("token"); // ✅ Get your JWT token

    try {
      await Promise.all(
        toDelete.map((id) =>
          fetch(`http://localhost:5000/courses/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Include token
              "Content-Type": "application/json",
            },
          })
        )
      );

      // ✅ Update localStorage to reflect deletions
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        u.courses = courses;
        localStorage.setItem("user", JSON.stringify(u));
      }

      setMsg("Deleted successfully.");
      setToDelete([]);
    } catch {
      setMsg("Error deleting.");
    }
  };

  return (
    <div className="delete-course-page">
      <aside className="sidebar">
        <h2>CourseForge</h2>
        <span>Instructor</span>
      </aside>
      <div className="main-content">
        <h2>Delete Course</h2>
        {courses.map((c) => (
          <div key={c.id} className="course-card">
            <span>Course title: {c.title}</span>
            <button onClick={() => mark(c.id)}>Delete</button>
          </div>
        ))}
        {msg && <p>{msg}</p>}
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default DeleteCourse;
