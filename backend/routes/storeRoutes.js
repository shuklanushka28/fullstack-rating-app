const express = require('express');
const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ GET /api/stores?name=&address=
router.get('/stores', verifyToken, async (req, res) => {
  try {
    const { name, address } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where: whereClause,
      include: [
        {
          model: Rating,
          attributes: ['rating', 'userId']
        },
        {
          model: User,
          as: 'owner',
          attributes: ['name', 'email']
        }
      ],
    });

    // Format with average rating
    const formatted = stores.map(store => {
      const ratings = store.Ratings;
      const avgRating =
        ratings.length > 0
          ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(2)
          : 'No ratings';

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerName: store.owner?.name,
        averageRating: avgRating,
        ratings
      };
    });

    res.json({ stores: formatted });
  } catch (err) {
    console.error("❌ Store fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// POST /api/ratings
router.post('/ratings', verifyToken, async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.id;

  try {
    // Check if rating exists already
    const existing = await Rating.findOne({ where: { userId, storeId } });

    if (existing) {
      return res.status(400).json({ message: 'Rating already exists. Use PUT to update.' });
    }

    const newRating = await Rating.create({ storeId, userId, rating });
    res.status(201).json({ message: 'Rating submitted', rating: newRating });
  } catch (err) {
    console.error("❌ Submit rating error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/ratings/:storeId
router.put('/ratings/:storeId', verifyToken, async (req, res) => {
  const { rating } = req.body;
  const { storeId } = req.params;
  const userId = req.user.id;

  try {
    const existing = await Rating.findOne({ where: { storeId, userId } });

    if (!existing) {
      return res.status(404).json({ message: 'No existing rating found for update' });
    }

    existing.rating = rating;
    await existing.save();

    res.json({ message: 'Rating updated', rating: existing });
  } catch (err) {
    console.error("❌ Update rating error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// GET /api/store-owner/dashboard
router.get('/store-owner/dashboard', verifyToken, async (req, res) => {
  if (req.user.role !== 'store_owner') {
    return res.status(403).json({ message: 'Access denied: Store owners only' });
  }

  try {
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Rating,
          include: [{ model: User, attributes: ['id', 'name', 'email'] }]
        }
      ]
    });

    const data = stores.map(store => ({
      id: store.id,
      name: store.name,
      averageRating:
        store.ratings.length > 0
          ? (
              store.ratings.reduce((sum, r) => sum + r.rating, 0) /
              store.ratings.length
            ).toFixed(2)
          : "No ratings",
      ratings: store.ratings.map(r => ({
        userId: r.user.id,
        userName: r.user.name,
        userEmail: r.user.email,
        rating: r.rating
      }))
    }));

    res.json({ stores: data });
  } catch (err) {
    console.error("❌ Store Owner Dashboard Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;
