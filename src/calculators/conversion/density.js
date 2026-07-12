export const meta = {
  slug: 'density',
  name: 'Density Converter',
  title: 'Density Converter - Calcyx',
  description: 'Convert between various density units including grams per cubic centimeter (g/cm³), kilograms per cubic meter (kg/m³), pounds per cubic foot (lb/ft³), pounds per cubic inch (lb/in³), and ounces per gallon (US).',
  category: 'conversion',
  icon: '🧱',
  keywords: ['density', 'density converter', 'kilograms per cubic meter', 'grams per cubic centimeter', 'pounds per cubic foot', 'pounds per cubic inch', 'ounces per gallon'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['cooking', 'weight']
};

const units = [
  { id: 'gcm3', name: 'Grams per Cubic Centimeter (g/cm³)', toBase: 1000 },
  { id: 'kgm3', name: 'Kilograms per Cubic Meter (kg/m³)', toBase: 1 },
  { id: 'lbft3', name: 'Pounds per Cubic Foot (lb/ft³)', toBase: 16.01846337396 },
  { id: 'lbin3', name: 'Pounds per Cubic Inch (lb/in³)', toBase: 27679.904710203 },
  { id: 'ozgal', name: 'Ounces per Gallon (US)', toBase: 7.48915170729 }
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
        <p>Each unit is defined by its conversion factor to kilograms per cubic meter (kg/m³). To convert, the value is first converted to kilograms per cubic meter, then to the target unit.</p>
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

  // Default to g/cm³ → kg/m³
  fromSelect.value = 'gcm3';
  toSelect.value = 'kgm3';

  function formatNum(n) {
    if (Math.abs(n) >= 0.000001 && Math.abs(n) < 1e12) {
      return parseFloat(n.toPrecision(10)).toLocaleString(undefined, { maximumFractionDigits: 6 });
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

    const inBase = val * fromUnit.toBase;
    const converted = inBase / toUnit.toBase;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inBase / u.toBase;
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
