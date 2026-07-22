const pool = require('../config/db');

exports.getMine = async (req, res) => {
  try {
    const [favorites] = await pool.query(
      `SELECT h.* FROM hotels h JOIN favorites f ON h.id = f.hotel_id WHERE f.user_id = ? ORDER BY f.created_at DESC`,
      [req.user.id]
    );

    for (let hotel of favorites) {
      const [amenities] = await pool.query(
        `SELECT a.name FROM amenities a JOIN hotel_amenities ha ON a.id = ha.amenity_id WHERE ha.hotel_id = ?`,
        [hotel.id]
      );
      hotel.amenities = amenities.map(a => a.name);
    }

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggle = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const [existing] = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND hotel_id = ?',
      [req.user.id, hotelId]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM favorites WHERE user_id = ? AND hotel_id = ?', [req.user.id, hotelId]);
      res.json({ favorited: false });
    } else {
      await pool.query('INSERT INTO favorites (user_id, hotel_id) VALUES (?, ?)', [req.user.id, hotelId]);
      res.json({ favorited: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.check = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND hotel_id = ?',
      [req.user.id, req.params.hotelId]
    );
    res.json({ favorited: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
