export const meta = {
  slug: 'power',
  name: 'Power Converter',
  title: 'Power Converter - Calcyx',
  description: 'Convert between various power units: Watts (W), Kilowatts (kW), Megawatts (MW), Horsepower (hp), BTU/hour, and Calories/second.',
  category: 'conversion',
  icon: '🔌',
  keywords: ['power converter', 'watts to horsepower', 'kilowatts', 'mechanical power', 'megawatts', 'btu/hour', 'calories/second'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['energy', 'appliance-energy']
};

const units = [
  { id: 'w', name: 'Watt (W)', toW: 1 },
  { id: 'kw', name: 'Kilowatt (kW)', toW: 1000 },
  { id: 'mw', name: 'Megawatt (MW)', toW: 1000000 },
  { id: 'hp', name: 'Horsepower (hp)', toW: 745.699871582 },
  { id: 'btuh', name: 'BTU/hour', toW: 0.293071070172 },
  { id: 'cals', name: 'Calorie/second (cal/s)', toW: 4.184 }
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
        <p>Each power unit is defined relative to the Watt (W), the standard SI unit of power. The calculator converts the input value to Watts, and then divides it by the target unit's conversion factor. One horsepower is approximately 745.7 Watts, and one calorie per second is exactly 4.184 Watts.</p>
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

  // Default to kW → HP
  fromSelect.value = 'kw';
  toSelect.value = 'hp';

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

    const inW = val * fromUnit.toW;
    const converted = inW / toUnit.toW;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inW / u.toW;
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
