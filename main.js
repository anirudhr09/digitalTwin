/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);
  if (!toggle || !nav) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('show');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
};
showMenu('nav-toggle', 'nav-menu');

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) navMenu.classList.remove('show');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
  const scrollY = window.pageYOffset;
  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    const sectionId = current.getAttribute('id');
    const link = document.querySelector('.nav__menu a[href*=' + sectionId + ']');
    if (!link) return;
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  })
}
window.addEventListener('scroll', scrollActive);

/*===== SCROLL REVEAL ANIMATION =====*/
if (typeof ScrollReveal === 'function') {
  const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
  });
  sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {});
  sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img', { delay: 400 });
  sr.reveal('.home__social-icon', { interval: 200 });
  sr.reveal('.skills__data, .work__img, .contact__input, .achievement-card', { interval: 200 });
}

/* ===== COVERFLOW CAROUSEL ===== */
(() => {
  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll('.slide')];
  const prev = document.querySelector('.nav.left');
  const next = document.querySelector('.nav.right');
  const dotsEl = document.querySelector('.dots');

  const total = slides.length;
  let index = 0;
  let spacing = 360;

  // create dots
  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i ? '' : ' active');
    dotsEl.appendChild(d);
    d.addEventListener('click', () => goTo(i));
    return d;
  });

  function recalc() {
    const cardW = stage.clientWidth * 0.62;
    spacing = Math.max(240, Math.min(420, cardW * 0.55));
    render(0);
  }
  window.addEventListener('resize', recalc);
  recalc();

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function render(progress = 0) {
    slides.forEach((el, i) => {
      let d = i - index - progress;
      if (d > total / 2) d -= total;
      if (d < -total / 2) d += total;

      const x = d * spacing;
      const abs = Math.abs(d);

      const scale = 1 - Math.min(abs, 1) * 0.12 - Math.max(abs - 1, 0) * 0.04;
      const blur = Math.min(abs * 1.3, 4);
      const bright = 1 - Math.min(abs * 0.35, 0.55);
      const opac = 1 - Math.min(abs * 0.25, 0.6);

      el.style.transform = `translateX(calc(-50% + ${x}px)) scale(${scale})`;
      el.style.filter = `blur(${blur}px) brightness(${bright})`;
      el.style.opacity = opac;
      el.style.zIndex = String(1000 - Math.round(abs * 10));
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = mod(i, total);
    render(0);
  }
  function nextSlide() { goTo(index + 1); }
  function prevSlide() { goTo(index - 1); }

  prev.addEventListener('click', prevSlide);
  next.addEventListener('click', nextSlide);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // drag/swipe
  let drag = { active: false, startX: 0, dx: 0, progress: 0 };
  stage.addEventListener('pointerdown', e => {
    drag.active = true; drag.startX = e.clientX; drag.dx = 0; drag.progress = 0;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('grabbing');
  });
  stage.addEventListener('pointermove', e => {
    if (!drag.active) return;
    drag.dx = e.clientX - drag.startX;
    drag.progress = drag.dx / spacing;
    render(drag.progress);
  });
  stage.addEventListener('pointerup', e => {
    if (!drag.active) return;
    stage.releasePointerCapture(e.pointerId);
    stage.classList.remove('grabbing');
    const p = drag.progress;
    drag.active = false;
    if (p <= -0.25) nextSlide();
    else if (p >= 0.25) prevSlide();
    else render(0);
  });

  render(0);
})();

