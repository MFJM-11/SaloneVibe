// UI rendering functions

function populateOptions() {
  const genreSelect = document.getElementById('genreSelect');
  const citySelect = document.getElementById('citySelect');
  genreSelect.innerHTML = '<option value="">All genres</option>';
  citySelect.innerHTML = '<option value="">All locations</option>';
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
  renderGenreTags();
}

function renderGenreTags() {
  const wrap = document.getElementById('genreTags');
  if (!wrap) return;
  wrap.innerHTML = '';
  const seen = new Set();
  const list = [''].concat(GENRES);
  list.forEach((g) => {
    if (seen.has(g)) return;
    seen.add(g);
    const chip = document.createElement('button');
    chip.className = `tag-chip${state.filters.genre === g ? ' active' : ''}`;
    chip.dataset.genre = g;
    chip.textContent = g || 'All';
    chip.addEventListener('click', () => {
      state.filters.genre = g;
      const select = document.getElementById('genreSelect');
      if (select) select.value = g;
      renderGenreTags();
      fetchArtists(1);
    });
    wrap.appendChild(chip);
  });
}

function renderArtists() {
  const grid = document.getElementById('artistGrid');
  grid.innerHTML = '';
  if (!state.artists.length) {
    grid.innerHTML = `<div class="text-center text-slate-400 py-5 col-span-full">No artists found.</div>`;
    return;
  }
  state.artists.forEach((artist) => {
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

function renderPagination() {
  const wrapper = document.getElementById('pagination');
  if (!state.pagination) return;
  const { page, pages } = state.pagination;
  wrapper.innerHTML = '';
  if (pages <= 1) return;
  const prev = document.createElement('button');
  prev.className = 'btn-soft px-3 py-2 rounded-full text-sm';
  prev.textContent = 'Prev';
  prev.disabled = page <= 1;
  prev.onclick = () => fetchArtists(page - 1);
  const next = document.createElement('button');
  next.className = 'btn-soft px-3 py-2 rounded-full text-sm';
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
      showArtistDashboard();
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

function renderArtistDetail() {
  const pane = document.getElementById('artistDetail');
  const a = state.selectedArtist;
  if (!a) {
    pane.innerHTML = '<div class="text-slate-400 text-sm">Select an artist to view details.</div>';
    return;
  }
  pane.innerHTML = `
    <div class="glass-strong artist-detail p-4 rounded-2xl">
      <div class="flex flex-col gap-3">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <div class="avatar">${(a.stage_name || a.name).slice(0,2).toUpperCase()}</div>
            <div>
              <div class="text-2xl font-semibold">${a.stage_name || a.name}</div>
              <div class="text-slate-400 text-sm">${a.city_or_region || 'Sierra Leone'} • ${a.genre || ''}</div>
            </div>
          </div>
          <p class="text-slate-300 mb-3 text-sm">${a.bio || ''}</p>
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="tag">${a.genre || 'Genre'}</span>
            <span class="tag">${a.country || 'Sierra Leone'}</span>
            ${a.city_or_region ? `<span class="tag">${a.city_or_region}</span>` : ''}
          </div>
          <div class="mb-3">
            <h6 class="mb-2 font-semibold">Notable Songs</h6>
            <ul class="text-sm space-y-1">
              ${(a.notable_songs || []).map((s) => `<li>• ${s}</li>`).join('')}
            </ul>
          </div>
          <div class="flex flex-wrap gap-2 mb-3">
            ${linkIcon(a.social_youtube, 'YouTube')}
            ${linkIcon(a.social_spotify, 'Spotify')}
            ${linkIcon(a.social_instagram, 'Instagram')}
            ${linkIcon(a.social_facebook, 'Facebook')}
          </div>
        </div>
        <div class="flex flex-col items-start gap-2">
          <button class="btn-gradient px-4 py-2 rounded-full" id="favoriteDetailBtn">
            <i class="${isFavorite(a.id) ? 'ri-heart-fill text-emerald-500' : 'ri-heart-line'} mr-1"></i>
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

function showArtistDashboard() {
  const gridView = document.getElementById('artistGridView');
  const dashboard = document.getElementById('artistDashboard');
  if (gridView) gridView.classList.add('hidden');
  if (dashboard) dashboard.classList.remove('hidden');
  renderArtistDashboard();
}

function hideArtistDashboard() {
  const gridView = document.getElementById('artistGridView');
  const dashboard = document.getElementById('artistDashboard');
  if (gridView) gridView.classList.remove('hidden');
  if (dashboard) dashboard.classList.add('hidden');
}

function renderArtistDashboard() {
  const a = state.selectedArtist;
  if (!a) return;

  // Update header
  document.getElementById('dashboardArtistName').textContent = a.stage_name || a.name;
  document.getElementById('dashboardListeners').textContent = `${Math.floor(Math.random() * 50000000 + 1000000).toLocaleString()} monthly listeners`;
  
  // Update artist image
  const imageEl = document.getElementById('dashboardArtistImage');
  imageEl.className = 'artist-image image-placeholder';
  if (a.image_url) {
    imageEl.innerHTML = `<img src="${a.image_url}" alt="${a.stage_name || a.name}" />`;
  } else {
    imageEl.innerHTML = '';
  }

  // Render popular songs
  renderPopularSongs(a);

  // Render other tabs
  renderDiscography(a);
  renderFeaturing(a);
  renderFansAlsoLike(a);
  renderAppearsOn(a);

  // Setup tab switching
  setupDashboardTabs();

  // Setup buttons
  setupDashboardButtons(a);
}

function renderPopularSongs(artist) {
  const songsList = document.getElementById('popularSongsList');
  const songs = artist.notable_songs || [];
  
  if (songs.length === 0) {
    songsList.innerHTML = '<div class="text-slate-400">No songs available</div>';
    return;
  }

  songsList.innerHTML = songs.map((song, index) => {
    const plays = Math.floor(Math.random() * 1000000000 + 1000000).toLocaleString();
    const duration = `${Math.floor(Math.random() * 2 + 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
    const fav = isFavorite(artist.id);
    
    return `
      <div class="song-item" data-song="${index}">
        <div class="song-number">${index + 1}</div>
        <div class="song-info">
          <div class="album-artwork image-placeholder song-artwork">
            ${artist.image_url ? `<img src="${artist.image_url}" alt="${song}" />` : ''}
          </div>
          <div class="song-details">
            <div class="song-title">${song}</div>
            <div class="song-artist">${artist.stage_name || artist.name}</div>
          </div>
        </div>
        <div class="song-plays">${plays}</div>
        <div class="song-duration">${duration}</div>
        <div class="song-actions">
          <button class="song-action-btn ${fav ? 'liked' : ''}" data-artist-id="${artist.id}" title="Like">
            <i class="ri-heart-${fav ? 'fill' : 'line'}"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach song item events
  songsList.querySelectorAll('.song-action-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const artistId = Number(btn.dataset.artistId);
      if (!state.token) {
        toast('Log in to save favorites.');
        return;
      }
      if (isFavorite(artistId)) {
        await removeFavorite(artistId);
      } else {
        await addFavorite(artistId);
      }
      renderPopularSongs(artist);
      renderFavorites();
    });
  });
}

function setupDashboardTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all tabs and contents
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active to clicked tab and corresponding content
      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      const content = document.getElementById(`tab-${tabId}`);
      if (content) content.classList.add('active');
      
      // Refresh tab content if needed
      const artist = state.selectedArtist;
      if (artist) {
        if (tabId === 'discography') {
          renderDiscography(artist);
        } else if (tabId === 'featuring') {
          renderFeaturing(artist);
        } else if (tabId === 'fans') {
          renderFansAlsoLike(artist);
        } else if (tabId === 'appears') {
          renderAppearsOn(artist);
        }
      }
    });
  });
}

function setupDashboardButtons(artist) {
  // Back button
  document.getElementById('backToGrid')?.addEventListener('click', () => {
    hideArtistDashboard();
  });

  // Play button
  document.getElementById('dashboardPlayBtn')?.addEventListener('click', () => {
    toast(`Playing ${artist.stage_name || artist.name}`);
  });

  // Follow button
  const followBtn = document.getElementById('dashboardFollowBtn');
  if (followBtn) {
    const isFollowing = isFavorite(artist.id);
    followBtn.textContent = isFollowing ? 'Following' : 'Follow';
    followBtn.addEventListener('click', async () => {
      if (!state.token) {
        toast('Log in to follow artists.');
        return;
      }
      if (isFavorite(artist.id)) {
        await removeFavorite(artist.id);
        followBtn.textContent = 'Follow';
      } else {
        await addFavorite(artist.id);
        followBtn.textContent = 'Following';
      }
      renderPopularSongs(artist);
      renderFavorites();
    });
  }

  // Share button
  document.getElementById('dashboardShareBtn')?.addEventListener('click', async () => {
    const shareText = `Check out ${artist.stage_name || artist.name} on SaloneVibe!`;
    const shareUrl = `${window.location.origin}${window.location.pathname}#artist-${artist.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: artist.stage_name || artist.name,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast('Link copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = `${shareText} ${shareUrl}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast('Link copied to clipboard!');
      }
    }
  });

  // Artist Radio button
  document.getElementById('dashboardRadioBtn')?.addEventListener('click', () => {
    toast(`Playing ${artist.stage_name || artist.name} Radio - Mix of similar artists`);
  });
}

function renderDiscography(artist) {
  const discographyContent = document.getElementById('tab-discography');
  if (!discographyContent) return;
  
  const songs = artist.notable_songs || [];
  if (songs.length === 0) {
    discographyContent.innerHTML = '<div class="text-slate-400">No discography available</div>';
    return;
  }

  // Group songs into "albums" (for demo, we'll create virtual albums)
  const albums = [
    {
      title: 'Popular Releases',
      year: new Date().getFullYear(),
      songs: songs.slice(0, Math.min(5, songs.length))
    }
  ];

  discographyContent.innerHTML = `
    <div class="discography-grid">
      ${albums.map(album => `
        <div class="album-card glass p-4 rounded-xl">
          <div class="album-artwork image-placeholder mb-3" style="width: 100%; height: 200px; border-radius: 12px;">
            ${artist.image_url ? `<img src="${artist.image_url}" alt="${album.title}" />` : ''}
          </div>
          <h3 class="font-semibold mb-1">${album.title}</h3>
          <p class="text-sm text-slate-400 mb-3">${album.year}</p>
          <ul class="space-y-2">
            ${album.songs.map((song, idx) => `
              <li class="flex items-center justify-between text-sm">
                <span class="text-slate-300">${idx + 1}. ${song}</span>
                <button class="btn-soft px-2 py-1 rounded text-xs">
                  <i class="ri-play-line"></i>
                </button>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `;
}

async function renderFeaturing(artist) {
  const featuringContent = document.getElementById('tab-featuring');
  if (!featuringContent) return;
  
  // Fetch all artists for better recommendations
  try {
    const res = await fetch(`${API_BASE}/artists?limit=50`);
    const data = await res.json();
    const allArtists = data.data || [];
    
    // Get similar artists (same genre)
    const similarArtists = allArtists
      .filter(a => a.id !== artist.id && a.genre === artist.genre)
      .slice(0, 6);

    if (similarArtists.length === 0) {
      featuringContent.innerHTML = '<div class="text-slate-400">No featuring artists available</div>';
      return;
    }

  featuringContent.innerHTML = `
    <div class="card-grid">
      ${similarArtists.map(a => `
        <div class="artist-card glass p-4 rounded-xl">
          <div class="artist-card-image image-placeholder mb-3" style="height: 150px;">
            ${a.image_url ? `<img src="${a.image_url}" alt="${a.stage_name || a.name}" />` : ''}
          </div>
          <div class="flex items-center gap-2 mb-2">
            <div class="avatar small">${(a.stage_name || a.name).slice(0, 2).toUpperCase()}</div>
            <div>
              <div class="font-semibold">${a.stage_name || a.name}</div>
              <div class="text-xs text-slate-400">${a.genre || ''}</div>
            </div>
          </div>
          <button class="btn-gradient w-full text-sm py-2 rounded-full" data-artist="${a.id}">
            View Artist
          </button>
        </div>
      `).join('')}
    </div>
  `;

  // Attach click events
  featuringContent.querySelectorAll('[data-artist]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-artist');
      await loadArtist(id);
      showArtistDashboard();
    });
  });
  } catch (e) {
    featuringContent.innerHTML = '<div class="text-slate-400">Unable to load featuring artists</div>';
  }
}

