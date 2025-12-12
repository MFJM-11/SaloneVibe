// Configuration and constants
const API_BASE = '/Salone_Vibe/public/api';

const GENRES = [
  'Afrobeat', 'Afrobeats', 'Afro-fusion', 'Afropop', 'Hip-Hop', 'Dancehall', 'R&B', 'Reggae', 'Reggae/Dancehall', 'Folk', 'Gospel', 'Afro-soul'
];

const CITIES = [
  'Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu', 'Kono', 'Port Loko'
];

// Global state
let state = {
  artists: [],
  pagination: null,
  filters: { search: '', genre: '', city: '' },
  selectedArtist: null,
  favorites: [],
  user: null,
  token: localStorage.getItem('salonevibe_token') || '',
};

