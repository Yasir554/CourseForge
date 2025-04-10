import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing components and pages from our folder structure
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import EditingCourses from "./pages/EditingCourses";
import EditingLesson from "./pages/EditingLesson";
import LessonsPage from "./pages/LessonsPage";
import WelcomingPage from "./pages/WelcomingPage";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<WelcomingPage/>}/>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/editing-courses" element={<EditingCourses />} />
          <Route path="/editing-lesson/:id" element={<EditingLesson />} />
          <Route path="/lessons" element={<LessonsPage />} />
          {/* You can add additional routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
