import React from "react";

// Instructor Dashboard Component
const InstructorDashboard = ({ user }) => {
  // In a real application, you'll fetch course data, etc. from your backend here

  return (
    <div className="instructor-dashboard">
      <h1>Instructor Dashboard</h1>
      <p>Welcome, {user.name}! Here you can manage your courses and track student progress.</p>
    </div>
  );
};

// Student Dashboard Component
const StudentDashboard = ({ user }) => {
  // In a real application, you'll fetch enrolled course data, etc. from your backend here

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      <p>Welcome, {user.name}! Here you can keep track of your enrolled courses and monitor your progress.</p>
    </div>
  );
};

// Main UserDashboard Component
const UserDashboard = ({ user }) => {
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
