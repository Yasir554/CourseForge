import React from 'react'; // Import the main React library
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import routing components
import styles from '../style/index.css'; // Import CSS module for styling

function Navbar() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const location = useLocation(); // Hook to get the current URL location
  // Assuming you have a way to get the user's role (e.g., from context, state)
  const userRole = localStorage.getItem('userRole'); // Example: Get role from local storage

  // Function to handle user logout
  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('userRole'); // Example: Clear role on logout
    navigate('/login'); // Redirect to the login page after logout
  };

  return (
    <nav className={styles.navbar}> {/* Main navigation container */}
      <div className={styles.container}> {/* Container to center and constrain content */}
        {/* Logo/Brand Link - navigates to the appropriate dashboard or home */}
        <Link
          to={
            userRole === 'instructor'
              ? '/instructor/dashboard'
              : userRole === 'student'
              ? '/student/dashboard'
              : '/'
          }
          className={styles.logo}
        >
          CourseForge
        </Link>

        {/* Logout button - only shown if a user role is present */}
        {userRole && (
          <button onClick={handleLogout} className={styles.logoutButton}>
            Log Out
          </button>
        )}

        {/* Navigation links specific to instructors */}
        {userRole === 'instructor' && (
          <div className={styles.instructorNav}>
            <Link to="/instructor/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/instructor/courses/new" className={styles.navLink}>
              New Course
            </Link>
            <Link to="/instructor/lessons/new" className={styles.navLink}>
              New Lesson
            </Link>
          </div>
        )}

        {/* Navigation links specific to students */}
        {userRole === 'student' && (
          <div className={styles.studentNav}>
            <Link to="/student/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/student/courses" className={styles.navLink}>
              Courses
            </Link>
          </div>
        )}

        {/* Conditional links for the login page */}
        {location.pathname === '/login' && (
          <Link to="/register" className={styles.authLink}>
            Register
          </Link>
        )}
        {/* Conditional links for the register page */}
        {location.pathname === '/register' && (
          <Link to="/login" className={styles.authLink}>
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;