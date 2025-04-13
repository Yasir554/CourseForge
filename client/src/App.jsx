import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import WelcomingPage from "./pages/WelcomingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard_Student from "./pages/UserDashboard_Student";
import UserDashboard_Instructor from "./pages/UserDashboard_Instructor";
import CoursePage from "./pages/coursePage";
import LessonPage from "./pages/LessonsPage";
import EditingLesson from "./pages/EditingLesson";
import EditingCourses from "./pages/EditingCourses";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<WelcomingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* Dashboard Routes */}
            <Route path="/student/dashboard" element={<UserDashboard_Student />} />
            <Route path="/instructor/dashboard" element={<UserDashboard_Instructor />} />
            {/* Courses & Lessons */}
            <Route path="/instructor/dashboard/courses/:courseId" element={<CoursePage />} />
            <Route path="/instructor/dashboard/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/student/dashboard/courses/:courseId" element={<CoursePage />} />
            <Route path="/student/dashboard/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
            {/* Editing routes for instructors */}
            <Route path="/instructor/dashboard/courses/:courseId/lessons/new" element={<EditingLesson />} />
            <Route path="/instructor/dashboard/courses/:courseId/lessons/:lessonId/edit" element={<EditingLesson />} />
            <Route path="/instructor/dashboard/courses/new" element={<EditingCourses />} />
            <Route path="/instructor/dashboard/courses/:id/edit" element={<EditingCourses />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
