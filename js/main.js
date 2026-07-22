document.addEventListener('DOMContentLoaded', async function() {

  const isInsidePages = window.location.pathname.includes('/pages/');
  const BASE = isInsidePages ? '' : 'pages/';

  // Sync with API first if available
  if (typeof syncWithAPI === 'function') {
    await syncWithAPI();
  }

  initScrollAnimations();
  initNavbarScroll();
  initMobileMenu();
  initFavoriteToggle();
  initMatchBars();

  if (document.querySelector('.wizard-card')) initWizard();
  if (document.querySelector('.hotels-container')) initHotelFilters();
  if (document.querySelector('.detail-page')) initDetailPage();
  if (document.getElementById('featuredHotels')) initFeaturedHotels();

  // Auth initialization
  initAuth();

});

// ──── Auth Helpers ────

function initAuth() {
  const token = localStorage.getItem('renny_token');
  const user = JSON.parse(localStorage.getItem('renny_user') || 'null');

  updateNavbarAuth(user);

  if (document.getElementById('loginForm')) initLoginForm();
  if (document.getElementById('registerForm')) initRegisterForm();
  if (document.querySelector('.dashboard-page') || document.getElementById('welcomeMsg')) initUserDashboard();
  if (document.getElementById('favoritesGrid')) initFavoritesPage();
  if (document.querySelector('.profile-page')) initProfilePage();
  if (document.querySelector('.admin-dashboard')) initAdminDashboard();
  if (document.getElementById('adminHotelsTable')) initManageHotels();
  if (document.getElementById('adminUsersTable')) initManageUsers();
  if (document.getElementById('adminReviewsTable')) initManageReviews();
}

async function initManageUsers() {
  const token = localStorage.getItem('renny_token');
  const tableBody = document.getElementById('adminUsersTable');
  if (!tableBody) return;

  try {
    const res = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const users = await res.json();

    function renderUsers(list) {
      document.getElementById('userCount').textContent = `${list.length} registered users`;
      tableBody.innerHTML = list.map(u => `
        <tr>
          <td>${u.id}</td>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td><span class="status-badge ${u.role === 'admin' ? 'active' : 'pending'}">${u.role}</span></td>
          <td>${new Date(u.created_at).toLocaleDateString()}</td>
          <td>
            <button class="action-btn edit" onclick="toggleUserRole(${u.id}, '${u.role}')" title="Toggle Admin Role"><i class="fa-solid fa-user-shield"></i></button>
            <button class="action-btn delete" onclick="deleteUser(${u.id})"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
    }

    renderUsers(users);

    document.getElementById('adminUserSearch')?.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      renderUsers(users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)));
    });

  } catch (err) { console.error(err); }
}

async function toggleUserRole(id, currentRole) {
  const token = localStorage.getItem('renny_token');
  const newRole = currentRole === 'admin' ? 'user' : 'admin';
  if (!confirm(`Change user to ${newRole}?`)) return;

  try {
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) { showToast('User role updated', 'check'); location.reload(); }
  } catch (err) { showToast('Update failed', 'exclamation'); }
}

async function deleteUser(id) {
  const token = localStorage.getItem('renny_token');
  if (!confirm('Delete this user account?')) return;

  try {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) { showToast('User deleted', 'trash'); location.reload(); }
  } catch (err) { showToast('Delete failed', 'exclamation'); }
}

async function initManageReviews() {
  const token = localStorage.getItem('renny_token');
  const tableBody = document.getElementById('adminReviewsTable');
  if (!tableBody) return;

  try {
    const res = await fetch('/api/admin/reviews', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const reviews = await res.json();

    function renderReviews(list) {
      document.getElementById('reviewCount').textContent = `${list.length} total reviews`;
      tableBody.innerHTML = list.map(r => `
        <tr>
          <td>${r.id}</td>
          <td>${r.user_name}</td>
          <td>${r.hotel_name}</td>
          <td>${'★'.repeat(r.rating)}</td>
          <td title="${r.comment}">${r.comment.substring(0, 30)}...</td>
          <td>${new Date(r.created_at).toLocaleDateString()}</td>
          <td>
            <button class="action-btn delete" onclick="deleteReview(${r.id})"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
    }

    renderReviews(reviews);

    document.getElementById('adminReviewSearch')?.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      renderReviews(reviews.filter(r =>
        r.user_name.toLowerCase().includes(term) || r.hotel_name.toLowerCase().includes(term) || r.comment.toLowerCase().includes(term)
      ));
    });

  } catch (err) { console.error(err); }
}

