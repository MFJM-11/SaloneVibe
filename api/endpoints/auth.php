<?php
// Authentication endpoints

// POST /api/auth/signup - User registration
if ($method === 'POST' && $segments === ['auth', 'signup']) {
    $data = get_json_input();
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $displayName = trim($data['display_name'] ?? '');
    $role = 'user';

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
    $token = create_jwt(['sub' => $userId, 'email' => $email, 'role' => $role], $config['jwt_secret'], $config['jwt_issuer'], $config['jwt_expiration_minutes']);
    json_response(['token' => $token, 'user' => ['id' => $userId, 'email' => $email, 'display_name' => $displayName ?: explode('@', $email)[0], 'role' => $role]], 201);
}

// POST /api/auth/login - User login
if ($method === 'POST' && $segments === ['auth', 'login']) {
    $data = get_json_input();
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $stmt = $pdo->prepare('SELECT id, email, password_hash, display_name, role, profile_image_url, bio, location FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();
    if (!$user || !password_verify($password, $user['password_hash'])) {
        json_response(['error' => 'Invalid credentials'], 401);
    }
    $token = create_jwt(['sub' => $user['id'], 'email' => $user['email'], 'role' => $user['role']], $config['jwt_secret'], $config['jwt_issuer'], $config['jwt_expiration_minutes']);
    unset($user['password_hash']);
    json_response(['token' => $token, 'user' => $user]);
}

