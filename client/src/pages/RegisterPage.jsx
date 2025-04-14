import React, { useState } from "react"; // ✅ Added useState
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../style/RegisterPage.css";
import { useNavigate } from "react-router-dom"; 

const RegisterPage = () => {
  const navigate = useNavigate(); 
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" or "error"

  const initialValues = {
    username: "",
    email: "",
    password: "",
    role: "Student",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().oneOf(["Instructor", "Student"], "Invalid role").required("Role is required"),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        setAlertMsg("Registration successful!");
        setAlertType("success");
        resetForm();
        setTimeout(() => {
          setAlertMsg("");
          navigate("/login");
        }, 1500);
      } else {
        setAlertMsg(data?.error || "Registration failed.");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAlertMsg("An unexpected error occurred during registration.");
      setAlertType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <h1 className="CourseForge">CourseForge</h1>
      <div className="register-container">
        <h2 className="register-h2">Register</h2>

        {/* ✅ Custom alert box */}
        {alertMsg && (
          <div className={`custom-alert ${alertType}`}>
            {alertMsg}
            <span className="close-alert" onClick={() => setAlertMsg("")}>×</span>
          </div>
        )}

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="username">Username:</label>
                <Field type="text" id="username" name="username" />
                <ErrorMessage name="username" component="div" className="error" />
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
              <button type="submit" disabled={isSubmitting} className="reg-btn">
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage;
