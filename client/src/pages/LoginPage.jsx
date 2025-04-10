import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const initialValues = {
    email: "",
    password: ""
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log("Login form data:", values);
    // TODO: Replace the console log with a fetch() call to your backend API for authentication
    setSubmitting(false);
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>
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
          <Link to="/dashboard">
            <button type="submit">
              Login
            </button>
          </Link>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginPage;
