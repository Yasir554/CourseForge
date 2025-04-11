import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LessonPage = ({ isInstructorProp = false }) => {
  // Retrieve lessonId from URL
  const { lessonId } = useParams();
  const navigate = useNavigate();

  // Local state for content and edit mode
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Detect if the user is instructor (or fallback to the passed prop)
  const storedRole = localStorage.getItem("userRole");
  const isInstructor = storedRole === "Instructor" || isInstructorProp;

  // Fetch lesson data on mount (if editing/viewing existing lesson)
  useEffect(() => {
    if (lessonId && !isEditing) {
      setLoading(true);
      fetch(`http://127.0.0.1:5000/lessons/${lessonId}`)
        .then((response) => response.json())
        .then((data) => {
          setContent(data.content); // expecting { content: "..." }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching lesson:", error);
          setLoading(false);
        });
    }
  }, [lessonId, isEditing]);

  const handleContentChange = (e) => {
    if (isInstructor) {
      setContent(e.target.innerHTML);
    }
  };

  const handleSave = async () => {
    const method = lessonId ? "PUT" : "POST";
    const url = lessonId ? `http://127.0.0.1:5000/lessons/${lessonId}` : "http://127.0.0.1:5000/lessons";
    const payload = { content };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to save lesson");
      }
      const data = await response.json();
      console.log("Lesson saved successfully:", data);
      setIsEditing(false);
      // Optionally, navigate or update state
    } catch (error) {
      console.error("Error saving lesson:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="lesson-page" style={{ padding: "2rem" }}>
      <h1>Lesson Details</h1>
      <p>
        {isInstructor
          ? isEditing
            ? "Edit mode: make changes to the lesson content below."
            : "Viewing mode: click 'Edit' to modify the lesson." 
          : "Lesson content:"}
      </p>
      <div
        className="whiteboard"
        contentEditable={isInstructor && isEditing}
        suppressContentEditableWarning={true}
        onInput={handleContentChange}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {isInstructor && !isEditing && (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
      {isInstructor && isEditing && (
        <div>
          <button onClick={handleSave}>Save Lesson</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
      {/* Optionally, add a button to navigate back to course or dashboard */}
      <button onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>
        Back
      </button>
    </div>
  );
};

export default LessonPage;
