/* ============================================================
   CALCYX — Informational Static Pages (About, Contact, Legal)
   ============================================================ */

import { renderHeader, mountHeader, updateBreadcrumbs } from '../components/header.js';
import { renderFooter } from '../components/footer.js';

export const meta = {
  title: 'Information — Calcyx',
  description: 'Learn more about Calcyx calculators, privacy policies, terms of service and how to contact us.'
};

const pagesContent = {
  about: {
    title: 'About Us',
    icon: 'ℹ️',
    description: 'Learn about the mission behind Calcyx, our design guidelines, and why we build browser-based tools.',
    content: `
      <h2>The Mission of Calcyx</h2>
      <p>Calcyx was designed to solve a common problem with online calculators: bloating, intrusive advertisements, forced registration walls, and slow load times. We believe utility tools should be instant, reliable, beautiful, and execute calculations without stealing your attention or tracking your inputs.</p>
      
      <h2>Why Client-Side?</h2>
      <p>Every single calculator on Calcyx is coded completely in client-side JavaScript. This means that when you enter values, the math happens directly on your device CPU. There are no backend database servers or external APIs involved in processing your numbers. This delivers near-instant calculation performance and guarantees ultimate privacy.</p>
      
      <h2>Core Design Rules</h2>
      <ul>
        <li><strong>No Account Required</strong>: Access all tools instantly with zero barriers.</li>
        <li><strong>100% Offline-Capable</strong>: Using PWA Service Workers, the site operates without network coverage once cached.</li>
        <li><strong>Premium Experience</strong>: Simple layouts, readable mathematical formulas, and responsive glassmorphism styles.</li>
      </ul>
    `
  },
  contact: {
    title: 'Contact Us',
    icon: '✉️',
    description: 'Have a feature request, bug report, or partnership suggestion? Reach out to the Calcyx support team.',
    content: `
      <h2>Get In Touch</h2>
      <p>We are constantly building new calculators to expand our registry to 100+ tools. If you need a custom calculator for your math homework, business operation, or health tracking, send us a request!</p>
      
      <div class="glass-card" style="margin: var(--space-xl) 0; border-color: var(--color-accent)">
        <h3 style="margin-bottom:var(--space-md)">Email Support</h3>
        <p style="margin-bottom:var(--space-sm)">Email us directly at:</p>
        <div class="text-mono" style="font-size:var(--text-lg); font-weight:700; color:var(--color-accent)">support@calcyx.com</div>
        <p style="margin-top:var(--space-sm); font-size:var(--text-xs); color:var(--color-text-secondary)">We typically respond to requests and inquiries within 24 to 48 hours.</p>
      </div>

      <h2>Submit Feedback</h2>
      <p>If you encounter calculation inaccuracies or rounding bugs in any of our 25+ calculators, please describe the inputs, outputs, and expected values in your email so we can patch the JS engines immediately.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy',
    icon: '🔒',
    description: 'Read how we handle your calculations. Your data is private, secure, and stays on your device.',
    content: `
      <h2>Ultimate Data Privacy</h2>
      <p>At Calcyx, we take user privacy extremely seriously. Because all calculations are performed locally in your browser, <strong>none of the inputs, values, results, or form parameters are ever sent to a server</strong>. We do not track, collect, store, or transmit any numbers you enter.</p>
      
      <h2>LocalStorage Utilization</h2>
      <p>We use your browser's local storage (<code>localStorage</code>) strictly to save your preferences for your convenience. This includes:
        <ul>
          <li><strong>Favorites</strong>: Slugs of calculators you pin for easy access.</li>
          <li><strong>Recently Used</strong>: Slugs of the last 10 calculators visited.</li>
          <li><strong>Theme State</strong>: Keeping your preferred light-mode configuration active.</li>
        </ul>
        This data resides entirely on your local browser profile. You can erase it at any time by clearing your browser cache.
      </p>

      <h2>Analytics & Cookies</h2>
      <p>We do not run tracking cookies or sell your activity profile. The service is hosted statically and caches files only via standard Service Worker precaching assets to operate offline.</p>
    `
  },
  terms: {
    title: 'Terms of Service',
    icon: '📋',
    description: 'Review our terms of use, calculator accuracy disclaimers, and service guidelines.',
    content: `
      <h2>1. Agreement to Terms</h2>
      <p>By accessing and utilizing Calcyx, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue using our web application.</p>
      
      <h2>2. Calculator Accuracy Disclaimer</h2>
      <p>All calculations, results, and formula explanations provided on Calcyx are intended strictly for educational, informational, and general planning purposes. While we strive to ensure mathematical accuracy in all 25+ modules:
        <ul>
          <li>Calculators are provided "as-is" without warranties of accuracy, completeness, or suitability for any specific financial, medical, legal, or construction planning.</li>
          <li>Financial tools (like EMI, SIP, Compound Interest) are estimates and do not account for custom tax brackets, dynamic fees, or varying bank policies.</li>
          <li>Health tools (like BMI, BMR, Body Fat) are standard statistical formulas and should not replace professional medical advice, diagnoses, or healthcare plans.</li>
        </ul>
      </p>
      
      <h2>3. Limitation of Liability</h2>
      <p>Calcyx and its maintainers shall not be liable for any direct, indirect, incidental, or consequential damages arising out of your reliance on calculation outputs or errors in formulas.</p>
    `
  }
};

export function render(params) {
  const pageId = params.page || 'about';
  const page = pagesContent[pageId];

  const container = document.createElement('div');
  container.className = 'info-page page-enter';

  // Header
  container.appendChild(renderHeader());

  const main = document.createElement('main');
  main.className = 'container page';

  if (!page) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📂</div>
        <h1 class="empty-state-text">Page Not Found</h1>
        <a href="/" class="btn btn-primary" style="margin-top:var(--space-xl)">← Back to Home</a>
      </div>
    `;
    container.appendChild(main);
    container.appendChild(renderFooter());
    return container;
  }

  // Update SEO Meta
  meta.title = `${page.title} — Calcyx`;
  meta.description = page.description;
  meta.canonical = `https://calcyx.com/${pageId}`;

  // Render info content card
  const card = document.createElement('div');
  card.className = 'glass-card';
  card.style.maxWidth = '800px';
  card.style.margin = '0 auto';
  card.innerHTML = `
    <div style="text-align:center; margin-bottom:var(--space-xl)">
      <span style="font-size:3rem; margin-bottom:var(--space-sm); display:inline-block">${page.icon}</span>
      <h1 style="font-size:var(--text-3xl); font-weight:800; margin-bottom:var(--space-xs)">${page.title}</h1>
      <p class="text-secondary">${page.description}</p>
    </div>
    <div class="calc-formula" style="background:none; border:none; padding:0; margin:0; line-height:var(--leading-relaxed)">
      ${page.content}
    </div>
    <div style="margin-top:var(--space-2xl); text-align:center">
      <a href="/" class="btn btn-secondary">← Back to Home</a>
    </div>
  `;

  main.appendChild(card);
  container.appendChild(main);

  // Footer
  container.appendChild(renderFooter());

  return container;
}

export function mount(params) {
  const cleanHeader = mountHeader();
  const pageId = params.page || 'about';
  const page = pagesContent[pageId];

  if (page) {
    updateBreadcrumbs([{ name: page.title }]);
  }

  return () => {
    cleanHeader();
  };
}
