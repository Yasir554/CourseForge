import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please log in to view your dashboard.</div>;

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>

      {user.role === "Instructor" ? (
        <div>
          <h3>Your Courses (Instructor View)</h3>
          {user.courses.length > 0 ? (
            <ul>
              {user.courses.map((course) => (
                <li key={course.id}>{course.name}</li>
              ))}
            </ul>
          ) : (
            <p>You haven't created any courses yet.</p>
          )}
        </div>
      ) : (
        <div>
          <h3>Your Enrolled Courses (Student View)</h3>
          {user.courses.length > 0 ? (
            <ul>
              {user.courses.map((course) => (
                <li key={course.id}>{course.name}</li>
              ))}
            </ul>
          ) : (
            <p>You are not enrolled in any courses yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
