export const meta = {
  slug: 'temperature',
  name: 'Temperature Converter',
  title: 'Temperature Converter - Calcyx',
  description: 'Convert between Celsius, Fahrenheit, and Kelvin temperature scales with exact formulas.',
  category: 'conversion',
  icon: '🌡️',
  keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'convert', 'degrees', 'heat'],
  formula: '°F = °C × 9/5 + 32 | K = °C + 273.15',
  relatedSlugs: ['length', 'weight']
};

const scales = [
  { id: 'c', name: 'Celsius (°C)', symbol: '°C' },
  { id: 'f', name: 'Fahrenheit (°F)', symbol: '°F' },
  { id: 'k', name: 'Kelvin (K)', symbol: 'K' }
];

function toCelsius(value, from) {
  switch (from) {
    case 'c': return value;
    case 'f': return (value - 32) * 5 / 9;
    case 'k': return value - 273.15;
    default: return NaN;
  }
}

function fromCelsius(c, to) {
  switch (to) {
    case 'c': return c;
    case 'f': return c * 9 / 5 + 32;
    case 'k': return c + 273.15;
    default: return NaN;
  }
}

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const options = scales.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="value">Temperature</label>
          <input type="number" id="value" class="calc-input" placeholder="Enter temperature" step="any" value="100">
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="from-scale">From</label>
            <select id="from-scale" class="calc-select">${options}</select>
          </div>
          <div class="calc-input-group">
            <label for="to-scale">To</label>
            <select id="to-scale" class="calc-select">${options}</select>
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="main-result"></div>
          <div class="calc-result-label" id="main-label"></div>
          <div class="calc-result-grid" id="all-conversions"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>Conversion Formulas</h3>
        <code>°F = °C × 9/5 + 32</code>
        <code>K = °C + 273.15</code>
        <code>°F = K × 9/5 − 459.67</code>
        <p>Temperature conversions use direct formulas rather than simple multiplication factors, because the scales have different zero points. Celsius and Kelvin share the same degree size but differ by 273.15. Fahrenheit uses a different degree size (5/9 of a Celsius degree) and offset.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const valueInput = document.getElementById('value');
  const fromSelect = document.getElementById('from-scale');
  const toSelect = document.getElementById('to-scale');
  const resultDiv = document.getElementById('result');
  const mainResult = document.getElementById('main-result');
  const mainLabel = document.getElementById('main-label');
  const allConversions = document.getElementById('all-conversions');

  // Default to Celsius → Fahrenheit
  toSelect.value = 'f';

  function formatTemp(n) {
    return parseFloat(n.toFixed(4)).toLocaleString(undefined, { maximumFractionDigits: 4 });
  }

  function calculate() {
    const val = parseFloat(valueInput.value);
    if (isNaN(val)) {
      resultDiv.style.display = 'none';
      return;
    }

    const fromScale = scales.find(s => s.id === fromSelect.value);
    const toScale = scales.find(s => s.id === toSelect.value);

    const celsius = toCelsius(val, fromScale.id);
    const converted = fromCelsius(celsius, toScale.id);

    mainResult.textContent = `${formatTemp(converted)} ${toScale.symbol}`;
    mainLabel.textContent = `${fromScale.name} → ${toScale.name}`;

    allConversions.innerHTML = scales
      .filter(s => s.id !== fromScale.id)
      .map(s => {
        const result = fromCelsius(celsius, s.id);
        return `
          <div class="calc-result-item">
            <div class="calc-result-value">${formatTemp(result)} ${s.symbol}</div>
            <div class="calc-result-label">${s.name}</div>
          </div>
        `;
      }).join('');

    // Show notable reference points
    const waterBoilF = fromCelsius(100, 'f');
    const bodyTempC = toCelsius(98.6, 'f');

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
