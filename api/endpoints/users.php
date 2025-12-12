<?php
// User profile endpoints

// GET /api/users/me - Get current user profile
// PUT /api/users/me - Update current user profile
if ($segments === ['users', 'me']) {
    $user = current_user($pdo, $config);
    if (!$user) {
        json_response(['error' => 'Unauthorized'], 401);
    }
    if ($method === 'GET') {
        json_response($user);
    }
    if ($method === 'PUT') {
        $data = get_json_input();
        $allowed = [
            'display_name' => trim($data['display_name'] ?? $user['display_name']),
            'profile_image_url' => trim($data['profile_image_url'] ?? $user['profile_image_url']),
            'bio' => trim($data['bio'] ?? $user['bio']),
            'location' => trim($data['location'] ?? $user['location']),
        ];
        $stmt = $pdo->prepare('UPDATE users SET display_name = :display_name, profile_image_url = :profile_image_url, bio = :bio, location = :location, updated_at = NOW() WHERE id = :id');
        $stmt->execute([
            'display_name' => $allowed['display_name'],
            'profile_image_url' => $allowed['profile_image_url'],
            'bio' => $allowed['bio'],
            'location' => $allowed['location'],
            'id' => $user['id'],
        ]);
        $user = current_user($pdo, $config);
        json_response($user ?? ['updated' => true]);
    }
}

