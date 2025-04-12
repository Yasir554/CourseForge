import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginPage = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  // Check login status on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/check-auth", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Already logged in:", data);
          navigate("/student/dashboard"); // or instructor/dashboard based on user data
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        // Save user role in localStorage for Navbar and routing purposes
        localStorage.setItem("userRole", data.role);
        navigate(data.role === "Instructor" ? "/instructor/dashboard" : "/student/dashboard");
      } else {
        alert(data?.error || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page" style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
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
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
