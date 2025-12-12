const API_BASE = '/api';
let state = {
  artists: [],
  pagination: null,
  filters: { search: '', genre: '', city: '' },
  selectedArtist: null,
  favorites: [],
  user: null,
  token: localStorage.getItem('salonevibe_token') || '',
};

const GENRES = [
  'Afrobeat', 'Afrobeats', 'Afro-fusion', 'Afropop', 'Hip-Hop', 'Dancehall', 'R&B', 'Reggae', 'Reggae/Dancehall', 'Folk', 'Gospel', 'Afro-soul'
];

const CITIES = [
  'Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu', 'Kono', 'Port Loko'
];

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

  searchInput?.addEventListener('input', debounce((e) => {
    state.filters.search = e.target.value;
    fetchArtists(1);
  }, 300));

  genreSelect?.addEventListener('change', (e) => {
    state.filters.genre = e.target.value;
    fetchArtists(1);
  });

  citySelect?.addEventListener('change', (e) => {
    state.filters.city = e.target.value;
    fetchArtists(1);
  });

  heroBtn?.addEventListener('click', () => {
    document.getElementById('artistGrid')?.scrollIntoView({ behavior: 'smooth' });
  });

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(loginForm);
    await login(form.get('email'), form.get('password'));
  });

  signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(signupForm);
    await signup(form.get('email'), form.get('password'), form.get('display_name'));
  });

  profileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateProfile(new FormData(profileForm));
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    setToken('');
    state.user = null;
    state.favorites = [];
    updateAuthUI();
    renderFavorites();
  });

  document.querySelectorAll('[data-toggle="auth-tab"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      document.querySelectorAll('.auth-tab').forEach((el) => el.classList.add('d-none'));
      document.getElementById(target)?.classList.remove('d-none');
    });
  });
}

async function bootstrapData() {
  populateOptions();
  updateAuthUI();
  await fetchArtists(1);
  if (state.token) {
    await fetchMe();
    await fetchFavorites();
  }
}

function populateOptions() {
  const genreSelect = document.getElementById('genreSelect');
  const citySelect = document.getElementById('citySelect');
  GENRES.forEach((g) => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    genreSelect?.appendChild(opt);
  });
  CITIES.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    citySelect?.appendChild(opt);
  });
}

async function fetchArtists(page = 1) {
  const params = new URLSearchParams();
  if (state.filters.search) params.append('search', state.filters.search);
  if (state.filters.genre) params.append('genre', state.filters.genre);
  if (state.filters.city) params.append('city_or_region', state.filters.city);
  params.append('page', page);
  params.append('limit', 12);
  showLoading(true);
  try {
    const res = await fetch(`${API_BASE}/artists?${params.toString()}`);
    const data = await res.json();
    state.artists = data.data || [];
    state.pagination = data.pagination;
    renderArtists();
    renderPagination();
  } catch (e) {
    console.error(e);
    toast('Unable to load artists right now.');
  } finally {
    showLoading(false);
  }
}

