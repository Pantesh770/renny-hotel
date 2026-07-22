const pool = require('./db');
const bcrypt = require('bcryptjs');

async function initDb() {
  try {
    console.log('--- Database Migration Check ---');

    // 1. Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        city VARCHAR(100) NOT NULL,
        region VARCHAR(100) DEFAULT '',
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stars INT DEFAULT 3,
        rating DECIMAL(3,1) DEFAULT 0,
        address VARCHAR(300),
        contact VARCHAR(100),
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS amenities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotel_amenities (
        hotel_id INT NOT NULL,
        amenity_id INT NOT NULL,
        PRIMARY KEY (hotel_id, amenity_id),
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
        FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        hotel_id INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        user_id INT NOT NULL,
        hotel_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, hotel_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
      );
    `);

    // 2. Perform Schema Migrations (Add missing columns)

    const [hotelCols] = await pool.query('SHOW COLUMNS FROM hotels');
    const colNames = hotelCols.map(c => c.Field);

    if (!colNames.includes('region')) {
      console.log('Migration: Adding region column to hotels...');
      await pool.query("ALTER TABLE hotels ADD COLUMN region VARCHAR(100) DEFAULT '' AFTER city");
    }

    if (!colNames.includes('image2')) {
      console.log('Migration: Adding image2 column to hotels...');
      await pool.query('ALTER TABLE hotels ADD COLUMN image2 VARCHAR(500) AFTER image');
    }

    if (!colNames.includes('image3')) {
      console.log('Migration: Adding image3 column to hotels...');
      await pool.query('ALTER TABLE hotels ADD COLUMN image3 VARCHAR(500) AFTER image2');
    }

    if (!colNames.includes('sound_url')) {
      console.log('Migration: Adding sound_url column to hotels...');
      await pool.query('ALTER TABLE hotels ADD COLUMN sound_url VARCHAR(500) AFTER image3');
    }

    console.log('Database is up to date.');

    // 3. Auto-seed if database is empty
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM hotels');
    if (count === 0) {
      console.log('--- Auto-seeding database ---');
      await autoSeed();
      console.log('Auto-seed complete.');
    }
  } catch (err) {
    console.error('Database migration failed:', err.message);
  }
}

async function autoSeed() {
  const hotels = require('../seeds/hotels_data');
  const amenityCache = {};

  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('user123', 10);
  await pool.query(
    'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
    ['Admin', 'admin@renny.com', adminPass, 'admin', 'John Doe', 'john@renny.com', userPass, 'user']
  );

  for (let i = 0; i < hotels.length; i++) {
    const hotel = hotels[i];
    const [result] = await pool.query(
      'INSERT INTO hotels (name, city, region, description, price, stars, rating, address, contact, image, image2, image3, sound_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [hotel.name, hotel.city, hotel.region || '', hotel.description, hotel.price, hotel.stars, hotel.rating, hotel.address, hotel.contact, hotel.image, hotel.image2 || '', hotel.image3 || '', hotel.sound_url || '']
    );
    for (const amenity of hotel.amenities) {
      if (!amenityCache[amenity]) {
        await pool.query('INSERT IGNORE INTO amenities (name) VALUES (?)', [amenity]);
        const [rows] = await pool.query('SELECT id FROM amenities WHERE name = ?', [amenity]);
        amenityCache[amenity] = rows[0].id;
      }
      await pool.query('INSERT IGNORE INTO hotel_amenities (hotel_id, amenity_id) VALUES (?, ?)',
        [result.insertId, amenityCache[amenity]]);
    }
  }
  console.log(`Seeded ${hotels.length} hotels`);
}

module.exports = initDb;
