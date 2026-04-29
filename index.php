<!doctype html>
<html lang="de">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#142850"/>
<meta name="description" content="VfL Wilhelmshaven e. V. – Dein Sportverein in Wilhelmshaven."/>
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"/>
<meta name="referrer" content="strict-origin-when-cross-origin"/>
<link rel="stylesheet" href="css/styles.css"/>
<title>VfL Wilhelmshaven e. V. | Sportverein</title>
</head>
<body>

<!-- HEADER -->
<header id="site-header">
  <div class="header-top">
    <div class="header-top-inner">
      <span class="flex gap-3">
        <span class="header-top-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          01234 / 567 890
        </span>
        <span class="header-top-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          info@vfl-wilhelmshaven.de
        </span>
      </span>
      <span class="header-top-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        Musterweg 12 · 12345 Wilhelmshaven
      </span>
    </div>
  </div>
  <nav class="main-nav">
    <div class="nav-inner">
      <div class="nav-links">
        <button class="nav-link-btn" data-page="home" onclick="navigate('home')">Start</button>
        <button class="nav-link-btn" data-page="news" onclick="navigate('news')">Neuigkeiten</button>
        <div class="dropdown-wrap">
          <button class="nav-link-btn" id="nav-senioren">Senioren <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>
          <div class="dropdown-menu" id="drop-senioren"></div>
        </div>
        <div class="dropdown-wrap">
          <button class="nav-link-btn" id="nav-junioren">Junioren <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>
          <div class="dropdown-menu" id="drop-junioren"></div>
        </div>
        <button class="nav-link-btn" data-page="training" onclick="navigate('training')">Training</button>
        <button class="nav-link-btn" data-page="abteilungen" onclick="navigate('abteilungen')">Abteilungen</button>
        <button class="nav-link-btn" data-page="verein" onclick="navigate('verein')">Verein</button>
        <button class="nav-link-btn" data-page="kontakt" onclick="navigate('kontakt')">Kontakt</button>
        <button class="nav-link-btn" data-page="downloads" onclick="navigate('downloads')">Downloads</button>
        <button class="nav-link-btn" data-page="vermietung" onclick="navigate('vermietung')">Vermietung</button>
        <a href="https://www.fc-rotblau.de/shop" target="_blank" rel="noopener" class="nav-link-btn">Fanshop <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>
      </div>
      <div class="nav-actions">
        <button class="icon-btn" onclick="navigate('trainer')" title="Trainer-Anmeldung">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        </button>
        <button class="hamburger" id="hamburger-btn" onclick="toggleMobileNav()">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
</header>

<!-- Mobile Nav -->
<div id="mobile-overlay" onclick="closeMobileNav()"></div>
<div id="mobile-nav">
  <div class="mobile-nav-header">
    <span class="menu-label">MENÜ</span>
    <button onclick="closeMobileNav()" class="menu-btn-close">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>
  <div class="mobile-nav-body">
    <button class="mobile-nav-link" onclick="navigate('home');closeMobileNav()">Startseite</button>
    <button class="mobile-nav-link" onclick="navigate('news');closeMobileNav()">Neuigkeiten</button>
    <div class="mobile-nav-section">
      <div class="mobile-nav-section-title">Senioren</div>
      <div id="mobile-senioren-links"></div>
    </div>
    <div class="mobile-nav-section">
      <div class="mobile-nav-section-title">Junioren</div>
      <div id="mobile-junioren-links"></div>
    </div>
    <div class="mobile-nav-section border-top-none">
      <button class="mobile-nav-link" onclick="navigate('training');closeMobileNav()">Training</button>
      <button class="mobile-nav-link" onclick="navigate('abteilungen');closeMobileNav()">Abteilungen</button>
      <button class="mobile-nav-link" onclick="navigate('verein');closeMobileNav()">Verein</button>
      <button class="mobile-nav-link" onclick="navigate('kontakt');closeMobileNav()">Kontakt</button>
      <button class="mobile-nav-link" onclick="navigate('downloads');closeMobileNav()">Downloads</button>
      <button class="mobile-nav-link" onclick="navigate('vermietung');closeMobileNav()">Vermietung</button>
      <a href="https://www.fc-rotblau.de/shop" target="_blank" rel="noopener" class="mobile-nav-link mobile-nav-link-full">Fanshop ↗</a>
    </div>
    <div class="mobile-nav-section">
      <button class="mobile-nav-link" onclick="navigate('trainer');closeMobileNav()" class="mobile-trainer-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Trainer-Anmeldung
      </button>
    </div>
  </div>
