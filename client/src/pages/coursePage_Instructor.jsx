import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InstructorCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [courseTitle, setCourseTitle] = useState("Course Title");

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/courses/${courseId}/lessons`)
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((error) => console.error("Error fetching lessons:", error));

    fetch(`http://127.0.0.1:5000/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => setCourseTitle(data.courseTitle || "Course Title"))
      .catch((error) => console.error("Error fetching course details:", error));
  }, [courseId]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col justify-start">
        <h2 className="text-2xl font-bold mb-6">CourseForge</h2>
        <p className="font-medium mb-8">Instructor</p>
        <nav className="space-y-4 text-sm">
          <button onClick={() => navigate("/instructor/dashboard")} className="btn" > All Courses </button>
          <button onClick={() => navigate(`/instructor/dashboard/courses/${courseId}/lessons/new`)} className="btn" > Create Lesson </button>
          <button onClick={() => navigate("/instructor/dashboard/courses/${courseId}/lessons/delete")} className="btn" > Delete Lesson </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{courseTitle}</h1>
        </div>

        <section className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-gray-200 p-4 rounded flex items-center justify-between"
            >
              <span className="font-medium">{lesson.lessonTitle || lesson.title}</span>
              <div className="space-x-2">
                <button
                  onClick={() =>
                    navigate(`/instructor/dashboard/courses/${courseId}/lessons/${lesson.id}/edit`)
                  }
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    navigate(`/instructor/dashboard/courses/${courseId}/lessons/${lesson.id}`)
                  }
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Continue
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default InstructorCoursePage;
