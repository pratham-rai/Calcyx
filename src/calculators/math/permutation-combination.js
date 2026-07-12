export const meta = {
  slug: 'permutation-combination',
  name: 'Permutation & Combination',
  title: 'Permutation and Combination Calculator - Calcyx',
  description: 'Calculate permutations (nPr) and combinations (nCr) for a given number of items. Includes detailed, step-by-step factorial expansions.',
  category: 'math',
  icon: '🎲',
  keywords: ['permutation', 'combination', 'npr', 'ncr', 'probability', 'factorial', 'statistics'],
  formula: 'nPr = n! / (n-r)! · nCr = n! / (r! × (n-r)!)',
  relatedSlugs: ['percentage', 'quadratic']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">🎲</span>
        <h1 class="calc-title">Permutation & Combination</h1>
        <p class="calc-description">Calculate the number of ways to arrange (permutations) or select (combinations) items, complete with step-by-step expansions.</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="perm-n">Total Items (n)</label>
            <input type="number" id="perm-n" class="calc-input" placeholder="e.g. 10" min="0" max="1000" step="1">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="perm-r">Chosen Items (r)</label>
            <input type="number" id="perm-r" class="calc-input" placeholder="e.g. 3" min="0" max="1000" step="1">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Permutations (nPr)</div>
            <div class="calc-result-value" id="perm-npr" style="font-size: 1.8rem; word-break: break-all;"></div>
            <div class="calc-result-detail">Order matters</div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Combinations (nCr)</div>
            <div class="calc-result-value" id="perm-ncr" style="font-size: 1.8rem; word-break: break-all;"></div>
            <div class="calc-result-detail">Order does not matter</div>
          </div>
        </div>
        
        <div style="margin-top: 1.5rem; text-align: left; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
          <h4 style="margin-bottom: 0.5rem; font-size: 1rem; opacity: 0.9;">📋 Step-by-Step Calculation</h4>
          
          <h5 style="margin: 0.75rem 0 0.25rem 0; font-size: 0.9rem; font-weight: 600; opacity: 0.8;">Permutations (nPr):</h5>
          <div class="calc-result-detail" id="perm-steps-npr" style="white-space: pre-wrap; font-family: monospace; line-height: 1.4; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 6px;"></div>
          
          <h5 style="margin: 1rem 0 0.25rem 0; font-size: 0.9rem; font-weight: 600; opacity: 0.8;">Combinations (nCr):</h5>
          <div class="calc-result-detail" id="perm-steps-ncr" style="white-space: pre-wrap; font-family: monospace; line-height: 1.4; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 6px;"></div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Permutations and Combinations</h3>
        <code>Permutations (nPr) = n! / (n - r)!</code>
        <code>Combinations (nCr) = n! / [r! × (n - r)!]</code>
        <p><strong>Factorial (n!)</strong> is the product of all positive integers less than or equal to n (e.g., 4! = 4 × 3 × 2 × 1 = 24). By definition, 0! = 1.</p>
        <p><strong>Permutations</strong> are used when the order of selection matters (e.g. race finishes). <strong>Combinations</strong> are used when order does not matter (e.g. card hands).</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const inputN = document.getElementById('perm-n');
  const inputR = document.getElementById('perm-r');

  function factorialBigInt(num) {
    if (num < 0) return null;
    let result = 1n;
    for (let i = 2n; i <= BigInt(num); i++) {
      result *= i;
    }
    return result;
  }

  function getPermutations(n, r) {
    if (n < r || n < 0 || r < 0) return null;
    let res = 1n;
    for (let i = 0; i < r; i++) {
      res *= BigInt(n - i);
    }
    return res;
  }

  function getCombinations(n, r) {
    if (n < r || n < 0 || r < 0) return null;
    const k = r > n - r ? n - r : r;
    let num = 1n;
    let den = 1n;
    for (let i = 0; i < k; i++) {
      num *= BigInt(n - i);
      den *= BigInt(i + 1);
    }
    return num / den;
  }

  function getFactorialExpansion(val) {
    if (val === 0 || val === 1) return '1';
    if (val <= 8) {
      const parts = [];
      for (let i = val; i >= 1; i--) parts.push(i);
      return parts.join(' × ');
    } else {
      return `${val} × ${val - 1} × ${val - 2} × ... × 1`;
    }
  }

  function getPermutationSteps(n, r) {
    if (n < r) return `Invalid: n (${n}) must be greater than or equal to r (${r}).`;
    if (n < 0 || r < 0) return `Invalid: Inputs cannot be negative.`;
    if (r === 0) return `nP0 = ${n}! / (${n}-0)! = ${n}! / ${n}! = 1`;

    let stepStr = `Formula: nPr = n! / (n - r)!\n`;
    stepStr += `Substituting values: ${n}P${r} = ${n}! / (${n} - ${r})! = ${n}! / ${n - r}!\n`;
    
    if (n <= 12) {
      stepStr += `= (${getFactorialExpansion(n)}) / (${getFactorialExpansion(n - r)})\n`;
    }
    
    const parts = [];
    const displayLimit = Math.min(r, 6);
    for (let i = 0; i < displayLimit; i++) {
      parts.push(n - i);
    }
    if (r > 6) {
      parts.push('...');
      parts.push(n - r + 1);
    }
    
    stepStr += `= ${parts.join(' × ')}\n`;
    
    const result = getPermutations(n, r);
    stepStr += `= ${result.toLocaleString()}`;
    return stepStr;
  }

  function getCombinationSteps(n, r) {
    if (n < r) return `Invalid: n (${n}) must be greater than or equal to r (${r}).`;
    if (n < 0 || r < 0) return `Invalid: Inputs cannot be negative.`;
    if (r === 0) return `nC0 = ${n}! / (0! × (${n}-0)!) = ${n}! / (1 × ${n}!) = 1`;

    let stepStr = `Formula: nCr = n! / [r! × (n - r)!]\n`;
    stepStr += `Substituting values: ${n}C${r} = ${n}! / [${r}! × (${n} - ${r})!] = ${n}! / [${r}! × ${n - r}!]\n`;
    
    if (n <= 12) {
      stepStr += `= (${getFactorialExpansion(n)}) / [(${getFactorialExpansion(r)}) × (${getFactorialExpansion(n - r)})]\n`;
    }

    const numParts = [];
    const denParts = [];
    const displayLimit = Math.min(r, 6);
    for (let i = 0; i < displayLimit; i++) {
      numParts.push(n - i);
      denParts.push(i + 1);
    }
    if (r > 6) {
      numParts.push('...');
      numParts.push(n - r + 1);
      denParts.push('...');
      denParts.push(r);
    }

    stepStr += `= (${numParts.join(' × ')}) / (${denParts.join(' × ')})\n`;
    
    const result = getCombinations(n, r);
    stepStr += `= ${result.toLocaleString()}`;
    return stepStr;
  }

  function calculate() {
    const nVal = inputN.value;
    const rVal = inputR.value;

    // Show nothing if inputs are completely empty
    if (nVal === '' || rVal === '') {
      document.getElementById('result').style.display = 'none';
      return;
    }

    const n = parseInt(nVal);
    const r = parseInt(rVal);

    const resultDiv = document.getElementById('result');
    const nprDiv = document.getElementById('perm-npr');
    const ncrDiv = document.getElementById('perm-ncr');
    const stepsNpr = document.getElementById('perm-steps-npr');
    const stepsNcr = document.getElementById('perm-steps-ncr');

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
      resultDiv.style.display = '';
      nprDiv.textContent = 'Error';
      ncrDiv.textContent = 'Error';
      stepsNpr.textContent = 'Please enter non-negative integers for both n and r.';
      stepsNcr.textContent = 'Please enter non-negative integers for both n and r.';
      return;
    }

    if (n < r) {
      resultDiv.style.display = '';
      nprDiv.textContent = '0';
      ncrDiv.textContent = '0';
      stepsNpr.textContent = `Invalid input: n (${n}) must be greater than or equal to r (${r}).`;
      stepsNcr.textContent = `Invalid input: n (${n}) must be greater than or equal to r (${r}).`;
      return;
    }

    // Perform calculation
    const npr = getPermutations(n, r);
    const ncr = getCombinations(n, r);

    nprDiv.textContent = npr.toLocaleString();
    ncrDiv.textContent = ncr.toLocaleString();

    stepsNpr.textContent = getPermutationSteps(n, r);
    stepsNcr.textContent = getCombinationSteps(n, r);

    resultDiv.style.display = '';
  }

  inputN.addEventListener('input', calculate);
  inputR.addEventListener('input', calculate);

  calculate();

  return () => {
    inputN.removeEventListener('input', calculate);
    inputR.removeEventListener('input', calculate);
  };
}
