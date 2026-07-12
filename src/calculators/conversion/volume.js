export const meta = {
  slug: 'volume',
  name: 'Volume Converter',
  title: 'Volume Converter - Calcyx',
  description: 'Convert between metric and imperial volume units: milliliters, liters, cubic meters, US teaspoons, US tablespoons, US fluid ounces, US cups, US pints, US quarts, and US gallons.',
  category: 'conversion',
  icon: '🧪',
  keywords: ['volume', 'convert', 'liters', 'gallons', 'milliliters', 'cups', 'fluid ounces', 'cubic meters'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['length', 'area']
};

const units = [
  { id: 'ml', name: 'Milliliters (ml)', toLiters: 0.001 },
  { id: 'L', name: 'Liters (L)', toLiters: 1 },
  { id: 'cubic_m', name: 'Cubic Meters (m³)', toLiters: 1000 },
  { id: 'tsp', name: 'Teaspoons (US tsp)', toLiters: 0.00492892159375 },
  { id: 'tbsp', name: 'Tablespoons (US tbsp)', toLiters: 0.01478676478125 },
  { id: 'fl_oz', name: 'Fluid Ounces (US fl oz)', toLiters: 0.0295735295625 },
  { id: 'cup', name: 'Cups (US cup)', toLiters: 0.2365882365 },
  { id: 'pint', name: 'Pints (US pt)', toLiters: 0.473176473 },
  { id: 'quart', name: 'Quarts (US qt)', toLiters: 0.946352946 },
  { id: 'gallon', name: 'Gallons (US gal)', toLiters: 3.785411784 }
];

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const options = units.map(u => `<option value="${u.id}">${u.name}</option>`).join('');

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="value">Value</label>
          <input type="number" id="value" class="calc-input" placeholder="Enter value" step="any" value="1">
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="from-unit">From</label>
            <select id="from-unit" class="calc-select">${options}</select>
          </div>
          <div class="calc-input-group">
            <label for="to-unit">To</label>
            <select id="to-unit" class="calc-select">${options}</select>
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="main-result"></div>
          <div class="calc-result-label" id="main-label"></div>
          <div class="calc-result-grid" id="all-conversions"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Result = Value × (Source Factor ÷ Target Factor)</code>
        <p>Each unit is defined by its conversion factor to liters (L). To convert, the value is first converted to liters, then from liters to the target unit.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const valueInput = document.getElementById('value');
  const fromSelect = document.getElementById('from-unit');
  const toSelect = document.getElementById('to-unit');
  const resultDiv = document.getElementById('result');
  const mainResult = document.getElementById('main-result');
  const mainLabel = document.getElementById('main-label');
  const allConversions = document.getElementById('all-conversions');

  // Default to L → US Gallons
  toSelect.value = 'gallon';

  function formatNum(n) {
    if (Math.abs(n) >= 0.000001 && Math.abs(n) < 1e12) {
      return parseFloat(n.toPrecision(10)).toLocaleString(undefined, { maximumFractionDigits: 8 });
    }
    return n.toExponential(4);
  }

  function calculate() {
    const val = parseFloat(valueInput.value);
    if (isNaN(val)) {
      resultDiv.style.display = 'none';
      return;
    }

    const fromUnit = units.find(u => u.id === fromSelect.value);
    const toUnit = units.find(u => u.id === toSelect.value);

    const inLiters = val * fromUnit.toLiters;
    const converted = inLiters / toUnit.toLiters;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inLiters / u.toLiters;
        return `
          <div class="calc-result-item">
            <div class="calc-result-value">${formatNum(result)}</div>
            <div class="calc-result-label">${u.name}</div>
          </div>
        `;
      }).join('');

    resultDiv.style.display = '';
  }

  const inputs = [valueInput, fromSelect, toSelect];
  inputs.forEach(input => input.addEventListener('input', calculate));

  calculate();

  return () => {
    inputs.forEach(input => input.removeEventListener('input', calculate));
  };
}
