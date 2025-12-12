// Authentication and user management

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
    toast('Signup successful! Welcome to SaloneVibe!');
    closeModal('authModal');
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
    toast('Login successful! Welcome back!');
    closeModal('authModal');
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

function updateAuthUI() {
  const logged = !!state.token && state.user;
  document.querySelectorAll('.authed').forEach((el) => el.classList.toggle('hidden', !logged));
  document.querySelectorAll('.unauth').forEach((el) => el.classList.toggle('hidden', logged));
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profileAvatar = document.getElementById('profileAvatar');
  const dashboardUserName = document.getElementById('dashboardUserName');
  const dashboardUserAvatar = document.getElementById('dashboardUserAvatar');
  const adminNav = document.getElementById('adminNav');
  const adminPanel = document.getElementById('adminPanel');
  const isAdmin = logged && state.user?.role === 'admin';
  adminNav?.classList.toggle('hidden', !isAdmin);
  adminPanel?.classList.toggle('hidden', !isAdmin);
  if (logged && state.user) {
    const displayName = state.user.display_name || 'User';
    const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
    profileName && (profileName.textContent = displayName);
    profileEmail && (profileEmail.textContent = state.user.email || '');
    profileAvatar && (profileAvatar.textContent = initials);
    dashboardUserName && (dashboardUserName.textContent = displayName);
    dashboardUserAvatar && (dashboardUserAvatar.textContent = initials);
    dashboardUserName?.classList.remove('hidden');
  } else {
    dashboardUserName?.classList.add('hidden');
  }
}

