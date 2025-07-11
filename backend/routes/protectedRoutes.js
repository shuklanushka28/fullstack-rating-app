const express = require("express");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Protected GET route
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.email}, this is your protected dashboard!`,
    user: req.user
  });
});

module.exports = router;
