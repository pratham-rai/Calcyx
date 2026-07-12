/* ============================================================
   CALCYX — Share Results Utility
   ============================================================ */

/**
 * Share calculator results using Web Share API or fallback copy-to-clipboard
 * @param {string} title - The title of the calculator
 * @param {string} text - The formatted text to share
 * @param {string} [url] - Optional URL (defaults to window.location.href)
 * @returns {Promise<boolean>} Resolves to true if shared/copied, false otherwise
 */
export async function shareResults(title, text, url = window.location.href) {
  const shareData = {
    title: `${title} - Calcyx`,
    text: `${text}\nCalculated instantly on Calcyx:`,
    url: url
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.warn('Web Share failed, falling back to copy:', e);
      } else {
        return false;
      }
    }
  }

  // Fallback: Copy to clipboard
  try {
    const fullText = `${shareData.text}\n${shareData.url}`;
    await navigator.clipboard.writeText(fullText);
    showToast('Copied results to clipboard!');
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Simple toast notification helper
 * @param {string} message
 */
function showToast(message) {
  let toast = document.getElementById('calcyx-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'calcyx-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: var(--space-xl);
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--color-bg-secondary);
      border: 1px solid var(--color-accent);
      color: var(--color-text-primary);
      padding: 0.75rem var(--space-lg);
      border-radius: var(--radius-md);
      box-shadow: var(--glass-shadow);
      z-index: 9999;
      font-size: var(--text-sm);
      font-weight: 500;
      pointer-events: none;
      transition: transform var(--duration-normal) var(--ease-spring), opacity var(--duration-normal) ease;
      opacity: 0;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  // Trigger animations
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.opacity = '0';
  }, 3000);
}
