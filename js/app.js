'use strict';

// ========== DATA ==========
const MONTHS_SHORT = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
const BADGE_COLORS = {Jugend:{bg:'#DBEAFE',c:'#1E40AF'},Senioren:{bg:'#FEE2E2',c:'#B91C1C'},Verein:{bg:'#E0E7FF',c:'#4338CA'},Allgemein:{bg:'#F0FDF4',c:'#166534'},Trainer:{bg:'#FEF3C7',c:'#92400E'}};
const BADGE_ICONS = {Jugend:'⚽',Senioren:'🏟️',Verein:'🏠',Allgemein:'📢',Trainer:'📣'};
const NEWS_IMGS = ['/images/news-1.jpg','/images/news-2.jpg','/images/news-3.jpg'];

// ========== REUSABLE TEMPLATES ==========
function createNewsCard(n, i, onClickHandler) {
  const bc = BADGE_COLORS[n.kategorie] || BADGE_COLORS.Allgemein;
  const imgSrc = n.bildUrl || NEWS_IMGS[i % NEWS_IMGS.length] || '';
  const escapedTitle = esc(n.titel.replace(/'/g, "\\'"));
  return `<article class="card news-card" style="cursor:pointer" onclick="${onClickHandler}('${escapedTitle}')">
    <div class="news-img-wrap">
      <img src="${esc(imgSrc)}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 400 200\\'><rect fill=\\'%23142850\\' width=\\'400\\' height=\\'200\\'></rect><text x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'sans-serif\\' font-size=\\'24\\' fill=\\'white\\'>Neuigkeit</text></svg>'" loading="lazy">
      <div class="news-img-grad"></div>
      <span class="news-badge" style="background:${bc.bg};color:${bc.c}">${esc(n.kategorie)}</span>
      <span class="news-date-badge">${esc(n.datum)}</span>
    </div>
    <div class="news-body">
      <h3 class="news-title">${esc(n.titel)}</h3>
      <p class="news-excerpt">${esc(n.text)}</p>
      <div class="news-footer">
        <span class="news-cat">${BADGE_ICONS[n.kategorie]||'📰'} ${esc(n.kategorie)}</span>
        <span class="news-more">Lesen →</span>
      </div>
    </div>
  </article>`;
}

function createEventCard(e) {
  return `<div class="event-card">
    <div class="event-date-box"><span class="event-day">${dayNum(e.datum)}</span><span class="event-month">${monthShort(e.datum)}</span></div>
    <div class="event-info">
      <div class="event-type">${esc(e.typ)}</div>
      <div class="event-title">${esc(e.titel)}</div>
      <div class="event-location">${esc(e.ort)}</div>
    </div>
  </div>`;
}

function createFooterEventItem(e) {
  return `<div class="footer-event-item">
    <div class="footer-event-date"><span class="footer-event-day">${dayNum(e.datum)}</span><span class="footer-event-mon">${monthShort(e.datum)}</span></div>
    <div class="footer-event-info"><div class="footer-event-title">${esc(e.titel)}</div><div class="footer-event-loc">${esc(e.ort)}</div></div>
  </div>`;
}

function createTeamLinkButton(team, className, onClickFn) {
  const b = document.createElement('button');
  b.className = className;
  b.textContent = team.name;
  b.onclick = onClickFn;
  return b;
}

const TEAMS = [
  {slug:'1-herren',name:'1. Herren',kategorie:'senioren',liga:'Kreisliga A · Staffel 3',altersklasse:'Aktive Herren ab 17 Jahre',trainer:'Thomas Müller',coTrainer:'Stefan Klein',betreuer:'Wolfgang Hartmann',trainingTage:['Dienstag','Donnerstag'],trainingZeit:'19:30 – 21:00 Uhr',trainingsplatz:'Hauptplatz (Naturrasen)',spieltag:'Sonntag',heimspielzeit:'15:00 Uhr',beschreibung:'Unsere erste Mannschaft ist das sportliche Aushängeschild des FC Rot-Blau. Mit Leidenschaft und Teamgeist kämpft das Team seit der Gründung um Punkte in der Kreisliga A.',saisonziel:'Top 5 der Kreisliga A und Pokal-Halbfinale',farbeHeim:'Rot-Blaues Trikot, schwarze Hose',farbeAuswaerts:'Weißes Trikot, weiße Hose',spieleranzahl:23,kapitan:'Markus Hoffmann',highlights:['Pokalsieger Kreispokal 2022','Aufstieg in Kreisliga A 2021','Vize-Meister 2023/24'],tabelle:[{pos:1,team:'Spvgg Oststadt',spiele:17,siege:13,unent:2,niederl:2,tore:'42:18',diff:24,punkte:41},{pos:2,team:'FC Rot-Blau',spiele:17,siege:11,unent:4,niederl:2,tore:'38:19',diff:19,punkte:37,isUs:true},{pos:3,team:'TuS Bergheim',spiele:17,siege:10,unent:3,niederl:4,tore:'35:22',diff:13,punkte:33},{pos:4,team:'SV Eintracht',spiele:17,siege:9,unent:2,niederl:6,tore:'31:28',diff:3,punkte:29},{pos:5,team:'TSV Nordheim',spiele:17,siege:7,unent:5,niederl:5,tore:'26:24',diff:2,punkte:26}],topScorer:[{name:'Patrick Lehmann',tore:14},{name:'Sebastian Berger',tore:9},{name:'Markus Hoffmann',tore:7}],kader:[{nr:1,name:'Felix Wagner',position:'Tor'},{nr:12,name:'Tim Becker',position:'Tor'},{nr:2,name:'Jonas Klein',position:'Abwehr'},{nr:3,name:'Markus Hoffmann (C)',position:'Abwehr'},{nr:4,name:'Daniel Schwarz',position:'Abwehr'},{nr:5,name:'Lukas Roth',position:'Abwehr'},{nr:6,name:'Maximilian Vogt',position:'Mittelfeld'},{nr:7,name:'Sebastian Berger',position:'Mittelfeld'},{nr:8,name:'Tobias Lang',position:'Mittelfeld'},{nr:10,name:'Patrick Lehmann',position:'Sturm'},{nr:11,name:'Christian Beck',position:'Sturm'}]},
  {slug:'2-herren',name:'2. Herren',kategorie:'senioren',liga:'Kreisliga B · Staffel 2',altersklasse:'Aktive Herren ab 17 Jahre',trainer:'Marco Weber',coTrainer:'Daniel Schmid',trainingTage:['Dienstag','Donnerstag'],trainingZeit:'19:30 – 21:00 Uhr',trainingsplatz:'Nebenplatz (Kunstrasen)',spieltag:'Sonntag',heimspielzeit:'13:00 Uhr',beschreibung:'Unsere zweite Mannschaft bietet ambitionierten Fußballern eine sportliche Heimat – als Sprungbrett zur Ersten oder langfristige Heimat mit Spaß am Spiel.',saisonziel:'Mittelfeld der Kreisliga B halten',farbeHeim:'Rot-Blaues Trikot, blaue Hose',farbeAuswaerts:'Weißes Trikot, blaue Hose',spieleranzahl:19,kapitan:'Andreas Bauer',highlights:['Aufstieg in Kreisliga B 2023','Pokal-Halbfinale 2024'],topScorer:[{name:'Niklas Wolf',tore:8},{name:'Andreas Bauer',tore:6}]},
  {slug:'alte-herren',name:'Alte Herren',kategorie:'senioren',liga:'Freundschaftsspiele · AH-Runde',altersklasse:'Herren ab 35 Jahre',trainer:'Klaus Brenner',betreuer:'Hermann Schulze',trainingTage:['Mittwoch'],trainingZeit:'19:00 – 20:30 Uhr',trainingsplatz:'Nebenplatz (Kunstrasen)',spieltag:'Samstag',heimspielzeit:'16:00 Uhr',beschreibung:'Spaß, Fitness und gemütliche dritte Halbzeit – bei den Alten Herren steht Kameradschaft an erster Stelle.',saisonziel:'Spaß, Fitness und gemütliche dritte Halbzeit',farbeHeim:'Rot-blaues Trikot',farbeAuswaerts:'Weißes Trikot',spieleranzahl:18,kapitan:'Bernd Krüger',highlights:['AH-Stadtmeister 2023']},
  {slug:'1-frauen',name:'1. Frauen',kategorie:'senioren',liga:'Kreisliga · Frauen Bezirk Mitte',altersklasse:'Frauen ab 16 Jahre',trainer:'Anna Schneider',coTrainer:'Lisa Hoffmann',betreuer:'Petra Wagner',trainingTage:['Montag','Mittwoch'],trainingZeit:'19:00 – 20:30 Uhr',trainingsplatz:'Hauptplatz (Naturrasen)',spieltag:'Sonntag',heimspielzeit:'14:00 Uhr',beschreibung:'Jung, ambitioniert und mit großem Teamgeist – unsere Frauenmannschaft zeigt Woche für Woche, was drin ist.',saisonziel:'Klassenerhalt sichern und sportliche Weiterentwicklung',farbeHeim:'Rot-blaues Trikot, schwarze Hose',farbeAuswaerts:'Weißes Trikot, schwarze Hose',spieleranzahl:17,kapitan:'Julia Becker',highlights:['Wiederaufstieg in die Kreisliga 2024','Mannschaft des Jahres (Stadtsportbund) 2024'],topScorer:[{name:'Sara Klein',tore:7},{name:'Julia Becker',tore:5}]},
  {slug:'a-jugend',name:'A-Jugend (U19)',kategorie:'junioren',liga:'Kreisliga A · A-Junioren',altersklasse:'Jahrgang 2007 / 2008',trainer:'Michael Braun',coTrainer:'Peter Lang',betreuer:'Uwe Kramer',trainingTage:['Montag','Mittwoch'],trainingZeit:'18:00 – 19:30 Uhr',trainingsplatz:'Nebenplatz (Kunstrasen)',spieltag:'Samstag',heimspielzeit:'13:00 Uhr',beschreibung:'Die älteste Jugendmannschaft – direkter Übergang zum Herrenbereich mit gezielter Förderung junger Talente.',saisonziel:'Aufstieg in die Kreisliga & Integration in Herren',farbeHeim:'Rot-blaues Trikot',farbeAuswaerts:'Weißes Trikot',spieleranzahl:18,kapitan:'Leon Berger',highlights:['Pokal-Viertelfinale 2024','5 Spieler in Herren-Teams befördert'],topScorer:[{name:'Tim Roth',tore:11},{name:'Leon Berger',tore:6}]},
  {slug:'b-jugend',name:'B-Jugend (U17)',kategorie:'junioren',liga:'Kreisliga B · B-Junioren',altersklasse:'Jahrgang 2009 / 2010',trainer:'Jürgen Koch',coTrainer:'Florian Stein',trainingTage:['Dienstag','Donnerstag'],trainingZeit:'18:00 – 19:30 Uhr',trainingsplatz:'Nebenplatz (Kunstrasen)',spieltag:'Samstag',heimspielzeit:'11:00 Uhr',beschreibung:'Taktische Grundlagen und höhere Spielintensität – die B-Jugend bereitet auf die A-Jugend vor.',saisonziel:'Top 3 der Kreisliga',farbeHeim:'Rot-blaues Trikot',farbeAuswaerts:'Weißes Trikot',spieleranzahl:19,kapitan:'Niklas Hahn',highlights:['Hallenmeister Kreis 2025'],topScorer:[{name:'Mats Brandt',tore:9},{name:'Niklas Hahn',tore:7}]},
  {slug:'c-jugend',name:'C-Jugend (U15)',kategorie:'junioren',liga:'Kreisliga · C-Junioren',altersklasse:'Jahrgang 2011 / 2012',trainer:'David Richter',coTrainer:'Tim Wolf',trainingTage:['Dienstag','Donnerstag'],trainingZeit:'17:00 – 18:30 Uhr',trainingsplatz:'Hauptplatz (Naturrasen)',spieltag:'Samstag',heimspielzeit:'09:00 Uhr',beschreibung:'Erstmals auf dem Großfeld 11-gegen-11 – Positionsspiel und Spielintelligenz stehen im Fokus.',saisonziel:'Mittelfeld der Liga und Spaß am Großfeldfußball',farbeHeim:'Rot-blaues Trikot',farbeAuswaerts:'Weißes Trikot',spieleranzahl:20,highlights:['Größtes Junioren-Team','Trainer mit C-Lizenz']},
  {slug:'d-jugend',name:'D-Jugend (U13)',kategorie:'junioren',liga:'Kreisliga · D-Junioren (9er)',altersklasse:'Jahrgang 2013 / 2014',trainer:'Sandra Meier',coTrainer:'Jens Kuhn',trainingTage:['Montag','Mittwoch'],trainingZeit:'17:00 – 18:30 Uhr',trainingsplatz:'Nebenplatz (Kunstrasen)',spieltag:'Samstag',heimspielzeit:'09:00 Uhr',beschreibung:'9-gegen-9 auf dem Kleinfeld – Technik und Schnelligkeit im Mittelpunkt.',saisonziel:'Spielerische Weiterentwicklung',farbeHeim:'Rot-blaues Trikot',farbeAuswaerts:'Weißes Trikot',spieleranzahl:16,highlights:['Erste weibliche Trainerin im Jugendbereich','Hallenturniersieger Stadt 2024']},
  {slug:'e-jugend',name:'E-Jugend (U11)',kategorie:'junioren',liga:'Spielbetrieb · E-Junioren (7er)',altersklasse:'Jahrgang 2015 / 2016',trainer:'Nico Berger',coTrainer:'Kim Fischer',trainingTage:['Freitag'],trainingZeit:'16:00 – 17:30 Uhr',trainingsplatz:'Kleinfeld',spieltag:'Freitag / Samstag',heimspielzeit:'16:00 Uhr',beschreibung:'7-gegen-7 im DFB-Funino-Format – Grundlagen des Mannschaftsspiels und faire Wettkämpfe.',saisonziel:'Spielfreude, Teamgeist und sauberes Passspiel',farbeHeim:'Rot-blaues Trikot',farbeAuswaerts:'Weißes Trikot',spieleranzahl:14,highlights:['Funino-Konzept des DFB','Spielfreundschaft mit FC Hansa']},
  {slug:'f-jugend',name:'F-Jugend (U9)',kategorie:'junioren',liga:'Spielbetrieb · F-Junioren (Funino)',altersklasse:'Jahrgang 2017 / 2018',trainer:'Maria Schulz',coTrainer:'Hannes Voß',trainingTage:['Freitag'],trainingZeit:'15:00 – 16:00 Uhr',trainingsplatz:'Kleinfeld',spieltag:'Samstag',heimspielzeit:'10:00 Uhr',beschreibung:'3-gegen-3 auf vier kleine Tore – Ballgefühl und Spielfreude für unsere Kleinsten.',saisonziel:'Spielen, lachen, lernen!',farbeHeim:'Rot-blaues Trikot',farbeAuswaerts:'Weißes Trikot',spieleranzahl:12,highlights:['Größter F-Jugend-Jahrgang seit 2018','Eltern-Helferrunde gegründet']},
  {slug:'g-jugend',name:'G-Jugend (U7) – Bambini',kategorie:'junioren',liga:'Bambini-Spielnachmittage',altersklasse:'Jahrgang 2019 und jünger',trainer:'Franz Huber',coTrainer:'Eltern-Team',trainingTage:['Mittwoch'],trainingZeit:'15:00 – 16:00 Uhr',trainingsplatz:'Minifeld',spieltag:'Samstag (Bambini-Tag)',heimspielzeit:'11:00 Uhr',beschreibung:'Unsere kleinsten Kicker! Spielerische Bewegung, Koordination und Spaß am Ball – Begleitung durch Eltern willkommen.',saisonziel:'Spaß, Bewegung und erste Freundschaften',farbeHeim:'Mini-Trikot rot-blau',farbeAuswaerts:'Mini-Trikot weiß',spieleranzahl:15,highlights:['Kostenfreie Probenstunden jederzeit','Eltern-Mitmach-Tage jedes Quartal']}
];

const NEWS = [
  {datum:'20.01.2026',titel:'Schnuppertag am 15. März – für alle Altersklassen',text:'Zum Saisonstart laden wir alle Kinder, Jugendliche und Erwachsene zum kostenlosen Probetraining ein. Einfach vorbeikommen!',kategorie:'Allgemein'},
  {datum:'15.01.2026',titel:'15 neue Bambini gestartet – G-Jugend wächst stark',text:'Im Januar kamen allein 15 neue Kinder dazu. Trainer Franz Huber ist begeistert über den Zulauf.',kategorie:'Jugend'},
  {datum:'10.01.2026',titel:'1. Herren: Trainingslager in der Eifel',text:'Neue taktische Impulse und Umschaltspiel – Cheftrainer Thomas Müller ist optimistisch für die Rückrunde.',kategorie:'Senioren'},
  {datum:'05.01.2026',titel:'Jahresversammlung: Vorstand bestätigt',text:'Hans-Peter Krause mit 98% im Amt bestätigt. Stadtwerke Musterstadt sponsert Jugendtrikots.',kategorie:'Verein'},
  {datum:'22.12.2025',titel:'Weihnachtsfeier im Vereinsheim ein voller Erfolg',text:'Über 200 Gäste feierten mit Glühwein, Bratwurst und Tombola. Die Jugend sorgte mit Auftritten für Stimmung.',kategorie:'Verein'},
  {datum:'18.12.2025',titel:'Frauen gewinnen Hallenturnier in Nordheim',text:'Unsere 1. Frauen sicherten sich den Hallencup in Nordheim mit drei Siegen und einem Unentschieden.',kategorie:'Senioren'},
  {datum:'12.12.2025',titel:'E-Jugend siegt beim Funino-Spieltag',text:'Beim Funino-Spieltag in Bergheim konnte unsere E-Jugend alle vier Partien gewinnen. Klasse Leistung!',kategorie:'Jugend'},
  {datum:'05.12.2025',titel:'Neue LED-Flutlichtanlage in Betrieb genommen',text:'Nach Umbau leuchtet der Nebenplatz heller als je zuvor. Energieeinsparung von 40% gegenüber den alten Strahlern.',kategorie:'Verein'},
  {datum:'28.11.2025',titel:'A-Jugend verliert Pokal-Krimi erst im Elfmeterschießen',text:'Nach 90 packenden Minuten und 2:2 unterlag unsere A-Jugend im Kreispokal-Viertelfinale erst vom Punkt.',kategorie:'Jugend'}
];

const EVENTS = [
  {datum:'15.03.2026',titel:'Saisonstart Frühjahr 2026',ort:'Sportanlage Musterweg',typ:'Spielbetrieb'},
  {datum:'22.03.2026',titel:'Osterfußballturnier (Jugend)',ort:'Hauptplatz',typ:'Turnier'},
  {datum:'01.04.2026',titel:'Schnuppertag für neue Spieler',ort:'Sportanlage Musterweg',typ:'Verein'},
  {datum:'10.05.2026',titel:'Vereinsfest & Hall of Fame',ort:'Vereinsheim',typ:'Verein'},
  {datum:'20.06.2026',titel:'Sommerabschlussturnier',ort:'Hauptplatz',typ:'Turnier'},
  {datum:'12.07.2026',titel:'Saisonabschlussfeier',ort:'Vereinsheim',typ:'Verein'}
];

const ABTEILUNGEN = [
  {name:'Fußball',beschreibung:'Von der G-Jugend bis zu den Senioren – unser größter Bereich mit zahlreichen Mannschaften.',emoji:'⚽',farbe:'var(--red)',isExternal:false},
  {name:'Schwimmen',beschreibung:'Wettkampf- und Freizeitschwimmen für alle Altersgruppen.',emoji:'🏊',farbe:'#0EA5E9',isExternal:false},
  {name:'Inlinehockey',beschreibung:'Schnelles Spiel auf Rollen – die Jade Warriors sind unsere Inlinehockey-Mannschaft.',emoji:'🏒',farbe:'#7C3AED',link:'https://www.jadewarriors.de',isExternal:true},
  {name:'Leichtathletik',beschreibung:'Laufen, Springen, Werfen – Leichtathletik in der Leichtathletikgemeinschaft Wilhelmshaven.',emoji:'🏃',farbe:'#059669',link:'https://www.lg-whv.de',isExternal:true},
  {name:'Tennis',beschreibung:'Tennis für Freizeitspieler und Aktive im Verein.',emoji:'🎾',farbe:'var(--blue)',isExternal:false}
];

const DOWNLOADS = [
  {name:'Vereinssatzung 2026',kategorie:'Satzung',datum:'Jan. 2026',format:'PDF'},
  {name:'Aufnahmeantrag',kategorie:'Formulare',datum:'Jan. 2026',format:'PDF'},
  {name:'SEPA-Lastschriftmandat',kategorie:'Formulare',datum:'Jan. 2026',format:'PDF'},
  {name:'Trainingskonzept Jugend',kategorie:'Konzepte',datum:'Jan. 2026',format:'PDF'},
  {name:'Hausordnung',kategorie:'Hausordnung',datum:'Jan. 2026',format:'PDF'},
  {name:'Austrittsformular',kategorie:'Formulare',datum:'Jan. 2026',format:'PDF'}
];

const VERMIETUNG = [
  {name:'Vereinsheim – Großer Saal',typ:'Veranstaltungsraum',beschreibung:'Bis zu 120 Personen, Bühne, Bar, Theke, eigener Zugang. Ideal für Feste, Geburtstage, Vereinstreffen.',preis:'80 € / Std.',kapazitaet:'bis 120 Pers.',emoji:'🏠'},
  {name:'Vereinsheim – Clubraum',typ:'Besprechungsraum',beschreibung:'Bis zu 25 Personen, Beamer, Whiteboard, WLAN. Ideal für Schulungen, AGs, kleinere Events.',preis:'30 € / Std.',kapazitaet:'bis 25 Pers.',emoji:'🤝'},
  {name:'Hauptplatz (Naturrasen)',typ:'Sportplatz',beschreibung:'105m × 68m, LED-Flutlicht, 200 Sitzplätze Tribüne. Für Turniere, Schul-AGs, Firmenfußball.',preis:'150 € / Tag',kapazitaet:'Turniere möglich',emoji:'⚽'},
  {name:'Nebenplatz (Kunstrasen)',typ:'Sportplatz',beschreibung:'100m × 64m, LED-Flutlicht, ganzjährig bespielbar.',preis:'120 € / Tag',kapazitaet:'Turniere möglich',emoji:'🏟️'},
  {name:'Kleinfeld / Minifeld',typ:'Kleinfeld',beschreibung:'Kunstrasen mit Ballfangzäunen. Perfekt für Kindergeburtstage, Schul-AGs, kleine Turniere.',preis:'60 € / Tag',kapazitaet:'bis 30 Kinder',emoji:'🥅'},
  {name:'Vereinsgaststätte – Terrasse',typ:'Terrasse',beschreibung:'Überdachte Terrasse mit Blick auf den Platz. Für grillen, Sommerfeste, private Feiern.',preis:'40 € / Std.',kapazitaet:'bis 50 Pers.',emoji:'🍺'}
];

const SENIOREN = TEAMS.filter(t => t.kategorie==='senioren');
const JUNIOREN = TEAMS.filter(t => t.kategorie==='junioren');

// ========== UTILITIES ==========
function esc(str){const d=document.createElement('div');d.textContent=str;return d.innerHTML}
function monthShort(datum){const m=parseInt(datum.split('.')[1],10);return MONTHS_SHORT[m-1]||''}
function dayNum(datum){return datum.split('.')[0]}
function sanitize(s){return typeof s!=='string'?'':s.replace(/[\u0000-\u001F\u007F]/g,'').replace(/javascript\s*:/gi,'').trim().slice(0,2000)}
function sanitizeUrl(url){if(!url||typeof url!=='string')return'';if(url.startsWith('data:image/'))return url;try{const u=new URL(url);if(u.protocol!=='https:'&&u.protocol!=='http:')return'';if(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url))return url;return'';}catch{return''}}

// ========== ROUTING ==========
let currentPage = 'home';
let currentTeamSlug = '';

function navigate(page, param=''){
  currentPage = page;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link-btn').forEach(b=>{b.classList.toggle('active', b.dataset.page===page)});
  if(page==='team'){
    currentTeamSlug = param || TEAMS[0].slug;
    renderTeamPage(currentTeamSlug);
    document.getElementById('page-team').classList.add('active');
  } else if(page==='news'){
    renderNewsOverview();
    document.getElementById('page-news').classList.add('active');
  } else {
    const el = document.getElementById('page-'+page);
    if(el) el.classList.add('active');
    if(page==='trainer') renderTrainerPage();
    if(page==='verein') renderVereinPage();
  }
  window.scrollTo({top:0,behavior:'smooth'});
  updateNavActive(page, param);
}

function updateNavActive(page, param){
  document.querySelectorAll('.nav-link-btn').forEach(b=>{
    const isTeam = page==='team';
    const isTeamActive = isTeam && (param===b.dataset.slug);
    b.classList.toggle('active', b.dataset.page===page || isTeamActive);
  });
  // highlight senioren/junioren nav btn
  const isSen = page==='team' && SENIOREN.some(t=>t.slug===param);
  const isJun = page==='team' && JUNIOREN.some(t=>t.slug===param);
  document.getElementById('nav-senioren').classList.toggle('active', isSen);
  document.getElementById('nav-junioren').classList.toggle('active', isJun);
  // Highlight mobile nav links
  document.querySelectorAll('.mobile-nav-link').forEach(b=>{
    b.classList.toggle('active', b.textContent.includes(page==='home'?'Startseite':page==='news'?'Neuigkeiten':page==='training'?'Training':page==='abteilungen'?'Abteilungen':page==='verein'?'Verein':page==='kontakt'?'Kontakt':page==='downloads'?'Downloads':page==='vermietung'?'Vermietung':''));
  });
}

// ========== HEADER ==========
window.addEventListener('scroll',()=>{
  document.getElementById('site-header').classList.toggle('scrolled', window.scrollY>20);
});

// Mobile nav
function toggleMobileNav(){document.getElementById('mobile-nav').classList.toggle('open');document.getElementById('mobile-overlay').classList.toggle('open')}
function closeMobileNav(){document.getElementById('mobile-nav').classList.remove('open');document.getElementById('mobile-overlay').classList.remove('open')}

// ========== DROPDOWNS BUILD ==========
function buildDropdowns(){
  const dropSen = document.getElementById('drop-senioren');
  const dropJun = document.getElementById('drop-junioren');
  const mobSen = document.getElementById('mobile-senioren-links');
  const mobJun = document.getElementById('mobile-junioren-links');
  
  // Helper to create team buttons with consistent pattern
  const addTeamButtons = (teams, container, className, onClick) => {
    teams.forEach(t => {
      const b = createTeamLinkButton(t, className, onClick);
      container.appendChild(b);
    });
  };
  
  SENIOREN.forEach(t=>{
    const b=createTeamLinkButton(t,'dropdown-item',()=>navigate('team',t.slug));dropSen.appendChild(b);
    const m=createTeamLinkButton(t,'mobile-sub-link',()=>{navigate('team',t.slug);closeMobileNav()});mobSen.appendChild(m);
  });
  JUNIOREN.forEach(t=>{
    const b=createTeamLinkButton(t,'dropdown-item',()=>navigate('team',t.slug));dropJun.appendChild(b);
    const m=createTeamLinkButton(t,'mobile-sub-link',()=>{navigate('team',t.slug);closeMobileNav()});mobJun.appendChild(m);
  });
  // Footer team links
  const ftl=document.getElementById('footer-teams-links');
  const senH=document.createElement('p');senH.style.cssText='font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:rgba(147,197,253,.7);margin-bottom:8px;margin-top:4px';senH.textContent='Senioren';ftl.appendChild(senH);
  addTeamButtons(SENIOREN, ftl, 'footer-link', t=>navigate('team',t.slug));
  const junH=document.createElement('p');junH.style.cssText='font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:rgba(147,197,253,.7);margin-bottom:8px;margin-top:12px';junH.textContent='Junioren';ftl.appendChild(junH);
  addTeamButtons(JUNIOREN.slice(0,4), ftl, 'footer-link', t=>navigate('team',t.slug));
  // Contact team select - keep inline for simplicity (different element type)
  const sel=document.getElementById('contact-team-select');
  const og1=document.createElement('optgroup');og1.label='Senioren';SENIOREN.forEach(t=>{const o=document.createElement('option');o.textContent=t.name;og1.appendChild(o)});sel.appendChild(og1);
  const og2=document.createElement('optgroup');og2.label='Junioren';JUNIOREN.forEach(t=>{const o=document.createElement('option');o.textContent=t.name;og2.appendChild(o)});sel.appendChild(og2);
}

// ========== HOME PAGE ==========
function renderHome(){
  // News - using reusable template
  const ng=document.getElementById('home-news');
  const allNews=getNewsWithTrainer();
  const top6News=allNews.slice(0,6);
  ng.innerHTML=top6News.map((n,i)=>createNewsCard(n,i,'showNewsOverview')).join('');
  // Add "Mehr Neuigkeiten" button
  ng.innerHTML += `<div style="grid-column:1/-1;text-align:center;margin-top:24px"><button class="btn-red btn-sm" onclick="showNewsOverview()">Alle Neuigkeiten ansehen</button></div>`;
  // Events - using reusable template
  const eg=document.getElementById('home-events');
  eg.innerHTML=EVENTS.map(e=>createEventCard(e)).join('');
  // Footer events - using reusable template
  const fe=document.getElementById('footer-events');
  fe.innerHTML=EVENTS.slice(0,3).map(e=>createFooterEventItem(e)).join('');
}

function getNewsWithTrainer(){
  const all=[...NEWS];
  try{
    const edits=JSON.parse(localStorage.getItem('fc_trainer_edits')||'{}');
    for(const [slug,data] of Object.entries(edits)){
      const team=TEAMS.find(t=>t.slug===slug);
      if(!data||!Array.isArray(data.news))continue;
      for(const n of data.news){
        if(!n||!n.titel||!n.text)continue;
        all.push({titel:sanitize(n.titel),text:sanitize(n.text),datum:n.datum||'',kategorie:'Trainer',bildUrl:n.bildUrl?sanitizeUrl(n.bildUrl):undefined,teamSlug:slug,teamName:team?.name||slug});
      }
    }
  }catch(e){}
  return all.sort((a,b)=>{
    const da=a.datum.split('.').reverse().join('');
    const db=b.datum.split('.').reverse().join('');
    return db.localeCompare(da);
  });
}

// ========== NEWS OVERVIEW ==========
function showNewsOverview(){
  navigate('news');
}

function renderNewsOverview(){
  const grid=document.getElementById('news-overview-grid');
  const allNews=getNewsWithTrainer();
  // Using reusable template with openNewsDetail handler
  grid.innerHTML=allNews.map((n,i)=>createNewsCard(n,i,'openNewsDetail')).join('');
}

function openNewsDetail(titel){
  const allNews=getNewsWithTrainer();
  const news=allNews.find(n=>n.titel===titel);
  if(!news)return;
  const modal=document.createElement('div');
  modal.className='modal-open';
  modal.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
  const bc=BADGE_COLORS[news.kategorie]||BADGE_COLORS.Allgemein;
  const imgSrc = news.bildUrl || NEWS_IMGS[0] || '';
  modal.innerHTML=`
    <div style="background:#fff;border-radius:20px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.3);">
      <button onclick="this.closest('.modal-open').remove()" style="position:absolute;top:16px;right:16px;background:rgba(0,0,0,.5);border:none;border-radius:50%;width:40px;height:40px;color:#fff;cursor:pointer;font-size:20px;z-index:10;">&times;</button>
      ${imgSrc?`<img src="${esc(imgSrc)}" style="width:100%;height:250px;object-fit:cover;border-radius:20px 20px 0 0;" alt="">`:''}
      <div style="padding:32px;">
        <span style="font-size:10px;font-weight:700;padding:4px 12px;border-radius:50px;background:${bc.bg};color:${bc.c};text-transform:uppercase;letter-spacing:.1em;">${esc(news.kategorie)}</span>
        <h2 style="font-family:Impact,sans-serif;font-size:24px;color:var(--blue);margin:16px 0 8px;text-transform:uppercase;">${esc(news.titel)}</h2>
        <p style="font-size:12px;color:#9ca3af;margin-bottom:24px;">${esc(news.datum)} ${news.teamName?'• '+esc(news.teamName):''}</p>
        <div style="font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;">${esc(news.text)}</div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
function getTeamEdits(slug){
  try{
    const edits=JSON.parse(localStorage.getItem('fc_trainer_edits')||'{}');
    const d=edits[slug];
    if(!d)return null;
    return {
      beschreibung:d.beschreibung?sanitize(d.beschreibung):undefined,
      trainingZeit:d.trainingZeit?sanitize(d.trainingZeit):undefined,
      trainingTage:d.trainingTage?sanitize(d.trainingTage):undefined,
      trainingsplatz:d.trainingsplatz?sanitize(d.trainingsplatz):undefined,
      fotoUrl:d.fotoUrl?sanitizeUrl(d.fotoUrl):undefined,
      news:Array.isArray(d.news)?d.news.slice(0,30).map(n=>({titel:sanitize(n.titel),text:sanitize(n.text),datum:n.datum||'',bildUrl:n.bildUrl?sanitizeUrl(n.bildUrl):undefined})).filter(n=>n.titel&&n.text):[],
    };
  }catch(e){return null}
}

function renderTeamPage(slug){
  const team=TEAMS.find(t=>t.slug===slug);
  if(!team)return;
  const isSen=team.kategorie==='senioren';
  const peers=isSen?SENIOREN:JUNIOREN;
  const edits=getTeamEdits(slug)||{};
  const desc=edits.beschreibung||team.beschreibung;
  const trainingZeit=edits.trainingZeit||team.trainingZeit;
  const trainingTage=edits.trainingTage||team.trainingTage.join(' & ');
  const trainingsplatz=edits.trainingsplatz||team.trainingsplatz;
  const fotoUrl=edits.fotoUrl||(isSen?'/images/team-senioren.jpg':'/images/team-junioren.jpg');
  const teamNews=edits.news||[];
  // Breadcrumb
  document.getElementById('team-breadcrumb-cat').textContent=isSen?'Senioren':'Junioren';
  document.getElementById('team-breadcrumb-name').textContent=team.name;
  // Hero
  document.getElementById('team-hero-inner').innerHTML=`
    <div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <span style="display:inline-flex;align-items:center;gap:6px;border-radius:50px;background:var(--red);padding:3px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:#fff">${isSen?'Senioren':'Junioren'}</span>
        <span style="font-size:11px;font-weight:600;color:rgba(190,219,255,.8);text-transform:uppercase;letter-spacing:.1em">${esc(team.altersklasse)}</span>
      </div>
      <h1 style="font-family:Impact,sans-serif;font-size:clamp(40px,6vw,72px);color:#fff;text-transform:uppercase;line-height:.95;margin-bottom:12px">${esc(team.name)}</h1>
      <p style="color:rgba(190,219,255,.9);font-size:17px;margin-bottom:16px">${esc(team.liga)}</p>
      <p style="color:rgba(190,219,255,.8);font-size:15px;max-width:600px;line-height:1.6">${esc(desc)}</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;min-width:260px">
      <div style="background:rgba(255,255,255,.1);backdrop-filter:blur(4px);border-radius:16px;padding:16px;border:1px solid rgba(255,255,255,.1)">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(190,219,255,.8)">Spieler</div>
        <div style="font-family:Impact,sans-serif;font-size:36px;color:#fff;font-weight:700">${team.spieleranzahl}</div>
      </div>
      <div style="background:rgba(255,255,255,.1);backdrop-filter:blur(4px);border-radius:16px;padding:16px;border:1px solid rgba(255,255,255,.1)">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(190,219,255,.8)">Spieltag</div>
        <div style="font-family:Impact,sans-serif;font-size:22px;color:#fff;font-weight:700">${esc(team.heimspielzeit)}</div>
        <div style="font-size:11px;color:rgba(190,219,255,.7);margin-top:2px">${esc(team.spieltag)}</div>
      </div>
      <div style="background:rgba(255,255,255,.1);backdrop-filter:blur(4px);border-radius:16px;padding:16px;border:1px solid rgba(255,255,255,.1);grid-column:span 2">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(190,219,255,.8);margin-bottom:4px">Trainer</div>
        <div style="color:#fff;font-weight:700;font-size:16px">${esc(team.trainer)}</div>
        ${team.coTrainer?`<div style="font-size:12px;color:rgba(190,219,255,.7)">Co-Trainer: ${esc(team.coTrainer)}</div>`:''}
      </div>
    </div>`;
  // Tabs
  const tabs=document.getElementById('team-tabs');
  tabs.innerHTML=`<span class="team-tab-label">${isSen?'Senioren':'Junioren'}:</span>`+
    peers.map(t=>`<button class="team-tab ${t.slug===slug?'active':''}" onclick="navigate('team','${t.slug}')">${esc(t.name)}</button>`).join('');
  // Main content
  const main=document.getElementById('team-content');
  main.innerHTML=`
    <div class="team-main">
      <!-- Photo -->
      <div class="info-card" style="overflow:hidden">
        <div style="position:relative;height:280px;overflow:hidden">
          <img src="${esc(fotoUrl)}" alt="Mannschaftsfoto ${esc(team.name)}" style="width:100%;height:100%;object-fit:cover"
            onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 800 300\\'><rect fill=\\'%23142850\\' width=\\'800\\' height=\\'300\\'></rect><text x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'sans-serif\\' font-size=\\'32\\' fill=\\'white\\'>Mannschaftsfoto</text></svg>'" loading="lazy">
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6),transparent,transparent)"></div>
          <div style="position:absolute;bottom:20px;left:20px">
            <span style="display:inline-block;background:var(--red);border-radius:50px;padding:3px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:#fff;margin-bottom:8px">Mannschaftsfoto</span>
            <h2 style="font-family:Impact,sans-serif;font-size:24px;color:#fff;text-transform:uppercase">${esc(team.name)} 2025/26</h2>
            <p style="color:rgba(255,255,255,.8);font-size:12px">FC Rot-Blau Musterstadt · ${isSen?'Senioren':'Junioren'}</p>
          </div>
        </div>
      </div>
      <!-- Über die Mannschaft -->
      <div class="info-card">
        <div class="info-card-header"><h3 class="info-card-title">👥 Über die Mannschaft</h3></div>
        <div class="info-card-body">
          <p style="color:#6b7280;line-height:1.7;margin-bottom:24px">${esc(desc)}</p>
          <div class="stats-row">
            <div class="stat-box"><div class="stat-num">${team.spieleranzahl}</div><div class="stat-label">Spieler</div></div>
            <div class="stat-box"><div class="stat-num">${team.trainingTage.length}</div><div class="stat-label">Trainingstage/Woche</div></div>
            <div class="stat-box"><div class="stat-num red">${team.naechsteSpiele?team.naechsteSpiele.length:3}</div><div class="stat-label">Anstehende Spiele</div></div>
          </div>
        </div>
      </div>
      ${teamNews.length>0?`
      <!-- Mannschafts-News -->
      <div class="info-card">
        <div class="info-card-header"><h3 class="info-card-title">⭐ Aus der Mannschaft</h3></div>
        <div style="divide-y">
          ${teamNews.slice().reverse().map(n=>`<div style="border-top:1px solid rgba(239,246,255,.8)">
            ${n.bildUrl?`<img src="${esc(n.bildUrl)}" alt="${esc(n.titel)}" style="width:100%;height:160px;object-fit:cover" onerror="this.style.display='none'">`:''} 
            <div style="padding:20px 24px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:50px;background:rgba(219,234,254,.8);color:var(--blue);text-transform:uppercase">Mannschafts-News</span>
                <span style="font-size:12px;color:#9ca3af">${esc(n.datum)}</span>
              </div>
              <h4 style="font-weight:700;color:var(--blue);margin-bottom:4px">${esc(n.titel)}</h4>
              <p style="font-size:13px;color:#6b7280;line-height:1.6">${esc(n.text)}</p>
            </div>
          </div>`).join('')}
        </div>
      </div>`:''} 
      <!-- Training & Spielbetrieb -->
      <div class="info-card">
        <div class="info-card-header"><h3 class="info-card-title">📅 Trainingszeiten & Spielbetrieb</h3></div>
        <div style="display:grid;grid-template-columns:1fr;gap:0">
          <div style="padding:24px;border-bottom:1px solid rgba(239,246,255,.8)">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--red);margin-bottom:12px">Training</div>
            <div style="display:flex;flex-direction:column;gap:10px;font-size:13px">
              <div style="display:flex;justify-content:space-between"><span style="color:#9ca3af">Wochentag(e)</span><span style="font-weight:600;color:#374151">${esc(trainingTage)}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#9ca3af">Uhrzeit</span><span style="font-weight:600;color:#374151">${esc(trainingZeit)}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#9ca3af">Platz</span><span style="font-weight:600;color:#374151">${esc(trainingsplatz)}</span></div>
            </div>
          </div>
          <div style="padding:24px">
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--red);margin-bottom:12px">Spielbetrieb</div>
            <div style="display:flex;flex-direction:column;gap:10px;font-size:13px">
              <div style="display:flex;justify-content:space-between"><span style="color:#9ca3af">Liga</span><span style="font-weight:600;color:#374151">${esc(team.liga)}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#9ca3af">Spieltag</span><span style="font-weight:600;color:#374151">${esc(team.spieltag)}</span></div>
              <div style="display:flex;justify-content:space-between"><span style="color:#9ca3af">Heimspielzeit</span><span style="font-weight:600;color:#374151">${esc(team.heimspielzeit)}</span></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Saisonziele -->
      <div style="border-radius:16px;padding:32px;color:#fff;position:relative;overflow:hidden;background:linear-gradient(135deg,var(--red),var(--red-dark))">
        <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,.1)"></div>
        <div style="position:relative">
          <h3 style="font-family:Impact,sans-serif;font-size:24px;text-transform:uppercase;margin-bottom:12px">Unsere Saisonziele</h3>
          <p style="color:rgba(255,255,255,.85);line-height:1.6;margin-bottom:16px">${esc(team.saisonziel)}</p>
          ${team.highlights&&team.highlights.length?team.highlights.map(h=>`<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,.9);margin-bottom:8px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>${esc(h)}</div>`).join(''):''}
        </div>
      </div>
      ${team.tabelle?`
      <!-- Tabelle -->
      <div class="info-card">
        <div class="info-card-header"><h3 class="info-card-title">📊 Tabellenstand</h3></div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr><th>#</th><th>Team</th><th>Sp.</th><th>S</th><th>U</th><th>N</th><th>Tore</th><th>Diff</th><th>Pkt</th></tr></thead>
            <tbody>${team.tabelle.map(r=>`<tr class="${r.isUs?'is-us':''}">
              <td>${r.pos}</td><td class="name">${esc(r.team)}</td><td>${r.spiele}</td><td>${r.siege}</td><td>${r.unent}</td><td>${r.niederl}</td><td>${esc(r.tore)}</td><td>${r.diff>0?'+'+r.diff:r.diff}</td><td><strong>${r.punkte}</strong></td>
            </tr>`).join('')}</tbody>
          </table>
        </div>
      </div>`:''}
      ${team.topScorer?`
      <!-- Top Scorer -->
      <div class="info-card">
        <div class="info-card-header"><h3 class="info-card-title">⚽ Torschützen</h3></div>
        <div class="info-card-body" style="display:flex;flex-direction:column;gap:12px">
          ${team.topScorer.map((s,i)=>`<div style="display:flex;align-items:center;gap:12px">
            <div style="width:32px;height:32px;border-radius:50%;background:${i===0?'var(--red)':i===1?'var(--blue)':'#9ca3af'};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px">${i+1}</div>
            <span style="flex:1;font-weight:600;color:var(--blue)">${esc(s.name)}</span>
            <span style="font-family:Impact,sans-serif;font-size:20px;color:var(--red)">${s.tore}</span>
            <span style="font-size:12px;color:#9ca3af">Tore</span>
          </div>`).join('')}
        </div>
      </div>`:''}
      ${team.kader?`
      <!-- Kader -->
      <div class="info-card">
        <div class="info-card-header"><h3 class="info-card-title">👥 Kader 2025/26</h3></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
          ${['Tor','Abwehr','Mittelfeld','Sturm'].map(pos=>{
            const pl=team.kader.filter(p=>p.position===pos);
            return pl.length?`<div class="position-group" style="border-top:1px solid rgba(239,246,255,.8)">
              <div class="position-title">${pos}</div>
              ${pl.map(p=>`<div class="player-item"><div class="player-nr">${p.nr}</div><span class="player-name">${esc(p.name)}</span></div>`).join('')}
            </div>`:'';
          }).join('')}
        </div>
      </div>`:''}
    </div>
    <div class="team-sidebar">
      <!-- Trainerstab -->
      <div class="info-card">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--red);margin-bottom:12px;padding:16px 20px 0">Trainerstab</div>
        <div style="padding:0 20px 16px;display:flex;flex-direction:column;gap:12px">
          ${renderTrainerCard(team.trainer,'Cheftrainer',true)}
          ${team.coTrainer?renderTrainerCard(team.coTrainer,'Co-Trainer',false):''}
          ${team.betreuer?renderTrainerCard(team.betreuer,'Betreuer',false):''}
          ${team.kapitan?renderTrainerCard(team.kapitan,'Mannschaftskapitän',false):''}
        </div>
      </div>
      <!-- Schnellinfo -->
      <div class="info-card">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--red);margin-bottom:16px;padding:16px 20px 0">Schnellinfo</div>
        <div style="padding:0 20px 16px">
          ${[['Altersklasse',team.altersklasse],['Kategorie',team.kategorie==='senioren'?'Senioren':'Junioren'],['Spieler',String(team.spieleranzahl)],['Heim',team.farbeHeim],['Auswärts',team.farbeAuswaerts]].map(([l,v])=>`<div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(239,246,255,.8);padding:10px 0;font-size:13px"><span style="color:#9ca3af">${esc(l)}</span><span style="font-weight:600;color:#374151;font-size:12px;text-align:right;max-width:60%">${esc(v)}</span></div>`).join('')}
        </div>
      </div>
      <!-- Anfahrt -->
      <div style="background:var(--blue);border-radius:16px;padding:24px;color:#fff;position:relative;overflow:hidden">
        <div style="position:absolute;top:-40px;right:-40px;width:128px;height:128px;border-radius:50%;background:rgba(255,255,255,.05)"></div>
        <div style="position:relative">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--red);margin-bottom:8px">Anfahrt zum Training</div>
          <p style="font-family:Impact,sans-serif;font-size:18px;font-weight:700;margin-bottom:8px">Sportanlage am Musterweg</p>
          <p style="color:rgba(190,219,255,.8);font-size:13px;line-height:1.7">Musterweg 12, 12345 Musterstadt<br>${esc(trainingTage)}, ${esc(trainingZeit)}<br>Platz: ${esc(trainingsplatz)}</p>
          <p style="color:rgba(190,219,255,.6);font-size:12px;margin-top:8px">Parkplätze am Vereinsheim. Linie 42 bis „Sportplatz".</p>
        </div>
      </div>
      <!-- CTA -->
      <div style="background:linear-gradient(135deg,var(--red),var(--red-dark));border-radius:16px;padding:24px;color:#fff;position:relative;overflow:hidden">
        <div style="position:absolute;top:-40px;right:-40px;width:128px;height:128px;border-radius:50%;background:rgba(255,255,255,.1)"></div>
        <div style="position:relative">
          <h4 style="font-family:Impact,sans-serif;font-size:22px;text-transform:uppercase;margin-bottom:8px">Lust mitzuspielen?</h4>
          <p style="color:rgba(255,255,255,.8);font-size:13px;line-height:1.6;margin-bottom:16px">Komm zum kostenlosen Probetraining – alle willkommen!</p>
          <button class="btn-outline btn-sm" onclick="navigate('kontakt')">Jetzt melden</button>
        </div>
      </div>
      <!-- Mitglied -->
      <div class="info-card">
        <div style="padding:20px">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--red);margin-bottom:8px">Mitglied werden</div>
          <h4 style="font-weight:700;color:var(--blue);margin-bottom:8px">Beiträge</h4>
          <p style="font-size:12px;color:#6b7280;line-height:1.8">Jugendliche (bis 18): <strong>60 €/Jahr</strong><br>Erwachsene: <strong>120 €/Jahr</strong><br>Familien: <strong>200 €/Jahr</strong><br>Geschwisterkinder erhalten 25 % Rabatt.</p>
        </div>
      </div>
    </div>`;
  // More teams
  document.getElementById('team-more-label').textContent='Weitere Teams';
  document.getElementById('team-more-title').textContent=isSen?'Senioren-Mannschaften':'Junioren-Mannschaften';
  document.getElementById('team-more-grid').innerHTML=peers.filter(t=>t.slug!==slug).map(t=>`<button onclick="navigate('team','${t.slug}')" style="text-align:left;background:#fff;border-radius:16px;border:1px solid rgba(219,234,254,.5);padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.1);transition:all .3s;cursor:pointer" onmouseover="this.style.boxShadow='0 16px 32px rgba(20,40,80,.15)';this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.1)';this.style.transform=''">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--red);margin-bottom:4px">${esc(t.altersklasse)}</div>
    <h4 style="font-family:Impact,sans-serif;font-size:18px;color:var(--blue)">${esc(t.name)}</h4>
    <p style="font-size:12px;color:#9ca3af;margin-top:4px">${esc(t.liga)}</p>
    <span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:700;color:var(--red);margin-top:12px">Zur Mannschaft →</span>
  </button>`).join('');
}

function renderTrainerCard(name,role,main){
  const initials=name.split(' ').filter(n=>!n.startsWith('(')).map(n=>n[0]).join('').slice(0,2).toUpperCase();
  return `<div style="display:flex;align-items:center;gap:12px">
    <div style="width:40px;height:40px;border-radius:50%;background:${main?'var(--red)':'var(--blue)'};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">${initials}</div>
    <div style="min-width:0"><div style="font-weight:600;font-size:13px;color:#374151">${esc(name)}</div><div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em">${esc(role)}</div></div>
  </div>`;
}

// ========== TRAINING PAGE ==========
let trainingFilter='all';
function setTrainingFilter(f,btn){
  trainingFilter=f;
  document.querySelectorAll('#page-training .team-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderTraining();
}

function renderTraining(){
  const teams=TEAMS.filter(t=>trainingFilter==='all'||t.kategorie===trainingFilter);
  const days=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag'];
  const byDay={};days.forEach(d=>byDay[d]=[]);
  teams.forEach(t=>t.trainingTage.forEach(d=>{if(byDay[d])byDay[d].push(t)}));
  document.getElementById('training-week-grid').innerHTML=days.map(d=>`<div class="training-day-card">
    <div class="training-day-header"><div class="training-day-name">${d}</div></div>
    <div class="training-day-body">
      ${byDay[d].length===0?'<div class="no-training">Kein Training</div>':byDay[d].sort((a,b)=>a.trainingZeit.localeCompare(b.trainingZeit)).map(t=>`<button class="training-slot" onclick="navigate('team','${t.slug}')">
        <div class="slot-cat">${t.kategorie==='senioren'?'Senioren':'Junioren'}</div>
        <div class="slot-name">${esc(t.name)}</div>
        <div class="slot-time">🕐 ${esc(t.trainingZeit)}</div>
        <div class="slot-place">${esc(t.trainingsplatz)}</div>
      </button>`).join('')}
    </div>
  </div>`).join('');
  document.getElementById('training-table-body').innerHTML=teams.map((t,i)=>`<tr style="${i%2===0?'':'background:rgba(239,246,255,.4)'}">
    <td><button onclick="navigate('team','${t.slug}')" style="font-weight:700;color:var(--blue);border:none;background:none;cursor:pointer;font-size:14px">${esc(t.name)}</button><div style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#9ca3af">${t.kategorie}</div></td>
    <td>${esc(t.trainingTage.join(' & '))}</td>
    <td style="font-weight:600">${esc(t.trainingZeit)}</td>
    <td><span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:50px;background:rgba(239,246,255,.8);color:var(--blue)">${esc(t.trainingsplatz)}</span></td>
    <td style="color:#6b7280">${esc(t.trainer)}</td>
  </tr>`).join('');
}

// ========== ABTEILUNGEN ==========
function renderAbteilungen(){
  document.getElementById('abt-grid').innerHTML=ABTEILUNGEN.map(a=>`<div class="abt-card">
    <div class="abt-top-bar" style="background:${a.farbe}"></div>
    <div class="abt-body">
      <div class="abt-icon-wrap" style="background:${a.farbe}1a">${a.emoji}</div>
      <div class="abt-name">${esc(a.name)}</div>
      <p class="abt-desc">${esc(a.beschreibung)}</p>
      ${a.isExternal?`<a href="${esc(a.link)}" target="_blank" rel="noopener" class="abt-link" style="color:${a.farbe}">Zur Website →</a>`:`<button class="abt-link" style="color:${a.farbe}" onclick="navigate('team','1-herren')">Mehr erfahren →</button>`}
    </div>
  </div>`).join('');
}

// ========== VEREIN ==========
function renderVereinPage(){
  const meilensteine=[
    {jahr:'1972',text:'Gründung des FC Rot-Blau Musterstadt durch den Zusammenschluss zweier lokaler Sportgruppen.',farbe:'var(--red)'},
    {jahr:'1985',text:'Bau des heutigen Clubhauses und erster Aufstieg der 1. Herren in die Kreisliga A.',farbe:'var(--blue)'},
    {jahr:'1998',text:'Einweihung des Kunstrasenplatzes; Gründung der Mädchen-Fußballabteilung.',farbe:'var(--red)'},
    {jahr:'2010',text:'300 Mitgliedermarke geknackt. Ausbau auf sieben Junioren-Mannschaften.',farbe:'var(--blue)'},
    {jahr:'2020',text:'Komplettmodernisierung: LED-Flutlicht, neue Umkleiden, barrierefreier Zugang.',farbe:'var(--red)'},
    {jahr:'2024',text:'Über 420 aktive Mitglieder. Neustart der 1. Frauen in der Kreisliga.',farbe:'var(--blue)'}
  ];
  const vorstand=[
    {name:'Hans-Peter Krause',rolle:'1. Vorsitzender',seit:'2018',farbe:'var(--red)'},
    {name:'Maria Fischer',rolle:'2. Vorsitzende',seit:'2020',farbe:'var(--blue)'},
    {name:'Thomas Weber',rolle:'Kassenwart',seit:'2019',farbe:'var(--red)'},
    {name:'Sabine Koch',rolle:'Schriftführerin',seit:'2022',farbe:'var(--blue)'},
    {name:'Frank Hartmann',rolle:'Jugendwart',seit:'2021',farbe:'var(--red)'},
    {name:'Daniela Berg',rolle:'Frauenwartin',seit:'2024',farbe:'var(--blue)'}
  ];
  const sponsoren=['Müller Bau GmbH','Bäckerei Schmidt','Auto Krause KG','Stadtwerke Musterstadt','Sparkasse Region','Pizzeria Bella Italia'];
  const werte=[{t:'Gemeinschaft',tx:'Wir sind eine Familie – auf und neben dem Platz.',c:'var(--red)'},{t:'Fairness',tx:'Respekt vor Mitspielern, Gegnern und Schiedsrichtern.',c:'var(--blue)'},{t:'Jugend zuerst',tx:'Über 150 Kinder und Jugendliche in unserer Obhut.',c:'var(--blue)'},{t:'Ehrenamt',tx:'Über 60 Helfer halten den Verein am Laufen.',c:'var(--red)'}];
  const beitraege=[{t:'Erwachsene',p:'120 €',h:null,b:false},{t:'Familie',p:'200 €',h:'2 Erw. + Kinder',b:true},{t:'Jugendliche',p:'60 €',h:'bis 18 Jahre',b:false},{t:'Förderer',p:'50 €',h:'ohne aktive Teilnahme',b:false}];
  document.getElementById('verein-content').innerHTML=`
    <!-- Geschichte -->
    <section style="max-width:1280px;margin:0 auto;padding:64px 20px;display:grid;gap:48px;grid-template-columns:1fr" class="verein-geschichte">
      <div>
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.3em;color:var(--red);margin-bottom:8px">Unsere Geschichte</p>
        <h2 style="font-family:Impact,sans-serif;font-size:clamp(28px,4vw,40px);text-transform:uppercase;color:var(--blue);margin-bottom:24px">Vom Dorfclub zum Großverein</h2>
        <p style="color:#6b7280;line-height:1.8;margin-bottom:16px">Was 1972 mit einer Handvoll fußballbegeisterter junger Männer begann, ist heute einer der mitgliederstärksten Amateurvereine der Region. Der FC Rot-Blau Musterstadt steht für gelebten Vereinsfußball.</p>
        <p style="color:#6b7280;line-height:1.8">Besonders stolz sind wir auf unsere Jugendarbeit: Sieben Mannschaften vom Bambini bis zur A-Jugend, alle Trainer mit Lizenz oder in Ausbildung.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
        ${werte.map(w=>`<div style="border-radius:16px;padding:24px;color:#fff;background:${w.c};position:relative;overflow:hidden"><div style="position:absolute;top:-32px;right:-32px;width:96px;height:96px;border-radius:50%;background:rgba(255,255,255,.1)"></div><h3 style="font-family:Impact,sans-serif;font-size:20px;text-transform:uppercase;margin-bottom:8px;position:relative">${esc(w.t)}</h3><p style="font-size:13px;color:rgba(255,255,255,.8);line-height:1.6;position:relative">${esc(w.tx)}</p></div>`).join('')}
      </div>
    </section>
    <!-- Timeline -->
    <section style="background:#fff;border-top:1px solid rgba(219,234,254,.5);border-bottom:1px solid rgba(219,234,254,.5)">
      <div style="max-width:800px;margin:0 auto;padding:64px 20px">
        <div style="text-align:center;margin-bottom:48px">
          <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.3em;color:var(--red);margin-bottom:8px">Meilensteine</p>
          <h2 style="font-family:Impact,sans-serif;font-size:clamp(28px,4vw,40px);text-transform:uppercase;color:var(--blue)">Über 50 Jahre Vereinsgeschichte</h2>
        </div>
        <div class="timeline">
          ${meilensteine.map(m=>`<div class="timeline-item">
            <div class="timeline-dot" style="background:${m.farbe}">${m.jahr}</div>
            <div class="timeline-content"><p style="color:#374151;line-height:1.7">${esc(m.text)}</p></div>
          </div>`).join('')}
        </div>
      </div>
    </section>
    <!-- Vorstand -->
    <section style="max-width:1280px;margin:0 auto;padding:64px 20px">
      <div style="text-align:center;margin-bottom:40px">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.3em;color:var(--red);margin-bottom:8px">Geschäftsführung</p>
        <h2 style="font-family:Impact,sans-serif;font-size:clamp(28px,4vw,40px);text-transform:uppercase;color:var(--blue)">Unser Vorstand</h2>
      </div>
      <div class="vorstand-grid">
        ${vorstand.map(v=>`<div class="vorstand-card">
          <div style="display:flex;align-items:center;gap:16px">
            <div class="vorstand-avatar" style="background:${v.farbe}">${v.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
            <div><div class="vorstand-name">${esc(v.name)}</div><div class="vorstand-role">${esc(v.rolle)}</div><div class="vorstand-since">im Amt seit ${esc(v.seit)}</div></div>
          </div>
        </div>`).join('')}
      </div>
    </section>
    <!-- Beiträge -->
    <section style="background:#fff;border-top:1px solid rgba(219,234,254,.5)">
      <div style="max-width:1280px;margin:0 auto;padding:64px 20px">
        <div style="text-align:center;margin-bottom:40px">
          <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.3em;color:var(--red);margin-bottom:8px">Mitglied werden</p>
          <h2 style="font-family:Impact,sans-serif;font-size:clamp(28px,4vw,40px);text-transform:uppercase;color:var(--blue)">Beiträge & Aufnahme</h2>
        </div>
        <div class="beitrag-grid" style="max-width:900px;margin:0 auto">
          ${beitraege.map(b=>`<div class="beitrag-card ${b.b?'featured':'normal'}">
            ${b.b?'<div class="beitrag-pop">Beliebt</div>':''}
            <div class="beitrag-label" style="color:${b.b?'rgba(255,255,255,.8)':'var(--blue)'}">${esc(b.t)}</div>
            <div class="beitrag-price" style="color:${b.b?'#fff':'var(--blue)'}">${esc(b.p)}</div>
            <div class="beitrag-unit" style="color:${b.b?'rgba(255,255,255,.7)':'#9ca3af'}">/Jahr</div>
            ${b.h?`<div class="beitrag-note" style="color:${b.b?'rgba(255,255,255,.7)':'#9ca3af'}">${esc(b.h)}</div>`:''}
          </div>`).join('')}
        </div>
        <div style="text-align:center;margin-top:40px"><button class="btn-red" onclick="navigate('kontakt')">Mitglied werden →</button></div>
      </div>
    </section>
    <!-- Sponsoren -->
    <section style="max-width:1280px;margin:0 auto;padding:64px 20px">
      <div style="text-align:center;margin-bottom:40px">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.3em;color:var(--red);margin-bottom:8px">Danke!</p>
        <h2 style="font-family:Impact,sans-serif;font-size:clamp(28px,4vw,40px);text-transform:uppercase;color:var(--blue)">Unsere Sponsoren</h2>
      </div>
      <div class="sponsoren-grid">
        ${sponsoren.map(s=>`<div class="sponsor-card"><div class="sponsor-name">${esc(s)}</div></div>`).join('')}
      </div>
    </section>`;
}

// ========== DOWNLOADS ==========
function renderDownloads(){
  document.getElementById('downloads-tbody').innerHTML=DOWNLOADS.map(d=>`<tr>
    <td><div class="dl-name"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8" style="flex-shrink:0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>${esc(d.name)}</div></td>
    <td style="color:#6b7280">${esc(d.kategorie)}</td>
    <td style="color:#9ca3af">${esc(d.datum)}</td>
    <td><span class="dl-format">${esc(d.format)}</span></td>
    <td style="text-align:right"><button class="dl-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download</button></td>
  </tr>`).join('');
}

// ========== VERMIETUNG ==========
function renderVermietung(){
  document.getElementById('rental-grid').innerHTML=VERMIETUNG.map(r=>`<div class="rental-card">
    <div class="rental-thumb">
      <div style="position:relative;z-index:1;font-size:56px">${r.emoji}</div>
      <div class="rental-price-badge">${esc(r.preis)}</div>
    </div>
    <div class="rental-body">
      <div class="rental-type">${esc(r.typ)}</div>
      <div class="rental-name">${esc(r.name)}</div>
      <p class="rental-desc">${esc(r.beschreibung)}</p>
      <div class="rental-footer">
        <span>👥 ${esc(r.kapazitaet)}</span>
        <strong>${esc(r.preis)}</strong>
      </div>
    </div>
  </div>`).join('');
}

// ========== KONTAKT ==========
function submitContact(e){
  e.preventDefault();
  document.getElementById('contact-form-wrap').classList.add('hidden');
  document.getElementById('contact-success').classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}
function resetContactForm(){
  document.getElementById('contact-form-wrap').classList.remove('hidden');
  document.getElementById('contact-success').classList.add('hidden');
  document.getElementById('contact-form').reset();
}

// ========== AUTH (PBKDF2 + HMAC) ==========
const PBKDF2_ITER = 210000;
function toHex(buf){return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')}
async function pbkdf2Hash(pw, salt){
  const enc=new TextEncoder();
  const key=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:PBKDF2_ITER,hash:'SHA-256'},key,256);
  return toHex(bits);
}
async function hmacSign(msg, keyBytes){
  const key=await crypto.subtle.importKey('raw',keyBytes,{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(msg));
  return toHex(sig);
}
function timingSafeEqual(a,b){if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
function getRandBytes(n=32){const b=new Uint8Array(n);crypto.getRandomValues(b);return b}
function toHexBytes(buf){return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')}
function getOrCreateHmacKey(){
  const k=sessionStorage.getItem('fc_hmac_v2');
  if(k&&/^[0-9a-f]{64}$/.test(k))return Uint8Array.from(k.match(/.{2}/g).map(b=>parseInt(b,16)));
  const b=getRandBytes(32);sessionStorage.setItem('fc_hmac_v2',toHexBytes(b));return b;
}
function hashSalt(u){return['fc','rb','26',u,'kdf'].join('_')}

const ACCOUNTS=[{username:'admin',passwordHash:'',name:'Hans-Peter Krause',role:'Vorstand – Zugriff auf alle',teamSlugs:TEAMS.map(t=>t.slug),avatar:'HK'}];
(function(){for(const a of ACCOUNTS){const h=localStorage.getItem('fc_hash_'+a.username);if(h&&/^[0-9a-f]{64}$/.test(h))a.passwordHash=h}})();

async function initHashes(pw){
  for(const a of ACCOUNTS){
    const existing=localStorage.getItem('fc_hash_'+a.username);
    if(existing&&/^[0-9a-f]{64}$/.test(existing)){a.passwordHash=existing;continue}
    if(!pw)continue;
    const h=await pbkdf2Hash(pw,hashSalt(a.username));
    a.passwordHash=h;localStorage.setItem('fc_hash_'+a.username,h);
  }
}
function hashesInitialized(){return ACCOUNTS.some(a=>a.passwordHash.length===64)}
async function doLogin(username,password){
  const u=username.toLowerCase().trim();
  const h=await pbkdf2Hash(password,hashSalt(u));
  const acc=ACCOUNTS.find(a=>a.username===u);
  if(!acc||!acc.passwordHash||!timingSafeEqual(h,acc.passwordHash))return null;
  return{username:acc.username,name:acc.name,role:acc.role,teamSlugs:acc.teamSlugs,avatar:acc.avatar};
}
async function saveSession(acc){
  if(!acc){localStorage.removeItem('fc_session_v2');return}
  const nonce=toHexBytes(getRandBytes(16));
  const expiresAt=Date.now()+480*60*1000;
  const payload={username:acc.username,name:acc.name,role:acc.role,teamSlugs:acc.teamSlugs,avatar:acc.avatar};
  const msg=JSON.stringify({account:payload,expiresAt,nonce});
  const hmac=await hmacSign(msg,getOrCreateHmacKey());
  localStorage.setItem('fc_session_v2',JSON.stringify({account:payload,expiresAt,nonce,hmac}));
}
async function loadSession(){
  const raw=localStorage.getItem('fc_session_v2');
  if(!raw)return{ok:false,reason:'missing'};
  try{
    const s=JSON.parse(raw);
    if(!s?.account?.username||typeof s.expiresAt!=='number'||!s.nonce||!s.hmac)return{ok:false,reason:'malformed'};
    if(Date.now()>s.expiresAt){localStorage.removeItem('fc_session_v2');return{ok:false,reason:'expired'}}
    const msg=JSON.stringify({account:s.account,expiresAt:s.expiresAt,nonce:s.nonce});
    const expected=await hmacSign(msg,getOrCreateHmacKey());
    if(!timingSafeEqual(expected,s.hmac)){localStorage.removeItem('fc_session_v2');return{ok:false,reason:'tampered'}}
    return{ok:true,account:s.account};
  }catch{return{ok:false,reason:'malformed'}}
}
function genPassword(len=20){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+';
  const arr=[];const max=256-256%chars.length;
  while(arr.length<len){const b=getRandBytes(len*2);for(const x of b){if(x<max&&arr.length<len)arr.push(chars[x%chars.length])}}
  return arr.join('');
}

// ========== TRAINER PAGE ==========
let trainerAccount=null;
let trainerLoaded=false;
let trainerGenPw='';
let idleTimer=null,idleCountdown=null,idleRemaining=0;
const IDLE_WARN=28*60*1000,IDLE_LOGOUT=30*60*1000;

async function renderTrainerPage(){
  if(!trainerLoaded){
    trainerLoaded=true;
    await initHashes();
    const sess=await loadSession();
    if(sess.ok)trainerAccount=sess.account;
  }
  if(!hashesInitialized()){renderSetupPage();return}
  if(!trainerAccount){renderLoginPage();return}
  renderDashboard();
}

function renderSetupPage(){
  trainerGenPw=genPassword(20);
  let confirmed=false,copied=false;
  const el=document.getElementById('trainer-content');
  el.innerHTML=`
    <div class="page-hero"><div class="page-hero-glow"></div><div class="page-hero-inner">
      <p class="page-hero-label">Einrichtung</p>
      <h1 class="page-hero-title">Erstkonfiguration</h1>
      <p class="page-hero-desc">Richte das Admin-Passwort ein. Das Passwort wird niemals gespeichert – nur ein sicherer PBKDF2-Hash.</p>
    </div></div>
    <div style="max-width:480px;margin:0 auto;padding:64px 20px">
      <div class="setup-notice">⚠️ Für maximale Sicherheit wird ein starkes Passwort automatisch erzeugt. Das Passwort selbst wird nie gespeichert — nur ein sicherer PBKDF2-Hash.</div>
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
          <div><div class="login-title">Admin-Passwort festlegen</div><div class="login-sub">Benutzername: <code style="background:#f3f4f6;padding:1px 6px;border-radius:4px">admin</code></div></div>
        </div>
        <div class="form-field" style="margin-bottom:16px">
          <label class="form-label">Generiertes Admin-Passwort</label>
          <div class="gen-pw-box">
            <input type="text" readonly value="${esc(trainerGenPw)}" class="gen-pw-input" id="setup-pw-input">
            <button class="copy-btn" id="copy-btn" onclick="copyGenPw()">Kopieren</button>
          </div>
          <button onclick="regenPw()" style="margin-top:10px;font-size:13px;font-weight:600;color:var(--red);border:none;background:none;text-decoration:underline;cursor:pointer">Neues sicheres Passwort generieren</button>
        </div>
        <label style="display:flex;align-items:flex-start;gap:12px;font-size:13px;color:#6b7280;margin-bottom:20px;cursor:pointer">
          <input type="checkbox" id="setup-confirm" style="margin-top:2px" onchange="setupConfirmChange(this.checked)">
          Ich habe das generierte Passwort sicher kopiert und gespeichert.
        </label>
        <div id="setup-error" class="login-error" style="display:none"></div>
        <button class="btn-red w-full" id="setup-submit-btn" onclick="doSetup()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          System initialisieren
        </button>
      </div>
    </div>`;
}

function setupConfirmChange(c){document.getElementById('setup-submit-btn').disabled=!c}
async function copyGenPw(){
  try{await navigator.clipboard.writeText(trainerGenPw);document.getElementById('copy-btn').textContent='Kopiert';document.getElementById('copy-btn').classList.add('copied');setTimeout(()=>{const b=document.getElementById('copy-btn');if(b){b.textContent='Kopieren';b.classList.remove('copied')}},2000)}catch{alert('Bitte manuell kopieren: '+trainerGenPw)}}
function regenPw(){trainerGenPw=genPassword(20);const i=document.getElementById('setup-pw-input');if(i)i.value=trainerGenPw}
async function doSetup(){
  const err=document.getElementById('setup-error');
  const confirm=document.getElementById('setup-confirm').checked;
  if(!confirm){err.style.display='block';err.textContent='Bitte bestätige, dass du das Passwort gespeichert hast.';return}
  if(trainerGenPw.length<16){err.style.display='block';err.textContent='Passwort zu kurz.';return}
  err.style.display='none';
  await initHashes(trainerGenPw);
  showToast('System erfolgreich initialisiert!');
  renderTrainerPage();
}

let loginSecNotice=null;
function renderLoginPage(notice){
  const el=document.getElementById('trainer-content');
  el.innerHTML=`
    <div class="page-hero"><div class="page-hero-glow"></div><div class="page-hero-inner">
      <p class="page-hero-label">Interner Bereich</p>
      <h1 class="page-hero-title">Trainer-Anmeldung</h1>
      <p class="page-hero-desc">Nur für Trainer und Vorstand.</p>
    </div></div>
    <div class="trainer-wrap" style="padding-top:64px;padding-bottom:80px">
      ${notice?`<div class="security-notice"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="flex-shrink:0;color:#991b1b;margin-top:2px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div><strong style="display:block;margin-bottom:4px">Sicherheitshinweis</strong>${esc(notice)}</div></div>`:''}
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon" style="background:var(--blue)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></div>
          <div><div class="login-title">Anmelden</div><div class="login-sub">Nur zugelassene Trainer & Vorstand</div></div>
        </div>
        <div id="login-error" class="login-error" style="display:none"></div>
        <form onsubmit="doTrainerLogin(event)">
          <div class="form-field" style="margin-bottom:16px">
            <label class="form-label">Benutzername</label>
            <input type="text" id="login-user" class="form-input" autocomplete="username" placeholder="Benutzername" required>
          </div>
          <div class="form-field" style="margin-bottom:20px">
            <label class="form-label">Passwort</label>
            <input type="password" id="login-pw" class="form-input" autocomplete="current-password" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn-red w-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Anmelden
          </button>
        </form>
      </div>
    </div>`;
}

async function doTrainerLogin(e){
  e.preventDefault();
  const u=document.getElementById('login-user').value;
  const p=document.getElementById('login-pw').value;
  const errEl=document.getElementById('login-error');
  errEl.style.display='none';
  const acc=await doLogin(u,p);
  if(acc){
    trainerAccount=acc;
    await saveSession(acc);
    renderDashboard();
    startIdleTimer();
  }else{
    errEl.style.display='block';
    errEl.textContent='Ungültige Anmeldedaten. Bitte überprüfe Benutzername und Passwort.';
  }
}

async function trainerLogout(){
  trainerAccount=null;
  await saveSession(null);
  stopIdleTimer();
  closeIdleModal();
  renderTrainerPage();
}

// Dashboard tab state
let dashTab='info';
function renderDashboard(){
  if(!trainerAccount)return;
  const acc=trainerAccount;
  const myTeams=acc.teamSlugs.map(s=>TEAMS.find(t=>t.slug===s)).filter(Boolean);
  const allNews=myTeams.flatMap(t=>{
    try{const edits=JSON.parse(localStorage.getItem('fc_trainer_edits')||'{}');const d=edits[t.slug];if(!d||!Array.isArray(d.news))return[];return d.news.map(n=>({...n,teamName:t.name,teamSlug:t.slug}))}catch{return[]}
  }).sort((a,b)=>(b.datum||'').localeCompare(a.datum||''));
  const el=document.getElementById('trainer-content');
  el.innerHTML=`
    <div class="dashboard-hero">
      <div class="dashboard-hero-inner">
        <div>
          <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.3em;color:var(--red);margin-bottom:8px">Trainer-Bereich</p>
          <h1 style="font-family:Impact,sans-serif;font-size:clamp(28px,4vw,48px);color:#fff;text-transform:uppercase;margin-bottom:8px">Dashboard</h1>
          <p style="color:rgba(190,219,255,.8);font-size:15px">Willkommen, ${esc(acc.name)} – ${esc(acc.role)}</p>
        </div>
        <button onclick="trainerLogout()" style="background:rgba(255,255,255,.1);backdrop-filter:blur(4px);border-radius:12px;padding:10px 20px;font-size:13px;font-weight:600;color:#fff;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;gap:8px;transition:background .2s" onmouseover="this.style.background='rgba(255,255,255,.2)'" onmouseout="this.style.background='rgba(255,255,255,.1)'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Abmelden
        </button>
      </div>
    </div>
    <!-- Team quick links -->
    <div style="background:#fff;border-bottom:1px solid rgba(219,234,254,.5);position:sticky;top:88px;z-index:40">
      <div style="max-width:1280px;margin:0 auto;padding:12px 20px;overflow-x:auto;display:flex;gap:8px;align-items:center">
        <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:#9ca3af;margin-right:8px;white-space:nowrap;flex-shrink:0">Deine Teams:</span>
        ${myTeams.map(t=>`<button onclick="navigate('team','${t.slug}')" class="team-tab" style="flex-shrink:0">${esc(t.name)}</button>`).join('')}
      </div>
    </div>
    <div class="tab-bar">
      <div class="tab-bar-inner">
        <button class="tab-btn ${dashTab==='info'?'active':''}" onclick="switchDashTab('info')">Team-Infos bearbeiten</button>
        <button class="tab-btn ${dashTab==='news'?'active':''}" onclick="switchDashTab('news')">Neuigkeiten posten</button>
      </div>
    </div>
    <div class="dashboard-inner" id="dash-tab-content"></div>`;
  renderDashTab(myTeams,allNews);
}

function switchDashTab(tab){
  dashTab=tab;
  document.querySelectorAll('.tab-btn').forEach(b=>{b.classList.toggle('active',b.textContent.includes(tab==='info'?'Team-Infos':'Neuigkeiten'))});
  const acc=trainerAccount;
  const myTeams=acc.teamSlugs.map(s=>TEAMS.find(t=>t.slug===s)).filter(Boolean);
  const allNews=myTeams.flatMap(t=>{try{const edits=JSON.parse(localStorage.getItem('fc_trainer_edits')||'{}');const d=edits[t.slug];if(!d||!Array.isArray(d.news))return[];return d.news.map(n=>({...n,teamName:t.name,teamSlug:t.slug}))}catch{return[]}}).sort((a,b)=>(b.datum||'').localeCompare(a.datum||''));
  renderDashTab(myTeams,allNews);
}

let selectedTeamEdit=null;
function renderDashTab(myTeams,allNews){
  const c=document.getElementById('dash-tab-content');
  if(!c)return;
  if(dashTab==='info'){
    // Clear file input and reset validation when rendering info tab
    const existingFileInput=document.getElementById('edit-file-input');
    if(existingFileInput)existingFileInput.value='';
    const existingFileName=document.getElementById('edit-file-name');
    if(existingFileName)existingFileName.textContent='';
    
    const teamOpts=myTeams.map(t=>`<option value="${t.slug}" ${selectedTeamEdit===t.slug?'selected':''}>${esc(t.name)}</option>`).join('');
    c.innerHTML=`<div style="display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(320px,1fr))" class="dash-info-grid">
      <div>
        <h2 style="font-family:Impact,sans-serif;font-size:22px;color:var(--blue);text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:8px"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> Deine Mannschaften</h2>
        <p style="font-size:13px;color:#9ca3af;margin-bottom:16px">Wähle eine Mannschaft aus, um deren Infos zu bearbeiten.</p>
        <div class="form-field" style="margin-bottom:16px">
          <label class="form-label">Mannschaft</label>
          <select class="form-select" id="team-edit-select" onchange="selectTeamEdit(this.value)">${teamOpts}<option value="">-- Bitte wählen --</option></select>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${myTeams.map(t=>{
            const edits=getTeamEdits(t.slug);const hasEdits=edits&&(edits.beschreibung||edits.trainingZeit||edits.trainingTage);
            return `<button onclick="selectTeamEdit('${t.slug}')" style="text-align:left;background:#fff;border-radius:16px;padding:20px;border:2px solid ${selectedTeamEdit===t.slug?'var(--red)':'rgba(219,234,254,.5)'};box-shadow:0 1px 3px rgba(0,0,0,.1);transition:all .2s;width:100%" ${selectedTeamEdit===t.slug?'':'onmouseover="this.style.boxShadow=\'0 4px 12px rgba(0,0,0,.1)\'" onmouseout="this.style.boxShadow=\'0 1px 3px rgba(0,0,0,.1)\'"'}>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div><h3 style="font-weight:700;color:var(--blue);font-size:15px">${esc(t.name)}</h3><p style="font-size:12px;color:#9ca3af;margin-top:2px">${esc(t.liga)}</p></div>
                <div style="display:flex;align-items:center;gap:8px">${hasEdits?'<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:50px;background:rgba(16,185,129,.1);color:#059669">Bearbeitet</span>':''}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
              </div>
            </button>`;}).join('')}
        </div>
      </div>
      <div id="team-edit-panel">
        ${selectedTeamEdit?renderTeamEditForm(myTeams.find(t=>t.slug===selectedTeamEdit)):`<div style="background:#f9fafb;border-radius:16px;padding:48px;border:1px solid rgba(219,234,254,.5);text-align:center;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div style="width:64px;height:64px;border-radius:16px;background:rgba(219,234,254,.6);display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="1.8"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></div>
          <h3 style="font-weight:700;color:var(--blue);margin-bottom:8px">Wähle eine Mannschaft</h3>
          <p style="font-size:13px;color:#9ca3af">Klicke links auf eine Mannschaft oder verwende das Dropdown-Menü, um deren Infos zu bearbeiten.</p>
        </div>`}
      </div>
    </div>`;
  }else{
    // News tab
    const teamOpts=myTeams.map(t=>`<option value="${t.slug}">${esc(t.name)}</option>`).join('');
    c.innerHTML=`<div style="display:grid;gap:32px;grid-template-columns:1fr">
      <div>
        <h2 style="font-family:Impact,sans-serif;font-size:22px;color:var(--blue);text-transform:uppercase;margin-bottom:24px;display:flex;align-items:center;gap:8px"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Neuigkeit posten</h2>
        <div class="form-wrap">
          <form onsubmit="postNews(event)">
            <div class="form-field" style="margin-bottom:16px">
              <label class="form-label">Mannschaft *</label>
              <select class="form-select" id="news-team-sel">${teamOpts}</select>
            </div>
            <div class="form-field" style="margin-bottom:16px">
              <label class="form-label">Titel *</label>
              <input type="text" required maxlength="140" class="form-input" id="news-titel" placeholder="z.B. Trainingsstart Frühjahr">
            </div>
            <div class="form-field" style="margin-bottom:16px">
              <label class="form-label">Text *</label>
              <textarea required rows="4" class="form-textarea" id="news-text" placeholder="Berichte über deine Mannschaft..."></textarea>
            </div>
            <div class="form-field" style="margin-bottom:20px">
              <label class="form-label">Bild (optional)</label>
              <input type="url" class="form-input" id="news-bildurl" placeholder="https://beispiel.de/bild.jpg oder lokale Datei hochladen" style="background:#fff;color:#1a1a2e">
              <p style="font-size:11px;color:#9ca3af;margin-top:4px">Fügen Sie eine URL ein oder laden Sie eine lokale Datei hoch (JPG/PNG/GIF/WEBP)</p>
              <div id="news-img-preview" style="display:none;margin-top:8px;border-radius:10px;overflow:hidden;height:100px"><img style="width:100%;height:100%;object-fit:cover" id="news-img-preview-img" alt=""></div>
              <div style="margin-top:10px">
                <label class="upload-area" style="display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;background:#f0f4ff;border:2px dashed #94a3b8;border-radius:12px;padding:16px;font-size:13px;font-weight:700;color:#142850;transition:border-color .2s,background .2s;user-select:none;margin:0" onmouseenter="this.style.borderColor='#d72638';this.style.background='#fee2e2'" onmouseleave="this.style.borderColor='#94a3b8';this.style.background='#f0f4ff'">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Lokale Datei wählen (JPG/PNG/GIF/WEBP, max. 5MB)
                  <input type="file" id="news-file-input" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none" onchange="handleNewsFileUpload(this)">
                </label>
                <p id="news-file-name" class="file-name-display"></p>
              </div>
            </div>
            <button type="submit" class="btn-red">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              Veröffentlichen
            </button>
          </form>
        </div>
      </div>
      <div>
        <h2 style="font-family:Impact,sans-serif;font-size:22px;color:var(--blue);text-transform:uppercase;margin-bottom:24px;display:flex;align-items:center;gap:8px">📅 Deine Nachrichten</h2>
        ${allNews.length===0?`<div style="background:#f9fafb;border-radius:16px;padding:48px;border:1px solid rgba(219,234,254,.5);text-align:center"><p style="font-size:13px;color:#9ca3af">Noch keine Nachrichten gepostet. Schreib die erste!</p></div>`:
        `<div style="display:flex;flex-direction:column;gap:16px">${allNews.map((n,idx)=>`<article style="background:#fff;border-radius:16px;border:1px solid rgba(219,234,254,.5);overflow:hidden;position:relative">
          <div style="position:absolute;top:12px;right:12px;display:flex;gap:8px">
            <button onclick="editNews('${n.teamSlug}',${idx})" style="background:rgba(59,130,246,.1);border:none;border-radius:8px;padding:6px;color:#2563eb;transition:all .2s" onmouseenter="this.style.background='rgba(59,130,246,.2)'" onmouseleave="this.style.background='rgba(59,130,246,.1)'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onclick="deleteNews('${n.teamSlug}',${idx})" style="background:rgba(220,38,38,.1);border:none;border-radius:8px;padding:6px;color:#dc2626;transition:all .2s" onmouseenter="this.style.background='rgba(220,38,38,.2)'" onmouseleave="this.style.background='rgba(220,38,38,.1)'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
          ${n.bildUrl?`<img src="${esc(n.bildUrl)}" style="width:100%;height:120px;object-fit:cover" onerror="this.style.display='none'" alt="">`:''} 
          <div style="padding:20px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:50px;background:rgba(219,234,254,.8);color:var(--blue)">${esc(n.teamName)}</span>
              <span style="font-size:12px;color:#9ca3af">${esc(n.datum||'')}</span>
            </div>
            <h3 style="font-weight:700;color:var(--blue);font-size:14px;margin-bottom:4px">${esc(n.titel)}</h3>
            <p style="font-size:13px;color:#6b7280;line-height:1.5">${esc(n.text)}</p>
          </div>
        </article>`).join('')}</div>`}
      </div>
    </div>`;
    // preview handler
    const urlInput=document.getElementById('news-bildurl');
    if(urlInput)urlInput.addEventListener('input',()=>{
      const v=urlInput.value.trim();const prev=document.getElementById('news-img-preview');const img=document.getElementById('news-img-preview-img');
      if(v&&/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v)){if(prev)prev.style.display='block';if(img)img.src=v}else{if(prev)prev.style.display='none'}
    });
    // Clear file input after render
    const fileInput=document.getElementById('news-file-input');
    if(fileInput)fileInput.value='';
    const fileName=document.getElementById('news-file-name');
    if(fileName)fileName.textContent='';
  }
}

// Handle news file upload
let newsFileValid = false;
function handleNewsFileUpload(input){
  const file=input.files[0];
  if(!file){newsFileValid=false;return;}
  const validExts=['.jpg','.jpeg','.png','.gif','.webp'];
  const fileName=file.name.toLowerCase();
  const hasValidExt=validExts.some(ext=>fileName.endsWith(ext));
  // Check extension first (most reliable)
  if(!hasValidExt){
    alert('Ungültiges Bildformat. Bitte nur JPG, PNG, GIF oder WEBP verwenden.');
    input.value='';
    newsFileValid=false;
    return;
  }
  // Secondary MIME type check - but don't reject if browser reports wrong MIME
  const validMimes=['image/jpeg','image/png','image/gif','image/webp'];
  if(file.type && !validMimes.includes(file.type)){
    // Log warning but still allow - extension is authoritative
    console.warn('MIME type mismatch for '+fileName+': '+file.type+' (allowed by extension)');
  }
  if(file.size>5*1024*1024){
    alert('Die Datei ist zu groß. Maximale Größe: 5 MB.');
    input.value='';
    newsFileValid=false;
    return;
  }
  newsFileValid=true;
  const reader=new FileReader();
  reader.onload=function(e){
    const dataUrl=e.target.result;
    const urlInput=document.getElementById('news-bildurl');
    const prev=document.getElementById('news-img-preview');
    const img=document.getElementById('news-img-preview-img');
    const fileName=document.getElementById('news-file-name');
    if(urlInput){
      urlInput.value=dataUrl;
      urlInput.readOnly=false; // Allow editing if needed
      urlInput.style.background='#fff';
      urlInput.style.color='#1a1a2e';
    }
    if(prev)prev.style.display='block';
    if(img)img.src=dataUrl;
    if(fileName)fileName.textContent=file.name;
  };
  reader.readAsDataURL(file);
}

// Delete news post
function deleteNews(teamSlug,index){
  if(!confirm('Möchten Sie diese Neuigkeit wirklich löschen?'))return;
  try{
    const edits=JSON.parse(localStorage.getItem('fc_trainer_edits')||'{}');
    if(edits[teamSlug]&&edits[teamSlug].news&&edits[teamSlug].news[index]){
      edits[teamSlug].news.splice(index,1);
      localStorage.setItem('fc_trainer_edits',JSON.stringify(edits));
      showToast('Gelöscht!');
      renderDashboard();
    }
  }catch(e){alert('Fehler beim Löschen: '+e.message)}
}

// Edit news post
let editingNewsIndex = null;
let editingNewsTeam = null;
function editNews(teamSlug,index){
  try{
    const edits=JSON.parse(localStorage.getItem('fc_trainer_edits')||'{}');
    if(edits[teamSlug]&&edits[teamSlug].news&&edits[teamSlug].news[index]){
      const news=edits[teamSlug].news[index];
      editingNewsIndex=index;
      editingNewsTeam=teamSlug;
      document.getElementById('news-team-sel').value=teamSlug;
      document.getElementById('news-titel').value=news.titel;
      document.getElementById('news-text').value=news.text;
      document.getElementById('news-bildurl').value=news.bildUrl||'';
      const prev=document.getElementById('news-img-preview');
      const img=document.getElementById('news-img-preview-img');
      if(news.bildUrl){
        if(prev)prev.style.display='block';
        if(img)img.src=news.bildUrl;
      }else{
        if(prev)prev.style.display='none';
      }
      document.getElementById('news-file-input').value='';
      document.getElementById('news-file-name').textContent='';
      newsFileValid=false;
      window.scrollTo({top:0,behavior:'smooth'});
      showToast('Bearbeiten: '+news.titel);
    }
  }catch(e){alert('Fehler beim Laden: '+e.message)}
}

// Handle edit file upload for team photo - tracks validity per team slug
let editFileValidByTeam = {}; // Map of teamSlug -> boolean
function handleEditFileUpload(input,teamSlug){
  const file=input.files[0];
  if(!file){editFileValidByTeam[teamSlug]=false;return;}
  const validExts=['.jpg','.jpeg','.png'];
  const fileName=file.name.toLowerCase();
  const hasValidExt=validExts.some(ext=>fileName.endsWith(ext));
  // Check extension first (most reliable)
  if(!hasValidExt){
    alert('Ungültiges Bildformat. Bitte nur JPG oder PNG verwenden.');
    input.value='';
    editFileValidByTeam[teamSlug]=false;
    return;
  }
  // Secondary MIME type check - but don't reject if browser reports wrong MIME
  // Some browsers may report incorrect MIME types, so we trust the extension
  const validMimes=['image/jpeg','image/png'];
  if(file.type && !validMimes.includes(file.type)){
    // Log warning but still allow - extension is authoritative
    console.warn('MIME type mismatch for '+fileName+': '+file.type+' (allowed by extension)');
  }
  if(file.size>5*1024*1024){
    alert('Die Datei ist zu groß. Maximale Größe: 5 MB.');
    input.value='';
    editFileValidByTeam[teamSlug]=false;
    return;
  }
  editFileValidByTeam[teamSlug]=true;
  const reader=new FileReader();
  reader.onload=function(e){
    const dataUrl=e.target.result;
    const urlInput=document.getElementById('edit-foto');
    const prev=document.getElementById('edit-foto-preview');
    const img=document.getElementById('edit-foto-preview-img');
    const fileName=document.getElementById('edit-file-name');
    if(urlInput){
      urlInput.value=dataUrl;
      urlInput.readOnly=false; // Allow editing if needed
      urlInput.style.background='#fff';
      urlInput.style.color='#1a1a2e';
    }
    if(prev)prev.style.display='block';
    if(img){img.src=dataUrl;img.onload=null;} // Force re-render
    if(fileName)fileName.textContent=file.name;
  };
  reader.readAsDataURL(file);
}

function selectTeamEdit(slug){
  // Preserve validation state for the previously selected team before switching
  if(selectedTeamEdit && selectedTeamEdit !== slug){
    // Keep the validation state as-is for the old team
    // Don't reset it - the user may have already uploaded a valid file
  }
  selectedTeamEdit=slug;
  // Initialize validation flag for new team if not exists
  if(editFileValidByTeam[slug]===undefined){
    editFileValidByTeam[slug]=false;
  }
  // Clear file input UI but don't affect validation state
  setTimeout(()=>{
    const fi=document.getElementById('edit-file-input');
    const fn=document.getElementById('edit-file-name');
    if(fi)fi.value='';
    if(fn)fn.textContent='';
    // Clear preview
    const prev=document.getElementById('edit-foto-preview');
    const img=document.getElementById('edit-foto-preview-img');
    if(prev)prev.style.display='none';
    if(img)img.src='';
    // Update dropdown to reflect selection
    const sel=document.getElementById('team-edit-select');
    if(sel)sel.value=slug||'';
  },0);
  switchDashTab('info')
}
function renderTeamEditForm(team){
  if(!team)return '';
  const edits=getTeamEdits(team.slug)||{};
  const desc=edits.beschreibung||team.beschreibung;
  const zt=edits.trainingZeit||team.trainingZeit;
  const td=edits.trainingTage||team.trainingTage.join(' & ');
  const tp=edits.trainingsplatz||team.trainingsplatz;
  const fotoUrl=edits.fotoUrl||'';
  return `<div class="form-wrap">
    <h3 style="font-family:Impact,sans-serif;font-size:18px;color:var(--blue);text-transform:uppercase;margin-bottom:20px;display:flex;align-items:center;gap:8px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="1.8"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg> ${esc(team.name)} bearbeiten</h3>
    <div class="form-field" style="margin-bottom:16px">
      <label class="form-label">Beschreibung</label>
      <textarea class="form-textarea" id="edit-beschreibung" rows="4">${esc(desc)}</textarea>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="form-field"><label class="form-label">Trainingszeiten</label><input class="form-input" id="edit-zt" value="${esc(zt)}"></div>
      <div class="form-field"><label class="form-label">Trainingsplatz</label><input class="form-input" id="edit-tp" value="${esc(tp)}"></div>
    </div>
    <div class="form-field" style="margin-bottom:16px">
      <label class="form-label">Trainingstage (z.B. "Dienstag & Donnerstag")</label>
      <input class="form-input" id="edit-td" value="${esc(td)}">
    </div>
    <div class="form-field" style="margin-bottom:20px">
      <label class="form-label">Mannschaftsfoto</label>
      <input class="form-input" id="edit-foto" value="${esc(fotoUrl)}" placeholder="https://example.com/foto.jpg oder lokale Datei hochladen" style="background:#fff;color:#1a1a2e">
      <p style="font-size:11px;color:#9ca3af;margin-top:4px">Fügen Sie eine URL ein (nur .jpg/.jpeg/.png) oder laden Sie eine lokale Datei hoch</p>
      <div id="edit-foto-preview" style="margin-top:8px;border-radius:10px;overflow:hidden;height:120px;display:none">
        <img id="edit-foto-preview-img" src="" style="width:100%;height:100%;object-fit:cover" alt="">
      </div>
      <div style="margin-top:10px">
        <label class="upload-area" style="display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;background:#f0f4ff;border:2px dashed #94a3b8;border-radius:12px;padding:16px;font-size:13px;font-weight:700;color:#142850;transition:border-color .2s,background .2s;user-select:none;margin:0" onmouseenter="this.style.borderColor='#d72638';this.style.background='#fee2e2'" onmouseleave="this.style.borderColor='#94a3b8';this.style.background='#f0f4ff'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Lokale Datei wählen (JPG/PNG, max. 5MB)
          <input type="file" id="edit-file-input" accept="image/jpeg,image/png" style="display:none" onchange="handleEditFileUpload(this,'${team.slug}')">
        </label>
        <p id="edit-file-name" class="file-name-display"></p>
      </div>
    </div>
    <div style="display:flex;gap:12px">
      <button onclick="saveTeamEdit('${team.slug}')" class="btn-red" style="font-size:13px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Speichern
      </button>
      <button onclick="selectedTeamEdit=null;switchDashTab('info')" style="background:#f3f4f6;color:#374151;border:none;border-radius:50px;padding:10px 20px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em">Abbrechen</button>
    </div>
  </div>`;
}

// previewEditFoto removed - no longer needed as URL input is readonly

function saveTeamEdit(slug){
  try{
    const desc=sanitize(document.getElementById('edit-beschreibung').value);
    const zt=sanitize(document.getElementById('edit-zt').value);
    const td=sanitize(document.getElementById('edit-td').value);
    const tp=sanitize(document.getElementById('edit-tp').value);
    const fotoRaw=document.getElementById('edit-foto').value.trim();
    
    // Validate image: must be either a valid data URL from upload OR a valid external URL
    let foto='';
    if(fotoRaw){
      if(fotoRaw.startsWith('data:image/')){
        // Must be from a validated local upload - check per-team validation flag
        if(!editFileValidByTeam[slug]){
          alert('Ungültiges Bildformat. Bitte nur JPG oder PNG verwenden.');
          return;
        }
        foto=fotoRaw;
      }else{
        // External URL - validate extension
        const validExt=/\.(jpg|jpeg|png)(\?.*)?$/i.test(fotoRaw);
        if(!validExt){
          alert('URL muss auf .jpg, .jpeg oder .png enden.');
          return;
        }
        foto=fotoRaw;
      }
    }
    
    const edits=JSON.parse(localStorage.getItem('fc_trainer_edits')||'{}');
    edits[slug]={...edits[slug],beschreibung:desc,trainingZeit:zt,trainingTage:td,trainingsplatz:tp,fotoUrl:foto};
    localStorage.setItem('fc_trainer_edits',JSON.stringify(edits));
    showToast('Gespeichert!');
    selectedTeamEdit=null;
    // Clear file validation for this team
    editFileValidByTeam[slug]=false;
    switchDashTab('info');
  }catch(e){alert('Fehler beim Speichern: '+e.message)}
}

function postNews(e){
  e.preventDefault();
  const slug=document.getElementById('news-team-sel').value;
  const titel=sanitize(document.getElementById('news-titel').value).slice(0,140);
  const text=sanitize(document.getElementById('news-text').value).slice(0,1200);
  let bildRaw=document.getElementById('news-bildurl').value.trim();
  
  // Validate image
  let bildUrl='';
  if(bildRaw){
    if(bildRaw.startsWith('data:image/')){
      // Must be from a validated local upload
      if(!newsFileValid){
        alert('Ungültiges Bildformat. Bitte nur JPG, PNG, GIF oder WEBP verwenden.');
        return;
      }
      bildUrl=bildRaw;
    }else{
      // External URL - validate extension
      const validExt=/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(bildRaw);
      if(!validExt){
        alert('URL muss auf .jpg, .jpeg, .png, .gif oder .webp enden.');
        return;
      }
      bildUrl=bildRaw;
    }
  }
  
  if(!titel||!text){alert('Bitte Titel und Text ausfüllen.');return}
  const now=new Date();const datum=`${String(now.getDate()).padStart(2,'0')}.${String(now.getMonth()+1).padStart(2,'0')}.${now.getFullYear()}`;
  const edits=JSON.parse(localStorage.getItem('fc_trainer_edits')||'{}');
  const existing=(edits[slug]?.news||[]).slice(0,29);
  if(editingNewsIndex!==null&&editingNewsTeam===slug){
    // Update existing news
    edits[slug].news[editingNewsIndex]={titel,text,datum,bildUrl};
    editingNewsIndex=null;
    editingNewsTeam=null;
    showToast('Aktualisiert!');
  }else{
    // Create new news - add to beginning so newest appears first
    edits[slug]={...edits[slug],news:[{titel,text,datum,bildUrl},...existing]};
    showToast('Veröffentlicht!');
  }
  localStorage.setItem('fc_trainer_edits',JSON.stringify(edits));
  renderDashboard();
}

// ========== IDLE TIMER ==========
let idleTimeoutWarn,idleTimeoutLogout;
function resetIdleTimers(){
  clearTimeout(idleTimeoutWarn);clearTimeout(idleTimeoutLogout);clearInterval(idleCountdown);closeIdleModal();
  idleTimeoutWarn=setTimeout(()=>{if(!trainerAccount)return;showIdleModal()},IDLE_WARN);
  idleTimeoutLogout=setTimeout(()=>{if(trainerAccount)trainerLogout()},IDLE_LOGOUT);
}
function startIdleTimer(){
  const events=['mousemove','keydown','click','scroll','touchstart'];
  events.forEach(ev=>window.addEventListener(ev,resetIdleTimers,{passive:true}));
  resetIdleTimers();
}
function stopIdleTimer(){
  clearTimeout(idleTimeoutWarn);clearTimeout(idleTimeoutLogout);clearInterval(idleCountdown);
  const events=['mousemove','keydown','click','scroll','touchstart'];
  events.forEach(ev=>window.removeEventListener(ev,resetIdleTimers));
}
function showIdleModal(){
  idleRemaining=120;
  document.getElementById('idle-modal').classList.add('open');
  updateIdleTimer();
  idleCountdown=setInterval(()=>{idleRemaining--;if(idleRemaining<=0){clearInterval(idleCountdown);trainerLogout()}else updateIdleTimer()},1000);
}
function updateIdleTimer(){
  const m=Math.floor(idleRemaining/60),s=idleRemaining%60;
  document.getElementById('idle-timer').textContent=`${m}:${String(s).padStart(2,'0')}`;
}
function closeIdleModal(){document.getElementById('idle-modal').classList.remove('open');clearInterval(idleCountdown)}
function stayLoggedIn(){closeIdleModal();resetIdleTimers()}

// ========== TOAST ==========
let toastTimeout;
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toast-msg').textContent=msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout=setTimeout(()=>t.classList.remove('show'),2500);
}

// ========== INIT ==========
async function init(){
  buildDropdowns();
  renderHome();
  renderAbteilungen();
  renderDownloads();
  renderVermietung();
  renderTraining();
  // Check for session on trainer page
  await initHashes();
  // Header scroll
  document.getElementById('site-header').style.background='rgba(20,40,80,.92)';
  // Update styles for verein stats responsive
  const statsEl=document.querySelector('.verein-stats');
  if(statsEl)statsEl.style.gridTemplateColumns='repeat(4,1fr)';
}
init();