function renderArtists() {
  const grid = document.getElementById('artistGrid');
  grid.innerHTML = '';
  if (!state.artists.length) {
    grid.innerHTML = `<div class="text-center text-secondary py-5">No artists found.</div>`;
    return;
  }
  state.artists.forEach((artist) => {
    const card = document.createElement('div');
    card.className = 'col-12 col-sm-6 col-lg-4 mb-4 card-enter';
    card.innerHTML = `
      <div class="artist-card glass p-3 h-100">
        <div class="d-flex align-items-center gap-3 mb-3">
          <div class="avatar">${(artist.stage_name || artist.name || '?').slice(0, 2).toUpperCase()}</div>
          <div>
            <h5 class="mb-1">${artist.stage_name || artist.name}</h5>
            <div class="text-muted small">${artist.city_or_region || 'Sierra Leone'}</div>
          </div>
        </div>
        <div class="d-flex flex-wrap gap-2 mb-3">
          <span class="tag">${artist.genre || 'Genre'}</span>
          <span class="tag">${artist.country || 'Sierra Leone'}</span>
        </div>
        <p class="small text-secondary mb-3">${truncate(artist.bio, 110)}</p>
        <div class="d-flex justify-content-between align-items-center">
          <button class="btn btn-sm btn-gradient px-3" data-artist="${artist.id}">View Details</button>
          <button class="btn btn-sm btn-outline-light favorite-btn ${isFavorite(artist.id) ? 'active' : ''}" data-fav="${artist.id}">
            <i class="bi bi-heart${isFavorite(artist.id) ? '-fill' : ''}"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  attachCardEvents();
  animateOnScroll();
}

function renderPagination() {
  const wrapper = document.getElementById('pagination');
  if (!state.pagination) return;
  const { page, pages } = state.pagination;
  wrapper.innerHTML = '';
  if (pages <= 1) return;
  const prev = document.createElement('button');
  prev.className = 'btn btn-sm btn-outline-light me-2';
  prev.textContent = 'Prev';
  prev.disabled = page <= 1;
  prev.onclick = () => fetchArtists(page - 1);
  const next = document.createElement('button');
  next.className = 'btn btn-sm btn-outline-light';
  next.textContent = 'Next';
  next.disabled = page >= pages;
  next.onclick = () => fetchArtists(page + 1);
  wrapper.appendChild(prev);
  wrapper.appendChild(next);
}

function attachCardEvents() {
  document.querySelectorAll('[data-artist]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-artist');
      await loadArtist(id);
    });
  });
  document.querySelectorAll('[data-fav]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = Number(btn.getAttribute('data-fav'));
      if (!state.token) {
        toast('Log in to save favorites.');
        return;
      }
      if (isFavorite(id)) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
      renderArtists();
      renderFavorites();
    });
  });
}

async function loadArtist(id) {
  showDetailLoading(true);
  try {
    const res = await fetch(`${API_BASE}/artists/${id}`);
    if (!res.ok) throw new Error('Not found');
    const artist = await res.json();
    state.selectedArtist = artist;
    renderArtistDetail();
  } catch (e) {
    toast('Could not load artist.');
  } finally {
    showDetailLoading(false);
  }
}

function renderArtistDetail() {
  const pane = document.getElementById('artistDetail');
  const a = state.selectedArtist;
  if (!a) {
    pane.innerHTML = '<div class="text-secondary">Select an artist to view details.</div>';
    return;
  }
  pane.innerHTML = `
    <div class="glass-strong artist-detail p-4">
      <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
        <div>
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="avatar">${(a.stage_name || a.name).slice(0,2).toUpperCase()}</div>
            <div>
              <h3 class="mb-0">${a.stage_name || a.name}</h3>
              <div class="text-muted">${a.city_or_region || 'Sierra Leone'} • ${a.genre || ''}</div>
            </div>
          </div>
          <p class="text-secondary mb-3">${a.bio || ''}</p>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span class="tag">${a.genre || 'Genre'}</span>
            <span class="tag">${a.country || 'Sierra Leone'}</span>
            ${a.city_or_region ? `<span class="tag">${a.city_or_region}</span>` : ''}
          </div>
          <div class="mb-3">
            <h6 class="mb-2">Notable Songs</h6>
            <ul class="list-unstyled small mb-0">
              ${(a.notable_songs || []).map((s) => `<li class="mb-1">• ${s}</li>`).join('')}
            </ul>
          </div>
          <div class="d-flex flex-wrap gap-2 mb-3">
            ${linkIcon(a.social_youtube, 'YouTube')}
            ${linkIcon(a.social_spotify, 'Spotify')}
            ${linkIcon(a.social_instagram, 'Instagram')}
            ${linkIcon(a.social_facebook, 'Facebook')}
          </div>
        </div>
        <div class="d-flex flex-column align-items-end gap-2">
          <button class="btn btn-gradient mb-2" id="favoriteDetailBtn">
            <i class="bi bi-heart${isFavorite(a.id) ? '-fill' : ''} me-1"></i>
            ${isFavorite(a.id) ? 'Favorited' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('favoriteDetailBtn')?.addEventListener('click', async () => {
    if (!state.token) {
      toast('Log in to save favorites.');
      return;
    }
    if (isFavorite(a.id)) {
      await removeFavorite(a.id);
    } else {
      await addFavorite(a.id);
    }
    renderArtistDetail();
    renderArtists();
    renderFavorites();
  });
}

function linkIcon(url, label) {
  if (!url) return '';
  return `<a class="btn btn-sm btn-outline-light" target="_blank" rel="noopener" href="${url}">${label}</a>`;
}

function truncate(text = '', len = 120) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '…' : text;
}

function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function animateOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.card-enter').forEach((el) => observer.observe(el));
}

function showLoading(show) {
  const el = document.getElementById('loadingBar');
  if (!el) return;
  el.classList.toggle('d-none', !show);
}

function showDetailLoading(show) {
  const el = document.getElementById('detailLoading');
  if (!el) return;
  el.classList.toggle('d-none', !show);
}

function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return alert(msg);
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

function setToken(token) {
  state.token = token;
  if (token) localStorage.setItem('salonevibe_token', token);
  else localStorage.removeItem('salonevibe_token');
}

async function signup(email, password, displayName) {
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, display_name: displayName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    setToken(data.token);
    state.user = data.user;
    toast('Welcome to SaloneVibe!');
    await fetchFavorites();
    updateAuthUI();
  } catch (e) {
    toast(e.message);
  }
}

