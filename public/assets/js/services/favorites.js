// Favorites management

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
      // Refresh favorites page if visible
      if (document.getElementById('favoritesPage') && !document.getElementById('favoritesPage').classList.contains('hidden')) {
        if (typeof renderFavoritesPage === 'function') renderFavoritesPage();
      }
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
      // Refresh favorites page if visible
      if (document.getElementById('favoritesPage') && !document.getElementById('favoritesPage').classList.contains('hidden')) {
        if (typeof renderFavoritesPage === 'function') renderFavoritesPage();
      }
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
    prompt.classList.remove('hidden');
    wrap.innerHTML = '';
    return;
  }
  prompt.classList.add('hidden');
  wrap.innerHTML = '';
  if (!state.favorites.length) {
    wrap.innerHTML = '<div class="text-slate-400 text-sm">No favorites yet.</div>';
    return;
  }
  state.favorites.forEach((f) => {
    const card = document.createElement('div');
    card.className = 'mini-card p-3 rounded-xl flex items-center justify-between';
    card.innerHTML = `
      <div>
        <div class="font-semibold">${f.stage_name || f.name}</div>
        <div class="text-slate-400 text-sm">${f.genre || ''} • ${f.city_or_region || ''}</div>
      </div>
      <button class="btn-soft px-2 py-1 rounded-lg" data-remove="${f.id || f.artist_id}"><i class="ri-close-line"></i></button>
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

