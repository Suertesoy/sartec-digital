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
  const PRIMARY_LIFE_MIN = 950;
  const PRIMARY_LIFE_MAX = 1400;
  const SECONDARY_LIFE_MIN = 550;
  const SECONDARY_LIFE_MAX = 950;
  const SAMPLE_THROTTLE = 40; // ms
  const MAX_NODES = 80;
  const BRANCH_THROTTLE = 70; // ms
  const MAX_BRANCHES = 60;
  const SCROLL_THROTTLE = 70; // ms
  const MAX_SCROLL_STEPS = 6;

  // Chain of recent grid intersections the cursor (or a scroll sweep) has
  // passed through, newest last — segments are drawn connecting consecutive
  // nodes, brighter toward the newest (cursor-ward) end. This is the
  // brighter "spine" of the trail.
  let path = [];
  // Short-lived secondary glows on grid lines 1-2 cells away from the
  // spine, giving the trail a circuit/mesh feel instead of a single line.
  let branches = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let lastSampleTime = 0;
  let lastBranchTime = 0;
  let lastScrollTime = 0;
  let lastCellX = null;
  let lastCellY = null;
  let lastMouseX = null;
  let lastMouseY = null;
  let lastScrollY = window.scrollY;
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

  function pushNode(x, y, boost, bornOverride) {
    const born = bornOverride !== undefined ? bornOverride : performance.now();
    path.push({
      x, y, t: born, boost: boost === undefined ? 1 : boost,
      life: PRIMARY_LIFE_MIN + Math.random() * (PRIMARY_LIFE_MAX - PRIMARY_LIFE_MIN),
    });
    if (path.length > MAX_NODES) path.shift();
  }

  function pushBranch(axis, fixed, p1, p2, now, peak) {
    branches.push({
      axis, fixed, p1, p2, born: now, peak,
      life: SECONDARY_LIFE_MIN + Math.random() * (SECONDARY_LIFE_MAX - SECONDARY_LIFE_MIN),
    });
    if (branches.length > MAX_BRANCHES) branches.shift();
  }

  // Lights up grid lines 1-2 cells away from (nodeX, nodeY): short parallel
  // "lane" segments, occasionally tapped to the spine with a perpendicular
  // "rung" — together they read as a small circuit branching off the path
  // rather than a single lit line.
  function spawnNetwork(nodeX, nodeY, now, boost, bypassThrottle) {
    if (!bypassThrottle) {
      if (now - lastBranchTime < BRANCH_THROTTLE) return;
      lastBranchTime = now;
    }

    [1, 2].forEach(rank => {
      const chance = rank === 1 ? 0.55 : 0.3;
      const peak = (rank === 1 ? 0.18 : 0.1) * boost;

      [-1, 1].forEach(side => {
        // Neighbor horizontal line (offset in Y) — lane runs along X.
        if (Math.random() < chance) {
          const fixedY = nodeY + side * rank * GRID;
          if (Math.random() < 0.4) {
            pushBranch('v', nodeX, nodeY, fixedY, now, peak * 0.8);
          } else {
            const len = 22 + Math.random() * 26;
            const center = nodeX + (Math.random() - 0.5) * 18;
            pushBranch('h', fixedY, center - len / 2, center + len / 2, now, peak);
          }
        }
        // Neighbor vertical line (offset in X) — lane runs along Y.
        if (Math.random() < chance) {
          const fixedX = nodeX + side * rank * GRID;
          if (Math.random() < 0.4) {
            pushBranch('h', nodeY, nodeX, fixedX, now, peak * 0.8);
          } else {
            const len = 22 + Math.random() * 26;
            const center = nodeY + (Math.random() - 0.5) * 18;
            pushBranch('v', fixedX, center - len / 2, center + len / 2, now, peak);
          }
        }
      });
    });
  }

  function advanceChain(fromX, fromY, toX, toY, now) {
    // Fill in intermediate grid steps so jumps still read as a continuous
    // chain rather than disconnected pieces.
    let stepX = fromX;
    let stepY = fromY;
    const dirX = Math.sign(toX - fromX);
    const dirY = Math.sign(toY - fromY);
    let guard = 0;
    while ((stepX !== toX || stepY !== toY) && guard < MAX_NODES) {
      if (stepX !== toX) stepX += dirX * GRID;
      else if (stepY !== toY) stepY += dirY * GRID;
      pushNode(stepX, stepY, 1);
      guard++;
    }
    spawnNetwork(toX, toY, now, 1, false);
  }

  function handlePointerMove(event) {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    const now = performance.now();
    if (now - lastSampleTime < SAMPLE_THROTTLE) return;

    const cellX = Math.round(event.clientX / GRID) * GRID;
    const cellY = Math.round(event.clientY / GRID) * GRID;
    if (cellX === lastCellX && cellY === lastCellY) return;

    lastSampleTime = now;

    if (lastCellX !== null) {
      advanceChain(lastCellX, lastCellY, cellX, cellY, now);
    } else {
      pushNode(cellX, cellY, 1);
    }

    lastCellX = cellX;
    lastCellY = cellY;
    startLoop();
  }

  function handleScroll() {
    const now = performance.now();
    const currentScrollY = window.scrollY;

    if (now - lastScrollTime < SCROLL_THROTTLE) return;
    if (lastMouseX === null) {
      lastScrollY = currentScrollY;
      return;
    }

    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    if (Math.abs(deltaY) < 2) return;

    lastScrollTime = now;

    // Scrolling down moves page content up under the cursor, so the trail
    // should read as energy arriving from below (and vice versa).
    const dirSign = Math.sign(deltaY);
    const trailDir = -dirSign;
    const cellX = Math.round(lastMouseX / GRID) * GRID;
    const cellY = Math.round(lastMouseY / GRID) * GRID;
    const boost = 0.82;

    // Faster scroll covers more grid cells per processed tick, so the
    // trail naturally reads longer for a faster sweep.
    const steps = Math.min(MAX_SCROLL_STEPS, Math.max(1, Math.round(Math.abs(deltaY) / GRID)));

    // Build the chain from the far end down to the cursor cell (which is
    // pushed last/freshest) so it fades in brighter toward the cursor,
    // same as the mouse-driven trail. A slight stagger on the older end
    // makes the sweep read as energy already in motion, not a flicker.
    for (let i = steps; i >= 0; i--) {
      const y = cellY + trailDir * i * GRID;
      pushNode(cellX, y, boost, now - i * 14);
      if (i % 2 === 0) spawnNetwork(cellX, y, now, boost * 0.85, true);
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
    branches = branches.filter(b => now - b.born < b.life);

    ctx.save();
    ctx.lineWidth = 1.3;
    ctx.shadowColor = 'rgba(160,185,255,0.5)';
    ctx.shadowBlur = 4;

    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];

      // Only connect nodes that are genuinely adjacent on the grid (one
      // step apart on a single axis) — anything else is a seam between
      // unrelated chain segments (e.g. mouse path vs. a scroll-injected
      // sweep) and must stay disconnected.
      const sameAxis = a.x === b.x || a.y === b.y;
      const stepDist = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
      if (!sameAxis || stepDist !== GRID) continue;

      const ageA = now - a.t;
      const ageB = now - b.t;
      if (ageA > a.life && ageB > b.life) continue;

      const boost = (a.boost + b.boost) / 2;
      const fadeA = Math.max(0, 1 - ageA / a.life) * 0.16 * boost;
      const fadeB = Math.max(0, 1 - ageB / b.life) * 0.4 * boost;
      if (fadeA <= 0.01 && fadeB <= 0.01) continue;

      drawSegment(a.x, a.y, b.x, b.y, fadeA, fadeB);
    }

    for (const br of branches) {
      const age = now - br.born;
      const t = age / br.life;
      const alpha = Math.sin(Math.PI * t) * br.peak;
      if (alpha <= 0.01) continue;

      if (br.axis === 'h') {
        drawSegment(br.p1, br.fixed, br.p2, br.fixed, alpha * 0.7, alpha);
      } else {
        drawSegment(br.fixed, br.p1, br.fixed, br.p2, alpha * 0.7, alpha);
      }
    }

    ctx.restore();

    if (path.length > 1 || branches.length > 0) {
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
    lastMouseX = null;
    lastMouseY = null;
  });
  window.addEventListener('scroll', handleScroll, { passive: true });
})();

