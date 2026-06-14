/* ══════════════════════════════════════════════════════════════════
   Zahra Ultimate 2032 — Fixed & Mobile-Ready Script
   ══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── Helpers ────────────────────────────────────────────────────── */
const $  = id => document.getElementById(id);
const pad = n  => String(n).padStart(2, '0');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;

/* ── Element refs ─────────────────────────────────────────────────── */
const loaderEl      = $('loader');
const scrollProg    = $('scrollProgress');
const cursorSparks  = $('cursorSparks');
const timerEl       = $('timer');
const openLetterBtn = $('openLetterBtn');
const musicBtn      = $('musicBtn');
const musicBtnLabel = $('musicBtnLabel');
const finalBtn      = $('finalBtn');
const petalsEl      = $('petals');
const firefliesEl   = $('fireflies');
const vinylEl       = $('vinyl');
const npDot         = $('npDot');
const audioStateEl  = $('audioState');
const audioToggle   = $('audioToggle');
const audio         = $('loveAudio');
const modal         = $('surpriseModal');
const closeModalEl  = $('closeModal');
const closeSurprise = $('closeSurprise');
const confettiBtn   = $('confettiBtn');
const flowerGift    = $('flowerGift');
const toGalleryBtn  = $('toGalleryBtn');
const gallerySection= $('gallerySection');
const galleryEl     = $('gallery');
const lightboxEl    = $('lightbox');
const lightboxImg   = $('lightboxImg');
const lightboxCap   = $('lightboxCaption');
const lightboxClose = $('lightboxClose');
const closeLightbox = $('closeLightbox');
const lightboxPrev  = $('lightboxPrev');
const lightboxNext  = $('lightboxNext');

const photos = window.__PHOTOS__ || [];

let musicUnlocked  = false;
let currentPhoto   = 0;
let lbTouchStartX  = 0;

/* ══ LOADER ═══════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => loaderEl.classList.add('hide'), 900);
});

/* ══ SCROLL PROGRESS ═══════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  scrollProg.style.width = Math.min(100, pct * 100) + '%';
}, { passive: true });

/* ══ CURSOR SPARKLE (desktop only) ════════════════════════════════ */
if (!isTouch && !prefersReducedMotion) {
  const sparkColors = ['#ff7ab6','#f6d88a','#a07eff','#ffffff','#ffadd8','#c0aaff'];
  let lastSpark = 0;
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastSpark < 80) return;
    lastSpark = now;
    for (let i = 0; i < 2; i++) {
      const el = document.createElement('span');
      el.className = 'spark';
      const size = 3 + Math.random() * 4;
      el.style.cssText = [
        `left:${e.clientX - size / 2}px`,
        `top:${e.clientY - size / 2}px`,
        `width:${size}px`,`height:${size}px`,
        `background:${sparkColors[Math.floor(Math.random() * sparkColors.length)]}`,
        `--dx:${(Math.random() - .5) * 32}px`,
        `--dy:${(Math.random() - .5) * 32}px`,
        `animation-duration:${.45 + Math.random() * .4}s`,
        `animation-delay:${i * 30}ms`,
      ].join(';');
      cursorSparks.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
  });
}

/* ══ TIMER ════════════════════════════════════════════════════════ */
function updateTimer() {
  const start = new Date('2025-09-23T00:00:00+07:00').getTime();
  const diff  = Math.max(0, Date.now() - start);
  const sec   = Math.floor(diff / 1000);
  const days  = Math.floor(sec / 86400);
  const hrs   = Math.floor((sec % 86400) / 3600);
  const mins  = Math.floor((sec % 3600) / 60);
  const secs  = sec % 60;
  timerEl.textContent = `${days} hari ${pad(hrs)} jam ${pad(mins)} menit ${pad(secs)} detik`;
}
updateTimer();
setInterval(updateTimer, 1000);

/* ══ MUSIC ════════════════════════════════════════════════════════ */
function setPlayUI(playing) {
  // Refresh refs in case innerHTML was replaced
  const pi = $('playIcon');
  if (playing) {
    if (pi) pi.textContent = '⏸ Pause';
    audioToggle.setAttribute('aria-label', 'Jeda musik');
    vinylEl.classList.add('spinning');
    npDot.classList.add('active');
    audioStateEl.textContent = 'Lagu sedang diputar ♪';
    musicBtnLabel.textContent = 'Jeda Musik';
    musicBtn.querySelector('.btn-icon').textContent = '⏸';
  } else {
    if (pi) pi.textContent = '▶ Play';
    audioToggle.setAttribute('aria-label', 'Putar musik');
    vinylEl.classList.remove('spinning');
    npDot.classList.remove('active');
    audioStateEl.textContent = audio.ended
      ? 'Lagu selesai diputar.'
      : (musicUnlocked ? 'Lagu dijeda.' : 'Buka surat dulu, lagu akan otomatis mengalun.');
    if (musicUnlocked) {
      musicBtnLabel.textContent = 'Putar Lagu';
      musicBtn.querySelector('.btn-icon').textContent = '♪';
    }
  }
}

