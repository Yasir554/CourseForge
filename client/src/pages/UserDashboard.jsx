import React from 'react';
import '../style/index.css';
import Navbar from '../components/NavBar';

const UserDashboard = ({ userRole }) => {
  // Determine if the user is an instructor or student
  const isInstructor = userRole === 'instructor';
  
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <h2>CourseForge</h2>
          <p>{isInstructor ? 'Instructor' : 'Student'}</p>
        </div>
        
        <div className="sidebar-menu">
          {/* Menu items */}
          {isInstructor && (
            <div className="menu-items">
              <p>Create Course</p>
              <p>Delete Course</p>
            </div>
          )}
          
          {!isInstructor && (
            <div className="menu-items">
              <p>All Courses</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <div className="content-card">
          <div className="card-header">
            <h1>{isInstructor ? 'Instructor Dashboard' : 'Student Dashboard'}</h1>
            <button className="log-out-btn">Log Out</button>
          </div>
          
          {/* Course List */}
          <div className="course-list">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="course-item">
                <span>Course title : {num}</span>
                <button className="continue-btn">continue</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;