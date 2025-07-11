import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🏪 Welcome to the Store Rating Platform</h1>
      <p>Select a login option:</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
        <Link to="/login/user"><button>User Login</button></Link>
        <Link to="/login/admin"><button>Admin Login</button></Link>
        <Link to="/login/store"><button>Store Owner Login</button></Link>
        <Link to="/signup"><button>Signup (User)</button></Link>
      </div>
    </div>
  );
};

export default Home;
