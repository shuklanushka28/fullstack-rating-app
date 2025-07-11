import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home"; 
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import AdminLogin from "./pages/AdminLogin";
import StoreOwnerLogin from "./pages/StoreOwnerLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/store" element={<StoreOwnerLogin />} />
        <Route path="/signup" element={<UserSignup />} />

        <Route
          path="/admin"
          element={token && role === "admin" ? <AdminDashboard /> : <Navigate to="/login/admin" />}
        />
        <Route
          path="/user"
          element={token && role === "user" ? <UserDashboard /> : <Navigate to="/login/user" />}
        />
        <Route
          path="/store"
          element={token && role === "store_owner" ? <StoreOwnerDashboard /> : <Navigate to="/login/store" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
