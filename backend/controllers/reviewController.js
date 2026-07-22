const pool = require('../config/db');

exports.getByHotel = async (req, res) => {
  try {
    const [reviews] = await pool.query(
      `SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.hotel_id = ? ORDER BY r.created_at DESC`,
      [req.params.hotelId]
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const hotelId = req.params.hotelId;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment required' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM reviews WHERE user_id = ? AND hotel_id = ?',
      [req.user.id, hotelId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'You already reviewed this hotel' });
    }

    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, hotel_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.id, hotelId, rating, comment]
    );

    const avg = await pool.query(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE hotel_id = ?',
      [hotelId]
    );
    await pool.query('UPDATE hotels SET rating = ? WHERE id = ?', [
      Math.round(avg[0][0].avg_rating * 10) / 10, hotelId
    ]);

    res.status(201).json({ id: result.insertId, message: 'Review created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
