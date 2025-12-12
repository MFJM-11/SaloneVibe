<?php
// Artists endpoints

// GET /api/artists - List artists with filters and pagination
if ($method === 'GET' && $segments === ['artists']) {
    $search = trim($_GET['search'] ?? '');
    $genre = trim($_GET['genre'] ?? '');
    $city = trim($_GET['city_or_region'] ?? '');
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 12)));
    $offset = ($page - 1) * $limit;

    $conditions = [];
    $params = [];
    if ($search !== '') {
        $conditions[] = '(name LIKE :search OR stage_name LIKE :search)';
        $params['search'] = '%' . $search . '%';
    }
    if ($genre !== '') {
        $conditions[] = 'genre = :genre';
        $params['genre'] = $genre;
    }
    if ($city !== '') {
        $conditions[] = 'city_or_region = :city';
        $params['city'] = $city;
    }
    $where = $conditions ? ('WHERE ' . implode(' AND ', $conditions)) : '';

    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM artists $where");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $stmt = $pdo->prepare("SELECT id, name, stage_name, genre, city_or_region, country, bio, notable_songs, image_url, social_youtube, social_spotify, social_instagram, social_facebook, created_at, updated_at FROM artists $where ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
    foreach ($params as $k => $v) {
        $stmt->bindValue(':' . $k, $v);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $artists = $stmt->fetchAll();
    foreach ($artists as &$artist) {
        $songs = json_decode($artist['notable_songs'], true);
        $artist['notable_songs'] = $songs ?: [];
    }
    json_response([
        'data' => $artists,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => $limit ? ceil($total / $limit) : 1,
        ],
    ]);
}

// GET /api/artists/:id - Get artist detail
if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'artists') {
    $id = (int)$segments[1];
    $stmt = $pdo->prepare('SELECT * FROM artists WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $artist = $stmt->fetch();
    if (!$artist) {
        json_response(['error' => 'Artist not found'], 404);
    }
    $artist['notable_songs'] = json_decode($artist['notable_songs'], true) ?: [];
    json_response($artist);
}

