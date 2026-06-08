/* ================================================
   DHANUSH KUMAR CHINTA — PORTFOLIO
   main.js · All interactions & animations
   ================================================ */

'use strict';

/* ─── NAVBAR: scroll glass effect ───────────── */
const header      = document.querySelector('header');
const navToggle   = document.querySelector('.nav-toggle');
const navMenu     = document.querySelector('.nav-links');
const navLinks    = document.querySelectorAll('.nav-links a:not(.btn)');

function onScroll() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  updateActiveNav();
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ─── MOBILE MENU ────────────────────────────── */
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ─── ACTIVE NAV HIGHLIGHT ───────────────────── */
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  let current = '';
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    if (scrollY >= section.offsetTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ─── SCROLL REVEAL ──────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Also reveal individual cards with staggered delay
function observeCards(selector, baseDelay = 0) {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${baseDelay + i * 0.1}s`;
    card.classList.add('reveal');
    revealObserver.observe(card);
  });
}

observeCards('.stat-card',    0.05);
observeCards('.project-card', 0.05);
observeCards('.cert-card',    0.05);
observeCards('.skill-group',  0.05);

/* ─── SKILL BAR ANIMATION ────────────────────── */
const skillBars = document.querySelectorAll('.skill-bar__fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar    = entry.target;
      const target = bar.getAttribute('data-width');
      // Small delay so reveal animation plays first
      setTimeout(() => {
        bar.style.width = `${target}%`;
      }, 200);
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

/* ─── SMOOTH SCROLL (for older browsers) ────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // header height
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── TYPEWRITER EFFECT (hero tagline) ──────── */
function typewriter(el, words, speed = 90, pause = 2000) {
  let wordIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = words[wordIdx];
    el.textContent = deleting
      ? current.slice(0, charIdx--)
      : current.slice(0, charIdx++);

    let delay = deleting ? speed / 2 : speed;

    if (!deleting && charIdx > current.length) {
      delay = pause;
      deleting = true;
    } else if (deleting && charIdx < 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
      delay    = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
}

// Apply to the highlight span in hero tagline
const taglineHighlight = document.querySelector('.hero__tagline--highlight');
if (taglineHighlight) {
  const originalText = taglineHighlight.textContent.trim();
  const words = [
    originalText,
    'Algorithms · Learning · Impact',
    'Python · Java · JavaScript',
    'Ideas · Code · Results',
  ];
  // Wait for hero animation to finish before starting typewriter
  setTimeout(() => typewriter(taglineHighlight, words, 75, 2400), 1800);
}

/* ─── CURSOR GLOW (desktop only) ────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(94,196,230,0.045) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top  = `${e.clientY}px`;
  }, { passive: true });
}

/* ─── SECTION TAG COUNTER ANIMATION ─────────── */
function animateCounter(el, target, duration = 1200) {
  const start     = performance.now();
  const isDecimal = String(target).includes('.');
  const from      = 0;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    const value    = from + (target - from) * ease;
    el.textContent = isDecimal ? value.toFixed(2) : Math.floor(value) + '+';
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target : target + '+';
  }
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const raw = el.textContent.replace('+', '').trim();
    const num = parseFloat(raw);
    if (!isNaN(num)) animateCounter(el, num);
    statObserver.unobserve(el);
  });
}, { threshold: 0.8 });

document.querySelectorAll('.stat-card__value').forEach(el => {
  statObserver.observe(el);
});

/* ─── COPY EMAIL ON CLICK ────────────────────── */
const emailLink = document.querySelector('.contact__email');
if (emailLink) {
  emailLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailLink.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      const original = emailLink.textContent;
      emailLink.textContent = 'Copied to clipboard ✓';
      emailLink.style.color = 'var(--cyan-bright)';
      setTimeout(() => {
        emailLink.textContent = original;
        emailLink.style.color = '';
      }, 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
  emailLink.title = 'Click to copy email address';
}

/* ─── KEYBOARD: close mobile menu on Escape ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    navToggle.focus();
  }
});

/* ─── PREFERS REDUCED MOTION: disable anims ── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition', '0s');
  skillBars.forEach(bar => {
    bar.style.transition = 'none';
    bar.style.width = `${bar.getAttribute('data-width')}%`;
  });
}

/* ================================================
   STEP 4 — ANIMATIONS & PERFORMANCE ENHANCEMENTS
   ================================================ */

/* ─── FLOATING PARTICLES (hero canvas) ──────── */
(function initParticles() {
  const hero   = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id    = 'particles-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.appendChild(canvas);

  const ctx    = canvas.getContext('2d');
  let   W, H, particles = [], raf;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT  = window.innerWidth < 600 ? 28 : 55;
  const CYAN   = [94, 196, 230];

  function rand(a, b) { return a + Math.random() * (b - a); }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x:     rand(0, 1),
      y:     rand(0, 1),
      r:     rand(0.5, 2),
      vx:    rand(-0.06, 0.06),
      vy:    rand(-0.08, -0.02),
      alpha: rand(0.1, 0.55),
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      const x = p.x * W, y = p.y * H;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CYAN.join(',')},${p.alpha})`;
      ctx.fill();

      p.x += p.vx / W * 60;
      p.y += p.vy / H * 60;

      // wrap around
      if (p.y < -0.02) p.y = 1.02;
      if (p.x < -0.02) p.x = 1.02;
      if (p.x >  1.02) p.x = -0.02;
    });
    raf = requestAnimationFrame(draw);
  }

  // Pause particles when hero leaves viewport (perf)
  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { raf = raf || requestAnimationFrame(draw); }
      else { cancelAnimationFrame(raf); raf = null; }
    });
  }, { threshold: 0.01 });
  heroObserver.observe(hero);

  // Respect reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    raf = requestAnimationFrame(draw);
  }
})();

