export const meta = {
  slug: 'flow-rate',
  name: 'Flow Rate Converter',
  title: 'Flow Rate Converter - Calcyx',
  description: 'Convert between different flow rate units: Liters/minute (L/min), Liters/second (L/s), Cubic meters/hour (m³/h), Gallons/minute (US gpm), and Cubic feet/minute (cfm).',
  category: 'conversion',
  icon: '🚰',
  keywords: ['flow rate', 'flow rate converter', 'liters per minute', 'liters per second', 'cubic meters per hour', 'gallons per minute', 'cubic feet per minute', 'cfm', 'gpm'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['volume', 'speed']
};

const units = [
  { id: 'lmin', name: 'Liters/minute (L/min)', toLmin: 1 },
  { id: 'ls', name: 'Liters/second (L/s)', toLmin: 60 },
  { id: 'm3h', name: 'Cubic meters/hour (m³/h)', toLmin: 16.6666666667 },
  { id: 'gpm', name: 'Gallons/minute (US gpm)', toLmin: 3.785411784 },
  { id: 'cfm', name: 'Cubic feet/minute (cfm)', toLmin: 28.316846592 }
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
        <p>Each unit is defined by its conversion factor to Liters per minute (L/min). To convert, the value is first converted to Liters per minute, then from Liters per minute to the target unit.</p>
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

  // Default to L/min → US gpm
  fromSelect.value = 'lmin';
  toSelect.value = 'gpm';

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

    const inLmin = val * fromUnit.toLmin;
    const converted = inLmin / toUnit.toLmin;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inLmin / u.toLmin;
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
