import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/UserDashBoard_Instructor.css";

const CourseList = ({ courses }) => {
  const navigate = useNavigate();

  const handleContinue = (courseId) => {
    // Navigate to the instructor's course page
    // e.g., /instructor/dashboard/courses/123
    navigate(`/instructor/dashboard/courses/${courseId}`);
  };

  return courses.length > 0 ? (
    <div className="course-list">
      {courses.map(({ id }, index) => (
        <div key={id} className="course-card">
          <span className="course-title">Course title : {index + 1}</span>
          <button
            className="continue-button"
            onClick={() => handleContinue(id)}
          >
            continue
          </button>
        </div>
      ))}
    </div>
  ) : null;
};

const UserDashboardInstructor = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;
      setUser(parsed);
    } catch (e) {
      console.error("Failed to get user ", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) return <div>Loading your dashboard…</div>;
  if (!user) return <div>Please log in to view your dashboard.</div>;

  const { username, role, courses = [] } = user;
  const isInstructor = role === "Instructor";

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">CourseForge</h2>
        <p className="role">Instructor</p>
        <nav className="nav-links">
          <button
            onClick={() => navigate("/instructor/dashboard/courses/new")}
            className="nav-btn"
          >
            Create Course
          </button>
          <button onClick={() => navigate("/delete")} className="nav-btn">
            Delete Course
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
        <h1 className="dashboard-heading">Instructor Dashboard</h1>
        <h2>Welcome, {username}!</h2>
        <h3>{isInstructor ? "Your Courses" : "Your Enrolled Courses"}</h3>
        {courses.length > 0 ? (
          <CourseList courses={courses} />
        ) : (
          <p>
            {isInstructor
              ? "You haven't created any courses yet."
              : "You are not enrolled in any courses yet."}
          </p>
        )}
      </main>
    </div>
  );
};

export default UserDashboardInstructor;
