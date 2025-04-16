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
    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    const parsedUser = rawUser ? JSON.parse(rawUser) : null;

    if (parsedUser && token) {
      setLocalUser({ ...parsedUser, access_token: token });
    }
  }, []);

  const initialValues = { courseTitle: "", description: "" };

  const validationSchema = Yup.object({
    courseTitle: Yup.string().required("Course title is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleAddStudent = () => {
    const trimmed = tempEmail.trim();
    if (trimmed && !addedStudents.includes(trimmed)) {
      setAddedStudents((prev) => [...prev, trimmed]);
    }
    setTempEmail("");
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!localUser?.access_token) {
        alert("You are not logged in. Please log in again.");
        navigate("/login");
        return;
      }

      const cleanedStudents = addedStudents.filter(email => email && email.trim() !== "");

      const payload = {
        title: values.courseTitle,
        description: values.description,
        students: cleanedStudents,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localUser.access_token}`,
      };

      // Log payload for debugging
      console.log("Submitting course with payload:", payload);

      const res = await fetch("http://127.0.0.1:5000/courses", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();

      if (!res.ok) {
        console.error("Error from server:", responseText);
        if (responseText.includes("Token has expired")) {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error(responseText);
      }

      const data = JSON.parse(responseText);

      const updated = {
        ...localUser,
        courses: [...(localUser.courses || []), data],
      };
      localStorage.setItem("user", JSON.stringify(updated));

      resetForm();
      setAddedStudents([]);
      navigate("/instructor/dashboard/courses");
    } catch (err) {
      console.error("Error creating course:", err.message);
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
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
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
                <input
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="Email"
                />
                <button type="button" onClick={handleAddStudent}>
                  Add
                </button>
              </div>

              <label>Added Students</label>
              <div>
                {addedStudents.map((e) => (
                  <span key={e}>
                    {e}{" "}
                    <button
                      type="button"
                      onClick={() => setAddedStudents((prev) => prev.filter((x) => x !== e))}
                    >
                      ×
                    </button>
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
