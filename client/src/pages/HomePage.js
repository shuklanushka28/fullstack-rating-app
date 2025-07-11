import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🏪 Welcome to AppStore Platform</h1>
      <p>Please select your role to continue:</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "200px", margin: "2rem auto" }}>
        <Link to="/signup/user">
          <button style={{ width: "100%" }}> User Signup</button>
        </Link>
        <Link to="/login/user">
          <button style={{ width: "100%" }}>User Login</button>
        </Link>
        <Link to="/login/user">
          <button style={{ width: "100%" }}>Admin Login</button>
        </Link>
        {/* Optional store owner route */}
        {/* <Link to="/login/store">
          <button style={{ width: "100%" }}>🏬 Store Owner Login</button>
        </Link> */}
      </div>
    </div>
  );
};

export default HomePage;
