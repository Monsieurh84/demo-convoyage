/* Démo — plateforme de convoyage (bureau, app convoyeur, suivi client). Données fictives, stockées dans le navigateur. */
(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s), $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const ymd = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hm = (d = new Date()) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const addDays = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return ymd(d); };
  const eur = n => (+n || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  const eur0 = n => Math.round(+n || 0).toLocaleString('fr-FR') + ' €';
  const jourFr = (s, o = { weekday: 'short', day: 'numeric', month: 'short' }) => new Date(s + 'T12:00:00').toLocaleDateString('fr-FR', o);
  const cap = s => s ? s[0].toUpperCase() + s.slice(1) : '';
  const params = new URLSearchParams(location.search);
  const SOCIETE = params.get('nom') || 'Convoyage Pro';
  if (params.get('pour')) $('#pour').textContent = params.get('pour');
  $$('a.ext').forEach(a => { a.href = 'site.html' + location.search; });

  const IC = {
    dash: '<rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17.5" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 6 5"/>',
    build: '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M2 21h20M8 7h4M8 11h4M8 15h4"/>',
    euro: '<path d="M18 7a6.5 6.5 0 1 0 0 10M4 10h10M4 14h10"/>',
    car: '<path d="M4.5 12l2-5.3A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.2l2 5.3"/><rect x="3" y="12" width="18" height="5.5" rx="1.6"/><path d="M6 17.5v2M18 17.5v2M7 14.8h.01M17 14.8h.01"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    cam: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    nav: '<path d="M3 11l18-8-8 18-2-8z"/>', doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    alert: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.4v.2"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    fuel: '<path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15M3 20h12M14 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3M7 7h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>', print: '<path d="M6 9V3h12v6M6 18H4v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7h-2M6 14h12v7H6z"/>',
    receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>'
  };
  const ic = (k, w) => `<svg viewBox="0 0 24 24" ${w ? `width="${w}" height="${w}"` : ''} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[k] || ''}</svg>`;

  /* ---------- Données fictives ---------- */
  const VILLES = { Lyon: [45.7578, 4.832], Marseille: [43.2965, 5.3698], Avignon: [43.9493, 4.8055], Valence: [44.9334, 4.8924], 'Montélimar': [44.5581, 4.7509], 'Nîmes': [43.8367, 4.3601], Grenoble: [45.1885, 5.7245], Montpellier: [43.6108, 3.8767], Orange: [44.1381, 4.8075], 'Aix-en-Provence': [43.5297, 5.4474], 'Saint-Étienne': [45.4397, 4.3872], Toulon: [43.1242, 5.928], Nice: [43.7102, 7.262], 'Bollène': [44.281, 4.749], Arles: [43.6768, 4.6303] };
  const RUES = ['12 avenue de la Gare', 'ZA Les Portes du Sud', '3 rue des Artisans', '45 boulevard Victor Hugo', 'Parking aéroport, niveau -1', '8 chemin des Vignes', '27 route Nationale 7', 'Centre commercial, accès livraisons', '101 avenue Jean Jaurès', '6 place de la République'];
  const CLIENTS = [
    { id: 'c1', nom: 'Sud Location Véhicules', type: 'Loueur', contact: 'Mme Bernard', tel: '04 90 12 34 56', forfait: 30, km: 0.78, couleur: '#2F6FED' },
    { id: 'c2', nom: 'Prestige Automobiles Avignon', type: 'Concession', contact: 'M. Leroy', tel: '04 90 85 22 10', forfait: 45, km: 0.92, couleur: '#7A5AF0' },
    { id: 'c3', nom: 'Garage Central Valence', type: 'Garage', contact: 'M. Faure', tel: '04 75 41 18 09', forfait: 35, km: 0.85, couleur: '#14A06A' },
    { id: 'c4', nom: 'Flotte Pro Entreprises', type: 'Gestion de flotte', contact: 'Mme Morel', tel: '04 72 33 61 90', forfait: 30, km: 0.8, couleur: '#F2A900' },
    { id: 'c5', nom: 'Leasing Rhône', type: 'Leasing', contact: 'M. Girard', tel: '04 78 60 72 45', forfait: 40, km: 0.82, couleur: '#E0433A' },
    { id: 'c6', nom: 'Particulier · M. Durand', type: 'Particulier', contact: 'M. Durand', tel: '06 12 45 78 90', forfait: 60, km: 1.1, couleur: '#66748A' }
  ];
  const CONVOYEURS = [
    { id: 'k1', nom: 'Karim B.', tel: '06 11 22 33 44', couleur: '#FF6A1A', ville: 'Montélimar', note: 4.9 },
    { id: 'k2', nom: 'Yanis M.', tel: '06 22 33 44 55', couleur: '#2F6FED', ville: 'Avignon', note: 4.8 },
    { id: 'k3', nom: 'Sofiane T.', tel: '06 33 44 55 66', couleur: '#14A06A', ville: 'Lyon', note: 4.7 },
    { id: 'k4', nom: 'Mehdi R.', tel: '06 44 55 66 77', couleur: '#7A5AF0', ville: 'Marseille', note: 4.9 },
    { id: 'k5', nom: 'Lucas P.', tel: '06 55 66 77 88', couleur: '#E0433A', ville: 'Valence', note: 4.6 },
    { id: 'k6', nom: 'Nadia A.', tel: '06 66 77 88 99', couleur: '#D9A400', ville: 'Nîmes', note: 5.0 },
    { id: 'k7', nom: 'Samir K.', tel: '06 77 88 99 00', couleur: '#0FA3B1', ville: 'Grenoble', note: 4.8 }
  ];
  const VEHICULES = [['Peugeot', '208', 'Essence'], ['Renault', 'Clio V', 'Essence'], ['Tesla', 'Model 3', 'Électrique'], ['Volkswagen', 'Golf 8', 'Diesel'], ['Mercedes', 'Classe A', 'Diesel'], ['Toyota', 'Yaris Hybride', 'Hybride'], ['Citroën', 'C5 Aircross', 'Diesel'], ['BMW', 'Série 1', 'Essence'], ['Renault', 'Trafic', 'Diesel'], ['Dacia', 'Sandero', 'Essence'], ['Audi', 'A3', 'Diesel'], ['Fiat', '500e', 'Électrique']];
  const STATUTS = { a_planifier: 'À planifier', planifiee: 'Planifiée', en_route: 'En route vers A', pris_en_charge: 'Pris en charge', en_convoi: 'En convoi', livree: 'Livrée', facturee: 'Facturée' };
  const ORDRE = ['a_planifier', 'planifiee', 'en_route', 'pris_en_charge', 'en_convoi', 'livree', 'facturee'];
  const PHOTOS = ['Avant', 'Arrière', 'Côté gauche', 'Côté droit', 'Compteur', 'Jauge', 'Intérieur', 'Coffre'];
  const ZONES = [['pcav', 'Pare-choc avant'], ['capot', 'Capot'], ['toit', 'Toit'], ['coffre', 'Coffre'], ['pcar', 'Pare-choc arrière'], ['avg', 'Aile avant gauche'], ['avd', 'Aile avant droite'], ['pavg', 'Porte avant gauche'], ['pavd', 'Porte avant droite'], ['parg', 'Porte arrière gauche'], ['pard', 'Porte arrière droite'], ['arg', 'Aile arrière gauche'], ['ard', 'Aile arrière droite']];
  const DEGATS = ['', 'Rayure', 'Bosse', 'Choc / casse'];

  const distKm = (a, b) => { const R = 6371, r = x => x * Math.PI / 180, A = VILLES[a], B = VILLES[b], dLa = r(B[0] - A[0]), dLo = r(B[1] - A[1]); const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(A[0])) * Math.cos(r(B[0])) * Math.sin(dLo / 2) ** 2; return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 1.27); };
  const prixMission = (clientId, km, plateau) => { const c = CLIENTS.find(x => x.id === clientId) || CLIENTS[0]; return Math.round((c.forfait + km * c.km + (plateau ? 90 : 0)) * 100) / 100; };
  const dureeH = km => km / 78;
  const immat = n => { const L = 'ABCDEFGHJKLMNPQRSTVWXYZ'; return L[n % 23] + L[(n * 7) % 23] + '-' + pad(100 + (n * 37) % 899).slice(-3) + '-' + L[(n * 3) % 23] + L[(n * 11) % 23]; };

  function seed() {
    let s = 7; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const pick = a => a[Math.floor(rnd() * a.length)];
    const villes = Object.keys(VILLES), today = ymd(), missions = [];
    const ajout = (o) => {
      const n = missions.length + 1, va = o.a || pick(villes); let vb = o.b || pick(villes); while (vb === va) vb = pick(villes);
      const km = distKm(va, vb), cl = o.client || pick(CLIENTS).id, v = pick(VEHICULES), plateau = o.plateau || (rnd() < .12);
      const m = { id: 'CV-' + today.slice(5, 7) + today.slice(8) + '-' + pad(n).padStart(3, '0'), client: cl, type: plateau ? 'Plateau' : 'Convoyage route', vehicule: { marque: v[0], modele: v[1], energie: v[2], immat: immat(n * 13) },
        a: { ville: va, adresse: pick(RUES), contact: 'Accueil agence', tel: '04 90 00 00 ' + pad(n) }, b: { ville: vb, adresse: pick(RUES), contact: 'Réception', tel: '04 75 00 00 ' + pad(n) },
        date: o.date, heure: o.heure || pad(7 + Math.floor(rnd() * 10)) + ':' + pick(['00', '15', '30', '45']), convoyeur: o.conv === undefined ? pick(CONVOYEURS).id : o.conv, statut: o.statut, km, prix: prixMission(cl, km, plateau),
        progress: o.progress || 0, pvA: null, pvB: null, frais: [], historique: [], alerte: o.alerte || '', note: '' };
      const done = ORDRE.indexOf(m.statut);
      if (done >= 3) m.pvA = pvFictif(m, 0, rnd);
      if (done >= 5) { m.pvB = pvFictif(m, 1, rnd); m.frais = rnd() < .6 ? [{ type: 'Carburant', montant: Math.round(30 + rnd() * 50), photo: '' }, ...(km > 150 ? [{ type: 'Train retour', montant: Math.round(25 + rnd() * 45), photo: '' }] : [])] : []; }
      const h = [['Mission créée', -3]]; if (done >= 1) h.push(['Assignée à ' + (CONVOYEURS.find(c => c.id === m.convoyeur) || {}).nom, -2]);
      if (done >= 2) h.push(['Convoyeur en route vers le point A', -1]); if (done >= 3) h.push(['Véhicule pris en charge · PV signé', 0]); if (done >= 5) h.push(['Véhicule livré · PV signé', 1]);
      m.historique = h.map(([t]) => ({ at: m.date + 'T' + m.heure, txt: t }));
      missions.push(m); return m;
    };
    // Historique : 3 semaines de missions livrées / facturées
    for (let d = -21; d < 0; d++) { const n = 2 + Math.floor(rnd() * 3); for (let i = 0; i < n; i++) ajout({ date: addDays(today, d), statut: d < -6 ? 'facturee' : 'livree' }); }
    // Aujourd'hui
    ajout({ date: today, heure: '07:30', statut: 'livree', conv: 'k2', a: 'Avignon', b: 'Marseille' });
    ajout({ date: today, heure: '08:00', statut: 'livree', conv: 'k4', a: 'Marseille', b: 'Toulon', alerte: 'Rayure signalée à la livraison (porte arrière droite)' });
    ajout({ date: today, heure: '09:15', statut: 'en_convoi', conv: 'k3', a: 'Lyon', b: 'Grenoble', progress: .55 });
    ajout({ date: today, heure: '10:00', statut: 'en_convoi', conv: 'k6', a: 'Nîmes', b: 'Montpellier', progress: .3, client: 'c2' });
    ajout({ date: today, heure: '10:30', statut: 'en_convoi', conv: 'k5', a: 'Valence', b: 'Saint-Étienne', progress: .72, client: 'c1' });
    ajout({ date: today, heure: '11:30', statut: 'pris_en_charge', conv: 'k7', a: 'Grenoble', b: 'Lyon' });
    ajout({ date: today, heure: '13:00', statut: 'en_route', conv: 'k2', a: 'Marseille', b: 'Aix-en-Provence' });
    ajout({ date: today, heure: '14:00', statut: 'planifiee', conv: 'k1', a: 'Montélimar', b: 'Lyon', client: 'c1' });
    ajout({ date: today, heure: '15:30', statut: 'planifiee', conv: 'k4', a: 'Toulon', b: 'Nice', client: 'c2', plateau: true });
    ajout({ date: today, heure: '16:00', statut: 'a_planifier', conv: null, a: 'Orange', b: 'Avignon', client: 'c6' });
    ajout({ date: today, heure: '17:00', statut: 'a_planifier', conv: null, a: 'Bollène', b: 'Valence', client: 'c3' });
    // À venir
    for (let d = 1; d <= 6; d++) { const n = 2 + Math.floor(rnd() * 3); for (let i = 0; i < n; i++) ajout({ date: addDays(today, d), statut: rnd() < .3 ? 'a_planifier' : 'planifiee', conv: undefined }); }
    ajout({ date: addDays(today, 1), heure: '08:30', statut: 'planifiee', conv: 'k1', a: 'Lyon', b: 'Orange', client: 'c4' });
    missions.filter(m => m.statut === 'a_planifier').forEach(m => { m.convoyeur = null; });
    // Factures déjà émises
    const fact = {}; missions.filter(m => m.statut === 'facturee').forEach(m => { (fact[m.client] = fact[m.client] || []).push(m); });
    let nf = 27; const factures = Object.entries(fact).map(([cl, ms]) => { const ht = ms.reduce((a, m) => a + m.prix, 0); const f = { id: 'FA-2026-' + pad(nf++).padStart(3, '0'), client: cl, date: addDays(today, -6), missions: ms.map(m => m.id), ht, payee: rnd() < .6 }; ms.forEach(m => { m.facture = f.id; }); return f; });
    return { missions, factures, v: 1 };
  }
  function pvFictif(m, i, rnd) {
    const photos = {}; PHOTOS.forEach(p => { photos[p] = 'fictif'; });
    const dommages = {}; if (rnd() < .35) dommages[ZONES[Math.floor(rnd() * ZONES.length)][0]] = 1 + Math.floor(rnd() * 2);
    return { photos, dommages, km: 12000 + Math.floor(rnd() * 60000) + (i ? m.km : 0), carbu: 3 + Math.floor(rnd() * 5), sig: 'fictive', signataire: i ? m.b.contact : m.a.contact, at: m.date + 'T' + m.heure, remarques: '' };
  }

  let D;
  try { D = JSON.parse(localStorage.getItem('convoy_demo_v1') || 'null'); } catch (e) { D = null; }
  if (!D || D.v !== 1 || !D.missions.some(m => m.date === ymd())) D = seed();
  const save = () => { try { localStorage.setItem('convoy_demo_v1', JSON.stringify(D)); } catch (e) { toast('Mémoire du navigateur pleine : réinitialise la démo.'); } };
  function importerSite() {
    let q = []; try { q = JSON.parse(localStorage.getItem('convoy_demo_cmds') || '[]'); } catch (e) { }
    let n = 0;
    q.forEach(c => { if (D.missions.some(m => m.id === c.id)) return; D.missions.push(Object.assign({ convoyeur: null, statut: 'a_planifier', progress: 0, pvA: null, pvB: null, frais: [], alerte: '', note: '' }, c, { historique: [{ at: c.creeLe, txt: 'Commande passée sur le site web (' + c.web.nom + ')' }] })); n++; });
    try { localStorage.removeItem('convoy_demo_cmds'); } catch (e) { }
    return n;
  }
  const nbImport = importerSite();
  save();
  $('#reset').onclick = () => { try { localStorage.removeItem('convoy_demo_v1'); } catch (x) { } D = seed(); save(); route(); toast('Démo réinitialisée'); };
  window.addEventListener('storage', e => { if (e.key === 'convoy_demo_cmds' && e.newValue) { const n = importerSite(); if (n) { save(); render(); toast('🌐 Nouvelle commande reçue depuis le site web'); } return; } if (e.key === 'convoy_demo_v1') { try { D = JSON.parse(e.newValue); render(); } catch (x) { } } });

  const M = id => D.missions.find(m => m.id === id);
  const CL = id => CLIENTS.find(c => c.id === id) || (id && id.startsWith('web:') ? { id, nom: id.slice(4), type: 'Client web', contact: id.slice(4), tel: '', couleur: '#0FA3B1', forfait: 60, km: 1.1 } : {});
  const CV = id => CONVOYEURS.find(c => c.id === id);
  const av = (c, sz = 32) => c ? `<span class="av" style="background:${c.couleur};width:${sz}px;height:${sz}px">${c.nom.split(' ').map(x => x[0]).join('')}</span>` : `<span class="av" style="background:#C3CCD8;width:${sz}px;height:${sz}px">?</span>`;
  const tagSt = s => `<span class="tag st-${s === 'en_route' ? 'en_route' : s}"><i></i>${STATUTS[s]}</span>`;
  const trajet = m => `<div class="trajet"><span class="a">${esc(m.a.ville)}</span><span class="b">${esc(m.b.ville)}</span></div>`;
  const veh = m => `${esc(m.vehicule.marque)} ${esc(m.vehicule.modele)}`;
  function toast(t) { $$('.toast').forEach(x => x.remove()); const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2800); }
  const histo = (m, txt) => { m.historique.push({ at: new Date().toISOString(), txt }); };
  const posMission = m => { const A = VILLES[m.a.ville], B = VILLES[m.b.ville]; const p = m.statut === 'en_convoi' ? m.progress : ['pris_en_charge', 'en_route'].includes(m.statut) ? 0 : m.statut === 'livree' ? 1 : 0; return [A[0] + (B[0] - A[0]) * p, A[1] + (B[1] - A[1]) * p]; };
  const eta = m => { const reste = m.km * (1 - (m.progress || 0)); const d = new Date(Date.now() + dureeH(reste) * 3600e3); return hm(d).replace(':', 'h'); };

  /* ---------- Routage ---------- */
  let maps = [];
  function route() { render(true); }
  function render(top) {
    maps.forEach(x => x.remove()); maps = [];
    const h = location.hash.replace(/^#\/?/, ''), [v, ...p] = h.split('/');
    const mode = v === 'convoyeur' ? 'convoyeur' : v === 'suivi' ? 'suivi' : 'bureau';
    $$('.demo-bar .sw a').forEach(a => a.classList.toggle('on', a.dataset.mode === mode));
    const y = window.scrollY;
    if (mode === 'convoyeur') $('#root').innerHTML = appConvoyeur(p);
    else if (mode === 'suivi') $('#root').innerHTML = suivi(p[0]);
    else $('#root').innerHTML = bureau(v || 'dashboard', p);
    if (!top) window.scrollTo(0, y); else window.scrollTo(0, 0);
    apres.forEach(f => f()); apres = [];
  }
  let apres = [];
  window.addEventListener('hashchange', () => { fermerPanneau(); route(); });
  const A = {};
  document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (!el) return; e.preventDefault(); const f = A[el.dataset.a]; if (f) f(el.dataset, el, e); });

  /* ================= BUREAU ================= */
  const NAV = [['dashboard', 'Tableau de bord', 'dash'], ['missions', 'Missions', 'route'], ['planning', 'Planning', 'cal'], ['carte', 'Carte en direct', 'map'], ['convoyeurs', 'Convoyeurs', 'users'], ['clients', 'Clients', 'build'], ['facturation', 'Facturation', 'euro']];
  function bureau(v, p) {
    const vue = VUES[v] ? v : 'dashboard', apl = D.missions.filter(m => m.statut === 'a_planifier').length;
    return `<div class="app"><aside class="side"><div class="logo"><span class="m">${ic('car')}</span><div><b>${esc(SOCIETE)}</b><span>Bureau</span></div></div>
      <nav class="nav">${NAV.map(([k, l, i]) => `<a href="#/${k === 'dashboard' ? '' : k}" class="${vue === k ? 'on' : ''}">${ic(i)}${l}${k === 'missions' && apl ? `<span class="pip">${apl}</span>` : ''}</a>`).join('')}</nav>
      <div class="me"><span class="av" style="background:#33507A">IB</span><div><b style="color:#fff;font-size:14px">Ibrahim</b><div class="small" style="color:#7F92AB">Gérant</div></div></div></aside>
      <main class="bureau">${VUES[vue](p)}</main>
      <nav class="tabbar">${NAV.filter(n => n[0] !== 'clients' && n[0] !== 'convoyeurs').map(([k, l, i]) => `<a href="#/${k === 'dashboard' ? '' : k}" class="${vue === k ? 'on' : ''}">${ic(i)}${l.split(' ')[0]}</a>`).join('')}</nav></div>`;
  }
  const VUES = {};
  VUES.dashboard = () => {
    const t = ymd(), auj = D.missions.filter(m => m.date === t), mois = t.slice(0, 7);
    const enCours = D.missions.filter(m => ['en_route', 'pris_en_charge', 'en_convoi'].includes(m.statut));
    const livMois = D.missions.filter(m => m.date.slice(0, 7) === mois && ['livree', 'facturee'].includes(m.statut));
    const ca = livMois.reduce((a, m) => a + m.prix, 0), km = livMois.reduce((a, m) => a + m.km, 0);
    const frais = D.missions.filter(m => m.statut === 'livree').reduce((a, m) => a + m.frais.reduce((b, f) => b + f.montant, 0), 0);
    const aFact = D.missions.filter(m => m.statut === 'livree'), alertes = D.missions.filter(m => m.alerte && m.date >= addDays(t, -2));
    const kpi = (l, v, s, i, c, c2) => `<div class="card kpi"><span class="ic" style="background:${c2};color:${c}">${ic(i)}</span><div class="l">${l}</div><b>${v}</b><div class="s">${s}</div></div>`;
    apres.push(() => carte('mapDash', enCours, false));
    return `<div class="head"><div><h1>Bonjour Ibrahim 👋</h1><p>${cap(new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }))} · ${auj.length} missions aujourd’hui</p></div><button class="btn or" data-a="nouvelle">${ic('plus')} Nouvelle mission</button></div>
      <div class="grid g4" style="margin-bottom:14px">
        ${kpi('En cours', enCours.length, 'véhicules sur la route', 'car', 'var(--orange)', 'var(--orange2)')}
        ${kpi('Aujourd’hui', auj.filter(m => ['livree', 'facturee'].includes(m.statut)).length + ' / ' + auj.length, 'missions livrées', 'check', 'var(--vert)', 'var(--vert2)')}
        ${kpi('CA du mois', eur0(ca), livMois.length + ' missions · ' + km.toLocaleString('fr-FR') + ' km', 'euro', 'var(--bleu)', 'var(--bleu2)')}
        ${kpi('À facturer', eur0(aFact.reduce((a, m) => a + m.prix, 0)), aFact.length + ' missions livrées · ' + eur0(frais) + ' de frais', 'receipt', 'var(--violet)', 'var(--violet2)')}</div>
      <div class="grid g2"><div class="card" style="padding:0;overflow:hidden"><div class="card-h" style="padding:16px 18px 0"><h3>Véhicules en mouvement</h3><a class="btn gh sm" href="#/carte">Plein écran</a></div><div id="mapDash" class="map" style="height:360px;border:0;border-radius:0;margin-top:12px"></div></div>
        <div class="grid" style="align-content:start">
          <div class="card"><div class="card-h"><h3>À traiter</h3></div>
            ${D.missions.filter(m => m.statut === 'a_planifier').sort((a, b) => (b.web ? 1 : 0) - (a.web ? 1 : 0)).slice(0, 5).map(m => `<div class="row" style="padding:9px 0;border-bottom:1px solid var(--ligne);cursor:pointer" data-a="ouvrir" data-id="${m.id}"><span class="tag ${m.web ? 'web' : 'st-a_planifier'}">${m.web ? '🌐 Commande web' : 'Sans convoyeur'}</span><div class="grow small"><b>${esc(m.a.ville)} → ${esc(m.b.ville)}</b><div class="muted">${jourFr(m.date)} ${m.heure}</div></div></div>`).join('') || '<p class="muted small">Tout est planifié ✓</p>'}
            ${alertes.map(m => `<div class="row" style="padding:9px 0;cursor:pointer" data-a="ouvrir" data-id="${m.id}"><span class="tag alerte">${ic('alert', 13)} Alerte</span><div class="grow small">${esc(m.alerte)}</div></div>`).join('')}</div>
          <div class="card"><div class="card-h"><h3>Convoyeurs aujourd’hui</h3></div>${CONVOYEURS.map(c => { const ms = auj.filter(m => m.convoyeur === c.id), cur = ms.find(m => ['en_route', 'pris_en_charge', 'en_convoi'].includes(m.statut)); return `<div class="row" style="padding:6px 0">${av(c, 30)}<div class="grow small"><b>${c.nom}</b><div class="muted">${cur ? STATUTS[cur.statut] + ' · ' + cur.a.ville + ' → ' + cur.b.ville : ms.length ? ms.length + ' mission(s) prévue(s)' : 'Disponible'}</div></div>${cur ? '<span class="tag st-en_convoi"><i></i>Actif</span>' : ''}</div>`; }).join('')}</div></div></div>
      <div class="card" style="margin-top:14px"><div class="card-h"><h3>Missions du jour</h3><a class="btn gh sm" href="#/missions">Tout voir</a></div>${tableMissions(auj)}</div>`;
  };
  function tableMissions(l) {
    if (!l.length) return '<p class="muted">Aucune mission.</p>';
    return `<div class="tw"><table><thead><tr><th>Réf.</th><th>Date</th><th>Trajet</th><th>Véhicule</th><th>Client</th><th>Convoyeur</th><th>Statut</th><th style="text-align:right">Prix HT</th></tr></thead><tbody>
      ${l.map(m => `<tr data-a="ouvrir" data-id="${m.id}"><td><b>${m.id}</b>${m.type === 'Plateau' ? '<div class="small muted">Plateau</div>' : ''}${m.web ? '<div><span class="tag web">🌐 Site web</span></div>' : ''}</td><td class="small">${jourFr(m.date)}<br><b>${m.heure}</b></td><td>${trajet(m)}<div class="small muted">${m.km} km</div></td><td class="small"><b>${veh(m)}</b><div class="muted">${m.vehicule.immat}</div></td><td class="small">${esc(CL(m.client).nom)}</td><td>${m.convoyeur ? `<div class="row" style="gap:7px">${av(CV(m.convoyeur), 26)}<span class="small">${CV(m.convoyeur).nom}</span></div>` : '<span class="tag st-a_planifier">À assigner</span>'}</td><td>${tagSt(m.statut)}${m.alerte ? ` <span class="tag alerte">${ic('alert', 12)}</span>` : ''}</td><td style="text-align:right;font-weight:700">${eur(m.prix)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  let filtre = 'actives', recherche = '';
  VUES.missions = () => {
    const t = ymd();
    const F = { actives: m => !['livree', 'facturee'].includes(m.statut), aujourd: m => m.date === t, a_planifier: m => m.statut === 'a_planifier', en_cours: m => ['en_route', 'pris_en_charge', 'en_convoi'].includes(m.statut), livrees: m => ['livree', 'facturee'].includes(m.statut), toutes: () => true };
    let l = D.missions.filter(F[filtre]);
    if (recherche) { const q = recherche.toLowerCase(); l = l.filter(m => [m.id, m.a.ville, m.b.ville, m.vehicule.immat, m.vehicule.marque, m.vehicule.modele, CL(m.client).nom, (CV(m.convoyeur) || {}).nom].join(' ').toLowerCase().includes(q)); }
    l.sort((a, b) => filtre === 'livrees' ? (b.date + b.heure).localeCompare(a.date + a.heure) : (a.date + a.heure).localeCompare(b.date + b.heure));
    apres.push(() => { const i = $('#rech'); if (i) { i.oninput = () => { recherche = i.value; const pos = i.selectionStart; render(); const j = $('#rech'); j.focus(); j.setSelectionRange(pos, pos); }; } });
    return `<div class="head"><div><h1>Missions</h1><p>${l.length} mission(s)</p></div><div class="row"><input class="input" id="rech" placeholder="Rechercher : immat, ville, client…" value="${esc(recherche)}" style="width:260px"><button class="btn or" data-a="nouvelle">${ic('plus')} Nouvelle</button></div></div>
      <div class="chips">${[['actives', 'En cours et à venir'], ['aujourd', 'Aujourd’hui'], ['a_planifier', 'À planifier'], ['en_cours', 'Sur la route'], ['livrees', 'Livrées'], ['toutes', 'Toutes']].map(([k, n]) => `<button class="chip ${filtre === k ? 'on' : ''}" data-a="filtre" data-v="${k}">${n}</button>`).join('')}</div>
      <div class="card" style="padding:6px 6px">${tableMissions(l.slice(0, 80))}</div>`;
  };
  A.filtre = d => { filtre = d.v; render(); };
  VUES.planning = () => {
    const t = ymd(), jours = [...Array(3)].map((_, i) => addDays(t, i)), H0 = 6, H1 = 20;
    return `<div class="head"><div><h1>Planning</h1><p>Glissez un œil sur la journée de chaque convoyeur. Touchez un bloc pour l’ouvrir.</p></div><button class="btn or" data-a="nouvelle">${ic('plus')} Nouvelle mission</button></div>
      ${jours.map(j => `<div class="card" style="margin-bottom:14px;padding:12px"><h3 style="margin:4px 6px 10px">${cap(jourFr(j, { weekday: 'long', day: 'numeric', month: 'long' }))}</h3><div class="tw"><div class="plan">
        <div class="h"></div>${[...Array(H1 - H0)].map((_, i) => `<div class="h">${H0 + i}h</div>`).join('')}
        ${CONVOYEURS.map(c => `<div class="n">${av(c, 26)}${c.nom}</div><div class="c" style="grid-column:span ${H1 - H0}">${D.missions.filter(m => m.date === j && m.convoyeur === c.id).map(m => { const [h, mi] = m.heure.split(':').map(Number), deb = (h + mi / 60 - H0) / (H1 - H0) * 100, larg = Math.max(6, dureeH(m.km) / (H1 - H0) * 100); return `<div class="bloc" data-a="ouvrir" data-id="${m.id}" style="left:${deb}%;width:${larg}%;background:${['livree', 'facturee'].includes(m.statut) ? '#9AA6B6' : c.couleur}" title="${esc(m.a.ville + ' → ' + m.b.ville)}">${m.heure} ${esc(m.a.ville)} → ${esc(m.b.ville)}</div>`; }).join('')}</div>`).join('')}
        <div class="n" style="color:var(--rouge)">À assigner</div><div class="c" style="grid-column:span ${H1 - H0}">${D.missions.filter(m => m.date === j && !m.convoyeur).map(m => { const [h, mi] = m.heure.split(':').map(Number); return `<div class="bloc" data-a="ouvrir" data-id="${m.id}" style="left:${(h + mi / 60 - H0) / (H1 - H0) * 100}%;width:${Math.max(6, dureeH(m.km) / (H1 - H0) * 100)}%;background:repeating-linear-gradient(45deg,#E0433A,#E0433A 6px,#EE6A62 6px,#EE6A62 12px)">${m.heure} ${esc(m.a.ville)} → ${esc(m.b.ville)}</div>`; }).join('')}</div>
      </div></div></div>`).join('')}`;
  };
  VUES.carte = () => {
    const l = D.missions.filter(m => ['en_route', 'pris_en_charge', 'en_convoi'].includes(m.statut));
    apres.push(() => carte('map', l, true));
    return `<div class="head"><div><h1>Carte en direct</h1><p>${l.length} véhicule(s) suivi(s) · position mise à jour automatiquement depuis le téléphone des convoyeurs</p></div></div>
      <div class="grid g2"><div id="map"></div><div class="card" style="align-self:start">${l.map(m => `<div class="row" style="padding:10px 0;border-bottom:1px solid var(--ligne);cursor:pointer" data-a="ouvrir" data-id="${m.id}">${av(CV(m.convoyeur), 34)}<div class="grow"><b>${CV(m.convoyeur).nom}</b><div class="small muted">${veh(m)} · ${esc(m.a.ville)} → ${esc(m.b.ville)}</div><div class="small">${tagSt(m.statut)} ${m.statut === 'en_convoi' ? '· arrivée ≈ ' + eta(m) : ''}</div></div></div>`).join('')}</div></div>`;
  };
  function carte(id, l, fit) {
    const el = document.getElementById(id); if (!el || !window.L) return;
    const map = L.map(el, { zoomControl: true, scrollWheelZoom: false }).setView([44.6, 5.0], 7); maps.push(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(map);
    const pts = [];
    for (const m of l) {
      const A2 = VILLES[m.a.ville], B2 = VILLES[m.b.ville], c = CV(m.convoyeur) || { couleur: '#66748A', nom: '?' };
      L.polyline([A2, B2], { color: c.couleur, weight: 4, opacity: .35, dashArray: '6 8' }).addTo(map);
      L.circleMarker(A2, { radius: 5, color: '#2F6FED', fillOpacity: 1 }).addTo(map); L.circleMarker(B2, { radius: 5, color: '#FF6A1A', fillOpacity: 1 }).addTo(map);
      const p = posMission(m); pts.push(p, A2, B2);
      L.marker(p, { icon: L.divIcon({ className: '', html: `<div class="pinv" style="background:${c.couleur}">${c.nom.split(' ').map(x => x[0]).join('')}</div>`, iconSize: [34, 34], iconAnchor: [17, 17] }) }).addTo(map)
        .bindPopup(`<b>${esc(c.nom)}</b><br>${veh(m)} · ${m.vehicule.immat}<br>${esc(m.a.ville)} → ${esc(m.b.ville)}<br>${STATUTS[m.statut]}${m.statut === 'en_convoi' ? ' · arrivée ≈ ' + eta(m) : ''}`);
    }
    if (pts.length) map.fitBounds(pts, { padding: [30, 30] });
  }
  VUES.convoyeurs = () => {
    const t = ymd(), mois = t.slice(0, 7);
    return `<div class="head"><div><h1>Convoyeurs</h1><p>${CONVOYEURS.length} convoyeurs · disponibilités et performances</p></div><button class="btn or" data-a="toastDemo" data-t="Ajout d’un convoyeur : il reçoit un SMS pour installer l’app.">${ic('plus')} Ajouter</button></div>
      <div class="grid g3">${CONVOYEURS.map(c => { const ms = D.missions.filter(m => m.convoyeur === c.id), mo = ms.filter(m => m.date.slice(0, 7) === mois && ['livree', 'facturee'].includes(m.statut)), cur = ms.find(m => ['en_route', 'pris_en_charge', 'en_convoi'].includes(m.statut)), fr = ms.filter(m => m.statut === 'livree').reduce((a, m) => a + m.frais.reduce((b, f) => b + f.montant, 0), 0);
        return `<div class="card"><div class="row">${av(c, 46)}<div class="grow"><h3>${c.nom}</h3><div class="small muted">Basé à ${c.ville} · ★ ${c.note}</div></div>${cur ? '<span class="tag st-en_convoi"><i></i>En mission</span>' : '<span class="tag st-livree"><i></i>Dispo</span>'}</div>
          <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0"><div><b style="font:700 20px var(--f-t)">${mo.length}</b><div class="small muted">missions ce mois</div></div><div><b style="font:700 20px var(--f-t)">${mo.reduce((a, m) => a + m.km, 0).toLocaleString('fr-FR')}</b><div class="small muted">km</div></div><div><b style="font:700 20px var(--f-t)">${eur0(fr)}</b><div class="small muted">frais à rembourser</div></div></div>
          <div class="small muted" style="margin-bottom:10px">Permis ✓ · Pièce d’identité ✓ · Contrat ✓</div>
          <div class="row"><a class="btn gh sm grow" href="tel:${c.tel.replace(/\s/g, '')}">${ic('phone')} Appeler</a><a class="btn sm grow" href="#/convoyeur">${ic('phone')} Voir son app</a></div></div>`; }).join('')}</div>`;
  };
  VUES.clients = () => `<div class="head"><div><h1>Clients donneurs d’ordre</h1><p>Tarifs négociés appliqués automatiquement au calcul du prix</p></div><button class="btn or" data-a="toastDemo" data-t="Ajout d’un client : tarif, contacts et accès à son espace de suivi.">${ic('plus')} Ajouter</button></div>
    <div class="card" style="padding:6px"><div class="tw"><table><thead><tr><th>Client</th><th>Type</th><th>Contact</th><th>Tarif</th><th>Missions</th><th style="text-align:right">CA total</th></tr></thead><tbody>
    ${CLIENTS.map(c => { const ms = D.missions.filter(m => m.client === c.id && ['livree', 'facturee'].includes(m.statut)); return `<tr><td><div class="row"><span class="av" style="background:${c.couleur}">${c.nom[0]}</span><b>${esc(c.nom)}</b></div></td><td>${c.type}</td><td class="small">${c.contact}<div class="muted">${c.tel}</div></td><td class="small">${c.forfait} € + ${c.km.toLocaleString('fr-FR')} €/km</td><td>${ms.length}</td><td style="text-align:right;font-weight:700">${eur0(ms.reduce((a, m) => a + m.prix, 0))}</td></tr>`; }).join('')}</tbody></table></div></div>`;
  VUES.facturation = () => {
    const aF = D.missions.filter(m => m.statut === 'livree'), parCl = {}; aF.forEach(m => { (parCl[m.client] = parCl[m.client] || []).push(m); });
    return `<div class="head"><div><h1>Facturation</h1><p>Les missions livrées arrivent ici automatiquement, prêtes à facturer</p></div></div>
      <div class="grid g2" style="align-items:start"><div class="card"><div class="card-h"><h3>À facturer</h3><span class="tag st-livree">${eur0(aF.reduce((a, m) => a + m.prix, 0))} HT</span></div>
        ${Object.entries(parCl).map(([cl, ms]) => `<div class="row" style="padding:12px 0;border-bottom:1px solid var(--ligne)"><span class="av" style="background:${CL(cl).couleur}">${CL(cl).nom[0]}</span><div class="grow"><b>${esc(CL(cl).nom)}</b><div class="small muted">${ms.length} mission(s) · ${ms.reduce((a, m) => a + m.km, 0)} km</div></div><b>${eur(ms.reduce((a, m) => a + m.prix, 0))}</b><button class="btn or sm" data-a="facturer" data-cl="${cl}">Facturer</button></div>`).join('') || '<p class="muted">Rien à facturer pour le moment.</p>'}</div>
        <div class="card"><div class="card-h"><h3>Factures émises</h3></div>${D.factures.slice().reverse().map(f => `<div class="row" style="padding:10px 0;border-bottom:1px solid var(--ligne);cursor:pointer" data-a="voirFacture" data-id="${f.id}"><div class="grow"><b>${f.id}</b><div class="small muted">${esc(CL(f.client).nom)} · ${jourFr(f.date)}</div></div><b>${eur(f.ht * 1.2)}</b>${f.payee ? '<span class="tag st-livree">Payée</span>' : '<span class="tag" style="background:var(--jaune2);color:#A67400">En attente</span>'}</div>`).join('')}</div></div>`;
  };
  A.toastDemo = d => toast(d.t);

  /* Panneau de détail */
  function panneau(html, mount) {
    fermerPanneau();
    const v = document.createElement('div'); v.className = 'voile'; v.onclick = fermerPanneau;
    const p = document.createElement('div'); p.className = 'panneau'; p.innerHTML = html;
    document.body.append(v, p); if (mount) mount(p);
  }
  function fermerPanneau() { $$('.voile,.panneau').forEach(x => x.remove()); }
  A.fermer = fermerPanneau;
  A.ouvrir = d => ouvrirMission(d.id);
  function etapesTl(m) {
    const E = [['planifiee', 'Planifiée', 'Assignée au convoyeur'], ['en_route', 'En route vers le point A', ''], ['pris_en_charge', 'Prise en charge', 'PV de départ signé'], ['en_convoi', 'En convoi', ''], ['livree', 'Livrée', 'PV de livraison signé'], ['facturee', 'Facturée', '']];
    const i = ORDRE.indexOf(m.statut);
    return `<ul class="tl">${E.map(([k, t, s]) => { const j = ORDRE.indexOf(k); return `<li class="${j < i || (j === i && k === 'facturee') || (j === i && k === 'livree') ? 'ok' : j === i ? 'cur' : ''}"><span class="d">${j <= i ? ic('check') : ''}</span><div><div class="t">${t}</div>${s ? `<div class="s">${s}</div>` : ''}</div></li>`; }).join('')}</ul>`;
  }
  function pvHtml(pv, titre) {
    if (!pv) return '';
    const dmg = Object.entries(pv.dommages || {}).filter(([, v]) => v);
    return `<div class="card"><div class="card-h"><h3>${titre}</h3><span class="small muted">${new Date(pv.at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></div>
      <div class="photos">${PHOTOS.map(p => `<div class="p" style="${pv.photos[p] && pv.photos[p] !== 'fictif' ? `background-image:url(${pv.photos[p]})` : ''}">${pv.photos[p] === 'fictif' ? ic('cam', 20) : ''}<span>${p}</span></div>`).join('')}</div>
      <dl class="kv" style="margin-top:12px"><dt>Kilométrage</dt><dd>${(+pv.km).toLocaleString('fr-FR')} km</dd><dt>Carburant / charge</dt><dd>${pv.carbu}/8</dd><dt>Dommages</dt><dd>${dmg.length ? dmg.map(([z, v]) => `${(ZONES.find(x => x[0] === z) || [, z])[1]} : ${DEGATS[v]}`).join(', ') : 'Aucun'}</dd><dt>Signé par</dt><dd>${esc(pv.signataire || '')}</dd></dl>
      ${pv.sig && pv.sig !== 'fictive' ? `<img src="${pv.sig}" alt="Signature" style="height:70px;margin-top:8px">` : '<div class="small muted" style="margin-top:8px;font-style:italic">✍️ Signature électronique enregistrée</div>'}</div>`;
  }
  function ouvrirMission(id) {
    const m = M(id); if (!m) return; const c = CL(m.client), cv = CV(m.convoyeur), frais = m.frais.reduce((a, f) => a + f.montant, 0);
    panneau(`<div class="ph"><div class="grow"><div class="small muted">${m.id} · ${m.type}</div><h2>${esc(m.a.ville)} → ${esc(m.b.ville)}</h2></div>${tagSt(m.statut)}<button class="x" data-a="fermer">${ic('x')}</button></div>
      <div class="pc">
        ${m.alerte ? `<div class="card" style="background:var(--rouge2);border-color:#F6C7C3"><b style="color:var(--rouge)">${ic('alert', 16)} ${esc(m.alerte)}</b><div class="small" style="margin-top:4px">Photos et PV horodatés disponibles pour le litige.</div></div>` : ''}
        ${m.web ? `<div class="card" style="background:#E6F7F8;border-color:#BFE7EA"><b>🌐 Commande passée sur le site</b><div class="small" style="margin-top:4px">${esc(m.web.nom)} · ${esc(m.web.tel)} · ${esc(m.web.email)}${m.web.message ? '<br>« ' + esc(m.web.message) + ' »' : ''}</div><div class="small muted" style="margin-top:4px">Le client a reçu son lien de suivi par e-mail. Il ne reste qu'à assigner un convoyeur.</div></div>` : ''}
        <div class="card"><dl class="kv"><dt>Client</dt><dd>${esc(c.nom)}</dd><dt>Véhicule</dt><dd>${veh(m)} · ${m.vehicule.energie}</dd><dt>Immatriculation</dt><dd>${m.vehicule.immat}</dd><dt>Date</dt><dd>${cap(jourFr(m.date, { weekday: 'long', day: 'numeric', month: 'long' }))} · ${m.heure}</dd><dt>Distance</dt><dd>${m.km} km · ≈ ${Math.floor(dureeH(m.km))} h ${pad(Math.round(dureeH(m.km) % 1 * 60))}</dd><dt>Prix HT</dt><dd style="color:var(--orange);font-size:17px">${eur(m.prix)}</dd>${frais ? `<dt>Frais convoyeur</dt><dd>${eur(frais)}</dd>` : ''}</dl></div>
        <div class="card"><div class="trajet" style="gap:10px;font-size:14.5px"><div class="a"><div><b>${esc(m.a.ville)}</b> · ${esc(m.a.adresse)}<div class="small muted">${esc(m.a.contact)} · ${m.a.tel}</div></div></div><div class="b"><div><b>${esc(m.b.ville)}</b> · ${esc(m.b.adresse)}<div class="small muted">${esc(m.b.contact)} · ${m.b.tel}</div></div></div></div><div id="mapM" class="map sm" style="margin-top:12px"></div></div>
        <div class="card"><div class="card-h"><h3>Convoyeur</h3></div>
          <div class="row">${av(cv, 40)}<div class="grow">${cv ? `<b>${cv.nom}</b><div class="small muted">${cv.tel} · ★ ${cv.note}</div>` : '<b style="color:var(--rouge)">Pas encore assigné</b>'}</div></div>
          ${['a_planifier', 'planifiee'].includes(m.statut) ? `<div class="row" style="margin-top:12px"><select class="input" id="assign"><option value="">Choisir un convoyeur…</option>${CONVOYEURS.map(k => { const occ = D.missions.filter(x => x.date === m.date && x.convoyeur === k.id).length; return `<option value="${k.id}" ${k.id === m.convoyeur ? 'selected' : ''}>${k.nom} — ${occ ? occ + ' mission(s) ce jour' : 'libre'} · ${k.ville}</option>`; }).join('')}</select><button class="btn or" data-a="assigner" data-id="${m.id}">Assigner</button></div><div class="small muted" style="margin-top:6px">Le convoyeur reçoit la mission sur son téléphone immédiatement.</div>` : ''}</div>
        <div class="card"><div class="card-h"><h3>Suivi</h3></div>${etapesTl(m)}</div>
        ${pvHtml(m.pvA, 'PV de prise en charge')}${pvHtml(m.pvB, 'PV de livraison')}
        ${m.frais.length ? `<div class="card"><div class="card-h"><h3>Notes de frais</h3><b>${eur(frais)}</b></div>${m.frais.map(f => `<div class="row" style="padding:6px 0">${f.photo ? `<img src="${f.photo}" style="width:40px;height:40px;object-fit:cover;border-radius:8px">` : `<span class="av" style="background:var(--violet2);color:var(--violet)">${ic('receipt', 16)}</span>`}<div class="grow">${f.type}</div><b>${eur(f.montant)}</b></div>`).join('')}</div>` : ''}
        <div class="card"><div class="card-h"><h3>Historique</h3></div>${m.historique.slice().reverse().map(h => `<div class="small" style="padding:5px 0;border-bottom:1px solid var(--ligne)"><b>${new Date(h.at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</b> · ${esc(h.txt)}</div>`).join('')}</div>
        <div class="row wrap noprint"><a class="btn gh" href="#/suivi/${m.id}" target="_blank">${ic('link')} Lien de suivi client</a>${m.pvA ? `<button class="btn gh" data-a="pdf" data-id="${m.id}">${ic('doc')} PV en PDF</button>` : ''}${m.statut === 'livree' ? `<button class="btn or" data-a="facturer" data-cl="${m.client}">${ic('euro')} Facturer</button>` : ''}</div>
      </div>`, () => {
      setTimeout(() => { const el = $('#mapM'); if (!el || !window.L) return; const mp = L.map(el, { zoomControl: false, scrollWheelZoom: false }); maps.push(mp); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OSM' }).addTo(mp); const A2 = VILLES[m.a.ville], B2 = VILLES[m.b.ville]; L.polyline([A2, B2], { color: '#FF6A1A', weight: 4, dashArray: '6 8' }).addTo(mp); L.circleMarker(A2, { radius: 7, color: '#2F6FED', fillOpacity: 1 }).addTo(mp); L.circleMarker(B2, { radius: 7, color: '#FF6A1A', fillOpacity: 1 }).addTo(mp); if (['en_convoi', 'pris_en_charge'].includes(m.statut)) L.marker(posMission(m), { icon: L.divIcon({ className: '', html: `<div class="pinv" style="background:${(cv || {}).couleur || '#66748A'}">🚗</div>`, iconSize: [34, 34], iconAnchor: [17, 17] }) }).addTo(mp); mp.fitBounds([A2, B2], { padding: [25, 25] }); }, 60);
    });
  }
  A.assigner = d => {
    const m = M(d.id), k = $('#assign').value; if (!k) return toast('Choisis un convoyeur');
    m.convoyeur = k; if (m.statut === 'a_planifier') m.statut = 'planifiee'; histo(m, 'Assignée à ' + CV(k).nom); save(); render(); ouvrirMission(m.id);
    toast('📲 ' + CV(k).nom + ' a reçu la mission sur son téléphone');
  };
  A.pdf = d => {
    const m = M(d.id);
    panneau(`<div class="ph noprint"><h2 class="grow">PV · ${m.id}</h2><button class="btn" onclick="window.print()">${ic('print')} Imprimer / PDF</button><button class="x" data-a="fermer">${ic('x')}</button></div>
      <div class="pc"><div class="doc"><div class="row" style="justify-content:space-between;align-items:flex-start"><div><h2>Procès-verbal de convoyage</h2><div class="muted">${m.id} · ${esc(SOCIETE)}</div></div><div style="text-align:right" class="small">${esc(CL(m.client).nom)}<br>${veh(m)} · ${m.vehicule.immat}</div></div>
      <hr style="border:0;border-top:1px solid var(--ligne);margin:16px 0"><p><b>Départ :</b> ${esc(m.a.adresse)}, ${esc(m.a.ville)}<br><b>Arrivée :</b> ${esc(m.b.adresse)}, ${esc(m.b.ville)}<br><b>Convoyeur :</b> ${(CV(m.convoyeur) || {}).nom || ''} · <b>Distance :</b> ${m.km} km</p>
      ${pvHtml(m.pvA, 'État des lieux au départ')}<div style="height:12px"></div>${pvHtml(m.pvB, 'État des lieux à la livraison')}
      <p class="small muted" style="margin-top:14px">Document généré automatiquement. Photos horodatées et géolocalisées conservées.</p></div></div>`);
  };
  A.facturer = d => {
    const ms = D.missions.filter(m => m.client === d.cl && m.statut === 'livree'); if (!ms.length) return;
    const n = D.factures.length + 27, f = { id: 'FA-2026-' + pad(n).padStart(3, '0'), client: d.cl, date: ymd(), missions: ms.map(m => m.id), ht: ms.reduce((a, m) => a + m.prix, 0), payee: false };
    ms.forEach(m => { m.statut = 'facturee'; m.facture = f.id; histo(m, 'Facturée (' + f.id + ')'); }); D.factures.push(f); save(); render(); voirFacture(f.id); toast('Facture ' + f.id + ' créée · prête à envoyer');
  };
  A.voirFacture = d => voirFacture(d.id);
  function voirFacture(id) {
    const f = D.factures.find(x => x.id === id), c = CL(f.client), ms = f.missions.map(M).filter(Boolean);
    const fraisRefact = 0;
    panneau(`<div class="ph noprint"><h2 class="grow">${f.id}</h2><button class="btn gh" onclick="window.print()">${ic('print')} PDF</button><button class="btn or" data-a="toastDemo" data-t="Facture envoyée par e-mail à ${esc(c.contact)}">${ic('send')} Envoyer</button><button class="x" data-a="fermer">${ic('x')}</button></div>
      <div class="pc"><div class="doc"><div class="row" style="justify-content:space-between;align-items:flex-start"><div><h2>${esc(SOCIETE)}</h2><div class="small muted">Convoyage de véhicules</div></div><div style="text-align:right"><h2>Facture</h2><div class="small">${f.id}<br>${new Date(f.date + 'T12:00').toLocaleDateString('fr-FR')}</div></div></div>
      <div style="margin:22px 0 16px" class="small"><b>Facturé à :</b><br>${esc(c.nom)}<br>${esc(c.contact)}</div>
      <table><thead><tr><th>Mission</th><th>Trajet</th><th>Véhicule</th><th style="text-align:right">HT</th></tr></thead><tbody>${ms.map(m => `<tr style="cursor:default"><td class="small">${m.id}<br>${new Date(m.date + 'T12:00').toLocaleDateString('fr-FR')}</td><td class="small">${esc(m.a.ville)} → ${esc(m.b.ville)} · ${m.km} km</td><td class="small">${veh(m)}<br>${m.vehicule.immat}</td><td style="text-align:right">${eur(m.prix)}</td></tr>`).join('')}</tbody></table>
      <dl class="kv" style="max-width:260px;margin:16px 0 0 auto"><dt>Total HT</dt><dd>${eur(f.ht + fraisRefact)}</dd><dt>TVA 20 %</dt><dd>${eur((f.ht + fraisRefact) * .2)}</dd><dt style="font-weight:700;color:var(--texte)">Total TTC</dt><dd style="font-size:18px;color:var(--orange)">${eur((f.ht + fraisRefact) * 1.2)}</dd></dl>
      <p class="small muted" style="margin-top:18px">PV de prise en charge et de livraison joints à chaque mission. Paiement à 30 jours.</p></div></div>`);
  }
  /* Nouvelle mission avec prix calculé automatiquement */
  A.nouvelle = () => {
    const villes = Object.keys(VILLES).sort();
    panneau(`<div class="ph"><h2 class="grow">Nouvelle mission</h2><button class="x" data-a="fermer">${ic('x')}</button></div>
      <div class="pc"><form class="form card" id="nf">
        <label class="f">Client<select class="input" name="client">${CLIENTS.map(c => `<option value="${c.id}">${esc(c.nom)}</option>`).join('')}</select></label>
        <div class="f2"><label class="f">Ville de départ (A)<select class="input" name="va">${villes.map(v => `<option ${v === 'Montélimar' ? 'selected' : ''}>${v}</option>`).join('')}</select></label><label class="f">Ville d’arrivée (B)<select class="input" name="vb">${villes.map(v => `<option ${v === 'Lyon' ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div>
        <div class="f2"><label class="f">Adresse A<input class="input" name="aa" value="12 avenue de la Gare"></label><label class="f">Adresse B<input class="input" name="ab" value="ZA Les Portes du Sud"></label></div>
        <div class="f2"><label class="f">Marque<input class="input" name="marque" value="Peugeot"></label><label class="f">Modèle<input class="input" name="modele" value="3008"></label></div>
        <div class="f2"><label class="f">Immatriculation<input class="input" name="immat" value="GH-482-TK"></label><label class="f">Type<select class="input" name="type"><option>Convoyage route</option><option>Plateau</option></select></label></div>
        <div class="f2"><label class="f">Date<input class="input" type="date" name="date" value="${addDays(ymd(), 1)}"></label><label class="f">Heure<input class="input" type="time" name="heure" value="09:00"></label></div>
        <label class="f">Convoyeur<select class="input" name="conv"><option value="">À assigner plus tard</option>${CONVOYEURS.map(k => `<option value="${k.id}">${k.nom} · ${k.ville}</option>`).join('')}</select></label>
        <div class="card" style="background:var(--orange2);border-color:#FFD9C2;box-shadow:none" id="devis"></div>
        <button class="btn or bl">${ic('check')} Créer la mission</button></form></div>`, p => {
      const f = $('#nf', p), maj = () => { const v = Object.fromEntries(new FormData(f)); if (v.va === v.vb) { $('#devis', p).innerHTML = '<b>Choisis deux villes différentes</b>'; return; } const km = distKm(v.va, v.vb), prix = prixMission(v.client, km, v.type === 'Plateau'), c = CL(v.client); $('#devis', p).innerHTML = `<div class="row"><div class="grow"><div class="small muted">Prix calculé automatiquement · tarif ${esc(c.nom)}</div><b style="font:700 26px var(--f-t);color:var(--orange)">${eur(prix)} HT</b></div><div style="text-align:right" class="small"><b>${km} km</b><br>≈ ${Math.floor(dureeH(km))} h ${pad(Math.round(dureeH(km) % 1 * 60))}</div></div>`; };
      f.addEventListener('input', maj); f.addEventListener('change', maj); maj();
      f.onsubmit = e => {
        e.preventDefault(); const v = Object.fromEntries(new FormData(f)); if (v.va === v.vb) return toast('Choisis deux villes différentes');
        const km = distKm(v.va, v.vb), n = D.missions.length + 1;
        const m = { id: 'CV-' + v.date.slice(5, 7) + v.date.slice(8) + '-' + pad(n).padStart(3, '0'), client: v.client, type: v.type, vehicule: { marque: v.marque, modele: v.modele, energie: 'Essence', immat: v.immat.toUpperCase() }, a: { ville: v.va, adresse: v.aa, contact: 'Accueil', tel: '04 90 00 00 00' }, b: { ville: v.vb, adresse: v.ab, contact: 'Réception', tel: '04 75 00 00 00' }, date: v.date, heure: v.heure, convoyeur: v.conv || null, statut: v.conv ? 'planifiee' : 'a_planifier', km, prix: prixMission(v.client, km, v.type === 'Plateau'), progress: 0, pvA: null, pvB: null, frais: [], historique: [{ at: new Date().toISOString(), txt: 'Mission créée' }], alerte: '', note: '' };
        if (v.conv) histo(m, 'Assignée à ' + CV(v.conv).nom);
        D.missions.push(m); save(); fermerPanneau(); location.hash = '#/missions'; filtre = 'actives'; render(); toast(v.conv ? '📲 Mission envoyée à ' + CV(v.conv).nom : 'Mission créée · à assigner');
      };
    });
  };

  /* ================= APP CONVOYEUR (Karim) ================= */
  const MOI = 'k1';
  let pvBrouillon = null;
  function appConvoyeur(p) {
    const ecran = p[0] === 'm' ? missionConv(p[1]) : p[0] === 'pv' ? pvConv(p[1], p[2]) : p[0] === 'frais' ? fraisConv(p[1]) : listeConv();
    return `<div class="tel-wrap"><div class="tel"><div class="ecran">${ecran}</div></div>
      <div class="tel-note"><h2>L’app du convoyeur</h2><p class="muted">Sur iPhone et Android. Tout est guidé, étape par étape :</p><ol><li>Il reçoit ses missions dès que le bureau les assigne.</li><li>Itinéraire en un toucher (Waze / Google Maps).</li><li>État des lieux : 8 photos, dégâts sur le schéma, kilométrage, carburant.</li><li>Signature du client sur l’écran.</li><li>Notes de frais avec photo du ticket.</li><li>Le bureau et le client suivent tout en direct.</li></ol><p class="small muted">Astuce : faites une mission complète avec Karim, puis regardez le bureau et le lien de suivi client se mettre à jour.</p></div></div>`;
  }
  function listeConv() {
    const t = ymd(), mes = D.missions.filter(m => m.convoyeur === MOI);
    const auj = mes.filter(m => m.date === t && !['livree', 'facturee'].includes(m.statut)).sort((a, b) => a.heure.localeCompare(b.heure));
    const avenir = mes.filter(m => m.date > t).sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
    const faites = mes.filter(m => ['livree', 'facturee'].includes(m.statut)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
    const item = m => `<a class="mi" href="#/convoyeur/m/${m.id}" style="text-decoration:none;color:inherit"><div class="h">${m.heure.replace(':', 'h')}<div class="small muted" style="font:500 11px var(--f-b)">${m.date === t ? '' : jourFr(m.date, { day: 'numeric', month: 'short' })}</div></div><div class="grow">${trajet(m)}<div class="small muted">${veh(m)} · ${m.km} km</div></div>${tagSt(m.statut)}</a>`;
    return `<div class="m-top"><div class="small" style="color:#9FB1C8">${esc(SOCIETE)}</div><h2>Bonjour Karim 👋</h2><div class="s">${auj.length} mission(s) aujourd’hui</div></div>
      <div class="m-body m-list"><h3 style="margin:2px 4px 10px">Aujourd’hui</h3>${auj.map(item).join('') || '<div class="m-card muted">Plus de mission aujourd’hui. Bravo !</div>'}
      ${avenir.length ? `<h3 style="margin:16px 4px 10px">À venir</h3>${avenir.slice(0, 4).map(item).join('')}` : ''}
      ${faites.length ? `<h3 style="margin:16px 4px 10px">Terminées</h3>${faites.map(item).join('')}` : ''}</div>`;
  }
  function missionConv(id) {
    const m = M(id); if (!m) return listeConv();
    const i = ORDRE.indexOf(m.statut), waze = (v) => `https://waze.com/ul?ll=${VILLES[v][0]},${VILLES[v][1]}&navigate=yes`;
    const actions = {
      planifiee: `<button class="m-btn" data-a="cStatut" data-id="${m.id}" data-s="en_route">${ic('nav')} Je pars vers le point A</button>`,
      en_route: `<a class="m-btn" href="#/convoyeur/pv/${m.id}/A" style="text-decoration:none">${ic('cam')} Je suis arrivé · état des lieux</a>`,
      pris_en_charge: `<button class="m-btn" data-a="cStatut" data-id="${m.id}" data-s="en_convoi">${ic('nav')} Démarrer le convoi</button>`,
      en_convoi: `<a class="m-btn vert" href="#/convoyeur/pv/${m.id}/B" style="text-decoration:none">${ic('check')} Arrivé · livrer le véhicule</a>`,
      livree: `<div class="m-btn gh">${ic('check')} Mission terminée</div>`
    };
    const cible = ['planifiee', 'en_route'].includes(m.statut) ? m.a : m.b;
    return `<div class="m-top"><a href="#/convoyeur" style="color:#9FB1C8;text-decoration:none;font-size:14px">‹ Mes missions</a><h2 style="margin-top:8px">${esc(m.a.ville)} → ${esc(m.b.ville)}</h2><div class="s">${m.id} · ${m.km} km · ${m.heure.replace(':', 'h')}</div><div class="etapes">${[1, 2, 3, 4, 5].map(k => `<i class="${i >= k ? 'on' : ''}"></i>`).join('')}</div></div>
      <div class="m-body">
        <div class="m-card"><div class="row"><span class="av" style="background:var(--bleu2);color:var(--bleu)">${ic('car', 18)}</span><div class="grow"><b>${veh(m)}</b><div class="small muted">${m.vehicule.immat} · ${m.vehicule.energie}${m.type === 'Plateau' ? ' · Plateau' : ''}</div></div></div></div>
        <div class="m-card"><div class="small muted" style="font-weight:600">${['planifiee', 'en_route'].includes(m.statut) ? 'RÉCUPÉRER LE VÉHICULE' : 'LIVRER LE VÉHICULE'}</div><b style="font-size:17px">${esc(cible.adresse)}</b><div>${esc(cible.ville)}</div><div class="small muted" style="margin:4px 0 12px">${esc(cible.contact)}</div>
          <div class="row"><a class="m-btn gh" style="min-height:46px;font-size:14px" href="${waze(cible.ville)}" target="_blank">${ic('nav')} Waze</a><a class="m-btn gh" style="min-height:46px;font-size:14px" href="tel:${cible.tel.replace(/\s/g, '')}">${ic('phone')} Appeler</a></div></div>
        ${m.pvA ? `<div class="m-card row"><span class="av" style="background:var(--vert2);color:var(--vert)">${ic('check', 16)}</span><div class="grow small"><b>PV de départ signé</b><div class="muted">${Object.values(m.pvA.photos).filter(Boolean).length} photos · ${(+m.pvA.km).toLocaleString('fr-FR')} km</div></div></div>` : ''}
        ${m.pvB ? `<div class="m-card row"><span class="av" style="background:var(--vert2);color:var(--vert)">${ic('check', 16)}</span><div class="grow small"><b>PV de livraison signé</b><div class="muted">Le client a reçu son PV par e-mail</div></div></div>` : ''}
        <div class="m-card"><div class="row"><b class="grow">Mes frais</b><a class="small" href="#/convoyeur/frais/${m.id}" style="color:var(--orange);font-weight:600">+ Ajouter</a></div>${m.frais.length ? m.frais.map(f => `<div class="row small" style="margin-top:8px">${f.photo ? `<img src="${f.photo}" style="width:34px;height:34px;object-fit:cover;border-radius:7px">` : ic('receipt', 18)}<span class="grow">${f.type}</span><b>${eur(f.montant)}</b></div>`).join('') : '<div class="small muted" style="margin-top:6px">Carburant, péage, train retour : photo du ticket et c’est remboursé.</div>'}</div>
        ${!['livree', 'facturee'].includes(m.statut) ? `<button class="m-btn gh" style="min-height:46px;font-size:14px;color:var(--rouge)" data-a="cProbleme" data-id="${m.id}">${ic('alert')} Signaler un problème</button>` : ''}
      </div><div class="m-bas">${actions[m.statut] || actions.livree}</div>`;
  }
  A.cStatut = d => {
    const m = M(d.id); m.statut = d.s; if (d.s === 'en_convoi') m.progress = 0.02;
    histo(m, { en_route: 'Convoyeur en route vers le point A', en_convoi: 'Convoi démarré' }[d.s] || STATUTS[d.s]); save(); render();
    toast(d.s === 'en_route' ? 'Bon trajet ! Le bureau est prévenu.' : 'Bonne route 🚗 Le client suit son véhicule en direct.');
  };
  A.cProbleme = d => { const m = M(d.id); $$('.voile,.panneau').forEach(x => x.remove()); const ps = ['Retard (bouchons)', 'Véhicule pas prêt au point A', 'Client absent', 'Panne / voyant allumé', 'Dégât constaté']; const v = document.createElement('div'); v.className = 'voile'; v.onclick = fermerPanneau; const p = document.createElement('div'); p.className = 'panneau'; p.innerHTML = `<div class="ph"><h2 class="grow">Signaler un problème</h2><button class="x" data-a="fermer">${ic('x')}</button></div><div class="pc">${ps.map(t => `<button class="m-btn gh" style="min-height:50px;font-size:15px" data-a="cProbOk" data-id="${m.id}" data-t="${t}">${t}</button>`).join('')}</div>`; document.body.append(v, p); };
  A.cProbOk = d => { const m = M(d.id); m.alerte = 'Signalé par Karim : ' + d.t; histo(m, m.alerte); save(); fermerPanneau(); render(); toast('Le bureau a été prévenu immédiatement'); };
  function voitureSvg(dmg) {
    const z = (id, x, y, w, h, rx = 8) => `<rect class="z ${dmg[id] ? 'dmg' : ''}" data-z="${id}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
    return `<svg class="voiture" viewBox="0 0 200 400">
      ${z('pcav', 40, 6, 120, 30, 14)}${z('capot', 46, 38, 108, 78)}${z('toit', 52, 168, 96, 104)}${z('coffre', 46, 312, 108, 52)}${z('pcar', 40, 366, 120, 28, 14)}
      ${z('avg', 10, 40, 32, 86)}${z('avd', 158, 40, 32, 86)}${z('pavg', 10, 130, 32, 78)}${z('pavd', 158, 130, 32, 78)}${z('parg', 10, 212, 32, 78)}${z('pard', 158, 212, 32, 78)}${z('arg', 10, 294, 32, 70)}${z('ard', 158, 294, 32, 70)}
      <path class="vitre" d="M52 120h96l-8 44H60z"/><path class="vitre" d="M60 276h80l6 32H54z"/>
      <text x="100" y="24" text-anchor="middle" font-size="9" fill="#66748A">AVANT</text><text x="100" y="384" text-anchor="middle" font-size="9" fill="#66748A">ARRIÈRE</text></svg>`;
  }
  function pvConv(id, cote) {
    const m = M(id); if (!m) return listeConv();
    if (!pvBrouillon || pvBrouillon.id !== id || pvBrouillon.cote !== cote) pvBrouillon = { id, cote, photos: {}, dommages: {}, km: cote === 'B' && m.pvA ? (+m.pvA.km + m.km) : '', carbu: 6, sig: '', signataire: cote === 'A' ? m.a.contact : m.b.contact, remarques: '' };
    const b = pvBrouillon, nbPh = Object.keys(b.photos).length, dmg = Object.entries(b.dommages).filter(([, v]) => v);
    apres.push(() => bindPv(m));
    return `<div class="m-top"><a href="#/convoyeur/m/${m.id}" style="color:#9FB1C8;text-decoration:none;font-size:14px">‹ Retour</a><h2 style="margin-top:8px">État des lieux ${cote === 'A' ? 'de départ' : 'd’arrivée'}</h2><div class="s">${veh(m)} · ${m.vehicule.immat}</div></div>
      <div class="m-body">
        <div class="m-card"><div class="row"><b class="grow">1. Photos</b><span class="small ${nbPh === 8 ? '' : 'muted'}" style="${nbPh === 8 ? 'color:var(--vert);font-weight:700' : ''}">${nbPh}/8</span></div><p class="small muted" style="margin:4px 0 10px">Touchez chaque case : l’appareil photo s’ouvre.</p>
          <div class="ph-grid">${PHOTOS.map(p => `<label class="${b.photos[p] ? 'ok' : ''}" style="${b.photos[p] ? `background-image:url(${b.photos[p]})` : ''}">${b.photos[p] ? `<span>${p}</span>` : ic('cam') + p}<input type="file" accept="image/*" capture="environment" data-ph="${p}" hidden></label>`).join('')}</div>
          <button class="small" data-a="phAuto" style="margin-top:8px;background:none;border:0;color:var(--orange);font-weight:600;cursor:pointer">Démo : remplir les 8 photos automatiquement</button></div>
        <div class="m-card"><b>2. Dégâts</b><p class="small muted" style="margin:4px 0 10px">Touchez une zone : rayure → bosse → choc.</p>${voitureSvg(b.dommages)}
          <div class="small" style="margin-top:8px">${dmg.length ? dmg.map(([zz, v]) => `• ${(ZONES.find(x => x[0] === zz) || [])[1]} : <b style="color:var(--rouge)">${DEGATS[v]}</b>`).join('<br>') : '<span class="muted">Aucun dégât signalé</span>'}</div></div>
        <div class="m-card"><b>3. Compteur et carburant</b><input class="input" style="margin:10px 0" type="number" inputmode="numeric" id="pvKm" placeholder="Kilométrage" value="${b.km}"><div class="fuel">${[1, 2, 3, 4, 5, 6, 7, 8].map(k => `<button data-a="carbu" data-v="${k}" class="${k <= b.carbu ? 'on' : ''}"></button>`).join('')}</div><div class="small muted" style="margin-top:4px">${m.vehicule.energie === 'Électrique' ? 'Batterie' : 'Réservoir'} : ${b.carbu}/8</div></div>
        <div class="m-card"><b>4. Signature ${cote === 'A' ? 'de la personne qui remet le véhicule' : 'du client à la livraison'}</b><input class="input" style="margin:10px 0" id="pvNom" value="${esc(b.signataire)}" placeholder="Nom"><canvas class="sig" id="sig"></canvas><button class="small" data-a="sigEff" style="margin-top:6px;background:none;border:0;color:var(--doux);cursor:pointer">Effacer la signature</button></div>
      </div><div class="m-bas"><button class="m-btn ${cote === 'B' ? 'vert' : ''}" data-a="pvValider" data-id="${m.id}">${ic('check')} ${cote === 'A' ? 'Valider la prise en charge' : 'Valider la livraison'}</button></div>`;
  }
  function reduire(file) {
    return new Promise(ok => { const u = URL.createObjectURL(file), im = new Image(); im.onload = () => { const k = Math.min(1, 520 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); ok(c.toDataURL('image/jpeg', .6)); }; im.onerror = () => ok(''); im.src = u; });
  }
  function photoFictive(label, i) {
    const c = document.createElement('canvas'); c.width = 320; c.height = 240; const g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 240); gr.addColorStop(0, ['#9DB4CF', '#B8C7D9', '#A9BFAE', '#C9B79E'][i % 4]); gr.addColorStop(1, '#5B6B80'); g.fillStyle = gr; g.fillRect(0, 0, 320, 240);
    g.fillStyle = 'rgba(14,27,44,.75)'; g.beginPath(); g.roundRect(70, 110, 180, 60, 18); g.fill(); g.beginPath(); g.roundRect(105, 80, 110, 45, 14); g.fill();
    g.fillStyle = '#222'; [[100, 172], [220, 172]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 16, 0, 7); g.fill(); });
    g.fillStyle = '#fff'; g.font = 'bold 18px Inter, sans-serif'; g.fillText(label, 14, 28); g.font = '12px Inter, sans-serif'; g.fillText(new Date().toLocaleString('fr-FR'), 14, 228);
    return c.toDataURL('image/jpeg', .6);
  }
  function bindPv(m) {
    const b = pvBrouillon;
    $$('input[data-ph]').forEach(inp => inp.onchange = async () => { const f = inp.files[0]; if (!f) return; b.photos[inp.dataset.ph] = await reduire(f); render(); });
    $$('.voiture .z').forEach(z => z.onclick = () => { b.dommages[z.dataset.z] = ((b.dommages[z.dataset.z] || 0) + 1) % 4; render(); });
    const km = $('#pvKm'); if (km) km.oninput = () => { b.km = km.value; };
    const nom = $('#pvNom'); if (nom) nom.oninput = () => { b.signataire = nom.value; };
    const cv = $('#sig'); if (!cv) return;
    const r = cv.getBoundingClientRect(); cv.width = r.width * 2; cv.height = r.height * 2; const g = cv.getContext('2d'); g.scale(2, 2); g.lineWidth = 2.4; g.lineCap = 'round'; g.strokeStyle = '#0E1B2C';
    if (b.sig) { const im = new Image(); im.onload = () => g.drawImage(im, 0, 0, r.width, r.height); im.src = b.sig; }
    let on = false; const pos = e => { const rr = cv.getBoundingClientRect(); return [e.clientX - rr.left, e.clientY - rr.top]; };
    cv.style.touchAction = 'none';
    cv.onpointerdown = e => { on = true; try { cv.setPointerCapture(e.pointerId); } catch (x) { } const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); };
    cv.onpointermove = e => { if (!on) return; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); b.sig = cv.toDataURL('image/png'); };
    cv.onpointerup = () => { on = false; b.sig = cv.toDataURL('image/png'); };
  }
  A.phAuto = () => { PHOTOS.forEach((p, i) => { if (!pvBrouillon.photos[p]) pvBrouillon.photos[p] = photoFictive(p, i); }); render(); };
  A.carbu = d => { pvBrouillon.carbu = +d.v; render(); };
  A.sigEff = () => { pvBrouillon.sig = ''; render(); };
  A.pvValider = d => {
    const m = M(d.id), b = pvBrouillon;
    if (Object.keys(b.photos).length < 8) return toast('Il manque des photos (' + Object.keys(b.photos).length + '/8)');
    if (!b.km) return toast('Indique le kilométrage');
    if (!b.sig) return toast('La signature est obligatoire');
    const pv = { photos: b.photos, dommages: b.dommages, km: +b.km, carbu: b.carbu, sig: b.sig, signataire: b.signataire, at: new Date().toISOString(), remarques: '' };
    if (b.cote === 'A') { m.pvA = pv; m.statut = 'pris_en_charge'; histo(m, 'Véhicule pris en charge · PV signé par ' + b.signataire); toast('✅ Prise en charge validée · PV envoyé au client'); }
    else {
      m.pvB = pv; m.statut = 'livree'; m.progress = 1; histo(m, 'Véhicule livré · PV signé par ' + b.signataire);
      const nouveaux = Object.entries(b.dommages).filter(([zz, v]) => v && !(m.pvA && m.pvA.dommages[zz]));
      if (nouveaux.length) { m.alerte = 'Nouveau dégât à la livraison : ' + nouveaux.map(([zz, v]) => (ZONES.find(x => x[0] === zz) || [])[1] + ' (' + DEGATS[v] + ')').join(', '); histo(m, m.alerte); }
      toast('🎉 Véhicule livré · PV envoyé au client et au bureau');
    }
    pvBrouillon = null; save(); location.hash = '#/convoyeur/m/' + m.id;
  };
  function fraisConv(id) {
    const m = M(id);
    apres.push(() => { const f = $('#ff'); let photo = ''; $('#ffPh').onchange = async e => { photo = await reduire(e.target.files[0]); $('#ffPrev').style.backgroundImage = `url(${photo})`; $('#ffPrev').textContent = ''; };
      f.onsubmit = e => { e.preventDefault(); const v = Object.fromEntries(new FormData(f)); if (!(+v.montant > 0)) return toast('Indique le montant'); m.frais.push({ type: v.type, montant: +String(v.montant).replace(',', '.'), photo }); histo(m, 'Frais ajouté : ' + v.type + ' ' + eur(v.montant)); save(); toast('Frais enregistré · il apparaît au bureau'); location.hash = '#/convoyeur/m/' + m.id; }; });
    return `<div class="m-top"><a href="#/convoyeur/m/${m.id}" style="color:#9FB1C8;text-decoration:none;font-size:14px">‹ Retour</a><h2 style="margin-top:8px">Nouveau frais</h2><div class="s">${m.id}</div></div>
      <div class="m-body"><form id="ff" class="m-card form"><label class="f">Type<select class="input" name="type"><option>Carburant</option><option>Péage</option><option>Train retour</option><option>Bus / tram</option><option>Parking</option><option>Autre</option></select></label>
        <label class="f">Montant (€)<input class="input" name="montant" type="number" step="0.01" inputmode="decimal" placeholder="0,00"></label>
        <label class="f">Photo du ticket<div id="ffPrev" style="height:120px;border:1.5px dashed #C3CCD8;border-radius:12px;display:grid;place-items:center;background:#fff center/cover;color:var(--doux)">${ic('cam', 26)}</div><input type="file" id="ffPh" accept="image/*" capture="environment" hidden></label>
        <button class="m-btn">${ic('check')} Enregistrer le frais</button></form></div>`;
  }

  /* ================= SUIVI CLIENT ================= */
  function suivi(id) {
    let m = id && M(id);
    if (!m) m = D.missions.find(x => x.statut === 'en_convoi') || D.missions.find(x => x.date === ymd());
    const cv = CV(m.convoyeur), etapes = [['planifiee', 'Planifiée'], ['pris_en_charge', 'Pris en charge'], ['en_convoi', 'En route'], ['livree', 'Livré']];
    const i = ORDRE.indexOf(m.statut), fait = k => i >= ORDRE.indexOf(k) || (k === 'pris_en_charge' && i >= 3);
    const titre = { a_planifier: 'Mission enregistrée', planifiee: 'Prise en charge prévue', en_route: 'Le convoyeur arrive', pris_en_charge: 'Véhicule pris en charge', en_convoi: 'Votre véhicule est en route', livree: 'Véhicule livré ✓', facturee: 'Véhicule livré ✓' }[m.statut];
    const sous = m.statut === 'en_convoi' ? `Arrivée estimée vers <b style="color:#fff">${eta(m)}</b> à ${esc(m.b.ville)}` : ['livree', 'facturee'].includes(m.statut) ? `Livré à ${esc(m.b.ville)}${m.pvB ? ' le ' + new Date(m.pvB.at).toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : ''}` : `${cap(jourFr(m.date, { weekday: 'long', day: 'numeric', month: 'long' }))} à ${m.heure.replace(':', 'h')} · ${esc(m.a.ville)}`;
    apres.push(() => { const el = $('#mapS'); if (!el || !window.L) return; const mp = L.map(el, { zoomControl: false, scrollWheelZoom: false }); maps.push(mp); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OSM' }).addTo(mp); const A2 = VILLES[m.a.ville], B2 = VILLES[m.b.ville]; L.polyline([A2, B2], { color: '#FF6A1A', weight: 4, dashArray: '6 8' }).addTo(mp); L.circleMarker(A2, { radius: 7, color: '#2F6FED', fillOpacity: 1 }).addTo(mp); L.circleMarker(B2, { radius: 7, color: '#FF6A1A', fillOpacity: 1 }).addTo(mp); L.marker(posMission(m), { icon: L.divIcon({ className: '', html: '<div class="pinv" style="background:#FF6A1A">🚗</div>', iconSize: [34, 34], iconAnchor: [17, 17] }) }).addTo(mp); mp.fitBounds([A2, B2], { padding: [30, 30] }); });
    return `<div class="suivi"><div class="row" style="margin-bottom:14px"><span class="logo" style="padding:0"><span class="m">${ic('car')}</span></span><div><b style="font:700 16px var(--f-t)">${esc(SOCIETE)}</b><div class="small muted">Suivi de votre véhicule</div></div></div>
      <div class="hero"><div class="small" style="color:#9FB1C8">${veh(m)} · ${m.vehicule.immat}</div><h1 style="margin-top:6px">${titre}</h1><p>${sous}</p>
        <div class="prog-s">${etapes.map(([k, l]) => `<div class="${fait(k) ? 'on' : ''}"><i></i><span>${l}</span></div>`).join('')}</div></div>
      <div id="mapS" class="map" style="height:320px;margin-bottom:14px"></div>
      <div class="card" style="margin-bottom:14px"><div class="row">${av(cv, 44)}<div class="grow"><b>${cv ? cv.nom.split(' ')[0] : 'Convoyeur'}</b>, votre convoyeur<div class="small muted">★ ${cv ? cv.note : ''} · professionnel vérifié</div></div></div></div>
      <div class="card" style="margin-bottom:14px"><dl class="kv"><dt>Départ</dt><dd>${esc(m.a.ville)}</dd><dt>Arrivée</dt><dd>${esc(m.b.ville)}</dd><dt>Distance</dt><dd>${m.km} km</dd><dt>Référence</dt><dd>${m.id}</dd></dl></div>
      <div class="card"><h3 style="margin-bottom:10px">Documents</h3>
        <div class="row" style="padding:8px 0;border-bottom:1px solid var(--ligne)">${ic('doc', 20)}<span class="grow">PV de prise en charge</span>${m.pvA ? `<button class="btn gh sm" data-a="pdfClient" data-id="${m.id}">Voir</button>` : '<span class="small muted">À venir</span>'}</div>
        <div class="row" style="padding:8px 0">${ic('doc', 20)}<span class="grow">PV de livraison</span>${m.pvB ? `<button class="btn gh sm" data-a="pdfClient" data-id="${m.id}">Voir</button>` : '<span class="small muted">À venir</span>'}</div></div>
      <p class="small muted" style="text-align:center;margin-top:18px">Cette page se met à jour toute seule. Une question ? Contactez ${esc(SOCIETE)}.</p></div>`;
  }
  A.pdfClient = d => A.pdf(d);

  /* Simulation : les véhicules avancent */
  setInterval(() => {
    let ch = false;
    D.missions.forEach(m => { if (m.statut === 'en_convoi' && m.progress < .97) { m.progress = Math.min(.97, m.progress + .004); ch = true; } });
    if (ch) { save(); const h = location.hash; if ((h === '' || h === '#/' || h.startsWith('#/carte') || h.startsWith('#/suivi')) && !$('.panneau') && !document.activeElement.matches('input,select,textarea')) render(); }
  }, 8000);

  route();
  if (nbImport) setTimeout(() => toast('🌐 ' + nbImport + ' nouvelle(s) commande(s) reçue(s) depuis le site web'), 400);
})();
