import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../style/CreateCourse.css";

const CreateCourse = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [addedStudents, setAddedStudents] = useState([]);
  const [tempEmail, setTempEmail] = useState("");
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setLocalUser(raw ? JSON.parse(raw) : null);
  }, []);

  const initialValues = { courseTitle: "", description: "" };
  const validationSchema = Yup.object({
    courseTitle: Yup.string().required("Course title is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleAddStudent = () => {
    if (tempEmail && !addedStudents.includes(tempEmail)) {
      setAddedStudents((prev) => [...prev, tempEmail]);
    }
    setTempEmail("");
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        title: values.courseTitle,
        description: values.description,
        students: addedStudents,
      };
      const res = await fetch("http://127.0.0.1:5000/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      // Update localStorage with the new course
      if (localUser) {
        const updated = { ...localUser, courses: [...(localUser.courses || []), data] };
        localStorage.setItem("user", JSON.stringify(updated));
      }

      resetForm();
      setAddedStudents([]);
      navigate("/instructor/dashboard/courses");
    } catch (err) {
      console.error(err);
      alert("Error creating course.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiscard = () => {
    formRef.current?.resetForm();
    setAddedStudents([]);
    setTempEmail("");
  };

  return (
    <div className="new-course-page">
      <aside className="sidebar">
        <h2>CourseForge</h2>
        <span>Instructor</span>
      </aside>
      <div className="main-content">
        <div className="top-bar">
          <h2>New Course</h2>
          <button onClick={() => formRef.current?.submitForm()}>Create Course</button>
        </div>
        <Formik innerRef={formRef} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <label>Course Name</label>
              <Field name="courseTitle" placeholder="Title" />
              <ErrorMessage name="courseTitle" component="div" className="error" />

              <label>Description</label>
              <Field as="textarea" name="description" placeholder="Description" />
              <ErrorMessage name="description" component="div" className="error" />

              <label>Add Student</label>
              <div>
                <input value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} placeholder="Email" />
                <button type="button" onClick={handleAddStudent}>
                  Add
                </button>
              </div>

              <label>Added Students</label>
              <div>
                {addedStudents.map((e) => (
                  <span key={e}>
                    {e} <button onClick={() => setAddedStudents((prev) => prev.filter((x) => x !== e))}>×</button>
                  </span>
                ))}
              </div>
            </Form>
          )}
        </Formik>
        <button onClick={handleDiscard}>Discard</button>
      </div>
    </div>
  );
};

export default CreateCourse;
