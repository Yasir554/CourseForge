// UserDashboardStudent.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/UserDashboard_Student.css";

const CourseList = ({ courses }) =>
  courses.length > 0 ? (
    <div className="course-list">
      {courses.map(({ id }, index) => (
        <div key={id} className="course-card">
          <span className="course-title">Course title : {index + 1}</span>
          <button className="continue-button">continue</button>
        </div>
      ))}
    </div>
  ) : null;

const UserDashboardStudent = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let parsed = null;
    try {
      const raw = localStorage.getItem("user");
      if (raw) parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
    setUser(parsed);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    fetch("http://127.0.0.1:5000/logout", {
      method: "POST",
      credentials: "include"
    })
      .then(() => {
        localStorage.removeItem("user");
        window.location.href = "/";
      })
      .catch((err) => console.error("Logout failed", err));
  };

  if (loading) return <div>Loading your dashboard…</div>;
  if (!user) return <div>Please log in to view your dashboard.</div>;
  if (user.role === "Instructor") return <div>This page is for students only.</div>;

  const { username, courses = [] } = user;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">CourseForge</h2>
        <p className="role">Student</p>
      </aside>

      <main className="main-content">
        <button onClick={handleLogout} className="logout-btn">Log Out</button>
        <h1 className="dashboard-heading">Student Dashboard</h1>
        <h2>Welcome, {username}!</h2>
        <h3>Your Enrolled Courses</h3>
        {courses.length > 0 ? (
          <CourseList courses={courses} />
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}
      </main>
    </div>
  );
};

export default UserDashboardStudent;
