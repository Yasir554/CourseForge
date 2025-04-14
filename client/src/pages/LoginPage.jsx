/* import React, { useEffect } from "react"; */
import { useNavigate } from "react-router-dom";
import { useFormik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
<div className='log-container'>
<h2>Login</h2>
<div className="container">
  <div className="screen_sign">
    <div className="screen__content">
      <form onSubmit={formik.handleSubmit} className="login">
  
        <div className="login__field">
          <i className="login__icon fas fa-user"></i>
          <input
            name="email"
            type="text"
            className="login__input"
            placeholder="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div>{formik.errors.email}</div>
          )}
        </div>
  
        <div className="login__field">
          <i className="login__icon fas fa-lock"></i>
          <input
            name="password"
            type="password"
            className="login__input"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div>{formik.errors.password}</div>
          )}
        </div>
  
        <button type="submit" className="button login__submit">
          <span className="button__text">Log In</span>
          <i className="button__icon fas fa-chevron-right"></i>
        </button>
      </form>
  
      <div className="social-login">
        <div className='sign'></div>
          <div className="social-icons">
          <h4>Log in Form</h4></div>
        </div>
    </div>
    <div className="screen__background">
      <span className="screen__background__shape screen__background__shape4"></span>
      <span className="screen__background__shape screen__background__shape3"></span>
      <span className="screen__background__shape screen__background__shape2"></span>
      <span className="screen__background__shape screen__background__shape1"></span>
    </div>
  </div>
</div>
  </div>
  
  );
};


export default LoginPage;
