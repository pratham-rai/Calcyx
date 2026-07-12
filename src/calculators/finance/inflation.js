export const meta = {
  slug: 'inflation',
  name: 'Inflation Calculator',
  title: 'Inflation & Purchasing Power - Calcyx',
  description: 'Calculate the future nominal cost of goods and the purchasing power of cash adjusted for inflation.',
  category: 'finance',
  icon: '🎈',
  keywords: ['inflation', 'purchasing power', 'future value', 'cpi', 'cash value', 'real value'],
  formula: 'Future\\ Cost = A(1+r)^t \\quad | \\quad Purchasing\\ Power = \\frac{A}{(1+r)^t}',
  relatedSlugs: ['compound-interest', 'salary']
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
            <label for="inflation-amount">Initial Amount ($)</label>
            <input type="number" id="inflation-amount" class="calc-input" placeholder="e.g. 1000" min="0" step="50">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="inflation-rate">Avg. Annual Inflation Rate (%)</label>
            <input type="number" id="inflation-rate" class="calc-input" placeholder="e.g. 3.2" min="-10" max="100" step="0.1">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="inflation-years">Time Period (Years)</label>
            <input type="number" id="inflation-years" class="calc-input" placeholder="e.g. 10" min="1" step="1">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item" style="grid-column: span 2;">
            <span class="calc-result-label">Future Cost of Same Goods (Nominal)</span>
            <span class="calc-result-value" id="inflation-future-cost"></span>
            <span class="calc-result-detail">What costs <span id="inflation-ref-amt1"></span> today will cost this much.</span>
          </div>
          <div class="calc-result-item" style="grid-column: span 2;">
            <span class="calc-result-label">Purchasing Power of Cash (Real Value)</span>
            <span class="calc-result-value" id="inflation-buying-power"></span>
            <span class="calc-result-detail">What <span id="inflation-ref-amt2"></span> cash today will buy in the future.</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Cumulative Inflation</span>
            <span class="calc-result-detail" id="inflation-cumulative"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Value Lost</span>
            <span class="calc-result-detail" id="inflation-lost"></span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Inflation Formulas</h3>
        <p><strong>1. Future Cost (Nominal price increase):</strong></p>
        <code>Future Cost = Amount &times; (1 + r)^t</code>
        <p style="margin-top: 5px;">Calculates the price tag of today's goods in the future.</p>
        
        <p style="margin-top: 15px;"><strong>2. Future Purchasing Power (Depreciation of cash value):</strong></p>
        <code>Purchasing Power = Amount / (1 + r)^t</code>
        <p style="margin-top: 5px;">Calculates the relative purchasing power of a fixed cash sum in the future.</p>
        <p style="margin-top: 10px;">Where <strong>r</strong> = annual inflation rate % &divide; 100, and <strong>t</strong> = years.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const amountInput = document.getElementById('inflation-amount');
  const rateInput = document.getElementById('inflation-rate');
  const yearsInput = document.getElementById('inflation-years');

  const resultDiv = document.getElementById('result');

  function calculate() {
    const amount = parseFloat(amountInput.value);
    const rate = parseFloat(rateInput.value);
    const years = parseFloat(yearsInput.value);

    if (isNaN(amount) || amount < 0 || isNaN(rate) || rate < -100 || isNaN(years) || years <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const r = rate / 100;
    const factor = Math.pow(1 + r, years);

    const futureCost = amount * factor;
    const purchasingPower = amount / factor;
    const cumulativePct = (factor - 1) * 100;
    const lostValue = amount - purchasingPower;

    const formattedRef = '$' + amount.toLocaleString('en-US');

    document.getElementById('inflation-ref-amt1').textContent = formattedRef;
    document.getElementById('inflation-ref-amt2').textContent = formattedRef;

    document.getElementById('inflation-future-cost').textContent = '$' + futureCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('inflation-buying-power').textContent = '$' + purchasingPower.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('inflation-cumulative').textContent = cumulativePct.toFixed(1) + '%';
    document.getElementById('inflation-lost').textContent = '$' + lostValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
