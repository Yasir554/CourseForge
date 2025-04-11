import React, { useEffect, useState } from "react";

// Instructor Dashboard Component
const InstructorDashboard = ({ user }) => {
  return (
    <div className="instructor-dashboard">
      <h1>Instructor Dashboard</h1>
      <p>Welcome, {user.name}! Here you can manage your courses and track student progress.</p>
    </div>
  );
};

// Student Dashboard Component
const StudentDashboard = ({ user }) => {
  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      <p>Welcome, {user.name}! Here you can keep track of your enrolled courses and monitor your progress.</p>
    </div>
  );
};

// Main UserDashboard Component
const UserDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch user");
      })
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  if (!user) {
    return (
      <div className="dashboard-message">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {user.role === "Instructor" ? (
        <InstructorDashboard user={user} />
      ) : (
        <StudentDashboard user={user} />
      )}
    </div>
  );
};

export default UserDashboard;