async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setToken(data.token);
    state.user = data.user;
    toast('Logged in');
    await fetchFavorites();
    updateAuthUI();
  } catch (e) {
    toast(e.message);
  }
}

async function fetchMe() {
  if (!state.token) return;
  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    if (res.ok) {
      state.user = await res.json();
      fillProfileForm();
      updateAuthUI();
    }
  } catch (e) {
    console.error(e);
  }
}

function fillProfileForm() {
  const f = document.getElementById('profileForm');
  if (!f || !state.user) return;
  f.display_name.value = state.user.display_name || '';
  f.profile_image_url.value = state.user.profile_image_url || '';
  f.bio.value = state.user.bio || '';
  f.location.value = state.user.location || '';
}

async function updateProfile(formData) {
  const body = {
    display_name: formData.get('display_name'),
    profile_image_url: formData.get('profile_image_url'),
    bio: formData.get('bio'),
    location: formData.get('location'),
  };
  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');
    state.user = data;
    toast('Profile updated');
    updateAuthUI();
  } catch (e) {
    toast(e.message);
  }
}

async function fetchFavorites() {
  if (!state.token) return;
  try {
    const res = await fetch(`${API_BASE}/favorites`, {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    if (res.ok) {
      state.favorites = await res.json();
      renderFavorites();
    }
  } catch (e) {
    console.error(e);
  }
}

async function addFavorite(id) {
  try {
    const res = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
      body: JSON.stringify({ artist_id: id }),
    });
    if (res.ok) {
      await fetchFavorites();
    }
  } catch (e) {
    console.error(e);
  }
}

async function removeFavorite(id) {
  try {
    const res = await fetch(`${API_BASE}/favorites/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${state.token}` },
    });
    if (res.ok) {
      state.favorites = state.favorites.filter((f) => f.id !== id && f.artist_id !== id);
    }
  } catch (e) {
    console.error(e);
  }
}

function isFavorite(id) {
  return state.favorites.some((f) => f.id === id || f.artist_id === id);
}

function renderFavorites() {
  const wrap = document.getElementById('favoritesList');
  const prompt = document.getElementById('favoritesPrompt');
  if (!wrap || !prompt) return;
  if (!state.token) {
    prompt.classList.remove('d-none');
    wrap.innerHTML = '';
    return;
  }
  prompt.classList.add('d-none');
  wrap.innerHTML = '';
  if (!state.favorites.length) {
    wrap.innerHTML = '<div class="text-secondary small">No favorites yet.</div>';
    return;
  }
  state.favorites.forEach((f) => {
    const card = document.createElement('div');
    card.className = 'mini-card p-3 mb-2 d-flex align-items-center justify-content-between';
    card.innerHTML = `
      <div>
        <div class="fw-bold">${f.stage_name || f.name}</div>
        <div class="text-secondary small">${f.genre || ''} • ${f.city_or_region || ''}</div>
      </div>
      <button class="btn btn-sm btn-outline-light" data-remove="${f.id || f.artist_id}"><i class="bi bi-x"></i></button>
    `;
    wrap.appendChild(card);
  });
  wrap.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.getAttribute('data-remove'));
      await removeFavorite(id);
      await fetchFavorites();
      renderArtists();
      renderArtistDetail();
    });
  });
}

function updateAuthUI() {
  const logged = !!state.token && state.user;
  document.querySelectorAll('.authed').forEach((el) => el.classList.toggle('d-none', !logged));
  document.querySelectorAll('.unauth').forEach((el) => el.classList.toggle('d-none', logged));
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  if (logged && state.user) {
    profileName && (profileName.textContent = state.user.display_name || 'User');
    profileEmail && (profileEmail.textContent = state.user.email || '');
  }
}

