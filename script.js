const fonts = [
  "'Rubik Glitch', sans-serif",
  "'Bebas Neue', sans-serif",
  "'Bitcount Grid Double', sans-serif",
  "'Rubik Distressed', sans-serif",
  "'Uncial Antiqua', cursive",
  "'Abril Fatface', serif",
  "'Caesar Dressing', cursive",
  "'Henny Penny', cursive",
  "'Bungee', sans-serif",
  "'Black Ops One', sans-serif",
];

const brandName  = document.getElementById('brandName');
const navbar     = document.getElementById('navbar');
const banner     = document.getElementById('banner');
const scrollHint = document.getElementById('scrollHint');

let fontIndex   = 0;
let cycling     = true;
let cycleTimer  = null;
let hasScrolled = false;

function switchFont() {
  if (!cycling) return;
  fontIndex = (fontIndex + 1) % fonts.length;
  brandName.style.fontFamily = fonts[fontIndex];
}

function startCycling() {
  brandName.style.fontFamily = fonts[0];
  cycleTimer = setInterval(switchFont, 150);
}

function stopCycling() {
  cycling = false;
  clearInterval(cycleTimer);
}

// Start right away
window.onload = function() {
  startCycling();
};

// On first scroll
window.addEventListener('scroll', () => {
  if (!hasScrolled && window.scrollY > 10) {
    hasScrolled = true;
    stopCycling();
    banner.classList.add('hidden');
    navbar.classList.add('visible');
    scrollHint.classList.add('hidden');
    brandName.classList.add('scrolled');
  }
}, { passive: true });

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── POLKA DOT SPOTLIGHT ──────────────────────────────────
(function() {
  const home = document.getElementById('home');
  const canvas = document.getElementById('polka-canvas');
  const ctx = canvas.getContext('2d');

  const DOT_SPACING = 30;
  const DOT_RADIUS = 8;
  const SPOTLIGHT = 100;
  let mx = -999, my = -999;

  function resize() {
    canvas.width = home.clientWidth;
    canvas.height = home.clientHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = DOT_SPACING / 2; y < canvas.height; y += DOT_SPACING) {
      for (let x = DOT_SPACING / 2; x < canvas.width; x += DOT_SPACING) {
        const dist = Math.hypot(x - mx, y - my);
        const t = Math.max(0, 1 - dist / SPOTLIGHT);
        const alpha = t * 1;
        ctx.beginPath();
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 57, 43, ${alpha})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }

  home.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });

  home.addEventListener('mouseleave', () => { mx = -999; my = -999; });

  resize();
  window.addEventListener('resize', resize);
  draw();
})();

// ── BRAND NAME FADE ON SECTION CHANGE ───────────────
window.addEventListener('scroll', () => {
  const homeSection = document.getElementById('home');
  const homeBottom = homeSection.getBoundingClientRect().bottom;
  if (homeBottom <= 0) {
    brandName.style.opacity = '0';
    brandName.style.pointerEvents = 'none';
  } else {
    brandName.style.opacity = '1';
    brandName.style.pointerEvents = 'all';
  }
}, { passive: true });

// ── ABOUT LETTER ANIMATION ───────────────────────────
const aboutLetters = document.querySelectorAll('.about-letter');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      aboutLetters.forEach(l => l.classList.add('visible'));
    } else {
      aboutLetters.forEach(l => l.classList.remove('visible'));
    }
  });
}, { threshold: 0.2 });

const aboutSection = document.getElementById('about');
if (aboutSection) observer.observe(aboutSection);

// ── WORKS TITLE ANIMATION ─────────────────────────────
const worksLetters = document.querySelectorAll('.works-letter');
const worksSection = document.getElementById('works');

const worksObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      worksLetters.forEach(l => l.classList.add('visible'));
    } else {
      worksLetters.forEach(l => l.classList.remove('visible'));
    }
  });
}, { threshold: 0.2 });

if (worksSection) worksObserver.observe(worksSection);

// ── WORKS FILTER ──────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.work-card').forEach(card => {
      if (filter === 'all') {
        card.style.display = 'flex';
      } else if (filter === 'highlight') {
        card.style.display = card.dataset.highlight ? 'flex' : 'none';
      } else if (card.dataset.category === filter) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});