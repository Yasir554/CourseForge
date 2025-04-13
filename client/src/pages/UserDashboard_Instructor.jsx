// UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/UserDashBoard_Student.css";

const CourseList = ({ courses }) =>
  courses.length > 0 ? (
    <ul>
      {courses.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  ) : null;

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
      // Add API call to logout endpoint
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        credentials: "include" // Required for cookies/sessions
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
    <div>
      <button onClick={handleLogout}> Logout </button>
      <h1 className="h1" >Instructor Dashboard</h1>
      <h2>Welcome, {username}!</h2>
      <h3> {isInstructor ? "Your Courses" : "Your Enrolled Courses"}</h3>

      {courses.length > 0 ? (
        <CourseList courses={courses} />
      ) : (
        <p>
          {isInstructor
            ? "You haven't created any courses yet."
            : "You are not enrolled in any courses yet."}
        </p>
      )}
    </div>
  );
};

export default UserDashboardInstructor;