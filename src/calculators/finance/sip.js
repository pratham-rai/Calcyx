export const meta = {
  slug: 'sip',
  name: 'SIP / Investment Calculator',
  title: 'SIP / Investment Calculator - Calcyx',
  description: 'Calculate the future value of your Systematic Investment Plan (SIP) with monthly contributions and compounding returns.',
  category: 'finance',
  icon: '📊',
  keywords: ['sip', 'systematic investment', 'mutual fund', 'monthly investment', 'future value', 'returns'],
  formula: 'FV = P \\times \\frac{(1+r)^n - 1}{r} \\times (1+r)',
  relatedSlugs: ['compound-interest', 'emi', 'simple-interest']
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
          <label for="sip-amount">Monthly Investment (₹)</label>
          <input type="number" id="sip-amount" class="calc-input" placeholder="e.g. 5000" min="0" step="500">
        </div>

        <div class="calc-input-group">
          <label for="sip-rate">Expected Annual Return (%)</label>
          <input type="number" id="sip-rate" class="calc-input" placeholder="e.g. 12" min="0" max="100" step="0.5">
        </div>

        <div class="calc-input-group">
          <label for="sip-years">Investment Period (years)</label>
          <input type="number" id="sip-years" class="calc-input" placeholder="e.g. 10" min="1" step="1">
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Invested Amount</span>
            <span class="calc-result-value" id="sip-invested"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Estimated Returns</span>
            <span class="calc-result-value" id="sip-returns"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Value</span>
            <span class="calc-result-value" id="sip-total"></span>
          </div>
        </div>
        <div class="calc-result-detail" id="sip-growth" style="text-align:center;margin-top:8px"></div>
      </div>

      <div class="calc-formula">
        <h3>📐 Formula</h3>
        <code>FV = P × [(1 + r)^n − 1] / r × (1 + r)</code>
        <p>Where <strong>P</strong> = monthly investment, <strong>r</strong> = monthly rate of return (annual rate ÷ 12 ÷ 100), and <strong>n</strong> = total number of months.</p>
        <p>This formula assumes each instalment is invested at the beginning of the month and earns compound returns for the remaining period.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const amountInput = document.getElementById('sip-amount');
  const rateInput = document.getElementById('sip-rate');
  const yearsInput = document.getElementById('sip-years');

  function calculate() {
    const P = parseFloat(amountInput.value);
    const annualRate = parseFloat(rateInput.value);
    const years = parseFloat(yearsInput.value);

    const resultDiv = document.getElementById('result');

    if (isNaN(P) || isNaN(annualRate) || isNaN(years) || P <= 0 || annualRate < 0 || years <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const n = years * 12;
    const r = annualRate / 12 / 100;
    const invested = P * n;

    let futureValue;
    if (r === 0) {
      futureValue = invested;
    } else {
      futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    }

    const returns = futureValue - invested;
    const growthMultiple = (futureValue / invested).toFixed(2);

    document.getElementById('sip-invested').textContent = '₹' + invested.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('sip-returns').textContent = '₹' + returns.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('sip-total').textContent = '₹' + futureValue.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('sip-growth').textContent = 'Your money grew ' + growthMultiple + '× over ' + years + ' year' + (years !== 1 ? 's' : '');

    resultDiv.style.display = '';
  }

  amountInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);
  yearsInput.addEventListener('input', calculate);

  return function cleanup() {
    amountInput.removeEventListener('input', calculate);
    rateInput.removeEventListener('input', calculate);
    yearsInput.removeEventListener('input', calculate);
  };
}