</div>

<!-- APP -->
<div id="app">

<!-- HOME PAGE -->
<div id="page-home" class="page active">
  <!-- Hero -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-stripe"></div>
    <div class="hero-glow"></div>
    <!-- Decorative circles -->
    <div class="circle-decor-red-lg"></div>
    <div class="hero-content">
      <div class="max-w-1200">
        <h1 class="hero-h1">Fußball für alle.<span>VfL Wilhelmshaven e. V.</span></h1>
        <p class="hero-desc">Von den Bambini bis zu den Alten Herren. Dein Verein, deine Heimat, deine Mannschaft.</p>
        <div class="hero-btns">
          <button class="btn-red" onclick="navigate('kontakt')">Mitglied werden <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
          <button class="btn-outline" onclick="navigate('team','1-herren')">Unsere Mannschaften</button>
        </div>
      </div>
    </div>
  </section>

  <!-- News -->
  <section class="section bg-bg">
    <div class="section-inner">
      <div class="section-label"><div class="section-label-line"></div><span class="section-label-text">Neuigkeiten</span></div>
      <h2 class="section-title mb-8">Was gibt es Neues?</h2>
      <div class="news-grid" id="home-news"></div>
    </div>
  </section>

  <!-- Events -->
  <section class="events-section">
    <div class="stripe-bg bg-stripe-full"></div>
    <div class="events-inner">
      <div class="hero-header-flex">
        <div>
          <p class="label-red">Kalender</p>
          <h2 class="event-title-lg">Nächste Termine</h2>
        </div>
        <button class="btn-outline btn-sm" onclick="navigate('verein')">Alle Termine</button>
      </div>
      <div class="events-grid" id="home-events"></div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section pt-80">
    <div class="cta-inner">
      <div class="cta-box">
        <div class="cta-circle1"></div><div class="cta-circle2"></div>
        <div class="cta-content">
          <h2 class="cta-h2">Lust auf Fußball?<br>Komm vorbei!</h2>
          <p class="cta-desc">Vereinbare jetzt ein kostenloses Probetraining und lerne unsere Mannschaften kennen.</p>
          <button class="btn-outline" onclick="navigate('kontakt')">Jetzt Probetraining buchen <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
        </div>
      </div>
    </div>
  </section>
</div>

<!-- NEWS OVERVIEW PAGE -->
<div id="page-news" class="page">
  <div class="page-hero">
    <div class="page-hero-glow"></div>
    <div class="page-hero-inner">
      <p class="page-hero-label">Aktuelles</p>
      <h1 class="page-hero-title">Alle Neuigkeiten</h1>
      <p class="page-hero-desc">Bleib auf dem Laufenden – alle News vom VfL Wilhelmshaven e. V..</p>
    </div>
  </div>
  <div class="section">
    <div class="section-inner">
      <div class="news-grid" id="news-overview-grid"></div>
      <div class="text-center-mt32"><button class="btn-outline btn-sm" onclick="navigate('home')">← Zurück zur Startseite</button></div>
    </div>
  </div>
</div>

<!-- TEAM PAGE -->
<div id="page-team" class="page">
  <nav class="breadcrumb">
    <div class="breadcrumb-inner">
      <button class="breadcrumb-link" onclick="navigate('home')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Start</button>
      <span class="breadcrumb-sep">›</span>
      <span id="team-breadcrumb-cat" class="text-bold-blue">Senioren</span>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-current" id="team-breadcrumb-name"></span>
    </div>
  </nav>
  <!-- Team hero -->
  <section class="page-hero" id="team-hero-section">
    <div class="page-hero-glow"></div>
    <div class="hero-stripe-overlay"></div>
    <div class="hero-inner-relative">
      <div class="grid-gap-32-end" id="team-hero-inner"></div>
    </div>
  </section>
  <!-- Tabs for same category -->
  <div class="team-tabs">
    <div class="team-tabs-inner" id="team-tabs"></div>
  </div>
  <!-- Content -->
  <div class="team-layout team-layout-no-bottom" id="team-content"></div>
  <!-- More teams -->
  <section class="bg-white-border-t" style="margin-top:0">
    <div class="container-pad-48">
      <p class="team-more-label" id="team-more-label">Weitere Teams</p>
      <h3 class="team-more-title" id="team-more-title"></h3>
      <div class="grid-auto-220" id="team-more-grid"></div>
    </div>
  </section>
</div>