// ── Hero Mockup Animation Loop ──────────────────────────────────
(() => {
  const perspective = document.getElementById('js-mockup-perspective');
  if (!perspective) return;

  const countEntrada = document.getElementById('js-count-entrada');
  const countTriagem = document.getElementById('js-count-triagem');
  const countFila = document.getElementById('js-count-fila');

  const cardEntradaB = document.getElementById('js-card-entrada-b');
  const cardTriagemB = document.getElementById('js-card-triagem-b');
  const cardTriagemDelta = document.getElementById('js-card-triagem-delta');
  const cardFilaDelta = document.getElementById('js-card-fila-delta');

  const chartPercent = document.getElementById('js-chart-percent');
  const chartBars = document.querySelectorAll('#js-chart-bars .mockup__chart-bar');

  const metricToday = document.getElementById('js-metric-today');
  const metricResp = document.getElementById('js-metric-resp');
  const metricWait = document.getElementById('js-metric-wait');
  const metricDone = document.getElementById('js-metric-done');

  const phoneLogin = document.getElementById('js-phone-login');
  const phoneHome = document.getElementById('js-phone-home');
  const phoneLesson = document.getElementById('js-phone-lesson');

  const loginBtn = document.getElementById('js-btn-login');
  const featuredCard = document.getElementById('js-card-featured');
  const playTrigger = document.getElementById('js-play-trigger');
  const videoProgress = document.getElementById('js-video-progress');

  let activeTimeouts = [];
  let isRunning = false;
  let cycleTimer = null;

  function addTimeout(fn, ms) {
    const t = setTimeout(fn, ms);
    activeTimeouts.push(t);
    return t;
  }

  function clearTimeouts() {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];
  }

  function setChartBars(heights) {
    chartBars.forEach((bar, index) => {
      if (heights[index] !== undefined) {
        bar.style.setProperty('--h', `${heights[index]}%`);
      }
    });
  }

  function typeText(elementId, text, delay, callback) {
    const el = document.querySelector(`#${elementId} .phone-app__typing-text`);
    const container = document.getElementById(elementId);
    if (!el || !container) return;
    
    container.classList.add('is-focused');
    container.classList.add('has-value');
    let i = 0;
    
    function step() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        addTimeout(step, delay);
      } else {
        container.classList.remove('is-focused');
        if (callback) callback();
      }
    }
    step();
  }

  function resetAll() {
    // Reset Dashboard to initial values
    if (metricToday) metricToday.textContent = '38';
    if (metricResp) metricResp.textContent = '2.5m';
    if (metricWait) metricWait.textContent = '6';
    if (metricDone) metricDone.textContent = '98%';
    if (chartPercent) chartPercent.textContent = '94%';
    setChartBars([40, 65, 50, 90, 75, 60, 45, 80]);

    if (countEntrada) countEntrada.textContent = '2';
    if (countTriagem) countTriagem.textContent = '1';
    if (countFila) countFila.textContent = '2';

    if (cardEntradaB) cardEntradaB.classList.remove('is-collapsed');
    if (cardTriagemB) cardTriagemB.classList.add('is-collapsed');
    if (cardTriagemDelta) cardTriagemDelta.classList.remove('is-collapsed');
    if (cardFilaDelta) cardFilaDelta.classList.add('is-collapsed');

    // Reset Mobile Phone mockup
    if (perspective) perspective.classList.remove('is-mobile-state');

    if (phoneLogin) phoneLogin.classList.add('is-active');
    if (phoneHome) phoneHome.classList.remove('is-active');
    if (phoneLesson) phoneLesson.classList.remove('is-active');

    const emailField = document.getElementById('js-login-field-email');
    const passField = document.getElementById('js-login-field-pass');
    
    if (emailField) {
      emailField.classList.remove('is-focused', 'has-value');
      const textEl = emailField.querySelector('.phone-app__typing-text');
      if (textEl) textEl.textContent = '';
    }
    if (passField) {
      passField.classList.remove('is-focused', 'has-value');
      const textEl = passField.querySelector('.phone-app__typing-text');
      if (textEl) textEl.textContent = '';
    }

    if (loginBtn) loginBtn.classList.remove('is-active');
    if (featuredCard) featuredCard.classList.remove('is-active');
    
    if (playTrigger) {
      playTrigger.classList.remove('is-active');
      const playSvg = playTrigger.querySelector('.phone-app__play-svg');
      const pauseSvg = playTrigger.querySelector('.phone-app__pause-svg');
      if (playSvg) playSvg.style.display = 'block';
      if (pauseSvg) pauseSvg.style.display = 'none';
    }
    if (videoProgress) {
      videoProgress.style.transition = 'none';
      videoProgress.style.width = '0%';
    }
  }

  function runCycle() {
    clearTimeouts();
    resetAll();

    // ── STAGE 1: Dashboard animation starts (0.0s to 5.5s)
    
    // At 1.5s: Dashboard Update 1 (Empresa B moves)
    addTimeout(() => {
      if (metricToday) metricToday.textContent = '41';
      if (metricResp) metricResp.textContent = '2.1m';
      if (metricWait) metricWait.textContent = '4';
      if (metricDone) metricDone.textContent = '96%';
      if (chartPercent) chartPercent.textContent = '97%';
      setChartBars([50, 75, 40, 95, 65, 50, 60, 85]);

      if (cardEntradaB) cardEntradaB.classList.add('is-collapsed');
      if (cardTriagemB) cardTriagemB.classList.remove('is-collapsed');
      if (countEntrada) countEntrada.textContent = '1';
      if (countTriagem) countTriagem.textContent = '2';
    }, 1500);

    // At 3.5s: Dashboard Update 2 (Loja Delta moves)
    addTimeout(() => {
      if (metricToday) metricToday.textContent = '36';
      if (metricResp) metricResp.textContent = '2.8m';
      if (metricWait) metricWait.textContent = '7';
      if (metricDone) metricDone.textContent = '99%';
      if (chartPercent) chartPercent.textContent = '92%';
      setChartBars([35, 60, 55, 85, 80, 55, 40, 75]);

      if (cardTriagemDelta) cardTriagemDelta.classList.add('is-collapsed');
      if (cardFilaDelta) cardFilaDelta.classList.remove('is-collapsed');
      if (countTriagem) countTriagem.textContent = '1';
      if (countFila) countFila.textContent = '3';
    }, 3500);

    // ── STAGE 2: Flip and Morph to Mobile Phone (5.5s)
    addTimeout(() => {
      if (perspective) perspective.classList.add('is-mobile-state');
    }, 5500);

    // ── STAGE 3: Mobile App Simulation (6.7s onwards)
    
    // At 7.0s: Type Email
    addTimeout(() => {
      typeText('js-login-field-email', 'aluno@sartec.com', 50, () => {
        // At 7.9s: Type Password
        addTimeout(() => {
          typeText('js-login-field-pass', '••••••', 60, () => {
            // At 8.6s: Highlight login button
            addTimeout(() => {
              if (loginBtn) loginBtn.classList.add('is-active');
              
              // At 9.0s: Go to Home screen
              addTimeout(() => {
                if (phoneLogin) phoneLogin.classList.remove('is-active');
                if (phoneHome) phoneHome.classList.add('is-active');
                
                // At 9.5s: Highlight featured card (starts progress fill)
                addTimeout(() => {
                  if (featuredCard) featuredCard.classList.add('is-active');
                  
                  // At 11.5s: Go to Lesson screen
                  addTimeout(() => {
                    if (phoneHome) phoneHome.classList.remove('is-active');
                    if (phoneLesson) phoneLesson.classList.add('is-active');
                    
                    // At 12.2s: Simulate play video click
                    addTimeout(() => {
                      if (playTrigger) {
                        playTrigger.classList.add('is-active');
                        const playSvg = playTrigger.querySelector('.phone-app__play-svg');
                        const pauseSvg = playTrigger.querySelector('.phone-app__pause-svg');
                        if (playSvg) playSvg.style.display = 'none';
                        if (pauseSvg) pauseSvg.style.display = 'block';
                      }
                      if (videoProgress) {
                        videoProgress.style.transition = 'width 2s linear';
                        videoProgress.style.width = '40%';
                      }
                      
                      // At 14.5s: Start flip back to Dashboard
                      addTimeout(() => {
                        if (phoneLesson) phoneLesson.classList.remove('is-active');
                        if (perspective) perspective.classList.remove('is-mobile-state');
                        
                        // Reset dashboard values in background while it flips back so it's ready cleanly
                        addTimeout(() => {
                          resetAll();
                        }, 600); // half-way through the 1.2s flip transition
                      }, 2300); // 12.2s + 2.3s = 14.5s
                      
                    }, 700); // 11.5s + 0.7s = 12.2s
                    
                  }, 2000); // 9.5s + 2.0s = 11.5s
                  
                }, 500); // 9.0s + 0.5s = 9.5s
                
              }, 400); // 8.6s + 0.4s = 9.0s
              
            }, 700); // 7.9s + 0.7s = 8.6s
          });
        }, 100);
      });
    }, 7000);

    // At 16.5s: Restart loop
    cycleTimer = addTimeout(runCycle, 16500);
  }

  function startAppLoop() {
    isRunning = true;
    runCycle();
  }

  function stopAppLoop() {
    isRunning = false;
    clearTimeouts();
    if (cycleTimer) {
      clearTimeout(cycleTimer);
      cycleTimer = null;
    }
    resetAll();
  }

  const mediaQueryDesktop = window.matchMedia('(min-width: 1025px)');
  const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function checkAndControlLoop() {
    const shouldRun = mediaQueryDesktop.matches && !mediaQueryReducedMotion.matches;
    if (shouldRun) {
      if (!isRunning) {
        startAppLoop();
      }
    } else {
      if (isRunning) {
        stopAppLoop();
      }
    }
  }

  checkAndControlLoop();
  mediaQueryDesktop.addEventListener('change', checkAndControlLoop);
  mediaQueryReducedMotion.addEventListener('change', checkAndControlLoop);
})();
