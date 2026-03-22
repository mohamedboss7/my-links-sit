/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

window.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.transform = `translate(${mx}px,${my}px)`;
  dot.style.opacity   = '1';
  ring.style.opacity  = '1';
  document.body.classList.add('hide-cursor');
});

document.addEventListener('mouseleave', () => {
  dot.style.opacity  = '0';
  ring.style.opacity = '0';
  document.body.classList.remove('hide-cursor');
});

document.addEventListener('mouseenter', () => {
  dot.style.opacity  = '1';
  ring.style.opacity = '1';
  document.body.classList.add('hide-cursor');
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx}px,${ry}px)`;
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .scard').forEach((el) => {
  el.addEventListener('mouseenter', () => ring.classList.add('big'));
  el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});

/* ============================================================
   2. PARTICLES
   ============================================================ */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let pts      = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function mkPt() {
  const r = Math.random();
  return {
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    a:  Math.random(),
    da: (Math.random() - 0.5) * 0.004,
    s:  Math.random() * 1.2 + 0.3,
    c:  r > 0.65 ? [162,89,255] : r > 0.35 ? [58,142,255] : [0,234,255],
  };
}

function initPts() {
  pts = [];
  const n = Math.floor(canvas.width * canvas.height / 8000);
  for (let i = 0; i < n; i++) pts.push(mkPt());
}

function drawPts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    p.x += p.vx; p.y += p.vy;
    p.a += p.da;
    if (p.a <= 0 || p.a >= 1) p.da *= -1;
    if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
      Object.assign(pts[i], mkPt());
      continue;
    }

    for (let j = i + 1; j < pts.length; j++) {
      const q  = pts[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(58,142,255,${(1 - d/100) * 0.12})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.s, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a.toFixed(2)})`;
    ctx.fill();
  }

  requestAnimationFrame(drawPts);
}

resize(); initPts(); drawPts();
window.addEventListener('resize', () => { resize(); initPts(); });

/* ============================================================
   3. SCROLL REVEAL
   ============================================================ */

// Reveal .reveal blocks
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Reveal section-tag and h2
const headerObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      headerObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.section-tag, section h2').forEach(el => headerObs.observe(el));

// Animate skill bars when visible
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, i * 120);
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-wrap').forEach(el => skillObs.observe(el));

/* ============================================================
   4. PARALLAX — Hero
   ============================================================ */
const hero = document.querySelector('.hero');

hero.addEventListener('mousemove', (e) => {
  const r  = hero.getBoundingClientRect();
  const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
  const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);

  const arc  = hero.querySelector('.hero-arc');
  const tag  = hero.querySelector('.hero-tag');
  const desc = hero.querySelector('.hero-desc');

  if (arc)  arc.style.transform  = `translateY(-60%) translate(${dx*20}px,${dy*20}px)`;
  if (tag)  tag.style.transform  = `translate(${dx*8}px,${dy*8}px)`;
  if (desc) desc.style.transform = `translate(${dx*5}px,${dy*5}px)`;
});

hero.addEventListener('mouseleave', () => {
  hero.querySelectorAll('.hero-arc,.hero-tag,.hero-desc').forEach(el => el.style.transform = '');
});

/* ============================================================
   5. NAV — Hide on scroll down
   ============================================================ */
let lastY = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.style.transform = (y > lastY && y > 80) ? 'translateY(-100%)' : 'translateY(0)';
  lastY = y;
});

/* ============================================================
   6. SPARKS ON CLICK
   ============================================================ */
window.addEventListener('click', (e) => {
  for (let i = 0; i < 8; i++) {
    const s     = document.createElement('div');
    s.className = 'spark';
    s.style.left = e.clientX + 'px';
    s.style.top  = e.clientY + 'px';
    const angle  = (i / 8) * Math.PI * 2;
    const dist   = 28 + Math.random() * 28;
    s.style.setProperty('--tx', `${Math.cos(angle)*dist}px`);
    s.style.setProperty('--ty', `${Math.sin(angle)*dist}px`);
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
});
