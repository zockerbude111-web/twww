# Image Upload & Security Guidelines

## Recommended Image Formats

### For Photos (Team pictures, events, portraits)
- **Format**: JPEG/JPG
- **Quality**: 80-85% (good balance of quality/size)
- **Max dimensions**: 1920x1080px for full-width, 800x600px for cards
- **Color space**: sRGB

### For Graphics (Logos, icons, illustrations)
- **Format**: PNG (with transparency) or SVG (for vectors)
- **PNG**: Use for complex graphics with transparency
- **SVG**: Use for logos, icons, simple shapes (infinitely scalable)

### For Modern Browsers
- **Format**: WebP
- **Benefit**: 25-35% smaller than JPEG with same quality
- **Fallback**: Provide JPEG/PNG alternative for older browsers

## File Naming Convention

Use descriptive, SEO-friendly names:
- ✅ `1-herren-mannschaft.jpg`
- ✅ `sommerfest-2024.jpg`
- ✅ `verein-logo.svg`
- ❌ `IMG_1234.jpg`
- ❌ `DSC00001.png`

## Security Features Implemented

### 1. `.htaccess` Protection
The `images/.htaccess` file provides:
- **Blocks PHP execution** - Prevents malicious script uploads
- **Forces correct MIME types** - Ensures browsers interpret files correctly
- **Prevents directory listing** - Hides file structure from attackers
- **Cache control** - Improves performance with 1-week caching
- **Security headers** - X-Content-Type-Options: nosniff

### 2. CSP Configuration
Content Security Policy in `index.php`:
```html
img-src 'self' https: data:;
```
- Only allows images from same origin, HTTPS sources, or data URIs
- Blocks mixed content (HTTP images on HTTPS site)

### 3. Fallback Mechanism
Images use `onerror` handler to show placeholder if file missing:
```html
<img src="images/team.jpg" 
     onerror="this.src='data:image/svg+xml,...'"
     alt="Description">
```

## How to Add Images

### Step 1: Prepare Your Image
```bash
# Resize and optimize (using ImageMagick)
convert input.jpg -resize 1920x1080 -quality 85 output.jpg

# Or create WebP version
convert input.jpg -quality 85 output.webp
```

### Step 2: Upload to Correct Folder
Place images in `/workspace/secure-site/images/`:
- Team photos: `1-herren.jpg`, `a-jugend.jpg`, etc.
- Logo: `verein-logo.svg` or `logo.png`
- Events: `sommerfest-2024.jpg`, `hallenturnier.jpg`

### Step 3: Reference in HTML
```html
<!-- Simple -->
<img src="images/team-photo.jpg" alt="Team photo 2024" loading="lazy">

<!-- With WebP fallback -->
<picture>
    <source srcset="images/team-photo.webp" type="image/webp">
    <img src="images/team-photo.jpg" alt="Team photo 2024" loading="lazy">
</picture>

<!-- With error fallback (already implemented) -->
<img src="images/team.jpg" 
     onerror="this.src='data:image/svg+xml,...'"
     alt="Team photo">
```

## Performance Tips

1. **Lazy Loading**: All images use `loading="lazy"` attribute
2. **Responsive Images**: Use `srcset` for different screen sizes
3. **Compression**: Always compress before upload
4. **CDN**: Consider CDN for high-traffic sites

## Tools for Image Optimization

### Free Online Tools
- [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [SVGOMG](https://jakearchibald.com/2014/07/svgomg/) - SVG optimization

### Command Line Tools
```bash
# Install ImageMagick
apt-get install imagemagick

# Compress JPEG
mogrify -quality 85 *.jpg

# Create WebP versions
for img in *.jpg; do cwebp "$img" -q 85 -o "${img%.jpg}.webp"; done

# Install optipng for PNG
apt-get install optipng
optipng -o7 *.png
```

## Accessibility

Always include meaningful `alt` text:
- ✅ `alt="1. Herren Mannschaft beim Training"`
- ✅ `alt="Vereinslogo FC Rot-Blau Musterstadt"`
- ❌ `alt="image123.jpg"`
- ❌ `alt=""` (unless decorative)
