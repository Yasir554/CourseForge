import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

import WelcomingPage    from './pages/WelcomingPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import HomePage         from './pages/HomePage';
import LessonsPage      from './pages/LessonsPage';
import UserDashboard    from './pages/UserDashboard';
import EditingCourses   from './pages/EditingCourses';
import EditingLesson    from './pages/EditingLesson';

export default function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main>
        <Routes>
          <Route path="/"                element={<WelcomingPage />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />

          <Route path="/home"            element={<HomePage />} />
          <Route path="/courses/:id"     element={<LessonsPage />} />

          <Route path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/courses/new"
            element={
              <ProtectedRoute role="Instructor">
                <EditingCourses />
              </ProtectedRoute>
            }
          />
          <Route path="/courses/:id/edit"
            element={
              <ProtectedRoute role="Instructor">
                <EditingCourses />
              </ProtectedRoute>
            }
          />
          <Route path="/courses/:courseId/lessons/new"
            element={
              <ProtectedRoute role="Instructor">
                <EditingLesson />
              </ProtectedRoute>
            }
          />
          <Route path="/courses/:courseId/lessons/:lessonId/edit"
            element={
              <ProtectedRoute role="Instructor">
                <EditingLesson />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </AuthProvider>
  );
}
