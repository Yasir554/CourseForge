// WelcomingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const WelcomingPage = () => {
  return (
    <div>
      <div>
        <h1 className="CourseForge">CourseForge</h1>
        <div>
          <h2 className="Welcoming Message">Welcome to<br />CourseForge</h2>
          <Link to="/login">
            <button className="Login">
              Login
            </button>
          </Link>
          <p className="or">or</p>
          <Link to="/register">
            <button className="Register">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomingPage;
