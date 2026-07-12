export const meta = {
  slug: 'break-even',
  name: 'Break-Even Analysis',
  title: 'Break-Even Analysis Calculator - Calcyx',
  description: 'Calculate the break-even point in units and revenue, and analyze profit/loss for a custom sales volume.',
  category: 'finance',
  icon: '📊',
  keywords: ['break even', 'margin', 'fixed cost', 'variable cost', 'profit margin', 'profit analysis'],
  formula: 'Break\\-Even\\ Point\\ (Units) = \\frac{Fixed\\ Costs}{Selling\\ Price - Variable\\ Cost}',
  relatedSlugs: ['discount', 'salary']
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
            <label for="bep-fixed-costs">Total Fixed Costs ($)</label>
            <input type="number" id="bep-fixed-costs" class="calc-input" placeholder="e.g. 10000" min="0" step="100">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="bep-var-cost">Variable Cost per Unit ($)</label>
            <input type="number" id="bep-var-cost" class="calc-input" placeholder="e.g. 15" min="0" step="0.01">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="bep-price">Selling Price per Unit ($)</label>
            <input type="number" id="bep-price" class="calc-input" placeholder="e.g. 25" min="0" step="0.01">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="bep-custom-volume">Custom Sales Volume (Units - Optional)</label>
            <input type="number" id="bep-custom-volume" class="calc-input" placeholder="e.g. 1500" min="0" step="1">
          </div>
        </div>

        <div id="bep-error" style="display:none; color: #ef4444; margin-top: 15px; font-weight: 500; font-size: 0.9rem; text-align: center;">
          ⚠️ Selling price must be greater than variable cost per unit.
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Break-Even Units</span>
            <span class="calc-result-value" id="bep-units-val"></span>
            <span class="calc-result-detail">Units to sell to cover costs</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Break-Even Revenue</span>
            <span class="calc-result-value" id="bep-rev-val"></span>
            <span class="calc-result-detail">Revenue at break-even point</span>
          </div>

          <div id="bep-custom-container" class="calc-result-item" style="grid-column: span 2; display: none;">
            <span class="calc-result-label">Profit / Loss (at <span id="bep-ref-volume"></span> units)</span>
            <span class="calc-result-value" id="bep-custom-profit-val"></span>
            <div style="margin-top: 5px; font-size: 0.85rem; opacity: 0.85; display: flex; justify-content: space-around;">
              <span>Revenue: <strong id="bep-custom-rev"></strong></span>
              <span>Total Cost: <strong id="bep-custom-cost"></strong></span>
            </div>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Break-Even Formula</h3>
        <code>Break-Even Point (Units) = Fixed Costs / (Price per Unit &minus; Variable Cost per Unit)</code>
        <p style="margin-top: 10px;">Where:</p>
        <ul style="padding-left: 20px; margin-top: 5px;">
          <li><strong>Fixed Costs</strong> are costs that remain the same regardless of production volume (rent, salaries, insurance).</li>
          <li><strong>Variable Costs</strong> are costs that vary directly with the level of output (materials, labor per unit).</li>
          <li><strong>Contribution Margin</strong> (Price &minus; Variable Cost) is the amount each unit sold contributes towards covering fixed costs.</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const fixedCostsInput = document.getElementById('bep-fixed-costs');
  const varCostInput = document.getElementById('bep-var-cost');
  const priceInput = document.getElementById('bep-price');
  const customVolumeInput = document.getElementById('bep-custom-volume');

  const resultDiv = document.getElementById('result');
  const errorDiv = document.getElementById('bep-error');
  const customContainer = document.getElementById('bep-custom-container');

  function calculate() {
    const fixedCosts = parseFloat(fixedCostsInput.value);
    const varCost = parseFloat(varCostInput.value);
    const price = parseFloat(priceInput.value);
    const customVolume = parseFloat(customVolumeInput.value);

    // Hide custom container by default
    customContainer.style.display = 'none';

    if (isNaN(fixedCosts) || fixedCosts < 0 || isNaN(varCost) || varCost < 0 || isNaN(price) || price < 0) {
      resultDiv.style.display = 'none';
      errorDiv.style.display = 'none';
      return;
    }

    if (price <= varCost) {
      resultDiv.style.display = 'none';
      errorDiv.style.display = '';
      return;
    }

    errorDiv.style.display = 'none';

    const margin = price - varCost;
    const bepUnits = fixedCosts / margin;
    const bepRevenue = bepUnits * price;

    document.getElementById('bep-units-val').textContent = Math.ceil(bepUnits).toLocaleString('en-US') + ' units';
    document.getElementById('bep-rev-val').textContent = '$' + bepRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    if (!isNaN(customVolume) && customVolume >= 0) {
      const customRevenue = customVolume * price;
      const customTotalCost = fixedCosts + (customVolume * varCost);
      const customProfit = customRevenue - customTotalCost;

      const refVolumeSpan = document.getElementById('bep-ref-volume');
      const profitValSpan = document.getElementById('bep-custom-profit-val');
      const customRevSpan = document.getElementById('bep-custom-rev');
      const customCostSpan = document.getElementById('bep-custom-cost');

      refVolumeSpan.textContent = customVolume.toLocaleString('en-US');
      customRevSpan.textContent = '$' + customRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      customCostSpan.textContent = '$' + customTotalCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

      if (customProfit >= 0) {
        profitValSpan.textContent = '+$' + customProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        profitValSpan.style.color = '#10b981'; // Green
      } else {
        profitValSpan.textContent = '-$' + Math.abs(customProfit).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        profitValSpan.style.color = '#ef4444'; // Red
      }

      customContainer.style.display = '';
    }

    resultDiv.style.display = '';
  }

  fixedCostsInput.addEventListener('input', calculate);
  varCostInput.addEventListener('input', calculate);
  priceInput.addEventListener('input', calculate);
  customVolumeInput.addEventListener('input', calculate);

  return function cleanup() {
    fixedCostsInput.removeEventListener('input', calculate);
    varCostInput.removeEventListener('input', calculate);
    priceInput.removeEventListener('input', calculate);
    customVolumeInput.removeEventListener('input', calculate);
  };
}
