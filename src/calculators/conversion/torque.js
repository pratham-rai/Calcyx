export const meta = {
  slug: 'torque',
  name: 'Torque Converter',
  title: 'Torque Converter - Calcyx',
  description: 'Convert between different torque units: Newton-meters (N·m), Pound-feet (lb·ft), Pound-inches (lb·in), Kilogram-meters (kg·m), and Dyne-centimeters (dyn·cm).',
  category: 'conversion',
  icon: '🔧',
  keywords: ['torque', 'torque converter', 'newton meter', 'pound foot', 'pound inch', 'kilogram meter', 'dyne centimeter', 'nm to lb-ft'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['force', 'length']
};

const units = [
  { id: 'nm', name: 'Newton-meter (N·m)', toNm: 1 },
  { id: 'lbft', name: 'Pound-foot (lb·ft)', toNm: 1.3558179483 },
  { id: 'lbin', name: 'Pound-inch (lb·in)', toNm: 0.112984829 },
  { id: 'kgm', name: 'Kilogram-meter (kg·m)', toNm: 9.80665 },
  { id: 'dyncm', name: 'Dyne-centimeter (dyn·cm)', toNm: 1e-7 }
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
          <input type="number" id="value" class="calc-input" placeholder="Enter value" step="any" value="10">
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
        <p>Each unit is defined by its conversion factor to Newton-meters (N·m). To convert, the value is first converted to Newton-meters, then from Newton-meters to the target unit. One dyne-centimeter is equal to 10<sup>-7</sup> Newton-meters.</p>
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

  // Default to N·m → lb·ft
  fromSelect.value = 'nm';
  toSelect.value = 'lbft';

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

    const inNm = val * fromUnit.toNm;
    const converted = inNm / toUnit.toNm;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inNm / u.toNm;
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
