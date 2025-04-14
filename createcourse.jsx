import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../style/CreateCourse.css";

const CreateCourse = () => {
  const navigate = useNavigate();
  // Create a ref to access the Formik form methods
  const formRef = useRef(null);
  
  // Local state for added student emails
  const [addedStudents, setAddedStudents] = useState([]);
  const [tempEmail, setTempEmail] = useState("");

  // For optional local storage user update
  const [localUser, setLocalUser] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setLocalUser(JSON.parse(stored));
    }
  }, []);

  // Initial form values
  const initialValues = {
    courseTitle: "",
    description: ""
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    courseTitle: Yup.string().required("Course title is required"),
    description: Yup.string().required("Description is required")
  });

  // Adds a student email to the list (if you later want to extend the endpoint)
  const handleAddStudent = () => {
    if (tempEmail.trim() && !addedStudents.includes(tempEmail)) {
      setAddedStudents([...addedStudents, tempEmail]);
    }
    setTempEmail("");
  };

  // Remove a student email from the list
  const removeStudent = (emailToRemove) => {
    setAddedStudents(addedStudents.filter((email) => email !== emailToRemove));
  };

  // onSubmit sends a POST request to your backend to create a course
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        title: values.courseTitle,
        description: values.description,
        // Uncomment the following line if you extend your backend to accept student emails:
        // students: addedStudents
      };

      // IMPORTANT: Use "localhost" instead of "127.0.0.1" so cookies are sent properly.
      const response = await fetch("http://127.0.0.1:5000/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create course: ${errorText}`);
      }

      const data = await response.json();
      console.log("Course created:", data);

      // Optionally update localStorage with the new course
      if (data && localUser) {
        const updatedUser = { ...localUser };
        if (!updatedUser.courses) {
          updatedUser.courses = [];
        }
        updatedUser.courses.push(data);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setLocalUser(updatedUser);
      }

      // Clear the form and student list
      resetForm();
      setAddedStudents([]);

      // Navigate to the instructor's dashboard course list
      navigate("/instructor/dashboard/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form fields and student list on discard
  const handleDiscard = () => {
    setAddedStudents([]);
    setTempEmail("");
    if (formRef.current) {
      formRef.current.resetForm();
    }
  };

  return (
    <div className="new-course-page">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">CourseForge</h2>
        <span className="sidebar-role">Instructor</span>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Bar with Heading and Create Button */}
        <div className="top-bar">
          <h2>New Course</h2>
          <button
            className="create-course-btn"
            onClick={() => {
              if (formRef.current) {
                formRef.current.submitForm();
              }
            }}
          >
            Create Course
          </button>
        </div>

        {/* Form Section */}
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form id="new-course-form" className="course-form">
              <label htmlFor="courseTitle" className="form-label">
                Course Name
              </label>
              <Field
                type="text"
                id="courseTitle"
                name="courseTitle"
                placeholder="Enter course title"
                className="form-input"
              />
              <ErrorMessage name="courseTitle" component="div" className="error" />

              <label htmlFor="description" className="form-label">
                Course Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                placeholder="Enter course description"
                className="form-textarea"
              />
              <ErrorMessage name="description" component="div" className="error" />

              {/* Add Student Section (optional) */}
              <label className="form-label">Add Student</label>
              <div className="add-student-row">
                <input
                  type="email"
                  placeholder="Enter student email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="form-input"
                />
                <button type="button" className="add-btn" onClick={handleAddStudent}>
                  Add
                </button>
              </div>

              {/* Display List of Added Students */}
              <label className="form-label">Added Students</label>
              <div className="added-students-container">
                {addedStudents.map((email) => (
                  <div key={email} className="student-tag">
                    <span>{email}</span>
                    <button
                      type="button"
                      className="remove-student-btn"
                      onClick={() => removeStudent(email)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </Form>
          )}
        </Formik>

        {/* Bottom Discard Button */}
        <button className="discard-btn" onClick={handleDiscard}>
          Discard
        </button>
      </div>
    </div>
  );
};

export default CreateCourse;
