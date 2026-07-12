/* ============================================================
   CALCYX — Favorites & Recents Listing Component
   ============================================================ */

import { getFavorites, getRecent } from '../utils/storage.js';
import { getBySlug } from '../calculators/registry.js';
import { renderCalculatorCard } from './calculatorCard.js';

export function renderFavoritesAndRecents() {
  const container = document.createElement('div');
  container.id = 'favs-recents-container';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = 'var(--space-2xl)';

  // Build structure
  updateContainer(container);

  return container;
}

export function mountFavoritesAndRecents() {
  const container = document.getElementById('favs-recents-container');
  if (!container) return () => {};

  const handleFavChange = () => {
    updateContainer(container);
  };

  // Re-render when favorites/recents change anywhere
  document.addEventListener('calcyx-fav-change', handleFavChange);

  return () => {
    document.removeEventListener('calcyx-fav-change', handleFavChange);
  };
}

function updateContainer(container) {
  container.innerHTML = '';

  const favSlugs = getFavorites();
  const recentSlugs = getRecent();

  // 1. Render Favorites Section if it has items
  if (favSlugs.length > 0) {
    const favSection = document.createElement('section');
    favSection.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">⭐ Favorites</h2>
      </div>
      <div class="calc-cards-grid" id="favorites-grid"></div>
    `;
    const grid = favSection.querySelector('#favorites-grid');
    favSlugs.forEach(slug => {
      const calc = getBySlug(slug);
      if (calc) {
        grid.appendChild(renderCalculatorCard(calc));
      }
    });
    container.appendChild(favSection);
  }

  // 2. Render Recently Used Section if it has items
  if (recentSlugs.length > 0) {
    const recentSection = document.createElement('section');
    recentSection.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">🕒 Recently Used</h2>
      </div>
      <div class="calc-cards-grid" id="recents-grid"></div>
    `;
    const grid = recentSection.querySelector('#recents-grid');
    // Filter recents to exclude current favorites to keep lists distinct (or show both, standard is showing both)
    recentSlugs.forEach(slug => {
      const calc = getBySlug(slug);
      if (calc) {
        grid.appendChild(renderCalculatorCard(calc));
      }
    });
    container.appendChild(recentSection);
  }
}
