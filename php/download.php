<?php
/**
 * Secure File Download Handler
 * 
 * This script safely serves files from the downloads folder with:
 * - Path traversal protection
 * - File type validation
 * - Access control
 * - Proper headers to force download
 * 
 * Usage: download.php?file=document.pdf
 */

// Include security configuration
require_once __DIR__ . '/../includes/config.php';

// Configuration
$DOWNLOADS_DIR = __DIR__ . '/../downloads/';
$ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'tar', 'gz', 'rar', '7z', 'txt', 'csv'];
$MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB max

/**
 * Validate and sanitize filename
 */
function validate_filename($filename) {
    // Remove any path components (prevent directory traversal)
    $basename = basename($filename);
    
    // Check for null bytes
    if (strpos($basename, "\0") !== false) {
        return false;
    }
    
    // Check for valid characters only (alphanumeric, dash, underscore, dot)
    if (!preg_match('/^[a-zA-Z0-9._-]+$/', $basename)) {
        return false;
    }
    
    return $basename;
}

/**
 * Get file extension safely
 */
function get_file_extension($filename) {
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    return $ext;
}

/**
 * Log download attempt
 */
function log_download($filename, $success = true) {
    $log_file = __DIR__ . '/download_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    $status = $success ? 'SUCCESS' : 'FAILED';
    
    $log_entry = "[$timestamp] $status - IP: $ip - File: $filename - UA: $user_agent\n";
    
    // Append to log file (limit to 1MB)
    if (file_exists($log_file) && filesize($log_file) > 1048576) {
        // Rotate log if too large
        file_put_contents($log_file, $log_entry);
    } else {
        file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
    }
}

// Main execution
try {
    // Check if file parameter exists
    if (!isset($_GET['file']) || empty($_GET['file'])) {
        http_response_code(400);
        die('Error: No file specified.');
    }
    
    // Validate filename
    $filename = validate_filename($_GET['file']);
    if (!$filename) {
        http_response_code(400);
        log_download($_GET['file'], false);
        die('Error: Invalid filename.');
    }
    
    // Build full path
    $filepath = realpath($DOWNLOADS_DIR . $filename);
    
    // Verify file is within downloads directory (prevent directory traversal)
    $real_downloads_dir = realpath($DOWNLOADS_DIR);
    if ($filepath === false || strpos($filepath, $real_downloads_dir) !== 0) {
        http_response_code(403);
        log_download($filename, false);
        die('Error: Access denied.');
    }
    
    // Check if file exists
    if (!file_exists($filepath)) {
        http_response_code(404);
        log_download($filename, false);
        die('Error: File not found.');
    }
    
    // Check file size
    $filesize = filesize($filepath);
    if ($filesize > $MAX_FILE_SIZE) {
        http_response_code(413);
        log_download($filename, false);
        die('Error: File too large.');
    }
    
    // Validate file extension
    $extension = get_file_extension($filename);
    if (!in_array($extension, $ALLOWED_EXTENSIONS)) {
        http_response_code(403);
        log_download($filename, false);
        die('Error: File type not allowed.');
    }
    
    // Optional: Add authentication check here
    // if (!is_user_logged_in()) {
    //     http_response_code(403);
    //     log_download($filename, false);
    //     die('Error: Authentication required.');
    // }
    
    // Set headers for secure download
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . $filesize);
    header('Cache-Control: no-cache, must-revalidate');
    header('Pragma: no-cache');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    
    // Clear output buffer
    if (ob_get_level()) {
        ob_end_clean();
    }
    
    // Log successful download
    log_download($filename, true);
    
    // Stream file to client
    readfile($filepath);
    exit;
    
} catch (Exception $e) {
    error_log('Download error: ' . $e->getMessage());
    http_response_code(500);
    die('Error: Unable to process download request.');
}
