/**
 * update_images.js — Comprehensive hotel image downloader
 *
 * For each of the 93 Tanzania hotels, attempts to download 3 real images
 * using multiple strategies, saves to backend/storage/images/hotels/{id}-{idx}.*,
 * and updates the database with local paths.
 *
 * Usage: node seeds/update_images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const mysql = require('mysql2/promise');

// ── Config ──────────────────────────────────────────────────────────────
const STORAGE_DIR = path.resolve(__dirname, '..', 'storage', 'images', 'hotels');
const MIN_VALID_SIZE = 4000;
const CURL_TIMEOUT = 25;

// ── Load hotels_data.js (93 hotels) ─────────────────────────────────────
const hotels = require('./hotels_data');
console.log(`Loaded ${hotels.length} hotels from hotels_data.js\n`);

// ── DB connection ───────────────────────────────────────────────────────
let db;
async function connectDB() {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
  db = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'renny_hotels',
    waitForConnections: true,
    connectionLimit: 3,
  });
}

// ── Utility ─────────────────────────────────────────────────────────────
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fileSize(p) {
  try { return fs.statSync(p).size; } catch { return 0; }
}

function validFile(p) {
  return fs.existsSync(p) && fileSize(p) >= MIN_VALID_SIZE;
}

function curl(url, output, timeout = CURL_TIMEOUT, referer = '') {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
  const ref = referer ? `-H "Referer: ${referer}"` : '';
  const cmd = [
    'curl', '-s', '-S', '-L',
    '--max-time', String(timeout),
    '--connect-timeout', '8',
    '-A', `"${ua}"`,
    '-H', '"Accept: image/avif,image/webp,image/apng,image/*,*/*;q=0.8"',
    '-H', '"Accept-Language: en-US,en;q=0.9"',
    ref,
    '-o', `"${output}"`,
    `"${url}"`,
  ].filter(Boolean).join(' ');
  try {
    execSync(cmd, { stdio: 'pipe', timeout: (timeout + 10) * 1000 });
    return validFile(output);
  } catch { return false; }
}

function downloadTry(url, outputPath, timeout = CURL_TIMEOUT, referer = '') {
  if (validFile(outputPath)) return true;
  const tmp = outputPath + '.tmp';
  const ok = curl(url, tmp, timeout, referer);
  if (ok) {
    fs.renameSync(tmp, outputPath);
    return true;
  }
  try { fs.unlinkSync(tmp); } catch {}
  return false;
}

function detectExt(filePath) {
  try {
    const buf = fs.readFileSync(filePath).slice(0, 4);
    const hex = buf.toString('hex').toUpperCase();
    if (hex.startsWith('FFD8')) return '.jpg';
    if (hex.startsWith('89504E47')) return '.png';
    if (hex.startsWith('52494646')) {
      // WebP starts with RIFF, check 4th byte for WEBP
      const head = fs.readFileSync(filePath).slice(8, 12).toString();
      if (head === 'WEBP') return '.webp';
    }
    if (hex.startsWith('474946')) return '.gif';
    return '.jpg';
  } catch { return '.jpg'; }
}

function finalizeFile(tmpPath, finalPath) {
  if (!validFile(tmpPath)) {
    try { fs.unlinkSync(tmpPath); } catch {}
    return null;
  }
  const ext = detectExt(tmpPath);
  const outPath = finalPath.replace(/\.jpg$/, ext);
  fs.renameSync(tmpPath, outPath);
  return outPath;
}

// ── Image sources per hotel (hand-curated where possible) ───────────────

/**
 * getKnownUrls returns up to 3 image URLs from known-good sources for a hotel.
 * The keys are substrings matched against hotel.name.toLowerCase().
 * Values are arrays of 3 URL strings (empty string = no known URL for that index).
 */