async function deleteReview(id) {
  const token = localStorage.getItem('renny_token');
  if (!confirm('Delete this review?')) return;

  try {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) { showToast('Review deleted', 'trash'); location.reload(); }
  } catch (err) { showToast('Delete failed', 'exclamation'); }
}

async function initProfilePage() {
  const user = JSON.parse(localStorage.getItem('renny_user') || 'null');
  const token = localStorage.getItem('renny_token');
  if (!user) { window.location.href = 'login.html'; return; }

  // Init sidebar and profile header
  document.getElementById('userNameSidebar').textContent = user.name;
  document.getElementById('userEmailSidebar').textContent = user.email;
  document.getElementById('userAvatar').textContent = user.name.split(' ').map(n => n[0]).join('');

  document.getElementById('profileNameBig').textContent = user.name;
  document.getElementById('profileEmailBig').textContent = user.email;
  document.getElementById('profileAvatarBig').textContent = user.name.split(' ').map(n => n[0]).join('');
  document.getElementById('profName').value = user.name;
  document.getElementById('profEmail').value = user.email;
  document.getElementById('profRole').textContent = user.role;
  document.getElementById('profId').textContent = `#${user.id.toString().padStart(4, '0')}`;

  const form = document.getElementById('profileForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('profName').value;
    const email = document.getElementById('profEmail').value;

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email })
      });
      if (res.ok) {
        const updatedUser = { ...user, name, email };
        localStorage.setItem('renny_user', JSON.stringify(updatedUser));
        showToast('Profile updated successfully!', 'check-circle');
        setTimeout(() => location.reload(), 1000);
      } else {
        const data = await res.json();
        showToast(data.error || 'Update failed', 'exclamation-circle');
      }
    } catch (err) {
      showToast('Connection error', 'wifi');
    }
  });
}

let allAdminHotels = [];
async function initManageHotels() {
  const token = localStorage.getItem('renny_token');
  const tableBody = document.getElementById('adminHotelsTable');
  if (!tableBody) return;

  try {
    const res = await fetch('/api/hotels');
    allAdminHotels = await res.json();
    renderAdminHotels(allAdminHotels);

    document.getElementById('adminHotelSearch')?.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allAdminHotels.filter(h =>
        h.name.toLowerCase().includes(term) || h.city.toLowerCase().includes(term)
      );
      renderAdminHotels(filtered);
    });
  } catch (err) {
    console.error('Fetch hotels error:', err);
  }

  document.getElementById('hotelForm').addEventListener('submit', handleHotelSubmit);
}

function renderAdminHotels(hotels) {
  const tableBody = document.getElementById('adminHotelsTable');
  document.getElementById('hotelCount').textContent = `${hotels.length} hotels total`;

  tableBody.innerHTML = hotels.map(h => `
    <tr>
      <td>${h.id}</td>
      <td><img src="${h.image}" class="admin-table-img" alt="Hotel"></td>
      <td><strong>${h.name}</strong></td>
      <td>${h.city}</td>
      <td>${formatPrice(Math.round(h.price * USD_TO_TSH))}</td>
      <td>${h.stars}★</td>
      <td>${h.rating}</td>
      <td>
        <button class="action-btn edit" onclick="editHotel(${h.id})"><i class="fa-solid fa-pen"></i></button>
        <button class="action-btn delete" onclick="deleteHotel(${h.id})"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

function prepareHotelForm() {
  document.getElementById('hotelForm').reset();
  document.getElementById('hotelId').value = '';
  document.getElementById('hotelModalLabel').textContent = 'Add New Hotel';
}

function editHotel(id) {
  const hotel = allAdminHotels.find(h => h.id === id);
  if (!hotel) return;

  document.getElementById('hotelId').value = hotel.id;
  document.getElementById('hName').value = hotel.name;
  document.getElementById('hCity').value = hotel.city;
  document.getElementById('hDesc').value = hotel.description;
  document.getElementById('hPrice').value = hotel.price;
  document.getElementById('hStars').value = hotel.stars;
  document.getElementById('hRating').value = hotel.rating;
  document.getElementById('hAddress').value = hotel.address;
  document.getElementById('hContact').value = hotel.contact;
  document.getElementById('hImage').value = hotel.image;
  document.getElementById('hImage2').value = hotel.image2 || '';
  document.getElementById('hImage3').value = hotel.image3 || '';
  document.getElementById('hAmenities').value = hotel.amenities ? hotel.amenities.join(', ') : '';

  document.getElementById('hotelModalLabel').textContent = 'Edit Hotel';
  const modal = new bootstrap.Modal(document.getElementById('hotelModal'));
  modal.show();
}

async function deleteHotel(id) {
  if (!confirm('Are you sure you want to delete this hotel?')) return;
  const token = localStorage.getItem('renny_token');

  try {
    const res = await fetch(`/api/hotels/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      showToast('Hotel deleted', 'trash');
      allAdminHotels = allAdminHotels.filter(h => h.id !== id);
      renderAdminHotels(allAdminHotels);
    }
  } catch (err) {
    showToast('Delete failed', 'exclamation');
  }
}

