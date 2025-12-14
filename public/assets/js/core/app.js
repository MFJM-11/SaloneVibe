// Main application initialization and event bindings

document.addEventListener('DOMContentLoaded', () => {
  bindUI();
  bootstrapData();
});

function bindUI() {
  const searchInput = document.getElementById('searchInput');
  const genreSelect = document.getElementById('genreSelect');
  const citySelect = document.getElementById('citySelect');
  const heroBtn = document.getElementById('heroBtn');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const profileForm = document.getElementById('profileForm');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const artistLoginForm = document.getElementById('artistLoginForm');
  const adminArtistForm = document.getElementById('adminArtistForm');
  const adminArtistAccountForm = document.getElementById('adminArtistAccountForm');

  // Navigation
  document.querySelectorAll('[data-page]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateToPage(page);
      // Update active nav state
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
      });
    });
  });

  // Home page search/filters
  searchInput?.addEventListener('input', debounce((e) => {
    state.filters.search = e.target.value;
    fetchArtists(1);
  }, 300));

  genreSelect?.addEventListener('change', (e) => {
    state.filters.genre = e.target.value;
    renderGenreTags();
    fetchArtists(1);
  });

  citySelect?.addEventListener('change', (e) => {
    state.filters.city = e.target.value;
    fetchArtists(1);
  });

  // Artists page search/filters
  const artistsPageSearch = document.getElementById('artistsPageSearch');
  const artistsPageGenre = document.getElementById('artistsPageGenre');
  const artistsPageCity = document.getElementById('artistsPageCity');

  artistsPageSearch?.addEventListener('input', debounce((e) => {
    state.filters.search = e.target.value;
    fetchArtistsPage(1);
  }, 300));

  artistsPageGenre?.addEventListener('change', (e) => {
    state.filters.genre = e.target.value;
    fetchArtistsPage(1);
  });

  artistsPageCity?.addEventListener('change', (e) => {
    state.filters.city = e.target.value;
    fetchArtistsPage(1);
  });

  heroBtn?.addEventListener('click', () => {
    navigateToPage('artists');
  });

  // Hero panel buttons
  document.querySelectorAll('.hero-buttons .btn-cta').forEach(btn => {
    if (btn.textContent.includes('Play')) {
      btn.addEventListener('click', () => {
        toast('Playing trending Salone music mix');
      });
    }
  });

  // Mini player controls
  const miniPlayerPlay = document.querySelector('.mini-player .ctrl.primary');
  const miniPlayerPrev = document.querySelector('.mini-player .ctrl:first-of-type');
  const miniPlayerNext = document.querySelector('.mini-player .ctrl:last-of-type');
  
  let isPlaying = false;
  miniPlayerPlay?.addEventListener('click', () => {
    isPlaying = !isPlaying;
    const icon = miniPlayerPlay.querySelector('i');
    if (icon) {
      icon.className = isPlaying ? 'ri-pause-fill' : 'ri-play-fill';
    }
    toast(isPlaying ? 'Playing: Discover Salone' : 'Paused');
  });

  miniPlayerPrev?.addEventListener('click', () => {
    toast('Previous track');
  });

  miniPlayerNext?.addEventListener('click', () => {
    toast('Next track');
  });

  // Forgot Password
  document.querySelector('[type="button"].auth-link-btn')?.addEventListener('click', (e) => {
    if (e.target.textContent.includes('Forgot Password')) {
      toast('Password reset feature coming soon. Please contact support.');
    }
  });

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(loginForm);
    await login(form.get('email'), form.get('password'));
  });

  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(signupForm);
    const password = form.get('password');
    const passwordConfirm = form.get('password_confirm');
    
    // Validate password match
    if (password !== passwordConfirm) {
      toast('Passwords do not match');
      return;
    }
    
    // Combine first and last name for display_name
    const firstName = form.get('first_name') || '';
    const lastName = form.get('last_name') || '';
    const displayName = `${firstName} ${lastName}`.trim() || form.get('email')?.split('@')[0] || 'User';
    
    await signup(form.get('email'), password, displayName);
  });

  profileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateProfile(new FormData(profileForm));
  });

  artistLoginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(artistLoginForm);
    await login(form.get('email'), form.get('password'));
  });

  adminArtistForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.user || state.user.role !== 'admin') {
      toast('Admin only');
      return;
    }
    const form = new FormData(adminArtistForm);
    const payload = Object.fromEntries(form.entries());
    payload.notable_songs = payload.notable_songs ? payload.notable_songs.split(',').map((s) => s.trim()).filter(Boolean) : [];
    await createArtist(payload);
    adminArtistForm.reset();
    toast('Artist added');
    await fetchArtists(1);
  });

  adminArtistAccountForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.user || state.user.role !== 'admin') {
      toast('Admin only');
      return;
    }
    const form = new FormData(adminArtistAccountForm);
    await createArtistAccount(form.get('display_name'), form.get('email'), form.get('password'));
    adminArtistAccountForm.reset();
    toast('Artist account created');
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    setToken('');
    state.user = null;
    state.favorites = [];
    updateAuthUI();
    renderFavorites();
  });

  // Handle tab switching for auth modal
  document.querySelectorAll('[data-toggle="auth-tab"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      // Update tab switcher active state
      document.querySelectorAll('.auth-tab-switch').forEach(b => {
        if (b.dataset.target === target) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      // Show/hide tabs
      document.querySelectorAll('.auth-tab').forEach((el) => el.classList.add('hidden'));
      document.getElementById(target)?.classList.remove('hidden');
    });
  });

  document.querySelectorAll('[data-open]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.open));
  });
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  menuToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('hidden');
  });
}

