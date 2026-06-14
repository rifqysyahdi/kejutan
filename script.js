/* ══════════════════════════════════════════════════════════════════
   Zahra Ultimate 2032 — Enhanced Script
   ══════════════════════════════════════════════════════════════════ */

const photos        = window.__PHOTOS__ || [];
const gallery       = document.getElementById('gallery');
const timerEl       = document.getElementById('timer');
const openLetterBtn = document.getElementById('openLetterBtn');
const surpriseBtn   = document.getElementById('surpriseBtn');
const finalBtn      = document.getElementById('finalBtn');
const finalBanner   = document.getElementById('finalBanner');
const modal         = document.getElementById('surpriseModal');
const closeModal    = document.getElementById('closeModal');
const closeSurprise = document.getElementById('closeSurprise');
const confettiBtn   = document.getElementById('confettiBtn');
const musicBtn      = document.getElementById('musicBtn');
const audioToggle   = document.getElementById('audioToggle');
const audio         = document.getElementById('loveAudio');
const audioState    = document.getElementById('audioState');
const petals        = document.getElementById('petals');
const playIcon      = document.getElementById('playIcon');
const vinyl         = document.getElementById('vinyl');
const npDot         = document.querySelector('.np-dot');
const loader        = document.getElementById('loader');
const scrollProg    = document.getElementById('scrollProgress');
const cursorSparks  = document.getElementById('cursorSparks');
const firefliesEl   = document.getElementById('fireflies');

const pad = n => String(n).padStart(2, '0');

/* ══ LOADER ══════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hide'), 900);
});

/* ══ SCROLL PROGRESS ═════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  scrollProg.style.width = Math.min(100, pct * 100) + '%';
}, { passive: true });

/* ══ CURSOR SPARKLE ══════════════════════════════════════════════════ */
const sparkColors = ['#ff7ab6','#f6d88a','#a07eff','#ffffff','#ffadd8','#c0aaff'];
let lastSpark = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastSpark < 60) return;
  lastSpark = now;

  for (let i = 0; i < 3; i++) {
    const el = document.createElement('span');
    el.className = 'spark';
    const size = 3 + Math.random() * 5;
    el.style.cssText = `
      left:${e.clientX - size/2}px;
      top:${e.clientY - size/2}px;
      width:${size}px; height:${size}px;
      background:${sparkColors[Math.floor(Math.random() * sparkColors.length)]};
      --dx:${(Math.random()-0.5)*40}px;
      --dy:${(Math.random()-0.5)*40}px;
      animation-duration:${.5 + Math.random()*.5}s;
      animation-delay:${i * 40}ms;
    `;
    cursorSparks.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
});

/* ══ TIMER ═══════════════════════════════════════════════════════════ */
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

/* ══ GALLERY ═════════════════════════════════════════════════════════ */
let currentPhotoIdx = 0;

function buildGallery() {
  gallery.innerHTML = photos.map((item, idx) => `
    <figure class="photo-card reveal" style="transition-delay:${idx * 55}ms" data-idx="${idx}">
      <img src="${item.file}" alt="Foto kenangan ${idx + 1}" loading="lazy">
      <div class="photo-overlay">
        <div class="photo-zoom">⊕</div>
        <figcaption class="photo-caption">${item.caption}</figcaption>
      </div>
    </figure>
  `).join('');

  gallery.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', () => openLightbox(parseInt(card.dataset.idx)));
  });
}

/* ══ LIGHTBOX ════════════════════════════════════════════════════════ */
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxCap    = document.getElementById('lightboxCaption');
const lightboxClose  = document.getElementById('lightboxClose');
const closeLightbox  = document.getElementById('closeLightbox');
const lightboxPrev   = document.getElementById('lightboxPrev');
const lightboxNext   = document.getElementById('lightboxNext');

function openLightbox(idx) {
  currentPhotoIdx = idx;
  showLightboxPhoto();
  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeLightboxFn() {
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
function showLightboxPhoto() {
  const p = photos[currentPhotoIdx];
  lightboxImg.src = p.file;
  lightboxCap.textContent = p.caption;
}
lightboxPrev.addEventListener('click', () => {
  currentPhotoIdx = (currentPhotoIdx - 1 + photos.length) % photos.length;
  showLightboxPhoto();
});
lightboxNext.addEventListener('click', () => {
  currentPhotoIdx = (currentPhotoIdx + 1) % photos.length;
  showLightboxPhoto();
});
lightboxClose.addEventListener('click', closeLightboxFn);
closeLightbox.addEventListener('click', closeLightboxFn);
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightboxFn();
  if (e.key === 'ArrowLeft')  { currentPhotoIdx = (currentPhotoIdx - 1 + photos.length) % photos.length; showLightboxPhoto(); }
  if (e.key === 'ArrowRight') { currentPhotoIdx = (currentPhotoIdx + 1) % photos.length; showLightboxPhoto(); }
});

/* ══ MODAL ═══════════════════════════════════════════════════════════ */
function showModal() { modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
function hideModal() { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }

/* ══ CONFETTI / PETALS ═══════════════════════════════════════════════ */
const petalStyles = [
  'linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,122,182,.85))',
  'linear-gradient(180deg, rgba(255,255,255,.95), rgba(246,216,138,.85))',
  'linear-gradient(180deg, rgba(255,200,230,.95), rgba(160,126,255,.8))',
];

function launchConfetti(count = 200) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'petal';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.animationDuration = (2.5 + Math.random() * 3) + 's';
      el.style.opacity = 0.5 + Math.random() * 0.45;
      el.style.setProperty('--drift', (Math.random() * 220 - 110) + 'px');
      el.style.background = petalStyles[Math.floor(Math.random() * petalStyles.length)];
      const w = 8 + Math.random() * 10;
      el.style.width = w + 'px';
      el.style.height = (w * 1.4) + 'px';
      petals.appendChild(el);
      setTimeout(() => el.remove(), 6500);
    }, i * 18);
  }
}

