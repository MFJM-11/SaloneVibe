<?php
// Example configuration file
// Copy this to config.php and fill in your actual values
return [
    'db' => [
        'host' => 'localhost',
        'dbname' => 'salonevibe',
        'user' => 'root',
        'pass' => '',
        'charset' => 'utf8mb4',
    ],
    'cors_allowed_origin' => '*', // update to your domain in production
    'jwt_secret' => 'change-this-secret-key-to-something-random-and-secure', // change in production
    'jwt_issuer' => 'salonevibe',
    'jwt_expiration_minutes' => 60 * 24 * 7, // 1 week
    'default_admin' => [
        'email' => 'admin@salonevibe.com',
        'password' => 'change-this-password',
        'display_name' => 'Admin User',
        'enabled' => true,
    ],
];

