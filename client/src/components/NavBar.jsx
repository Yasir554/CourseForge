import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole"); // "Instructor" or "Student" (or null)

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          to={
            userRole === "Instructor"
              ? "/instructor/dashboard"
              : userRole === "Student"
              ? "/student/dashboard"
              : "/"
          }
          style={{ fontWeight: "bold", fontSize: "1.2rem" }}
        >
          CourseForge
        </Link>

        <div>
          {userRole && (
            <>
              <button onClick={handleLogout} style={{ marginRight: "1rem" }}>
                Log Out
              </button>
              {userRole === "Instructor" && (
                <>
                  <Link to="/instructor/dashboard" style={{ marginRight: "1rem" }}>
                    Dashboard
                  </Link>
                  <Link to="/instructor/courses/new" style={{ marginRight: "1rem" }}>
                    New Course
                  </Link>
                  <Link to="/instructor/lessons/new" style={{ marginRight: "1rem" }}>
                    New Lesson
                  </Link>
                </>
              )}
              {userRole === "Student" && (
                <>
                  <Link to="/student/dashboard" style={{ marginRight: "1rem" }}>
                    Dashboard
                  </Link>
                  <Link to="/student/courses" style={{ marginRight: "1rem" }}>
                    Courses
                  </Link>
                </>
              )}
            </>
          )}
          {!userRole && (
            <>
              {location.pathname === "/login" ? (
                <Link to="/register">Register</Link>
              ) : location.pathname === "/register" ? (
                <Link to="/login">Log In</Link>
              ) : null}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
