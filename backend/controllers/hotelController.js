const pool = require('../config/db');

function getFallbackHotels() {
  const data = require('../seeds/hotels_data');
  return data.map((h, i) => ({ id: i + 1, ...h }));
}

function getFallbackById(id) {
  return getFallbackHotels().find(h => h.id === parseInt(id)) || null;
}

function getFallbackCities() {
  return [...new Set(getFallbackHotels().map(h => h.city))].sort();
}

function getFallbackRegions() {
  return [...new Set(getFallbackHotels().map(h => h.region).filter(Boolean))].sort();
}

function getFallbackAmenities() {
  const all = new Set();
  getFallbackHotels().forEach(h => (h.amenities || []).forEach(a => all.add(a)));
  return [...all].sort().map(name => ({ id: 0, name }));
}

exports.getAll = async (req, res) => {
  try {
    const { city, region, minPrice, maxPrice, minStars, amenity } = req.query;
    let sql = `SELECT DISTINCT h.* FROM hotels h`;
    const params = [];
    const conditions = [];

    if (amenity) {
      sql += ` JOIN hotel_amenities ha ON h.id = ha.hotel_id JOIN amenities a ON ha.amenity_id = a.id`;
      conditions.push(`a.name = ?`);
      params.push(amenity);
    }

    if (city) {
      conditions.push(`h.city LIKE ?`);
      params.push(`%${city}%`);
    }
    if (region) {
      conditions.push(`h.region LIKE ?`);
      params.push(`%${region}%`);
    }
    if (minPrice) {
      conditions.push(`h.price >= ?`);
      params.push(parseInt(minPrice));
    }
    if (maxPrice) {
      conditions.push(`h.price <= ?`);
      params.push(parseInt(maxPrice));
    }
    if (minStars) {
      conditions.push(`h.stars >= ?`);
      params.push(parseInt(minStars));
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` ORDER BY h.name`;

    const [hotels] = await pool.query(sql, params);

    for (let hotel of hotels) {
      const [amenities] = await pool.query(
        `SELECT a.name FROM amenities a JOIN hotel_amenities ha ON a.id = ha.amenity_id WHERE ha.hotel_id = ?`,
        [hotel.id]
      );
      hotel.amenities = amenities.map(a => a.name);
    }

    res.json(hotels);
  } catch (err) {
    console.warn('DB hotels query failed, using fallback data:', err.message);
    res.json(getFallbackHotels());
  }
};

exports.getById = async (req, res) => {
  try {
    const [hotels] = await pool.query('SELECT * FROM hotels WHERE id = ?', [req.params.id]);
    if (hotels.length === 0) {
      const fallback = getFallbackById(req.params.id);
      if (fallback) return res.json({ ...fallback, reviews: [] });
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const hotel = hotels[0];
    const [amenities] = await pool.query(
      `SELECT a.name FROM amenities a JOIN hotel_amenities ha ON a.id = ha.amenity_id WHERE ha.hotel_id = ?`,
      [hotel.id]
    );
    hotel.amenities = amenities.map(a => a.name);

    const [reviews] = await pool.query(
      `SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.hotel_id = ? ORDER BY r.created_at DESC`,
      [hotel.id]
    );
    hotel.reviews = reviews;

    res.json(hotel);
  } catch (err) {
    console.warn('DB getById failed, using fallback:', err.message);
    const fallback = getFallbackById(req.params.id);
    if (fallback) return res.json({ ...fallback, reviews: [] });
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, city, region, description, price, stars, rating, address, contact, image, image2, image3, amenities } = req.body;
    const [result] = await pool.query(
      'INSERT INTO hotels (name, city, region, description, price, stars, rating, address, contact, image, image2, image3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, city, region, description, price, stars || 3, rating || 0, address, contact, image, image2, image3]
    );

    if (amenities && amenities.length > 0) {
      for (const amenity of amenities) {
        let [existing] = await pool.query('SELECT id FROM amenities WHERE name = ?', [amenity]);
        let amenityId;
        if (existing.length === 0) {
          const [ins] = await pool.query('INSERT INTO amenities (name) VALUES (?)', [amenity]);
          amenityId = ins.insertId;
        } else {
          amenityId = existing[0].id;
        }
        await pool.query('INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (?, ?)', [result.insertId, amenityId]);
      }
    }

    res.status(201).json({ id: result.insertId, message: 'Hotel created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, city, region, description, price, stars, rating, address, contact, image, image2, image3 } = req.body;
    await pool.query(
      'UPDATE hotels SET name=?, city=?, region=?, description=?, price=?, stars=?, rating=?, address=?, contact=?, image=?, image2=?, image3=? WHERE id=?',
      [name, city, region, description, price, stars, rating, address, contact, image, image2, image3, req.params.id]
    );
    res.json({ message: 'Hotel updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM hotel_amenities WHERE hotel_id = ?', [req.params.id]);
    await pool.query('DELETE FROM reviews WHERE hotel_id = ?', [req.params.id]);
    await pool.query('DELETE FROM favorites WHERE hotel_id = ?', [req.params.id]);
    await pool.query('DELETE FROM hotels WHERE id = ?', [req.params.id]);
    res.json({ message: 'Hotel deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCities = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT city FROM hotels ORDER BY city');
    res.json(rows.map(r => r.city));
  } catch (err) {
    console.warn('DB getCities failed, using fallback:', err.message);
    res.json(getFallbackCities());
  }
};

exports.getRegions = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT region FROM hotels ORDER BY region');
    res.json(rows.map(r => r.region));
  } catch (err) {
    console.warn('DB getRegions failed, using fallback:', err.message);
    res.json(getFallbackRegions());
  }
};

exports.getAmenities = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM amenities ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.warn('DB getAmenities failed, using fallback:', err.message);
    res.json(getFallbackAmenities());
  }
};
