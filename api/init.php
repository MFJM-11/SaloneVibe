<?php
// Basic bootstrap for API: loads config, sets headers, connects to DB, and provides helpers.
$config = require __DIR__ . '/../config/config.php';

if (!function_exists('str_starts_with')) {
    function str_starts_with(string $haystack, string $needle): bool
    {
        return substr($haystack, 0, strlen($needle)) === $needle;
    }
}

// Handle CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header('Access-Control-Allow-Origin: ' . ($config['cors_allowed_origin'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Connect to database via PDO
try {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $config['db']['host'],
        $config['db']['dbname'],
        $config['db']['charset'] ?? 'utf8mb4'
    );
    $pdo = new PDO($dsn, $config['db']['user'], $config['db']['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed', 'detail' => $e->getMessage()]);
    exit;
}

// JSON helper
function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Parse JSON body
function get_json_input(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// Simple JWT (HS256) helpers
function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string|false
{
    $padding = 4 - (strlen($data) % 4);
    if ($padding < 4) {
        $data .= str_repeat('=', $padding);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

function create_jwt(array $payload, string $secret, string $issuer, int $expMinutes): string
{
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $now = time();
    $payload = array_merge($payload, [
        'iat' => $now,
        'exp' => $now + ($expMinutes * 60),
        'iss' => $issuer,
    ]);

    $segments = [
        base64url_encode(json_encode($header)),
        base64url_encode(json_encode($payload)),
    ];
    $signingInput = implode('.', $segments);
    $signature = hash_hmac('sha256', $signingInput, $secret, true);
    $segments[] = base64url_encode($signature);
    return implode('.', $segments);
}

function verify_jwt(string $jwt, string $secret, string $issuer): array|false
{
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) {
        return false;
    }
    [$headb64, $payloadb64, $sigb64] = $parts;
    $payloadJson = base64url_decode($payloadb64);
    $signature = base64url_decode($sigb64);
    if ($payloadJson === false || $signature === false) {
        return false;
    }
    $expected = hash_hmac('sha256', "$headb64.$payloadb64", $secret, true);
    if (!hash_equals($expected, $signature)) {
        return false;
    }
    $payload = json_decode($payloadJson, true);
    if (!is_array($payload)) {
        return false;
    }
    $now = time();
    if (($payload['iss'] ?? null) !== $issuer) {
        return false;
    }
    if (($payload['exp'] ?? 0) < $now) {
        return false;
    }
    return $payload;
}

function current_user(PDO $pdo, array $config): ?array
{
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (str_starts_with(strtolower($auth), 'bearer ')) {
        $token = trim(substr($auth, 7));
    } else {
        return null;
    }
    $payload = verify_jwt($token, $config['jwt_secret'], $config['jwt_issuer']);
    if (!$payload) {
        return null;
    }
    $stmt = $pdo->prepare('SELECT id, email, display_name, role, profile_image_url, bio, location, created_at, updated_at FROM users WHERE id = :id');
    $stmt->execute(['id' => $payload['sub']]);
    $user = $stmt->fetch();
    return $user ?: null;
}

