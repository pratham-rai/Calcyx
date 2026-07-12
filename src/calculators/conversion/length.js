export const meta = {
  slug: 'length',
  name: 'Length Converter',
  title: 'Length Converter - Calcyx',
  description: 'Convert between metric and imperial length units: millimeters, centimeters, meters, kilometers, inches, feet, yards, miles, and nautical miles.',
  category: 'conversion',
  icon: '📏',
  keywords: ['length', 'distance', 'convert', 'meters', 'feet', 'inches', 'miles', 'kilometers', 'yards'],
  formula: 'Result = Value × (From Factor ÷ To Factor)',
  relatedSlugs: ['weight', 'temperature', 'speed']
};

const units = [
  { id: 'mm', name: 'Millimeters (mm)', toMeters: 0.001 },
  { id: 'cm', name: 'Centimeters (cm)', toMeters: 0.01 },
  { id: 'm', name: 'Meters (m)', toMeters: 1 },
  { id: 'km', name: 'Kilometers (km)', toMeters: 1000 },
  { id: 'in', name: 'Inches (in)', toMeters: 0.0254 },
  { id: 'ft', name: 'Feet (ft)', toMeters: 0.3048 },
  { id: 'yd', name: 'Yards (yd)', toMeters: 0.9144 },
  { id: 'mi', name: 'Miles (mi)', toMeters: 1609.344 },
  { id: 'nmi', name: 'Nautical Miles (nmi)', toMeters: 1852 }
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
        <p>Each unit is defined by its conversion factor to meters. To convert, the value is first converted to meters, then from meters to the target unit.</p>
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

  // Default to meters → feet
  toSelect.value = 'ft';

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

    const inMeters = val * fromUnit.toMeters;
    const converted = inMeters / toUnit.toMeters;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inMeters / u.toMeters;
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
