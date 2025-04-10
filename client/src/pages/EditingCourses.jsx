import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EditingCourses = () => {
  const initialValues = { courseTitle: "", description: "" };

  const validationSchema = Yup.object({
    courseTitle: Yup.string().required("Course title is required"),
    description: Yup.string().required("Description is required")
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log("Course data submitted:", values);
    // TODO: Add fetch() call to create/update a course
    setSubmitting(false);
  };

  return (
    <div className="editing-courses-page">
      <h2>Edit Courses</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
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
    </div>
  );
};

export default EditingCourses;
