export const meta = {
  slug: 'pressure',
  name: 'Pressure Converter',
  title: 'Pressure Converter - Calcyx',
  description: 'Convert between various pressure units: Pascal (Pa), Kilopascal (kPa), Megapascal (MPa), Bar, PSI (lb/in²), Atmosphere (atm), and Torr/mmHg.',
  category: 'conversion',
  icon: '🎈',
  keywords: ['pressure converter', 'psi to bar', 'pascals', 'atmospheres', 'kilopascals', 'megapascals', 'torr', 'mmHg'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['weight', 'temperature']
};

const units = [
  { id: 'pa', name: 'Pascal (Pa)', toPa: 1 },
  { id: 'kpa', name: 'Kilopascal (kPa)', toPa: 1000 },
  { id: 'mpa', name: 'Megapascal (MPa)', toPa: 1000000 },
  { id: 'bar', name: 'Bar', toPa: 100000 },
  { id: 'psi', name: 'PSI (lb/in²)', toPa: 6894.757293168 },
  { id: 'atm', name: 'Atmosphere (atm)', toPa: 101325 },
  { id: 'torr', name: 'Torr / mmHg', toPa: 101325 / 760 }
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
        <p>Each pressure unit is defined by its relation to the Pascal (Pa), the SI unit of pressure. The calculator converts the input value to Pascals, then divides by the target unit's conversion factor. For example, 1 Bar is equal to 100,000 Pascals, and 1 Atmosphere is exactly 101,325 Pascals.</p>
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

  // Default to psi → bar
  fromSelect.value = 'psi';
  toSelect.value = 'bar';

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

    const inPa = val * fromUnit.toPa;
    const converted = inPa / toUnit.toPa;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inPa / u.toPa;
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
