<?php
// API Router - Routes requests to appropriate endpoint files

require __DIR__ . '/init.php';

// Create default admin if enabled
if (!empty($config['default_admin']['enabled'])) {
    $adm = $config['default_admin'];
    if (!empty($adm['email']) && !empty($adm['password'])) {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $adm['email']]);
        if (!$stmt->fetch()) {
            $hash = password_hash($adm['password'], PASSWORD_BCRYPT);
            $stmt = $pdo->prepare('INSERT INTO users (email, password_hash, display_name, role, created_at, updated_at) VALUES (:email, :password_hash, :display_name, :role, NOW(), NOW())');
            $stmt->execute([
                'email' => $adm['email'],
                'password_hash' => $hash,
                'display_name' => $adm['display_name'] ?? 'Admin',
                'role' => 'admin',
            ]);
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extract segments after /api from the URI path
// Example: /Salone_Vibe/public/api/artists -> ['artists']
// Example: /Salone_Vibe/public/api/artists/1 -> ['artists', '1']
$segments = array_values(array_filter(explode('/', $uriPath)));
$apiIndex = array_search('api', $segments);

if ($apiIndex !== false && isset($segments[$apiIndex + 1])) {
    // Extract segments after /api
    $segments = array_slice($segments, $apiIndex + 1);
} else {
    // Fallback: try to find 'api' in path and extract after it
    $segments = [];
}

// Route to appropriate endpoint file
try {
    $endpointDir = __DIR__ . '/endpoints';
    
    // Health check endpoint
    if (empty($segments) || ($segments[0] === 'health' && $method === 'GET')) {
        json_response(['status' => 'ok', 'timestamp' => time()]);
    }
    
    // Determine which endpoint file to load based on route
    if (!empty($segments[0])) {
        if ($segments[0] === 'artists') {
            require $endpointDir . '/artists.php';
            // If execution continues, no route matched in artists.php
            json_response(['error' => 'Not found', 'path' => $uriPath, 'segments' => $segments], 404);
        } elseif ($segments[0] === 'auth') {
            require $endpointDir . '/auth.php';
            // If execution continues, no route matched in auth.php
            json_response(['error' => 'Not found', 'path' => $uriPath, 'segments' => $segments], 404);
        } elseif ($segments[0] === 'users') {
            require $endpointDir . '/users.php';
            // If execution continues, no route matched in users.php
            json_response(['error' => 'Not found', 'path' => $uriPath, 'segments' => $segments], 404);
        } elseif ($segments[0] === 'favorites') {
            require $endpointDir . '/favorites.php';
            // If execution continues, no route matched in favorites.php
            json_response(['error' => 'Not found', 'path' => $uriPath, 'segments' => $segments], 404);
        } elseif ($segments[0] === 'admin') {
            require $endpointDir . '/admin.php';
            // If execution continues, no route matched in admin.php
            json_response(['error' => 'Not found', 'path' => $uriPath, 'segments' => $segments], 404);
        } else {
            json_response(['error' => 'Not found', 'path' => $uriPath, 'segments' => $segments], 404);
        }
    } else {
        json_response(['error' => 'Not found', 'path' => $uriPath, 'segments' => $segments], 404);
    }
} catch (Throwable $e) {
    json_response(['error' => 'Server error', 'detail' => $e->getMessage()], 500);
}