async function renderFansAlsoLike(artist) {
  const fansContent = document.getElementById('tab-fans');
  if (!fansContent) return;
  
  // Fetch all artists for better recommendations
  try {
    const res = await fetch(`${API_BASE}/artists?limit=50`);
    const data = await res.json();
    const allArtists = data.data || [];
    
    // Get artists from same city/region or similar genre
    const similarArtists = allArtists
      .filter(a => 
        a.id !== artist.id && 
        (a.city_or_region === artist.city_or_region || a.genre === artist.genre)
      )
      .slice(0, 8);

    if (similarArtists.length === 0) {
      fansContent.innerHTML = '<div class="text-slate-400">No similar artists found</div>';
      return;
    }

  fansContent.innerHTML = `
    <div class="card-grid">
      ${similarArtists.map(a => `
        <div class="artist-card glass p-4 rounded-xl">
          <div class="artist-card-image image-placeholder mb-3" style="height: 150px;">
            ${a.image_url ? `<img src="${a.image_url}" alt="${a.stage_name || a.name}" />` : ''}
          </div>
          <div class="flex items-center gap-2 mb-2">
            <div class="avatar small">${(a.stage_name || a.name).slice(0, 2).toUpperCase()}</div>
            <div>
              <div class="font-semibold">${a.stage_name || a.name}</div>
              <div class="text-xs text-slate-400">${a.genre || ''} • ${a.city_or_region || ''}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn-gradient flex-1 text-sm py-2 rounded-full" data-artist="${a.id}">
              View
            </button>
            <button class="btn-soft px-3 py-2 rounded-full favorite-btn ${isFavorite(a.id) ? 'active' : ''}" data-fav="${a.id}">
              <i class="${isFavorite(a.id) ? 'ri-heart-fill text-emerald-400' : 'ri-heart-line'}"></i>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Attach events
  fansContent.querySelectorAll('[data-artist]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-artist');
      await loadArtist(id);
      showArtistDashboard();
    });
  });

  fansContent.querySelectorAll('[data-fav]').forEach(btn => {
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
      renderFansAlsoLike(artist);
      renderFavorites();
    });
  });
  } catch (e) {
    fansContent.innerHTML = '<div class="text-slate-400">Unable to load similar artists</div>';
  }
}

