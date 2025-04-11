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
    <nav>
      <div>
        <Link
          to={
            userRole === "Instructor"
              ? "/instructor/dashboard"
              : userRole === "Student"
              ? "/student/dashboard"
              : "/"
          }
          className="nav-brand"
        >
          CourseForge
        </Link>

        <div>
          {userRole && (
            <>
              <button onClick={handleLogout} className="btn">
                Log Out
              </button>
              {userRole === "Instructor" && (
                <>
                  <Link to="/instructor/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/instructor/courses/new" className="nav-link">
                    New Course
                  </Link>
                  <Link to="/instructor/lessons/new" className="nav-link">
                    New Lesson
                  </Link>
                </>
              )}
              {userRole === "Student" && (
                <>
                  <Link to="/student/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/student/courses" className="nav-link">
                    Courses
                  </Link>
                </>
              )}
            </>
          )}
          {!userRole && (
            <>
              {location.pathname === "/login" ? (
                <Link to="/register" className="nav-link">Register</Link>
              ) : location.pathname === "/register" ? (
                <Link to="/login" className="nav-link">Log In</Link>
              ) : null}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