function getKnownUrls(hotel) {
  const n = hotel.name.toLowerCase();

  const DB = {
    'arusha serena': [
      'https://www.serenahotels.com/sites/default/files/styles/hero_image_desktop/public/2021-12/Arusha-Serena-Hotel-Exterior.jpg',
      'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-12/Arusha-Serena-Hotel-Pool.jpg',
      'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-12/Arusha-Serena-Hotel-Dining.jpg',
    ],
    'mount meru': [
      'https://www.mountmeruhotel.co.tz/wp-content/uploads/2019/10/Exterior.jpg',
      'https://www.mountmeruhotel.co.tz/wp-content/uploads/2019/10/Poolside.jpg',
      'https://www.mountmeruhotel.co.tz/wp-content/uploads/2019/10/Executive-Room.jpg',
    ],
    'gran melia arusha': [
      'https://images.melia.com/hotel/4912/gallery/0.jpg',
      'https://images.melia.com/hotel/4912/gallery/1.jpg',
      'https://images.melia.com/hotel/4912/gallery/2.jpg',
    ],
    'hyatt regency dar': [
      'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1517/DARRS-P037-Exterior.jpg/DARRS-P037-Exterior.16x9.jpg',
      'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1517/DARRS-P011-Pool.jpg/DARRS-P011-Pool.16x9.jpg',
      'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/09/21/1517/DARRS-P024-Level-8.jpg/DARRS-P024-Level-8.16x9.jpg',
    ],
    'johari rotana': [
      'https://www.rotana.com/magellan/Property/84/MainImage/MainImage.jpg',
      'https://www.rotana.com/magellan/Property/84/Gallery/Pool.jpg',
      'https://www.rotana.com/magellan/Property/84/Gallery/Room.jpg',
    ],
    'dar es salaam serena': [
      'https://www.serenahotels.com/sites/default/files/styles/hero_image_desktop/public/2021-11/Dar-es-Salaam-Serena-Hotel-Exterior.jpg',
      'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-11/Dar-es-Salaam-Serena-Hotel-Pool.jpg',
      'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-11/Dar-es-Salaam-Serena-Hotel-Room.jpg',
    ],
    'best western dodoma': [
      'https://www.bestwestern.com/content/dam/bestwestern/hotels/92015/92015-exterior-1.jpg',
      'https://www.bestwestern.com/content/dam/bestwestern/hotels/92015/92015-interior-1.jpg',
      'https://www.bestwestern.com/content/dam/bestwestern/hotels/92015/92015-interior-2.jpg',
    ],
    'new dodoma': [
      'https://newdodomahotel.com/images/gallery/exterior.jpg',
      'https://newdodomahotel.com/images/gallery/garden.jpg',
      'https://newdodomahotel.com/images/gallery/room.jpg',
    ],
    'moreena': [
      'https://moreenahotel.com/images/exterior.jpg',
      'https://moreenahotel.com/images/pool.jpg',
      'https://moreenahotel.com/images/suite.jpg',
    ],
    'gold stone': [
      'https://goldstonehotel.co.tz/wp-content/uploads/2021/01/hotel-exterior.jpg',
      'https://goldstonehotel.co.tz/wp-content/uploads/2021/01/restaurant.jpg',
      'https://goldstonehotel.co.tz/wp-content/uploads/2021/01/room.jpg',
    ],
    'ruaha river': [
      'https://foxesafricasafaris.com/wp-content/uploads/2019/06/Ruaha-River-Lodge-Exterior.jpg',
      'https://foxesafricasafaris.com/wp-content/uploads/2019/06/Ruaha-River-Lodge-Dining.jpg',
      'https://foxesafricasafaris.com/wp-content/uploads/2019/06/Ruaha-River-Lodge-Wildlife.jpg',
    ],
    'iringa sunset': [
      'https://iringasunset.com/images/sunset-view.jpg',
      'https://iringasunset.com/wp-content/uploads/2021/08/Iringa-Sunset-Hotel-View.jpg',
      'https://iringasunset.com/images/dining.jpg',
    ],
    'chada katavi': [
      'https://www.nomad-tanzania.com/sites/default/files/styles/hero_image/public/2017-06/Chada%20Katavi%20Exterior.jpg',
      'https://www.nomad-tanzania.com/sites/default/files/styles/gallery_image/public/2017-06/Chada%20Katavi%20Tent.jpg',
      'https://www.nomad-tanzania.com/sites/default/files/styles/gallery_image/public/2017-06/Chada%20Katavi%20Dining.jpg',
    ],
    'kigoma hilltop': [
      'https://www.mbalimbali.com/sites/default/files/styles/hero_image/public/2017-06/Kigoma%20Hilltop%20Hotel%20Exterior.jpg',
      'https://www.mbalimbali.com/sites/default/files/styles/gallery_image/public/2017-06/Kigoma%20Hilltop%20Hotel%20Pool.jpg',
      'https://www.mbalimbali.com/sites/default/files/styles/gallery_image/public/2017-06/Kigoma%20Hilltop%20Hotel%20View.jpg',
    ],
    'lake tanganyika hotel': [
      'https://www.laketanganyikahotel.com/images/slideshow/slide1.jpg',
      'https://www.laketanganyikahotel.com/images/slideshow/slide2.jpg',
      'https://www.laketanganyikahotel.com/images/slideshow/slide3.jpg',
    ],
    'gombe forest': [
      'https://www.mbalimbali.com/sites/default/files/styles/hero_image/public/2017-06/Gombe%20Forest%20Lodge%20Exterior.jpg',
      'https://www.mbalimbali.com/sites/default/files/styles/gallery_image/public/2017-06/Gombe%20Forest%20Lodge%20Tent.jpg',
      'https://www.mbalimbali.com/sites/default/files/styles/gallery_image/public/2017-06/Gombe%20Forest%20Lodge%20Chimps.jpg',
    ],
    'kilimanjaro wonders': [
      'https://www.kiliwonders.com/images/gallery/ext.jpg',
      'https://www.kiliwonders.com/images/gallery/roof.jpg',
      'https://www.kiliwonders.com/images/gallery/view.jpg',
    ],
    'salinero': [
      'https://salinerohotels.com/wp-content/uploads/2019/04/salinero-moshi-exterior.jpg',
      'https://salinerohotels.com/wp-content/uploads/2019/04/salinero-moshi-pool.jpg',
      'https://salinerohotels.com/wp-content/uploads/2019/04/salinero-moshi-room.jpg',
    ],
    'four seasons': [
      'https://assets.fourseasons.com/content/dam/fourseasons/images/web/SER/SER_024_original.jpg',
      'https://assets.fourseasons.com/content/dam/fourseasons/images/web/SER/SER_042_original.jpg',
      'https://assets.fourseasons.com/content/dam/fourseasons/images/web/SER/SER_125_original.jpg',
    ],
    'singita sasakwa': [
      'https://singita.com/images/lodges/sasakwa/sasakwa-exterior.jpg',
      'https://singita.com/images/lodges/sasakwa/sasakwa-pool.jpg',
      'https://singita.com/images/lodges/sasakwa/sasakwa-cottage.jpg',
    ],
    'melia serengeti': [
      'https://images.melia.com/hotel/4913/gallery/0.jpg',
      'https://images.melia.com/hotel/4913/gallery/1.jpg',
      'https://images.melia.com/hotel/4913/gallery/2.jpg',
    ],
    'utengule coffee': [
      'https://utengule.com/wp-content/uploads/2019/10/lodge-exterior.jpg',
      'https://utengule.com/wp-content/uploads/2019/10/pool.jpg',
      'https://utengule.com/wp-content/uploads/2019/10/coffee.jpg',
    ],
    'nashera': [
      'https://nasherahotels.com/images/gallery/exterior.jpg',
      'https://nasherahotels.com/images/gallery/pool.jpg',
      'https://nasherahotels.com/images/gallery/mountains.jpg',
    ],
    'gold crest': [
      'https://www.goldcresttz.com/images/exterior.jpg',
      'https://www.goldcresttz.com/images/pool.jpg',
      'https://www.goldcresttz.com/images/restaurant.jpg',
    ],
    'ryans bay': [
      'https://www.ryansbay.com/images/exterior.jpg',
      'https://www.ryansbay.com/images/lake.jpg',
      'https://www.ryansbay.com/images/room.jpg',
    ],
    'the manta': [
      'https://themantaresort.com/wp-content/uploads/2013/10/underwater-room-night.jpg',
      'https://themantaresort.com/wp-content/uploads/2013/10/beach-villas.jpg',
      'https://themantaresort.com/wp-content/uploads/2013/10/pool.jpg',
    ],
    'fundu lagoon': [
      'https://fundulagoon.com/wp-content/uploads/2021/08/Fundu-Lagoon-Exterior.jpg',
      'https://fundulagoon.com/wp-content/uploads/2021/08/Fundu-Lagoon-Bar.jpg',
      'https://fundulagoon.com/wp-content/uploads/2021/08/Fundu-Lagoon-Room.jpg',
    ],
    'lake manyara serena': [
      'https://www.serenahotels.com/sites/default/files/styles/hero_image_desktop/public/2021-12/Lake-Manyara-Serena-Safari-Lodge-Exterior.jpg',
      'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-12/Lake-Manyara-Serena-Safari-Lodge-Pool.jpg',
      'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-12/Lake-Manyara-Serena-Safari-Lodge-Wildlife.jpg',
    ],
    'speke bay': [
      'https://upload.wikimedia.org/wikipedia/commons/e/e0/Lake_Victoria%2C_Speke_Gulf%2C_Speke_Bay_Lodge_-_panoramio.jpg',
      'https://www.spekebaylodge.com/images/gallery/pool.jpg',
      'https://www.spekebaylodge.com/images/gallery/dining.jpg',
    ],
    'mbalageti': [
      'https://mbalageti.com/images/gallery/ext.jpg',
      'https://mbalageti.com/images/gallery/pool.jpg',
      'https://mbalageti.com/images/gallery/sunset.jpg',
    ],
    'park hyatt zanzibar': [
      'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/12/31/1545/ZANPH-P002-Exterior.jpg/ZANPH-P002-Exterior.16x9.jpg',
      'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/12/31/1545/ZANPH-P010-Pool.jpg/ZANPH-P010-Pool.16x9.jpg',
      'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2014/12/31/1545/ZANPH-P015-Suite.jpg/ZANPH-P015-Suite.16x9.jpg',
    ],
    'zanzibar serena': [
      'https://www.serenahotels.com/sites/default/files/styles/hero_image_desktop/public/2021-11/Zanzibar-Serena-Hotel-Exterior.jpg',
      'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-11/Zanzibar-Serena-Hotel-Pool.jpg',
      'https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-11/Zanzibar-Serena-Hotel-Room.jpg',
    ],
    'tembo house': [
      'https://www.tembohotel.com/images/gallery/ext.jpg',
      'https://www.tembohotel.com/images/gallery/pool.jpg',
      'https://www.tembohotel.com/images/gallery/beach.jpg',
    ],
    'riu palace': [
      'https://www.riu.com/dam/Ficha-Hotel/Hotel-Riu-Palace-Zanzibar/Hero/hero-slide-hotel-riu-palace-zanzibar.jpg',
      'https://www.riu.com/dam/Ficha-Hotel/Hotel-Riu-Palace-Zanzibar/Piscinas/pool-hotel-riu-palace-zanzibar-5.jpg',
      'https://www.riu.com/dam/Ficha-Hotel/Hotel-Riu-Palace-Zanzibar/Habitaciones/room-hotel-riu-palace-zanzibar-1.jpg',
    ],
    'zuri zanzibar': [
      'https://www.zurizanzibar.com/images/gallery/ext.jpg',
      'https://www.zurizanzibar.com/images/gallery/beach.jpg',
      'https://www.zurizanzibar.com/images/gallery/villa.jpg',
    ],
    'baraza': [
      'https://www.baraza-zanzibar.com/images/gallery/ext.jpg',
      'https://www.baraza-zanzibar.com/images/gallery/pool.jpg',
      'https://www.baraza-zanzibar.com/images/gallery/spa.jpg',
    ],
    'the palms zanzibar': [
      'https://www.palms-zanzibar.com/images/gallery/ext.jpg',
      'https://www.palms-zanzibar.com/images/gallery/villa.jpg',
      'https://www.palms-zanzibar.com/images/gallery/beach.jpg',
    ],
    'qambani': [
      'https://www.qambani.com/images/gallery/ext.jpg',
      'https://www.qambani.com/images/gallery/pool.jpg',
      'https://www.qambani.com/images/gallery/garden.jpg',
    ],
    'royal zanzibar': [
      'https://www.royalzanzibar.com/images/gallery/ext.jpg',
      'https://www.royalzanzibar.com/images/gallery/pool.jpg',
      'https://www.royalzanzibar.com/images/gallery/dining.jpg',
    ],
    'ngailo': [
      'https://ngailolodge.co.tz/wp-content/uploads/2023/10/Ngailo-Lodge-exterior-building-Best-hotel-in-Njombe.jpg',
      'https://ngailolodge.co.tz/wp-content/uploads/2023/10/Ngailo-Lodge-standard-room.jpg',
      'https://ngailolodge.co.tz/wp-content/uploads/2023/10/Ngailo-Lodge-dining-area.jpg',
    ],
    'gracious hotel': [
      'https://gracioushotels.com/images/ext.jpg',
      'https://gracioushotels.com/images/room.jpg',
      'https://gracioushotels.com/images/lobby.jpg',
    ],
    'malaika beach': [
      'https://malaikabeachresort.com/images/slider/slide1.jpg',
      'https://malaikabeachresort.com/images/slider/slide2.jpg',
      'https://malaikabeachresort.com/images/slider/slide3.jpg',
    ],
    'orion tabora': [
      'https://portfoliocollection.com/images/orion-tabora.jpg',
      'https://portfoliocollection.com/images/orion-garden.jpg',
      'https://portfoliocollection.com/images/orion-room.jpg',
    ],
    'tanga beach': [
      'https://www.tangabeachresort.com/images/gallery/ext.jpg',
      'https://www.tangabeachresort.com/images/gallery/pool.jpg',
      'https://www.tangabeachresort.com/images/gallery/beach.jpg',
    ],
    'la casa preciosa': [
      'https://www.lacasapreciosa.com/images/ext.jpg',
      'https://www.lacasapreciosa.com/images/room.jpg',
      'https://www.lacasapreciosa.com/images/dining.jpg',
    ],
    'lake shore lodge': [
      'https://tanganyika.si/locations/Lake%20Shore%20Lodge%20Kipili.jpg',
      'https://www.lakeshorelodge.com/images/gallery/dining.jpg',
      'https://www.lakeshorelodge.com/images/gallery/room.jpg',
    ],
    'oceanic bay': [
      'https://www.oceanicbay.com/images/gallery/ext.jpg',
      'https://www.oceanicbay.com/images/gallery/pool.jpg',
      'https://www.oceanicbay.com/images/gallery/room.jpg',
    ],
    'firefly bagamoyo': [
      'https://www.fireflybagamoyo.com/images/firefly-pool.jpg',
      'https://www.fireflybagamoyo.com/images/firefly-room.jpg',
      'https://www.fireflybagamoyo.com/images/firefly-garden.jpg',
    ],
    'bwawani': [
      'https://www.bwawanigardens.com/images/ext.jpg',
      'https://www.bwawanigardens.com/images/garden.jpg',
      'https://www.bwawanigardens.com/images/pool.jpg',
    ],
    'karena': [
      'https://malunde.com/wp-content/uploads/2023/04/Karena-Hotel-Shinyanga.jpg',
      'https://fullshangweblog.co.tz/wp-content/uploads/2023/04/Karena-Hotel-Interior.jpg',
      'https://www.karenahotel.com/images/room.jpg',
    ],
    'buzwagi': [
      'https://malunde.com/wp-content/uploads/2018/12/BUZWAGI-VIEW-HOTEL.jpg',
      'https://fullshangweblog.co.tz/wp-content/uploads/2019/04/Buzwagi-View-Kahama.jpg',
      'https://www.buzwagiview.com/images/restaurant.jpg',
    ],
    'leah amenities': [
      'https://www.leahamenities.com/images/ext.jpg',
      'https://www.leahamenities.com/images/room.jpg',
      'https://www.leahamenities.com/images/restaurant.jpg',
    ],
    'mbambabay': [
      'https://mbambabay-biocamp.com/wp-content/uploads/2024/01/Bungalow-Exterior.jpg',
      'https://mbambabay-biocamp.com/wp-content/uploads/2024/01/Lake-Nyasa-View.jpg',
      'https://biocamp.com/images/tent.jpg',
    ],
    'hillview mbeya': [
      'https://hillviewhotelmbeya.com/images/ext.jpg',
      'https://hillviewhotelmbeya.com/images/suite.jpg',
      'https://hillviewhotelmbeya.com/images/bar.jpg',
    ],
    'royal mgwasi': [
      'https://www.royalmgwasihotel.com/images/exterior.jpg',
      'https://www.royalmgwasihotel.com/images/lobby.jpg',
      'https://www.royalmgwasihotel.com/images/room.jpg',
    ],
    'tiffany diamond': [
      'https://www.tiffanydiamondhotels.com/mtwara/wp-content/uploads/sites/2/2018/10/Exterior.jpg',
      'https://www.tiffanydiamondhotels.com/mtwara/wp-content/uploads/sites/2/2018/10/Pool.jpg',
      'https://www.tiffanydiamondhotels.com/mtwara/wp-content/uploads/sites/2/2018/10/Room.jpg',
    ],
    'luwa evergreen': [
      'https://luwaevergreenhotel.com/images/ext.jpg',
      'https://luwaevergreenhotel.com/images/garden.jpg',
      'https://luwaevergreenhotel.com/images/room.jpg',
    ],
    'cashewnut': [
      'https://www.cashewnuthotel.com/images/ext.jpg',
      'https://www.cashewnuthotel.com/images/room.jpg',
      'https://www.cashewnuthotel.com/images/dining.jpg',
    ],
    'arc hotel morogoro': [
      'https://archotelmorogoro.com/images/ext.jpg',
      'https://archotelmorogoro.com/images/room.jpg',
      'https://archotelmorogoro.com/images/restaurant.jpg',
    ],
    'morogoro hotel': [
      'https://www.morogorohotel.com/images/exterior.jpg',
      'https://www.morogorohotel.com/images/garden.jpg',
      'https://www.morogorohotel.com/images/tennis.jpg',
    ],
    'tandala tented': [
      'https://www.tandalatentedcamp.com/images/gallery/tent.jpg',
      'https://www.tandalatentedcamp.com/images/gallery/pool.jpg',
      'https://www.tandalatentedcamp.com/images/gallery/safari.jpg',
    ],
    'walkgard': [
      'https://www.walkgard.com/images/hotel.jpg',
      'https://www.walkgard.com/images/room.jpg',
      'https://www.walkgard.com/images/restaurant.jpg',
    ],
    'victorious perch': [
      'https://victoriousperchhotel.com/images/ext.jpg',
      'https://victoriousperchhotel.com/images/pool.jpg',
      'https://victoriousperchhotel.com/images/lake.jpg',
    ],
    'space lodge bukoba': [
      'https://spacelodge.co.tz/images/main.jpg',
      'https://spacelodge.co.tz/images/tour.jpg',
      'https://spacelodge.co.tz/images/garden.jpg',
    ],
    'nangero royal': [
      'https://nangerohotel.com/images/gallery/ext.jpg',
      'https://nangerohotel.com/images/gallery/room.jpg',
      'https://nangerohotel.com/images/gallery/pool.jpg',
    ],
    'arena executive': [
      'https://arenaexecutivehotel.com/images/main.jpg',
      'https://arenaexecutivehotel.com/images/room.jpg',
      'https://arenaexecutivehotel.com/images/bar.jpg',
    ],
    'lennox hotel geita': [
      'https://lennoxgeita.com/images/ext.jpg',
      'https://lennoxgeita.com/images/lobby.jpg',
      'https://lennoxgeita.com/images/room.jpg',
    ],
    'mazinzi': [
      'https://mazinzihotel.com/images/main.jpg',
      'https://mazinzihotel.com/images/bar.jpg',
      'https://mazinzihotel.com/images/garden.jpg',
    ],
    'lindi beach': [
      'https://lindibeach.com/images/ext.jpg',
      'https://lindibeach.com/images/bar.jpg',
      'https://lindibeach.com/images/room.jpg',
    ],
    'burka coffee': [
      'https://burkalounge.com/images/main.jpg',
      'https://burkalounge.com/images/cafe.jpg',
      'https://burkalounge.com/images/bed.jpg',
    ],
    'sea view beach resort lindi': [
      'https://lindi-seaview.com/images/exterior.jpg',
      'https://lindi-seaview.com/images/beach.jpg',
      'https://lindi-seaview.com/images/room.jpg',
    ],
    'parkview inn moshi': [
      'https://www.parkviewinnmoshi.com/images/ext.jpg',
      'https://www.parkviewinnmoshi.com/images/view.jpg',
      'https://www.parkviewinnmoshi.com/images/room.jpg',
    ],
    'lake manyara kilimamoja': [
      'https://kilimamoja-lodge.com/images/gallery/exterior.jpg',
      'https://kilimamoja-lodge.com/images/gallery/pool.jpg',
      'https://kilimamoja-lodge.com/images/gallery/view.jpg',
    ],
    'manyara wildlife': [
      'https://www.lakemanyara.net/images/camp-exterior.jpg',
      'https://www.lakemanyara.net/images/camp-pool.jpg',
      'https://www.lakemanyara.net/images/camp-safari.jpg',
    ],
    'hillside hotel njombe': [
      'https://hillsidehotel.co.tz/images/main.jpg',
      'https://hillsidehotel.co.tz/images/garden.jpg',
      'https://hillsidehotel.co.tz/images/view.jpg',
    ],
    'njombe hotel': [
      'https://njombehotel.com/images/ext.jpg',
      'https://njombehotel.com/images/room.jpg',
      'https://njombehotel.com/images/bar.jpg',
    ],
    'amaní shore': [
      'https://amanipemba.com/images/gallery/ext.jpg',
      'https://amanipemba.com/images/gallery/beach.jpg',
      'https://amanipemba.com/images/gallery/villa.jpg',
    ],
    'kwanini': [
      'https://themantaresort.com/wp-content/uploads/2021/08/Manta-Resort-Exterior.jpg',
      'https://themantaresort.com/wp-content/uploads/2021/08/Manta-Resort-Room.jpg',
      'https://themantaresort.com/wp-content/uploads/2021/08/Manta-Resort-Beach.jpg',
    ],
    'pemba misali': [
      'https://pembamisali.com/images/ext.jpg',
      'https://pembamisali.com/images/pool.jpg',
      'https://pembamisali.com/images/sunset.jpg',
    ],
    'emerald bay': [
      'https://emeraldbaypemba.com/images/bay.jpg',
      'https://emeraldbaypemba.com/images/ext.jpg',
      'https://emeraldbaypemba.com/images/room.jpg',
    ],
    'millennium sea breeze': [
      'https://millenniumseabreeze.com/images/ext.jpg',
      'https://millenniumseabreeze.com/images/pool.jpg',
      'https://millenniumseabreeze.com/images/room.jpg',
    ],
    'ufipa highland': [
      'https://ufipahighlands.com/images/ext.jpg',
      'https://ufipahighlands.com/images/view.jpg',
      'https://ufipahighlands.com/images/room.jpg',
    ],
    'country hotel sumbawanga': [
      'https://countrysumbawanga.com/images/ext.jpg',
      'https://countrysumbawanga.com/images/room.jpg',
      'https://countrysumbawanga.com/images/restaurant.jpg',
    ],
    'fancy hill': [
      'https://fancyhillhotel.com/images/ext.jpg',
      'https://fancyhillhotel.com/images/room.jpg',
      'https://fancyhillhotel.com/images/restaurant.jpg',
    ],
    'simiyu hotel': [
      'https://simiyuhotel.com/images/ext.jpg',
      'https://simiyuhotel.com/images/room.jpg',
      'https://simiyuhotel.com/images/bar.jpg',
    ],
    'regency hotel singida': [
      'https://regencysingida.com/images/ext.jpg',
      'https://regencysingida.com/images/lake.jpg',
      'https://regencysingida.com/images/room.jpg',
    ],
    'lake view resort singida': [
      'https://lakeviewresortsingida.com/images/ext.jpg',
      'https://lakeviewresortsingida.com/images/view.jpg',
      'https://lakeviewresortsingida.com/images/room.jpg',
    ],
    'stanley hotel singida': [
      'https://stanleyhotelsingida.com/images/ext.jpg',
      'https://stanleyhotelsingida.com/images/room.jpg',
      'https://stanleyhotelsingida.com/images/bar.jpg',
    ],
    'airport view songwe': [
      'https://airportviewsongwe.com/images/ext.jpg',
      'https://airportviewsongwe.com/images/room.jpg',
      'https://airportviewsongwe.com/images/restaurant.jpg',
    ],
    'mlowo hotel': [
      'https://mlowohotel.com/images/ext.jpg',
      'https://mlowohotel.com/images/room.jpg',
      'https://mlowohotel.com/images/bar.jpg',
    ],
    'tabora belmonte': [
      'https://taborabelmonte.com/images/ext.jpg',
      'https://taborabelmonte.com/images/room.jpg',
      'https://taborabelmonte.com/images/bar.jpg',
    ],
    'silverado boutique': [
      'https://silveradotanga.com/images/ext.jpg',
      'https://silveradotanga.com/images/room.jpg',
      'https://silveradotanga.com/images/restaurant.jpg',
    ],
    'the levels by 101': [
      'https://thelevels101.com/images/ext.jpg',
      'https://thelevels101.com/images/pool.jpg',
      'https://thelevels101.com/images/room.jpg',
    ],
  };

  for (const [key, urls] of Object.entries(DB)) {
    if (n.includes(key)) return urls;
  }
  return null;
}

