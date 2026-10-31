/* LAMSA LAB — a dependency-free, client-side 2D surface studio.
 * No uploads, external APIs, WebGL or remote data processing. */
(() => {
  'use strict';

  const colors = [
    { name: 'Argile', hex: '#C6785B' },
    { name: 'Sauge', hex: '#78947E' },
    { name: 'Lichen', hex: '#A5B48A' },
    { name: 'Sable', hex: '#DCC69E' },
    { name: 'Ocre', hex: '#C99B40' },
    { name: 'Pétrole', hex: '#355761' },
    { name: 'Rose poudré', hex: '#DDAEAB' },
    { name: 'Aubergine', hex: '#614956' },
    { name: 'Cobalt', hex: '#4566B1' },
    { name: 'Chaux', hex: '#EAE5D9' },
    { name: 'Terracotta', hex: '#9F523C' },
    { name: 'Écorce', hex: '#65584F' },
  ];
  // Architectural harmonies are pairs, not single paint swatches.
  const harmonies = [
    { id: 'lumiere', name: 'Lumière', note: 'Chaux + lin', main: '#EAE5D9', side: '#C7BCA8' },
    { id: 'jardin', name: 'Jardin', note: 'Sauge + ivoire', main: '#78947E', side: '#E9DCC5' },
    { id: 'atelier', name: 'Atelier', note: 'Pétrole + argile', main: '#355761', side: '#C6785B' },
    { id: 'terre', name: 'Terre', note: 'Ocre + sable', main: '#BF824D', side: '#DECBAF' },
  ];
  const roomNames = { salon: 'Salon', chambre: 'Chambre', boutique: 'Boutique' };
  const defaultWalls = {
    salon: { main: '#C6785B', side: '#EAE5D9' },
    chambre: { main: '#78947E', side: '#EAE5D9' },
    boutique: { main: '#355761', side: '#DCC69E' },
  };
  const originalWalls = {
    salon: { main: '#DED9D0', side: '#C9C5BD' },
    chambre: { main: '#E4DED5', side: '#D4CDC2' },
    boutique: { main: '#DAD6CD', side: '#C6C2B8' },
  };
  const finishes = {
    mat: 'Une surface douce et mate, à l’aspect uniforme.',
    velours: 'Un léger reflet accompagne la lumière sans brillance excessive.',
    mineral: 'Un grain subtil évoque la matière et le travail de l’enduit.',
  };
  const hexColor = /^#[0-9a-fA-F]{6}$/;
  const params = new URLSearchParams(window.location.search);
  const validRoom = (name) => Object.prototype.hasOwnProperty.call(roomNames, name);
  const validColor = (value) => typeof value === 'string' && hexColor.test(value);
  const room = validRoom(params.get('piece')) ? params.get('piece') : 'salon';
  const state = {
    room,
    selectedWall: params.get('mur') === 'side' ? 'side' : 'main',
    wallColors: Object.fromEntries(Object.entries(defaultWalls).map(([key, value]) => [key, { ...value }])),
    finish: Object.hasOwn(finishes, params.get('finition')) ? params.get('finition') : 'mat',
    light: params.get('lumiere') === 'soir' ? 'soir' : 'jour',
    compare: 0,
  };
  for (const roomKey of Object.keys(roomNames)) {
    for (const wall of ['main', 'side']) {
      const saved = params.get(`${roomKey}_${wall}`);
      if (validColor(saved)) state.wallColors[roomKey][wall] = saved.toUpperCase();
    }
  }

  const scene = document.querySelector('#roomScene');
  const swatches = document.querySelector('#swatches');
  const custom = document.querySelector('#customColor');
  const compareRange = document.querySelector('#compareRange');
  const compareOutput = document.querySelector('#compareOutput');
  const feedback = document.querySelector('#actionFeedback');
  const colorName = document.querySelector('#selectedColorName');
  const colorCode = document.querySelector('#selectedColorCode');
  const finishDescription = document.querySelector('#finishDescription');
  const harmoniesPanel = document.querySelector('#harmonies');
  if (!scene || !swatches || !custom || !compareRange || !compareOutput) return;

  const escapeText = (s) => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  const front = 'M230 45 L920 90 L898 502 L245 470 Z';
  const lateral = 'M0 92 L230 45 L245 470 L0 555 Z';
  const pathSafe = (value) => validColor(value) ? value : '#EAE5D9';

  function furnitureMarkup(which) {
    const floorShadow = '<ellipse cx="510" cy="576" rx="260" ry="44" fill="#233738" opacity=".12"/>';
    if (which === 'chambre') return `${floorShadow}
      <path d="M284 419 L702 419 L830 558 L377 574 Z" fill="#AA9E85" opacity=".4"/>
      <path d="M343 358 L688 380 L682 451 L343 430 Z" fill="#354B4B"/>
      <path d="M340 400 L685 418 L801 540 L417 546 Z" fill="#EFE8DB" stroke="#D0C7B8" stroke-width="3"/>
      <path d="M411 410 L685 425 L738 505 L439 501 Z" fill="#E0C9BC"/>
      <path d="M401 392 Q432 370 476 399 L484 433 Q433 442 401 419 Z" fill="#FFF9ED"/>
      <path d="M503 398 Q536 379 570 406 L571 443 Q523 449 499 430 Z" fill="#FDF8EF"/>
      <path d="M430 508 L740 519 L792 545 L419 545 Z" fill="#E8DDD2"/>
      <path d="M411 546 L418 583 L430 582 L427 545 M760 546 L766 581 L777 578 L783 541" stroke="#4C4840" stroke-width="8"/>
      <path d="M285 411 L333 415 L333 464 L275 462 Z" fill="#9F745E"/><path d="M289 404 L329 405" stroke="#DBC1AC" stroke-width="5"/>
      <path d="M722 425 L767 426 L770 475 L718 469 Z" fill="#9F745E"/>
      <path d="M303 404 L303 343" stroke="#786456" stroke-width="5"/><path d="M282 352 Q300 324 324 352 Z" fill="#F8D2AD"/>
      <path d="M738 421 L738 355" stroke="#786456" stroke-width="5"/><path d="M721 366 Q735 342 758 369 Z" fill="#F8D2AD"/>
      <path d="M490 98 V360" stroke="#fff" stroke-width="1.5" opacity=".13"/>
      <path d="M508 207 L618 212 L611 336 L511 330 Z" fill="#E8D6B8" stroke="#C5B08D" stroke-width="9"/><path d="M538 229 Q558 197 590 248 Q550 258 568 307" fill="none" stroke="#B88068" stroke-width="13"/>
    `;
    if (which === 'boutique') return `${floorShadow}
      <path d="M346 139 L353 409 L412 411 L407 140 Z" fill="#A98265"/><path d="M359 146 L398 144 L401 399 L356 395 Z" fill="#D2B492"/>
      <path d="M431 150 L791 168 L786 181 L433 167 Z M431 251 L791 268 L786 281 L433 268 Z M431 352 L791 366 L786 380 L433 370 Z" fill="#6B574B"/>
      <g fill="#DDD0B6"><rect x="462" y="192" width="35" height="53" rx="2"/><rect x="514" y="185" width="30" height="60" rx="2"/><rect x="563" y="197" width="48" height="49" rx="2"/><rect x="650" y="192" width="45" height="55" rx="2"/></g>
      <g fill="#B9A083"><rect x="466" y="283" width="63" height="64" rx="2"/><rect x="557" y="291" width="32" height="59" rx="2"/><rect x="611" y="301" width="60" height="49" rx="2"/></g>
      <g fill="#EADACA"><rect x="462" y="392" width="34" height="40" rx="2"/><rect x="523" y="388" width="40" height="47" rx="2"/><rect x="605" y="394" width="40" height="44" rx="2"/></g>
      <path d="M290 450 L650 464 L740 551 L382 552 Z" fill="#D6BBA1"/>
      <path d="M290 450 L650 464 L636 569 L304 558 Z" fill="#846E60"/>
      <path d="M304 558 L636 569 L631 585 L309 574 Z" fill="#594F47"/>
      <path d="M384 471 L528 477" stroke="#FCF5E8" stroke-width="10"/>
      <path d="M412 513 L493 519" stroke="#CE1E5A" stroke-width="7"/>
      <g stroke="#5D5147" stroke-width="5" fill="#DEC4A0"><rect x="341" y="405" width="32" height="39"/><rect x="380" y="400" width="32" height="43"/><rect x="419" y="398" width="32" height="44"/></g>
      <circle cx="143" cy="442" r="30" fill="#A2B9A2"/><path d="M143 451 L143 343" stroke="#685B49" stroke-width="7"/><path d="M143 400 Q91 350 118 337 M143 380 Q181 328 173 323" stroke="#708A6D" stroke-width="15" fill="none"/>
    `;
    return `${floorShadow}
      <path d="M278 469 Q290 424 335 424 L655 433 Q704 435 711 472 L729 537 Q735 560 707 570 L292 557 Q267 550 271 521 Z" fill="#3C5657"/>
      <path d="M288 448 Q306 415 351 423 L636 433 Q689 431 702 475 L707 496 L276 489 Z" fill="#506F70"/>
      <path d="M300 477 Q308 461 338 462 L644 469 Q682 474 687 500 L686 526 L304 513 Z" fill="#698382"/>
      <path d="M264 468 Q266 430 290 429 Q316 428 324 466 L329 532 L290 539 Z" fill="#405A59"/>
      <path d="M681 463 Q686 427 705 433 Q721 440 724 473 L738 536 L687 531 Z" fill="#405A59"/>
      <path d="M318 543 L315 581 L336 582 L347 542 M691 550 L696 583 L711 582 L715 540" stroke="#293A38" stroke-width="11"/>
      <path d="M366 471 L406 476 L415 500 L374 495 Z" fill="#D8C8B8"/>
      <path d="M589 476 L631 476 L638 498 L596 499 Z" fill="#DACABB"/>
      <ellipse cx="517" cy="598" rx="145" ry="19" fill="#233738" opacity=".13"/>
      <path d="M455 551 L580 554 L612 576 L481 577 Z" fill="#D7B694"/>
      <path d="M480 575 L475 624 M603 575 L612 616" stroke="#5D4D3D" stroke-width="8"/>
      <path d="M480 563 Q509 551 529 563 Q513 578 480 563" fill="#F5EFE2"/>
      <path d="M517 184 L640 191 L632 337 L518 328 Z" fill="#EBD5C3" stroke="#C0A58D" stroke-width="10"/>
      <path d="M540 211 Q603 187 606 230 Q568 228 562 298" fill="none" stroke="#CE1E5A" stroke-width="9"/>
      <path d="M71 493 L121 493 L130 555 L63 555 Z" fill="#BB906F"/><path d="M91 500 L90 360" stroke="#6E7656" stroke-width="8"/>
      <path d="M91 430 Q41 388 58 373 M91 395 Q145 360 129 340 M91 455 Q154 427 154 399" fill="none" stroke="#688A70" stroke-width="19" stroke-linecap="round"/>
      <path d="M767 473 L803 484 L804 548 L775 542 Z" fill="#B59B7A"/><path d="M784 478 L782 335" stroke="#665B4C" stroke-width="6"/><path d="M749 360 Q783 317 815 372 Z" fill="#F1DFC3"/>
    `;
  }

  function pictureMarkup(which) {
    if (which === 'boutique') return '<path d="M305 153 L312 377" stroke="#F7EEDD" stroke-width="3"/><path d="M720 131 L720 145" stroke="#F7EEDD" stroke-width="3"/>';
    if (which === 'chambre') return '<path d="M239 121 L255 387" stroke="#F7EEDD" stroke-width="3" opacity=".35"/>';
    return '<path d="M278 118 L283 336" stroke="#F7EEDD" stroke-width="3" opacity=".3"/>';
  }

  function defs() {
    return `<defs>
      <pattern id="lamsa-mineral" width="47" height="39" patternUnits="userSpaceOnUse">
        <path d="M2 6 l9 -3 M32 5 l9 3 M13 22 l9 -2 M35 28 l7 -2 M0 36 l7 -1" stroke="#fff" stroke-width="1.3" opacity=".26"/>
        <path d="M6 13 l4 2 M27 14 l8 -3 M16 34 l6 -3 M39 38 l5 -1" stroke="#1D3135" stroke-width=".9" opacity=".13"/>
        <circle cx="11" cy="30" r="2.7" fill="#F9F0E1" opacity=".20"/>
        <circle cx="39" cy="15" r="1.8" fill="#203B3B" opacity=".10"/>
        <circle cx="25" cy="8" r="1.5" fill="#fff" opacity=".22"/>
      </pattern>
      <linearGradient id="lamsa-velours" x1="0" y1="0" x2="1" y2=".7"><stop offset="0" stop-color="#fff" stop-opacity=".53"/><stop offset=".30" stop-color="#fff" stop-opacity=".24"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#132c2e" stop-opacity=".32"/></linearGradient>
      <linearGradient id="lamsa-wall-main" x1="0" y1="0" x2="1" y2=".92"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#172d33" stop-opacity=".23"/></linearGradient>
      <linearGradient id="lamsa-wall-side" x1="0" y1=".3" x2="1" y2=".8"><stop offset="0" stop-color="#142c33" stop-opacity=".27"/><stop offset=".9" stop-color="#142c33" stop-opacity=".035"/></linearGradient>
      <linearGradient id="lamsa-mat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".055"/><stop offset=".70" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1D3135" stop-opacity=".07"/></linearGradient>
      <radialGradient id="lamsa-daylight" cx=".06" cy=".07" r=".98"><stop offset="0" stop-color="#FFFBE9" stop-opacity=".40"/><stop offset=".62" stop-color="#FFF8E2" stop-opacity=".11"/><stop offset="1" stop-color="#F5ECD6" stop-opacity="0"/></radialGradient>
      <radialGradient id="lamsa-nightlight" cx=".73" cy=".44" r=".72"><stop offset="0" stop-color="#FFC98B" stop-opacity=".38"/><stop offset=".55" stop-color="#F8AF78" stop-opacity=".15"/><stop offset="1" stop-color="#1E3050" stop-opacity="0"/></radialGradient>
      <linearGradient id="lamsa-room-evening" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1B2E52" stop-opacity=".34"/><stop offset=".63" stop-color="#3B3559" stop-opacity=".21"/><stop offset="1" stop-color="#5A4260" stop-opacity=".14"/></linearGradient>
      <clipPath id="lamsa-before"><rect id="beforeMask" x="0" y="0" width="0" height="650"/></clipPath>
    </defs>`;
  }

  function composeRoom(before) {
    const chosen = before ? originalWalls[state.room] : state.wallColors[state.room];
    const prefix = before ? 'avant' : 'apres';
    const targetAttrs = (wall, label) => before ? 'pointer-events="none"' : `data-wall="${wall}" role="button" tabindex="0" aria-label="Peindre le ${escapeText(label)}" aria-pressed="${state.selectedWall === wall}"`;
    const wall = (wallName, path, label) => {
      const shading = wallName === 'side' ? 'lamsa-wall-side' : 'lamsa-wall-main';
      const finish = before ? 'mat' : state.finish;
      const surface = finish === 'velours' ? '<path d="' + path + '" fill="url(#lamsa-velours)" opacity=".87" pointer-events="none"/>'
        : finish === 'mineral' ? '<path d="' + path + '" fill="url(#lamsa-mineral)" opacity=".24" pointer-events="none"/><path d="' + path + '" fill="url(#lamsa-mat)" opacity=".47" pointer-events="none"/>'
        : '<path d="' + path + '" fill="url(#lamsa-mat)" opacity=".72" pointer-events="none"/>';
      return `<path class="${before ? '' : 'wall-paint'}" d="${path}" fill="${pathSafe(chosen[wallName])}" ${targetAttrs(wallName, label)} />
        <path d="${path}" fill="url(#${shading})" pointer-events="none" />${surface}`;
    };
    const lighting = state.light === 'soir'
      ? '<rect x="0" y="0" width="960" height="650" fill="url(#lamsa-room-evening)" pointer-events="none"/><rect x="0" y="0" width="960" height="650" fill="url(#lamsa-nightlight)" pointer-events="none"/>'
      : '<rect x="0" y="0" width="960" height="650" fill="url(#lamsa-daylight)" pointer-events="none"/>';
    const wallIndicator = before ? '' : `<g class="surface-indicator" pointer-events="none">
      <circle cx="${state.selectedWall === 'main' ? 788 : 116}" cy="${state.selectedWall === 'main' ? 153 : 176}" r="21" fill="#F7F2E8" stroke="#CE1E5A" stroke-width="4"/>
      <circle cx="${state.selectedWall === 'main' ? 788 : 116}" cy="${state.selectedWall === 'main' ? 153 : 176}" r="5" fill="#CE1E5A"/>
    </g>`;
    return `<g data-version="${prefix}">
      <rect x="0" y="0" width="960" height="650" fill="#D6DFD9"/>
      <path d="M0 0 H960 V93 L921 88 L230 43 L0 92 Z" fill="#F8F4E8"/>
      ${wall('side', lateral, 'mur latéral')}
      ${wall('main', front, 'mur principal')}
      ${wallIndicator}
      <path d="M0 555 L245 470 L898 502 L960 577 V650 H0 Z" fill="#D5BCA2"/>
      <path d="M0 555 L245 470 L898 502 L960 577" fill="none" stroke="#A89176" stroke-width="7"/>
      <path d="M246 474 L898 506 M243 466 L0 553" fill="none" stroke="#F8F4E8" stroke-width="9"/>
      <path d="M245 45 L245 471" stroke="#FFF9EC" stroke-width="4" opacity=".7"/>
      <path d="M195 507 L239 647 M368 479 L337 650 M533 488 L558 650 M713 495 L818 650" stroke="#BBA38C" stroke-width="1.7" opacity=".5"/>
      <path d="M0 594 L960 630" stroke="#BBA38C" stroke-width="1.7" opacity=".38"/>
      ${state.light === 'jour' ? '<path d="M0 555 L208 490 L468 650 H177 Z" fill="#FFF6E1" opacity=".3"/>' : '<path d="M690 496 L830 507 L960 640 L885 650 Z" fill="#E6B78B" opacity=".20"/>'}
      ${state.room === 'salon' ? '<path d="M228 547 L680 540 L846 646 L171 646 Z" fill="#E9D8BE" opacity=".32"/>' : ''}
      ${state.room === 'chambre' ? '<path d="M327 537 L729 541 L852 647 L226 647 Z" fill="#DCC8B8" opacity=".40"/>' : ''}
      ${pictureMarkup(state.room)}
      ${furnitureMarkup(state.room)}
      ${lighting}
    </g>`;
  }

  function showStatus(message) {
    feedback.textContent = message;
  }

  function updateComparison() {
    state.compare = Number(compareRange.value);
    const mask = scene.querySelector('#beforeMask');
    const line = scene.querySelector('#comparisonLine');
    if (mask) mask.setAttribute('width', String(state.compare * 9.6));
    if (line) {
      line.setAttribute('x1', String(state.compare * 9.6));
      line.setAttribute('x2', String(state.compare * 9.6));
      line.setAttribute('opacity', state.compare === 0 || state.compare === 100 ? '0' : '1');
    }
    const handle = scene.querySelector('#comparisonHandle');
    if (handle) {
      handle.setAttribute('transform', `translate(${Math.max(32, Math.min(928, state.compare * 9.6))} 0)`);
    }
    compareOutput.textContent = state.compare === 0 ? 'Après · 100%' : state.compare === 100 ? 'Avant · 100%' : `Avant · ${state.compare}%`;
  }

  function renderScene() {
    scene.innerHTML = `${defs()}${composeRoom(false)}<g clip-path="url(#lamsa-before)" pointer-events="none">${composeRoom(true)}</g>
      <line id="comparisonLine" x1="0" x2="0" y1="0" y2="650" stroke="#F7F2E8" stroke-width="5" opacity="0" pointer-events="none"/>
      <g id="comparisonHandle" transform="translate(0 0)" aria-hidden="true">
        <rect id="comparisonHitArea" x="-42" y="60" width="84" height="525" fill="transparent" pointer-events="all" style="cursor:ew-resize;touch-action:none"/>
        <circle cx="0" cy="327" r="32" fill="#F7F2E8" stroke="#1D3135" stroke-width="3" pointer-events="none"/>
        <path d="M-14 327 H14 M-10 321 L-16 327 L-10 333 M10 321 L16 327 L10 333" fill="none" stroke="#1D3135" stroke-width="3" stroke-linecap="round" pointer-events="none"/>
      </g>`;
    scene.setAttribute('aria-label', `${roomNames[state.room]}, deux surfaces personnalisables : mur principal et mur latéral`);
    updateComparison();
  }

  function selectedHex() { return state.wallColors[state.room][state.selectedWall].toUpperCase(); }

  function renderControls() {
    for (const button of document.querySelectorAll('[data-room]')) button.setAttribute('aria-pressed', String(button.dataset.room === state.room));
    for (const button of document.querySelectorAll('[data-wall-button]')) button.setAttribute('aria-pressed', String(button.dataset.wallButton === state.selectedWall));
    for (const button of document.querySelectorAll('[data-finish]')) button.setAttribute('aria-pressed', String(button.dataset.finish === state.finish));
    for (const button of document.querySelectorAll('[data-light]')) button.setAttribute('aria-pressed', String(button.dataset.light === state.light));
    const walls = state.wallColors[state.room];
    for (const [which, name] of [['main', 'Main'], ['side', 'Side']]) {
      const sample = document.querySelector(`#visual${name}Sample`);
      const code = document.querySelector(`#visual${name}Color`);
      if (sample) sample.style.backgroundColor = walls[which];
      if (code) code.textContent = walls[which];
    }
    const hex = selectedHex();
    const match = colors.find(({ hex: known }) => hex === known.toUpperCase());
    colorName.textContent = match ? match.name : 'Nuance personnelle';
    colorCode.textContent = hex;
    custom.value = hex;
    finishDescription.textContent = finishes[state.finish];
    for (const button of swatches.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.color === hex));
    for (const button of harmoniesPanel?.querySelectorAll('button') ?? []) {
      const harmony = harmonies.find((item) => item.id === button.dataset.harmony);
      const picked = state.wallColors[state.room];
      button.setAttribute('aria-pressed', String(harmony && harmony.main.toUpperCase() === picked.main && harmony.side.toUpperCase() === picked.side));
    }
  }

  function render() { renderScene(); renderControls(); }
  function setColor(hex) { if (!validColor(hex)) return; state.wallColors[state.room][state.selectedWall] = hex.toUpperCase(); render(); showStatus(`Mur ${state.selectedWall === 'main' ? 'principal' : 'latéral'} : ${colorName.textContent}.`); }

  // A one-touch harmony recolors both surfaces while preserving the room's scene.
  if (harmoniesPanel) {
    for (const harmony of harmonies) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'harmony-choice';
      button.dataset.harmony = harmony.id;
      button.setAttribute('aria-label', `Accord ${harmony.name} — ${harmony.note}`);
      button.innerHTML = `<span class="harmony-tiles" aria-hidden="true"><i style="background:${harmony.main}"></i><i style="background:${harmony.side}"></i></span><span class="harmony-name">${harmony.name}</span>`;
      button.addEventListener('click', () => {
        state.wallColors[state.room] = { main: harmony.main.toUpperCase(), side: harmony.side.toUpperCase() };
        render(); showStatus(`Accord ${harmony.name} appliqué aux deux murs du ${roomNames[state.room].toLowerCase()}.`);
      });
      harmoniesPanel.append(button);
    }
  }
  for (const color of colors) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.color = color.hex.toUpperCase();
    button.style.backgroundColor = color.hex;
    button.setAttribute('aria-label', `${color.name} — ${color.hex}`);
    button.title = color.name;
    button.addEventListener('click', () => setColor(color.hex));
    swatches.append(button);
  }
  for (const button of document.querySelectorAll('[data-room]')) button.addEventListener('click', () => { state.room = button.dataset.room; state.selectedWall = 'main'; state.compare = 0; compareRange.value = '0'; render(); showStatus(`${roomNames[state.room]} sélectionné.`); });
  for (const button of document.querySelectorAll('[data-wall-button]')) button.addEventListener('click', () => { state.selectedWall = button.dataset.wallButton; render(); showStatus(state.selectedWall === 'main' ? 'Mur principal sélectionné.' : 'Mur latéral sélectionné.'); });
  for (const button of document.querySelectorAll('[data-finish]')) button.addEventListener('click', () => { state.finish = button.dataset.finish; render(); showStatus(`Finition ${button.textContent.trim()} sélectionnée.`); });
  for (const button of document.querySelectorAll('[data-light]')) button.addEventListener('click', () => { state.light = button.dataset.light; render(); showStatus(`Lumière ${button.textContent.trim()} sélectionnée.`); });
  scene.addEventListener('click', (event) => { const target = event.target.closest('[data-wall]'); if (!target) return; state.selectedWall = target.dataset.wall; render(); showStatus(`Mur ${target.dataset.wall === 'main' ? 'principal' : 'latéral'} sélectionné.`); });
  scene.addEventListener('keydown', (event) => { if (event.key !== 'Enter' && event.key !== ' ') return; const target = event.target.closest('[data-wall]'); if (!target) return; event.preventDefault(); state.selectedWall = target.dataset.wall; render(); scene.querySelector(`[data-wall="${state.selectedWall}"]`)?.focus(); });
  custom.addEventListener('input', () => setColor(custom.value));
  compareRange.addEventListener('input', updateComparison);
  // The on-image split is draggable on touch and mouse; the native range remains
  // the accessible keyboard alternative (including Arrow/Home/End keys).
  let draggingComparison = false;
  function setCompareAtClientX(clientX) {
    const rect = scene.getBoundingClientRect();
    if (!rect.width) return;
    compareRange.value = String(Math.max(0, Math.min(100, Math.round((clientX - rect.left) * 100 / rect.width))));
    updateComparison();
  }
  scene.addEventListener('pointerdown', (event) => {
    if (!event.target.closest?.('#comparisonHitArea')) return;
    draggingComparison = true;
    scene.setPointerCapture(event.pointerId);
    setCompareAtClientX(event.clientX);
    event.preventDefault();
  });
  scene.addEventListener('pointermove', (event) => { if (draggingComparison) setCompareAtClientX(event.clientX); });
  const endComparisonDrag = () => { draggingComparison = false; };
  scene.addEventListener('pointerup', endComparisonDrag);
  scene.addEventListener('pointercancel', endComparisonDrag);
  scene.addEventListener('lostpointercapture', endComparisonDrag);

  document.querySelector('#resetBtn').addEventListener('click', () => {
    for (const name of Object.keys(defaultWalls)) state.wallColors[name] = { ...defaultWalls[name] };
    state.room = 'salon'; state.selectedWall = 'main'; state.finish = 'mat'; state.light = 'jour'; compareRange.value = '0';
    render();
    if (window.location.protocol === 'https:' || window.location.protocol === 'http:') {
      const url = new URL(window.location.href);
      ['piece', 'mur', 'finition', 'lumiere', ...Object.keys(roomNames).flatMap((name) => [`${name}_main`, `${name}_side`])]
        .forEach((key) => url.searchParams.delete(key));
      window.history.replaceState(null, '', url);
    }
    showStatus('Atelier réinitialisé.');
  });

  function shareUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set('piece', state.room);
    url.searchParams.set('mur', state.selectedWall);
    url.searchParams.set('finition', state.finish);
    url.searchParams.set('lumiere', state.light);
    for (const [name, walls] of Object.entries(state.wallColors)) {
      for (const [wall, color] of Object.entries(walls)) url.searchParams.set(`${name}_${wall}`, color);
    }
    url.hash = 'atelier';
    return url.toString();
  }
  document.querySelector('#shareBtn').addEventListener('click', async () => {
    const link = shareUrl();
    try { await navigator.clipboard.writeText(link); showStatus('Lien de votre ambiance copié.'); }
    catch { window.prompt('Copiez ce lien pour partager votre ambiance :', link); showStatus('Votre lien de partage est prêt.'); }
  });

  document.querySelector('#downloadBtn').addEventListener('click', async () => {
    const btn = document.querySelector('#downloadBtn');
    btn.disabled = true;
    try {
      const clone = scene.cloneNode(true);
      // A snapshot records the final painted room, not the comparison overlay.
      clone.querySelector('[clip-path="url(#lamsa-before)"]')?.remove();
      clone.querySelector('#comparisonLine')?.remove();
      clone.querySelector('#comparisonHandle')?.remove();
      clone.querySelectorAll('.surface-indicator').forEach((item) => item.remove());
      clone.querySelectorAll('[data-wall]').forEach((wall) => {
        wall.removeAttribute('stroke'); wall.removeAttribute('stroke-width'); wall.removeAttribute('stroke-dasharray'); wall.removeAttribute('class'); wall.removeAttribute('role'); wall.removeAttribute('tabindex'); wall.removeAttribute('aria-pressed');
      });
      clone.setAttribute('width', '1440'); clone.setAttribute('height', '975');
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const xml = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
      const objectUrl = URL.createObjectURL(blob);
      try {
        const image = new Image();
        await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = objectUrl; });
        const canvas = document.createElement('canvas'); canvas.width = 1440; canvas.height = 975;
        const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas non disponible');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        // Consistent brand panel, with exact color codes, on a clean export.
        context.fillStyle = '#1D3135';
        context.fillRect(0, 900, 1440, 75);
        context.fillStyle = '#F7F2E8';
        context.font = 'bold 30px Arial, sans-serif';
        context.fillText('LAMSA', 32, 950);
        context.font = '18px Arial, sans-serif';
        context.fillText(`${roomNames[state.room]}  /  ${state.finish === 'mineral' ? 'Minérale' : state.finish === 'velours' ? 'Velours' : 'Mat'}  /  ${state.light === 'soir' ? 'Soir' : 'Jour'}`, 205, 948);
        const walls = state.wallColors[state.room];
        for (const [index, name] of ['main', 'side'].entries()) {
          const x = 875 + index * 260;
          context.fillStyle = walls[name];
          context.fillRect(x, 920, 36, 36);
          context.fillStyle = '#F7F2E8';
          context.font = 'bold 18px Arial, sans-serif';
          context.fillText(walls[name], x + 46, 944);
        }
        const png = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!png) throw new Error('Export PNG indisponible');
        const pngUrl = URL.createObjectURL(png);
        const link = document.createElement('a'); link.href = pngUrl; link.download = `LAMSA-${state.room}-${state.finish}.png`;
        document.body.append(link); link.click(); link.remove();
        window.setTimeout(() => URL.revokeObjectURL(pngUrl), 5000);
        showStatus('Votre ambiance a été enregistrée en PNG (1440 × 975).');
      } finally { URL.revokeObjectURL(objectUrl); }
    } catch (error) { console.error(error); showStatus('Impossible d’exporter cette image sur votre navigateur.'); }
    finally { btn.disabled = false; }
  });

  render();
})();
