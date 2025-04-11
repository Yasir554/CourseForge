import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import WelcomingPage from "./pages/WelcomingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
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
            <Route exact path="/" element={<WelcomingPage />} />
            <Route exact path="/register" element={<RegisterPage />} />
            <Route exact path="/login" element={<LoginPage />} />

            {/* Dashboard */}
            <Route path="/student/dashboard" element={<UserDashboard />} />
            <Route path="/instructor/dashboard" element={<UserDashboard />} />

            {/* Courses & Lessons */}
            <Route path="/courses/:courseId" element={<CoursePage />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />

            {/* Editing routes for instructors */}
            <Route path="/instructor/lessons/new" element={<EditingLesson />} />
            <Route path="/instructor/lessons/:id/edit" element={<EditingLesson />} />
            <Route path="/instructor/courses/new" element={<EditingCourses />} />
            <Route path="/instructor/courses/:id/edit" element={<EditingCourses />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