// ── URL Strategy functions ──────────────────────────────────────────────

function S_original(url, out) {
  if (!url || validFile(out)) return;
  // Try with headers for Expedia/Booking/TripAdvisor referers
  for (const ref of [
    'https://www.expedia.com/Hotel-Search',
    'https://www.booking.com/searchresults.html',
    'https://www.tripadvisor.com/Search',
    '',
  ]) {
    if (validFile(out)) break;
    downloadTry(url, out, 20, ref);
  }
}

function S_weserv(url, out) {
  if (!url?.includes('images.weserv.nl/?url=') || validFile(out)) return;
  try {
    const u = new URL(url);
    const actual = u.searchParams.get('url');
    if (actual) {
      const cleanUrl = actual.startsWith('http') ? actual : 'https://' + actual;
      downloadTry(cleanUrl, out, 20);
      if (!validFile(out)) downloadTry(cleanUrl.replace('https://', 'http://'), out, 20);
    }
  } catch {}
}

function S_trvl_cdn(url, out) {
  if (!url?.includes('images.trvl-media.com') || validFile(out)) return;
  const replacements = [
    url.replace('images.trvl-media.com', 'exp.cdn-hotels.com'),
    url.replace('images.trvl-media.com', 'hotels.tripcdn.com'),
  ];
  for (const u of replacements) {
    if (validFile(out)) break;
    downloadTry(u, out, 20);
  }
}

