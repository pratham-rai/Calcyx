export const meta = {
  slug: 'savings-goal',
  name: 'Savings Goal Planner',
  title: 'Savings Goal Planner - Calcyx',
  description: 'Determine the required monthly savings to reach a target goal, taking into account current savings and interest compounding.',
  category: 'finance',
  icon: '🎯',
  keywords: ['savings goal', 'savings planner', 'compound interest', 'target savings', 'financial planning', 'sip'],
  formula: 'D = \\frac{r \\cdot [G - S_0(1+r)^n]}{(1+r)^n - 1}',
  relatedSlugs: ['compound-interest', 'sip']
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
        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="sg-target">Target Savings Goal ($)</label>
            <input type="number" id="sg-target" class="calc-input" placeholder="e.g. 50000" min="1" step="1000">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="sg-current">Current Savings ($)</label>
            <input type="number" id="sg-current" class="calc-input" placeholder="e.g. 5000" min="0" step="500">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 2;">
            <label for="sg-time">Time Period</label>
            <input type="number" id="sg-time" class="calc-input" placeholder="e.g. 5" min="0.1" step="0.5">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="sg-time-unit">Unit</label>
            <select id="sg-time-unit" class="calc-select">
              <option value="years" selected>Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>

        <div class="calc-input-group">
          <label for="sg-rate">Annual Interest Rate (%)</label>
          <input type="number" id="sg-rate" class="calc-input" placeholder="e.g. 6" min="0" max="100" step="0.1">
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <div class="calc-result-item" style="grid-column: span 2;">
            <span class="calc-result-label">Required Monthly Deposit</span>
            <span class="calc-result-value" id="sg-deposit-val"></span>
            <span class="calc-result-detail" id="sg-deposit-detail">Regular savings needed to reach your goal</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Principal Saved</span>
            <span class="calc-result-value" id="sg-principal-val"></span>
            <span class="calc-result-detail">Initial savings + monthly deposits</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Interest Earned</span>
            <span class="calc-result-value" id="sg-interest-val"></span>
            <span class="calc-result-detail">Interest accumulated over time</span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Savings Goal Formula</h3>
        <p>The monthly deposit <strong>D</strong> required to reach the target <strong>G</strong> is computed as:</p>
        <code>D = [r * (G - S₀ * (1 + r)^n)] / [(1 + r)^n - 1]</code>
        <p style="margin-top: 10px;">Where:</p>
        <ul style="padding-left: 20px; margin-top: 5px;">
          <li><strong>G</strong> = Target savings goal</li>
          <li><strong>S₀</strong> = Current savings</li>
          <li><strong>r</strong> = Monthly interest rate (Annual Interest Rate / 12 / 100)</li>
          <li><strong>n</strong> = Total number of months (Years &times; 12 or Months)</li>
        </ul>
        <p style="margin-top: 10px;">If the interest rate is 0%, the formula simplifies to:</p>
        <code>D = (G - S₀) / n</code>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const targetInput = document.getElementById('sg-target');
  const currentInput = document.getElementById('sg-current');
  const timeInput = document.getElementById('sg-time');
  const unitSelect = document.getElementById('sg-time-unit');
  const rateInput = document.getElementById('sg-rate');
  const resultDiv = document.getElementById('result');

  const depositVal = document.getElementById('sg-deposit-val');
  const depositDetail = document.getElementById('sg-deposit-detail');
  const principalVal = document.getElementById('sg-principal-val');
  const interestVal = document.getElementById('sg-interest-val');

  function calculate() {
    const G = parseFloat(targetInput.value);
    const S0 = parseFloat(currentInput.value) || 0;
    const timeVal = parseFloat(timeInput.value);
    const unit = unitSelect.value;
    const rateVal = parseFloat(rateInput.value) || 0;

    if (isNaN(G) || G <= 0 || isNaN(timeVal) || timeVal <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const n = unit === 'years' ? timeVal * 12 : timeVal;
    const r = rateVal / 12 / 100;

    let monthlyDeposit = 0;
    let totalPrincipal = 0;
    let totalInterest = 0;

    if (r === 0) {
      if (S0 >= G) {
        monthlyDeposit = 0;
        totalPrincipal = S0;
        totalInterest = 0;
        depositDetail.textContent = 'Current savings already meets or exceeds your goal!';
      } else {
        monthlyDeposit = (G - S0) / n;
        totalPrincipal = G;
        totalInterest = 0;
        depositDetail.textContent = 'Regular savings needed to reach your goal';
      }
    } else {
      const fvCurrent = S0 * Math.pow(1 + r, n);
      if (fvCurrent >= G) {
        monthlyDeposit = 0;
        totalPrincipal = S0;
        // The current savings will grow to fvCurrent, so interest earned is fvCurrent - S0
        totalInterest = fvCurrent - S0;
        depositDetail.textContent = 'Current savings alone will grow to meet or exceed your goal!';
      } else {
        monthlyDeposit = (r * (G - fvCurrent)) / (Math.pow(1 + r, n) - 1);
        const totalDeposits = monthlyDeposit * n;
        totalPrincipal = S0 + totalDeposits;
        totalInterest = G - totalPrincipal;
        depositDetail.textContent = 'Regular savings needed to reach your goal';
      }
    }

    depositVal.textContent = '$' + monthlyDeposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    principalVal.textContent = '$' + totalPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    interestVal.textContent = '$' + totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resultDiv.style.display = '';
  }

  targetInput.addEventListener('input', calculate);
  currentInput.addEventListener('input', calculate);
  timeInput.addEventListener('input', calculate);
  unitSelect.addEventListener('change', calculate);
  rateInput.addEventListener('input', calculate);

  return function cleanup() {
    targetInput.removeEventListener('input', calculate);
    currentInput.removeEventListener('input', calculate);
    timeInput.removeEventListener('input', calculate);
    unitSelect.removeEventListener('change', calculate);
    rateInput.removeEventListener('input', calculate);
  };
}
