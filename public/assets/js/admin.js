// Admin functions

async function createArtist(payload) {
  const res = await fetch(`${API_BASE}/admin/artists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create artist');
  return data;
}

async function createArtistAccount(display_name, email, password) {
  const res = await fetch(`${API_BASE}/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, display_name, role: 'artist' }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create artist account');
  return data;
}

