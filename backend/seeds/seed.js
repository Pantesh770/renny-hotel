const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const STORAGE_DIR = path.join(__dirname, '..', 'storage', 'images', 'hotels');

// High-quality stable base fallbacks from Wikimedia/Unsplash (very reliable for downloading)
const FALLBACKS = {
  beach: 'https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&w=1200&q=80',
  safari: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
  city: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
  mountain: 'https://images.unsplash.com/photo-1589553416260-178fa4159f6b?auto=format&fit=crop&w=1200&q=80'
};

/**
 * Downloads an image using curl (most resilient method for hotel sites)
 */
async function downloadImage(url, destPath) {
  if (!url || !url.startsWith('http')) return false;

  // Use weserv proxy to bypass hotlink protection during download
  const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}`;

  try {
    // We use curl because it's better at handling complex SSL and redirects than node-fetch
    execSync(`curl -sL -k --max-time 20 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${proxyUrl}" -o "${destPath}"`, { stdio: 'ignore' });

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 4000) {
      return true;
    }
  } catch (e) {
    // Silence error and try next fallback
  }
  return false;
}

function getExtension(url) {
  return '.jpg'; // Normalize all to jpg for simplicity
}

const hotels = require('./hotels_data');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('🚀 CLEANING DATABASE...');
    await connection.query('CREATE DATABASE IF NOT EXISTS renny_hotels');
    await connection.query('USE renny_hotels');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    const tables = ['favorites', 'reviews', 'hotel_amenities', 'amenities', 'hotels', 'users'];
    for (const t of tables) await connection.query(`DROP TABLE IF EXISTS ${t}`);
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('📝 REBUILDING SCHEMA...');
    await connection.query(`
      CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255), role ENUM('user', 'admin') DEFAULT 'user', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE hotels (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(200), city VARCHAR(100), region VARCHAR(100), description TEXT, price DECIMAL(12,2), stars INT, rating DECIMAL(3,1), address VARCHAR(300), contact VARCHAR(100), image VARCHAR(500), image2 VARCHAR(500), image3 VARCHAR(500), sound_url VARCHAR(500), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE amenities (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) UNIQUE);
      CREATE TABLE hotel_amenities (hotel_id INT, amenity_id INT, PRIMARY KEY (hotel_id, amenity_id), FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE, FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE);
      CREATE TABLE reviews (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, hotel_id INT, rating INT, comment TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE);
      CREATE TABLE favorites (user_id INT, hotel_id INT, PRIMARY KEY (user_id, hotel_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE);
    `);

    console.log('👤 SEEDING DEFAULT USERS...');
    const adminPass = await bcrypt.hash('admin123', 10);
    const userPass = await bcrypt.hash('user123', 10);
    await connection.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?), (?, ?, ?, ?)', ['Admin', 'admin@renny.com', adminPass, 'admin', 'John Doe', 'john@renny.com', userPass, 'user']);

    console.log(`🏨 SEEDING ${hotels.length} HOTELS WITH LOCAL IMAGE STORAGE...`);
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
    const amenityCache = {};

    for (let i = 0; i < hotels.length; i++) {
      const hotel = hotels[i];
      const hotelId = i + 1;
      process.stdout.write(`  [${hotelId}/${hotels.length}] Processing ${hotel.name.substring(0,25)}... `);

      for (let idx = 1; idx <= 3; idx++) {
        const key = `image${idx === 1 ? '' : idx}`;
        let originalUrl = hotel[key];
        const filename = `${hotelId}-${idx}.jpg`;
        const filepath = path.join(STORAGE_DIR, filename);
        const localDbPath = `/storage/images/hotels/${filename}`;

        // 1. Try download original
        let success = await downloadImage(originalUrl, filepath);

        // 2. If original fails, try a themed high-res fallback based on name/region
        if (!success) {
           let fallbackUrl = FALLBACKS.city;
           const searchTerms = (hotel.name + hotel.region + hotel.description).toLowerCase();
           if (searchTerms.includes('beach') || searchTerms.includes('zanzibar') || searchTerms.includes('ocean')) fallbackUrl = FALLBACKS.beach;
           else if (searchTerms.includes('safari') || searchTerms.includes('park') || searchTerms.includes('lodge')) fallbackUrl = FALLBACKS.safari;
           else if (searchTerms.includes('kilimanjaro') || searchTerms.includes('mountain')) fallbackUrl = FALLBACKS.mountain;

           success = await downloadImage(fallbackUrl, filepath);
        }

        hotel[key] = success ? localDbPath : originalUrl;
      }

      // Save to DB
      const [result] = await connection.query(
        'INSERT INTO hotels (name, city, region, description, price, stars, rating, address, contact, image, image2, image3, sound_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [hotel.name, hotel.city, hotel.region, hotel.description, hotel.price, hotel.stars, hotel.rating, hotel.address, hotel.contact, hotel.image, hotel.image2, hotel.image3, hotel.sound_url]
      );

      // Save Amenities
      for (const amenity of hotel.amenities) {
        if (!amenityCache[amenity]) {
          await connection.query('INSERT IGNORE INTO amenities (name) VALUES (?)', [amenity]);
          const [rows] = await connection.query('SELECT id FROM amenities WHERE name = ?', [amenity]);
          amenityCache[amenity] = rows[0].id;
        }
        await connection.query('INSERT IGNORE INTO hotel_amenities (hotel_id, amenity_id) VALUES (?, ?)', [result.insertId, amenityCache[amenity]]);
      }
      console.log('✓');
    }

    console.log('\n✅ DONE! Hotels seeded and images saved to /backend/storage/images/hotels/');
  } catch (err) {
    console.error('\n❌ SEED FAILED:', err);
  } finally {
    await connection.end();
  }
}

seed();
