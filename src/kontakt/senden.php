<?php
$debug = false; // ← auf true setzen zum Debuggen

/*
    Hilfsfunktion für Antworten (JSON bei Fetch, Header-Redirect als Fallback)
*/
function respond($success, $message, $redirectUrl) {
    $isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
              || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        if (!$success) {
            http_response_code(400);
        }
        echo json_encode(['success' => $success, 'message' => $message]);
        exit;
    } else {
        header('Location: ' . $redirectUrl);
        exit;
    }
}

/*
    Altcha-Payload
*/
// Config laden
$config = require __DIR__ . '/../config/mail_config.php';

define('ALTCHA_HMAC_KEY', $config['altcha_key'] ?? '');

function verifyAltcha(string $payload): bool {
    $decoded = json_decode(base64_decode($payload), true);
    if (!$decoded) return false;

    $algorithm  = $decoded['algorithm'] ?? '';
    $challenge  = $decoded['challenge'] ?? '';
    $number     = $decoded['number'] ?? 0;
    $salt       = $decoded['salt'] ?? '';
    $signature  = $decoded['signature'] ?? '';

    // Ablaufzeit prüfen
    parse_str(parse_url($salt, PHP_URL_QUERY) ?? '', $params);
    if (isset($params['expires']) && (int)$params['expires'] < time()) {
        return false; // Challenge abgelaufen
    }

    // Challenge nachrechnen
    $expectedChallenge = hash('sha256', $salt . $number);
    if (!hash_equals($expectedChallenge, $challenge)) return false;

    // Signatur prüfen
    $expectedSignature = hash_hmac('sha256', $challenge, ALTCHA_HMAC_KEY);
    return hash_equals($expectedSignature, $signature);
}

if ($debug) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Ungültige Anfrage.', '/kontakt/');
}

$altchaPayload = $_POST['altcha'] ?? '';
if (!verifyAltcha($altchaPayload)) {
    respond(false, 'ALTCHA-Verifizierung fehlgeschlagen.', '/kontakt/?fehler=altcha');
}

// PHPMailer einbinden
require __DIR__ . '/../phpmailer/PHPMailer.php';
require __DIR__ . '/../phpmailer/SMTP.php';
require __DIR__ . '/../phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Wenn Honeypot ausgefüllt → Bot
if (!empty($_POST['website'])) {
    respond(true, 'Nachricht gesendet!', '/kontakt/?erfolg=1');
}

// POST-Daten bereinigen
$name      = trim(strip_tags($_POST['name'] ?? ''));
$email     = trim(strip_tags($_POST['email'] ?? ''));
$nachricht = trim(strip_tags($_POST['nachricht'] ?? ''));

// Pflichtfelder prüfen
if (empty($name) || empty($email) || empty($nachricht)) {
    respond(false, 'Bitte alle Felder ausfüllen.', '/kontakt/?fehler=leer');
}

// Mindestlänge prüfen
if (count(explode(" ", $nachricht)) < 5) {
    respond(false, 'Bitte geben Sie eine Nachricht ein, die länger als 5 Wörter ist.', '/kontakt/?fehler=nachricht');
}

// E-Mail validieren
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Bitte eine gültige E-Mail-Adresse eingeben.', '/kontakt/?fehler=email');
}

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $config['host'];
    $mail->SMTPAuth   = true;
    $mail->AuthType   = 'LOGIN';
    $mail->Username   = $config['username'];
    $mail->Password   = $config['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = '587';

    $mail->setFrom($config['from'], 'OGV Kloppenheim');
    $mail->addReplyTo($email, $name);
    $mail->addAddress($config['to']);

    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'Kontaktanfrage von ' . $name;
    $mail->Body    = "Name: $name\nE-Mail: $email\n\nNachricht:\n$nachricht";

    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {
        file_put_contents(__DIR__ . '/mail_debug.log', date('Y-m-d H:i:s') . " [$level] $str\n", FILE_APPEND);
    };

    $mail->send();
    respond(true, 'Nachricht erfolgreich gesendet!', '/kontakt/?erfolg=1');

} catch (Exception $e) {
    if ($debug) {
        $info = isset($mail) ? $mail->ErrorInfo : $e->getMessage();
        file_put_contents(__DIR__ . '/mail_debug.log', date('Y-m-d H:i:s') . ' [Exception] ' . $info . "\n", FILE_APPEND);
    }
    respond(false, 'Fehler beim Senden. Bitte versuchen Sie es später erneut.', '/kontakt/?fehler=server');
}