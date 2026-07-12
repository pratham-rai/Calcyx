/* ============================================================
   CALCYX — Main Application Bootstrapper
   ============================================================ */

import './styles/index.css';
import './styles/components.css';
import './styles/calculator.css';

import { router } from './router.js';
import { calculators } from './calculators/registry.js';

// 1. Register SPA Routes
router.register('/', () => import('./pages/home.js'));
router.register('/category/:name', () => import('./pages/category.js'));
router.register('/calculators/:slug', () => import('./pages/calculatorPage.js'));

// Static Info Pages
router.register('/about', () => import('./pages/info.js').then(m => ({
  render: () => m.render({ page: 'about' }),
  mount: () => m.mount({ page: 'about' }),
  meta: m.meta
})));
router.register('/contact', () => import('./pages/info.js').then(m => ({
  render: () => m.render({ page: 'contact' }),
  mount: () => m.mount({ page: 'contact' }),
  meta: m.meta
})));
router.register('/privacy', () => import('./pages/info.js').then(m => ({
  render: () => m.render({ page: 'privacy' }),
  mount: () => m.mount({ page: 'privacy' }),
  meta: m.meta
})));
router.register('/terms', () => import('./pages/info.js').then(m => ({
  render: () => m.render({ page: 'terms' }),
  mount: () => m.mount({ page: 'terms' }),
  meta: m.meta
})));

// 2. Setup Hover-Prefetching for Calculator Modules
document.addEventListener('mouseover', (e) => {
  const link = e.target.closest('a[href^="/calculators/"]');
  if (!link) return;

  const path = link.getAttribute('href');
  const slug = path.split('/').pop();
  const calc = calculators.find(c => c.slug === slug);

  if (calc && calc.loader && !calc.prefetched) {
    calc.loader(); // Trigger browser fetch & compilation of module in background
    calc.prefetched = true;
    console.log(`[Prefetch] Loaded calculator module: ${slug}`);
  }
});

// 3. Boot client-side router
document.addEventListener('DOMContentLoaded', () => {
  router.handleRoute();
});

// 4. Register Progressive Web App (PWA) Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Disable service worker on localhost to prevent aggressive caching during development
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('Calcyx Service Worker registered successfully, scope:', reg.scope);
        })
        .catch(err => {
          console.error('Service Worker registration failed:', err);
        });
    } else {
      console.log('Service Worker registration bypassed on localhost');
    }
  });
}
