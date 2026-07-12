/* ============================================================
   CALCYX — Base Calculator Utilities & Shared UI Templates
   ============================================================ */

import { shareResults } from '../utils/share.js';

/**
 * Creates standard container for all calculator pages
 * @param {object} meta - The meta object of the calculator
 * @param {string|HTMLElement} bodyContent - Input inputs/controls content
 * @param {string|HTMLElement} resultContent - Output/results display area
 * @param {string|HTMLElement} [formulaContent] - Optional formula details
 * @returns {HTMLElement} The full page container node
 */
export function createCalculatorShell(meta, bodyContent, resultContent, formulaContent = '') {
  const container = document.createElement('div');
  container.className = 'page calc-page page-enter';

  const innerContainer = document.createElement('div');
  innerContainer.className = 'container';

  // Card wrapper
  const card = document.createElement('div');
  card.className = 'calc-card';

  // Header
  const header = document.createElement('div');
  header.className = 'calc-header';
  header.innerHTML = `
    <span class="calc-icon">${meta.icon}</span>
    <h1 class="calc-title">${meta.name}</h1>
    <p class="calc-description">${meta.description}</p>
  `;
  card.appendChild(header);

  // Body Content (Inputs)
  const body = document.createElement('div');
  body.className = 'calc-body';
  if (typeof bodyContent === 'string') {
    body.innerHTML = bodyContent;
  } else {
    body.appendChild(bodyContent);
  }
  card.appendChild(body);

  // Results display
  const result = document.createElement('div');
  result.className = 'calc-result';
  result.id = 'result';
  if (typeof resultContent === 'string') {
    result.innerHTML = resultContent;
  } else {
    result.appendChild(resultContent);
  }
  card.appendChild(result);

  // Share Actions
  const actions = document.createElement('div');
  actions.className = 'calc-actions';
  const shareBtn = document.createElement('button');
  shareBtn.className = 'btn btn-secondary btn-sm';
  shareBtn.innerHTML = '🔗 Copy & Share Results';
  shareBtn.id = 'calcyx-share-btn';
  actions.appendChild(shareBtn);
  card.appendChild(actions);

  // Formula details
  if (formulaContent) {
    const formulaDiv = document.createElement('div');
    formulaDiv.className = 'calc-formula';
    if (typeof formulaContent === 'string') {
      formulaDiv.innerHTML = formulaContent;
    } else {
      formulaDiv.appendChild(formulaContent);
    }
    card.appendChild(formulaDiv);
  }

  // Related Calculators placeholder
  if (meta.relatedSlugs && meta.relatedSlugs.length > 0) {
    const relatedSection = document.createElement('div');
    relatedSection.className = 'calc-related';
    relatedSection.innerHTML = `
      <h3>Related Calculators</h3>
      <div class="calc-related-grid" id="related-calcs-container"></div>
    `;
    card.appendChild(relatedSection);
  }

  innerContainer.appendChild(card);
  container.appendChild(innerContainer);

  return container;
}

/**
 * Attaches the standard share handler and related calculators grid
 * @param {object} meta - The meta object of the calculator
 * @param {function} getShareTextFn - Function returning string to share
 */
export function mountCalculatorShell(meta, getShareTextFn) {
  // Share button
  const shareBtn = document.getElementById('calcyx-share-btn');
  const shareHandler = async () => {
    const text = getShareTextFn();
    await shareResults(meta.name, text);
  };
  if (shareBtn) {
    shareBtn.addEventListener('click', shareHandler);
  }

  // Populate related calculators
  const relatedContainer = document.getElementById('related-calcs-container');
  if (relatedContainer && meta.relatedSlugs) {
    import('./registry.js').then(({ getBySlug }) => {
      meta.relatedSlugs.forEach(slug => {
        const item = getBySlug(slug);
        if (item) {
          const link = document.createElement('a');
          link.className = 'calc-related-link';
          link.href = `/calculators/${item.slug}`;
          link.innerHTML = `
            <span class="calc-related-link-icon">${item.icon}</span>
            <span>${item.name}</span>
          `;
          relatedContainer.appendChild(link);
        }
      });
    });
  }

  return () => {
    if (shareBtn) {
      shareBtn.removeEventListener('click', shareHandler);
    }
  };
}

/**
 * Safely parse float from an input value or default to zero
 * @param {string|number} val
 * @param {number} [def=0]
 * @returns {number}
 */
export function safeFloat(val, def = 0) {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? def : parsed;
}