function renderAppearsOn(artist) {
  const appearsContent = document.getElementById('tab-appears');
  if (!appearsContent) return;
  
  // Create virtual playlists/compilations
  const playlists = [
    {
      title: 'Top Salone Hits',
      curator: 'SaloneVibe',
      songs: artist.notable_songs?.slice(0, 3) || []
    },
    {
      title: `${artist.genre || 'Music'} Mix`,
      curator: 'SaloneVibe',
      songs: artist.notable_songs?.slice(0, 2) || []
    }
  ].filter(p => p.songs.length > 0);

  if (playlists.length === 0) {
    appearsContent.innerHTML = '<div class="text-slate-400">No playlists available</div>';
    return;
  }

  appearsContent.innerHTML = `
    <div class="space-y-4">
      ${playlists.map(playlist => `
        <div class="playlist-card glass p-4 rounded-xl">
          <div class="flex gap-4">
            <div class="playlist-artwork image-placeholder" style="width: 120px; height: 120px; border-radius: 12px; flex-shrink: 0;">
              ${artist.image_url ? `<img src="${artist.image_url}" alt="${playlist.title}" />` : ''}
            </div>
            <div class="flex-1">
              <h3 class="font-semibold mb-1">${playlist.title}</h3>
              <p class="text-sm text-slate-400 mb-3">By ${playlist.curator}</p>
              <ul class="space-y-1 text-sm">
                ${playlist.songs.map(song => `
                  <li class="flex items-center gap-2 text-slate-300">
                    <i class="ri-music-line text-slate-400"></i>
                    <span>${song}</span>
                    <span class="text-slate-500">•</span>
                    <span class="text-slate-400">${artist.stage_name || artist.name}</span>
                  </li>
                `).join('')}
              </ul>
              <button class="btn-gradient mt-3 text-sm px-4 py-2 rounded-full">
                <i class="ri-play-fill"></i> Play Playlist
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