/* ─── BUTTON RIPPLE EFFECT ───────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left  - size / 2;
    const y      = e.clientY - rect.top   - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ─── SKILL BAR: pulse when done ────────────── */
skillBars.forEach(bar => {
  const orig = bar.style.transition || '';
  const observer = new MutationObserver(() => {
    const w = parseFloat(bar.style.width);
    if (w > 0) {
      setTimeout(() => bar.classList.add('done'), 1250);
      observer.disconnect();
    }
  });
  observer.observe(bar, { attributeFilter: ['style'] });
});

/* ─── 3D CARD TILT on mouse move ─────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ─── SECTION PROGRESS INDICATOR ────────────── */
(function progressBar() {
  const bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0;
    height: 2px; width: 0%;
    background: linear-gradient(90deg, var(--cyan-dim), var(--cyan-bright));
    z-index: 200;
    transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(94,196,230,0.5);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = `${pct}%`;
  }, { passive: true });
})();

/* ─── LAZY LOAD images (future-proof) ───────── */
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  const lazyObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src;
        lazyObs.unobserve(e.target);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => lazyObs.observe(img));
}

/* ─── PERFORMANCE: defer non-critical work ─── */
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Pre-connect to Google Fonts if not already loaded
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'assets/resume.pdf';
    document.head.appendChild(link);
  });
}

/* ================================================
   STEP 5 — FINAL OPTIMIZATIONS
   ================================================ */

/* ── Mobile nav overlay backdrop ──────────────── */
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
overlay.setAttribute('aria-hidden', 'true');
document.body.appendChild(overlay);

overlay.addEventListener('click', () => {
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
});

// Patch original toggle to also show overlay
const _origToggle = navToggle.onclick;
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.contains('open');
  overlay.classList.toggle('active', isOpen);
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => overlay.classList.remove('active'));
});

/* ── Console easter egg ────────────────────────── */
console.log(
  '%c👋 Hi there! I\'m Dhanush Kumar Chinta.',
  'color: #5ec4e6; font-size: 14px; font-weight: bold;'
);
console.log(
  '%cB.Tech CS (Data Science) · PVP Siddhartha · CGPA 8.34',
  'color: #a9a296; font-size: 12px;'
);
console.log(
  '%c🔗 Let\'s connect → linkedin.com/in/dhanushkumarchinta',
  'color: #5ec4e6; font-size: 12px;'
);
