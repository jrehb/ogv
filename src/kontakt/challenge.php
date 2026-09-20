<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');

// Config laden
$config = require __DIR__ . '/../config/mail_config.php';

define('ALTCHA_HMAC_KEY', $config['altcha_key'] ?? ''); 

$algorithm = 'SHA-256';
$maxNumber = 100000;
$saltLength = 12;

function randomSalt(int $length): string {
    return bin2hex(random_bytes($length));
}

$salt = randomSalt($saltLength) . '?expires=' . (time() + 600);
$secretNumber = random_int(0, $maxNumber);
$challenge = hash('sha256', $salt . $secretNumber);
$signature = hash_hmac('sha256', $challenge, ALTCHA_HMAC_KEY);

echo json_encode([
    'algorithm' => $algorithm,
    'challenge' => $challenge,
    'maxnumber' => $maxNumber,
    'salt'      => $salt,
    'signature' => $signature,
]);