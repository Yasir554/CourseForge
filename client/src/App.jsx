import React, { useState } from 'react';
import UserDashboard from './pages/UserDashboard';
import HomePage from './pages/HomePage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); 
  const [courseId, setCourseId] = useState(1);

  return (
    <div>
      {currentPage === 'homepage' ? (
        <UserDashboard 
          userRole="instructor" 
          onContinueCourse={(id) => {
            setCourseId(id);
            setCurrentPage('course');
          }}
        />
      ) : (
        <HomePage 
          courseTitle={courseId} 
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
    </div>
  );
}

export default App;