function unlockMusic() {
  if (musicUnlocked) return;
  musicUnlocked = true;
  musicBtn.disabled = false;
  audioToggle.disabled = false;
  musicBtnLabel.textContent = 'Putar Lagu';
  musicBtn.querySelector('.btn-icon').textContent = '♪';
}

async function tryAutoPlay() {
  try {
    await audio.play();
    setPlayUI(true);
  } catch {
    // Autoplay blocked (common on iOS) — user will tap the music button
    audioStateEl.textContent = 'Tap tombol ▶ Play untuk mulai memutar lagu.';
    setPlayUI(false);
  }
}

function toggleMusic() {
  if (!musicUnlocked) {
    audioStateEl.textContent = 'Buka surat dulu — lagu akan otomatis menyala.';
    return;
  }
  if (audio.paused) {
    audio.play()
      .then(() => setPlayUI(true))
      .catch(() => { audioStateEl.textContent = 'Tap sekali lagi jika lagu belum muncul.'; });
  } else {
    audio.pause();
    setPlayUI(false);
  }
}

musicBtn.addEventListener('click', toggleMusic);
audioToggle.addEventListener('click', toggleMusic);
audio.addEventListener('ended', () => setPlayUI(false));

/* ══ PETAL / CONFETTI ══════════════════════════════════════════════ */
const petalStyles = [
  'linear-gradient(180deg,rgba(255,255,255,.95),rgba(255,122,182,.85))',
  'linear-gradient(180deg,rgba(255,255,255,.95),rgba(246,216,138,.85))',
  'linear-gradient(180deg,rgba(255,200,230,.95),rgba(160,126,255,.8))',
];

function spawnPetal(forceTop) {
  const el = document.createElement('span');
  el.className = 'petal';
  el.style.left = Math.random() * 100 + 'vw';
  const dur = 4 + Math.random() * 5;
  el.style.animationDuration = dur + 's';
  el.style.opacity = 0.4 + Math.random() * 0.5;
  el.style.setProperty('--drift', (Math.random() * 220 - 110) + 'px');
  el.style.background = petalStyles[Math.floor(Math.random() * petalStyles.length)];
  const w = 8 + Math.random() * 10;
  el.style.width = w + 'px';
  el.style.height = (w * 1.4) + 'px';
  petalsEl.appendChild(el);
  setTimeout(() => el.remove(), (dur + 1) * 1000);
}

function launchConfetti(count = isTouch ? 30 : 50) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => spawnPetal(true), i * 22);
  }
}

/* Ambient petals */
if (!prefersReducedMotion) {
  const ambientPetalDelay = isTouch ? 4000 : 2600;
  const maxAmbient = isTouch ? 3 : 5;
  (function spawnAmbient() {
    if (petalsEl.querySelectorAll('.petal').length < maxAmbient) spawnPetal();
    setTimeout(spawnAmbient, ambientPetalDelay);
  })();
}

/* ══ LETTER BUTTON ═════════════════════════════════════════════════ */
openLetterBtn.addEventListener('click', () => {
  const letterSection = $('letterSection');
  letterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  unlockMusic();
  // Small delay lets scroll start before play (important on iOS)
  setTimeout(tryAutoPlay, 400);
});

/* ══ MODAL ════════════════════════════════════════════════════════ */
function openModal() {
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Focus trap: focus first button
  setTimeout(() => confettiBtn.focus(), 100);
}
function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  finalBtn.focus();
}

/* ═══ CRITICAL FIX: finalBtn → opens modal (not direct sequence) ═══ */
finalBtn.addEventListener('click', openModal);
closeModalEl.addEventListener('click', closeModal);
closeSurprise.addEventListener('click', closeModal);

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modal.classList.contains('show')) closeModal();
    if (lightboxEl.classList.contains('show')) closeLightboxFn();
  }
  if (lightboxEl.classList.contains('show')) {
    if (e.key === 'ArrowLeft')  navigatePhoto(-1);
    if (e.key === 'ArrowRight') navigatePhoto(+1);
  }
});

/* ══ SHOW FINAL SEQUENCE (confetti → flower → gallery) ════════════ */
function showFinalSequence() {
  closeModal();
  launchConfetti(isTouch ? 40 : 70);

  // Show flower gift section
  flowerGift.style.display = 'block';
  flowerGift.setAttribute('aria-hidden', 'false');
  flowerGift.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Show gallery after a moment
  setTimeout(() => {
    gallerySection.style.display = 'block';
    gallerySection.setAttribute('aria-hidden', 'false');
    // Re-observe newly visible cards
    observeGallery();
    launchConfetti(isTouch ? 20 : 35);
  }, 1800);
}

confettiBtn.addEventListener('click', showFinalSequence);

