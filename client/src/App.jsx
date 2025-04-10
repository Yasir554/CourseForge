import React, { useState } from 'react';
import UserDashboard from './pages/UserDashboard';
import HomePage from './pages/HomePage';

function App() {
  // Two state variables: page type and user role
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'course'
  const [userRole, setUserRole] = useState('instructor'); // 'instructor' or 'student'
  const [courseId, setCourseId] = useState(1);

  // Function to navigate between pages
  const navigateTo = (page, role, id = null) => {
    setCurrentPage(page);
    if (role) setUserRole(role);
    if (id) setCourseId(id);
  };

  return (
    <div>
      {currentPage === 'dashboard' ? (
        <UserDashboard 
          userRole={userRole}
          onContinueCourse={(id) => {
            setCourseId(id);
            setCurrentPage('course');
          }}
          // Add this prop to switch roles while staying on dashboard
          onSwitchRole={() => setUserRole(userRole === 'instructor' ? 'student' : 'instructor')}
        />
      ) : (
        <HomePage 
          courseTitle={courseId} 
          userRole={userRole}
          onBack={() => setCurrentPage('dashboard')}
          // Add this prop to switch roles while staying on course page
          onSwitchRole={() => setUserRole(userRole === 'instructor' ? 'student' : 'instructor')}
        />
      )}

      {/* Navigation controls for testing */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
        <p><strong>Navigation Controls</strong></p>
        <button onClick={() => navigateTo('dashboard', 'instructor')}>Instructor Dashboard</button>
        <button onClick={() => navigateTo('dashboard', 'student')}>Student Dashboard</button>
        <button onClick={() => navigateTo('course', 'instructor')}>Instructor Course</button>
        <button onClick={() => navigateTo('course', 'student')}>Student Course</button>
      </div>
    </div>
  );
}

export default App;