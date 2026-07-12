export const meta = {
  slug: 'weight',
  name: 'Weight / Mass Converter',
  title: 'Weight / Mass Converter - Calcyx',
  description: 'Convert between weight and mass units: milligrams, grams, kilograms, tonnes, ounces, pounds, and stone.',
  category: 'conversion',
  icon: '⚖️',
  keywords: ['weight', 'mass', 'convert', 'kilograms', 'pounds', 'ounces', 'grams', 'stone', 'tonnes'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['length', 'temperature']
};

const units = [
  { id: 'mg', name: 'Milligrams (mg)', toGrams: 0.001 },
  { id: 'g', name: 'Grams (g)', toGrams: 1 },
  { id: 'kg', name: 'Kilograms (kg)', toGrams: 1000 },
  { id: 'tonne', name: 'Tonnes (t)', toGrams: 1000000 },
  { id: 'oz', name: 'Ounces (oz)', toGrams: 28.3495231 },
  { id: 'lb', name: 'Pounds (lb)', toGrams: 453.59237 },
  { id: 'st', name: 'Stone (st)', toGrams: 6350.29318 }
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
        <p>Each unit is defined by its conversion factor to grams. The input value is first converted to grams, then from grams to every other unit.</p>
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

  // Default to kg → lb
  fromSelect.value = 'kg';
  toSelect.value = 'lb';

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

    const inGrams = val * fromUnit.toGrams;
    const converted = inGrams / toUnit.toGrams;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inGrams / u.toGrams;
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
