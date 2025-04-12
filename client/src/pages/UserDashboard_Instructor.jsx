import React, { useEffect, useState } from "react";

const UserDashboard_Instructor = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
    console.log("User data from localStorage:", user);
  }, []);

  if (!user) return <div>Please log in to view your dashboard.</div>;

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      {user.role === "Instructor" ? (
        <div>
          <h3>Your Courses (Instructor View)</h3>
          {user.courses && user.courses.length > 0 ? (
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
          <h3>Your Enrolled Courses (Instructor View)</h3>
          {user.courses && user.courses.length > 0 ? (
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

export default UserDashboard_Instructor;
