import React, { useEffect, useState } from "react";

const CourseList = ({ courses }) =>
  courses.length > 0 ? (
    <div>
      {courses.map(({ id, name },) => (
        <div key={id}>
          <strong>{name}</strong>
          <button>continue</button>
        </div>
      ))}
    </div>
  ) : null;

const UserDashboardStudent = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let parsed = null;
    try {
      const raw = localStorage.getItem("user");
      if (raw) parsed = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
    setUser(parsed);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    fetch("http://127.0.0.1:5000/logout", { method: "POST", credentials: "include" })
      .then(() => {
        localStorage.removeItem("user");
        window.location.href = "/";
      })
      .catch((err) => console.error("Logout failed", err));
  };

  if (loading) return <div>Loading your dashboard…</div>;
  if (!user) return <div>Please log in to view your dashboard.</div>;

  if (user.role === "Instructor") {
    return <div>This page is for students only.</div>;
  }

  const { username, courses = [] } = user;

  return (
    <div>
      <div>
        <h2 className="CourseForge" >CourseForge</h2>
        <p>Student</p>
      </div>

      <div>
        <button onClick={handleLogout} className="Log out" >Log Out</button>
        <h1 className="h1" >Student Dashboard</h1>
        <h2 className="h2" >Welcome, {username}!</h2>
        <h3 className="h3" >Your Enrolled Courses</h3>

        {courses.length > 0 ? (
          <CourseList courses={courses} />
        ) : (
          <p className="statement" >You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboardStudent;
