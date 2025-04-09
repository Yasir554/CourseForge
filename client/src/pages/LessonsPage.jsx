import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LessonPage = ({ courseId, lessonId, isInstructor }) => {
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    modules: '',
    assessment: '',
    conclusion: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({});

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await axios.get(`/courses/${courseId}/lessons/${lessonId}`);
        setLessonData(response.data);
        setTempData(response.data);  // Store a copy of the data for editing
      } catch (err) {
        console.error('Error fetching lesson data:', err);
        alert('Failed to fetch lesson data');
      }
    };

    fetchLessonData();
  }, [courseId, lessonId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/courses/${courseId}/lessons/${lessonId}`, tempData);
      setLessonData(tempData); // Update the lessonData with the edited data
      setIsEditing(false); // Switch off editing mode
      alert('Lesson saved successfully');
    } catch (err) {
      console.error('Error saving lesson data:', err);
      alert('Failed to save lesson data');
    }
  };

  const handleCancel = () => {
    setTempData(lessonData); // Discard changes
    setIsEditing(false);
  };

  return (
    <div className="lesson-page">
      <h1>{lessonData.title}</h1>
      <h3>{lessonData.description}</h3>
      
      {/* Displaying modules */}
      <div>
        <h4>Modules</h4>
        <ul>
          {lessonData.modules.split(',').map((module, index) => (
            <li key={index}>{module.trim()}</li>
          ))}
        </ul>
      </div>

      {/* Displaying assessment */}
      <div>
        <h4>Assessment</h4>
        <ul>
          {lessonData.assessment.split(',').map((assess, index) => (
            <li key={index}>{assess.trim()}</li>
          ))}
        </ul>
      </div>

      {/* Displaying conclusion */}
      <div>
        <h4>Conclusion</h4>
        <ul>
          {lessonData.conclusion.split(',').map((concl, index) => (
            <li key={index}>{concl.trim()}</li>
          ))}
        </ul>
      </div>

      {/* Editable content for the instructor */}
      {isInstructor && (
        <div>
          <button onClick={() => setIsEditing(true)}>Edit Lesson</button>

          {isEditing && (
            <div>
              <textarea
                name="title"
                value={tempData.title}
                onChange={handleChange}
                placeholder="Edit title"
              />
              <textarea
                name="description"
                value={tempData.description}
                onChange={handleChange}
                placeholder="Edit description"
              />
              <textarea
                name="modules"
                value={tempData.modules}
                onChange={handleChange}
                placeholder="Edit modules (comma separated)"
              />
              <textarea
                name="assessment"
                value={tempData.assessment}
                onChange={handleChange}
                placeholder="Edit assessment (comma separated)"
              />
              <textarea
                name="conclusion"
                value={tempData.conclusion}
                onChange={handleChange}
                placeholder="Edit conclusion (comma separated)"
              />

              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Discard Changes</button>
            </div>
          )}
        </div>
      )}

      {/* For students, just read the lesson */}
      {!isInstructor && (
        <div>
          <h4>Module Notes</h4>
          <p>{lessonData.modules}</p>

          <h4>Assessment</h4>
          <p>{lessonData.assessment}</p>

          <h4>Conclusion</h4>
          <p>{lessonData.conclusion}</p>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
