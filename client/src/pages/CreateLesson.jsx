import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../style/CreateLesson.css";

const CreateLesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(lessonId);
  const token = localStorage.getItem("token");

  const [initialValues, setInitialValues] = useState({
    title: "",
    content: "",
    duration: "",
  });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:5000/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) =>
          setInitialValues({
            title: data.title,
            content: data.content,
            duration: data.duration,
          })
        )
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isEdit, lessonId, token]);

  const schema = Yup.object({
    title: Yup.string().required("Required"),
    content: Yup.string().required("Required"),
    duration: Yup.number().typeError("Must be a number").required("Required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        title: values.title,
        content: values.content,
        duration: Number(values.duration),
        ...(isEdit ? {} : { course_id: Number(courseId) }),
      };
      const url = isEdit
        ? `http://localhost:5000/lessons/${lessonId}`
        : "http://localhost:5000/lessons";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      navigate(`/instructor/dashboard/courses/${courseId}/lessons/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to save lesson.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="lesson-form-page">
      <h2>{isEdit ? "Edit Lesson" : "Create a New Lesson"}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            <label>Lesson Title:</label>
            <Field name="title" />
            <ErrorMessage name="title" component="div" className="error" />

            <label>Content:</label>
            <Field as="textarea" name="content" />
            <ErrorMessage name="content" component="div" className="error" />

            <label>Duration (min):</label>
            <Field name="duration" />
            <ErrorMessage name="duration" component="div" className="error" />

            <button type="submit" disabled={isSubmitting}>
              {isEdit ? "Save Lesson" : "Create Lesson"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateLesson;
