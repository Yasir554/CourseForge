import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const RegisterPage = () => {
  // Initial form values
  const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "Student",
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: Yup.string().oneOf(["Instructor", "Student"], "Invalid role").required("Role is required"),
  });

  // Form submission handler
  const onSubmit = (values, { setSubmitting }) => {
    console.log("Register form data:", values);
    // TODO: Replace console log with API call to your Flask backend for registration
    setSubmitting(false);
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>
          <div>
            <label htmlFor="name">Name:</label>
            <Field type="text" id="name" name="name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="role">Role:</label>
            <Field as="select" id="role" name="role">
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </Field>
            <ErrorMessage name="role" component="div" className="error" />
          </div>
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default RegisterPage;
