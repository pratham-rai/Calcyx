export const meta = {
  slug: 'simple-interest',
  name: 'Simple Interest Calculator',
  title: 'Simple Interest Calculator - Calcyx',
  description: 'Calculate simple interest and total maturity amount on your savings or loan.',
  category: 'finance',
  icon: '💰',
  keywords: ['simple interest', 'interest', 'savings', 'loan', 'flat rate'],
  formula: 'SI = \\frac{P \\times R \\times T}{100}',
  relatedSlugs: ['compound-interest', 'emi']
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
          <label for="si-principal">Principal Amount (₹)</label>
          <input type="number" id="si-principal" class="calc-input" placeholder="e.g. 50000" min="0" step="1000">
        </div>

        <div class="calc-input-group">
          <label for="si-rate">Annual Interest Rate (%)</label>
          <input type="number" id="si-rate" class="calc-input" placeholder="e.g. 6" min="0" max="100" step="0.1">
        </div>

        <div class="calc-input-group">
          <label for="si-time">Time Period (years)</label>
          <input type="number" id="si-time" class="calc-input" placeholder="e.g. 3" min="0" step="0.5">
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Interest Earned</span>
            <span class="calc-result-value" id="si-interest"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Amount</span>
            <span class="calc-result-value" id="si-total"></span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Formula</h3>
        <code>SI = P × R × T / 100</code>
        <p>Where <strong>P</strong> = principal, <strong>R</strong> = annual interest rate (%), and <strong>T</strong> = time in years. The total amount is <strong>A = P + SI</strong>.</p>
        <p>Simple interest is calculated only on the original principal, unlike compound interest which earns interest on accumulated interest.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const principalInput = document.getElementById('si-principal');
  const rateInput = document.getElementById('si-rate');
  const timeInput = document.getElementById('si-time');

  function calculate() {
    const P = parseFloat(principalInput.value);
    const R = parseFloat(rateInput.value);
    const T = parseFloat(timeInput.value);

    const resultDiv = document.getElementById('result');

    if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || R < 0 || T <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const interest = (P * R * T) / 100;
    const total = P + interest;

    document.getElementById('si-interest').textContent = '₹' + interest.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    document.getElementById('si-total').textContent = '₹' + total.toLocaleString('en-IN', { maximumFractionDigits: 0 });

    resultDiv.style.display = '';
  }

  principalInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);
  timeInput.addEventListener('input', calculate);

  return function cleanup() {
    principalInput.removeEventListener('input', calculate);
    rateInput.removeEventListener('input', calculate);
    timeInput.removeEventListener('input', calculate);
  };
}
