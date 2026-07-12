export const meta = {
  slug: 'force',
  name: 'Force Converter',
  title: 'Force Converter - Calcyx',
  description: 'Convert between various force units: Newton (N), Kilonewton (kN), Dyne (dyn), Pound-force (lbf), and Kilogram-force (kgf).',
  category: 'conversion',
  icon: '💪',
  keywords: ['force', 'converter', 'newton', 'kilonewton', 'dyne', 'pound-force', 'kilogram-force', 'conversion'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['weight', 'torque']
};

const units = [
  { id: 'n', name: 'Newton (N)', toBase: 1 },
  { id: 'kn', name: 'Kilonewton (kN)', toBase: 1000 },
  { id: 'dyn', name: 'Dyne (dyn)', toBase: 0.00001 },
  { id: 'lbf', name: 'Pound-force (lbf)', toBase: 4.4482216152605 },
  { id: 'kgf', name: 'Kilogram-force (kgf)', toBase: 9.80665 }
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
        <p>Each unit of force is defined by its conversion factor to the Newton (N), the SI unit of force. The calculator converts the input value to Newtons, and then divides it by the target unit's factor.</p>
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

  // Default to n → lbf
  fromSelect.value = 'n';
  toSelect.value = 'lbf';

  function formatNum(n) {
    if (Math.abs(n) >= 0.01 && Math.abs(n) < 1e12) {
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

    const inBase = val * fromUnit.toBase;
    const converted = inBase / toUnit.toBase;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inBase / u.toBase;
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
