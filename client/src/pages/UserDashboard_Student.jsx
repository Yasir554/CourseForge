import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/UserDashboard_Student.css";

const UserDashboardStudent = () => {
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
        <p className="role">Student</p>
      </aside>
      <main className="main-content">
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
        <h1 className="dashboard-heading">Student Dashboard</h1>
        <h2>Welcome, {username}!</h2>
        <h3>Your Enrolled Courses</h3>
        {courses.length > 0 ? (
          <div className="course-list">
            {courses.map((c, idx) => (
              <div key={c.id} className="course-card">
                <span>Course {idx + 1}</span>
                <button className="continue-button" onClick={() => navigate(`/student/dashboard/courses/${c.id}`)}>
                  Continue
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}
      </main>
    </div>
  );
};

export default UserDashboardStudent;
