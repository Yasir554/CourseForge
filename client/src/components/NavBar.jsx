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
        >
          CourseForge
        </Link>

        <div>
          {userRole && (
            <>
              <button onClick={handleLogout}>
                Log Out
              </button>
              {userRole === "Instructor" && (
                <>
                </>
              )}
              {userRole === "Student" && (
                <>
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