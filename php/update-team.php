<?php
/**
 * Secure Team Update Handler
 * Handles form submissions for editing team information and image uploads
 */

require_once '../includes/config.php';

header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Check Rate Limiting
if (!check_rate_limit('team_update', 10, 60)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many attempts. Please wait a moment.']);
    exit;
}

// Validate CSRF Token
if (!isset($_POST['csrf_token']) || !validate_csrf_token($_POST['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Invalid security token. Please refresh the page.']);
    exit;
}

// Validate Team ID
$team_id = isset($_POST['team_id']) ? sanitize_input($_POST['team_id']) : '';
if (empty($team_id) || !preg_match('/^[0-9]+$/', $team_id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid team ID.']);
    exit;
}

$update_data = [];
$image_updated = false;

// Handle File Upload if present
if (isset($_FILES['team_image']) && $_FILES['team_image']['error'] !== UPLOAD_ERR_NO_FILE) {
    $upload_result = handle_secure_upload($_FILES['team_image'], $team_id);
    
    if (!$upload_result['success']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $upload_result['message']]);
        exit;
    }
    
    // Add new filename to update data
    $update_data['image'] = $upload_result['filename'];
    $image_updated = true;
}

// Handle Image URL if provided (and no file upload)
if (isset($_POST['image_url']) && !empty(trim($_POST['image_url']))) {
    if ($image_updated) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Cannot upload both file and URL. Please use only one method.']);
        exit;
    }
    
    $image_url = trim($_POST['image_url']);
    
    // STRICT: Validate URL format - must be HTTP/HTTPS and end with image extension ONLY (.jpg, .jpeg, .png)
    // This blocks YouTube links, website links, etc.
    if (!preg_match('/^https?:\/\/[^\s]+\.(jpg|jpeg|png)(\?.*)?$/i', $image_url)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid image URL. Must be a direct link ending with .jpg, .jpeg, or .png. No YouTube or website links allowed.']);
        exit;
    }

    // Additional security: ensure URL doesn't contain path traversal or video sites
    if (strpos($image_url, '..') !== false || strpos($image_url, '//') > 8 || stripos($image_url, 'youtube') !== false || stripos($image_url, 'vimeo') !== false) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid URL format. Only direct image links are allowed.']);
        exit;
    }
    $update_data['image'] = $image_url;
    $image_updated = true;
}

// Process text fields
$allowed_fields = ['name', 'coach', 'email', 'phone'];
foreach ($allowed_fields as $field) {
    if (isset($_POST[$field])) {
        $value = sanitize_input($_POST[$field]);
        
        // Additional validation per field
        if ($field === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid email address format.']);
            exit;
        }
        
        if ($field === 'phone' && !empty($value)) {
            // Basic phone validation (allow digits, spaces, +, -, /, ())
            if (!preg_match('/^[\d\s\+\-\/\(\)]+$/', $value)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid phone number format.']);
                exit;
            }
        }
        
        // Length limits
        if (strlen($value) > 255) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Field '{$field}' is too long."]);
            exit;
        }
        
        $update_data[$field] = $value;
    }
}

// If nothing to update
if (empty($update_data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No data provided to update.']);
    exit;
}

// Update the specific team
if (update_team_data($team_id, $update_data)) {
    // Return the updated image path if it was changed
    $response = [
        'success' => true, 
        'message' => 'Team information updated successfully.',
        'data' => $update_data
    ];
    
    if (isset($update_data['image'])) {
        $response['image_path'] = 'images/teams/' . $update_data['image'];
    }
    
    echo json_encode($response);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to update team data.']);
}
