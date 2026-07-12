/* ============================================================
   CALCYX — Category Tiles Component
   ============================================================ */

import { categories, getByCategory } from '../calculators/registry.js';

export function renderCategoryTiles() {
  const div = document.createElement('div');
  div.className = 'category-grid';

  categories.forEach(cat => {
    const totalCount = getByCategory(cat.id).length;
    const tile = document.createElement('a');
    tile.className = 'category-tile';
    tile.href = `/category/${cat.id}`;
    tile.innerHTML = `
      <div class="category-tile-icon">${cat.icon}</div>
      <div class="category-tile-name">${cat.name}</div>
      <div class="category-tile-count">${totalCount} tools</div>
    `;
    div.appendChild(tile);
  });

  return div;
}
