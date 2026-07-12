/* ============================================================
   CALCYX — Shared Header Component
   ============================================================ */

import { getTheme, setTheme } from '../utils/storage.js';

// Resolve paths relative to the deploy base (/ on localhost, /Calcyx/ on GitHub Pages)
const BASE = import.meta.env.BASE_URL;

export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'header';

  const logoSrc = `${BASE}logo.png`;
  const logoFallback = `${BASE}logo.svg`;

  header.innerHTML = `
    <div class="header-inner">
      <a href="${BASE}" class="header-logo" id="logo-link">
        <img src="${logoSrc}" alt="Calcyx Logo" class="header-logo-icon"
          onerror="this.src='${logoFallback}'; this.onerror=function(){ this.style.display='none'; var fb=document.getElementById('logo-text-fallback'); if(fb) fb.style.display='inline'; };"/>
        <span id="logo-text-fallback" style="display:none">Calcyx</span>
        <span id="logo-branded-text">Calcyx</span>
      </a>

      <div class="header-nav">
        <div class="header-breadcrumb" id="header-breadcrumbs">
          <!-- Populated dynamically by router/pages -->
        </div>
      </div>
    </div>
  `;

  return header;
}

export function mountHeader() {
  // Always set document theme to light
  document.documentElement.setAttribute('data-theme', 'light');
  return () => {};
}

/**
 * Dynamically updates header breadcrumbs
 * @param {Array<{name: string, url?: string}>} crumbs
 */
export function updateBreadcrumbs(crumbs = []) {
  const container = document.getElementById('header-breadcrumbs');
  if (!container) return;

  if (crumbs.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = `<a href="${BASE}">Home</a>`;
  crumbs.forEach((crumb, idx) => {
    html += ` <span class="separator">/</span> `;
    if (crumb.url && idx < crumbs.length - 1) {
      html += `<a href="${crumb.url}">${crumb.name}</a>`;
    } else {
      html += `<span>${crumb.name}</span>`;
    }
  });

  container.innerHTML = html;
}
