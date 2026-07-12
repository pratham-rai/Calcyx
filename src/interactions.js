/* ============================================================
   CALCYX — Premium Interaction Layer
   Mouse-following card spotlight, scroll progress bar,
   and staggered entrance animations.
   ============================================================ */

/* ---------- Scroll Progress Bar ---------- */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg, #013777, #01b9fd);
    z-index: 9999;
    pointer-events: none;
    transition: width 80ms linear;
    border-radius: 0 2px 2px 0;
    box-shadow: 0 0 8px rgba(1, 185, 253, 0.6);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(pct, 100)}%`;
  }, { passive: true });
}

/* ---------- Mouse-Tracking Card Spotlight ---------- */
function initCardSpotlight() {
  const SELECTORS = [
    '.glass-card',
    '.category-tile',
    '.calc-card-preview',
    '.calc-card',
  ];

  function onMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = ((x / rect.width) * 100).toFixed(1);
    const yPct = ((y / rect.height) * 100).toFixed(1);

    card.style.setProperty('--mouse-x', `${xPct}%`);
    card.style.setProperty('--mouse-y', `${yPct}%`);
    card.classList.add('is-mouse-over');
  }

  function onMouseLeave(e) {
    e.currentTarget.classList.remove('is-mouse-over');
  }

  function attachSpotlight(root = document) {
    const cards = root.querySelectorAll(SELECTORS.join(', '));
    cards.forEach(card => {
      if (card._spotlightBound) return;
      card._spotlightBound = true;
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  // Initial attach
  attachSpotlight();

  // Re-attach after SPA navigations inject new DOM
  const observer = new MutationObserver(() => attachSpotlight());
  observer.observe(document.getElementById('app') || document.body, {
    childList: true,
    subtree: true,
  });
}

/* ---------- Staggered Card Entrance (Intersection Observer) ---------- */
function initStaggeredEntrance() {
  const CARD_SELECTORS = [
    '.category-tile',
    '.calc-card-preview',
    '.glass-card',
  ];

  const style = document.createElement('style');
  style.textContent = `
    .stagger-card {
      opacity: 0;
      transform: translateY(24px);
      transition:
        opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .stagger-card.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Use a data-index set during attachment for cascade delay
        const delay = parseInt(entry.target.dataset.staggerIdx || 0, 10) * 55;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  function observeCards(root = document) {
    const cards = root.querySelectorAll(CARD_SELECTORS.join(', '));
    cards.forEach((card, idx) => {
      if (card._staggerObserved) return;
      card._staggerObserved = true;
      card.classList.add('stagger-card');
      card.dataset.staggerIdx = idx;
      io.observe(card);
    });
  }

  observeCards();

  // Re-observe after SPA route changes
  const observer = new MutationObserver(() => observeCards());
  observer.observe(document.getElementById('app') || document.body, {
    childList: true,
    subtree: true,
  });
}

/* ---------- Spotlight CSS ---------- */
function injectSpotlightStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .glass-card,
    .category-tile,
    .calc-card-preview,
    .calc-card {
      --mouse-x: 50%;
      --mouse-y: 50%;
    }

    .glass-card.is-mouse-over::after,
    .category-tile.is-mouse-over::after,
    .calc-card-preview.is-mouse-over::after,
    .calc-card.is-mouse-over::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(
        200px circle at var(--mouse-x) var(--mouse-y),
        rgba(1, 185, 253, 0.07),
        transparent 70%
      );
      pointer-events: none;
      border-radius: inherit;
      z-index: 0;
    }

    /* Ensure card children stay above spotlight overlay */
    .glass-card > *,
    .category-tile > *,
    .calc-card-preview > *,
    .calc-card > * {
      position: relative;
      z-index: 1;
    }
  `;
  document.head.appendChild(style);
}

/* ---------- Ripple effect on primary buttons ---------- */
function initButtonRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-primary');
    if (!btn) return;

    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.25);
      transform: scale(0);
      animation: rippleAnim 500ms ease-out forwards;
      pointer-events: none;
      z-index: 10;
    `;

    if (!document.querySelector('#ripple-keyframes')) {
      const kf = document.createElement('style');
      kf.id = 'ripple-keyframes';
      kf.textContent = `
        @keyframes rippleAnim {
          to { transform: scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(kf);
    }

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/* ---------- Bootstrap All Interactions ---------- */
export function initInteractions() {
  initScrollProgress();
  injectSpotlightStyles();
  initCardSpotlight();
  initStaggeredEntrance();
  initButtonRipple();
}