async function bootstrapData() {
  populateOptions();
  populateArtistsPageOptions();
  updateAuthUI();
  await fetchArtists(1);
  if (state.token) {
    await fetchMe();
    await fetchFavorites();
  }
}

// Navigation functions
function navigateToPage(page) {
  // Hide all pages
  document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
  document.getElementById('artistDashboard')?.classList.add('hidden');
  
  // Show selected page
  if (page === 'home') {
    document.getElementById('homePage')?.classList.remove('hidden');
  } else if (page === 'artists') {
    document.getElementById('artistsPage')?.classList.remove('hidden');
    fetchArtistsPage(1);
  } else if (page === 'favorites') {
    document.getElementById('favoritesPage')?.classList.remove('hidden');
    renderFavoritesPage();
  } else if (page === 'about') {
    document.getElementById('aboutPage')?.classList.remove('hidden');
  } else if (page === 'admin') {
    document.getElementById('adminPage')?.classList.remove('hidden');
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function populateArtistsPageOptions() {
  const genreSelect = document.getElementById('artistsPageGenre');
  const citySelect = document.getElementById('artistsPageCity');
  if (genreSelect) {
    genreSelect.innerHTML = '<option value="">All genres</option>';
    GENRES.forEach((g) => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      genreSelect.appendChild(opt);
    });
  }
  if (citySelect) {
    citySelect.innerHTML = '<option value="">All locations</option>';
    CITIES.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      citySelect.appendChild(opt);
    });
  }
}

async function fetchArtistsPage(page = 1) {
  const params = new URLSearchParams();
  if (state.filters.search) params.append('search', state.filters.search);
  if (state.filters.genre) params.append('genre', state.filters.genre);
  if (state.filters.city) params.append('city_or_region', state.filters.city);
  params.append('page', page);
  params.append('limit', 12);
  
  const loadingBar = document.getElementById('loadingBarArtists');
  loadingBar?.classList.remove('hidden');
  
  try {
    const res = await fetch(`${API_BASE}/artists?${params.toString()}`);
    const data = await res.json();
    const artists = data.data || [];
    const pagination = data.pagination;
    
    renderArtistsPage(artists);
    renderPaginationPage(pagination);
  } catch (e) {
    console.error(e);
    toast('Unable to load artists right now.');
  } finally {
    loadingBar?.classList.add('hidden');
  }
}

