export const meta = {
  slug: 'logarithm',
  name: 'Logarithm Calculator',
  title: 'Logarithm Calculator - Calcyx',
  description: 'Calculate logarithms for any base (base 2, base 10, natural log ln, or custom base). Displays equivalent exponential form and calculations.',
  category: 'math',
  icon: '🔢',
  keywords: ['logarithm', 'log calculator', 'natural log', 'ln', 'log base 2', 'log base 10', 'custom base log', 'exponent'],
  formula: 'log_b(x) = ln(x) / ln(b)',
  relatedSlugs: ['percentage', 'quadratic']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">🔢</span>
        <h1 class="calc-title">Logarithm Calculator</h1>
        <p class="calc-description">Compute the logarithm of a number to a specified base (2, 10, e, or a custom base).</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="log-val">Number Value (x)</label>
            <input type="number" id="log-val" class="calc-input" placeholder="e.g., 100" step="any" value="100">
          </div>
          <div class="calc-input-group">
            <label for="log-base-select">Log Base (b)</label>
            <select id="log-base-select" class="calc-select">
              <option value="10" selected>Base 10 (log₁₀)</option>
              <option value="e">Base e (ln)</option>
              <option value="2">Base 2 (log₂)</option>
              <option value="custom">Custom Base...</option>
            </select>
          </div>
        </div>
        
        <div class="calc-input-group" id="custom-base-group" style="display: none; margin-top: 1rem;">
          <label for="log-base-custom">Custom Base Value</label>
          <input type="number" id="log-base-custom" class="calc-input" placeholder="e.g., 5" step="any" value="5">
        </div>
        
        <div id="log-error" class="calc-result-detail" style="color: #ef4444; margin-top: 0.5rem; display: none;"></div>
      </div>
      
      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <div class="calc-result-item" style="grid-column: span 2;">
            <div class="calc-result-label">Result</div>
            <div class="calc-result-value" id="log-result-val"></div>
            <div class="calc-result-detail" id="log-result-expr"></div>
          </div>
          <div class="calc-result-item" style="grid-column: span 2;">
            <div class="calc-result-label">Equivalent Exponential Form</div>
            <div class="calc-result-value" id="log-exp-form" style="font-size: 1.6rem; min-height: 2.2rem; display: flex; align-items: center; justify-content: center;"></div>
            <div class="calc-result-detail">base<sup>result</sup> = value</div>
          </div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>📐 Logarithm Rules &amp; Formulas</h3>
        <p>A logarithm answers the question: <strong>"To what exponent must we raise the base to get this number?"</strong></p>
        <code>log<sub>b</sub>(x) = y &nbsp;⇔&nbsp; b<sup>y</sup> = x</code>
        <p><strong>Change of Base Formula:</strong></p>
        <code>log<sub>b</sub>(x) = ln(x) / ln(b) = log₁₀(x) / log₁₀(b)</code>
        <p><strong>Mathematical constraints:</strong></p>
        <ul>
          <li>The number <strong>x</strong> must be strictly positive (<code>x &gt; 0</code>). Logarithms of zero or negative numbers are undefined in real numbers.</li>
          <li>The base <strong>b</strong> must be strictly positive (<code>b &gt; 0</code>) and not equal to 1 (<code>b ≠ 1</code>).</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const valInput = document.getElementById('log-val');
  const baseSelect = document.getElementById('log-base-select');
  const baseCustomInput = document.getElementById('log-base-custom');
  const customBaseGroup = document.getElementById('custom-base-group');
  
  const errorEl = document.getElementById('log-error');
  const resultEl = document.getElementById('result');
  const resultValEl = document.getElementById('log-result-val');
  const resultExprEl = document.getElementById('log-result-expr');
  const expFormEl = document.getElementById('log-exp-form');

  function formatNum(n) {
    if (Math.abs(n) < 1e-9) return '0';
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  function calculate() {
    const x = parseFloat(valInput.value);
    let b = 10;
    
    if (baseSelect.value === 'e') {
      b = Math.E;
    } else if (baseSelect.value === '2') {
      b = 2;
    } else if (baseSelect.value === 'custom') {
      b = parseFloat(baseCustomInput.value);
    } else {
      b = 10;
    }
    
    errorEl.style.display = 'none';
    errorEl.textContent = '';
    
    if (isNaN(x)) {
      resultEl.style.display = 'none';
      return;
    }
    
    if (baseSelect.value === 'custom' && isNaN(b)) {
      resultEl.style.display = 'none';
      return;
    }
    
    if (x <= 0) {
      errorEl.textContent = 'Error: The number value (x) must be greater than 0.';
      errorEl.style.display = 'block';
      resultEl.style.display = 'none';
      return;
    }
    
    if (b <= 0) {
      errorEl.textContent = 'Error: The base (b) must be greater than 0.';
      errorEl.style.display = 'block';
      resultEl.style.display = 'none';
      return;
    }
    
    if (b === 1) {
      errorEl.textContent = 'Error: The base (b) cannot be 1.';
      errorEl.style.display = 'block';
      resultEl.style.display = 'none';
      return;
    }
    
    const result = Math.log(x) / Math.log(b);
    
    const formattedResult = formatNum(result);
    const formattedX = formatNum(x);
    
    let baseStr = '';
    if (baseSelect.value === 'e') {
      baseStr = 'e';
    } else {
      baseStr = formatNum(b);
    }
    
    resultValEl.textContent = formattedResult;
    resultExprEl.innerHTML = `log<sub>${baseStr}</sub>(${formattedX}) = ${formattedResult}`;
    expFormEl.innerHTML = `${baseStr}<sup>${formattedResult}</sup> ≈ ${formattedX}`;
    
    resultEl.style.display = '';
  }

  function handleBaseSelectChange() {
    if (baseSelect.value === 'custom') {
      customBaseGroup.style.display = '';
    } else {
      customBaseGroup.style.display = 'none';
    }
    calculate();
  }

  valInput.addEventListener('input', calculate);
  baseSelect.addEventListener('change', handleBaseSelectChange);
  baseCustomInput.addEventListener('input', calculate);
  
  handleBaseSelectChange();
  
  return () => {
    valInput.removeEventListener('input', calculate);
    baseSelect.removeEventListener('change', handleBaseSelectChange);
    baseCustomInput.removeEventListener('input', calculate);
  };
}
