# Project TODO List - Renny Hotel Recommendation

## 🚀 Core Features (Completed)
- [x] **Database Schema**: MySQL tables for users, hotels, amenities, reviews, and favorites.
- [x] **Hotel Dataset**: 93 real Tanzania hotels across all 31 regions.
- [x] **Seeding Engine**: Script to populate DB and download/cache images locally.
- [x] **REST API**: 
    - [x] Authentication (JWT)
    - [x] Hotels (CRUD + Filtering)
    - [x] Reviews (CRUD)
    - [x] Favorites (Toggle + List)
    - [x] Recommendation (Weighted Algorithm)
- [x] **Recommendation Wizard**: 5-step form with real-time scoring.
- [x] **Hotel Discovery**: Browse page with live filters (Region, City, Price, Stars, Amenities).
- [x] **Hotel Details**: Dynamic page with image gallery, amenities, and reviews from DB.
- [x] **User Management**: Login, Registration, Profile, and Favorites dashboard.
- [x] **Admin Panel**: Dashboard stats and management tables for hotels, users, and reviews.

## 🛠️ Bug Fixes (Done)
- [x] Fixed: Wizard breadcrumbs not highlighting on "Back".
- [x] Fixed: Step 4 of Wizard now allows "Any" star rating.
- [x] Fixed: Review cards on details page are now dynamic.
- [x] Fixed: Price range filter extended to handle luxury lodge prices ($2000+).

## ⏳ Pending Tasks (In Progress/Planned)

### Frontend Enhancements
- [ ] **Search Bar**: Add a text search on the `/hotels.html` page.
- [ ] **Sorting**: Add "Price: Low to High", "Rating", and "Alphabetical" sort options.
- [ ] **Pagination**: Split hotel list into pages (currently loads all 93 at once).
- [ ] **Loading States**: Add skeleton screens or spinners during API fetches.
- [ ] **Mobile Sidebar**: Implement a drawer/off-canvas menu for dashboard on mobile.

### Backend & Logic
- [ ] **Booking/Inquiry Form**: Add a simple "Contact Hotel" form on the details page.
- [ ] **Image Upload**: Allow admins to upload hotel images directly via the dashboard.
- [ ] **Password Reset**: Implement "Forgot Password" email flow.
- [ ] **Email Verification**: Ensure users verify email before booking.

### Quality Assurance
- [x] **Image Stability**: Verified and updated all 93 hotel image URLs with official website links and stable CDN assets in both seed data and frontend fallback.
- [ ] **Responsive Admin**: Fix table overflows on mobile admin screens.
- [ ] **Error Handling**: Add more descriptive toast notifications for API failures.
