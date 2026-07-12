export const meta = {
  slug: 'area',
  name: 'Area Converter',
  title: 'Area Converter - Calcyx',
  description: 'Convert between metric and imperial area units: square millimeters, square centimeters, square meters, square kilometers, square inches, square feet, square yards, acres, hectares, and square miles.',
  category: 'conversion',
  icon: '📐',
  keywords: ['area', 'convert', 'square meters', 'square feet', 'acres', 'hectares', 'square miles', 'land measure'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['length', 'volume']
};

const units = [
  { id: 'sq_mm', name: 'Square Millimeters (sq mm)', toSqMeters: 0.000001 },
  { id: 'sq_cm', name: 'Square Centimeters (sq cm)', toSqMeters: 0.0001 },
  { id: 'sq_m', name: 'Square Meters (sq m)', toSqMeters: 1 },
  { id: 'sq_km', name: 'Square Kilometers (sq km)', toSqMeters: 1000000 },
  { id: 'sq_in', name: 'Square Inches (sq in)', toSqMeters: 0.00064516 },
  { id: 'sq_ft', name: 'Square Feet (sq ft)', toSqMeters: 0.09290304 },
  { id: 'sq_yd', name: 'Square Yards (sq yd)', toSqMeters: 0.83612736 },
  { id: 'acre', name: 'Acres (ac)', toSqMeters: 4046.8564224 },
  { id: 'hectare', name: 'Hectares (ha)', toSqMeters: 10000 },
  { id: 'sq_mi', name: 'Square Miles (sq mi)', toSqMeters: 2589988.110336 }
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
        <p>Each unit is defined by its conversion factor to square meters (sq m). To convert, the value is first converted to square meters, then from square meters to the target unit.</p>
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

  // Default to square meters → square feet
  toSelect.value = 'sq_ft';

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

    const inSqMeters = val * fromUnit.toSqMeters;
    const converted = inSqMeters / toUnit.toSqMeters;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inSqMeters / u.toSqMeters;
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
