import React from 'react';

const HomePage = ({ courseTitle, userRole }) => {
  const isInstructor = userRole === 'instructor';
  
  return (
    <div className="homepage-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <h2>CourseForge</h2>
          <p>{isInstructor ? 'Instructor' : 'Student'}</p>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-items">
            <p>All Courses</p>
            {isInstructor && (
              <>
                <p>Create Lesson</p>
                <p>Delete Lesson</p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <div className="content-card">
          <div className="card-header">
            <h1>Course Title : {courseTitle || 1}</h1>
            {isInstructor && <button className="log-out-btn">Log Out</button>}
          </div>
          
          {/* Lesson List */}
          <div className="lesson-list">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="lesson-item">
                <span>Lesson Title : {num}</span>
                <div className="lesson-actions">
                  {isInstructor && <button className="edit-btn">Edit</button>}
                  <button className="continue-btn">continue</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;