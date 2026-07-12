/* ============================================================
   CALCYX — Category Listing Page
   ============================================================ */

import { categories, getByCategory } from '../calculators/registry.js';
import { renderCalculatorCard } from '../components/calculatorCard.js';
import { renderHeader, mountHeader, updateBreadcrumbs } from '../components/header.js';
import { renderFooter } from '../components/footer.js';

export const meta = {
  title: 'Calculators By Category — Calcyx',
  description: 'Browse our extensive list of calculators sorted by specialized categories.'
};

export function render(params) {
  const categoryId = params.name;
  const category = categories.find(c => c.id === categoryId);

  const container = document.createElement('div');
  container.className = 'category-page page-enter';

  // 1. Add Header
  container.appendChild(renderHeader());

  // 2. Main content
  const main = document.createElement('main');
  main.className = 'container page';

  if (!category) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📂</div>
        <h1 class="empty-state-text">Category Not Found</h1>
        <p class="text-secondary" style="margin-top:var(--space-md)">The category you requested doesn't exist.</p>
        <a href="/" class="btn btn-primary" style="margin-top:var(--space-xl)">← Back to Home</a>
      </div>
    `;
    container.appendChild(main);
    container.appendChild(renderFooter());
    return container;
  }

  // Set meta title dynamically
  meta.title = `${category.name} Calculators — Calcyx`;
  meta.description = `${category.description}. Find the perfect calculator tool now.`;
  meta.canonical = `https://calcyx.com/category/${categoryId}`;

  // Render header info
  const pageHeader = document.createElement('div');
  pageHeader.style.marginBottom = 'var(--space-2xl)';
  pageHeader.innerHTML = `
    <div style="display:flex; align-items:center; gap:var(--space-md); margin-bottom:var(--space-xs)">
      <span style="font-size:3rem">${category.icon}</span>
      <div>
        <h1 style="font-size:var(--text-3xl); font-weight:800">${category.name}</h1>
        <p class="text-secondary">${category.description}</p>
      </div>
    </div>
  `;
  main.appendChild(pageHeader);

  // Cards Grid
  const grid = document.createElement('div');
  grid.className = 'calc-cards-grid';

  const calcs = getByCategory(categoryId);
  if (calcs.length === 0) {
    grid.innerHTML = `<p class="text-secondary">No calculators are currently available in this category.</p>`;
  } else {
    calcs.forEach(calc => {
      grid.appendChild(renderCalculatorCard(calc));
    });
  }
  main.appendChild(grid);

  // Back Button
  const backDiv = document.createElement('div');
  backDiv.style.marginTop = 'var(--space-3xl)';
  backDiv.innerHTML = `
    <a href="/" class="btn btn-secondary">← Back to Home</a>
  `;
  main.appendChild(backDiv);

  container.appendChild(main);
  container.appendChild(renderFooter());
  return container;
}

export function mount(params) {
  const cleanHeader = mountHeader();
  const categoryId = params.name;
  const category = categories.find(c => c.id === categoryId);

  if (category) {
    updateBreadcrumbs([{ name: category.name }]);
  }

  return () => {
    cleanHeader();
  };
}