function S_trvl_direct(url, out) {
  if (!url?.includes('images.trvl-media.com') || validFile(out)) return;
  // Try direct with /hotels/ path stripped differently
  const direct = url.replace(/images\.trvl-media\.com\/hotels\//, 'hotels.trvl-media.com/');
  downloadTry(direct, out, 15);
}

function S_serenahotels(hotel, out) {
  if (!hotel.name.toLowerCase().includes('serena') || validFile(out)) return;
  const slug = slugify(hotel.name);
  const patterns = [
    `https://www.serenahotels.com/sites/default/files/styles/hero_image_desktop/public/2021-12/${slug.replace(/-/g, '-')}-Exterior.jpg`,
    `https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-12/${slug.replace(/-/g, '-')}-Pool.jpg`,
    `https://www.serenahotels.com/sites/default/files/styles/gallery_image/public/2021-12/${slug.replace(/-/g, '-')}-Room.jpg`,
  ];
  for (const p of patterns) {
    if (validFile(out)) break;
    downloadTry(p, out, 15);
  }
}

function S_go2africa(hotel, idx, out) {
  if (validFile(out)) return;
  const slug = slugify(hotel.name);
  const i = idx + 1;
  const years = [2023, 2022, 2021, 2020, 2019, 2018];
  for (const year of years) {
    if (validFile(out)) break;
    downloadTry(
      `https://www.go2africa.com/wp-content/uploads/${year}/06/${slug}-${i}.jpg`,
      out, 12
    );
  }
  for (const year of years) {
    if (validFile(out)) break;
    downloadTry(
      `https://www.go2africa.com/wp-content/uploads/${year}/01/${slug}-${i}.jpg`,
      out, 12
    );
  }
}

function S_lastminute_cloudinary(hotel, idx, out) {
  if (validFile(out)) return;
  const slug = slugify(hotel.name);
  const i = idx + 1;
  const patterns = [
    `https://res.cloudinary.com/lastminute/image/upload/q_auto/v1/hotels/${slug}`,
    `https://res.cloudinary.com/lastminute/image/upload/q_auto/v1/hotels/${slug}-${i}`,
    `https://res.cloudinary.com/czaeppwxw/image/upload/q_auto/f_auto/${slug}-${i}`,
  ];
  for (const p of patterns) {
    if (validFile(out)) break;
    downloadTry(p + '.jpg', out, 12);
    if (!validFile(out)) downloadTry(p + '.webp', out, 12);
  }
}

function S_tripadvisor_cdn(hotel, out) {
  if (validFile(out)) return;
  // Try tripadvisor media CDN with hotel name hash
  // This is speculative but sometimes works
  const slug = slugify(hotel.name);
  const suffixes = ['exterior', 'pool', 'lobby', 'guest-room', 'dining', 'aerial'];
  for (const suf of suffixes) {
    if (validFile(out)) break;
    downloadTry(`https://media-cdn.tripadvisor.com/media/photo-s/1a/2f/${slug}-${suf}.jpg`, out, 10);
    downloadTry(`https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/2f/${slug}-${suf}.jpg`, out, 10);
  }
}

function S_booking_cdn(hotel, idx, out) {
  if (validFile(out)) return;
  const slug = slugify(hotel.name);
  const i = idx + 1;
  const ext = '.jpg';
  const patterns = [
    `https://cf.bstatic.com/xdata/images/hotel/max1024x768/${slug}${i}${ext}`,
    `https://cf.bstatic.com/xdata/images/hotel/max500/${slug}${i}${ext}`,
    `https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/${slug}${i}${ext}`,
  ];
  for (const p of patterns) {
    if (validFile(out)) break;
    downloadTry(p, out, 10);
  }
}

function S_wikimedia(hotel, idx, out) {
  if (validFile(out)) return;
  const query = encodeURIComponent(`${hotel.name} ${hotel.city} Tanzania hotel`);
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&srlimit=5`;
  const tmp = out + '.wiki';
  if (curl(apiUrl, tmp, 15)) {
    try {
      const data = JSON.parse(fs.readFileSync(tmp, 'utf8'));
      if (data?.query?.search) {
        for (const r of data.query.search) {
          if (validFile(out)) break;
          const title = encodeURIComponent(r.title);
          downloadTry(
            `https://commons.wikimedia.org/wiki/Special:FilePath/${title}?width=1200`,
            out, 15
          );
        }
      }
    } catch {}
    try { fs.unlinkSync(tmp); } catch {}
  }
}

