/* ============================================================
   CALCYX — LocalStorage Wrapper
   ============================================================ */

const PREFIX = 'calcyx_';

/**
 * Get a value from localStorage
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function get(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Set a value in localStorage
 * @param {string} key
 * @param {*} value
 */
export function set(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed:', e);
  }
}

/**
 * Remove a key from localStorage
 * @param {string} key
 */
export function remove(key) {
  localStorage.removeItem(PREFIX + key);
}

/* ---------- Favorites ---------- */

/**
 * Get favorites list (array of calculator slugs)
 * @returns {string[]}
 */
export function getFavorites() {
  return get('favorites', []);
}

/**
 * Toggle a calculator in favorites
 * @param {string} slug
 * @returns {boolean} true if now favorited
 */
export function toggleFavorite(slug) {
  const favs = getFavorites();
  const index = favs.indexOf(slug);
  if (index === -1) {
    favs.unshift(slug);
  } else {
    favs.splice(index, 1);
  }
  set('favorites', favs);
  return index === -1;
}

/**
 * Check if a calculator is favorited
 * @param {string} slug
 * @returns {boolean}
 */
export function isFavorite(slug) {
  return getFavorites().includes(slug);
}

/* ---------- Recently Used ---------- */

const MAX_RECENT = 10;

/**
 * Get recently used calculators
 * @returns {string[]} array of slugs
 */
export function getRecent() {
  return get('recent', []);
}

/**
 * Add a calculator to recently used
 * @param {string} slug
 */
export function addRecent(slug) {
  let recent = getRecent();
  recent = recent.filter(s => s !== slug);
  recent.unshift(slug);
  if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
  set('recent', recent);
}

/* ---------- Theme ---------- */

/**
 * Get the stored theme preference
 * @returns {'dark'|'light'|null}
 */
export function getTheme() {
  return get('theme', null);
}

/**
 * Set theme preference
 * @param {'dark'|'light'} theme
 */
export function setTheme(theme) {
  set('theme', theme);
}
