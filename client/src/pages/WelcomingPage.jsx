import React from "react";
import { Link } from "react-router-dom";

const WelcomingPage = () => {
  return (
    <div className="welcoming-page" style={{ textAlign: "center", padding: "2rem" }}>
      <h1 className="CourseForge">CourseForge</h1>
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
  );
};

export default WelcomingPage;