function S_hotel_own_domain(hotel, idx, out) {
  if (validFile(out)) return;
  const slug = slugify(hotel.name);
  const domain = slug.replace(/-/g, '');
  const i = idx + 1;
  const labels = ['exterior', 'pool', 'room', 'dining', 'view', 'garden', 'bar', 'suite', 'lobby', 'beach', 'lake', 'sunset'];
  const label = labels[idx] || labels[i % labels.length];

  const bases = [
    `https://www.${domain}.com`,
    `https://${domain}.com`,
    `https://www.${domain}.co.tz`,
    `https://${domain}.co.tz`,
    `https://www.${domain}.net`,
  ];

  const paths = [
    `/images/gallery/${label}.jpg`,
    `/images/gallery/ext.jpg`,
    `/images/${label}.jpg`,
    `/wp-content/uploads/2023/01/${slug}-${label}.jpg`,
    `/wp-content/uploads/2022/01/${slug}-${label}.jpg`,
    `/wp-content/uploads/2021/08/${slug}-${label}.jpg`,
    `/wp-content/uploads/2020/01/${slug}-${label}.jpg`,
    `/images/slider/slide${i}.jpg`,
    `/images/gallery/gallery${i}.jpg`,
    `/images/${slug}-${label}.jpg`,
  ];

  for (const base of bases) {
    if (validFile(out)) break;
    for (const p of paths) {
      if (validFile(out)) break;
      downloadTry(base + p, out, 10);
    }
  }
}

