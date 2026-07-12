export const meta = {
  slug: 'rule-of-72',
  name: 'Rule of 72 / Doubling Time',
  title: 'Rule of 72 & Doubling Time Calculator - Calcyx',
  description: 'Estimate investment doubling time using the Rule of 72 and exact compounding formulas. Compare results side-by-side.',
  category: 'finance',
  icon: '⏳',
  keywords: ['rule of 72', 'doubling time', 'compound interest', 'investment doubling', 'rule of 69', 'rule of 72 calculator'],
  formula: '\\text{Years} \\approx \\frac{72}{\\text{Rate}}',
  relatedSlugs: ['compound-interest', 'cagr']
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
        <p style="font-size: 0.95rem; color: var(--color-text-secondary); text-align: center; margin-bottom: 10px; line-height: 1.5;">
          Enter either the <strong>Annual Interest Rate</strong> OR the <strong>Target Years to Double</strong>. The calculator will solve the other value instantly and compare the standard rule of 72 estimate with exact compounding math.
        </p>

        <div class="calc-row">
          <div class="calc-input-group">
            <label for="rule-rate">Annual Interest Rate (%)</label>
            <input type="number" id="rule-rate" class="calc-input" placeholder="e.g. 8" min="0.001" step="0.1">
          </div>
          <div class="calc-input-group">
            <label for="rule-years">Target Years to Double</label>
            <input type="number" id="rule-years" class="calc-input" placeholder="e.g. 9" min="0.001" step="0.1">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label" id="label-rule">Rule of 72 Estimate</span>
            <span class="calc-result-value" id="res-rule"></span>
            <span class="calc-result-detail">Simple mental shortcut</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label" id="label-exact">Exact Compounding</span>
            <span class="calc-result-value" id="res-exact"></span>
            <span class="calc-result-detail">Precise logarithmic math</span>
          </div>
        </div>

        <div id="comparison-section" style="margin-top: 20px; text-align: left; font-size: 0.95rem; opacity: 0.95; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p id="comparison-text" style="line-height: var(--leading-relaxed); margin: 0;"></p>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Rule of 72 & Doubling Formulas</h3>
        <p><strong>Rule of 72 (Shortcut):</strong></p>
        <code>Years to Double &approx; 72 / Annual Interest Rate</code>
        <code>Annual Interest Rate &approx; 72 / Years to Double</code>
        <p><strong>Exact Compounding (Logarithmic):</strong></p>
        <code>Years to Double = ln(2) / ln(1 + Rate / 100)</code>
        <code>Annual Interest Rate = (2 ^ (1 / Years) &minus; 1) &times; 100</code>
        <p style="margin-top: 10px;">The <strong>Rule of 72</strong> is a simple, popular shortcut used to estimate the time or rate needed to double an investment. It is highly accurate for rates between 5% and 12%, but starts to diverge at very high interest rates.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const rateInput = document.getElementById('rule-rate');
  const yearsInput = document.getElementById('rule-years');
  
  const resultDiv = document.getElementById('result');
  const labelRule = document.getElementById('label-rule');
  const labelExact = document.getElementById('label-exact');
  const resRule = document.getElementById('res-rule');
  const resExact = document.getElementById('res-exact');
  const comparisonText = document.getElementById('comparison-text');

  let isUpdating = false;

  function calculate(source) {
    if (isUpdating) return;
    isUpdating = true;

    if (source === 'rate') {
      const rate = parseFloat(rateInput.value);
      if (isNaN(rate) || rate <= 0) {
        resultDiv.style.display = 'none';
        yearsInput.value = '';
        isUpdating = false;
        return;
      }

      // Solve for years
      const ruleYears = 72 / rate;
      const exactYears = Math.log(2) / Math.log(1 + rate / 100);

      // Write exact years to target input
      yearsInput.value = exactYears.toFixed(2);

      // Update results
      labelRule.textContent = 'Rule of 72 Estimate';
      labelExact.textContent = 'Exact Doubling Time';
      resRule.textContent = ruleYears.toFixed(2) + ' yrs';
      resExact.textContent = exactYears.toFixed(2) + ' yrs';

      const diff = Math.abs(ruleYears - exactYears);
      comparisonText.innerHTML = `At an interest rate of <strong>${rate.toFixed(2)}%</strong>, your money doubles in approximately <strong>${ruleYears.toFixed(2)} years</strong> using the Rule of 72 shortcut, compared to exactly <strong>${exactYears.toFixed(2)} years</strong> with precise compounding (a difference of <strong>${diff.toFixed(2)} years</strong>).`;

      resultDiv.style.display = '';
    } else if (source === 'years') {
      const years = parseFloat(yearsInput.value);
      if (isNaN(years) || years <= 0) {
        resultDiv.style.display = 'none';
        rateInput.value = '';
        isUpdating = false;
        return;
      }

      // Solve for rate
      const ruleRate = 72 / years;
      const exactRate = (Math.pow(2, 1 / years) - 1) * 100;

      // Write exact rate to target input
      rateInput.value = exactRate.toFixed(2);

      // Update results
      labelRule.textContent = 'Rule of 72 Rate';
      labelExact.textContent = 'Exact Compounding Rate';
      resRule.textContent = ruleRate.toFixed(2) + '%';
      resExact.textContent = exactRate.toFixed(2) + '%';

      const diff = Math.abs(ruleRate - exactRate);
      comparisonText.innerHTML = `To double your money in <strong>${years.toFixed(2)} years</strong>, you need an estimated annual return of <strong>${ruleRate.toFixed(2)}%</strong> using the Rule of 72, compared to an exact return of <strong>${exactRate.toFixed(2)}%</strong> (a difference of <strong>${diff.toFixed(2)} percentage points</strong>).`;

      resultDiv.style.display = '';
    }

    isUpdating = false;
  }

  const onRateInput = () => calculate('rate');
  const onYearsInput = () => calculate('years');

  rateInput.addEventListener('input', onRateInput);
  yearsInput.addEventListener('input', onYearsInput);

  return function cleanup() {
    rateInput.removeEventListener('input', onRateInput);
    yearsInput.removeEventListener('input', onYearsInput);
  };
}
