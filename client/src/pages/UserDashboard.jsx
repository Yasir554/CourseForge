import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/me", {
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
          <p>You are an instructor. Manage your courses below:</p>
          {/* Add instructor content */}
        </div>
      ) : (
        <div>
          <p>You are a student. View your enrolled courses below:</p>
          {/* Add student content */}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
