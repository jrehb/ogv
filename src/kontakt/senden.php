<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

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
    $mail->Username   = $config['username'];
    $mail->Password   = $config['password'];
    $mail->SMTPSecure = 'tls';
    $mail->Port       = $config['port'];

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
    // Fehler ebenfalls loggen
    file_put_contents(__DIR__ . '/mail_debug.log', date('Y-m-d H:i:s') . ' [Exception] ' . $mail->ErrorInfo . "\n", FILE_APPEND);
    header('Location: /kontakt/?fehler=server');
}

exit;