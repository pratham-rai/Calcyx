export const meta = {
  slug: 'energy',
  name: 'Energy / Work Converter',
  title: 'Energy Converter - Calcyx',
  description: 'Convert between energy units: Joules (J), Kilojoules (kJ), Calories (cal), Kilocalories (kcal), Watt-hours (Wh), Kilowatt-hours (kWh), BTU, and Electronvolts (eV).',
  category: 'conversion',
  icon: '⚡',
  keywords: ['energy converter', 'joules to calories', 'kilowatt hours', 'btu', 'kilojoules', 'calories', 'watt hours', 'electronvolts'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['power', 'appliance-energy']
};

const units = [
  { id: 'j', name: 'Joule (J)', toJ: 1 },
  { id: 'kj', name: 'Kilojoule (kJ)', toJ: 1000 },
  { id: 'cal', name: 'Calorie (cal)', toJ: 4.184 },
  { id: 'kcal', name: 'Kilocalorie (kcal)', toJ: 4184 },
  { id: 'wh', name: 'Watt-hour (Wh)', toJ: 3600 },
  { id: 'kwh', name: 'Kilowatt-hour (kWh)', toJ: 3600000 },
  { id: 'btu', name: 'British Thermal Unit (BTU)', toJ: 1055.05585262 },
  { id: 'ev', name: 'Electronvolt (eV)', toJ: 1.602176634e-19 }
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
        <p>Each energy unit is defined by its conversion factor to the Joule (J), the standard SI unit of energy/work. The calculator converts the source value to Joules, then divides by the target unit's conversion factor.</p>
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

  // Default to kWh → BTU
  fromSelect.value = 'kwh';
  toSelect.value = 'btu';

  function formatNum(n) {
    if (n === 0) return '0';
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

    const inJ = val * fromUnit.toJ;
    const converted = inJ / toUnit.toJ;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inJ / u.toJ;
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
  const listener = () => calculate();
  inputs.forEach(input => input.addEventListener('input', listener));

  calculate();

  return () => {
    inputs.forEach(input => input.removeEventListener('input', listener));
  };
}
