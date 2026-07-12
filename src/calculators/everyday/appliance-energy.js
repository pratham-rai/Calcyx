export const meta = {
  slug: 'appliance-energy',
  name: 'Appliance Energy Cost Calculator',
  title: 'Appliance Energy Cost Calculator - Calcyx',
  description: 'Calculate the electricity consumption and cost of running home appliances over daily, monthly, and annual periods.',
  category: 'everyday',
  icon: '⚡',
  keywords: ['electricity cost', 'appliance energy', 'power usage', 'kwh calculator', 'utility bill', 'energy saver'],
  formula: 'Cost = (Wattage × Hours ÷ 1000) × Rate per kWh',
  relatedSlugs: ['solar-payoff', 'unit-price']
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
          <label for="appliance-wattage">Appliance Wattage (W)</label>
          <input type="number" id="appliance-wattage" class="calc-input" placeholder="e.g. 1200" min="0" step="10" required>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="hours-per-day">Hours Used per Day</label>
            <input type="number" id="hours-per-day" class="calc-input" placeholder="e.g. 4" min="0" max="24" step="0.1" required>
          </div>
          <div class="calc-input-group">
            <label for="kwh-rate">Electricity Cost ($ per kWh)</label>
            <input type="number" id="kwh-rate" class="calc-input" placeholder="e.g. 0.16" min="0" step="0.01" required>
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="daily-cost"></div>
          <div class="calc-result-label">Estimated Daily Running Cost</div>
          <div class="calc-result-grid" id="details-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Daily Power (kWh) = (Wattage × Hours) ÷ 1,000</code>
        <code>Daily Cost = Daily Power × Cost per kWh</code>
        <code>Monthly Cost = Daily Cost × 30</code>
        <code>Annual Cost = Daily Cost × 365</code>
        <p>Wattage measures electrical power. Multiplying it by active hours and dividing by 1,000 gives the energy in kilowatt-hours (kWh), which is the standard unit of billing used by electric utility companies.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const wattageInput = document.getElementById('appliance-wattage');
  const hoursInput = document.getElementById('hours-per-day');
  const rateInput = document.getElementById('kwh-rate');
  const resultDiv = document.getElementById('result');
  const dailyCostEl = document.getElementById('daily-cost');
  const detailsGrid = document.getElementById('details-grid');

  function calculate() {
    const wattage = parseFloat(wattageInput.value);
    const hours = parseFloat(hoursInput.value);
    const rate = parseFloat(rateInput.value);

    if (isNaN(wattage) || wattage < 0 || isNaN(hours) || hours < 0 || hours > 24 || isNaN(rate) || rate < 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const dailyKWh = (wattage * hours) / 1000;
    const dailyCost = dailyKWh * rate;
    const monthlyKWh = dailyKWh * 30;
    const monthlyCost = dailyCost * 30;
    const annualKWh = dailyKWh * 365;
    const annualCost = dailyCost * 365;

    dailyCostEl.textContent = `$${dailyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    detailsGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">${dailyKWh.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })} kWh</div>
        <div class="calc-result-label">Daily Power Used</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="calc-result-label">Monthly Cost (30 days)</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${monthlyKWh.toLocaleString(undefined, { maximumFractionDigits: 1 })} kWh</div>
        <div class="calc-result-label">Monthly Power Used</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${annualCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="calc-result-label">Annual Cost (365 days)</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${annualKWh.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh</div>
        <div class="calc-result-label">Annual Power Used</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  wattageInput.addEventListener('input', calculate);
  hoursInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);

  calculate();

  return () => {
    wattageInput.removeEventListener('input', calculate);
    hoursInput.removeEventListener('input', calculate);
    rateInput.removeEventListener('input', calculate);
  };
}