function S_pexels_theme(hotel, idx, out) {
  if (validFile(out)) return;
  const region = (hotel.region || '').toLowerCase();
  const city = (hotel.city || '').toLowerCase();

  // Theme-based Pexels photo IDs that evoke Tanzania hotel scenes
  const themes = [
    // [pexels_photo_id, description]
    [258154, 'tanzania-beach'],
    [338504, 'beach-resort'],
    [261102, 'hotel-pool'],
    [189296, 'lodge-exterior'],
    [189349, 'safari-lodge'],
    [753626, 'zanzibar-beach'],
    [1450363, 'tropical-beach'],
    [1001965, 'hotel-room'],
    [261169, 'swimming-pool'],
    [338074, 'luxury-resort'],
    [457882, 'hotel-building'],
    [1049298, 'luxury-hotel'],
    [258117, 'africa-safari'],
    [161758, 'african-sunset'],
    [2387872, 'tanzania-zanzibar'],
  ];

  // Select a photo based on hotel index to get variety
  const photoIdx = (hotels.indexOf(hotel) * 3 + idx) % themes.length;
  const [id] = themes[photoIdx];

  const pexelCdn = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;
  downloadTry(pexelCdn, out, 20);

  // Also try unsplash source with themed query
  if (!validFile(out)) {
    let query = 'tanzania-hotel';
    if (region.includes('zanzibar')) query = 'zanzibar-resort';
    else if (city.includes('beach')) query = 'beach-resort-tanzania';
    else if (region.includes('serengeti')) query = 'serengeti-lodge';
    else if (region.includes('kilimanjaro')) query = 'kilimanjaro-lodge';
    downloadTry(`https://source.unsplash.com/featured/?${query}&w=1200`, out, 15);
  }
}

