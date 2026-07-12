/* ============================================================
   CALCYX — PWA Install Prompt Banner Component
   ============================================================ */

let deferredPrompt = null;

// Listen for the beforeinstallprompt event globally
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Dispatch custom event to notify components that install is ready
  document.dispatchEvent(new CustomEvent('calcyx-can-install'));
});

export function renderInstallPrompt() {
  const container = document.createElement('div');
  container.id = 'install-prompt-container';

  // Only render if a prompt is available
  if (deferredPrompt) {
    createBanner(container);
  }

  return container;
}

export function mountInstallPrompt() {
  const container = document.getElementById('install-prompt-container');
  if (!container) return () => {};

  const handleInstallReady = () => {
    createBanner(container);
  };

  document.addEventListener('calcyx-can-install', handleInstallReady);

  return () => {
    document.removeEventListener('calcyx-can-install', handleInstallReady);
  };
}

function createBanner(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="install-banner">
      <div class="install-banner-text">
        <div class="install-banner-title">📲 Install Calcyx Web App</div>
        <div class="install-banner-desc">Add Calcyx to your home screen for rapid access and full offline support.</div>
      </div>
      <div style="display:flex; gap:var(--space-sm)">
        <button class="btn btn-primary btn-sm" id="btn-pwa-install">Install</button>
        <button class="btn-close" id="btn-pwa-close" aria-label="Close banner">✕</button>
      </div>
    </div>
  `;

  const installBtn = container.querySelector('#btn-pwa-install');
  const closeBtn = container.querySelector('#btn-pwa-close');

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again
      deferredPrompt = null;
      container.innerHTML = '';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      container.innerHTML = '';
    });
  }
}
