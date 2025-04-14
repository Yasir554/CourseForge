import React from "react";
import { Link } from "react-router-dom";
import "../style/WelcomingPage.css"

const WelcomingPage = () => {
  return (
    <div className="welcoming-page">
      <h1 className="Courseforge">CourseForge</h1>
      <div className="welcoming-content">
        <h2 className="welcoming-message">
          Welcome to
          <br />
          CourseForge
        </h2>
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
        <p className="or">or</p>
        <Link to="/register">
          <button className="register-btn">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomingPage;