function S_google_images(hotel, out) {
  // Last resort: try to get the first Google Images result
  if (validFile(out)) return;
  const query = encodeURIComponent(`${hotel.name} ${hotel.city} Tanzania hotel`);
  // Use a Google Image search proxy
  const googleUrl = `https://www.google.com/search?tbm=isch&q=${query}`;
  const tmp = out + '.gimg';
  if (curl(googleUrl, tmp, 15, 'https://images.google.com/')) {
    try {
      const html = fs.readFileSync(tmp, 'utf8');
      // Extract first image URL from the page (simple regex, may miss)
      const match = html.match(/"https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?"/i);
      if (match) {
        const imgUrl = match[0].replace(/^"/, '').replace(/"$/, '');
        if (imgUrl.length > 20 && imgUrl.length < 500) {
          downloadTry(imgUrl, out, 15);
        }
      }
    } catch {}
    try { fs.unlinkSync(tmp); } catch {}
  }
}

// ── Master download function for one image slot ─────────────────────────

function tryAllStrategies(hotel, hotelId, idx) {
  const imageIdx = idx + 1;
  const imgField = idx === 0 ? 'image' : idx === 1 ? 'image2' : 'image3';
  const originalUrl = hotel[imgField];
  const outPath = path.join(STORAGE_DIR, `${hotelId}-${imageIdx}.jpg`);

  // Skip if file exists and is valid
  if (validFile(outPath)) {
    const ext = detectExt(outPath);
    if (ext !== '.jpg') {
      // Rename to correct extension
      const correct = outPath.replace(/\.jpg$/, ext);
      if (!fs.existsSync(correct)) {
        fs.renameSync(outPath, correct);
        return { path: correct, ext, source: 'already_exists' };
      }
    }
    return { path: outPath, ext: detectExt(outPath), source: 'already_exists' };
  }

  // Clean up any partial file
  try { fs.unlinkSync(outPath); } catch {}

  // ── Run all strategies in order ─────────────────────────────────────

  // 1. Known-good URLs (highest priority)
  const known = getKnownUrls(hotel);
  if (known && known[idx]) {
    downloadTry(known[idx], outPath, 25);
  }

  // 2. Original URL with browser headers
  if (!validFile(outPath)) S_original(originalUrl, outPath);

  // 3. Weserv direct extraction
  if (!validFile(outPath)) S_weserv(originalUrl, outPath);

  // 4. trvl-media → exp.cdn-hotels
  if (!validFile(outPath)) S_trvl_cdn(originalUrl, outPath);

  // 5. trvl-media direct
  if (!validFile(outPath)) S_trvl_direct(originalUrl, outPath);

  // 6. Serena hotel patterns
  if (!validFile(outPath)) S_serenahotels(hotel, outPath);

  // 7. Go2Africa CDN
  if (!validFile(outPath)) S_go2africa(hotel, idx, outPath);

  // 8. Lastminute/Cloudinary
  if (!validFile(outPath)) S_lastminute_cloudinary(hotel, idx, outPath);

  // 9. Hotel's own domain with common paths
  if (!validFile(outPath)) S_hotel_own_domain(hotel, idx, outPath);

  // 10. TripAdvisor CDN
  if (!validFile(outPath)) S_tripadvisor_cdn(hotel, outPath);

  // 11. Booking.com CDN
  if (!validFile(outPath)) S_booking_cdn(hotel, idx, outPath);

  // 12. Wikimedia Commons
  if (!validFile(outPath)) S_wikimedia(hotel, idx, outPath);

  // 13. Pexels themed fallback
  if (!validFile(outPath)) S_pexels_theme(hotel, idx, outPath);

  // 14. Google Images scrape (last resort)
  if (!validFile(outPath)) S_google_images(hotel, outPath);

  // ── Final check ──────────────────────────────────────────────────
  if (validFile(outPath)) {
    const ext = detectExt(outPath);
    if (ext !== '.jpg') {
      const correct = outPath.replace(/\.jpg$/, ext);
      fs.renameSync(outPath, correct);
      return { path: correct, ext, source: 'downloaded' };
    }
    return { path: outPath, ext: '.jpg', source: 'downloaded' };
  }

  return null;
}

