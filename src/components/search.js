/* ============================================================
   CALCYX — Search Component
   ============================================================ */

import { search as searchRegistry } from '../calculators/registry.js';
import { router } from '../router.js';

export function renderSearch() {
  const div = document.createElement('div');
  div.className = 'search-bar';
  div.innerHTML = `
    <span class="search-icon">🔍</span>
    <input type="text" id="calc-search-input" placeholder="Search 25+ calculators (e.g. EMI, BMI, Age)..." autocomplete="off" aria-label="Search calculators" />
    <div class="search-results" id="calc-search-results"></div>
  `;
  return div;
}

export function mountSearch() {
  const input = document.getElementById('calc-search-input');
  const resultsDiv = document.getElementById('calc-search-results');
  if (!input || !resultsDiv) return () => {};

  let highlightedIndex = -1;
  let currentResults = [];

  const updateResults = () => {
    const query = input.value;
    currentResults = searchRegistry(query);
    highlightedIndex = -1;

    if (currentResults.length === 0) {
      resultsDiv.innerHTML = '';
      resultsDiv.classList.remove('visible');
      return;
    }

    resultsDiv.innerHTML = currentResults.map((item, idx) => `
      <a href="/calculators/${item.slug}" class="search-result-item" data-index="${idx}">
        <span class="search-result-icon">${item.icon}</span>
        <div class="search-result-info">
          <div class="search-result-name">${item.name}</div>
          <div class="search-result-category">${item.category}</div>
        </div>
      </a>
    `).join('');

    resultsDiv.classList.add('visible');
  };

  const handleKeyDown = (e) => {
    if (!resultsDiv.classList.contains('visible')) return;

    const items = resultsDiv.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % items.length;
      updateHighlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = (highlightedIndex - 1 + items.length) % items.length;
      updateHighlight(items);
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < currentResults.length) {
        e.preventDefault();
        const selected = currentResults[highlightedIndex];
        router.navigate(`/calculators/${selected.slug}`);
        closeSearch();
      }
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  };

  const updateHighlight = (items) => {
    items.forEach((item, idx) => {
      if (idx === highlightedIndex) {
        item.classList.add('highlighted');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('highlighted');
      }
    });
  };

  const closeSearch = () => {
    resultsDiv.classList.remove('visible');
    resultsDiv.innerHTML = '';
    input.value = '';
    highlightedIndex = -1;
  };

  // Input typing handler
  input.addEventListener('input', updateResults);
  // Keyboard navigation handler
  input.addEventListener('keydown', handleKeyDown);

  // Close dropdown on clicking outside
  const clickOutsideHandler = (e) => {
    if (!input.contains(e.target) && !resultsDiv.contains(e.target)) {
      resultsDiv.classList.remove('visible');
    }
  };
  document.addEventListener('click', clickOutsideHandler);

  return () => {
    input.removeEventListener('input', updateResults);
    input.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('click', clickOutsideHandler);
  };
}
