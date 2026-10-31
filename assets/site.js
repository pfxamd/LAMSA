/* LAMSA / Website UI. All effects local; no tracking or remote APIs. */
(() => {
  'use strict';
  const header = document.querySelector('.topbar');
  const toggle = header?.querySelector('.menu-toggle');
  const nav = header?.querySelector('.topbar-nav');
  if (header) {
    const updateScrolled = () => header.classList.toggle('is-scrolled', window.scrollY > 6);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
  }
  if (header && toggle && nav) {
    const close = () => { header.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Ouvrir le menu'); };
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
    document.addEventListener('click', event => { if (!header.contains(event.target)) close(); });
    window.matchMedia('(min-width: 761px)').addEventListener?.('change', e => { if (e.matches) close(); });
  }

  const themes = [
    { name: 'Jardin', kind: 'Fraîcheur naturelle', main: '#78947E', side: '#E8DBC3' },
    { name: 'Argile', kind: 'Chaleur habitée', main: '#C6785B', side: '#DCC69E' },
    { name: 'Pétrole', kind: 'Contraste assumé', main: '#355761', side: '#C5D4CB' },
    { name: 'Chaux', kind: 'Calme lumineux', main: '#E6E0CF', side: '#B3B8A3' }
  ];
  const heroRoom = document.querySelector('.room-art');
  const heroName = document.querySelector('#heroThemeName');
  const heroKind = document.querySelector('#heroThemeKind');
  if (heroRoom && heroName && heroKind) {
    document.querySelectorAll('[data-hero-theme]').forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.heroTheme);
        const theme = themes[index];
        if (!theme) return;
        heroRoom.style.setProperty('--wall-a', theme.main);
        heroRoom.style.setProperty('--wall-b', theme.side);
        heroName.textContent = theme.name;
        heroKind.textContent = theme.kind;
        document.querySelectorAll('[data-hero-theme]').forEach(other => other.setAttribute('aria-pressed', String(button === other)));
      });
    });
  }

  const finishSample = document.querySelector('.finish-sample');
  if (finishSample) {
    const names = {
      mat: 'Mat — surface douce et sobre',
      velours: 'Velours — reflet subtil et satiné',
      mineral: 'Minérale — grain travaillé à la main'
    };
    document.querySelectorAll('[data-finish-demo]').forEach(button => {
      button.addEventListener('click', () => {
        const value = button.dataset.finishDemo;
        if (!Object.hasOwn(names, value)) return;
        finishSample.dataset.finishDemo = value;
        finishSample.querySelector('.sample-number').textContent = names[value];
        document.querySelectorAll('[data-finish-demo]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      });
    });
  }

  document.querySelectorAll('[data-study-range]').forEach(slider => {
    const scene = slider.closest('.case-visual');
    const update = () => {
      if (!scene) return;
      const val = Math.max(0, Math.min(100, Number(slider.value) || 0));
      scene.style.setProperty('--wipe', `${val}%`);
      const status = scene.querySelector('[data-study-status]');
      if (status) status.textContent = `Avant ${val}% · Après ${100 - val}%`;
    };
    slider.addEventListener('input', update);
    update();
  });

  const form = document.querySelector('#quoteDraft');
  if (form) {
    const summary = {
      service: document.querySelector('[data-summary-service]'),
      place: document.querySelector('[data-summary-place]'),
      area: document.querySelector('[data-summary-area]'),
      timeframe: document.querySelector('[data-summary-when]')
    };
    const serviceLabels = { interieur:'Peinture intérieure',exterieur:'Peinture extérieure',finitions:'Finitions décoratives',renovation:'Rénovation',commerce:'Local commercial' };
    const requestedService = new URLSearchParams(window.location.search).get('service');
    const chosen = [...form.querySelectorAll('input[name="service"]')].find(radio => radio.value === requestedService);
    if (chosen) chosen.checked = true;
    const preview = () => {
      const values = new FormData(form);
      if (summary.service) summary.service.textContent = serviceLabels[values.get('service')] || 'À préciser';
      if (summary.place) summary.place.textContent = String(values.get('type') || 'À préciser');
      if (summary.area) summary.area.textContent = values.get('surface') ? `${values.get('surface')} m² (approx.)` : 'Non renseignée';
      if (summary.timeframe) summary.timeframe.textContent = String(values.get('delai') || 'À convenir');
    };
    form.addEventListener('input', preview);
    form.addEventListener('change', preview);
    preview();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const text = [
        'LAMSA — Brouillon de demande de devis',
        `Service : ${serviceLabels[values.get('service')] || 'À préciser'}`,
        `Espace : ${values.get('type') || 'À préciser'}`,
        `Surface : ${values.get('surface') || 'Non renseignée'} m² (approximatif)`,
        `Délai : ${values.get('delai') || 'À convenir'}`,
        `Prénom / nom : ${values.get('nom') || ''}`,
        `Contact : ${values.get('contact') || ''}`,
        `Détails : ${values.get('details') || ''}`
      ].join('\n');
      const status = document.querySelector('#quoteStatus');
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = 'Votre demande a été copiée. Aucun message n’a été envoyé.';
      } catch {
        const box = document.querySelector('#quoteFallback');
        box.hidden = false;
        box.value = text;
        box.focus();
        box.select();
        status.textContent = 'Copie indisponible : sélectionnez le texte ci-dessous pour le copier.';
      }
    });
  }
})();
