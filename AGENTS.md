# Renny - Hotel Recommendation System

## Project Overview
Final year project: A hotel recommendation website promoting Tanzania's exotic destinations. Uses a weighted scoring algorithm (Location 40%, Budget 30%, Amenities 20%, Rating 10%) to match users with hotels.

## Tech Stack
- **Frontend:** HTML5, CSS3, Bootstrap 5, vanilla JavaScript
- **Backend:** Express.js (Node.js) with MySQL
- **Design:** Dark navy (#1a1a2e) + gold (#d4a853) theme, Inter font

## Project Structure
```
hotel-recommendation/
├── index.html                 # Homepage (hero, wizard, featured hotels)
├── css/style.css              # Custom theme (1500+ lines)
├── js/
│   ├── recommendation.js      # 27 Tanzania hotels + scoring engine
│   └── main.js                # Wizard, filters, detail page, animations
├── pages/
│   ├── hotels.html            # Browse + filter page
│   ├── hotel-details.html     # Dynamic detail page (?id=X)
│   ├── about.html             # Project info + algorithm explainer
│   ├── login.html / register.html
│   ├── dashboard.html / favorites.html / profile.html
│   └── admin/ (dashboard, manage-hotels, manage-users, manage-reviews)
└── backend/
    ├── index.js               # Express server (port 5000)
    ├── config/db.js           # MySQL connection pool
    ├── middleware/auth.js     # JWT auth + admin guard
    ├── controllers/           # Auth, Hotel, Review, Favorite, Recommend
    ├── routes/               # Express routers
    ├── schema.sql            # Database DDL
    └── seeds/seed.js         # 27 hotels + 2 users
```

## Achievements
- [x] 93 Tanzania hotels across 31 administrative regions (Full country coverage)
- [x] Recommendation wizard (5-step form: region/city → budget → amenities → rating)
- [x] Weighted scoring algorithm with live match scores
- [x] Live filter sidebar (region, city, price, stars, amenities)
- [x] Hotel detail page with dynamic data loading
- [x] Auth pages (login/register UI)
- [x] User dashboard, favorites, profile pages
- [x] Admin panel (dashboard stats, manage hotels/users/reviews)
- [x] Full REST API (auth, hotels CRUD, reviews, favorites, recommend)
- [x] MySQL database with seed script and region support
- [x] Static file serving + API on single Express server
- [x] Responsive design, scroll animations, toast notifications
- [x] SETUP.txt with install instructions
- [x] Connect frontend JS to live API instead of local HOTELS array
- [x] Hotel detail page: review cards are dynamic from DB
- [x] Scraped and integrated real hotel data and official images
- [x] Verified and stabilized all 93 hotel image URLs (replaced unstable proxies/placeholders)

## Known Issues & Pending

### Bugs
- [x] Wizard breadcrumb steps don't highlight correctly when going back
- [x] No "any star rating" option in wizard step 4 (always requires ≥1 star)
- [x] Hotel detail page: review cards are hardcoded, not dynamic from DB
- [x] Admin hotel images don't show in manage table
- [x] Price range filter on hotels page max is $600, but some Tanzania lodges cost $2000+

### Pending Features
- [x] Connect frontend JS to live API instead of local HOTELS array
- [ ] Create booking/contact form (PRD says booking is out of scope, but maybe a simple inquiry form)
- [ ] Loading states and error handling for API calls
- [ ] Image upload for admin hotel management
- [ ] Pagination on hotels page (currently loads all 27)
- [ ] Password reset flow
- [ ] Email verification for registration
- [ ] Sort options on hotels page (price, rating, name)
- [ ] Mobile sidebar drawer for dashboard (currently stacks vertically)
- [ ] Add search input on hotels page
- [ ] Responsive admin tables on mobile



## Running Locally
```bash
cd backend
npm install
npm run seed     # Creates DB + seeds data (needs MySQL running)
npm run dev      # http://localhost:5000
```

## Default Logins
- Admin: admin@renny.com / admin123
- User:  john@renny.com  / user123
