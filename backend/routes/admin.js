const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const [[{ total: hotels }]] = await pool.query('SELECT COUNT(*) as total FROM hotels');
    const [[{ total: users }]] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [[{ total: reviews }]] = await pool.query('SELECT COUNT(*) as total FROM reviews');
    const [[{ total: favorites }]] = await pool.query('SELECT COUNT(*) as total FROM favorites');
    res.json({ hotels, users, reviews, favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id/role', auth, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ message: 'User role updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE user_id = ?', [req.params.id]);
    await pool.query('DELETE FROM favorites WHERE user_id = ?', [req.params.id]);
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reviews', auth, adminOnly, async (req, res) => {
  try {
    const [reviews] = await pool.query(
      `SELECT r.*, u.name as user_name, h.name as hotel_name
       FROM reviews r JOIN users u ON r.user_id = u.id
       JOIN hotels h ON r.hotel_id = h.id
       ORDER BY r.created_at DESC`
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
