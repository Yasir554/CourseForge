import React, { useState, useEffect } from "react";
import "../style/DeleteCourse.css";

const DeleteCourse = () => {
  const [courses, setCourses] = useState([]);
  // Keep track of which courses have been marked for deletion.
  const [coursesToDelete, setCoursesToDelete] = useState([]);
  const [message, setMessage] = useState("");

  // On mount, load the courses from the instructor’s local data.
  useEffect(() => {
    const fetchCourses = () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData.courses) {
          setCourses(userData.courses);
        }
      } catch (e) {
        console.error("Failed to load courses", e);
      }
    };

    fetchCourses();
  }, []);

  // Toggle a course's deletion selection.
  const toggleCourseSelection = (courseId) => {
    setCoursesToDelete((prev) => {
      if (prev.includes(courseId)) {
        // Unmark if already selected.
        return prev.filter((id) => id !== courseId);
      } else {
        // Mark the course for deletion.
        return [...prev, courseId];
      }
    });
  };

  // When Save is clicked, delete all marked courses.
  const handleSave = async () => {
    if (coursesToDelete.length === 0) {
      setMessage("No courses marked for deletion.");
      return;
    }

    try {
      // Delete each course marked for deletion.
      const deletePromises = coursesToDelete.map((courseId) =>
        fetch(`http://127.0.0.1:5000/delete-course/${courseId}`, {
          method: "DELETE",
          credentials: "include",
        })
      );

      // Wait for all DELETE requests.
      const responses = await Promise.all(deletePromises);
      const allSuccessful = responses.every((res) => res.ok);

      if (allSuccessful) {
        // Update UI state: remove deleted courses.
        const updatedCourses = courses.filter(
          (course) => !coursesToDelete.includes(course.id)
        );
        setCourses(updatedCourses);
        setCoursesToDelete([]);
        setMessage("Selected course(s) deleted successfully.");
      } else {
        setMessage("Failed to delete one or more courses.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="delete-course-page">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">CourseForge</h2>
        <span className="sidebar-role">Instructor</span>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <h2 className="delete-header">Delete Course</h2>

        {/* Display each course */}
        {courses.map((course) => (
          <div
            key={course.id}
            className={`course-card ${
              coursesToDelete.includes(course.id) ? "marked" : ""
            }`}
          >
            <span className="course-title">Course title: {course.name}</span>
            <button
              className="toggle-btn"
              onClick={() => toggleCourseSelection(course.id)}
            >
              {coursesToDelete.includes(course.id) ? "Unmark" : "Delete"}
            </button>
          </div>
        ))}

        {/* Show any message */}
        {message && <p className="delete-message">{message}</p>}

        {/* Save button that commits the changes to the database */}
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default DeleteCourse;