/* === Enhancements: Parallax, Accessibility, 3D === */
(function () {
  'use strict';

  /* ---------- Parallax ---------- */
  const layers = document.querySelectorAll('[data-parallax]');
  if (layers.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      layers.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0;
        const y = window.scrollY * speed;
        el.style.transform = `translateY(${y}px)`;
      });
    });
  }

  /* ---------- Accessibility Panel ---------- */
  const fab = document.createElement('button');
  fab.className = 'a11y-toggle'; fab.innerHTML = '🛠️';
  fab.setAttribute('aria-label', 'Accessibility menu');
  document.body.appendChild(fab);

  const backdrop = document.createElement('div');
  backdrop.className = 'a11y-panel-backdrop'; backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);

  const panel = document.createElement('div');
  panel.className = 'a11y-panel'; panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <h3>Accessibility & Theme</h3>
    <label>Theme:
      <select id="theme-select">
        <option value="light">Light</option><option value="dark">Dark</option>
      </select>
    </label><br>
    <label>Font scale:
      <input type="range" id="font-scale" min="0.9" max="1.3" step="0.05">
    </label><br>
    <label><input type="checkbox" id="reduced-motion"> Reduced motion</label>
  `;
  document.body.appendChild(panel);

  function open() { backdrop.setAttribute('aria-hidden', 'false'); panel.setAttribute('aria-hidden', 'false'); }
  function close() { backdrop.setAttribute('aria-hidden', 'true'); panel.setAttribute('aria-hidden', 'true'); }

  fab.onclick = open; backdrop.onclick = close;

  const themeSel = panel.querySelector('#theme-select');
  const fontRange = panel.querySelector('#font-scale');
  const reducedChk = panel.querySelector('#reduced-motion');
  const root = document.documentElement;

  function applyPrefs() {
    const prefs = JSON.parse(localStorage.getItem('prefs') || '{}');
    if (prefs.theme) { root.dataset.theme = prefs.theme; themeSel.value = prefs.theme; }
    if (prefs.font) { root.style.fontSize = `${prefs.font * 16}px`; fontRange.value = prefs.font; }
    if (prefs.reduced) { reducedChk.checked = true; }
  }
  applyPrefs();

  themeSel.onchange = () => { root.dataset.theme = themeSel.value; localStorage.setItem('prefs', JSON.stringify({ ...JSON.parse(localStorage.getItem('prefs') || '{}'), theme: themeSel.value })); };
  fontRange.oninput = () => { root.style.fontSize = `${fontRange.value * 16}px`; localStorage.setItem('prefs', JSON.stringify({ ...JSON.parse(localStorage.getItem('prefs') || '{}'), font: parseFloat(fontRange.value) })); };
  reducedChk.onchange = () => { localStorage.setItem('prefs', JSON.stringify({ ...JSON.parse(localStorage.getItem('prefs') || '{}'), reduced: reducedChk.checked })); };

  /* ---------- Three.js Lazy Load ---------- */
  const mount = document.querySelector('[data-threejs]');
  if (mount) {
    import('https://unpkg.com/three@0.160.0/build/three.module.js').then(THREE => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
      camera.position.z = 3;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);

      const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16);
      const material = new THREE.MeshNormalMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      function animate() { requestAnimationFrame(animate); mesh.rotation.x += 0.01; mesh.rotation.y += 0.01; renderer.render(scene, camera); }
      animate();

      window.addEventListener('resize', () => {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      });
    });
  }
})();

/* memory-lane.js */
/* Initializes the Memory Lane timeline inside .memory-lane-root.
   Preserves the full behavior of the original component.
*/
/* memory-lane.js (updated) — scoped, preserves IDs, ensures initial active track */
/* memory-lane.js — robust startup + wrapper background + guaranteed activation */
/* memory-lane.js — updated: robust line-fill & z-index/fallback handling */
(function initMemoryLane(rootSelector){
  const root = (typeof rootSelector === 'string') ? document.querySelector(rootSelector) : rootSelector;
  if(!root) return;

  const sections = Array.from(root.querySelectorAll('.timeline-section'));
  const timelineNav = root.querySelector('.timeline');
  const lineFill = timelineNav && timelineNav.querySelector('.line-fill');
  const hero = root.querySelector('.hero');

  if(!timelineNav || !sections.length) return;

  // Create nodes — we keep original section IDs untouched and use indices
  const nodes = sections.map((sec, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'node';
    const label = sec.dataset.label || '';
    btn.setAttribute('aria-label', label || 'Timeline step');
    btn.dataset.index = String(i);
    btn.innerHTML = `<span class="short">${(label||'').charAt(0)}</span><span class="label">${label}</span>`;
    btn.addEventListener('click', () => {
      sections[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
      sections[i].focus({ preventScroll: true });
    });
    timelineNav.appendChild(btn);
    return btn;
  });

  // Duplicate image tracks for seamless looping
  const tracks = Array.from(root.querySelectorAll('.images-track'));
  function setupTrack(track){
    if(track.dataset.setup) return;
    track.innerHTML = track.innerHTML + track.innerHTML;
    track.dataset.setup = 'true';
    track._width = 0;
    track._pos = 0;
    track._speed = 0.03 + (Math.random() * 0.03);
    track.style.transform = 'translateX(0px)';
  }
  tracks.forEach(setupTrack);

  // Per-instance state
  let nodeCenters = [], timelineTopAbs = 0, firstCenter = 0, lastCenter = 0;
  const activeTracks = new Set();

  // Compute absolute centers and place nodes — guarded for degenerate cases
  function computeNodeCenters(){
    const timelineRect = timelineNav.getBoundingClientRect();
    timelineTopAbs = window.scrollY + timelineRect.top;
    nodeCenters = sections.map(sec => {
      const rect = sec.getBoundingClientRect();
      return window.scrollY + rect.top + rect.height / 2;
    });

    sections.forEach((sec, i) => {
      const secCenter = nodeCenters[i] || (timelineTopAbs + (i * 10));
      const nodeTop = secCenter - timelineTopAbs;
      const node = nodes[i];
      node.style.top = (nodeTop) + 'px';
    });

    // Guard against degenerate cases so (last - first) is never 0
    if(nodeCenters.length === 0){
      // arbitrary safe fallbacks
      firstCenter = timelineTopAbs + 10;
      lastCenter = timelineTopAbs + Math.max(40, timelineNav.clientHeight - 10);
    } else if(nodeCenters.length === 1){
      firstCenter = nodeCenters[0];
      lastCenter = nodeCenters[0] + 1; // ensure non-zero denominator
    } else {
      firstCenter = nodeCenters[0];
      lastCenter = nodeCenters[nodeCenters.length - 1];
      if(firstCenter === lastCenter){
        // tiny nudge
        lastCenter = firstCenter + 1;
      }
    }
  }

  // Hero switch + wrapper background fallback
  function switchHeroTo(url){
    if(!url) return;
    // guarantee wrapper background (visible even if slides are behind another stacking context)
    root.style.setProperty('background-image', `url('${url}')`, 'important');
    root.style.setProperty('background-size', 'cover', 'important');
    root.style.setProperty('background-position', 'center', 'important');

    if(!hero) return;
    const current = hero.querySelector('.slide.visible');
    if(current){
      const bg = current.style.backgroundImage || '';
      if(bg.includes(url)) return;
    }
    let next = Array.from(hero.querySelectorAll('.slide')).find(s => !s.classList.contains('visible'));
    if(!next){ next = document.createElement('div'); next.className = 'slide'; hero.appendChild(next); }
    next.style.backgroundImage = `url('${url}')`;
    requestAnimationFrame(()=> next.classList.add('visible'));
    setTimeout(()=>{ current && current.classList.remove('visible'); }, 90);
  }

  // animate active tracks (per-instance)
  let lastTime = null;
  function animateTracks(t){
    if(!lastTime) lastTime = t;
    const dt = t - lastTime;
    lastTime = t;
    activeTracks.forEach(track => {
      if(!track._width) track._width = Math.max(1, track.scrollWidth / 2);
      track._pos = (track._pos + track._speed * dt) % track._width;
      track.style.transform = `translateX(-${track._pos}px)`;
    });
    requestAnimationFrame(animateTracks);
  }
  requestAnimationFrame(animateTracks);

  function nearestSectionIndex(){
    const viewportCenter = window.scrollY + (window.innerHeight / 2);
    let nearest = 0, minDist = Infinity;
    nodeCenters.forEach((c,i) => {
      const d = Math.abs(c - viewportCenter);
      if(d < minDist){ minDist = d; nearest = i; }
    });
    return nearest;
  }

  // Robust update: compute fill height, set inline style (with !important), ensure visibility, fallback when needed
  function updateLineFill(){
    if(!lineFill || typeof firstCenter === 'undefined' || typeof lastCenter === 'undefined') return;

    const viewportCenter = window.scrollY + (window.innerHeight / 2);
    let t;
    if(lastCenter === firstCenter) t = 1;
    else t = Math.min(1, Math.max(0, (viewportCenter - firstCenter) / (lastCenter - firstCenter) ));
    const targetCenter = firstCenter + t * (lastCenter - firstCenter);
    let filledHeight = Math.max(0, targetCenter - timelineTopAbs);

    // fallback: if computed height is tiny or zero, set a small visible fallback so the slider does not disappear
    if(filledHeight <= 2){
      // choose a reasonable visible fallback relative to timeline height and number of sections
      const fallbackPct = (sections.length > 1) ? 0.12 : 0.5;
      filledHeight = Math.max(6, Math.round(timelineNav.clientHeight * fallbackPct));
    }

    // set the height and keep it visible; use important to avoid host CSS overrides
    lineFill.style.setProperty('height', filledHeight + 'px', 'important');
    lineFill.style.setProperty('display', 'block', 'important');
    lineFill.style.setProperty('visibility', 'visible', 'important');
    lineFill.style.setProperty('background', 'linear-gradient(180deg, #1f7bff, #1a6bdf)', 'important');

    // activate nodes and tracks
    const idx = nearestSectionIndex();
    nodes.forEach((n,i) => { if(i === idx){ n.classList.add('active'); n.setAttribute('aria-current','true'); } else { n.classList.remove('active'); n.removeAttribute('aria-current'); } });

    if(typeof updateLineFill._lastActive === 'undefined') updateLineFill._lastActive = -1;
    if(updateLineFill._lastActive !== idx){
      updateLineFill._lastActive = idx;
      const bg = sections[idx].dataset.bg;
      if(bg) switchHeroTo(bg);
      sections.forEach((s,i) => {
        const track = s.querySelector('.images-track');
        if(!track) return;
        if(i === idx){ track.classList.add('active'); activeTracks.add(track); } else { track.classList.remove('active'); activeTracks.delete(track); }
      });
    }
  }

  // onLoadOrResize ensures setup, computes centers and forces an initial activation
  function onLoadOrResize(){
    tracks.forEach(track => { setupTrack(track); track._width = Math.max(1, track.scrollWidth / 2); });
    computeNodeCenters();
    updateLineFill();

    // Guarantee a valid active index and visual fill on startup
    if(typeof updateLineFill._lastActive === 'undefined' || updateLineFill._lastActive === -1){
      const idx = nearestSectionIndex();
      updateLineFill._lastActive = idx;
      nodes.forEach((n,i) => { if(i === idx){ n.classList.add('active'); n.setAttribute('aria-current','true'); } else { n.classList.remove('active'); n.removeAttribute('aria-current'); } });
      const bg = sections[idx].dataset.bg;
      if(bg) switchHeroTo(bg);
      const track = sections[idx].querySelector('.images-track');
      if(track){ track.classList.add('active'); activeTracks.add(track); }
      // force a line-fill recalculation after forcing active state
      updateLineFill();
    }
  }

  // attach lightweight, page-level events (these are necessary to follow scroll/resizes)
  window.addEventListener('load', onLoadOrResize);
  window.addEventListener('resize', ()=>{ clearTimeout(root._resizeTimer); root._resizeTimer = setTimeout(onLoadOrResize, 140); });
  window.addEventListener('scroll', ()=>{ requestAnimationFrame(updateLineFill); });

  // initial safety call if things are slow to load
  setTimeout(onLoadOrResize, 250);

  // keyboard handling scoped to nodes (no global interception)
  document.addEventListener('keydown', (e) => {
    if(document.activeElement && nodes.includes(document.activeElement)){
      const idx = nodes.indexOf(document.activeElement);
      if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ const next = nodes[(idx+1) % nodes.length]; next.focus(); next.click(); e.preventDefault(); }
      if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ const prev = nodes[(idx-1 + nodes.length) % nodes.length]; prev.focus(); prev.click(); e.preventDefault(); }
    }
  });

  // when a section receives focus ensure its node is visible/active
  sections.forEach((sec,i) => sec.addEventListener('focus', () => { const n = nodes[i]; if(n){ n.focus({preventScroll:true}); updateLineFill(); } }));

  // small API for debugging/refresh
  root._memoryLane = {
    refresh: onLoadOrResize,
    nodes,
    sections
  };

})('.memory-lane-root');

function svgDataURI(bg, text){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='1000'>
    <defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='${bg}'/><stop offset='1' stop-color='#ffffff' stop-opacity='0.06'/></linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Poppins, Inter, Arial' font-size='64' fill='#05203b'>${text}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

/* sample data - replace images with real URLs if desired */
const achievements = [
  // --- ACADEMIC ACHIEVEMENTS ---
  {
    id: 1,
    category: 'Academic',
    title: 'NTSE State Scholar',
    when: 'National Recognition',
    description: 'Recognized as a State Scholar in the National Talent Search Examination (NTSE) for exceptional academic aptitude.',
    bg: 'linear-gradient(135deg,#e6f0ff,#c3e0fa)',
    tags: ['Scholarship', 'National'],
  },
  {
    id: 2,
    category: 'Academic',
    title: 'KVPY Scholar',
    when: 'Science & Research Aptitude',
    description: 'Awarded the Kishore Vaigyanik Protsahan Yojana (KVPY) scholarship for excellence in basic sciences.',
    bg: 'linear-gradient(135deg,#e6f0ff,#f7fbff)',
    tags: ['Scholarship', 'Science'],
  },
  {
    id: 3,
    category: 'Academic',
    title: 'JEE - MAINS & Advanced',
    when: 'Qualified',
    description: 'Successfully qualified in both the JEE - MAINS and the highly competitive JEE Advanced exams.',
    bg: 'linear-gradient(135deg,#e6f0ff,#e0e0ff)',
    tags: ['Competitive Exam', 'Engineering'],
  },
  {
    id: 4,
    category: 'Academic',
    title: 'Academic Distinction',
    when: 'Graduation',
    description: 'Achieved First Class With Distinction in my degree program, demonstrating high academic performance.',
    bg: 'linear-gradient(135deg,#c3e0fa,#e6f0ff)',
    tags: ['Academic Honor', 'GPA'],
  },
  {
    id: 5,
    category: 'Academic',
    title: 'Generative AI & Data Science',
    when: 'Completed Courses',
    description: 'Completed multiple specialized courses including Scout AI & DataScience and Gen AI to build modern technical expertise.',
    bg: 'linear-gradient(135deg,#e6f0ff,#dbeafe)',
    tags: ['AI', 'DataScience'],
  },
  {
    id: 6,
    category: 'Academic',
    title: 'AR/VR & Cloud Fundamentals',
    when: 'Completed Certifications',
    description: 'Gained proficiency in emerging tech like AR/VR and completed courses from Nvidia, Coursera, and AcmaGrade.',
    bg: 'linear-gradient(135deg,#d8f5e6,#e6f0ff)',
    tags: ['AR/VR', 'Cloud', 'Nvidia'],
  },

  // --- EXTRACURRICULAR ACHIEVEMENTS ---
  {
    id: 7,
    category: 'Extracurricular',
    title: 'Zonal Basketball',
    when: 'College Team',
    description: 'Represented the college team in zonal-level basketball competitions.',
    bg: 'linear-gradient(135deg,#ffe6d6,#fff6f8)',
    tags: ['Sports', 'Zonal'],
  },
  {
    id: 8,
    category: 'Extracurricular',
    title: 'Competitive Event Success',
    when: 'College Festivals',
    description: 'Secured Runner Up positions in major college events: Persofest and Spontania.',
    bg: 'linear-gradient(135deg,#dbeafe,#e6f0ff)',
    tags: ['Competition', 'Fest'],
  },
  {
    id: 9,
    category: 'Extracurricular',
    title: 'Carnatic Keyboard',
    when: 'Skill Completed',
    description: 'Successfully completed training and demonstrated proficiency in playing the Carnatic Keyboard.',
    bg: 'linear-gradient(135deg,#fff8e1,#ffebc9)',
    tags: ['Music', 'Skill'],
  },
  {
    id: 10,
    category: 'Extracurricular',
    title: 'Major Event Organizer',
    when: 'Kurukshethra, Samhita',
    description: 'Core organizing committee member for technical and cultural fests: Urutu - Kurukshethra, Prayatna, Mutex, Samhita.',
    bg: 'linear-gradient(135deg,#d8f5e6,#e6f0ff)',
    tags: ['Events', 'Volunteer'],
  },

  // --- POSITIONS & AWARDS ---
  {
    id: 11,
    category: 'Positions & Awards',
    title: 'Software Engineer at Barclays',
    when: 'Professional Role',
    description: 'Secured a full-time role as a Software Development Engineer at Barclays following a successful internship.',
    bg: 'linear-gradient(135deg,#a5c9ff,#e6f0ff)',
    tags: ['SDE', 'Finance', 'Professional'],
  },
  {
    id: 12,
    category: 'Positions & Awards',
    title: 'Chief Technical Officer (CTO)',
    when: 'CIC Leadership',
    description: 'Served as the CTO at CIC, leading technical strategy and project development for the organization.',
    bg: 'linear-gradient(135deg,#a5ffb8,#d8f5e6)',
    tags: ['Leadership', 'Tech Lead', 'CTO'],
  },
  {
    id: 13,
    category: 'Positions & Awards',
    title: 'College Team Captain',
    when: 'Basketball',
    description: 'Appointed as the Captain of the College Basketball Team and led the team to an Inter Year Match Winner title.',
    bg: 'linear-gradient(135deg,#f0e6ff,#e0e0ff)',
    tags: ['Captain', 'Leadership', 'Sports'],
  },
  {
    id: 14,
    category: 'Positions & Awards',
    title: 'Event Question Setter',
    when: 'Mutex & Samhita',
    description: 'Conceptualized and set technical questions for all events in major college fests: Mutex and Samhita.',
    bg: 'linear-gradient(135deg,#ffe6d6,#f0d5c3)',
    tags: ['Tech Lead', 'Content', 'Events'],
  },
  {
    id: 15,
    category: 'Positions & Awards',
    title: 'Jury & Judge',
    when: 'SRM & Loyola ICam',
    description: 'Served as Jury for Hackelite (SRM) and Judge for Ideate and Innovate (Loyola ICam).',
    bg: 'linear-gradient(135deg,#a5c9ff,#c3e0fa)',
    tags: ['Judging', 'Mentor', 'Hackathon'],
  },
  {
    id: 16,
    category: 'Positions & Awards',
    title: 'Chief Guest & Speaker',
    when: 'CSMIT',
    description: 'Honored as the Chief Guest at CSMIT, recognizing professional standing and expertise.',
    bg: 'linear-gradient(135deg,#e6f0ff,#f7fbff)',
    tags: ['Public Speaking', 'Recognition'],
  },
  {
    id: 17,
    category: 'Positions & Awards',
    title: 'Naan Mudhalvan Top 100',
    when: 'Scout Program',
    description: 'Recognized in the Top 100 Students in Tamil Nadu for the Naan Mudhalvan Scout Program.',
    bg: 'linear-gradient(135deg,#d8f5e6,#a5ffb8)',
    tags: ['State Level', 'Honor'],
  },
  {
    id: 18,
    category: 'Positions & Awards',
    title: 'UK Visiting Program Invitation',
    when: 'International Opportunity',
    description: 'Received an invitation/call for a Visiting Program to the UK (indicate organization/purpose if space allows).',
    bg: 'linear-gradient(135deg,#a5c9ff,#dbeafe)',
    tags: ['International', 'Opportunity'],
  },
    {
    id: 19,
    category: 'Aspiring Goals',
    title: 'Quantitative Developer',
    when: 'Career Goal',
    description: 'Build quantitative trading systems and research models; gain expertise in statistics, stochastic calculus and low-latency systems to work as a quant developer.',
    bg: 'linear-gradient(135deg,#eef2ff,#dbeafe)',
    tags: ['Quant','Trading','Research'],
  },
  {
    id: 20,
    category: 'Aspiring Goals',
    title: 'Millionaire by 30',
    when: 'Long-term Goal',
    description: 'build wealth responsibly to create freedom and resources to support my passions and dreams. I should get to a position where I can ',
    bg: 'linear-gradient(135deg,#fff7e6,#ffe1b3)',
    tags: ['Wealth','Investing','Independence'],
  },
  {
    id: 21,
    category: 'Aspiring Goals',
    title: 'Motivational Speaker & Mentor',
    when: 'Personal Mission',
    description: 'Develop public speaking and mentorship programs to inspire students and professionals, sharing lessons and practical guidance.',
    bg: 'linear-gradient(135deg,#e6fff7,#d1fff0)',
    tags: ['Speaking','Mentorship','Inspiration'],
  },
  {
    id: 22,
    category: 'Aspiring Goals',
    title: 'Create Social Impact',
    when: 'Philanthropic Goal',
    description: 'Start initiatives that improve education, career access and wellbeing so I can help people change their lives for the better.',
    bg: 'linear-gradient(135deg,#e6f7ff,#dbeaff)',
    tags: ['Philanthropy','Education','Impact'],
  },
];

const categories = ['Academic','Extracurricular','Positions & Awards','Aspiring Goals'];

const catListEl = document.getElementById('categoryList');
const cardsGridEl = document.getElementById('cardsGrid');
const showAllBtn = document.getElementById('showAllBtn');
const addBtn = document.getElementById('addBtn');

let activeCategory = categories[0];
let slideIntervals = new Map();

/* clear autoplay intervals (important when re-rendering) */
function clearIntervals(){
  slideIntervals.forEach(iv => clearInterval(iv));
  slideIntervals.clear();
}

/* Render left category buttons */
function renderCategories(){
  catListEl.innerHTML = '';
  categories.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (c === activeCategory ? ' active' : '');
    btn.setAttribute('role','tab');
    btn.setAttribute('aria-selected', c === activeCategory ? 'true' : 'false');
    btn.innerHTML = `
      <div style="text-align:left">
        <div style="font-weight:800">${c}</div>
        <div class="cat-meta">View ${c} items</div>
      </div>
    `;
    btn.addEventListener('click', ()=>{
      if(activeCategory === c) return;
      activeCategory = c;
      document.querySelectorAll('.cat-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false') });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      renderCards();
    });
    catListEl.appendChild(btn);
  });
}

/* Create a single card element where the images are background slides */
function createCardElement(a){
  const card = document.createElement('article');
  card.className = 'achievement-card';
  card.setAttribute('data-id', a.id);

  // Set gradient background directly
  card.style.background = a.bg;

  // Remove bg-slides and overlay logic
  // ...existing code for content, tags, cta, etc...

  // content (above overlay)
  const content = document.createElement('div');
  content.className = 'card-content';
  const title = document.createElement('h3'); title.className = 'title'; title.textContent = a.title;
  const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = a.when;
  const desc = document.createElement('div'); desc.className = 'desc'; desc.textContent = a.description;
  const tagsWrap = document.createElement('div'); tagsWrap.className = 'tags';
  a.tags.forEach(t => {
    const tg = document.createElement('div'); tg.className = 'tag'; tg.textContent = t; tagsWrap.appendChild(tg);
  });
  const cta = document.createElement('button'); cta.className = 'cta'; cta.textContent = 'View';

  content.appendChild(title);
  content.appendChild(meta);
  content.appendChild(desc);
  content.appendChild(tagsWrap);
  content.appendChild(cta);

  card.appendChild(content);

  return card;
}

/* render cards filtered by activeCategory; if activeCategory is '__ALL__' show all */
function renderCards(){
  clearIntervals();
  cardsGridEl.innerHTML = '';

  const list = (activeCategory === '__ALL__') ? achievements : achievements.filter(a => a.category === activeCategory);

  if(list.length === 0){
    const empty = document.createElement('div');
    empty.style.padding = '36px';
    empty.style.color = 'var(--muted)';
    empty.textContent = 'No achievements in this category yet.';
    cardsGridEl.appendChild(empty);
    return;
  }

  list.forEach(a => {
    const card = createCardElement(a);
    cardsGridEl.appendChild(card);
  });
}

/* "Show all" button toggles a global view showing all items */
showAllBtn.addEventListener('click', () => {
  activeCategory = '__ALL__';
  document.querySelectorAll('.cat-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false') });
  renderCards();
});


/* initial render */
function init(){
  renderCategories();
  renderCards();
}
function renderCategories(){
  catListEl.innerHTML = '';
  categories.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (c === activeCategory ? ' active' : '');
    btn.setAttribute('role','tab');
    btn.setAttribute('aria-selected', c === activeCategory ? 'true' : 'false');
    btn.innerHTML = `
      <div style="text-align:left">
        <div style="font-weight:800">${c}</div>
      </div>
    `;
    btn.addEventListener('click', () => {
      if(activeCategory === c) return;
      activeCategory = c;
      document.querySelectorAll('.cat-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false') });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      renderCards();
    });
    catListEl.appendChild(btn);
  });
}

/* keyboard nav for categories */
document.addEventListener('keydown', (e) => {
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){
    const idx = categories.indexOf(activeCategory);
    if(e.key === 'ArrowUp' || e.key === 'ArrowLeft'){
      e.preventDefault();
      const ni = (idx - 1 + categories.length) % categories.length;
      document.querySelectorAll('.cat-btn')[ni].click();
    } else {
      e.preventDefault();
      const ni = (idx + 1) % categories.length;
      document.querySelectorAll('.cat-btn')[ni].click();
    }
  }
});

/* cleanup */
window.addEventListener('beforeunload', () => clearIntervals());

init();

/* ===== Replace existing Wall of Fame lightbox with a more robust handler ===== */
(function () {
  function ready(fn){ if (document.readyState !== 'loading') return fn(); document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {
    const grid = document.getElementById('wallGrid');
    let modal = document.getElementById('wofModal');
    if (!grid || !modal) {
      console.warn('Wall grid or modal not found:', { grid: !!grid, modal: !!modal });
      return;
    }

    // ensure modal is in <body> to avoid transformed ancestor issues
    if (modal.parentElement !== document.body) document.body.appendChild(modal);
    modal = document.getElementById('wofModal');

    const card = modal.querySelector('.wof-card');
    const imgEl = modal.querySelector('.wof-img');
    const captionEl = modal.querySelector('.wof-caption');
    const closeBtn = modal.querySelector('.wof-close');
    const backdrop = modal.querySelector('.wof-backdrop');
    let lastActive = null;

    function extractUrlFromStyle(styleStr){
      if(!styleStr) return null;
      const m = String(styleStr).match(/url\((?:'|")?(.*?)(?:'|")?\)/);
      return m ? m[1] : null;
    }

    function getImageSrc(fig){
      if(!fig) return null;
      const img = fig.querySelector('img');
      if(img){
        return img.dataset.full || img.currentSrc || img.getAttribute('src') || null;
      }
      if(fig.dataset.full) return fig.dataset.full;
      const ds = fig.dataset.bg || fig.getAttribute('style') || '';
      const url = extractUrlFromStyle(ds);
      if(url) return url;
      return null;
    }

    function setLoading(state){
      if(!card) return;
      if(state) card.classList.add('loading'); else card.classList.remove('loading');
      // always hide image until load event
      imgEl.classList.remove('loaded');
    }

    function openModal(src, alt, caption){
      if(!src){
        console.warn('openModal called without src; caption:', caption);
        return;
      }
      lastActive = document.activeElement;

      // show overlay & card immediately
      modal.setAttribute('aria-hidden','false');
      modal.classList.add('open','show');
      document.body.style.overflow = 'hidden';
      captionEl.textContent = caption || '';
      imgEl.alt = alt || '';

      setLoading(true);

      // attach one-time load/error handlers on actual modal <img>
      const onLoad = () => {
        imgEl.classList.add('loaded');
        setLoading(false);
        cleanup();
        if(closeBtn) closeBtn.focus();
      };
      const onError = () => {
        setLoading(false);
        captionEl.textContent = (caption || '') + ' — image failed to load';
        console.error('wof: image failed to load', src);
        cleanup();
      };
      function cleanup(){
        imgEl.removeEventListener('load', onLoad);
        imgEl.removeEventListener('error', onError);
      }

      imgEl.addEventListener('load', onLoad);
      imgEl.addEventListener('error', onError);

      // set src (starts loading). using the img element ensures onload/onerror fire reliably.
      imgEl.src = src;
    }

    function closeModal(){
      modal.setAttribute('aria-hidden','true');
      modal.classList.remove('open','show');
      // clear src after a short delay to allow CSS animation
      setTimeout(()=> { try{ imgEl.src = ''; imgEl.classList.remove('loaded'); } catch(e){} }, 220);
      document.body.style.overflow = '';
      try{ lastActive && lastActive.focus(); } catch(e){}
      setLoading(false);
    }

    // Click delegation
    grid.addEventListener('click', (e) => {
      const fig = e.target.closest('.wall-item');
      if(!fig) return;
      const src = getImageSrc(fig);
      const alt = (fig.querySelector('img') && fig.querySelector('img').alt) || fig.dataset.caption || '';
      const caption = fig.dataset.caption || fig.querySelector('figcaption')?.textContent || '';
      openModal(src, alt, caption);
    });

    // keyboard open (Enter/Space) on focused .wall-item
    grid.addEventListener('keydown', (e) => {
      if(e.key !== 'Enter' && e.key !== ' ') return;
      const fig = document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('wall-item') ? document.activeElement : null;
      if(!fig) return;
      e.preventDefault();
      const src = getImageSrc(fig);
      const caption = fig.dataset.caption || fig.querySelector('figcaption')?.textContent || '';
      openModal(src, (fig.querySelector('img') && fig.querySelector('img').alt) || '', caption);
    });

    // close handlers
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(backdrop) backdrop.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

    // dev flag
    try { grid.setAttribute('data-wof-ready','true'); } catch(e){}
  });
})();

/* ===== Theme toggle (persistent + prefers-color-scheme) ===== */
(function themeInit(){
  // run after DOM is ready so elements may exist anywhere in the page
  function onReady(fn){ if (document.readyState !== 'loading') return fn(); document.addEventListener('DOMContentLoaded', fn); }

  onReady(function(){
    const root = document.documentElement;
    const key = 'site-theme';

    // helpers
    function safeGet(key){ try{ return localStorage.getItem(key); }catch(e){ return null; } }
    function safeSet(key, val){ try{ localStorage.setItem(key, val); }catch(e){} }

    // read either explicit site-theme OR accessibility panel prefs (legacy 'prefs' JSON)
    let stored = safeGet(key);
    if(!stored){
      try{
        const prefs = JSON.parse(safeGet('prefs') || '{}');
        if(prefs && prefs.theme) stored = prefs.theme;
      }catch(e){}
    }

    // apply theme
    function apply(theme){
      if(theme === 'dark'){
        root.setAttribute('data-theme','dark');
      } else {
        root.removeAttribute('data-theme');
      }
      // reflect into accessibility panel if present
      const themeSel = document.getElementById('theme-select');
      if(themeSel) themeSel.value = theme === 'dark' ? 'dark' : 'light';
      // reflect visual toggle if present
      const btn = document.getElementById('theme-toggle');
      const icon = document.getElementById('theme-icon');
      if(btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      if(icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // initialize from stored -> prefers -> default light
    if(stored) apply(stored);
    else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) apply('dark');
    else apply('light');

    // toggle function
    function toggleTheme(){
      const cur = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      safeSet(key, next);
      apply(next);
      // also update accessibility 'prefs' so both systems remain in sync
      try{
        const p = JSON.parse(safeGet('prefs') || '{}');
        p.theme = next;
        safeSet('prefs', JSON.stringify(p));
      }catch(e){}
    }

    // delegated click handler so toggle works even if button is rendered later
    document.addEventListener('click', (e) => {
      const t = e.target.closest && e.target.closest('#theme-toggle');
      if(!t) return;
      e.preventDefault();
      toggleTheme();
    });

    // also support keyboard activation (Space / Enter) on the button if it exists
    document.addEventListener('keydown', (e) => {
      const activeToggle = document.activeElement && document.activeElement.id === 'theme-toggle';
      if(!activeToggle) return;
      if(e.key === ' ' || e.key === 'Enter'){
        e.preventDefault();
        toggleTheme();
      }
    });

    // keep in sync with accessibility panel selector if present
    const themeSelEl = document.getElementById('theme-select');
    if(themeSelEl){
      themeSelEl.addEventListener('change', () => {
        const v = themeSelEl.value === 'dark' ? 'dark' : 'light';
        safeSet(key, v);
        apply(v);
        try{
          const p = JSON.parse(safeGet('prefs') || '{}');
          p.theme = v;
          safeSet('prefs', JSON.stringify(p));
        }catch(e){}
      });
    }

    // respond to system preference changes only if user hasn't set explicit site-theme
    if(window.matchMedia){
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (ev) => {
        if(!safeGet(key)){ apply(ev.matches ? 'dark' : 'light'); }
      });
    }
  });
})();

/* ===== Achievements: reset cards-area when switching category ===== */
(function achResetOnCategory(){
  function onReady(fn){ if(document.readyState !== 'loading') return fn(); document.addEventListener('DOMContentLoaded', fn); }

  onReady(function(){
    const containerSelector = '.cards-area';
    const btnSelector = '.cat-btn';

    function focusFirstCard(cardsArea){
      if(!cardsArea) return;
      const first = cardsArea.querySelector('.achievement-card, .cards-grid > *');
      if(!first) return;
      // make focusable, focus without scrolling, then restore tabindex
      const prev = first.getAttribute('tabindex');
      first.setAttribute('tabindex','-1');
      try { first.focus({preventScroll: true}); } catch(e){ first.focus(); }
      if(prev === null) first.removeAttribute('tabindex'); else first.setAttribute('tabindex', prev);
    }

    function resetCardsArea(){
      const cardsArea = document.querySelector(containerSelector);
      if(!cardsArea) return;
      // instantly jump to top (use smooth if you prefer)
      try { cardsArea.scrollTo({ top: 0, behavior: 'auto' }); }
      catch(e){ cardsArea.scrollTop = 0; }
      focusFirstCard(cardsArea);
    }

    // delegate clicks on category buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest && e.target.closest(btnSelector);
      if(!btn) return;
      // wait a tick so any category-change logic can run (show/hide DOM)
      setTimeout(resetCardsArea, 60);
    });

    // keyboard activation (Enter / Space) on focused category button
    document.addEventListener('keydown', (e) => {
      if(e.key !== 'Enter' && e.key !== ' ') return;
      const active = document.activeElement;
      if(!active || !active.matches(btnSelector)) return;
      // allow other handlers to run then reset
      setTimeout(resetCardsArea, 60);
    });

    // optional: if your category switching is done by adding/removing an 'active' class,
    // observe the container for changes and reset when children change.
    const cardsArea = document.querySelector(containerSelector);
    if(cardsArea){
      const mo = new MutationObserver((mutList) => {
        // if children or subtree changed, ensure scroll reset on category swap
        resetCardsArea();
      });
      mo.observe(cardsArea, { childList: true, subtree: false });
      // do not hold reference forever if page removes the section
      // (you can disconnect later if needed)
    }
  });
})();
