const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const hotelRoutes = require('./routes/hotels');
const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');
const recommendRoutes = require('./routes/recommend');
const adminRoutes = require('./routes/admin');
const initDb = require('./config/initDb');

const app = express();

// Initialize Database & Migrations
initDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '..')));
  app.use('/storage', express.static(path.join(__dirname, 'storage')));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Renny API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  if (req.url.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.status(404).send(`
      <!DOCTYPE html><html><head><title>Page Not Found</title>
      <style>body{font-family:sans-serif;text-align:center;padding:80px 20px;background:#faf6ef}
      h1{font-size:3rem;color:#1a1f35} p{color:#6b7280} a{color:#d4a853}</style></head>
      <body><h1>404</h1><p>Page not found</p><a href="/">Go Home</a></body></html>
    `);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Renny running at http://localhost:${PORT}`);
  });
}
