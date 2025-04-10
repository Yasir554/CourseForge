import React, { useState, useEffect } from "react";

const LessonPage = ({ editable = false, initialContent = "" }) => {
  // State to hold the lesson content
  const [content, setContent] = useState(initialContent);

  // Updates state when the teacher edits the content
  const handleContentChange = (e) => {
    if (editable) {
      setContent(e.target.innerHTML);
    }
  };

  // Save function to later connect with your backend API
  const handleSave = async () => {
    console.log("Saving lesson content:", content);
    // TODO: Replace this with a fetch() call to save the lesson content to the backend
  };

  // Ensures the editable div reflects any initialContent updates (if coming from backend)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  return (
    <div className="lesson-page" style={{ padding: "2rem" }}>
      <h1>Lesson Details</h1>
      <p>
        {editable
          ? "Use this whiteboard to write and organize your lesson content."
          : "Below is the lesson content."}
      </p>
      <div
        className="whiteboard"
        contentEditable={editable}
        suppressContentEditableWarning={true}
        onInput={handleContentChange}
      >
        {/* Render existing content (may include HTML markup) */}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {editable && (
        <button
          onClick={handleSave}
        >
          Save Lesson
        </button>
      )}
    </div>
  );
};

export default LessonPage;
