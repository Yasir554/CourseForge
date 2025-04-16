import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WelcomingPage from "./pages/WelcomingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Student pages
import UserDashboardStudent from "./pages/UserDashboard_Student";
import StudentCoursePage from "./pages/coursePage_Student";
import LessonsPage_Student from "./pages/LessonsPage_Student";

// Instructor pages
import UserDashboardInstructor from "./pages/UserDashboard_Instructor";
import InstructorCoursePage from "./pages/coursePage_Instructor";
import LessonsPage_Instructor from "./pages/LessonsPage_Instructor";
import CreateLesson from "./pages/CreateLesson";
import DeleteLesson from "./pages/DeleteLesson";
import DeleteLessonChooser from "./pages/DeleteLessonChooser"; // NEW
import CreateCourse from "./pages/CreateCourse";
import DeleteCourse from "./pages/DeleteCourse";

function App() {
  return (
    <Router>
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<WelcomingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Instructor routes */}
          <Route path="/instructor/dashboard" element={<UserDashboardInstructor />} />
          <Route path="/instructor/dashboard/courses" element={<UserDashboardInstructor />} />
          <Route path="/instructor/dashboard/courses/new" element={<CreateCourse />} />
          <Route path="/instructor/dashboard/courses/:courseId" element={<InstructorCoursePage />} />
          <Route path="/instructor/dashboard/courses/:courseId/edit" element={<CreateCourse />} />
          <Route path="/instructor/dashboard/courses/delete" element={<DeleteCourse />} />

          <Route path="/instructor/dashboard/courses/:courseId/lessons" element={<LessonsPage_Instructor />} />
          <Route path="/instructor/dashboard/courses/:courseId/lessons/new" element={<CreateLesson />} />
          <Route path="/instructor/dashboard/courses/:courseId/lessons/:lessonId" element={<LessonsPage_Instructor />} />
          <Route path="/instructor/dashboard/courses/:courseId/lessons/:lessonId/edit" element={<CreateLesson />} />
          <Route path="/instructor/dashboard/courses/:courseId/lessons/:lessonId/delete" element={<DeleteLesson />} />
          <Route path="/instructor/dashboard/courses/:courseId/lessons/delete/choose" element={<DeleteLessonChooser />} /> {/* NEW */}

          {/* Student routes */}
          <Route path="/student/dashboard" element={<UserDashboardStudent />} />
          <Route path="/student/dashboard/courses/:courseId" element={<StudentCoursePage />} />
          <Route path="/student/dashboard/courses/:courseId/lessons" element={<LessonsPage_Student />} />
          <Route path="/student/dashboard/courses/:courseId/lessons/:lessonId" element={<LessonsPage_Student />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