async function handleHotelSubmit(e) {
  e.preventDefault();
  const token = localStorage.getItem('renny_token');
  const id = document.getElementById('hotelId').value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/hotels/${id}` : '/api/hotels';

  const hotelData = {
    name: document.getElementById('hName').value,
    city: document.getElementById('hCity').value,
    description: document.getElementById('hDesc').value,
    price: parseFloat(document.getElementById('hPrice').value),
    stars: parseInt(document.getElementById('hStars').value),
    rating: parseFloat(document.getElementById('hRating').value || 0),
    address: document.getElementById('hAddress').value,
    contact: document.getElementById('hContact').value,
    image: document.getElementById('hImage').value,
    image2: document.getElementById('hImage2').value,
    image3: document.getElementById('hImage3').value,
    amenities: document.getElementById('hAmenities').value.split(',').map(s => s.trim()).filter(s => s)
  };

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(hotelData)
    });
    if (res.ok) {
      showToast(id ? 'Hotel updated!' : 'Hotel added!', 'check-circle');
      bootstrap.Modal.getInstance(document.getElementById('hotelModal')).hide();
      setTimeout(() => location.reload(), 1000);
    } else {
      const data = await res.json();
      showToast(data.error || 'Operation failed', 'exclamation-circle');
    }
  } catch (err) {
    showToast('Connection error', 'wifi');
  }
}

async function initFavoritesPage() {
  const user = JSON.parse(localStorage.getItem('renny_user') || 'null');
  const token = localStorage.getItem('renny_token');
  if (!user) { window.location.href = 'login.html'; return; }

  // Reuse sidebar init
  if (document.getElementById('userNameSidebar')) {
    document.getElementById('userNameSidebar').textContent = user.name;
    document.getElementById('userEmailSidebar').textContent = user.email;
    document.getElementById('userAvatar').textContent = user.name.split(' ').map(n => n[0]).join('');
  }

  const grid = document.getElementById('favoritesGrid');
  try {
    const res = await fetch('/api/favorites/mine', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const hotels = (await res.json()).map(h => ({ ...h, price: Math.round(h.price * USD_TO_TSH) }));

    if (hotels.length === 0) {
      grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">You haven\'t saved any hotels yet.</p><a href="hotels.html" class="btn btn-gold">Browse Hotels</a></div>';
      return;
    }

    const isInsidePages = window.location.pathname.includes('/pages/');
    const BASE = isInsidePages ? '' : 'pages/';

    grid.innerHTML = hotels.map(hotel => `
      <div class="col-lg-4 col-md-6">
        <div class="hotel-card" data-hotel-id="${hotel.id}" onclick="window.location.href='hotel-details.html?id=${hotel.id}'">
          <div class="card-image">
            <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">
            <button class="card-fav active"><i class="fa-solid fa-heart"></i></button>
          </div>
          <div class="card-body">
            <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${hotel.city}</p>
            <h5 class="card-title">${hotel.name}</h5>
            <div class="card-rating">
              <span class="stars">${'★'.repeat(hotel.stars)}</span>
              <span class="score">${hotel.rating}</span>
            </div>
            <div class="card-meta">
              <span class="card-price">${formatPrice(hotel.price)} <small>/night</small></span>
              <a href="hotel-details.html?id=${hotel.id}" class="btn btn-outline-gold btn-sm">View</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    initFavoriteToggle();
  } catch (err) {
    grid.innerHTML = '<p class="text-danger">Failed to load favorites.</p>';
  }
}

