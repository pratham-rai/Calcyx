/* ============================================================
   CALCYX — Shared Footer Component
   ============================================================ */

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.style.cssText = `
    border-top: 1px solid var(--glass-border);
    margin-top: var(--space-3xl);
    padding: var(--space-2xl) var(--content-padding);
    background: var(--color-bg-secondary);
    transition: background var(--duration-normal) var(--ease-out);
  `;

  footer.innerHTML = `
    <div class="container" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:var(--space-xl); text-align:left; margin-bottom:var(--space-xl)">
      <!-- Brand & Info -->
      <div>
        <div style="font-size:var(--text-lg); font-weight:800; margin-bottom:var(--space-sm); color:var(--color-accent)">Calcyx</div>
        <p class="text-secondary" style="font-size:var(--text-xs); line-height:var(--leading-relaxed)">
          Instant, client-side progressive web application offering 25+ calculators across finance, health, math, and conversions. 100% offline-ready.
        </p>
      </div>

      <!-- Links: Quick Nav -->
      <div>
        <div style="font-size:var(--text-sm); font-weight:700; margin-bottom:var(--space-sm); text-transform:uppercase; letter-spacing:0.05em">Company</div>
        <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:var(--space-xs); font-size:var(--text-sm)">
          <li><a href="/about" style="color:var(--color-text-secondary)">About Us</a></li>
          <li><a href="/contact" style="color:var(--color-text-secondary)">Contact Support</a></li>
        </ul>
      </div>

      <!-- Links: Legal -->
      <div>
        <div style="font-size:var(--text-sm); font-weight:700; margin-bottom:var(--space-sm); text-transform:uppercase; letter-spacing:0.05em">Legal</div>
        <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:var(--space-xs); font-size:var(--text-sm)">
          <li><a href="/privacy" style="color:var(--color-text-secondary)">Privacy Policy</a></li>
          <li><a href="/terms" style="color:var(--color-text-secondary)">Terms of Service</a></li>
        </ul>
      </div>

      <!-- Security / PWA -->
      <div>
        <div style="font-size:var(--text-sm); font-weight:700; margin-bottom:var(--space-sm); text-transform:uppercase; letter-spacing:0.05em">Security</div>
        <p class="text-secondary" style="font-size:var(--text-xs); line-height:var(--leading-relaxed)">
          🔒 All calculations are processed locally. Your input data is never sent to any server. Safe, secure, and private.
        </p>
      </div>
    </div>

    <!-- Copyright -->
    <div class="container" style="border-top: 1px solid var(--glass-border); padding-top:var(--space-md); font-size:var(--text-xs); color:var(--color-text-tertiary)">
      <p>© ${new Date().getFullYear()} Calcyx. All rights reserved. Locally executed browser tools.</p>
    </div>
  `;

  return footer;
}
