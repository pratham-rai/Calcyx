/* ============================================================
   CALCYX — Client-Side Router (History API)
   ============================================================ */

class Router {
  constructor() {
    /** @type {Map<string, Function>} */
    this.routes = new Map();
    this.currentCleanup = null;
    this.isTransitioning = false;

    // Handle browser back/forward
    window.addEventListener('popstate', () => this.handleRoute());

    // Intercept internal link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      // Only intercept internal links (not external, mailto, tel, etc.)
      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        this.navigate(href);
      }
    });
  }

  /**
   * Register a route pattern with a lazy-loader function
   * @param {string} pattern - e.g. '/' or '/calculators/:slug'
   * @param {Function} handler - async function(params) => { render, mount?, meta? }
   */
  register(pattern, handler) {
    this.routes.set(pattern, handler);
  }

  /**
   * Navigate to a new URL
   * @param {string} path
   */
  async navigate(path) {
    if (path === window.location.pathname) return;
    history.pushState(null, '', path);
    await this.handleRoute();
  }

  /**
   * Handle the current route
   */
  async handleRoute() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const path = window.location.pathname;
    const app = document.getElementById('app');

    // Clean up previous page
    if (this.currentCleanup) {
      try { this.currentCleanup(); } catch (e) { console.warn('Cleanup error:', e); }
      this.currentCleanup = null;
    }

    // Find matching route
    let handler = null;
    let params = {};

    // Try exact match first
    if (this.routes.has(path)) {
      handler = this.routes.get(path);
    } else {
      // Try parameterized routes
      for (const [pattern, fn] of this.routes) {
        const match = this._matchPattern(pattern, path);
        if (match) {
          handler = fn;
          params = match;
          break;
        }
      }
    }

    if (!handler) {
      this._show404(app);
      this.isTransitioning = false;
      return;
    }

    try {
      // Page exit animation
      const currentPage = app.querySelector('.page, .calc-page');
      if (currentPage) {
        currentPage.classList.add('page-exit');
        await new Promise(r => setTimeout(r, 150));
      }

      // Load and render the page
      const module = await handler(params);

      // Clear and render
      app.innerHTML = '';
      const content = module.render(params);
      if (typeof content === 'string') {
        app.innerHTML = content;
      } else if (content instanceof Node) {
        app.appendChild(content);
      }

      // Mount (attach event listeners)
      if (module.mount) {
        this.currentCleanup = module.mount(params) || null;
      }

      // Update SEO meta tags
      if (module.meta) {
        this._updateMeta(module.meta);
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });

    } catch (err) {
      console.error('Route error:', err);
      this._showError(app, err);
    }

    this.isTransitioning = false;
  }

  /**
   * Match a parameterized pattern against a path
   * @returns {Object|null} params if matched, null otherwise
   */
  _matchPattern(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  /**
   * Update document meta tags for SEO
   */
  _updateMeta({ title, description, canonical }) {
    const fullTitle = title || 'Calcyx — Free Online Calculators';
    document.title = fullTitle;

    const setMeta = (attr, value, content) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content || '');
    };

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    if (title) {
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }
    setMeta('property', 'og:url', window.location.href);
    setMeta('name', 'twitter:url', window.location.href);

    // Update canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical || window.location.href);

    // Update JSON-LD
    const jsonLd = document.getElementById('jsonld');
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd.textContent);
        data.name = title || data.name;
        data.description = description || data.description;
        data.url = window.location.href;
        jsonLd.textContent = JSON.stringify(data);
      } catch (e) { /* ignore */ }
    }
  }

  /**
   * Show 404 page
   */
  _show404(app) {
    app.innerHTML = `
      <div class="page page-enter">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <h1 class="empty-state-text">Page Not Found</h1>
            <p class="text-secondary" style="margin-top:var(--space-md)">
              The calculator you're looking for doesn't exist.
            </p>
            <a href="/" class="btn btn-primary" style="margin-top:var(--space-xl)">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    `;
    document.title = '404 — Calcyx';
  }

  /**
   * Show error page
   */
  _showError(app, error) {
    app.innerHTML = `
      <div class="page page-enter">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h1 class="empty-state-text">Something went wrong</h1>
            <p class="text-secondary" style="margin-top:var(--space-md)">
              ${error.message || 'An unexpected error occurred.'}
            </p>
            <a href="/" class="btn btn-primary" style="margin-top:var(--space-xl)">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

// Singleton router instance
export const router = new Router();