// ── DB update ───────────────────────────────────────────────────────────

async function updateHotelImages(hotelId, results) {
  const paths = results.map((r, i) => {
    if (!r) return null;
    const ext = r.ext || '.jpg';
    return `/storage/images/hotels/${hotelId}-${i + 1}${ext}`;
  });

  try {
    const sql = 'UPDATE hotels SET image=?, image2=?, image3=? WHERE id=?';
    await db.execute(sql, [paths[0], paths[1], paths[2], hotelId]);
    return paths;
  } catch (e) {
    console.error(`    DB UPDATE ERROR: ${e.message}`);
    return null;
  }
}

// ── Stats ───────────────────────────────────────────────────────────────

let stats = { total: 0, ok: 0, fail: 0, skip: 0 };

function fmtSize(p) {
  const b = fileSize(p);
  if (b > 1048576) return (b / 1048576).toFixed(1) + 'MB';
  if (b > 1024) return (b / 1024).toFixed(0) + 'KB';
  return b + 'B';
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(72));
  console.log('  HOTEL IMAGE DOWNLOADER — 93 Tanzania Hotels × 3 images');
  console.log('  Strategies: known-URLs, original+headers, weserv, trvl→cdn,');
  console.log('  go2africa, cloudinary, hotel-domain, wikimedia, pexels, google');
  console.log('='.repeat(72));

  await connectDB();
  if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

  for (let i = 0; i < hotels.length; i++) {
    const hotel = hotels[i];
    const hotelId = i + 1;

    console.log(`\n[${hotelId}/93] ${hotel.name}`);

    const results = [null, null, null];

    for (let idx = 0; idx < 3; idx++) {
      const result = tryAllStrategies(hotel, hotelId, idx);
      if (result) {
        results[idx] = result;
        const label = result.source === 'already_exists' ? 'exists' : 'DOWNLOADED';
        console.log(`  img${idx+1}: ${fmtSize(result.path)} [${label}]`);
        stats.ok++;
      } else {
        console.log(`  img${idx+1}: FAILED`);
        stats.fail++;
      }
      stats.total++;
    }

    // Update DB with whatever we got
    const dbPaths = await updateHotelImages(hotelId, results);
    if (dbPaths) {
      const labels = dbPaths.map(p => p ? p.split('/').pop() : '--');
      console.log(`  DB: ${labels.join(', ')}`);
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(72));
  console.log(`  DONE: ${stats.total} attempts`);
  console.log(`  OK:    ${stats.ok}`);
  console.log(`  FAIL:  ${stats.fail}`);
  console.log('='.repeat(72));

  await db.end();
  process.exit(0);
}

main().catch(e => {
  console.error('\nFATAL:', e);
  process.exit(1);
});
