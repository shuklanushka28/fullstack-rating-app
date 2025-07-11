console.log("server.js loaded");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const storeRoutes = require("./routes/storeRoutes"); 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
console.log("Auth routes registered");

app.use("/api/admin", adminRoutes);
console.log(" Admin routes registered");

app.use("/api/protected", protectedRoutes);
console.log("Protected routes registered");

app.use("/api", storeRoutes); // 
console.log(" Store routes registered");

app.get("/", (req, res) => {
  res.send(" Backend API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
