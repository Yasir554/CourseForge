/* import React, { useEffect } from "react"; */
import { useNavigate } from "react-router-dom";
import { useFormik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../style/loginPage.css"


const LoginPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues : {
      email: "",
      password: "",
    },
   validationSchema : Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    }),
  
    onSubmit : async (values) => {
      try {
        const response = await fetch("http://127.0.0.1:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        })

        if (!response.ok) {
          throw new Error('Login failed');
        }

       /*  const result = await response.json();
          alert(result.Message);*/

        // Now fetch the logged-in user's data
        const studentRes = await fetch("http://127.0.0.1:5000/get_all_students", {
          credentials: 'include',
        });

        const students = await studentRes.json();
        const student = students.find(c => c.email === values.email);

        if (!student) {
          const instructorRes = await fetch("http://127.0.0.1:5000/get_all_instructors", {
            credentials: 'include',
          });
  
          const instructors = await instructorRes.json();
          const instructor = instructors.find(c => c.email === values.email);
  
          if (!instructor) {
            alert("Instructor details not found.");
            return;
          }
  
          localStorage.setItem("user", JSON.stringify(instructor));
          alert("Login successfully");
          navigate('/instructor/dashboard', { state: { user: instructor } });
  
          return;
        } else{

        localStorage.setItem("user", JSON.stringify(student));
        alert("Login successfully");
        navigate('/student/dashboard', { state: { user: student } });
        }
      } catch (err) {
        console.error(err);
        alert('Login failed. Check credentials.');
      }
    }
  });

  return (
    <div className="login-page">
      <h1 className="CourseForge">CourseForge</h1>
      <div className="login-container">
        <h2 className="login-h2">Login</h2>
        <form onSubmit={formik.handleSubmit} className="login-form">
          <div className="email">
            <input name="email" type="text" placeholder="Email" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
            {formik.touched.email && formik.errors.email && ( <div className="error">{formik.errors.email}</div>)}
          </div>

          <div className="password">
            <input name="password" type="password" placeholder="Password" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
            {formik.touched.password && formik.errors.password && ( <div className="error">{formik.errors.password}</div> )}
          </div>
          <button type="submit" className="login">Log In</button>
        </form>
      </div>
    </div>
  );
};


export default LoginPage;
