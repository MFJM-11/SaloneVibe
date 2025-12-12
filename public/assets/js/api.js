// API service functions

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