function updateNavbarAuth(user) {
  const authArea = document.querySelector('.navbar .d-flex.gap-2');
  if (!authArea) return;

  if (user) {
    const isInsidePages = window.location.pathname.includes('/pages/');
    const p = isInsidePages ? '' : 'pages/';
    const dashboardLink = user.role === 'admin' ? `${p}admin/dashboard.html` : `${p}dashboard.html`;

    authArea.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-gold btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <i class="fa-solid fa-user-circle me-1"></i> ${user.name.split(' ')[0]}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="${dashboardLink}"><i class="fa-solid fa-gauge me-2"></i>Dashboard</a></li>
          ${user.role === 'user' ? `<li><a class="dropdown-item" href="${p}favorites.html"><i class="fa-solid fa-heart me-2"></i>Favorites</a></li>` : ''}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="btnLogout"><i class="fa-solid fa-right-from-bracket me-2"></i>Sign Out</a></li>
        </ul>
      </div>
    `;

    document.getElementById('btnLogout')?.addEventListener('click', logout);
    document.getElementById('btnLogoutDashboard')?.addEventListener('click', logout);
    document.getElementById('btnLogoutAdmin')?.addEventListener('click', logout);
  }
}

function logout(e) {
  e.preventDefault();
  const isInsidePages = window.location.pathname.includes('/pages/');
  const isInsideAdmin = window.location.pathname.includes('/admin/');

  localStorage.removeItem('renny_token');
  localStorage.removeItem('renny_user');

  if (isInsideAdmin) window.location.href = '../../index.html';
  else if (isInsidePages) window.location.href = '../index.html';
  else window.location.href = 'index.html';
}

async function initLoginForm() {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('renny_token', data.token);
        localStorage.setItem('renny_user', JSON.stringify(data.user));
        showToast('Login successful!', 'check-circle');

        setTimeout(() => {
          if (data.user.role === 'admin') window.location.href = 'admin/dashboard.html';
          else window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        showToast(data.error || 'Login failed', 'exclamation-circle');
      }
    } catch (err) {
      showToast('Server error. Please try again later.', 'wifi');
    }
  });
}

async function initRegisterForm() {
  const form = document.getElementById('registerForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('renny_token', data.token);
        localStorage.setItem('renny_user', JSON.stringify(data.user));
        showToast('Account created!', 'check-circle');
        setTimeout(() => window.location.href = 'dashboard.html', 1000);
      } else {
        showToast(data.error || 'Registration failed', 'exclamation-circle');
      }
    } catch (err) {
      showToast('Server error. Please try again later.', 'wifi');
    }
  });
}

async function initUserDashboard() {
  const user = JSON.parse(localStorage.getItem('renny_user') || 'null');
  const token = localStorage.getItem('renny_token');

  if (!user || user.role !== 'user') {
    window.location.href = 'login.html';
    return;
  }

  // Set basic info
  document.getElementById('userNameSidebar').textContent = user.name;
  document.getElementById('userEmailSidebar').textContent = user.email;
  document.getElementById('userAvatar').textContent = user.name.split(' ').map(n => n[0]).join('');
  document.getElementById('welcomeMsg').textContent = `Welcome back, ${user.name.split(' ')[0]}!`;

  document.getElementById('btnLogoutDashboard')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('renny_token');
    localStorage.removeItem('renny_user');
    window.location.href = '../index.html';
  });

  try {
    // Fetch Favorites
    const favRes = await fetch('/api/favorites/mine', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const favorites = await favRes.json();
    document.getElementById('countFavorites').textContent = favorites.length;

    // Fetch Reviews (assuming an endpoint exists or we fetch all reviews and filter)
    // For now, let's just use placeholder or implement getMine in reviews
    document.getElementById('countReviews').textContent = '0';
    document.getElementById('countCities').textContent = [...new Set(favorites.map(f => f.city))].length;
  } catch (err) {
    console.error('Dashboard fetch error:', err);
  }
}

async function initAdminDashboard() {
  const user = JSON.parse(localStorage.getItem('renny_user') || 'null');
  const token = localStorage.getItem('renny_token');

  if (!user || user.role !== 'admin') {
    window.location.href = '../login.html';
    return;
  }

  document.getElementById('btnLogoutAdmin')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('renny_token');
    localStorage.removeItem('renny_user');
    window.location.href = '../../index.html';
  });

  try {
    const res = await fetch('/api/admin/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const stats = await res.json();
      document.getElementById('adminStatHotels').textContent = stats.hotels;
      document.getElementById('adminStatUsers').textContent = stats.users;
      document.getElementById('adminStatReviews').textContent = stats.reviews;
      document.getElementById('adminStatFavorites').textContent = stats.favorites;
    }
  } catch (err) {
    console.error('Admin stats fetch error:', err);
  }
}

async function initFeaturedHotels() {
  const container = document.getElementById('featuredHotels');
  if (!container) return;

  const isInsidePages = window.location.pathname.includes('/pages/');
  const BASE = isInsidePages ? '' : 'pages/';

  // Get top 3 hotels by rating as "featured"
  const hotels = [...HOTELS].sort((a, b) => b.rating - a.rating).slice(0, 3);

  container.innerHTML = hotels.map(hotel => `
    <div class="col-lg-4 col-md-6 animate-on-scroll">
      <div class="hotel-card" data-hotel-id="${hotel.id}" onclick="window.location.href='${BASE}hotel-details.html?id=${hotel.id}'">
        <div class="card-image">
          <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">
          <span class="card-badge match">${Math.round(hotel.rating * 20)}% Score</span>
          <button class="card-fav"><i class="fa-regular fa-heart"></i></button>
        </div>
        <div class="card-body">
          <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${hotel.city}</p>
          <h5 class="card-title">${hotel.name}</h5>
          <div class="card-rating">
            <span class="stars">${'★'.repeat(Math.round(hotel.rating))}${ '☆'.repeat(5 - Math.round(hotel.rating))}</span>
            <span class="score">${hotel.rating}</span>
          </div>
          <p class="text-muted small mb-2">${hotel.description.substring(0, 80)}...</p>
          <div class="card-meta">
            <span class="card-price">${formatPrice(hotel.price)} <small>/night</small></span>
            <a href="${BASE}hotel-details.html?id=${hotel.id}" class="btn btn-outline-gold btn-sm">View</a>
          </div>
          <div class="match-bar"><div class="fill" data-score="${Math.round(hotel.rating * 20)}%"></div></div>
        </div>
      </div>
    </div>
  `).join('');

  initFavoriteToggle();
  initMatchBars();
  initScrollAnimations();
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initMobileMenu() {
  const toggler = document.querySelector('.navbar-toggler');
  const collapse = document.querySelector('.navbar-collapse');
  if (!toggler || !collapse) return;

  toggler.addEventListener('click', () => {
    collapse.classList.toggle('show');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      collapse.classList.remove('show');
    });
  });
}

function initFavoriteToggle() {
  const token = localStorage.getItem('renny_token');

  document.querySelectorAll('.card-fav').forEach(btn => {
    const card = btn.closest('.hotel-card');
    const hotelId = card ? card.dataset.hotelId : null;

    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!token) {
        showToast('Please sign in to favorite hotels', 'info');
        return;
      }

      if (!hotelId) return;

      const icon = this.querySelector('i');
      try {
        const res = await fetch(`/api/favorites/toggle/${hotelId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.favorited) {
          this.classList.add('active');
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
          showToast('Added to favorites!', 'heart');
        } else {
          this.classList.remove('active');
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
          showToast('Removed from favorites', 'heart');
        }
      } catch (err) {
        showToast('Error updating favorites', 'exclamation-triangle');
      }
    });
  });
}

function initMatchBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.fill');
        if (bar) {
          bar.style.width = bar.dataset.score || '0%';
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.match-bar').forEach(el => observer.observe(el));
}

function showToast(message, icon = 'info') {
  const container = document.querySelector('.toast-container');
  if (!container) {
    const div = document.createElement('div');
    div.className = 'toast-container';
    document.body.appendChild(div);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-custom';
  toast.innerHTML = `<i class="fa-${icon === 'heart' ? 'solid' : 'regular'} fa-${icon === 'heart' ? 'heart' : 'circle-check'}"></i> ${message}`;
  document.querySelector('.toast-container').appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function initWizard() {
  let currentStep = 1;
  const totalSteps = 4;
  let preferences = { amenities: [] };

  const amenityNames = getAllAmenities();
  const amenityGrid = document.getElementById('amenityGrid');
  if (amenityGrid) {
    amenityGrid.innerHTML = amenityNames.map(a =>
      `<div class="amenity-chip" data-amenity="${a}">
        <i class="fa-regular fa-square"></i>
        <span>${a}</span>
      </div>`
    ).join('');

    amenityGrid.querySelectorAll('.amenity-chip').forEach(chip => {
      chip.addEventListener('click', function() {
        this.classList.toggle('selected');
        const icon = this.querySelector('i');
        if (this.classList.contains('selected')) {
          icon.className = 'fa-regular fa-square-check';
        } else {
          icon.className = 'fa-regular fa-square';
        }
      });
    });
  }

  const citySelect = document.getElementById('wizardCity');
  const regionSelect = document.getElementById('wizardRegion');

  if (regionSelect) {
    const regions = getRegions();
    regions.forEach(region => {
      const opt = document.createElement('option');
      opt.value = region;
      opt.textContent = region;
      regionSelect.appendChild(opt);
    });
  }

  if (citySelect) {
    const cities = getCities();
    cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }

  function updateSteps() {
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
      step.classList.remove('active', 'done');
      const num = index + 1;
      const numSpan = step.querySelector('.step-num');

      if (num === currentStep) {
        step.classList.add('active');
        numSpan.innerHTML = num;
      } else if (num < currentStep) {
        step.classList.add('done');
        numSpan.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else {
        numSpan.innerHTML = num;
      }
    });
  }

  function showStep(step) {
    document.querySelectorAll('.step-panel').forEach(p => p.classList.add('d-none'));
    const panel = document.querySelector(`.step-panel[data-step="${step}"]`);
    if (panel) panel.classList.remove('d-none');

    const prevBtn = document.getElementById('wizardPrev');
    const nextBtn = document.getElementById('wizardNext');
    const submitBtn = document.getElementById('wizardSubmit');

    if (step === 5) {
      prevBtn.classList.add('d-none');
      nextBtn.classList.add('d-none');
      submitBtn.classList.add('d-none');
    } else {
      prevBtn.classList.toggle('d-none', step === 1);
      if (step === totalSteps) {
        nextBtn.classList.add('d-none');
        submitBtn.classList.remove('d-none');
      } else {
        nextBtn.classList.remove('d-none');
        submitBtn.classList.add('d-none');
      }
    }
  }

  function collectStepData(step) {
    switch(step) {
      case 1:
        preferences.region = document.getElementById('wizardRegion').value || '';
        preferences.city = document.getElementById('wizardCity').value || '';
        return !!(preferences.region || preferences.city);
      case 2:
        preferences.maxBudget = parseInt(document.getElementById('wizardBudget').value) || 0;
        return true;
      case 3:
        const selected = [];
        document.querySelectorAll('.amenity-chip.selected').forEach(chip => {
          selected.push(chip.dataset.amenity);
        });
        preferences.amenities = selected;
        return true;
      case 4:
        const stars = document.querySelector('input[name="wizardStars"]:checked');
        preferences.minStars = stars ? parseInt(stars.value) : 0;
        return true;
    }
    return true;
  }

  async function showResults() {
    showStep(5);
    const container = document.getElementById('wizardResults');
    container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-gold" role="status"></div><p class="mt-2 text-muted">Calculating matches...</p></div>';

    const results = await getRecommendations(preferences);
    container.innerHTML = '';

    if (!results || results.length === 0) {
      container.innerHTML = '<p class="text-center text-gray-400">No matching hotels found. Try adjusting your preferences.</p>';
      return;
    }

    const top = results.slice(0, 5);
    top.forEach((hotel, i) => {
      const div = document.createElement('div');
      div.className = 'result-card';
      div.innerHTML = `
        <div class="r-img">
          <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">
        </div>
        <div class="r-info">
          <h6>${hotel.name}</h6>
          <p>${hotel.city} · ${'★'.repeat(hotel.stars)} · ${formatPrice(hotel.price)}/night</p>
        </div>
        <div class="r-score">
          <span class="score-num">${hotel.matchScore}%</span>
          <span class="score-label">Match</span>
        </div>
      `;
      div.addEventListener('click', () => {
        window.location.href = `${BASE}hotel-details.html?id=${hotel.id}`;
      });
      container.appendChild(div);

      setTimeout(() => div.style.opacity = '1', i * 100);
    });
  }

  document.getElementById('wizardNext').addEventListener('click', function() {
    if (!collectStepData(currentStep)) {
      showToast('Please fill in the required fields', 'exclamation');
      return;
    }
    if (currentStep < totalSteps) {
      currentStep++;
      updateSteps();
      showStep(currentStep);
    }
  });

  document.getElementById('wizardPrev').addEventListener('click', function() {
    if (currentStep > 1) {
      currentStep--;
      updateSteps();
      showStep(currentStep);
    }
  });

  document.getElementById('wizardSubmit').addEventListener('click', function() {
    collectStepData(currentStep);
    showResults();
  });

  updateSteps();
  showStep(1);
}

function initHotelFilters() {
  const regionFilter = document.getElementById('filterRegion');
  const cityFilter = document.getElementById('filterCity');
  const priceRange = document.getElementById('filterPrice');
  const priceDisplay = document.getElementById('filterPriceValue');
  const searchInput = document.getElementById('filterSearch');

  if (regionFilter) {
    const regions = getRegions();
    regions.forEach(region => {
      const opt = document.createElement('option');
      opt.value = region;
      opt.textContent = region;
      regionFilter.appendChild(opt);
    });
  }

  if (cityFilter) {
    const cities = getCities();
    cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      cityFilter.appendChild(opt);
    });
  }

  if (priceRange && priceDisplay) {
    priceRange.addEventListener('input', function() {
      priceDisplay.textContent = formatPrice(this.value);
      applyFilters();
    });
  }

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilters, 300);
    });
  }

  document.querySelectorAll('.rating-filter .star-option').forEach(el => {
    el.addEventListener('click', function() {
      document.querySelectorAll('.rating-filter .star-option').forEach(s => s.classList.remove('active'));
      this.classList.add('active');
      applyFilters();
    });
  });

  document.querySelectorAll('.filter-checkbox').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  if (cityFilter) cityFilter.addEventListener('change', applyFilters);
  if (regionFilter) regionFilter.addEventListener('change', applyFilters);

  applyFilters();

  async function applyFilters() {
    const filters = {
      search: searchInput ? searchInput.value : '',
      region: regionFilter ? regionFilter.value : '',
      city: cityFilter ? cityFilter.value : '',
      maxBudget: priceRange ? parseInt(priceRange.value) : 15000000,
      minStars: parseInt(document.querySelector('.rating-filter .star-option.active')?.dataset?.stars || '0'),
      amenities: [],
      strict: true
    };

    document.querySelectorAll('.filter-checkbox:checked').forEach(cb => {
      filters.amenities.push(cb.value);
    });

    const results = await getRecommendations(filters);
    renderHotels(results);
  }

  function renderHotels(hotels) {
    const grid = document.getElementById('hotelsGrid');
    if (!grid) return;

    if (hotels.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fa-regular fa-building" style="font-size: 3rem; color: var(--gray-300);"></i>
          <h5 class="mt-3 text-muted">No hotels match your filters</h5>
          <p class="text-muted">Try adjusting your criteria</p>
        </div>
      `;
      return;
    }

    const isInsidePages = window.location.pathname.includes('/pages/');
    const BASE = isInsidePages ? '' : 'pages/';

    grid.innerHTML = hotels.map(hotel => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="hotel-card" data-hotel-id="${hotel.id}" onclick="window.location.href='${BASE}hotel-details.html?id=${hotel.id}'">
          <div class="card-image">
            <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">
            <span class="card-badge match">${hotel.matchScore}% Match</span>
            <button class="card-fav"><i class="fa-regular fa-heart"></i></button>
          </div>
          <div class="card-body">
            <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${hotel.city}</p>
            <h5 class="card-title">${hotel.name}</h5>
            <div class="card-rating">
              <span class="stars">${'★'.repeat(hotel.stars)}${'☆'.repeat(5 - hotel.stars)}</span>
              <span class="score">${hotel.rating}</span>
            </div>
            <p class="text-muted small mb-2">${hotel.description.substring(0, 80)}...</p>
            <div class="card-meta">
              <span class="card-price">${formatPrice(hotel.price)} <small>/night</small></span>
              <a href="${BASE}hotel-details.html?id=${hotel.id}" class="btn btn-outline-gold btn-sm">View</a>
            </div>
            <div class="match-bar">
              <div class="fill" data-score="${hotel.matchScore}%" style="width: 0%"></div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    initFavoriteToggle();
    initMatchBars();
  }

  applyFilters();
}

async function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const hotelId = parseInt(params.get('id'));

  // Try to fetch from API first for fresh data (especially reviews)
  const hotel = await fetchHotelById(hotelId);

  if (!hotel) {
    document.querySelector('.detail-page').innerHTML = `
      <div class="container text-center py-5">
        <h2>Hotel not found</h2>
        <a href="hotels.html" class="btn btn-gold mt-3">Browse Hotels</a>
      </div>
    `;
    return;
  }

  document.getElementById('detailName').textContent = hotel.name;
  const heading = document.getElementById('detailNameHeading');
  if (heading) heading.textContent = hotel.name;
  document.getElementById('detailCity').textContent = hotel.city;
  document.getElementById('detailStars').textContent = '★'.repeat(hotel.stars);
  const starsSide = document.getElementById('detailStarsSide');
  if (starsSide) starsSide.textContent = '★'.repeat(hotel.stars);
  document.getElementById('detailRating').textContent = hotel.rating;
  document.getElementById('detailPrice').textContent = formatPrice(hotel.price);
  const priceSide = document.getElementById('detailPriceSide');
  if (priceSide) priceSide.textContent = formatPrice(hotel.price);
  document.getElementById('detailAddress').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${hotel.address}`;
  document.getElementById('detailContact').innerHTML = `<i class="fa-solid fa-phone"></i> ${hotel.contact}`;
  document.getElementById('detailDescription').textContent = hotel.description;

  // Multi-Sensory Audio Logic
  const btnPlay = document.getElementById('btnPlaySound');
  if (btnPlay && hotel.sound_url) {
    btnPlay.classList.remove('d-none');
    let audio = null;
    btnPlay.addEventListener('click', () => {
      if (!audio) {
        audio = new Audio(hotel.sound_url);
        audio.loop = true;
      }

      if (audio.paused) {
        audio.play();
        btnPlay.innerHTML = '<i class="fa-solid fa-pause me-2"></i>Stop Ambient Sound';
        btnPlay.classList.add('active-sound');
      } else {
        audio.pause();
        btnPlay.innerHTML = '<i class="fa-solid fa-volume-high me-2"></i>Listen to Environment';
        btnPlay.classList.remove('active-sound');
      }
    });
  }

  document.getElementById('detailMainImg').src = hotel.image;
  document.getElementById('detailMainImg').alt = hotel.name;
  if (document.getElementById('detailImg2')) document.getElementById('detailImg2').src = hotel.image2 || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600';
  if (document.getElementById('detailImg3')) document.getElementById('detailImg3').src = hotel.image3 || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600';

  // Add error handling for all images on the page
  document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
      this.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'; // Professional fallback
      this.onerror = null;
    };
  });

  const amenitiesContainer = document.getElementById('detailAmenities');
  amenitiesContainer.innerHTML = '';
  hotel.amenities.forEach(a => {
    const tag = document.createElement('span');
    tag.className = 'amenity-tag';
    tag.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${a}`;
    amenitiesContainer.appendChild(tag);
  });

  const reviewsContainer = document.getElementById('detailReviews');
  if (reviewsContainer) {
    if (hotel.reviews && hotel.reviews.length > 0) {
      reviewsContainer.innerHTML = hotel.reviews.map(r => `
        <div class="review-card">
          <div class="review-header">
            <div class="review-user">
              <div class="review-avatar">${r.user_name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <h6>${r.user_name}</h6>
                <small>Visited ${new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</small>
              </div>
            </div>
            <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
          </div>
          <p class="review-text">${r.comment}</p>
        </div>
      `).join('');
    } else {
      reviewsContainer.innerHTML = '<p class="text-muted">No reviews yet for this hotel.</p>';
    }
  }

  document.getElementById('detailReviewStars').innerHTML = `
    <span class="stars">${'★'.repeat(5)}</span>
    <span class="ms-2">${hotel.rating} / 5.0</span>
  `;

  document.querySelector('.detail-page .btn-fav')?.addEventListener('click', function() {
    this.classList.toggle('active');
    const icon = this.querySelector('i');
    if (this.classList.contains('active')) {
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
      showToast('Added to favorites!', 'heart');
    } else {
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-regular');
      showToast('Removed from favorites', 'heart');
    }
  });
}

function setActiveNav() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', setActiveNav);
