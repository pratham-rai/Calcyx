export const meta = {
  slug: 'fuel-cost',
  name: 'Fuel Cost Calculator',
  title: 'Fuel Cost Calculator - Calcyx',
  description: 'Calculate trip fuel costs based on distance, fuel efficiency, and fuel price. Supports both metric (km/L) and imperial (MPG) units.',
  category: 'everyday',
  icon: '⛽',
  keywords: ['fuel', 'gas', 'petrol', 'cost', 'trip', 'mileage', 'mpg', 'fuel economy', 'driving cost'],
  formula: 'Total Cost = (Distance ÷ Fuel Efficiency) × Price per Unit',
  relatedSlugs: ['unit-price', 'speed']
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
          <label for="unit-system">Unit System</label>
          <select id="unit-system" class="calc-select">
            <option value="metric">Metric (km, Liters)</option>
            <option value="imperial">Imperial (miles, Gallons)</option>
          </select>
        </div>
        <div class="calc-input-group">
          <label for="distance" id="distance-label">Distance (km)</label>
          <input type="number" id="distance" class="calc-input" placeholder="e.g. 500" step="any" min="0">
        </div>
        <div class="calc-input-group">
          <label for="efficiency" id="efficiency-label">Fuel Efficiency (km/L)</label>
          <input type="number" id="efficiency" class="calc-input" placeholder="e.g. 12" step="any" min="0">
        </div>
        <div class="calc-input-group">
          <label for="fuel-price" id="price-label">Fuel Price per Liter</label>
          <input type="number" id="fuel-price" class="calc-input" placeholder="e.g. 1.50" step="any" min="0">
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="total-cost"></div>
          <div class="calc-result-label">Total Trip Cost</div>
          <div class="calc-result-grid" id="details-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Fuel Needed = Distance ÷ Fuel Efficiency</code>
        <code>Total Cost = Fuel Needed × Price per Unit</code>
        <code>Cost per km = Total Cost ÷ Distance</code>
        <p>Enter your trip distance, your vehicle's fuel efficiency, and the current fuel price to see the total fuel you'll need and what it will cost. Works with both metric (km/L) and imperial (MPG) units.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const unitSystem = document.getElementById('unit-system');
  const distanceInput = document.getElementById('distance');
  const efficiencyInput = document.getElementById('efficiency');
  const fuelPriceInput = document.getElementById('fuel-price');
  const distanceLabel = document.getElementById('distance-label');
  const efficiencyLabel = document.getElementById('efficiency-label');
  const priceLabel = document.getElementById('price-label');
  const resultDiv = document.getElementById('result');
  const totalCostEl = document.getElementById('total-cost');
  const detailsGrid = document.getElementById('details-grid');

  function updateLabels() {
    const isMetric = unitSystem.value === 'metric';
    distanceLabel.textContent = isMetric ? 'Distance (km)' : 'Distance (miles)';
    efficiencyLabel.textContent = isMetric ? 'Fuel Efficiency (km/L)' : 'Fuel Efficiency (MPG)';
    priceLabel.textContent = isMetric ? 'Fuel Price per Liter' : 'Fuel Price per Gallon';
    distanceInput.placeholder = isMetric ? 'e.g. 500' : 'e.g. 300';
    efficiencyInput.placeholder = isMetric ? 'e.g. 12' : 'e.g. 30';
  }

  function calculate() {
    const distance = parseFloat(distanceInput.value);
    const efficiency = parseFloat(efficiencyInput.value);
    const price = parseFloat(fuelPriceInput.value);

    if (isNaN(distance) || isNaN(efficiency) || isNaN(price) ||
        distance <= 0 || efficiency <= 0 || price <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const isMetric = unitSystem.value === 'metric';
    const distUnit = isMetric ? 'km' : 'mi';
    const volUnit = isMetric ? 'L' : 'gal';

    const fuelNeeded = distance / efficiency;
    const totalCost = fuelNeeded * price;
    const costPerDist = totalCost / distance;

    totalCostEl.textContent = `$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    detailsGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">${fuelNeeded.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${volUnit}</div>
        <div class="calc-result-label">Fuel Needed</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${costPerDist.toFixed(4)}</div>
        <div class="calc-result-label">Cost per ${distUnit}</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${distance.toLocaleString()} ${distUnit}</div>
        <div class="calc-result-label">Trip Distance</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${efficiency} ${isMetric ? 'km/L' : 'MPG'}</div>
        <div class="calc-result-label">Fuel Efficiency</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  function onSystemChange() {
    updateLabels();
    calculate();
  }

  unitSystem.addEventListener('input', onSystemChange);
  distanceInput.addEventListener('input', calculate);
  efficiencyInput.addEventListener('input', calculate);
  fuelPriceInput.addEventListener('input', calculate);

  return () => {
    unitSystem.removeEventListener('input', onSystemChange);
    distanceInput.removeEventListener('input', calculate);
    efficiencyInput.removeEventListener('input', calculate);
    fuelPriceInput.removeEventListener('input', calculate);
  };
}
