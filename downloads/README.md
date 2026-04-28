# Secure Downloads Guide

## Overview

The download system uses a secure PHP handler (`php/download.php`) to serve files from the `downloads/` folder. This prevents direct access and provides multiple security layers.

## Security Features

### 1. Path Traversal Protection
- Validates filenames using `basename()` to remove directory paths
- Checks for null bytes (`\0`)
- Allows only alphanumeric characters, dashes, underscores, and dots
- Verifies resolved path is within downloads directory

### 2. File Type Validation
Only these extensions are allowed:
- Documents: `pdf`, `doc`, `docx`, `xls`, `xlsx`, `txt`, `csv`
- Archives: `zip`, `tar`, `gz`, `rar`, `7z`

### 3. Size Limits
- Maximum file size: **100MB** (configurable in `download.php`)
- Returns HTTP 413 if exceeded

### 4. Access Control
- `.htaccess` blocks PHP/script execution in downloads folder
- Forces `Content-Disposition: attachment` header
- Prevents inline display of documents
- Blocks directory listing

### 5. Logging
All download attempts are logged to `php/download_log.txt`:
```
[2024-01-15 14:30:22] SUCCESS - IP: 192.168.1.100 - File: satzung.pdf - UA: Mozilla/5.0...
[2024-01-15 14:31:05] FAILED - IP: 10.0.0.50 - File: ../../etc/passwd - UA: curl/7.68.0
```

### 6. Security Headers
Every download response includes:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Cache-Control: no-cache, must-revalidate`
- `Pragma: no-cache`

## How to Add Download Files

### Step 1: Prepare Your File
Ensure your file:
- Has an allowed extension (see list above)
- Is under 100MB
- Has a clean filename (no spaces, special chars)

### Step 2: Upload to Downloads Folder
Place files in `/workspace/secure-site/downloads/`:
```
downloads/
├── satzung.pdf           # Club constitution
├── anmeldung.pdf         # Registration form
├── ordnung.pdf           # Rules/regulations
├── spielerpass.pdf       # Player ID form
└── trainingsplan.pdf     # Training schedule
```

### Step 3: Create Download Link
Use the secure download handler:
```html
<!-- Basic link -->
<a href="php/download.php?file=satzung.pdf">Vereinssatzung herunterladen</a>

<!-- With file info -->
<a href="php/download.php?file=anmeldung.pdf" class="download-link">
    <span class="icon">📄</span>
    Anmeldeformular (PDF, 245 KB)
</a>

<!-- With download attribute -->
<a href="php/download.php?file=ordnung.pdf" download>
    Hallenordnung
</a>
```

## Usage Examples

### In HTML Footer (Already Implemented)
```html
<li><a href="php/download.php?file=satzung.pdf">Vereinssatzung (PDF)</a></li>
<li><a href="php/download.php?file=anmeldung.pdf">Anmeldeformular (PDF)</a></li>
<li><a href="php/download.php?file=ordnung.pdf">Hallenordnung (PDF)</a></li>
```

### In News Section
```html
<article class="news-item">
    <h3>Neue Vereinssatzung verfügbar</h3>
    <p>Die aktualisierte Vereinssatzung kann jetzt heruntergeladen werden.</p>
    <a href="php/download.php?file=satzung-2024.pdf" class="btn btn-primary">
        Jetzt herunterladen
    </a>
</article>
```

### In Teams Section
```html
<div class="team-info">
    <h4>Anmeldung</h4>
    <p>Ladet das Anmeldeformular herunter und bringt es zum Training mit.</p>
    <a href="php/download.php?file=anmeldung.pdf">
        📥 Anmeldeformular (PDF)
    </a>
</div>
```

## Configuration Options

Edit `php/download.php` to customize:

### Change Allowed Extensions
```php
$ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'txt'];
```

### Change Max File Size
```php
$MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB instead of 100MB
```

### Enable Authentication
Uncomment and implement authentication check:
```php
// Add this before the download logic
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    log_download($filename, false);
    die('Error: Authentication required.');
}
```

### Add IP Whitelist
In `downloads/.htaccess`:
```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.0/24
Allow from 10.0.0.0/8
```

## Testing Downloads

### Test Valid Download
```bash
curl -I "http://localhost/secure-site/php/download.php?file=satzung.pdf"
```
Expected headers:
```
HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="satzung.pdf"
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

### Test Invalid File
```bash
curl -I "http://localhost/secure-site/php/download.php?file=../etc/passwd"
```
Expected: HTTP 403 or 400

### Test Non-existent File
```bash
curl -I "http://localhost/secure-site/php/download.php?file=nicht-vorhanden.pdf"
```
Expected: HTTP 404

## Troubleshooting

### Problem: "File not found"
**Solution**: 
- Check file exists in `downloads/` folder
- Verify filename spelling (case-sensitive!)
- Check file permissions (readable by web server)

### Problem: "Access denied"
**Solution**:
- Ensure file extension is in `$ALLOWED_EXTENSIONS`
- Check `.htaccess` isn't blocking access
- Verify no special characters in filename

### Problem: Downloads don't start
**Solution**:
- Check browser popup blocker
- Verify JavaScript isn't interfering
- Test with different browser

### Problem: Log file grows too large
**Solution**:
- Implement log rotation in cron:
```bash
# Add to crontab
0 0 * * * find /workspace/secure-site/php -name "download_log.txt" -size +1M -exec mv {} {}.old \;
```

## Best Practices

1. **Always use the download handler** - Never link directly to files
2. **Keep filenames simple** - Only letters, numbers, dashes, underscores
3. **Use descriptive names** - `anmeldung-neumitglied.pdf` not `doc123.pdf`
4. **Regular cleanup** - Remove outdated files periodically
5. **Monitor logs** - Check for suspicious download patterns
6. **Update allowed types** - Only allow what's actually needed
7. **Set appropriate limits** - Adjust max size based on your needs

## Advanced: Protected Downloads

For member-only downloads, add authentication:

```php
// In download.php, after validation
require_once __DIR__ . '/../includes/auth.php';

if (!is_user_logged_in()) {
    http_response_code(403);
    log_download($filename, false);
    die('Error: Login required for this download.');
}

// Optional: Check user role
if (!user_has_role('member')) {
    http_response_code(403);
    log_download($filename, false);
    die('Error: Members only.');
}
```

Then create protected area:
```html
<!-- Visible only to logged-in users -->
<?php if (is_user_logged_in()): ?>
    <a href="php/download.php?file=internes-dokument.pdf">
        Internes Dokument
    </a>
<?php else: ?>
    <p>Bitte <a href="login.php">einloggen</a> um Downloads zu sehen.</p>
<?php endif; ?>
```
