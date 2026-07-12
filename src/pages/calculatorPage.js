/* ============================================================
   CALCYX — Individual Calculator Page Shell (Lazy Loader)
   ============================================================ */

import { getBySlug, categories } from '../calculators/registry.js';
import { addRecent } from '../utils/storage.js';
import { renderHeader, mountHeader, updateBreadcrumbs } from '../components/header.js';
import { renderFooter } from '../components/footer.js';

export const meta = {
  title: 'Loading Calculator — Calcyx',
  description: ''
};

export function render(params) {
  const { slug } = params;
  const calc = getBySlug(slug);

  const container = document.createElement('div');
  container.className = 'page-enter';

  // 1. Add Header
  container.appendChild(renderHeader());

  // 2. Main content container
  const main = document.createElement('main');
  main.id = 'calc-page-shell-main';
  main.className = 'container page';

  if (!calc) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h1 class="empty-state-text">Calculator Not Found</h1>
        <p class="text-secondary" style="margin-top:var(--space-md)">The calculator tool you requested could not be found.</p>
        <a href="/" class="btn btn-primary" style="margin-top:var(--space-xl)">← Back to Home</a>
      </div>
    `;
    container.appendChild(main);
    container.appendChild(renderFooter());
    return container;
  }

  // Update dynamic SEO meta information
  meta.title = `${calc.name} — Calcyx`;
  meta.description = calc.description;
  meta.canonical = `https://calcyx.com/calculators/${slug}`;

  // Show a premium glass loader while importing the JS module dynamically
  const loader = document.createElement('div');
  loader.className = 'glass-card';
  loader.style.cssText = 'display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:300px; gap:var(--space-md)';
  loader.innerHTML = `
    <div style="font-size:3rem; animation: pulse 1.5s infinite">📱</div>
    <div style="font-weight:600; font-size:var(--text-lg)">Loading ${calc.name}...</div>
    <p class="text-secondary" style="font-size:var(--text-sm)">Preparing offline calculator engine</p>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 0.7; }
      }
    </style>
  `;
  main.appendChild(loader);
  container.appendChild(main);
  container.appendChild(renderFooter());

  return container;
}

export function mount(params) {
  const { slug } = params;
  const calc = getBySlug(slug);
  if (!calc) return () => {};

  const cleanHeader = mountHeader();

  // Setup dynamic breadcrumbs
  const category = categories.find(c => c.id === calc.category);
  if (category) {
    updateBreadcrumbs([
      { name: category.name, url: `/category/${category.id}` },
      { name: calc.name }
    ]);
  }

  let moduleCleanup = null;
  const main = document.getElementById('calc-page-shell-main');

  // Trigger lazy loading
  calc.loader()
    .then(module => {
      // Clear loader
      main.innerHTML = '';

      // Render the loaded calculator
      const calcContent = module.render();
      if (calcContent instanceof Node) {
        main.appendChild(calcContent);
      } else {
        main.innerHTML = calcContent;
      }

      // Add to recently used
      addRecent(slug);

      // Mount/initialize calculator logic
      if (module.mount) {
        moduleCleanup = module.mount(main);
      }
    })
    .catch(err => {
      console.error(`Failed to load calculator module (${slug}):`, err);
      main.innerHTML = `
        <div class="glass-card">
          <h2 style="color:var(--color-error); margin-bottom:var(--space-md)">Failed to load tool</h2>
          <p class="text-secondary" style="margin-bottom:var(--space-lg)">There was a problem loading this calculator. Check your connection and try again.</p>
          <button class="btn btn-primary" onclick="window.location.reload()">Retry</button>
        </div>
      `;
    });

  return () => {
    cleanHeader();
    if (moduleCleanup) {
      try { moduleCleanup(); } catch (e) { console.warn('Module cleanup failed:', e); }
    }
  };
}