toGalleryBtn.addEventListener('click', () => {
  gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ══ GALLERY ══════════════════════════════════════════════════════ */
function buildGallery() {
  if (!galleryEl || !photos.length) return;
  galleryEl.innerHTML = photos.map((p, i) => `
    <figure class="photo-card reveal" data-idx="${i}" role="button" tabindex="0" aria-label="${p.caption}">
      <img src="${p.file}" alt="${p.caption}" loading="lazy" decoding="async">
      <div class="photo-overlay" aria-hidden="true">
        <div class="photo-zoom">⊕</div>
        <figcaption class="photo-caption">${p.caption}</figcaption>
      </div>
    </figure>
  `).join('');

  galleryEl.querySelectorAll('.photo-card').forEach(card => {
    const idx = parseInt(card.dataset.idx);
    card.addEventListener('click',    () => openLightbox(idx));
    card.addEventListener('keydown',  e  => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }});
  });
}

/* ══ LIGHTBOX ════════════════════════════════════════════════════ */
function openLightbox(idx) {
  currentPhoto = idx;
  renderLightboxPhoto();
  lightboxEl.classList.add('show');
  lightboxEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}
function closeLightboxFn() {
  lightboxEl.classList.remove('show');
  lightboxEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function navigatePhoto(dir) {
  currentPhoto = (currentPhoto + dir + photos.length) % photos.length;
  // Re-animate image
  lightboxImg.style.animation = 'none';
  void lightboxImg.offsetWidth; // reflow
  lightboxImg.style.animation = '';
  renderLightboxPhoto();
}
function renderLightboxPhoto() {
  const p = photos[currentPhoto];
  lightboxImg.src    = p.file;
  lightboxImg.alt    = p.caption;
  lightboxCap.textContent = p.caption;
}

lightboxClose.addEventListener('click', closeLightboxFn);
closeLightbox.addEventListener('click', closeLightboxFn);
if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigatePhoto(-1));
if (lightboxNext) lightboxNext.addEventListener('click', () => navigatePhoto(+1));

/* Touch swipe for lightbox */
const lbContent = $('lightboxContent');
if (lbContent) {
  lbContent.addEventListener('touchstart', e => {
    lbTouchStartX = e.touches[0].clientX;
  }, { passive: true });
  lbContent.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - lbTouchStartX;
    if (Math.abs(dx) > 50) navigatePhoto(dx < 0 ? 1 : -1);
  }, { passive: true });
}

/* ══ STARS CANVAS ════════════════════════════════════════════════ */
function makeStars() {
  if (prefersReducedMotion) return;
  const canvas = $('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], twinkles = [];

  function resize() {
    const dpr = Math.min(devicePixelRatio, 2); // cap at 2x for perf
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(isTouch ? 30 : 180, Math.floor(window.innerWidth / (isTouch ? 20 : 8)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.7 + 0.2,
      s: Math.random() * 0.08 + 0.01,
      ta: Math.random() * Math.PI * 2,
    }));
    twinkles = Array.from({ length: isTouch ? 2 : 8 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1.2 + Math.random() * 1,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  let raf;
  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const s of stars) {
      s.y += s.s; s.ta += 0.012;
      if (s.y > window.innerHeight + 2) { s.y = -2; s.x = Math.random() * window.innerWidth; }
      const alpha = s.a * (0.7 + 0.3 * Math.sin(s.ta));
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const s of twinkles) {
      s.phase += 0.025;
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.phase));
      const r = s.r * (.8 + .4 * Math.abs(Math.sin(s.phase)));
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3);
      g.addColorStop(0, `rgba(255,240,210,${alpha.toFixed(2)})`);
      g.addColorStop(1, 'rgba(255,200,180,0)');
      ctx.beginPath();
      ctx.fillStyle = g;
      ctx.arc(s.x, s.y, r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  }, { passive: true });

  // Pause canvas when tab hidden (saves battery)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else { raf = requestAnimationFrame(draw); }
  });

  resize();
  raf = requestAnimationFrame(draw);
}

/* ══ FIREFLIES ════════════════════════════════════════════════════ */
function makeFireflies() {
  if (prefersReducedMotion || isTouch) return;
  const count = 8;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'firefly';
    const dur = 7 + Math.random() * 10;
    el.style.cssText = [
      `left:${Math.random() * 100}vw`,
      `top:${Math.random() * 100}vh`,
      `--dur:${dur}s`,
      `--mx:${(Math.random() * 80 - 40)}px`,
      `--my:${(Math.random() * 80 - 40)}px`,
      `--mx2:${(Math.random() * 80 - 40)}px`,
      `--my2:${(Math.random() * 80 - 40)}px`,
      `animation-delay:${(Math.random() * dur)}s`,
    ].join(';');
    const violet = Math.random() > .5;
    el.style.background  = violet ? 'var(--violet)' : 'var(--gold)';
    el.style.boxShadow   = violet ? '0 0 8px 2px rgba(160,126,255,.7)' : '0 0 8px 2px rgba(246,216,138,.7)';
    firefliesEl.appendChild(el);
  }
}

/* ══ SCROLL REVEAL ════════════════════════════════════════════════ */
function setupReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function observeGallery() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.photo-card.reveal:not(.visible)').forEach(el => obs.observe(el));
}

/* ══ INIT ════════════════════════════════════════════════════════ */
buildGallery();
makeStars();
makeFireflies();
setupReveal();
setPlayUI(false);