<!-- TRAINING PAGE -->
<div id="page-training" class="page">
  <div class="page-hero">
    <div class="page-hero-glow"></div>
    <div class="page-hero-inner">
      <p class="page-hero-label">Trainingsbetrieb</p>
      <h1 class="page-hero-title">Training & Spielplan</h1>
      <p class="page-hero-desc">Wann trainieren wir? Wer wann auf welchem Platz?</p>
    </div>
  </div>
  <!-- Filter bar -->
  <div class="sticky-filter-bar">
    <div class="filter-bar-inner">
      <span class="filter-label">Filter:</span>
      <button class="team-tab active" id="filter-all" onclick="setTrainingFilter('all',this)">Alle</button>
      <button class="team-tab" id="filter-senioren" onclick="setTrainingFilter('senioren',this)">Senioren</button>
      <button class="team-tab" id="filter-junioren" onclick="setTrainingFilter('junioren',this)">Junioren</button>
    </div>
  </div>
  <div class="container-pad-48-x">
    <h2 class="section-heading-mb">Wochenübersicht</h2>
    <div class="training-day-grid" id="training-week-grid"></div>
    <h2 class="section-heading-mt-mb">Alle Trainingszeiten im Detail</h2>
    <div class="table-container">
      <table class="data-table" id="training-table">
        <thead><tr><th>Mannschaft</th><th>Tage</th><th>Zeit</th><th>Platz</th><th>Trainer</th></tr></thead>
        <tbody id="training-table-body"></tbody>
      </table>
    </div>
    <h2 class="section-heading-mt-mb">Unsere Sportanlage</h2>
    <div class="grid-auto-260">
      <div class="card p-6"><div class="icon-box-red"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div><h3 class="card-title-impact">Hauptplatz</h3><span class="label-red-small">Naturrasen</span><p class="desc-text">105m × 68m, LED-Flutlicht, Tribüne mit 200 Plätzen</p></div>
      <div class="card p-6"><div class="icon-box-red"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div><h3 class="card-title-impact">Nebenplatz</h3><span class="label-red-small">Kunstrasen</span><p class="desc-text">100m × 64m, LED-Flutlicht, ganzjährig bespielbar</p></div>
      <div class="card p-6"><div class="icon-box-red"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div><h3 class="card-title-impact">Klein- & Minifeld</h3><span class="label-red-small">Kunstrasen</span><p class="desc-text">Für G- bis E-Jugend, hohe Ballfangzäune</p></div>
    </div>
  </div>
</div>

<!-- ABTEILUNGEN -->
<div id="page-abteilungen" class="page">
  <div class="page-hero">
    <div class="page-hero-glow"></div>
    <div class="page-hero-inner">
      <p class="page-hero-label">Unser Verein</p>
      <h1 class="page-hero-title">Abteilungen</h1>
      <p class="page-hero-desc">Der VfL Wilhelmshaven e. V. ist mehr als nur Fußball.</p>
    </div>
  </div>
  <div class="section-inner section-py-custom">
    <div class="abt-grid" id="abt-grid"></div>
  </div>
</div>

<!-- VEREIN -->
<div id="page-verein" class="page">
  <div class="page-hero">
    <div class="page-hero-glow"></div>
    <div class="page-hero-inner">
      <p class="page-hero-label">Über uns</p>
      <h1 class="page-hero-title">Mehr als nur Fußball</h1>
      <p class="page-hero-desc">Seit über 50 Jahren die sportliche Heimat von Wilhelmshaven.</p>
    </div>
  </div>
  <!-- Stats bar -->
  <div class="bg-white-border-b">
    <div class="stats-grid">
      <div class="stat-center"><div class="stat-number">420+</div><div class="stat-label">Mitglieder</div></div>
      <div class="stat-center"><div class="stat-number">11</div><div class="stat-label">Mannschaften</div></div>
      <div class="stat-center"><div class="stat-number">60+</div><div class="stat-label">Ehrenamtliche</div></div>
      <div class="stat-center"><div class="stat-number">1972</div><div class="stat-label">Gegründet</div></div>
    </div>
  </div>
  <div id="verein-content"></div>
</div>

