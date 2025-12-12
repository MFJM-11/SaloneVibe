<?php
// Favorites endpoints (authentication required)

if ($segments && $segments[0] === 'favorites') {
    $user = current_user($pdo, $config);
    if (!$user) {
        json_response(['error' => 'Unauthorized'], 401);
    }

    // GET /api/favorites - List user's favorites
    if ($method === 'GET' && count($segments) === 1) {
        $stmt = $pdo->prepare('SELECT a.* FROM favorites f JOIN artists a ON f.artist_id = a.id WHERE f.user_id = :uid ORDER BY f.created_at DESC');
        $stmt->execute(['uid' => $user['id']]);
        $favorites = $stmt->fetchAll();
        foreach ($favorites as &$fav) {
            $fav['notable_songs'] = json_decode($fav['notable_songs'], true) ?: [];
        }
        json_response($favorites);
    }

    // POST /api/favorites - Add artist to favorites
    if ($method === 'POST' && count($segments) === 1) {
        $data = get_json_input();
        $artistId = (int)($data['artist_id'] ?? 0);
        if (!$artistId) {
            json_response(['error' => 'artist_id is required'], 422);
        }
        $exists = $pdo->prepare('SELECT id FROM artists WHERE id = :id');
        $exists->execute(['id' => $artistId]);
        if (!$exists->fetch()) {
            json_response(['error' => 'Artist not found'], 404);
        }
        $stmt = $pdo->prepare('INSERT IGNORE INTO favorites (user_id, artist_id, created_at) VALUES (:uid, :aid, NOW())');
        $stmt->execute(['uid' => $user['id'], 'aid' => $artistId]);
        json_response(['message' => 'Added to favorites']);
    }

    // DELETE /api/favorites/:artist_id - Remove artist from favorites
    if ($method === 'DELETE' && count($segments) === 2) {
        $artistId = (int)$segments[1];
        $stmt = $pdo->prepare('DELETE FROM favorites WHERE user_id = :uid AND artist_id = :aid');
        $stmt->execute(['uid' => $user['id'], 'aid' => $artistId]);
        json_response(['message' => 'Removed from favorites']);
    }
}

