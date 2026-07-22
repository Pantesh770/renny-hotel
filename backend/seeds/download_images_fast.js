#!/usr/bin/env node
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execP = util.promisify(exec);
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const hotels = require('./hotels_data');
const DIR = path.join(__dirname, '..', 'storage', 'images', 'hotels');
const BATCH = 10;
const MIN_OK = 51200;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function imgKey(i) { return i === 1 ? 'image' : `image${i}`; }
function fname(id, i) { return `${id}-${i}.jpg`; }
function storePath(id, i) { return `/storage/images/hotels/${fname(id, i)}`; }

function strategies(origUrl, id, i) {
  const list = [];
  if (origUrl && origUrl.startsWith('http')) {
    list.push(origUrl);
    list.push(`https://images.weserv.nl/?url=${encodeURIComponent(origUrl.replace(/^https?:\/\//, ''))}`);
  }
  list.push(`https://picsum.photos/seed/renny-${id}-${i}/800/600`);
  return list;
}

async function curlFetch(url, dest) {
  try {
    await execP(
      `curl -sL -k --max-time 10 --connect-timeout 5 -A "${UA}" "${url}" -o "${dest}"`,
      { timeout: 15000 }
    );
    return fs.existsSync(dest) && fs.statSync(dest).size > 4000;
  } catch { return false; }
}

async function ensureImage(hotel, id, i) {
  const fp = path.join(DIR, fname(id, i));
  if (fs.existsSync(fp) && fs.statSync(fp).size >= MIN_OK) {
    return 'skip';
  }
  for (const url of strategies(hotel[imgKey(i)], id, i)) {
    if (await curlFetch(url, fp)) return 'downloaded';
  }
  return 'failed';
}

async function main() {
  fs.mkdirSync(DIR, { recursive: true });

  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'renny_hotels'
  });

  const total = hotels.length;
  let downloaded = 0, skipped = 0, failed = 0;
  const startTime = Date.now();

  console.log(`Processing ${total} hotels (${total * 3} images) in batches of ${BATCH}...\n`);

  for (let start = 0; start < total; start += BATCH) {
    const end = Math.min(start + BATCH, total);
    const batchNum = Math.floor(start / BATCH) + 1;
    const totalBatches = Math.ceil(total / BATCH);

    const tasks = [];
    for (let id = start + 1; id <= end; id++) {
      for (let i = 1; i <= 3; i++) {
        tasks.push(ensureImage(hotels[id - 1], id, i));
      }
    }

    const results = await Promise.all(tasks);

    let idx = 0;
    for (let id = start + 1; id <= end; id++) {
      const paths = [];
      let needsUpdate = false;
      for (let i = 1; i <= 3; i++) {
        const status = results[idx++];
        if (status === 'downloaded') { downloaded++; needsUpdate = true; paths.push(storePath(id, i)); }
        else if (status === 'skip') { skipped++; paths.push(storePath(id, i)); }
        else { failed++; paths.push(hotels[id - 1][imgKey(i)]); }
      }
      if (needsUpdate) {
        await db.query('UPDATE hotels SET image=?, image2=?, image3=? WHERE id=?', [...paths, id]);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`  Batch ${batchNum}/${totalBatches} [IDs ${start + 1}-${end}] ✓  (${elapsed}s elapsed)`);
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone in ${totalTime}s: ${downloaded} downloaded, ${skipped} skipped (already valid), ${failed} failed (used picsum fallback)`);

  await db.end();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
