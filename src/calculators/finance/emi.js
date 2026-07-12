export const meta = {
  slug: 'emi',
  name: 'EMI / Loan Calculator',
  title: 'EMI / Loan Calculator - Calcyx',
  description: 'Calculate your Equated Monthly Instalment (EMI), total interest payable, and full loan repayment breakdown.',
  category: 'finance',
  icon: '🏦',
  keywords: ['emi', 'loan', 'mortgage', 'instalment', 'repayment', 'home loan', 'car loan'],
  formula: 'EMI = P \\times \\frac{r(1+r)^n}{(1+r)^n - 1}',
  relatedSlugs: ['compound-interest', 'simple-interest', 'sip']
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
          <label for="emi-principal">Loan Amount (₹)</label>
          <input type="number" id="emi-principal" class="calc-input" placeholder="e.g. 1000000" min="0" step="1000">
        </div>

        <div class="calc-input-group">
          <label for="emi-rate">Annual Interest Rate (%)</label>
          <input type="number" id="emi-rate" class="calc-input" placeholder="e.g. 8.5" min="0" max="100" step="0.1">
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex:1">
            <label for="emi-tenure">Loan Tenure</label>
            <input type="number" id="emi-tenure" class="calc-input" placeholder="e.g. 20" min="1" step="1">
          </div>
          <div class="calc-input-group" style="flex:0 0 auto">
            <label for="emi-tenure-unit">Unit</label>
            <select id="emi-tenure-unit" class="calc-select">
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Monthly EMI</span>
            <span class="calc-result-value" id="emi-monthly"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Interest</span>
            <span class="calc-result-value" id="emi-total-interest"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Payment</span>
            <span class="calc-result-value" id="emi-total-payment"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Principal</span>
            <span class="calc-result-detail" id="emi-principal-pct"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Interest</span>
            <span class="calc-result-detail" id="emi-interest-pct"></span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Formula</h3>
        <code>EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)</code>
        <p>Where <strong>P</strong> = principal loan amount, <strong>r</strong> = monthly interest rate (annual rate ÷ 12 ÷ 100), and <strong>n</strong> = total number of monthly instalments.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const principalInput = document.getElementById('emi-principal');
  const rateInput = document.getElementById('emi-rate');
  const tenureInput = document.getElementById('emi-tenure');
  const tenureUnitSelect = document.getElementById('emi-tenure-unit');

  function calculate() {
    const P = parseFloat(principalInput.value);
    const annualRate = parseFloat(rateInput.value);
    const tenureVal = parseFloat(tenureInput.value);
    const unit = tenureUnitSelect.value;

    const resultDiv = document.getElementById('result');

    if (isNaN(P) || isNaN(annualRate) || isNaN(tenureVal) || P <= 0 || annualRate < 0 || tenureVal <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const n = unit === 'years' ? tenureVal * 12 : tenureVal;
    const r = annualRate / 12 / 100;

    let emi, totalPayment, totalInterest;

    if (r === 0) {
      emi = P / n;
      totalPayment = P;
      totalInterest = 0;
    } else {
      const factor = Math.pow(1 + r, n);
      emi = P * r * factor / (factor - 1);
      totalPayment = emi * n;
      totalInterest = totalPayment - P;
    }

    const principalPct = (P / totalPayment * 100).toFixed(1);
    const interestPct = (totalInterest / totalPayment * 100).toFixed(1);

    document.getElementById('emi-monthly').textContent = '₹' + emi.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('emi-total-interest').textContent = '₹' + totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('emi-total-payment').textContent = '₹' + totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('emi-principal-pct').textContent = principalPct + '% of total';
    document.getElementById('emi-interest-pct').textContent = interestPct + '% of total';

    resultDiv.style.display = '';
  }

  principalInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);
  tenureInput.addEventListener('input', calculate);
  tenureUnitSelect.addEventListener('input', calculate);

  return function cleanup() {
    principalInput.removeEventListener('input', calculate);
    rateInput.removeEventListener('input', calculate);
    tenureInput.removeEventListener('input', calculate);
    tenureUnitSelect.removeEventListener('input', calculate);
  };
}
