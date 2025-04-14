import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EditingLesson = () => {
  const { id } = useParams(); // Lesson id (if editing existing lesson)
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isNewLesson = !id; // if no id, then it's creating a new lesson

  const initialValues = { lessonTitle: "", content: "", duration: "" };

  const validationSchema = Yup.object({
    lessonTitle: Yup.string().required("Lesson title is required"),
    content: Yup.string().required("Content is required"),
    duration: Yup.number().typeError("Duration must be a number").required("Duration is required"),
  });

  useEffect(() => {
    if (!isNewLesson) {
      fetch(`http://127.0.0.1:5000/lessons/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setLessonData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching lesson data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, isNewLesson]);

  const onSubmit = (values, { setSubmitting }) => {
    const method = isNewLesson ? "POST" : "PUT";
    const url = isNewLesson
      ? "http://127.0.0.1:5000/lessons"
      : `http://127.0.0.1:5000/lessons/${id}`;

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Lesson saved:", data);
        navigate(`instructor/dashboard/courses/${data.courseId || 1}/lessons/${data.id}`);
      })
      .catch((error) => {
        console.error("Error saving lesson:", error);
      })
      .finally(() => setSubmitting(false));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      fetch(`http://127.0.0.1:5000/lessons/${id}`, { method: "DELETE" })
        .then(() => {
          console.log("Lesson deleted");
          navigate("/courses/lessons/delete");
        })
        .catch((error) => {
          console.error("Error deleting lesson:", error);
        });
    }
  };

  if (loading) return <div>Loading...</div>;

  const prefilledValues = lessonData
    ? {
        lessonTitle: lessonData.lessonTitle,
        content: lessonData.content,
        duration: lessonData.duration,
      }
    : initialValues;

  return (
    <div className="editing-lesson-page">
      <h2>{isNewLesson ? "Create a New Lesson" : `Edit Lesson ${id}`}</h2>
      <Formik initialValues={prefilledValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>
          <div>
            <label>Lesson Title:</label>
            <Field type="text" name="lessonTitle" />
            <ErrorMessage name="lessonTitle" component="div" className="error" />
          </div>
          <div>
            <label>Content:</label>
            <Field as="textarea" name="content" />
            <ErrorMessage name="content" component="div" className="error" />
          </div>
          <div>
            <label>Duration (minutes):</label>
            <Field type="text" name="duration" />
            <ErrorMessage name="duration" component="div" className="error" />
          </div>
          <button type="submit">{isNewLesson ? "Create Lesson" : "Save Lesson"}</button>
        </Form>
      </Formik>
      {!isNewLesson && (
        <button onClick={handleDelete} style={{ marginTop: "10px" }}>
          Delete Lesson
        </button>
      )}
    </div>
  );
};

export default EditingLesson;