<!-- KONTAKT -->
<div id="page-kontakt" class="page">
  <div class="page-hero">
    <div class="page-hero-glow glow-bottom-auto"></div>
    <div class="page-hero-inner">
      <p class="page-hero-label">Kontakt</p>
      <h1 class="page-hero-title">Schreib uns</h1>
      <p class="page-hero-desc">Probetraining, Mitgliedschaft oder einfach mal vorbeischauen.</p>
    </div>
  </div>
  <!-- Info bar -->
  <div class="contact-info-bar">
    <div class="contact-info-bar-inner">
      <div class="contact-info-item">
        <div class="contact-info-icon red"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
        <div><div class="contact-info-label">Telefon</div><div class="contact-info-val">01234 / 567 890</div><div class="contact-info-sub">Mo-Fr 17-19 Uhr</div></div>
      </div>
      <div class="contact-info-item">
        <div class="contact-info-icon blue"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></div>
        <div><div class="contact-info-label">E-Mail</div><div class="contact-info-val">info@fc-rotblau.de</div><div class="contact-info-sub">Antwort in 2-3 Tagen</div></div>
      </div>
      <div class="contact-info-item">
        <div class="contact-info-icon red"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>
        <div><div class="contact-info-label">Adresse</div><div class="contact-info-val">Musterweg 12</div><div class="contact-info-sub">12345 Wilhelmshaven</div></div>
      </div>
    </div>
  </div>
  <div class="container-pad-48-x">
    <div class="contact-grid">
      <div>
        <div id="contact-success" class="form-success hidden">
          <div class="form-success-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
          <h3 class="success-heading">Vielen Dank!</h3>
          <p class="success-text">Deine Nachricht ist angekommen. Wir melden uns innerhalb von 2-3 Werktagen.</p>
          <button onclick="resetContactForm()" class="btn-link-reset">Weitere Nachricht senden</button>
        </div>
        <div class="form-wrap" id="contact-form-wrap">
          <form id="contact-form" onsubmit="submitContact(event)">
            <div class="form-grid two form-grid-mb">
              <div class="form-field"><label class="form-label">Vorname *</label><input type="text" required class="form-input" placeholder="Max"></div>
              <div class="form-field"><label class="form-label">Nachname *</label><input type="text" required class="form-input" placeholder="Mustermann"></div>
            </div>
            <div class="form-grid two form-grid-mb">
              <div class="form-field"><label class="form-label">E-Mail *</label><input type="email" required class="form-input" placeholder="max@beispiel.de"></div>
              <div class="form-field"><label class="form-label">Telefon</label><input type="tel" class="form-input" placeholder="01234 / 567890"></div>
            </div>
            <div class="form-field form-field-mb">
              <label class="form-label">Anfrage zu</label>
              <select class="form-select"><option>Probetraining</option><option>Mitgliedschaft</option><option>Jugend-Anmeldung</option><option>Sponsoring / Werbung</option><option>Vermietung</option><option>Sonstiges</option></select>
            </div>
            <div class="form-field form-field-mb">
              <label class="form-label">Mannschaft (optional)</label>
              <select class="form-select" id="contact-team-select"><option value="">Keine Angabe</option></select>
            </div>
            <div class="form-field form-field-mb">
              <label class="form-label">Nachricht *</label>
              <textarea required class="form-textarea" rows="5" placeholder="Erzähl uns, was dich interessiert..."></textarea>
            </div>
            <div class="form-checkbox form-checkbox-mb">
              <input type="checkbox" required id="dsgvo">
              <label for="dsgvo">Ich bin damit einverstanden, dass meine Daten zur Bearbeitung gespeichert werden. *</label>
            </div>
            <button type="submit" class="btn-red">Nachricht absenden <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
          </form>
        </div>
      </div>
      <div class="contact-side-flex">
        <div class="promo-box">
          <div class="promo-circle"></div>
          <h4 class="promo-title">⭐ Probetraining</h4>
          <p class="promo-desc">Komm einfach zum nächsten Training deiner Wunschmannschaft. Kostenlos & unverbindlich!</p>
        </div>
        <div class="info-box">
          <h4 class="info-box-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Vereinsbüro</h4>
          <p class="info-box-text">Mo–Fr: 17:00 – 19:00 Uhr<br>Sa: nach Vereinbarung</p>
        </div>
        <div class="info-box">
          <h4 class="info-box-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Vereinsheim</h4>
          <p class="info-box-text">Mo–Fr: 17:00 – 23:00 Uhr<br>Sa–So: ab 12:00 Uhr</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- DOWNLOADS -->
<div id="page-downloads" class="page">
  <div class="page-hero">
    <div class="page-hero-glow glow-bottom-auto"></div>
    <div class="page-hero-inner">
      <p class="page-hero-label">Dokumente</p>
      <h1 class="page-hero-title">Downloads</h1>
      <p class="page-hero-desc">Formulare, Satzungen & Dokumente zum Download.</p>
    </div>
  </div>
  <div class="documents-container">
    <div class="downloads-table-wrap">
      <table class="downloads-table">
        <thead><tr><th>Dokument</th><th class="hidden" style="display:none">§</th><th>Kategorie</th><th>Datum</th><th>Format</th><th>Download</th></tr></thead>
        <tbody id="downloads-tbody"></tbody>
      </table>
    </div>
  </div>