function renderArtistsPage(artists) {
  const grid = document.getElementById('artistsPageGrid');
  if (!grid) return;
  grid.innerHTML = '';
  
  if (!artists.length) {
    grid.innerHTML = `<div class="text-center text-slate-400 py-5 col-span-full">No artists found.</div>`;
    return;
  }
  
  artists.forEach((artist) => {
    const card = document.createElement('div');
    card.className = 'card-enter';
    const imageHtml = artist.image_url 
      ? `<img src="${artist.image_url}" alt="${artist.stage_name || artist.name}" />`
      : '';
    card.innerHTML = `
      <div class="artist-card glass p-4 h-full flex flex-col gap-3 rounded-2xl">
        <div class="artist-card-image image-placeholder">
          ${imageHtml}
        </div>
        <div class="flex items-center gap-3">
          <div class="avatar">${(artist.stage_name || artist.name || '?').slice(0, 2).toUpperCase()}</div>
          <div>
            <div class="text-lg font-semibold">${artist.stage_name || artist.name}</div>
            <div class="text-sm text-slate-400">${artist.city_or_region || 'Sierra Leone'}</div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="tag">${artist.genre || 'Genre'}</span>
          <span class="tag">${artist.country || 'Sierra Leone'}</span>
        </div>
        <p class="text-sm text-slate-400 flex-1">${truncate(artist.bio, 110)}</p>
        <div class="flex items-center justify-between">
          <button class="btn-gradient text-sm px-4 py-2 rounded-full" data-artist="${artist.id}">View Details</button>
          <button class="btn-soft text-sm px-3 py-2 rounded-full favorite-btn ${isFavorite(artist.id) ? 'active' : ''}" data-fav="${artist.id}">
            <i class="${isFavorite(artist.id) ? 'ri-heart-fill text-emerald-400' : 'ri-heart-line'}"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  
  attachCardEvents();
  animateOnScroll();
}

function renderPaginationPage(pagination) {
  const wrapper = document.getElementById('paginationArtists');
  if (!wrapper || !pagination) return;
  wrapper.innerHTML = '';
  const { page, pages } = pagination;
  if (pages <= 1) return;
  
  const prev = document.createElement('button');
  prev.className = 'btn-soft px-3 py-2 rounded-full text-sm';
  prev.textContent = 'Prev';
  prev.disabled = page <= 1;
  prev.onclick = () => fetchArtistsPage(page - 1);
  
  const next = document.createElement('button');
  next.className = 'btn-soft px-3 py-2 rounded-full text-sm';
  next.textContent = 'Next';
  next.disabled = page >= pages;
  next.onclick = () => fetchArtistsPage(page + 1);
  
  wrapper.appendChild(prev);
  wrapper.appendChild(next);
}

function renderFavoritesPage() {
  const grid = document.getElementById('favoritesPageGrid');
  if (!grid) return;
  
  if (!state.token) {
    grid.innerHTML = `
      <div class="glass-strong p-8 rounded-2xl text-center col-span-full">
        <i class="ri-heart-3-line text-6xl text-slate-400 mb-4"></i>
        <h3 class="text-xl font-semibold mb-2">Log in to save favorites</h3>
        <p class="text-slate-400 mb-4">Create an account to start saving your favorite artists.</p>
        <button class="btn-gradient" data-open="authModal">Sign Up Now</button>
      </div>
    `;
    return;
  }
  
  if (!state.favorites || state.favorites.length === 0) {
    grid.innerHTML = `
      <div class="glass-strong p-8 rounded-2xl text-center col-span-full">
        <i class="ri-heart-3-line text-6xl text-slate-400 mb-4"></i>
        <h3 class="text-xl font-semibold mb-2">No favorites yet</h3>
        <p class="text-slate-400 mb-4">Start exploring artists and add them to your favorites!</p>
        <button class="btn-gradient" onclick="navigateToPage('artists')">Browse Artists</button>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = '';
  state.favorites.forEach((artist) => {
    const card = document.createElement('div');
    card.className = 'card-enter';
    const imageHtml = artist.image_url 
      ? `<img src="${artist.image_url}" alt="${artist.stage_name || artist.name}" />`
      : '';
    card.innerHTML = `
      <div class="artist-card glass p-4 h-full flex flex-col gap-3 rounded-2xl">
        <div class="artist-card-image image-placeholder">
          ${imageHtml}
        </div>
        <div class="flex items-center gap-3">
          <div class="avatar">${(artist.stage_name || artist.name || '?').slice(0, 2).toUpperCase()}</div>
          <div>
            <div class="text-lg font-semibold">${artist.stage_name || artist.name}</div>
            <div class="text-sm text-slate-400">${artist.city_or_region || 'Sierra Leone'}</div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="tag">${artist.genre || 'Genre'}</span>
          <span class="tag">${artist.country || 'Sierra Leone'}</span>
        </div>
        <p class="text-sm text-slate-400 flex-1">${truncate(artist.bio, 110)}</p>
        <div class="flex items-center justify-between">
          <button class="btn-gradient text-sm px-4 py-2 rounded-full" data-artist="${artist.id || artist.artist_id}">View Details</button>
          <button class="btn-soft text-sm px-3 py-2 rounded-full favorite-btn active" data-fav="${artist.id || artist.artist_id}">
            <i class="ri-heart-fill text-emerald-400"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  
  attachCardEvents();
  animateOnScroll();
}
