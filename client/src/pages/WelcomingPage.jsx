import React from "react";
import { Link } from "react-router-dom";

const WelcomingPage = () => {
  return (
    <div className="container">
      <div className="card">
        <h1>CourseForge</h1>
        <h2>
          Welcome to
          <br />
          CourseForge
        </h2>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/login">
            <button className="btn">Login</button>
          </Link>
          <Link to="/register">
            <button className="btn">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomingPage;
