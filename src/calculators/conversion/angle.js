export const meta = {
  slug: 'angle',
  name: 'Angle Converter',
  title: 'Angle Converter - Calcyx',
  description: 'Convert angle measurements between Degrees, Radians, Gradians, Arcminutes, Arcseconds, and Revolutions.',
  category: 'conversion',
  icon: '📐',
  keywords: ['angle converter', 'degrees to radians', 'radians', 'arcseconds', 'angle conversion', 'gradians', 'arcminutes', 'revolutions', 'geometry', 'trigonometry'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['length', 'speed']
};

const units = [
  { id: 'deg', name: 'Degrees (°)', toDeg: 1 },
  { id: 'rad', name: 'Radians (rad)', toDeg: 180 / Math.PI },
  { id: 'grad', name: 'Gradians (grad)', toDeg: 0.9 },
  { id: 'arcmin', name: 'Arcminutes (\')', toDeg: 1 / 60 },
  { id: 'arcsec', name: 'Arcseconds (")', toDeg: 1 / 3600 },
  { id: 'rev', name: 'Revolutions (rev)', toDeg: 360 }
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
          <input type="number" id="value" class="calc-input" placeholder="Enter value" step="any" value="45">
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
        <p>Each unit is defined by its conversion factor to Degrees (°). The calculator converts the input value to Degrees, then converts it from Degrees to the target unit. One radian is equal to 180/π degrees, a gradian is 0.9 degrees, an arcminute is 1/60 of a degree, an arcsecond is 1/3600 of a degree, and a revolution is 360 degrees.</p>
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

  // Default to Degrees → Radians
  fromSelect.value = 'deg';
  toSelect.value = 'rad';

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

    const inDeg = val * fromUnit.toDeg;
    const converted = inDeg / toUnit.toDeg;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inDeg / u.toDeg;
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
