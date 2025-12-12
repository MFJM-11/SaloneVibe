<?php
// Admin endpoints (admin role required)

// POST /api/admin/artists - Create artist entry
if (count($segments) === 2 && $segments[0] === 'admin' && $segments[1] === 'artists') {
    $user = current_user($pdo, $config);
    if (!$user || ($user['role'] ?? 'user') !== 'admin') {
        json_response(['error' => 'Forbidden'], 403);
    }
    if ($method === 'POST') {
        $data = get_json_input();
        $required = ['name','genre','city_or_region','bio'];
        foreach ($required as $r) {
            if (empty($data[$r])) {
                json_response(['error' => "$r is required"], 422);
            }
        }
        $stmt = $pdo->prepare('INSERT INTO artists (name, stage_name, genre, city_or_region, country, bio, notable_songs, image_url, social_youtube, social_spotify, social_instagram, social_facebook, created_at, updated_at) VALUES (:name, :stage_name, :genre, :city_or_region, :country, :bio, :notable_songs, :image_url, :social_youtube, :social_spotify, :social_instagram, :social_facebook, NOW(), NOW())');
        $stmt->execute([
            'name' => trim($data['name']),
            'stage_name' => trim($data['stage_name'] ?? $data['name']),
            'genre' => trim($data['genre']),
            'city_or_region' => trim($data['city_or_region']),
            'country' => trim($data['country'] ?? 'Sierra Leone'),
            'bio' => trim($data['bio'] ?? ''),
            'notable_songs' => json_encode($data['notable_songs'] ?? []),
            'image_url' => trim($data['image_url'] ?? ''),
            'social_youtube' => trim($data['social_youtube'] ?? ''),
            'social_spotify' => trim($data['social_spotify'] ?? ''),
            'social_instagram' => trim($data['social_instagram'] ?? ''),
            'social_facebook' => trim($data['social_facebook'] ?? ''),
        ]);
        $id = (int)$pdo->lastInsertId();
        json_response(['message' => 'Artist created', 'id' => $id], 201);
    }
}

// POST /api/admin/users - Create user account (e.g., artist/admin accounts)
if (count($segments) === 2 && $segments[0] === 'admin' && $segments[1] === 'users') {
    $admin = current_user($pdo, $config);
    if (!$admin || ($admin['role'] ?? 'user') !== 'admin') {
        json_response(['error' => 'Forbidden'], 403);
    }
    if ($method === 'POST') {
        $data = get_json_input();
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        $displayName = trim($data['display_name'] ?? '');
        $role = in_array($data['role'] ?? 'user', ['user','artist','admin'], true) ? $data['role'] : 'user';

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_response(['error' => 'Valid email required'], 422);
        }
        if (strlen($password) < 6) {
            json_response(['error' => 'Password must be at least 6 characters'], 422);
        }
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);
        if ($stmt->fetch()) {
            json_response(['error' => 'Email already registered'], 409);
        }
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare('INSERT INTO users (email, password_hash, display_name, role, created_at, updated_at) VALUES (:email, :password_hash, :display_name, :role, NOW(), NOW())');
        $stmt->execute([
            'email' => $email,
            'password_hash' => $hash,
            'display_name' => $displayName ?: explode('@', $email)[0],
            'role' => $role,
        ]);
        $userId = (int)$pdo->lastInsertId();
        json_response(['message' => 'User created', 'id' => $userId, 'role' => $role], 201);
    }
}

