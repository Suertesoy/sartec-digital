// ── Header scroll ─────────────────────────────────────────────
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile burger menu ────────────────────────────────────────
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('click', e => {
  if (nav.classList.contains('is-open') && !nav.contains(e.target) && e.target !== burger) {
    closeMenu();
  }
});

function closeMenu() {
  nav.classList.remove('is-open');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// ── Smooth scroll ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
  });
});

// ── FAQ accordion ─────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const btn   = item.querySelector('.faq-q');
  const panel = item.querySelector('.faq-a');
  const inner = item.querySelector('.faq-a__inner');

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    document.querySelectorAll('.faq-item.is-open').forEach(other => {
      if (other !== item) {
        other.classList.remove('is-open');
        other.querySelector('.faq-a').style.height = '0';
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      }
    });

    if (isOpen) {
      item.classList.remove('is-open');
      panel.style.height = '0';
      btn.setAttribute('aria-expanded', 'false');
    } else {
      item.classList.add('is-open');
      panel.style.height = inner.offsetHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── Fade-in on scroll ─────────────────────────────────────────
const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.08, rootMargin: '0px 0px -28px 0px' }
);

['.ba-row', '.eco-card', '.origin-card', '.pricing-card', '.pilot-step'].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });
});

// ── Pricing card selection ────────────────────────────────────
const planCards = document.querySelectorAll('[data-plan-card]');
planCards.forEach(card => {
  const selectCard = () => {
    planCards.forEach(c => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
  };

  card.addEventListener('click', () => {
    selectCard();
  });

  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
      }
      selectCard();
    }
  });
});

// ── Package details — global sync toggle ────────────────
const pricingGrid = document.querySelector('.pricing__grid');
if (pricingGrid) {
  const pkgToggles = document.querySelectorAll('.pkg-details__toggle');
  const pkgBodies  = document.querySelectorAll('.pkg-details__body');
  const pkgIcons   = document.querySelectorAll('.pkg-details__icon');

  pkgToggles.forEach(toggle => {
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      const open = pricingGrid.classList.toggle('is-details-open');
      pkgToggles.forEach(t => t.setAttribute('aria-expanded', String(open)));
      pkgIcons.forEach(icon => { icon.textContent = open ? '×' : '+'; });
      pkgBodies.forEach(b => {
        if (open) b.removeAttribute('hidden');
        else b.setAttribute('hidden', '');
      });
    });
  });
}

// ── Global grid energy trail effect ─────────────────────────────
(() => {
  const canvas = document.querySelector('.grid-trails');
  if (!canvas) return;

  const canUsePointerEffect = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canUsePointerEffect || reduceMotion) return;

  const ctx = canvas.getContext('2d');
  const GRID = 72;
  const LIFE_MIN = 900;
  const LIFE_MAX = 1800;
  const SAMPLE_THROTTLE = 40; // ms
  const MAX_NODES = 50;

  // Chain of recent grid intersections the cursor has passed through,
  // newest last — segments are drawn connecting consecutive nodes,
  // brighter toward the newest (cursor-ward) end.
  let path = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let lastSampleTime = 0;
  let lastCellX = null;
  let lastCellY = null;
  let rafId = null;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function pushNode(x, y) {
    path.push({ x, y, t: performance.now(), life: LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN) });
    if (path.length > MAX_NODES) path.shift();
  }

  function handlePointerMove(event) {
    const now = performance.now();
    if (now - lastSampleTime < SAMPLE_THROTTLE) return;

    const cellX = Math.round(event.clientX / GRID) * GRID;
    const cellY = Math.round(event.clientY / GRID) * GRID;
    if (cellX === lastCellX && cellY === lastCellY) return;

    lastSampleTime = now;

    // Fill in intermediate grid steps so fast movements still read as a
    // continuous chain rather than disconnected jumps.
    if (lastCellX !== null) {
      let stepX = lastCellX;
      let stepY = lastCellY;
      const dirX = Math.sign(cellX - lastCellX);
      const dirY = Math.sign(cellY - lastCellY);
      let guard = 0;
      while ((stepX !== cellX || stepY !== cellY) && guard < MAX_NODES) {
        if (stepX !== cellX) stepX += dirX * GRID;
        else if (stepY !== cellY) stepY += dirY * GRID;
        pushNode(stepX, stepY);
        guard++;
      }
    } else {
      pushNode(cellX, cellY);
    }

    lastCellX = cellX;
    lastCellY = cellY;
    startLoop();
  }

  function drawSegment(x1, y1, x2, y2, alphaFrom, alphaTo) {
    if (x1 === x2 && y1 === y2) return;
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, `rgba(196,214,255,${alphaFrom})`);
    gradient.addColorStop(1, `rgba(225,236,255,${alphaTo})`);
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const now = performance.now();

    path = path.filter(node => now - node.t < node.life);

    ctx.save();
    ctx.lineWidth = 1.3;
    ctx.shadowColor = 'rgba(160,185,255,0.5)';
    ctx.shadowBlur = 4;

    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];

      const ageA = now - a.t;
      const ageB = now - b.t;
      if (ageA > a.life && ageB > b.life) continue;

      const fadeA = Math.max(0, 1 - ageA / a.life) * 0.16;
      const fadeB = Math.max(0, 1 - ageB / b.life) * 0.4;
      if (fadeA <= 0.01 && fadeB <= 0.01) continue;

      if (a.x === b.x || a.y === b.y) {
        drawSegment(a.x, a.y, b.x, b.y, fadeA, fadeB);
      } else {
        // Diagonal jump between sampled nodes — connect with an L bend
        // along the grid so the energy still only travels axis-aligned.
        const cornerX = b.x;
        const cornerY = a.y;
        const fadeMid = (fadeA + fadeB) / 2;
        drawSegment(a.x, a.y, cornerX, cornerY, fadeA, fadeMid);
        drawSegment(cornerX, cornerY, b.x, b.y, fadeMid, fadeB);
      }
    }

    ctx.restore();

    if (path.length > 1) {
      rafId = requestAnimationFrame(draw);
    } else {
      rafId = null;
    }
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(draw);
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerleave', () => {
    lastCellX = null;
    lastCellY = null;
  });
})();
