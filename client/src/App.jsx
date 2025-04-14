import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WelcomingPage from "./pages/WelcomingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Student pages
import UserDashboard_Student from "./pages/UserDashboard_Student";
import CoursePage_Student from "./pages/coursePage_Student";
import LessonsPage_Student from "./pages/LessonsPage_Student";

// Instructor pages
import UserDashboard_Instructor from "./pages/UserDashboard_Instructor";
import CoursePage_Instructor from "./pages/coursePage_Instructor";
import LessonsPage_Instructor from "./pages/LessonsPage_Instructor";
import EditingLesson from "./pages/EditingLesson";
import CreateCourse from "./pages/CreateCourse";
import DeleteCourse from "./pages/DeleteCourse";

function App() {
  return (
    <Router>
      <div>
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<WelcomingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Instructor routes */}
            <Route path="/instructor/dashboard" element={<UserDashboard_Instructor />} />
            <Route path="/instructor/dashboard/courses" element={<UserDashboard_Instructor />} />
            <Route path="/instructor/dashboard/courses/new" element={<CreateCourse />} />
            <Route path="/instructor/dashboard/courses/:courseId" element={<CoursePage_Instructor />} />
            <Route path="/instructor/dashboard/courses/delete" element={<DeleteCourse />} />
            <Route path="/instructor/dashboard/courses/:courseId/lessons" element={<LessonsPage_Instructor />} />
            <Route path="/instructor/dashboard/courses/:courseId/lessons/:lessonId" element={<LessonsPage_Instructor />} />
            <Route path="/instructor/dashboard/courses/:courseId/lessons/new" element={<EditingLesson />} />
            <Route path="/instructor/dashboard/courses/:courseId/lessons/:lessonId/edit" element={<EditingLesson />} />
            <Route path="/instructor/dashboard/courses/:courseId/lessons/delete" element={<EditingLesson />} />
            <Route path="/instructor/dashboard/courses/:id/edit" element={<CreateCourse />} />
            <Route path="/create" element={<CreateCourse />} />
            <Route path="/delete" element={<DeleteCourse />} />

            {/* Student routes */}
            <Route path="/student/dashboard" element={<UserDashboard_Student />} />
            <Route path="/student/dashboard/courses/:courseId" element={<CoursePage_Student />} />
            <Route path="/student/dashboard/courses/:courseId/lessons" element={<LessonsPage_Student />} />
            <Route path="/student/dashboard/courses/:courseId/lessons/:lessonId" element={<LessonsPage_Student />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
