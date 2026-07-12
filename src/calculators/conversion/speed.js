export const meta = {
  slug: 'speed',
  name: 'Speed Converter',
  title: 'Speed Converter - Calcyx',
  description: 'Convert between speed units: meters per second, km/h, mph, knots, feet per second, and Mach.',
  category: 'conversion',
  icon: '💨',
  keywords: ['speed', 'velocity', 'convert', 'mph', 'kmh', 'knots', 'mach', 'meters per second'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['length', 'weight']
};

const units = [
  { id: 'ms', name: 'Meters/second (m/s)', toMs: 1 },
  { id: 'kmh', name: 'Kilometers/hour (km/h)', toMs: 1 / 3.6 },
  { id: 'mph', name: 'Miles/hour (mph)', toMs: 0.44704 },
  { id: 'kn', name: 'Knots (kn)', toMs: 0.514444 },
  { id: 'fts', name: 'Feet/second (ft/s)', toMs: 0.3048 },
  { id: 'mach', name: 'Mach', toMs: 343 }
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
          <label for="value">Speed</label>
          <input type="number" id="value" class="calc-input" placeholder="Enter speed" step="any" value="100">
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
        <code>Result = Value × (Source m/s Factor ÷ Target m/s Factor)</code>
        <p>All speed units are converted through meters per second (m/s) as the base unit. Mach number uses the speed of sound in dry air at 20°C (343 m/s). 1 knot = 1 nautical mile per hour.</p>
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

  // Default to km/h → mph
  fromSelect.value = 'kmh';
  toSelect.value = 'mph';

  function formatNum(n) {
    if (Math.abs(n) >= 0.001 && Math.abs(n) < 1e12) {
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

    const inMs = val * fromUnit.toMs;
    const converted = inMs / toUnit.toMs;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inMs / u.toMs;
        return `
          <div class="calc-result-item">
            <div class="calc-result-value">${formatNum(result)}</div>
            <div class="calc-result-label">${u.name}</div>
          </div>
        `;
      }).join('');

    resultDiv.style.display = '';
  }

  valueInput.addEventListener('input', calculate);
  fromSelect.addEventListener('input', calculate);
  toSelect.addEventListener('input', calculate);

  calculate();

  return () => {
    valueInput.removeEventListener('input', calculate);
    fromSelect.removeEventListener('input', calculate);
    toSelect.removeEventListener('input', calculate);
  };
}
