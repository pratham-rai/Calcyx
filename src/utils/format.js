/* ============================================================
   CALCYX — Number & Date Formatting Utilities
   ============================================================ */

/**
 * Format a number with locale-aware separators
 * @param {number} num
 * @param {number} decimals - max decimal places
 * @param {string} locale
 * @returns {string}
 */
export function formatNumber(num, decimals = 2, locale = 'en-IN') {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return Number(num).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a number as currency
 * @param {number} num
 * @param {string} currency - e.g. 'USD', 'INR'
 * @param {string} locale
 * @returns {string}
 */
export function formatCurrency(num, currency = 'USD', locale = 'en-US') {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return Number(num).toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format a percentage
 * @param {number} num - already in percent form (e.g. 12.5 for 12.5%)
 * @param {number} decimals
 * @returns {string}
 */
export function formatPercent(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return `${Number(num).toFixed(decimals)}%`;
}

/**
 * Format a date as a readable string
 * @param {Date} date
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  if (!(date instanceof Date) || isNaN(date)) return '—';
  const defaults = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', { ...defaults, ...options });
}

/**
 * Compact number formatting (1K, 1M, etc.)
 * @param {number} num
 * @returns {string}
 */
export function formatCompact(num) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  const abs = Math.abs(num);
  if (abs >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (abs >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (abs >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}
