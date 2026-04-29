<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');

define('ALTCHA_HMAC_KEY', 'da03fee65e614a0a0dfb63655342c52e3c67971ac42fc1bdaa47fef56a3d9049'); // Zufälligen langen String einsetzen!

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