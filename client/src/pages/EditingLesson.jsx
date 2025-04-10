import React from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EditingLesson = () => {
  const { id } = useParams(); // Lesson ID from URL

  const initialValues = { lessonTitle: "", content: "", duration: "" };

  const validationSchema = Yup.object({
    lessonTitle: Yup.string().required("Lesson title is required"),
    content: Yup.string().required("Content is required"),
    duration: Yup.number()
      .typeError("Duration must be a number")
      .required("Duration is required")
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log(`Lesson ${id} data:`, values);
    // TODO: Add fetch() call to create/update a lesson
    setSubmitting(false);
  };

  return (
    <div className="editing-lesson-page">
      <h2>Edit Lesson {id}</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
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
          <button type="submit">Save Lesson</button>
        </Form>
      </Formik>
    </div>
  );
};

export default EditingLesson;
