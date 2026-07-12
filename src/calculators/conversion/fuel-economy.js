export const meta = {
  slug: 'fuel-economy',
  name: 'Fuel Economy Converter',
  title: 'Fuel Economy Converter - Calcyx',
  description: 'Convert between various fuel economy units: MPG (US), MPG (UK), L/100km, and km/L.',
  category: 'conversion',
  icon: '⛽',
  keywords: ['fuel economy', 'converter', 'mpg', 'l/100km', 'km/l', 'fuel consumption', 'conversion'],
  formula: 'L/100km = 235.215 ÷ MPG (US) | km/L = 100 ÷ (L/100km)',
  relatedSlugs: ['fuel-cost', 'speed']
};

const units = [
  { id: 'mpg_us', name: 'MPG (US)' },
  { id: 'mpg_uk', name: 'MPG (UK)' },
  { id: 'l100km', name: 'L/100km' },
  { id: 'kml', name: 'km/L' }
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
          <input type="number" id="value" class="calc-input" placeholder="Enter value" step="any" value="25">
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
        <code>L/100km = 235.21458 ÷ MPG (US)</code><br>
        <code>km/L = 100 ÷ (L/100km)</code>
        <p>Fuel economy units are either distance-per-volume (MPG, km/L) or volume-per-distance (L/100km). Converting between these two types involves an inverse calculation (e.g. dividing a constant by the input value). Values must be greater than zero.</p>
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

  // Default to mpg_us → l100km
  fromSelect.value = 'mpg_us';
  toSelect.value = 'l100km';

  function toL100km(val, unit) {
    if (val <= 0 || isNaN(val)) return NaN;
    if (unit === 'l100km') return val;
    if (unit === 'kml') return 100 / val;
    if (unit === 'mpg_us') return 235.2145833 / val;
    if (unit === 'mpg_uk') return 282.4809363 / val;
    return NaN;
  }

  function fromL100km(l100, unit) {
    if (l100 <= 0 || isNaN(l100)) return NaN;
    if (unit === 'l100km') return l100;
    if (unit === 'kml') return 100 / l100;
    if (unit === 'mpg_us') return 235.2145833 / l100;
    if (unit === 'mpg_uk') return 282.4809363 / l100;
    return NaN;
  }

  function formatNum(n) {
    if (isNaN(n) || !isFinite(n)) return '-';
    if (Math.abs(n) >= 0.01 && Math.abs(n) < 1e12) {
      return parseFloat(n.toPrecision(10)).toLocaleString(undefined, { maximumFractionDigits: 8 });
    }
    return n.toExponential(4);
  }

  function calculate() {
    const val = parseFloat(valueInput.value);
    if (isNaN(val) || val <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const fromUnit = units.find(u => u.id === fromSelect.value);
    const toUnit = units.find(u => u.id === toSelect.value);

    const l100 = toL100km(val, fromUnit.id);
    const converted = fromL100km(l100, toUnit.id);

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = fromL100km(l100, u.id);
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
