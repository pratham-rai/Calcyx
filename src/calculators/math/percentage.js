export const meta = {
  slug: 'percentage',
  name: 'Percentage Calculator',
  title: 'Percentage Calculator - Calcyx',
  description: 'Calculate percentages instantly — find X% of Y, what percent X is of Y, or the percentage change between two values.',
  category: 'math',
  icon: '%',
  keywords: ['percentage', 'percent', 'percent of', 'percent change', 'increase', 'decrease', 'ratio'],
  formula: 'X% of Y = (X/100) × Y · X is (X/Y) × 100 % of Y · Change = ((New − Old) / |Old|) × 100%',
  relatedSlugs: ['average', 'discount']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">%</span>
        <h1 class="calc-title">Percentage Calculator</h1>
        <p class="calc-description">Three handy percentage calculations in one place. All results update instantly as you type.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label><strong>Mode 1:</strong> What is X% of Y?</label>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="pct-x1">X (%)</label>
            <input type="number" id="pct-x1" class="calc-input" placeholder="25" step="any">
          </div>
          <div class="calc-input-group">
            <label for="pct-y1">Y</label>
            <input type="number" id="pct-y1" class="calc-input" placeholder="200" step="any">
          </div>
        </div>
        <div id="pct-result1" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="pct-val1"></div>
          <div class="calc-result-label" id="pct-label1"></div>
        </div>

        <div class="calc-input-group" style="margin-top:1.5rem;">
          <label><strong>Mode 2:</strong> X is what % of Y?</label>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="pct-x2">X</label>
            <input type="number" id="pct-x2" class="calc-input" placeholder="50" step="any">
          </div>
          <div class="calc-input-group">
            <label for="pct-y2">Y</label>
            <input type="number" id="pct-y2" class="calc-input" placeholder="200" step="any">
          </div>
        </div>
        <div id="pct-result2" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="pct-val2"></div>
          <div class="calc-result-label" id="pct-label2"></div>
        </div>

        <div class="calc-input-group" style="margin-top:1.5rem;">
          <label><strong>Mode 3:</strong> Percentage change from X to Y</label>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="pct-x3">Old Value (X)</label>
            <input type="number" id="pct-x3" class="calc-input" placeholder="80" step="any">
          </div>
          <div class="calc-input-group">
            <label for="pct-y3">New Value (Y)</label>
            <input type="number" id="pct-y3" class="calc-input" placeholder="100" step="any">
          </div>
        </div>
        <div id="pct-result3" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="pct-val3"></div>
          <div class="calc-result-label" id="pct-label3"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📐 Formulas</h3>
        <code>X% of Y = (X ÷ 100) × Y</code>
        <code>X is what % of Y = (X ÷ Y) × 100</code>
        <code>% Change = ((New − Old) ÷ |Old|) × 100%</code>
        <p>Percentage change uses the absolute value of the old value as the denominator to handle negative starting values correctly.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const x1 = document.getElementById('pct-x1');
  const y1 = document.getElementById('pct-y1');
  const x2 = document.getElementById('pct-x2');
  const y2 = document.getElementById('pct-y2');
  const x3 = document.getElementById('pct-x3');
  const y3 = document.getElementById('pct-y3');

  function calcMode1() {
    const xv = parseFloat(x1.value);
    const yv = parseFloat(y1.value);
    const res = document.getElementById('pct-result1');
    if (isNaN(xv) || isNaN(yv)) { res.style.display = 'none'; return; }
    const result = (xv / 100) * yv;
    document.getElementById('pct-val1').textContent = result.toLocaleString(undefined, { maximumFractionDigits: 6 });
    document.getElementById('pct-label1').textContent = xv + '% of ' + yv + ' = ' + result.toLocaleString(undefined, { maximumFractionDigits: 6 });
    res.style.display = '';
  }

  function calcMode2() {
    const xv = parseFloat(x2.value);
    const yv = parseFloat(y2.value);
    const res = document.getElementById('pct-result2');
    if (isNaN(xv) || isNaN(yv) || yv === 0) { res.style.display = 'none'; return; }
    const result = (xv / yv) * 100;
    document.getElementById('pct-val2').textContent = result.toFixed(4) + '%';
    document.getElementById('pct-label2').textContent = xv + ' is ' + result.toFixed(4) + '% of ' + yv;
    res.style.display = '';
  }

  function calcMode3() {
    const xv = parseFloat(x3.value);
    const yv = parseFloat(y3.value);
    const res = document.getElementById('pct-result3');
    if (isNaN(xv) || isNaN(yv) || xv === 0) { res.style.display = 'none'; return; }
    const change = ((yv - xv) / Math.abs(xv)) * 100;
    const direction = change >= 0 ? 'increase' : 'decrease';
    document.getElementById('pct-val3').textContent = (change >= 0 ? '+' : '') + change.toFixed(4) + '%';
    document.getElementById('pct-val3').style.color = change >= 0 ? '#10b981' : '#ef4444';
    document.getElementById('pct-label3').textContent = Math.abs(change).toFixed(2) + '% ' + direction + ' from ' + xv + ' to ' + yv;
    res.style.display = '';
  }

  const handlers = [
    [x1, 'input', calcMode1], [y1, 'input', calcMode1],
    [x2, 'input', calcMode2], [y2, 'input', calcMode2],
    [x3, 'input', calcMode3], [y3, 'input', calcMode3]
  ];

  handlers.forEach(([el, evt, fn]) => el.addEventListener(evt, fn));

  return () => {
    handlers.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  };
}
