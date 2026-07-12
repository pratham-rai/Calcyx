/* ============================================================
   CALCYX — Homepage with Simple/Scientific Calculator
   ============================================================ */

import { renderSearch, mountSearch } from '../components/search.js';
import { renderCategoryTiles } from '../components/categoryTiles.js';
import { renderFavoritesAndRecents, mountFavoritesAndRecents } from '../components/favorites.js';
import { renderInstallPrompt, mountInstallPrompt } from '../components/installPrompt.js';
import { renderHeader, mountHeader, updateBreadcrumbs } from '../components/header.js';
import { renderFooter } from '../components/footer.js';

export const meta = {
  title: 'Calcyx — Free Online Simple & Scientific Calculators',
  description: 'Instant online simple and scientific calculators, plus 25+ specialized tools for finance, health, math, conversion and date calculations.',
  canonical: '/'
};

export function render() {
  const container = document.createElement('div');
  container.className = 'home-page page-enter';

  // 1. Add Header
  container.appendChild(renderHeader());

  // 2. Main content container
  const main = document.createElement('main');
  main.className = 'container page';

  // Install Banner Slot
  const bannerSlot = document.createElement('div');
  bannerSlot.appendChild(renderInstallPrompt());
  main.appendChild(bannerSlot);

  // Hero Section with Simple/Scientific Calc Widget
  const hero = document.createElement('section');
  hero.style.marginBottom = 'var(--space-3xl)';
  hero.innerHTML = `
    <div style="text-align:center; margin-bottom:var(--space-xl)">
      <h1 style="font-size:var(--text-3xl); font-weight:800; margin-bottom:var(--space-xs)">Every Calculation, <span class="text-gradient">Instant & Offline</span></h1>
      <p class="text-secondary" style="font-size:var(--text-sm)">Use the quick calculator below, or search our specialized library.</p>
    </div>

    <!-- Toggle -->
    <div class="hero-mode-toggle">
      <div class="toggle-group">
        <button class="toggle-option active" id="btn-calc-simple">Simple</button>
        <button class="toggle-option" id="btn-calc-scientific">Scientific</button>
      </div>
    </div>

    <!-- Calculator Widget -->
    <div class="hero-calculator">
      <div class="calc-display">
        <div class="calc-expression" id="widget-expr"></div>
        <div class="calc-current" id="widget-curr">0</div>
      </div>
      <div class="calc-memory-indicator" id="widget-mem" style="display:none">M</div>
      <div class="calc-keypad simple" id="widget-keypad">
        <!-- Filled dynamically -->
      </div>
    </div>
  `;
  main.appendChild(hero);

  // Search Section
  const searchSection = document.createElement('section');
  searchSection.style.cssText = 'display:flex; flex-direction:column; align-items:center; margin-bottom:var(--space-3xl); width:100%';
  searchSection.innerHTML = `<h2 class="section-title" style="margin-bottom:var(--space-md)">🔍 Find a Calculator</h2>`;
  searchSection.appendChild(renderSearch());
  main.appendChild(searchSection);

  // Favorites & Recents Section
  const favSlot = document.createElement('div');
  favSlot.appendChild(renderFavoritesAndRecents());
  favSlot.style.marginBottom = 'var(--space-3xl)';
  main.appendChild(favSlot);

  // Categories Section
  const catSection = document.createElement('section');
  catSection.style.marginBottom = 'var(--space-3xl)';
  catSection.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">📂 Browse Categories</h2>
    </div>
  `;
  catSection.appendChild(renderCategoryTiles());
  main.appendChild(catSection);

  // Footer
  main.appendChild(renderFooter());

  container.appendChild(main);
  return container;
}

export function mount() {
  const cleanHeader = mountHeader();
  const cleanSearch = mountSearch();
  const cleanFavs = mountFavoritesAndRecents();
  const cleanInstall = mountInstallPrompt();

  updateBreadcrumbs([]); // Clear breadcrumbs on home

  // Calculator Logic
  let isScientific = false;
  let expression = '';
  let currentVal = '0';
  let memory = 0;
  let shouldResetInput = false;

  const exprEl = document.getElementById('widget-expr');
  const currEl = document.getElementById('widget-curr');
  const keypad = document.getElementById('widget-keypad');
  const memIndicator = document.getElementById('widget-mem');

  const updateDisplay = () => {
    exprEl.textContent = expression;
    currEl.textContent = currentVal;
    memIndicator.style.display = memory !== 0 ? 'block' : 'none';
  };

  const simpleKeys = [
    { label: 'AC', class: 'clear', action: 'all-clear' },
    { label: 'C', class: 'clear', action: 'clear' },
    { label: '%', class: 'operator', action: 'percent' },
    { label: '÷', class: 'operator', action: 'op', val: '/' },

    { label: '7', action: 'num', val: '7' },
    { label: '8', action: 'num', val: '8' },
    { label: '9', action: 'num', val: '9' },
    { label: '×', class: 'operator', action: 'op', val: '*' },

    { label: '4', action: 'num', val: '4' },
    { label: '5', action: 'num', val: '5' },
    { label: '6', action: 'num', val: '6' },
    { label: '−', class: 'operator', action: 'op', val: '-' },

    { label: '1', action: 'num', val: '1' },
    { label: '2', action: 'num', val: '2' },
    { label: '3', action: 'num', val: '3' },
    { label: '+', class: 'operator', action: 'op', val: '+' },

    { label: '0', action: 'num', val: '0', extraClass: 'wide' },
    { label: '.', action: 'num', val: '.' },
    { label: '=', class: 'equals', action: 'equals' }
  ];

  const scientificKeys = [
    // Row 1: Memory
    { label: 'MC', class: 'sci', action: 'mem-clear' },
    { label: 'MR', class: 'sci', action: 'mem-recall' },
    { label: 'M+', class: 'sci', action: 'mem-add' },
    { label: 'M−', class: 'sci', action: 'mem-sub' },
    { label: 'MS', class: 'sci', action: 'mem-store' },

    // Row 2: Functions
    { label: 'sin', class: 'sci', action: 'func', val: 'sin(' },
    { label: 'cos', class: 'sci', action: 'func', val: 'cos(' },
    { label: 'tan', class: 'sci', action: 'func', val: 'tan(' },
    { label: 'π', class: 'sci', action: 'num', val: 'π' },
    { label: 'e', class: 'sci', action: 'num', val: 'e' },

    // Row 3: Math functions
    { label: 'ln', class: 'sci', action: 'func', val: 'ln(' },
    { label: 'log', class: 'sci', action: 'func', val: 'log(' },
    { label: 'xʸ', class: 'sci', action: 'op', val: '^' },
    { label: '√', class: 'sci', action: 'func', val: '√(' },
    { label: 'x²', class: 'sci', action: 'sqr' },

    // Row 4: Brackets & simple stuff
    { label: '(', class: 'operator', action: 'num', val: '(' },
    { label: ')', class: 'operator', action: 'num', val: ')' },
    { label: 'AC', class: 'clear', action: 'all-clear' },
    { label: 'C', class: 'clear', action: 'clear' },
    { label: '÷', class: 'operator', action: 'op', val: '/' },

    // Row 5
    { label: '7', action: 'num', val: '7' },
    { label: '8', action: 'num', val: '8' },
    { label: '9', action: 'num', val: '9' },
    { label: '×', class: 'operator', action: 'op', val: '*' },
    { label: '1/x', class: 'sci', action: 'recip' },

    // Row 6
    { label: '4', action: 'num', val: '4' },
    { label: '5', action: 'num', val: '5' },
    { label: '6', action: 'num', val: '6' },
    { label: '−', class: 'operator', action: 'op', val: '-' },
    { label: '±', class: 'sci', action: 'negate' },

    // Row 7
    { label: '1', action: 'num', val: '1' },
    { label: '2', action: 'num', val: '2' },
    { label: '3', action: 'num', val: '3' },
    { label: '+', class: 'operator', action: 'op', val: '+' },
    { label: '=', class: 'equals', action: 'equals', extraClass: 'wide' },

    // Row 8
    { label: '0', action: 'num', val: '0', extraClass: 'wide' },
    { label: '.', action: 'num', val: '.' }
  ];

  const buildKeypad = () => {
    keypad.innerHTML = '';
    keypad.className = `calc-keypad ${isScientific ? 'scientific' : 'simple'}`;
    const keys = isScientific ? scientificKeys : simpleKeys;

    keys.forEach(k => {
      const btn = document.createElement('button');
      btn.className = `calc-key ${k.class || ''} ${k.extraClass || ''}`;
      btn.textContent = k.label;
      btn.addEventListener('click', () => handleKeyPress(k));
      keypad.appendChild(btn);
    });
  };

  const safeEvaluate = (expr) => {
    // Basic sanitization
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/\^/g, '**');

    // Handle math functions
    sanitized = sanitized.replace(/sin\(/g, 'Math.sin(');
    sanitized = sanitized.replace(/cos\(/g, 'Math.cos(');
    sanitized = sanitized.replace(/tan\(/g, 'Math.tan(');
    sanitized = sanitized.replace(/log\(/g, 'Math.log10(');
    sanitized = sanitized.replace(/ln\(/g, 'Math.log(');
    sanitized = sanitized.replace(/√\(/g, 'Math.sqrt(');

    // Validate characters to ensure no malicious code runs
    const validExprRegex = /^[0-9.+\-*/%()e\s]|(Math\.[a-z0-9]+)/i;
    if (!validExprRegex.test(sanitized)) {
      throw new Error('Invalid expression');
    }

    try {
      // Evaluate using a safe constructor
      const result = new Function(`return (${sanitized})`)();
      if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        throw new Error('Math Error');
      }
      return result;
    } catch (e) {
      throw new Error('Error');
    }
  };

  const handleKeyPress = (key) => {
    const { action, val } = key;

    switch (action) {
      case 'all-clear':
        expression = '';
        currentVal = '0';
        shouldResetInput = false;
        break;

      case 'clear':
        if (currentVal.length > 1) {
          currentVal = currentVal.slice(0, -1);
        } else {
          currentVal = '0';
        }
        break;

      case 'num':
        if (shouldResetInput || currentVal === '0') {
          currentVal = val;
          shouldResetInput = false;
        } else {
          // Avoid multiple decimals
          if (val === '.' && currentVal.includes('.')) break;
          currentVal += val;
        }
        break;

      case 'op':
        if (expression && shouldResetInput) {
          expression = currentVal + ' ' + val + ' ';
        } else {
          expression += currentVal + ' ' + val + ' ';
        }
        shouldResetInput = true;
        break;

      case 'func':
        expression += val;
        shouldResetInput = true;
        break;

      case 'percent':
        currentVal = (parseFloat(currentVal) / 100).toString();
        break;

      case 'negate':
        currentVal = (parseFloat(currentVal) * -1).toString();
        break;

      case 'recip':
        const rVal = parseFloat(currentVal);
        if (rVal === 0) {
          currentVal = 'Error';
        } else {
          currentVal = (1 / rVal).toString();
        }
        shouldResetInput = true;
        break;

      case 'sqr':
        const sVal = parseFloat(currentVal);
        currentVal = (sVal * sVal).toString();
        shouldResetInput = true;
        break;

      case 'equals':
        try {
          const fullExpr = expression + currentVal;
          const result = safeEvaluate(fullExpr);
          expression = fullExpr + ' =';
          currentVal = Number(result.toFixed(10)).toString(); // format to remove JS rounding bugs
          shouldResetInput = true;
        } catch (e) {
          currentVal = e.message;
          shouldResetInput = true;
        }
        break;

      // Memory commands
      case 'mem-clear':
        memory = 0;
        break;
      case 'mem-recall':
        currentVal = memory.toString();
        shouldResetInput = true;
        break;
      case 'mem-add':
        memory += parseFloat(currentVal) || 0;
        shouldResetInput = true;
        break;
      case 'mem-sub':
        memory -= parseFloat(currentVal) || 0;
        shouldResetInput = true;
        break;
      case 'mem-store':
        memory = parseFloat(currentVal) || 0;
        shouldResetInput = true;
        break;
    }

    updateDisplay();
  };

  // Setup buttons toggle simple/scientific
  const btnSimple = document.getElementById('btn-calc-simple');
  const btnScientific = document.getElementById('btn-calc-scientific');

  btnSimple.addEventListener('click', () => {
    if (!isScientific) return;
    isScientific = false;
    btnSimple.classList.add('active');
    btnScientific.classList.remove('active');
    buildKeypad();
  });

  btnScientific.addEventListener('click', () => {
    if (isScientific) return;
    isScientific = true;
    btnScientific.classList.add('active');
    btnSimple.classList.remove('active');
    buildKeypad();
  });

  // Initialize keypad
  buildKeypad();
  updateDisplay();

  // Keyboard mapping
  const keyboardHandler = (e) => {
    const activeEl = document.activeElement;
    // Don't intercept typing when inside search input
    if (activeEl && activeEl.id === 'calc-search-input') return;

    let keyData = null;
    const key = e.key;

    if (key >= '0' && key <= '9') {
      keyData = { action: 'num', val: key };
    } else if (key === '.') {
      keyData = { action: 'num', val: '.' };
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      let label = key;
      if (key === '*') label = '×';
      if (key === '/') label = '÷';
      keyData = { action: 'op', val: key, label };
    } else if (key === 'Enter' || key === '=') {
      keyData = { action: 'equals' };
    } else if (key === 'Backspace') {
      keyData = { action: 'clear' };
    } else if (key === 'Escape') {
      keyData = { action: 'all-clear' };
    } else if (key === '%') {
      keyData = { action: 'percent' };
    } else if (key === '(' || key === ')') {
      keyData = { action: 'num', val: key };
    }

    if (keyData) {
      e.preventDefault();
      handleKeyPress(keyData);
    }
  };

  window.addEventListener('keydown', keyboardHandler);

  return () => {
    cleanHeader();
    cleanSearch();
    cleanFavs();
    cleanInstall();
    window.removeEventListener('keydown', keyboardHandler);
  };
}
