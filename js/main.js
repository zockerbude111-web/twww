/**
 * Main JavaScript for FC Rot-Blau Musterstadt
 * Secure, vanilla JavaScript - No React dependencies
 * 
 * Security Features:
 * - No eval() or innerHTML with user data
 * - Input sanitization
 * - CSRF token handling
 * - Secure event listeners
 */

(function() {
    'use strict';

    // ==========================================
    // SECURITY: Input Sanitization Functions
    // ==========================================
    
    const Security = {
        /**
         * Sanitize HTML to prevent XSS
         * @param {string} str - String to sanitize
         * @returns {string} - Sanitized string
         */
        sanitizeHTML: function(str) {
            if (!str || typeof str !== 'string') return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        /**
         * Sanitize URL to prevent javascript: protocol
         * @param {string} url - URL to sanitize
         * @returns {string} - Sanitized URL
         */
        sanitizeURL: function(url) {
            if (!url || typeof url !== 'string') return '';
            try {
                const parsed = new URL(url, window.location.origin);
                if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
                    return '';
                }
                return parsed.href;
            } catch (e) {
                return '';
            }
        },

        /**
         * Validate email format
         * @param {string} email - Email to validate
         * @returns {boolean}
         */
        isValidEmail: function(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        /**
         * Get CSRF token from meta tag
         * @returns {string|null}
         */
        getCSRFToken: function() {
            const meta = document.querySelector('meta[name="csrf-token"]');
            return meta ? meta.getAttribute('content') : null;
        }
    };

    // ==========================================
    // NAVIGATION: Mobile Menu Toggle
    // ==========================================
    
    const Navigation = {
        init: function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (!menuToggle || !navMenu) return;

            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                const isExpanded = navMenu.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', isExpanded.toString());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.focus();
                }
            });
        }
    };

    // ==========================================
    // FORMS: Secure Form Handling
    // ==========================================
    
    const Forms = {
        init: function() {
            this.initContactForm();
            this.initNewsletterForm();
        },

        /**
         * Handle contact form submission with security measures
         */
        initContactForm: function() {
            const form = document.getElementById('contact-form');
            if (!form) return;

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Disable button to prevent double submission
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="animate-spin">⏳</span> Wird gesendet...';

                try {
                    // Collect and sanitize form data
                    const formData = new FormData(form);
                    const data = {
                        name: Security.sanitizeHTML(formData.get('name')),
                        email: Security.sanitizeHTML(formData.get('email')),
                        subject: Security.sanitizeHTML(formData.get('subject')),
                        team: Security.sanitizeHTML(formData.get('team')),
                        message: Security.sanitizeHTML(formData.get('message')),
                        dsgvo: formData.get('dsgvo') === 'on',
                        csrf_token: Security.getCSRFToken()
                    };

                    // Client-side validation
                    if (!data.name || data.name.length < 2) {
                        throw new Error('Bitte geben Sie Ihren Namen ein.');
                    }
                    if (!Security.isValidEmail(data.email)) {
                        throw new Error('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                    }
                    if (!data.message || data.message.length < 10) {
                        throw new Error('Die Nachricht muss mindestens 10 Zeichen lang sein.');
                    }
                    if (!data.dsgvo) {
                        throw new Error('Bitte akzeptieren Sie die Datenschutzbestimmungen.');
                    }

                    // Send to server
                    const response = await fetch('php/contact.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': data.csrf_token
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (result.success) {
                        Notifications.show('Vielen Dank! Ihre Nachricht wurde gesendet.', 'success');
                        form.reset();
                    } else {
                        throw new Error(result.message || 'Ein Fehler ist aufgetreten.');
                    }
                } catch (error) {
                    Notifications.show(error.message, 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        },

        /**
         * Newsletter form handler
         */
        initNewsletterForm: function() {
            const form = document.getElementById('newsletter-form');
            if (!form) return;

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const emailInput = form.querySelector('input[type="email"]');
                const email = Security.sanitizeHTML(emailInput.value);

                if (!Security.isValidEmail(email)) {
                    Notifications.show('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                    return;
                }

                try {
                    const response = await fetch('php/newsletter.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': Security.getCSRFToken()
                        },
                        body: JSON.stringify({ email, csrf_token: Security.getCSRFToken() })
                    });

                    const result = await response.json();
                    
                    if (result.success) {
                        Notifications.show('Vielen Dank für Ihre Anmeldung!', 'success');
                        emailInput.value = '';
                    } else {
                        throw new Error(result.message);
                    }
                } catch (error) {
                    Notifications.show(error.message, 'error');
                }
            });
        }
    };

    // ==========================================
    // UI: Smooth Scroll & Animations
    // ==========================================
    
    const UI = {
        init: function() {
            this.initSmoothScroll();
            this.initScrollAnimations();
            this.initActiveNavHighlight();
        },

        /**
         * Smooth scroll for anchor links
         */
        initSmoothScroll: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update history without scrolling
                        history.pushState(null, '', targetId);
                    }
                });
            });
        },

        /**
         * Scroll-triggered animations
         */
        initScrollAnimations: function() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in-up');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.card, .section-title').forEach(el => {
                el.style.opacity = '0';
                observer.observe(el);
            });
        },

        /**
         * Highlight active navigation link based on scroll position
         */
        initActiveNavHighlight: function() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');

            if (!sections.length || !navLinks.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }, {
                threshold: 0.3
            });

            sections.forEach(section => observer.observe(section));
        }
    };

    // ==========================================
    // SHARED: Notification System
    // ==========================================
    
    const Notifications = {
        /**
         * Show notification message
         * @param {string} message - Message to display
         * @param {string} type - 'success' or 'error'
         */
        show: function(message, type) {
            const existing = document.querySelector('.notification');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.className = `notification fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-xl z-50 animate-fade-in-up ${
                type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`;
            notification.textContent = Security.sanitizeHTML(message);
            notification.setAttribute('role', 'alert');
            notification.setAttribute('aria-live', 'polite');

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }
    };
    // ==========================================
    // TEAMS: Team Section Interactions

    // ==========================================
    // DASHBOARD: Trainer-Bereich (Team Photo Upload & News Management)
    // ==========================================
    
    const Dashboard = {
        init: function() {
            this.initTeamPhotoUpload();
            this.initNewsManagement();
        },

        /**
         * Team Photo Upload Handler - Strict .jpg, .jpeg, .png validation
         */
        initTeamPhotoUpload: function() {
            const form = document.getElementById('team-photo-upload-form');
            const fileInput = document.getElementById('team-photo-file');
            const preview = document.getElementById('team-photo-preview');
            const submitBtn = document.getElementById('team-photo-submit-btn');

            if (!form || !fileInput) return;

            // File preview on selection
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) {
                    if (preview) preview.style.display = 'none';
                    return;
                }

                // STRICT: Validate file extension
                const fileName = file.name.toLowerCase();
                const validExtensions = ['.jpg', '.jpeg', '.png'];
                const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

                if (!hasValidExtension) {
                    Notifications.show('Ungultiges Dateiformat! Nur .jpg, .jpeg und .png sind erlaubt.', 'error');
                    fileInput.value = '';
                    if (preview) preview.style.display = 'none';
                    return;
                }

                // Validate MIME type
                const validTypes = ['image/jpeg', 'image/png'];
                if (!validTypes.includes(file.type)) {
                    Notifications.show('Ungultiger Dateitype! Nur JPG und PNG sind erlaubt.', 'error');
                    fileInput.value = '';
                    if (preview) preview.style.display = 'none';
                    return;
                }

                // Show preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (preview) {
                        preview.src = event.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            });

            // Form submission
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const teamSelect = document.getElementById('upload-team-select');
                const teamId = teamSelect ? teamSelect.value : '';
                const file = fileInput.files[0];

                // Validate team selection
                if (!teamId) {
                    Notifications.show('Bitte wahlen Sie ein Team aus.', 'error');
                    return;
                }

                // Validate file
                if (!file) {
                    Notifications.show('Bitte wahlen Sie eine Datei zum Hochladen.', 'error');
                    return;
                }

                // Final validation before submit
                const fileName = file.name.toLowerCase();
                const validExtensions = ['.jpg', '.jpeg', '.png'];
                const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

                if (!hasValidExtension) {
                    Notifications.show('Veroffentlichen fehlgeschlagen: Ungultiges Dateiformat! Nur .jpg, .jpeg und .png sind erlaubt.', 'error');
                    return;
                }

                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="animate-spin">⏳</span> Wird veroffentlicht...';

                try {
                    const formData = new FormData();
                    formData.append('csrf_token', Security.getCSRFToken());
                    formData.append('team_id', teamId);
                    formData.append('team_image', file);

                    const response = await fetch('php/update-team.php', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (result.success) {
                        Notifications.show('Mannschaftsfoto erfolgreich hochgeladen!', 'success');
                        form.reset();
                        if (preview) preview.style.display = 'none';
                        // Use Dashboard's own updateTeamImage method (not Teams)
                        this.updateTeamImage(teamId, result.image_path);
                    } else {
                        throw new Error(result.message || 'Ein Fehler ist aufgetreten.');
                    }
                } catch (error) {
                    Notifications.show(error.message, 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        },

        /**
         * News Management - Create, Edit, Delete posts
         */
        initNewsManagement: function() {
            const form = document.getElementById('news-post-form');
            const titleInput = document.getElementById('news-title');
            const contentInput = document.getElementById('news-content');
            const editIdInput = document.getElementById('news-edit-id');
            const submitBtn = document.getElementById('news-submit-btn');
            const cancelBtn = document.getElementById('news-cancel-btn');
            const newsContainer = document.getElementById('news-items-container');

            if (!form) return;

            let newsData = [
                { id: 1, title: 'Erfolgreicher Hallenturnier-Auftakt', content: 'Unsere A-Jugend gewann das Neujahrsturnier in der Nachbarstadt. Herzlichen Gluckwunsch an das gesamte Team!', date: '2025-01-15' },
                { id: 2, title: 'Wichtige Mitgliederversammlung', content: 'Am 25. Januar findet unsere jahrliche Mitgliederversammlung statt. Alle Mitglieder sind herzlich eingeladen.', date: '2025-01-10' }
            ];

            const renderNewsList = () => {
                if (!newsContainer) return;
                newsContainer.innerHTML = newsData.map(news => 
                    '<div class="news-item" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 10px; background: #f8fafc;">' +
                        '<div style="display: flex; justify-content: space-between; align-items: start;">' +
                            '<div style="flex: 1;">' +
                                '<strong style="color: #142850;">' + Security.sanitizeHTML(news.title) + '</strong>' +
                                '<p style="font-size: 0.875rem; color: #64748b; margin: 4px 0;">' + Security.sanitizeHTML(news.content.substring(0, 80)) + (news.content.length > 80 ? '...' : '') + '</p>' +
                                '<span style="font-size: 0.75rem; color: #94a3b8;">' + news.date + '</span>' +
                            '</div>' +
                            '<div style="display: flex; gap: 8px;">' +
                                '<button class="edit-news-btn" data-id="' + news.id + '" style="padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">Bearbeiten</button>' +
                                '<button class="delete-news-btn" data-id="' + news.id + '" style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">Loschen</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                ).join('');

                newsContainer.querySelectorAll('.edit-news-btn').forEach(btn => {
                    btn.addEventListener('click', () => this.editNews(parseInt(btn.dataset.id)));
                });
                newsContainer.querySelectorAll('.delete-news-btn').forEach(btn => {
                    btn.addEventListener('click', () => this.deleteNews(parseInt(btn.dataset.id)));
                });
            };

            renderNewsList();

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    editIdInput.value = '';
                    titleInput.value = '';
                    contentInput.value = '';
                    submitBtn.textContent = 'Speichern';
                    cancelBtn.style.display = 'none';
                });
            }

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const title = titleInput.value.trim();
                const content = contentInput.value.trim();
                const editId = editIdInput.value;

                if (!title || !content) {
                    Notifications.show('Bitte fullen Sie alle Felder aus.', 'error');
                    return;
                }

                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Wird gespeichert...';

                try {
                    if (editId) {
                        const index = newsData.findIndex(n => n.id === parseInt(editId));
                        if (index !== -1) {
                            newsData[index] = { ...newsData[index], title, content };
                            Notifications.show('Neuigkeit erfolgreich aktualisiert!', 'success');
                        }
                    } else {
                        const newId = Math.max(...newsData.map(n => n.id), 0) + 1;
                        const today = new Date().toISOString().split('T')[0];
                        newsData.unshift({ id: newId, title, content, date: today });
                        Notifications.show('Neuigkeit erfolgreich erstellt!', 'success');
                    }

                    editIdInput.value = '';
                    titleInput.value = '';
                    contentInput.value = '';
                    submitBtn.textContent = 'Speichern';
                    cancelBtn.style.display = 'none';
                    renderNewsList();

                } catch (error) {
                    Notifications.show(error.message, 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });

            this.editNews = (id) => {
                const news = newsData.find(n => n.id === id);
                if (!news) return;
                editIdInput.value = news.id;
                titleInput.value = news.title;
                contentInput.value = news.content;
                submitBtn.textContent = 'Aktualisieren';
                cancelBtn.style.display = 'inline-block';
                titleInput.focus();
            };

            this.deleteNews = (id) => {
                const news = newsData.find(n => n.id === id);
                if (!news) return;
                if (confirm('Mochten Sie die Neuigkeit "' + news.title + '" wirklich loschen?')) {
                    newsData = newsData.filter(n => n.id !== id);
                    renderNewsList();
                    Notifications.show('Neuigkeit erfolgreich geloscht!', 'success');
                    if (editIdInput.value === String(id)) {
                        editIdInput.value = '';
                        titleInput.value = '';
                        contentInput.value = '';
                        submitBtn.textContent = 'Speichern';
                        cancelBtn.style.display = 'none';
                    }
                }
            };
        }
    };
    // ==========================================
    
    const Teams = {
        init: function() {
            this.initTeamCards();
            this.initTeamEditModal();
            // Enable team editing by default (admin functionality integrated)
            this.enableTeamEditing();
        },

        /**
         * Add hover effects and keyboard navigation to team cards
         */
        initTeamCards: function() {
            const cards = document.querySelectorAll('.team-card');
            
            cards.forEach(card => {
                // Keyboard accessibility
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'article');
                
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        card.click();
                    }
                });
            });
        },

        /**
         * Team Edit Modal Handling
         */
        initTeamEditModal: function() {
            const editModal = document.getElementById('team-edit-modal');
            const editForm = document.getElementById('team-edit-form');
            const closeBtn = editModal?.querySelector('.modal-close');
            const cancelBtn = editModal?.querySelector('.modal-cancel');
            const imageInput = document.getElementById('edit-team-image');
            const imageUrlInput = document.getElementById('edit-team-image-url');
            const imagePreview = document.getElementById('edit-team-image-preview');

            if (!editModal) return;

            // Close modal functions
            const closeModal = () => {
                editModal.hidden = true;
                editModal.setAttribute('aria-hidden', 'true');
                editForm.reset();
                if (imagePreview) imagePreview.style.display = 'none';
            };

            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
            
            // Close on outside click
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) closeModal();
            });

            // Image file preview
            if (imageInput) {
                imageInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file && imagePreview) {
                        // STRICT: Validate file extension - only jpg, jpeg, png allowed
                        const fileName = file.name.toLowerCase();
                        const validExtensions = ['.jpg', '.jpeg', '.png'];
                        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
                        
                        if (!hasValidExtension) {
                            Notifications.show('Ungültiger Dateitype. Nur JPG, JPEG und PNG sind erlaubt.', 'error');
                            imageInput.value = '';
                            return;
                        }
                        
                        // Validate MIME type
                        const validTypes = ['image/jpeg', 'image/png'];
                        if (!validTypes.includes(file.type)) {
                            Notifications.show('Ungültiger Dateitype. Nur JPG und PNG sind erlaubt.', 'error');
                            imageInput.value = '';
                            return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            imagePreview.src = event.target.result;
                            imagePreview.style.display = 'block';
                        };
                        reader.readAsDataURL(file);
                        // Clear URL input when file is selected
                        if (imageUrlInput) imageUrlInput.value = '';
                    }
                });
            }

            // Image URL validation and preview - STRICT validation for image extensions only
            if (imageUrlInput) {
                imageUrlInput.addEventListener('blur', (e) => {
                    const url = e.target.value.trim();
                    if (url) {
                        // STRICT: Validate URL ends with image extension ONLY (no YouTube, no websites)
                        // Only allow .jpg, .jpeg, .png
                        const imagePattern = /^https?:\/\/[^\s]+\.(jpg|jpeg|png)(\?.*)?$/i;
                        if (!imagePattern.test(url)) {
                            Notifications.show('Ungültige Bild-URL. Muss ein direktes Bild sein (.jpg, .jpeg, .png). Keine YouTube- oder Webseiten-Links.', 'error');
                            imageUrlInput.value = '';
                            if (imagePreview) imagePreview.style.display = 'none';
                            return;
                        }
                        // Show preview for valid URLs
                        if (imagePreview) {
                            imagePreview.src = url;
                            imagePreview.style.display = 'block';
                            // Clear file input when URL is entered
                            if (imageInput) imageInput.value = '';
                        }
                    }
                });
            }

            // Handle form submission - with STRICT URL validation and file upload support
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = editForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="animate-spin">⏳</span> Wird gespeichert...';

                try {
                    // CRITICAL FIX: Validate BEFORE creating FormData
                    const teamId = document.getElementById('edit-team-id').value;
                    const hasFile = imageInput && imageInput.files && imageInput.files[0];
                    const urlValue = imageUrlInput ? imageUrlInput.value.trim() : '';
                    const hasUrl = urlValue !== '' && !imageUrlInput.disabled;
                    
                    // CRITICAL FIX 1: STRICT URL VALIDATION - Block YouTube, websites, etc.
                    if (hasUrl) {
                        // Must start with http/https AND end with .jpg/.jpeg/.png ONLY
                        const strictImagePattern = /^https?:\/\/[^\/\s]+\/[^?#\s]+\.(jpg|jpeg|png)(\?.*)?$/i;
                        
                        // Additional checks to block video sites and non-image URLs
                        const blockedDomains = ['youtube', 'youtu.be', 'vimeo', 'dailymotion', 'facebook', 'twitter', 'instagram', 'tiktok'];
                        const isBlockedDomain = blockedDomains.some(domain => urlValue.toLowerCase().includes(domain));
                        
                        if (!strictImagePattern.test(urlValue)) {
                            throw new Error('Ungültige Bild-URL. Die URL MUSS auf .jpg, .jpeg oder .png enden. Keine YouTube-Links oder Webseiten.');
                        }
                        
                        if (isBlockedDomain) {
                            throw new Error('Video-Plattformen sind nicht erlaubt. Bitte nur direkte Bild-Links verwenden.');
                        }
                    }
                    
                    // Validate: either file OR URL, not both
                    if (hasFile && hasUrl) {
                        throw new Error('Bitte wählen Sie entweder eine Datei ODER geben Sie eine URL ein, nicht beides.');
                    }
                    
                    if (!hasFile && !hasUrl) {
                        // No image change, that's okay - just update other fields
                        // But we need at least one field to update
                        const nameVal = document.getElementById('edit-team-name').value.trim();
                        const coachVal = document.getElementById('edit-team-coach').value.trim();
                        const emailVal = document.getElementById('edit-team-email').value.trim();
                        const phoneVal = document.getElementById('edit-team-phone').value.trim();
                        
                        if (!nameVal && !coachVal && !emailVal && !phoneVal) {
                            throw new Error('Keine Änderungen vorgenommen. Bitte geben Sie ein Bild oder andere Informationen ein.');
                        }
                    }
                    
                    // NOW create FormData after validation passes
                    const formData = new FormData(editForm);
                    
                    // CRITICAL FIX 2: Ensure file input data is properly included in FormData
                    // If a file was selected, make sure it's in the FormData
                    if (hasFile) {
                        // Remove any existing team_image entry and add the actual file
                        formData.delete('team_image');
                        formData.append('team_image', imageInput.files[0]);
                    }
                    
                    // CRITICAL FIX 3: Handle disabled URL input (prevents abuse)
                    // If URL input is disabled (already has external URL), don't send empty value
                    if (imageUrlInput && imageUrlInput.disabled) {
                        formData.delete('image_url');
                    }

                    const response = await fetch('php/update-team.php', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (result.success) {
                        Notifications.show('Team erfolgreich aktualisiert!', 'success');
                        closeModal();
                        // Update the team card display
                        if (result.image_path) {
                            this.updateTeamImage(teamId, result.image_path);
                        }
                        this.updateTeamInfo(teamId, result.data);
                    } else {
                        throw new Error(result.message || 'Ein Fehler ist aufgetreten.');
                    }
                } catch (error) {
                    Notifications.show(error.message, 'error');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !editModal.hidden) {
                    closeModal();
                }
            });
        },

        /**
         * Enable editing for team cards (called after admin login)
         */
        enableTeamEditing: function() {
            const cards = document.querySelectorAll('.team-card');
            
            cards.forEach(card => {
                // Check if edit button already exists
                if (card.querySelector('.edit-team-btn')) return;

                const editBtn = document.createElement('button');
                editBtn.className = 'edit-team-btn';
                editBtn.innerHTML = '✏️ Bearbeiten';
                editBtn.style.cssText = 'position: absolute; top: 10px; right: 10px; padding: 8px 12px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; opacity: 0; transition: opacity 0.3s;';
                
                card.style.position = 'relative';
                card.appendChild(editBtn);

                // Show button on hover
                card.addEventListener('mouseenter', () => editBtn.style.opacity = '1');
                card.addEventListener('mouseleave', () => editBtn.style.opacity = '0');

                // Get team data from card
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const teamName = card.querySelector('.card-title')?.textContent || '';
                    const teamDesc = card.querySelector('.card-text')?.textContent || '';
                    const teamImg = card.querySelector('.card-image')?.src || '';
                    
                    // Extract team ID from data attribute or generate from name
                    let teamId = card.getAttribute('data-team-id') || '';
                    
                    // Map team names to IDs for demo
                    const teamIdMap = {
                        '1. Herren': '1',
                        'A-Junioren (U19)': '2',
                        'D-Junioren (U13)': '3',
                        'E-Jugend (U11)': '4'
                    };
                    
                    if (!teamId && teamIdMap[teamName]) {
                        teamId = teamIdMap[teamName];
                    }

                    // Populate edit form
                    document.getElementById('edit-team-id').value = teamId;
                    document.getElementById('edit-team-name').value = teamName;
                    
                    // Parse coach from description (simple parsing)
                    const coachMatch = teamDesc.match(/Trainiert von ([^.]+)/);
                    if (coachMatch) {
                        document.getElementById('edit-team-coach').value = coachMatch[1].trim();
                    }
                    
                    // Set image preview and handle URL input state
                    const imagePreview = document.getElementById('edit-team-image-preview');
                    const imageUrlInput = document.getElementById('edit-team-image-url');
                    if (imagePreview && teamImg) {
                        imagePreview.src = teamImg;
                        imagePreview.style.display = 'block';
                    }
                    
                    // Always reset URL input - allow new URLs but validate strictly on blur/submit
                    if (imageUrlInput) {
                        imageUrlInput.disabled = false;
                        imageUrlInput.placeholder = 'https://example.com/image.jpg';
                        imageUrlInput.title = 'Nur direkte Bild-Links mit .jpg, .jpeg oder .png Endung erlaubt.';
                        imageUrlInput.value = '';
                    }

                    // Open modal
                    const editModal = document.getElementById('team-edit-modal');
                    editModal.hidden = false;
                    editModal.setAttribute('aria-hidden', 'false');
                });
            });
        },

        /**
         * Update team image on the card - FIX: Only updates specific team by ID
         */
        updateTeamImage: function(teamId, imagePath) {
            const cards = document.querySelectorAll('.team-card');
            cards.forEach(card => {
                // FIX: Strict comparison ensures only the matching team is updated
                if (card.getAttribute('data-team-id') === String(teamId)) {
                    const img = card.querySelector('.card-image');
                    if (img) {
                        img.src = imagePath;
                    }
                }
            });
        },

        /**
         * Update team info on the card - FIX: Only updates specific team by ID
         */
        updateTeamInfo: function(teamId, data) {
            const cards = document.querySelectorAll('.team-card');
            cards.forEach(card => {
                // FIX: Strict comparison ensures only the matching team is updated
                if (card.getAttribute('data-team-id') === String(teamId)) {
                    if (data.name) {
                        const title = card.querySelector('.card-title');
                        if (title) title.textContent = data.name;
                    }
                    if (data.coach || data.email || data.phone) {
                        // Rebuild description
                        const desc = card.querySelector('.card-text');
                        if (desc) {
                            let newDesc = '';
                            if (data.coach) newDesc += `Trainiert von ${data.coach}. `;
                            if (data.email) newDesc += `Email: ${data.email}. `;
                            if (data.phone) newDesc += `Tel: ${data.phone}`;
                            desc.textContent = newDesc;
                        }
                    }
                }
            });
        }
    };
    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    document.addEventListener('DOMContentLoaded', function() {
        Navigation.init();
        Forms.init();
        UI.init();
        Teams.init();
        Dashboard.init();
        
        console.log('FC Rot-Blau Musterstadt - Website initialized securely');
    });

    // Expose security utilities globally if needed
    window.FCVerein = {
        Security: Security,
        Forms: Forms,
        Notifications: Notifications,
        Dashboard: Dashboard
    };

})();
