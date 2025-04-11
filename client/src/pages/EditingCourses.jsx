import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming that :id in URL for editing exists
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EditingCourses = () => {
  const { id } = useParams(); // Course id from URL (if editing)
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const isNewCourse = !id;

  const initialValues = { courseTitle: "", description: "" };

  const validationSchema = Yup.object({
    courseTitle: Yup.string().required("Course title is required"),
    description: Yup.string().required("Description is required"),
  });

  useEffect(() => {
    if (!isNewCourse) {
      setLoading(true);
      fetch(`http://127.0.0.1:5000/courses/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setCourseData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching course:", error);
          setLoading(false);
        });
    }
  }, [id, isNewCourse]);

  const onSubmit = (values, { setSubmitting }) => {
    const method = isNewCourse ? "POST" : "PUT";
    const url = isNewCourse
      ? "http://127.0.0.1:5000/courses"
      : `http://127.0.0.1:5000/courses/${id}`;

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Course data submitted:", data);
        setSubmitting(false);
        // Optionally, navigate or update state here
      })
      .catch((error) => {
        console.error("Error submitting course data:", error);
        setSubmitting(false);
      });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      fetch(`http://127.0.0.1:5000/courses/${id}`, { method: "DELETE" })
        .then((response) => response.json())
        .then(() => {
          console.log("Course deleted successfully");
          // Optionally, redirect after deleting
        })
        .catch((error) => {
          console.error("Error deleting course:", error);
        });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="editing-courses-page">
      <h2>{isNewCourse ? "Create New Course" : "Edit Course"}</h2>
      <Formik
        initialValues={courseData || initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <div>
            <label>Course Title:</label>
            <Field type="text" name="courseTitle" />
            <ErrorMessage name="courseTitle" component="div" className="error" />
          </div>
          <div>
            <label>Description:</label>
            <Field as="textarea" name="description" />
            <ErrorMessage name="description" component="div" className="error" />
          </div>
          <button type="submit">Save Course</button>
        </Form>
      </Formik>
      {!isNewCourse && (
        <button onClick={handleDelete} style={{ marginTop: "10px" }}>
          Delete Course
        </button>
      )}
    </div>
  );
};

export default EditingCourses;