</div>

<!-- VERMIETUNG -->
<div id="page-vermietung" class="page">
  <div class="page-hero">
    <div class="page-hero-glow"></div>
    <div class="page-hero-inner">
      <p class="page-hero-label">Anlagen buchen</p>
      <h1 class="page-hero-title">Vermietung</h1>
      <p class="page-hero-desc">Unsere Räumlichkeiten und Sportanlagen sind für Vereinsmitglieder und externe Mieter buchbar.</p>
    </div>
  </div>
  <div class="facilities-container">
    <div class="facilities-intro">
      <h2 class="section-heading-blue">Verfügbare Flächen</h2>
      <p class="facilities-desc">Alle Räumlichkeiten sind für Vereinsmitglieder und externe Mieter buchbar.</p>
    </div>
    <div class="rental-grid" id="rental-grid"></div>
    <div class="booking-request">
      <h3 class="booking-title">Buchung anfragen</h3>
      <p class="booking-desc">Interesse an einer Buchung? Kontaktiere uns für ein individuelles Angebot.</p>
      <a href="mailto:vermietung@fc-rotblau.de" class="btn-red"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> vermietung@fc-rotblau.de</a>
    </div>
  </div>
</div>

<!-- TRAINER PAGE -->
<div id="page-trainer" class="page">
  <div id="trainer-content"></div>
</div>

</div><!-- end #app -->

<!-- FOOTER -->
<footer id="site-footer">
  <div class="footer-wave">
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0,60 L0,20 Q360,60 720,20 Q1080,-20 1440,20 L1440,60 Z" fill="var(--blue)"/></svg>
  </div>
  <div class="footer-inner">
    <div class="footer-grid">
      <div>
        <div class="footer-social-item">
          <div class="footer-logo-box">FB</div>
          <div><span class="footer-site-name">VfL Wilhelmshaven e. V.</span><span class="footer-site-city">Wilhelmshaven</span></div>
        </div>
        <p class="footer-desc">Fußball für alle – seit 1972. Verein mit über 420 Mitgliedern.</p>
        <div class="footer-contact-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> Musterweg 12, 12345 Wilhelmshaven</div>
        <div class="footer-contact-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> 01234 / 567 890</div>
        <div class="footer-contact-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> info@fc-rotblau.de</div>
      </div>
      <div>
        <h4>Mannschaften</h4>
        <div class="footer-col-links" id="footer-teams-links"></div>
      </div>
      <div>
        <h4>Schnellzugriff</h4>
        <div class="footer-col-links">
          <button class="footer-link" onclick="navigate('training')">Trainingszeiten</button>
          <button class="footer-link" onclick="navigate('abteilungen')">Abteilungen</button>
          <button class="footer-link" onclick="navigate('verein')">Über uns</button>
          <button class="footer-link" onclick="navigate('kontakt')">Kontakt</button>
          <button class="footer-link" onclick="navigate('downloads')">Downloads</button>
          <button class="footer-link" onclick="navigate('vermietung')">Vermietung</button>
          <a href="https://www.fc-rotblau.de/shop" target="_blank" rel="noopener" class="footer-link">Fanshop ↗</a>
        </div>
      </div>
      <div>
        <h4>Nächste Termine</h4>
        <div id="footer-events"></div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© 2026 VfL Wilhelmshaven e. V.. Alle Rechte vorbehalten.</p>
      <div class="footer-legal">
        <button>Impressum</button>
        <button>Datenschutz</button>
        <button>Satzung</button>
      </div>
    </div>
  </div>
</footer>

<!-- Toast -->
<div id="toast" class="toast">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
  <span id="toast-msg">Gespeichert!</span>
</div>

<!-- Idle Modal -->
<div class="modal-overlay" id="idle-modal">
  <div class="modal-box">
    <div class="modal-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
    <h3 class="modal-title">Inaktivität</h3>
    <p class="modal-text">Du wirst automatisch abgemeldet in:</p>
    <div class="modal-timer" id="idle-timer">2:00</div>
    <div class="modal-actions">
      <button class="btn-red" onclick="stayLoggedIn()">Angemeldet bleiben</button>
      <button class="btn-logout" onclick="trainerLogout()">Abmelden</button>
    </div>
  </div>
</div>
</div>
<script src="js/main.js"></script>
<script src="js/app.js"></script>
</body>
</html>
