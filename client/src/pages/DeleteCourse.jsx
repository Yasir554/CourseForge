// src/pages/DeleteCourse.jsx
import React, { useState, useEffect } from 'react';

const DeleteCourse = () => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.courses) {
          setCourses(userData.courses);
        }
      } catch (e) {
        console.error("Failed to load courses", e);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete-course/${courseId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setCourses(courses.filter(course => course.id !== courseId));
        setMessage("Course deleted successfully.");
      } else {
        setMessage("Failed to delete course.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="page-container">
      <h2>Delete a Course</h2>
      {courses.map(course => (
        <div key={course.id} className="course-card">
          <span>{course.name}</span>
          <button onClick={() => handleDelete(course.id)}>Delete</button>
        </div>
      ))}
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteCourse;
