const express = require('express');
const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');
const bcrypt = require("bcrypt");
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Admin-only middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// ✅ GET /api/admin/stats - Dashboard Metrics
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  console.log("📊 [ADMIN] GET /stats hit");

  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error("❌ Error fetching admin stats:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /api/admin/users - Add new user (admin/normal)
router.post('/users', verifyToken, isAdmin, async (req, res) => {
  console.log("👤 [ADMIN] POST /users hit");

  try {
    const {
      name = "",
      email = "",
      password = "",
      address = "",
      role = ""
    } = req.body;

    if (!name.trim() || !email.trim() || !password.trim() || !role.trim()) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { email: email.trim() } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      address: address.trim(),
      role: role.trim(),
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (err) {
    console.error("❌ Admin Create User Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ GET /api/admin/users?name=&email=&address=&role=
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  console.log("🔍 [ADMIN] GET /users hit");

  try {
    const {
      name = "",
      email = "",
      address = "",
      role = ""
    } = req.query;

    const whereClause = {};

    if (name.trim()) whereClause.name = { [Op.iLike]: `%${name.trim()}%` };
    if (email.trim()) whereClause.email = { [Op.iLike]: `%${email.trim()}%` };
    if (address.trim()) whereClause.address = { [Op.iLike]: `%${address.trim()}%` };
    if (role.trim()) whereClause.role = role.trim();

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'address', 'role'],
      order: [['name', 'ASC']],
    });

    res.json({ users });
  } catch (err) {
    console.error("❌ Admin Get Users Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ POST /api/admin/stores - Add a new store
router.post('/stores', verifyToken, isAdmin, async (req, res) => {
  console.log("🏪 [ADMIN] POST /stores hit");

  try {
    const {
      name = "",
      email = "",
      address = "",
      ownerId
    } = req.body;

    if (!name.trim() || !email.trim() || !address.trim() || !ownerId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const owner = await User.findOne({ where: { id: ownerId, role: 'store_owner' } });

    if (!owner) {
      return res.status(400).json({ message: "Invalid store owner ID or role" });
    }

    const newStore = await Store.create({
      name: name.trim(),
      email: email.trim(),
      address: address.trim(),
      ownerId
    });

    res.status(201).json({
      message: "Store created successfully",
      store: newStore
    });

  } catch (err) {
    console.error("❌ Admin Add Store Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
