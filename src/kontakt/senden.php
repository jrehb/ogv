<?php
$debug = false; // ← auf true setzen zum Debuggen
/*
    Altcha-Payload
*/
define('ALTCHA_HMAC_KEY', 'da03fee65e614a0a0dfb63655342c52e3c67971ac42fc1bdaa47fef56a3d9049'); // Gleicher Key!

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

$altchaPayload = $_POST['altcha'] ?? '';
if (!verifyAltcha($altchaPayload)) {
    http_response_code(400);
    die('ALTCHA-Verifizierung fehlgeschlagen.');
}

/*
    E-Mail Versand
*/

if ($debug) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /kontakt/');
    exit;
}

// PHPMailer einbinden
require __DIR__ . '/../phpmailer/PHPMailer.php';
require __DIR__ . '/../phpmailer/SMTP.php';
require __DIR__ . '/../phpmailer/Exception.php';

// Config laden (im config-Ordner, z.B. /public_html/config/mail_config.php)
$config = require __DIR__ . '/../config/mail_config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Wenn Honeypot ausgefüllt → Bot
if (!empty($_POST['website'])) {
    header('Location: /kontakt/?erfolg=1'); // Bot denkt es hat geklappt
    exit;
}

// POST-Daten bereinigen
$name      = trim(strip_tags($_POST['name'] ?? ''));
$email     = trim(strip_tags($_POST['email'] ?? ''));
$nachricht = trim(strip_tags($_POST['nachricht'] ?? ''));

// Pflichtfelder prüfen
if (empty($name) || empty($email) || empty($nachricht)) {
    header('Location: /kontakt/?fehler=leer');
    exit;
}

// E-Mail validieren
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: /kontakt/?fehler=email');
    exit;
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

    $mail->setFrom($config['from'], 'OGV Kloppenheim'); // Absender-Adresse + Name
    $mail->addReplyTo($email, $name);                   // Nutzerantwort
    $mail->addAddress($config['to']);                   // Empfänger

    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'Kontaktanfrage von ' . $name;
    $mail->Body    = "Name: $name\nE-Mail: $email\n\nNachricht:\n$nachricht";

    // Debugging aktivieren (alles in mail_debug.log)
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {
        file_put_contents(__DIR__ . '/mail_debug.log', date('Y-m-d H:i:s') . " [$level] $str\n", FILE_APPEND);
    };

    $mail->send();
    header('Location: /kontakt/?erfolg=1');

} catch (Exception $e) {
    if ($debug) {
        $info = isset($mail) ? $mail->ErrorInfo : $e->getMessage();
        file_put_contents(__DIR__ . '/mail_debug.log', date('Y-m-d H:i:s') . ' [Exception] ' . $info . "\n", FILE_APPEND);
        die('Fehler: ' . $info);
    }
    header('Location: /kontakt/?fehler=server');
}

exit;