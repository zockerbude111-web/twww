<?php
/**
 * Secure Configuration File for FC Rot-Blau Musterstadt
 * 
 * Security Features:
 * - Uses environment variables for sensitive data
 * - Implements secure session configuration
 * - Defines security constants
 */

// Prevent direct access
defined('SECURE_FUSSBALLVEREIN') or die('Direct access not permitted');

// Session Security Configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_lifetime', 1800); // 30 minutes
ini_set('session.gc_maxlifetime', 1800);

// Start session with secure settings
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Security Headers
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// Content Security Policy
$csp = "default-src 'self'; "
     . "script-src 'self'; "
     . "style-src 'self' 'unsafe-inline'; "
     . "img-src 'self' https: data:; "
     . "font-src 'self'; "
     . "connect-src 'self'; "
     . "frame-ancestors 'none'; "
     . "base-uri 'self'; "
     . "form-action 'self'; "
     . "object-src 'none'; "
     . "upgrade-insecure-requests";
header("Content-Security-Policy: $csp");

// Application Constants
define('SITE_NAME', 'FC Rot-Blau Musterstadt');
define('SITE_URL', 'https://' . $_SERVER['HTTP_HOST']);
define('ADMIN_EMAIL', 'admin@fc-musterstadt.de');

// Input Validation Functions
function sanitize_input($data) {
    if (!isset($data)) return '';
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return $data;
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validate_csrf_token($token) {
    if (!isset($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

function generate_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Rate Limiting
function check_rate_limit($action, $limit = 5, $timeframe = 300) {
    $key = 'rate_limit_' . $action;
    $now = time();
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['count' => 1, 'reset' => $now + $timeframe];
        return true;
    }
    
    if ($now > $_SESSION[$key]['reset']) {
        $_SESSION[$key] = ['count' => 1, 'reset' => $now + $timeframe];
        return true;
    }
    
    if ($_SESSION[$key]['count'] >= $limit) {
        return false;
    }
    
    $_SESSION[$key]['count']++;
    return true;
}

// Password Hashing (using PHP's built-in secure functions)
function hash_password($password) {
    return password_hash($password, PASSWORD_ARGON2ID, [
        'memory_cost' => 65536,
        'time_cost' => 4,
        'threads' => 3
    ]);
}

function verify_password($password, $hash) {
    return password_verify($password, $hash);
}

// Database Connection (PDO with prepared statements)
function get_db_connection() {
    try {
        $dsn = 'mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_NAME') . ';charset=utf8mb4';
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        return new PDO($dsn, getenv('DB_USER'), getenv('DB_PASS'), $options);
    } catch (PDOException $e) {
        error_log('Database connection failed: ' . $e->getMessage());
        die('Service temporarily unavailable');
    }
}

/**
 * Secure file upload handler
 * @param array $file - $_FILES['team_image']
 * @param int $team_id - Team ID for unique filename
 * @return array ['success' => bool, 'message' => string, 'filename' => string]
 */
function handle_secure_upload($file, $team_id) {
    // Validate upload error
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'Upload error occurred.'];
    }
    
    // Check file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        return ['success' => false, 'message' => 'File is too large. Maximum size is 5MB.'];
    }
    
    // Validate MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    $allowed_mime_types = [
        'image/jpeg' => 'jpg',
        'image/pjpeg' => 'jpg',
        'image/png' => 'png'
    ];
    
    if (!isset($allowed_mime_types[$mime_type])) {
        return ['success' => false, 'message' => 'Invalid file type. Only JPG, JPEG and PNG are allowed.'];
    }
    
    // Validate file extension
    $original_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($original_ext, $allowed_mime_types)) {
        return ['success' => false, 'message' => 'Invalid file extension.'];
    }
    
    // Double-check: verify extension matches MIME type
    if ($allowed_mime_types[$mime_type] !== $original_ext && 
        !($mime_type === 'image/pjpeg' && $original_ext === 'jpg')) {
        return ['success' => false, 'message' => 'File extension does not match content.'];
    }
    
    // Create secure filename: team_{id}_{timestamp}.{ext}
    $new_filename = 'team_' . intval($team_id) . '_' . time() . '.' . $original_ext;
    $upload_dir = __DIR__ . '/../images/teams/';
    $upload_path = $upload_dir . $new_filename;
    
    // Ensure directory exists
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            return ['success' => false, 'message' => 'Failed to create upload directory.'];
        }
    }
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $upload_path)) {
        return ['success' => false, 'message' => 'Failed to save uploaded file.'];
    }
    
    // Set proper permissions
    chmod($upload_path, 0644);
    
    return ['success' => true, 'message' => 'File uploaded successfully.', 'filename' => $new_filename];
}

/**
 * Update team data in storage (file-based for demo, replace with DB in production)
 * @param int $team_id - Team ID to update
 * @param array $data - Data to update (only contains fields that need updating)
 * @return bool Success status
 */
function update_team_data($team_id, $data) {
    // In production, this would use a database
    // For demo purposes, we store in a JSON file
    $data_file = __DIR__ . '/../data/teams.json';
    
    // Initialize teams array if file doesn't exist
    if (!file_exists($data_file)) {
        $default_teams = [
            ['id' => '1', 'name' => '1. Herren', 'coach' => 'Michael Schmidt', 'image' => '1-herren.jpg'],
            ['id' => '2', 'name' => 'A-Junioren (U19)', 'coach' => 'Thomas Müller', 'image' => 'a-jugend.jpg'],
            ['id' => '3', 'name' => 'D-Junioren (U13)', 'coach' => 'Stefan Weber', 'image' => 'd-jugend.jpg'],
            ['id' => '4', 'name' => 'E-Jugend (U11)', 'coach' => '', 'image' => ''],
        ];
        if (!is_dir(dirname($data_file))) {
            mkdir(dirname($data_file), 0755, true);
        }
        file_put_contents($data_file, json_encode($default_teams, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
    
    $teams_json = file_get_contents($data_file);
    $teams = json_decode($teams_json, true);
    
    if (!is_array($teams)) {
        error_log('Invalid teams data format');
        return false;
    }
    
    $updated = false;
    
    // Find and update ONLY the specific team by ID (strict comparison)
    foreach ($teams as &$team) {
        // Strict type comparison to ensure exact match
        if (isset($team['id']) && $team['id'] === (string)$team_id) {
            // Merge ONLY the provided fields, preserving all other existing data
            foreach ($data as $key => $value) {
                $team[$key] = $value;
            }
            $updated = true;
            break; // CRITICAL: Stop immediately after updating the target team
        }
    }
    
    if (!$updated) {
        error_log("Team ID {$team_id} not found for update");
        return false;
    }
    
    // Save updated data
    if (file_put_contents($data_file, json_encode($teams, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false) {
        return true;
    }
    
    error_log('Failed to write team data');
    return false;
}

?>
