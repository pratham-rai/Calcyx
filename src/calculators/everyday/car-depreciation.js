export const meta = {
  slug: 'car-depreciation',
  name: 'Car Depreciation Calculator',
  title: 'Car Depreciation Calculator - Calcyx',
  description: 'Calculate the depreciation of a vehicle over time, showing annual value loss and remaining worth.',
  category: 'everyday',
  icon: '📉',
  keywords: ['car depreciation', 'vehicle value', 'resale value', 'car value calculator', 'depreciation projection'],
  formula: 'Value = Purchase Price × (1 - Depreciation Rate)ⁿ',
  relatedSlugs: ['auto-loan', 'inflation']
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
          <label for="purchase-price">Purchase Price ($)</label>
          <input type="number" id="purchase-price" class="calc-input" placeholder="e.g. 30000" min="0" step="500" required>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="vehicle-age">Vehicle Age (Years)</label>
            <input type="number" id="vehicle-age" class="calc-input" placeholder="e.g. 5" min="1" max="25" step="1" required>
          </div>
          <div class="calc-input-group">
            <label for="depreciation-rate">Annual Depreciation Rate (%)</label>
            <input type="number" id="depreciation-rate" class="calc-input" placeholder="e.g. 15" value="15" min="0" max="100" step="0.1">
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="final-value"></div>
          <div class="calc-result-label">Projected Resale Value</div>
          <div class="calc-result-grid" id="details-grid"></div>
          
          <div style="margin-top: 25px; overflow-x: auto;">
            <h3 style="margin-bottom: 12px; font-size: 1.1rem; opacity: 0.9;">Depreciation Schedule</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; min-width: 320px;">
              <thead>
                <tr style="border-bottom: 2px solid rgba(255, 255, 255, 0.15); text-align: left; opacity: 0.8;">
                  <th style="padding: 10px 8px;">Year</th>
                  <th style="padding: 10px 8px; text-align: right;">Depreciation Loss</th>
                  <th style="padding: 10px 8px; text-align: right;">Remaining Value</th>
                </tr>
              </thead>
              <tbody id="projection-table-body">
                <!-- Rows injected dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Remaining Value = Purchase Price × (1 - Rate)ⁿ</code>
        <code>Total Depreciation Loss = Purchase Price - Remaining Value</code>
        <code>Depreciation Loss (%) = (Total Loss ÷ Purchase Price) × 100</code>
        <p>Cars experience their highest depreciation during the first year (often 15-20%), and continue to decline in value at a steady rate thereafter. Enter your purchase price, the number of years, and the average expected annual depreciation rate (defaults to 15%) to view a detailed annual breakdown.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const priceInput = document.getElementById('purchase-price');
  const ageInput = document.getElementById('vehicle-age');
  const rateInput = document.getElementById('depreciation-rate');
  
  const resultDiv = document.getElementById('result');
  const finalValueEl = document.getElementById('final-value');
  const detailsGrid = document.getElementById('details-grid');
  const tableBody = document.getElementById('projection-table-body');

  function calculate() {
    const price = parseFloat(priceInput.value);
    const age = parseInt(ageInput.value, 10);
    const rate = parseFloat(rateInput.value);

    if (isNaN(price) || price <= 0 || isNaN(age) || age < 1 || isNaN(rate) || rate < 0 || rate > 100) {
      resultDiv.style.display = 'none';
      return;
    }

    const r = rate / 100;
    const finalValue = price * Math.pow(1 - r, age);
    const totalLoss = price - finalValue;
    const totalLossPct = (totalLoss / price) * 100;

    finalValueEl.textContent = `$${finalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    detailsGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">$${totalLoss.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
        <div class="calc-result-label">Total Depreciation Loss</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${totalLossPct.toFixed(1)}%</div>
        <div class="calc-result-label">Value Lost (%)</div>
      </div>
    `;

    // Render table rows
    let tableHtml = '';
    
    // Year 0 row
    tableHtml += `
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
        <td style="padding: 10px 8px; opacity: 0.7;">Initial</td>
        <td style="padding: 10px 8px; text-align: right; opacity: 0.7;">$0 (0%)</td>
        <td style="padding: 10px 8px; text-align: right; font-weight: 500;">$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
      </tr>
    `;

    for (let y = 1; y <= age; y++) {
      const yearValue = price * Math.pow(1 - r, y);
      const yearLoss = price - yearValue;
      const yearLossPct = (yearLoss / price) * 100;

      tableHtml += `
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
          <td style="padding: 10px 8px;">Year ${y}</td>
          <td style="padding: 10px 8px; text-align: right; color: rgba(239, 68, 68, 0.85);">$${yearLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${yearLossPct.toFixed(1)}%)</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 500;">$${yearValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
        </tr>
      `;
    }

    tableBody.innerHTML = tableHtml;
    resultDiv.style.display = '';
  }

  priceInput.addEventListener('input', calculate);
  ageInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);

  calculate();

  return () => {
    priceInput.removeEventListener('input', calculate);
    ageInput.removeEventListener('input', calculate);
    rateInput.removeEventListener('input', calculate);
  };
}