function revealFinal() {
  finalBanner.classList.add('show');
  launchConfetti(220);
  setTimeout(() => finalBanner.classList.remove('show'), 7500);
}
function scrollToLetter() {
  document.getElementById('letterSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

openLetterBtn.addEventListener('click', () => { scrollToLetter(); setTimeout(showModal, 600); });
surpriseBtn.addEventListener('click', showModal);
finalBtn.addEventListener('click', revealFinal);
closeModal.addEventListener('click', hideModal);
closeSurprise.addEventListener('click', hideModal);
confettiBtn.addEventListener('click', () => { launchConfetti(260); revealFinal(); hideModal(); });

/* ══ MUSIC ═══════════════════════════════════════════════════════════ */
function setPlaying(playing) {
  if (playing) {
    audioState.textContent = 'Lagu sedang diputar ♪';
    playIcon.textContent = '⏸ Pause';
    musicBtn.innerHTML = '<span class="btn-icon">⏸</span> Jeda Musik';
    vinyl.classList.add('spinning');
    npDot.classList.add('active');
  } else {
    audioState.textContent = audio.ended ? 'Lagu selesai diputar.' : 'Lagu dijeda.';
    playIcon.textContent = '▶ Play';
    musicBtn.innerHTML = '<span class="btn-icon">♪</span> Putar Lagu';
    vinyl.classList.remove('spinning');
    npDot.classList.remove('active');
  }
}

function toggleMusic() {
  if (audio.paused) {
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => { audioState.textContent = 'Klik lagi untuk memutar — browser memerlukan konfirmasi.'; });
  } else {
    audio.pause();
    setPlaying(false);
  }
}
musicBtn.addEventListener('click', toggleMusic);
audioToggle.addEventListener('click', toggleMusic);
audio.addEventListener('ended', () => setPlaying(false));

/* ══ STARS CANVAS ════════════════════════════════════════════════════ */
function makeStars() {
  const canvas = document.getElementById('stars');
  const ctx    = canvas.getContext('2d');
  let stars    = [];
  let twinkle  = [];

  function resize() {
    canvas.width  = window.innerWidth  * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    const count = Math.min(240, Math.floor(window.innerWidth / 7));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      a: Math.random() * 0.7 + 0.2,
      s: Math.random() * 0.12 + 0.01,
      ta: Math.random() * Math.PI * 2,
    }));
    // Some extra bright twinkle stars
    twinkle = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1.5 + Math.random() * 1,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const s of stars) {
      s.y += s.s;
      s.ta += 0.012;
      const alpha = s.a * (0.7 + 0.3 * Math.sin(s.ta));
      if (s.y > window.innerHeight + 2) { s.y = -2; s.x = Math.random() * window.innerWidth; }
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const s of twinkle) {
      s.phase += 0.025;
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.phase));
      const r = s.r * (.8 + .4 * Math.abs(Math.sin(s.phase)));
      ctx.beginPath();
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3);
      g.addColorStop(0, `rgba(255,240,210,${alpha})`);
      g.addColorStop(1, 'rgba(255,200,180,0)');
      ctx.fillStyle = g;
      ctx.arc(s.x, s.y, r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();
  requestAnimationFrame(draw);
}

/* ══ FIREFLIES ═══════════════════════════════════════════════════════ */
function makeFireflies() {
  const count = 22;
  for (let i = 0; i < count; i++) {
    const el  = document.createElement('div');
    el.className = 'firefly';
    const dur = 7 + Math.random() * 10;
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top  = Math.random() * 100 + 'vh';
    el.style.setProperty('--dur', dur + 's');
    el.style.setProperty('--mx',  (Math.random() * 80 - 40) + 'px');
    el.style.setProperty('--my',  (Math.random() * 80 - 40) + 'px');
    el.style.setProperty('--mx2', (Math.random() * 80 - 40) + 'px');
    el.style.setProperty('--my2', (Math.random() * 80 - 40) + 'px');
    el.style.animationDelay = (Math.random() * dur) + 's';
    const isViolet = Math.random() > .5;
    el.style.background = isViolet ? 'var(--violet)' : 'var(--gold)';
    el.style.boxShadow  = isViolet
      ? '0 0 8px 2px rgba(160,126,255,.7)'
      : '0 0 8px 2px rgba(246,216,138,.7)';
    firefliesEl.appendChild(el);
  }
}

/* ══ FALLING PETALS ══════════════════════════════════════════════════ */
function spawnPetals() {
  setInterval(() => {
    const el = document.createElement('span');
    el.className = 'petal';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (6 + Math.random() * 6) + 's';
    el.style.opacity = 0.25 + Math.random() * 0.45;
    el.style.setProperty('--drift', (Math.random() * 240 - 120) + 'px');
    el.style.background = petalStyles[Math.floor(Math.random() * petalStyles.length)];
    const w = 8 + Math.random() * 8;
    el.style.width  = w + 'px';
    el.style.height = (w * 1.4) + 'px';
    petals.appendChild(el);
    setTimeout(() => el.remove(), 13000);
  }, 1300);
}

/* ══ REVEAL ON SCROLL ════════════════════════════════════════════════ */
function setupReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══ RE-OBSERVE GALLERY CARDS AFTER BUILD ════════════════════════════ */
function observeGallery() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.photo-card.reveal').forEach(el => obs.observe(el));
}

/* ══ INIT ════════════════════════════════════════════════════════════ */
buildGallery();
makeStars();
makeFireflies();
spawnPetals();
setupReveal();
observeGallery();
