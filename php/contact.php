<?php
/**
 * Secure Contact Form Handler
 * 
 * Security Features:
 * - CSRF token validation
 * - Input sanitization and validation
 * - Rate limiting
 * - Email header injection prevention
 * - Server-side validation
 */

define('SECURE_FUSSBALLVEREIN', true);
require_once '../includes/config.php';

// Set JSON response header
header('Content-Type: application/json; charset=utf-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Check rate limiting
if (!check_rate_limit('contact_form', 5, 300)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Zu viele Versuche. Bitte warten Sie einige Minuten.']);
    exit;
}

// Get and decode JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ungültige Daten']);
    exit;
}

// Validate CSRF token
if (!validate_csrf_token($data['csrf_token'] ?? '')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Sicherheitsüberprüfung fehlgeschlagen']);
    exit;
}

// Sanitize and validate inputs
$name = sanitize_input($data['name'] ?? '');
$email = sanitize_input($data['email'] ?? '');
$subject = sanitize_input($data['subject'] ?? '');
$team = sanitize_input($data['team'] ?? '');
$message = sanitize_input($data['message'] ?? '');
$dsgvo = isset($data['dsgvo']) && $data['dsgvo'] === true;

// Validation errors array
$errors = [];

// Validate name
if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'Bitte geben Sie einen gültigen Namen ein (2-100 Zeichen).';
}

// Validate email
if (empty($email) || !validate_email($email) || strlen($email) > 255) {
    $errors[] = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
}

// Validate message
if (empty($message) || strlen($message) < 10 || strlen($message) > 2000) {
    $errors[] = 'Die Nachricht muss zwischen 10 und 2000 Zeichen lang sein.';
}

// Validate DSGVO consent
if (!$dsgvo) {
    $errors[] = 'Sie müssen der Datenschutzerklärung zustimmen.';
}

// Return validation errors
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// Prevent email header injection
function sanitize_email_header($str) {
    return preg_replace('/[\r\n]/', '', $str);
}

// Prepare email
$to = ADMIN_EMAIL;
$safeSubject = sanitize_email_header($subject ?: 'Kontaktformular: ' . $name);
$safeName = sanitize_email_header($name);
$safeEmail = sanitize_email_header($email);
$safeTeam = sanitize_email_header($team);
$safeMessage = sanitize_email_header($message);

// Email headers with security measures
$headers = [
    'From: FC Rot-Blau Musterstadt <noreply@' . $_SERVER['HTTP_HOST'] . '>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8'
];

// Email body
$emailBody = "Neue Kontaktanfrage\n";
$emailBody .= "=====================\n\n";
$emailBody .= "Name: {$safeName}\n";
$emailBody .= "E-Mail: {$safeEmail}\n";
if ($safeTeam) {
    $emailBody .= "Mannschaft: {$safeTeam}\n";
}
$emailBody .= "Betreff: {$safeSubject}\n\n";
$emailBody .= "Nachricht:\n{$safeMessage}\n\n";
$emailBody .= "---------------------\n";
$emailBody .= "IP-Adresse: " . $_SERVER['REMOTE_ADDR'] . "\n";
$emailBody .= "Datum: " . date('Y-m-d H:i:s') . "\n";

// Send email (in production, use a proper mail library like PHPMailer)
$mailSent = mail($to, $safeSubject, $emailBody, implode("\r\n", $headers));

if ($mailSent) {
    // Log successful submission (for audit trail)
    error_log("Contact form submission from: {$safeEmail} - {$safeName}");
    
    echo json_encode([
        'success' => true,
        'message' => 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.'
    ]);
} else {
    // Log error
    error_log("Failed to send contact form email from: {$safeEmail}");
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
    ]);
}

?>
