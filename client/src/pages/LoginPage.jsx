import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../style/loginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" or "error"

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://127.0.0.1:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!response.ok) throw new Error("Login failed");

        const { user, access_token } = await response.json();
        // Store user and token
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", access_token);

        setAlertMsg("Login successful");
        setAlertType("success");
        setTimeout(() => {
          setAlertMsg("");
          if (user.role === "Instructor") {
            navigate("/instructor/dashboard", { state: { user } });
          } else {
            navigate("/student/dashboard", { state: { user } });
          }
        }, 1500);
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
        {alertMsg && (
          <div className={`custom-alert ${alertType}`}>
            {alertMsg}
            <span className="close-alert" onClick={() => setAlertMsg("")}>×</span>
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
            {formik.touched.email && formik.errors.email && <div className="error">{formik.errors.email}</div>}
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
            {formik.touched.password && formik.errors.password && <div className="error">{formik.errors.password}</div>}
          </div>
          <button type="submit" className="login">
            Log In
          </button>
        </form>
        <p className="redirect-text">
          Don't have an account?{" "}
          <span className="redirect-link" onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
