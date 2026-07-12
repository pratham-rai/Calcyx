export const meta = {
  slug: 'compound-interest',
  name: 'Compound Interest Calculator',
  title: 'Compound Interest Calculator - Calcyx',
  description: 'Calculate compound interest, final maturity amount, and effective annual rate for any compounding frequency.',
  category: 'finance',
  icon: '📈',
  keywords: ['compound interest', 'investment', 'savings', 'returns', 'compounding', 'effective rate'],
  formula: 'A = P \\left(1 + \\frac{r}{n}\\right)^{nt}',
  relatedSlugs: ['simple-interest', 'sip', 'emi']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>

      <div class="calc-body">
        <div class="calc-input-group">
          <label for="ci-principal">Principal Amount (₹)</label>
          <input type="number" id="ci-principal" class="calc-input" placeholder="e.g. 100000" min="0" step="1000">
        </div>

        <div class="calc-input-group">
          <label for="ci-rate">Annual Interest Rate (%)</label>
          <input type="number" id="ci-rate" class="calc-input" placeholder="e.g. 7" min="0" max="100" step="0.1">
        </div>

        <div class="calc-input-group">
          <label for="ci-time">Time Period (years)</label>
          <input type="number" id="ci-time" class="calc-input" placeholder="e.g. 5" min="0" step="0.5">
        </div>

        <div class="calc-input-group">
          <label for="ci-frequency">Compounding Frequency</label>
          <select id="ci-frequency" class="calc-select">
            <option value="12">Monthly</option>
            <option value="4">Quarterly</option>
            <option value="2">Semi-Annually</option>
            <option value="1" selected>Annually</option>
          </select>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Final Amount</span>
            <span class="calc-result-value" id="ci-amount"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Interest Earned</span>
            <span class="calc-result-value" id="ci-interest"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Effective Annual Rate</span>
            <span class="calc-result-value" id="ci-ear"></span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Formula</h3>
        <code>A = P × (1 + r/n)^(n × t)</code>
        <p>Where <strong>P</strong> = principal, <strong>r</strong> = annual interest rate (as decimal), <strong>n</strong> = compounding periods per year, and <strong>t</strong> = time in years.</p>
        <p><strong>Effective Annual Rate (EAR)</strong> = (1 + r/n)^n − 1 — the true yearly return accounting for compounding.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const principalInput = document.getElementById('ci-principal');
  const rateInput = document.getElementById('ci-rate');
  const timeInput = document.getElementById('ci-time');
  const frequencySelect = document.getElementById('ci-frequency');

  function calculate() {
    const P = parseFloat(principalInput.value);
    const annualRate = parseFloat(rateInput.value);
    const t = parseFloat(timeInput.value);
    const n = parseInt(frequencySelect.value, 10);

    const resultDiv = document.getElementById('result');

    if (isNaN(P) || isNaN(annualRate) || isNaN(t) || P <= 0 || annualRate < 0 || t <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const r = annualRate / 100;
    const A = P * Math.pow(1 + r / n, n * t);
    const interest = A - P;
    const ear = (Math.pow(1 + r / n, n) - 1) * 100;

    document.getElementById('ci-amount').textContent = '₹' + A.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('ci-interest').textContent = '₹' + interest.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('ci-ear').textContent = ear.toFixed(2) + '%';

    resultDiv.style.display = '';
  }

  principalInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);
  timeInput.addEventListener('input', calculate);
  frequencySelect.addEventListener('input', calculate);

  return function cleanup() {
    principalInput.removeEventListener('input', calculate);
    rateInput.removeEventListener('input', calculate);
    timeInput.removeEventListener('input', calculate);
    frequencySelect.removeEventListener('input', calculate);
  };
}
