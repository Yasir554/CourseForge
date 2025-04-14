import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../style/loginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" or "error"

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://127.0.0.1:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const studentRes = await fetch("http://127.0.0.1:5000/get_all_students", {
          credentials: "include",
        });

        const students = await studentRes.json();
        const student = students.find((c) => c.email === values.email);

        if (!student) {
          const instructorRes = await fetch("http://127.0.0.1:5000/get_all_instructors", {
            credentials: "include",
          });

          const instructors = await instructorRes.json();
          const instructor = instructors.find((c) => c.email === values.email);

          if (!instructor) {
            setAlertMsg("Instructor details not found.");
            setAlertType("error");
            return;
          }

          localStorage.setItem("user", JSON.stringify(instructor));
          setAlertMsg("Login successfully");
          setAlertType("success");
          setTimeout(() => {
            setAlertMsg("");
            navigate("/instructor/dashboard", { state: { user: instructor } });
          }, 1500);
          return;
        } else {
          localStorage.setItem("user", JSON.stringify(student));
          setAlertMsg("Login successfully");
          setAlertType("success");
          setTimeout(() => {
            setAlertMsg("");
            navigate("/student/dashboard", { state: { user: student } });
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        setAlertMsg("Login failed. Check credentials.");
        setAlertType("error");
      }
    },
  });

  return (
    <div className="login-page">
      <h1 className="courseForge">CourseForge</h1>
      <div className="login-container">
        <h2 className="login-h2">Login</h2>

        {/* Custom Alert Box */}
        {alertMsg && (
          <div className={`custom-alert ${alertType}`}>
            {alertMsg}
            <span className="close-alert" onClick={() => setAlertMsg("")}>
              ×
            </span>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="login-form">
          <div className="email">
            <input
              name="email"
              type="text"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error">{formik.errors.email}</div>
            )}
          </div>

          <div className="password">
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error">{formik.errors.password}</div>
            )}
          </div>
          <button type="submit" className="login">
            Log In
          </button>
        </form>

        <p className="redirect-text">
          Don't have an account?{" "}
          <span className="redirect-link" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
