export const meta = {
  slug: 'illuminance',
  name: 'Illuminance Converter',
  title: 'Illuminance Converter - Calcyx',
  description: 'Convert illuminance measurements between Lux (lx), Foot-candles (fc), and Phots (ph).',
  category: 'conversion',
  icon: '💡',
  keywords: ['illuminance converter', 'lux to foot-candles', 'light conversion', 'lux levels', 'phot', 'foot-candle', 'illuminance'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['power', 'energy']
};

const units = [
  { id: 'lx', name: 'Lux (lx)', toLx: 1 },
  { id: 'fc', name: 'Foot-candle (fc)', toLx: 10.7639104167 },
  { id: 'ph', name: 'Phot (ph)', toLx: 10000 }
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
          <input type="number" id="value" class="calc-input" placeholder="Enter value" step="any" value="100">
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
        <p>Each unit is defined by its conversion factor to Lux (lx). To convert, the value is first converted to Lux, then from Lux to the target unit. Lux is lumens per square meter, foot-candle is lumens per square foot (~10.764 lx), and phot is lumens per square centimeter (10,000 lx).</p>
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

  // Default to Lux → Foot-candle
  fromSelect.value = 'lx';
  toSelect.value = 'fc';

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

    const inLx = val * fromUnit.toLx;
    const converted = inLx / toUnit.toLx;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inLx / u.toLx;
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
