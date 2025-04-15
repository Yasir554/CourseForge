import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/UserDashBoard_Instructor.css";

const UserDashboardInstructor = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <div>Please log in to view your dashboard.</div>;
  const { username, courses = [] } = user;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">CourseForge</h2>
        <p className="role">Instructor</p>
        <nav className="nav-links">
          <button onClick={() => navigate("/instructor/dashboard/courses/new")} className="nav-btn">
            Create Course
          </button>
        </nav>
      </aside>
      <main className="main-content">
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
        <h1 className="dashboard-heading">Instructor Dashboard</h1>
        <h2>Welcome, {username}!</h2>
        <h3>Your Courses</h3>
        {courses.length > 0 ? (
          <div className="course-list">
            {courses.map((c, idx) => (
              <div key={c.id} className="course-card">
                <span>Course {idx + 1}</span>
                <button onClick={() => navigate(`/instructor/dashboard/courses/${c.id}`)}>
                  Continue
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't created any courses yet.</p>
        )}
      </main>
    </div>
  );
};

export default UserDashboardInstructor;
