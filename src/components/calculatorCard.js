/* ============================================================
   CALCYX — Calculator Card Component
   ============================================================ */

import { isFavorite, toggleFavorite } from '../utils/storage.js';

/**
 * Renders a calculator preview card with working favorite toggle
 * @param {object} calc - Calculator metadata
 * @returns {HTMLElement} The card node
 */
export function renderCalculatorCard(calc) {
  const card = document.createElement('div');
  card.className = 'calc-card-preview-wrapper';
  card.style.position = 'relative';

  const link = document.createElement('a');
  link.className = 'calc-card-preview';
  link.href = `/calculators/${calc.slug}`;
  link.innerHTML = `
    <div class="calc-card-icon">${calc.icon}</div>
    <div class="calc-card-info">
      <div class="calc-card-name">${calc.name}</div>
      <div class="calc-card-desc">${calc.description}</div>
    </div>
  `;
  card.appendChild(link);

  // Favorite button
  const favBtn = document.createElement('button');
  const activeClass = isFavorite(calc.slug) ? 'active' : '';
  favBtn.className = `calc-card-fav ${activeClass}`;
  favBtn.setAttribute('aria-label', 'Add to favorites');
  favBtn.innerHTML = isFavorite(calc.slug) ? '★' : '☆';
  card.appendChild(favBtn);

  // Event listener for favorite toggle
  favBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isFavNow = toggleFavorite(calc.slug);
    favBtn.innerHTML = isFavNow ? '★' : '☆';
    favBtn.classList.toggle('active', isFavNow);

    // Optional: Dispatch global custom event so other components (e.g. favorites list on homepage) can update
    document.dispatchEvent(new CustomEvent('calcyx-fav-change', { detail: { slug: calc.slug, isFav: isFavNow } }));
  });

  return card;
}
