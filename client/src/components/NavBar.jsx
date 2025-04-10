import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav>
      <div>
        <Link
          to={
            userRole === 'instructor'
              ? '/instructor/dashboard'
              : userRole === 'student'
              ? '/student/dashboard'
              : '/'
          }
        >
          CourseForge
        </Link>

        {userRole && (
          <button onClick={handleLogout}>
            Log Out
          </button>
        )}

        {userRole === 'instructor' && (
          <div>
            <Link to="/instructor/dashboard">
              Dashboard
            </Link>
            <Link to="/instructor/courses/new">
              New Course
            </Link>
            <Link to="/instructor/lessons/new">
              New Lesson
            </Link>
          </div>
        )}

        {userRole === 'student' && (
          <div>
            <Link to="/student/dashboard">
              Dashboard
            </Link>
            <Link to="/student/courses">
              Courses
            </Link>
          </div>
        )}

        {location.pathname === '/login' && (
          <Link to="/register">
            Register
          </Link>
        )}
        
        {location.pathname === '/register' && (
          <Link to="/login">
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;