export const meta = {
  slug: 'series',
  title: 'Sequence & Series Calculator',
  description: 'Calculate terms, common difference/ratio, and sums for Arithmetic and Geometric progressions.',
  category: 'math',
  icon: '📈',
  relatedSlugs: ['percentage', 'logarithm'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group" style="margin-bottom:1rem;">
        <label class="form-label">Sequence Type</label>
        <div style="display:flex;gap:0.5rem;">
          <button id="ser-type-arith" class="btn btn-primary" style="flex:1;">Arithmetic (AP)</button>
          <button id="ser-type-geom" class="btn btn-secondary" style="flex:1;">Geometric (GP)</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">First Term (a₁)</label>
          <input type="number" id="ser-a1" class="form-control" value="2" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label" id="ser-diff-label">Common Difference (d)</label>
          <input type="number" id="ser-diff" class="form-control" value="3" step="any" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Number of Terms (n)</label>
        <input type="number" id="ser-n" class="form-control" value="10" min="1" max="1000" />
      </div>
    </div>

    <div class="calc-result-section" id="ser-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);" id="ser-nth-label">Nth Term (aₙ)</div>
          <div id="ser-nth-val" style="font-size:1.8rem;font-weight:700;color:var(--primary-color);word-break:break-all;"></div>
        </div>
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);" id="ser-sum-label">Sum of n Terms (Sₙ)</div>
          <div id="ser-sum-val" style="font-size:1.8rem;font-weight:700;color:var(--secondary-color);word-break:break-all;"></div>
        </div>
      </div>

      <div class="glass-card" style="padding:1rem;">
        <div style="font-weight:600;margin-bottom:0.5rem;">First 5 Terms</div>
        <div id="ser-terms" class="text-mono" style="font-size:1.1rem;color:var(--primary-color);"></div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Formulas</h3>
      <div id="ser-formula-text"></div>
    </div>
  `;
  return el;
}

export function mount(el) {
  const btnArith = el.querySelector('#ser-type-arith');
  const btnGeom = el.querySelector('#ser-type-geom');
  const inputA1 = el.querySelector('#ser-a1');
  const inputDiff = el.querySelector('#ser-diff');
  const inputN = el.querySelector('#ser-n');
  const diffLabel = el.querySelector('#ser-diff-label');
  const nthLabel = el.querySelector('#ser-nth-label');
  const sumLabel = el.querySelector('#ser-sum-label');
  const formulaText = el.querySelector('#ser-formula-text');
  const resultsDiv = el.querySelector('#ser-results');

  let type = 'arith';

  function setType(t) {
    type = t;
    if (t === 'arith') {
      btnArith.className = 'btn btn-primary';
      btnGeom.className = 'btn btn-secondary';
      diffLabel.textContent = 'Common Difference (d)';
      nthLabel.textContent = 'Nth Term (aₙ)';
      sumLabel.textContent = 'Sum of n Terms (Sₙ)';
      if (inputDiff.value === '2' && inputA1.value === '2') inputDiff.value = '3'; // default AP
    } else {
      btnArith.className = 'btn btn-secondary';
      btnGeom.className = 'btn btn-primary';
      diffLabel.textContent = 'Common Ratio (r)';
      nthLabel.textContent = 'Nth Term (aₙ)';
      sumLabel.textContent = 'Sum of n Terms (Sₙ)';
      if (inputDiff.value === '3') inputDiff.value = '2'; // default GP
    }
    calculate();
  }

  function fmt(n) {
    if (isNaN(n) || !isFinite(n)) return 'Error';
    return parseFloat(n.toFixed(6)).toString();
  }

  function calculate() {
    const a1 = parseFloat(inputA1.value);
    const diff = parseFloat(inputDiff.value);
    const n = parseInt(inputN.value);

    if (isNaN(a1) || isNaN(diff) || isNaN(n) || n < 1) {
      resultsDiv.style.display = 'none';
      return;
    }

    let nthVal, sumVal;
    const terms = [];

    if (type === 'arith') {
      nthVal = a1 + (n - 1) * diff;
      sumVal = (n / 2) * (a1 + nthVal);

      for (let i = 1; i <= Math.min(5, n); i++) {
        terms.push(fmt(a1 + (i - 1) * diff));
      }

      formulaText.innerHTML = `
        <p><strong>Nth Term:</strong> aₙ = a₁ + (n - 1)d</p>
        <p><strong>Sum of n terms:</strong> Sₙ = (n/2)(a₁ + aₙ) = (n/2)(2a₁ + (n-1)d)</p>
      `;
    } else {
      nthVal = a1 * Math.pow(diff, n - 1);
      if (diff === 1) {
        sumVal = a1 * n;
      } else {
        sumVal = a1 * (1 - Math.pow(diff, n)) / (1 - diff);
      }

      for (let i = 1; i <= Math.min(5, n); i++) {
        terms.push(fmt(a1 * Math.pow(diff, i - 1)));
      }

      formulaText.innerHTML = `
        <p><strong>Nth Term:</strong> aₙ = a₁ · rⁿ⁻¹</p>
        <p><strong>Sum of n terms:</strong> Sₙ = a₁(1 - rⁿ) / (1 - r) &nbsp; (for r ≠ 1)</p>
      `;
    }

    el.querySelector('#ser-nth-val').textContent = fmt(nthVal);
    el.querySelector('#ser-sum-val').textContent = fmt(sumVal);
    el.querySelector('#ser-terms').textContent = terms.join(', ') + (n > 5 ? ', ...' : '');

    resultsDiv.style.display = '';
  }

  btnArith.addEventListener('click', () => setType('arith'));
  btnGeom.addEventListener('click', () => setType('geom'));
  [inputA1, inputDiff, inputN].forEach(i => i.addEventListener('input', calculate));

  setType('arith');

  return () => {
    btnArith.removeEventListener('click', () => setType('arith'));
    btnGeom.removeEventListener('click', () => setType('geom'));
    [inputA1, inputDiff, inputN].forEach(i => i.removeEventListener('input', calculate));
  };
}
