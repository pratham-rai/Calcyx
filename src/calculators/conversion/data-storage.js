export const meta = {
  slug: 'data-storage',
  name: 'Data Storage Converter',
  title: 'Data Storage Converter - Calcyx',
  description: 'Convert between data storage units: bits, bytes, KB, MB, GB, TB, and PB. Toggle between binary (1024) and decimal (1000) standards.',
  category: 'conversion',
  icon: '💾',
  keywords: ['data', 'storage', 'bytes', 'megabytes', 'gigabytes', 'terabytes', 'binary', 'decimal', 'convert'],
  formula: 'Result = Value × (From Bytes ÷ To Bytes)',
  relatedSlugs: ['length', 'speed']
};

function getUnits(binary) {
  const base = binary ? 1024 : 1000;
  const prefix = binary
    ? ['Bit', 'Byte', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
    : ['Bit', 'Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];

  return [
    { id: 'bit', name: `Bits (${prefix[0]})`, toBytes: 1 / 8 },
    { id: 'byte', name: `Bytes (${prefix[1]})`, toBytes: 1 },
    { id: 'kb', name: prefix[2], toBytes: Math.pow(base, 1) },
    { id: 'mb', name: prefix[3], toBytes: Math.pow(base, 2) },
    { id: 'gb', name: prefix[4], toBytes: Math.pow(base, 3) },
    { id: 'tb', name: prefix[5], toBytes: Math.pow(base, 4) },
    { id: 'pb', name: prefix[6], toBytes: Math.pow(base, 5) }
  ];
}

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const defaultUnits = getUnits(true);
  const options = defaultUnits.map(u => `<option value="${u.id}">${u.name}</option>`).join('');

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
        <div class="calc-input-group">
          <label for="base-toggle">Standard</label>
          <select id="base-toggle" class="calc-select">
            <option value="binary" selected>Binary (1024 — KiB, MiB, GiB)</option>
            <option value="decimal">Decimal (1000 — KB, MB, GB)</option>
          </select>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="main-result"></div>
          <div class="calc-result-label" id="main-label"></div>
          <div class="calc-result-grid" id="all-conversions"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>Binary vs Decimal</h3>
        <code>Binary: 1 KiB = 1024 Bytes</code>
        <code>Decimal: 1 KB = 1000 Bytes</code>
        <p>In computing, binary prefixes (KiB, MiB, GiB) use powers of 1024, matching how computers address memory. Decimal prefixes (KB, MB, GB) use powers of 1000, commonly used by storage manufacturers. A "1 TB" drive is typically 1,000,000,000,000 bytes (decimal), which equals ~931 GiB (binary).</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const valueInput = document.getElementById('value');
  const fromSelect = document.getElementById('from-unit');
  const toSelect = document.getElementById('to-unit');
  const baseToggle = document.getElementById('base-toggle');
  const resultDiv = document.getElementById('result');
  const mainResult = document.getElementById('main-result');
  const mainLabel = document.getElementById('main-label');
  const allConversions = document.getElementById('all-conversions');

  // Default from GB → MB
  fromSelect.value = 'gb';
  toSelect.value = 'mb';

  function updateDropdownLabels() {
    const isBinary = baseToggle.value === 'binary';
    const units = getUnits(isBinary);
    const savedFrom = fromSelect.value;
    const savedTo = toSelect.value;

    [fromSelect, toSelect].forEach(sel => {
      const opts = sel.querySelectorAll('option');
      opts.forEach((opt, i) => {
        opt.textContent = units[i].name;
      });
    });

    fromSelect.value = savedFrom;
    toSelect.value = savedTo;
  }

  function formatNum(n) {
    if (n === 0) return '0';
    if (Math.abs(n) >= 0.001 && Math.abs(n) < 1e15) {
      return parseFloat(n.toPrecision(10)).toLocaleString(undefined, { maximumFractionDigits: 10 });
    }
    return n.toExponential(4);
  }

  function calculate() {
    const val = parseFloat(valueInput.value);
    if (isNaN(val)) {
      resultDiv.style.display = 'none';
      return;
    }

    const isBinary = baseToggle.value === 'binary';
    const units = getUnits(isBinary);

    const fromUnit = units.find(u => u.id === fromSelect.value);
    const toUnit = units.find(u => u.id === toSelect.value);

    const inBytes = val * fromUnit.toBytes;
    const converted = inBytes / toUnit.toBytes;

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromSelect.value)
      .map(u => {
        const result = inBytes / u.toBytes;
        return `
          <div class="calc-result-item">
            <div class="calc-result-value">${formatNum(result)}</div>
            <div class="calc-result-label">${u.name}</div>
          </div>
        `;
      }).join('');

    resultDiv.style.display = '';
  }

  function onBaseChange() {
    updateDropdownLabels();
    calculate();
  }

  valueInput.addEventListener('input', calculate);
  fromSelect.addEventListener('input', calculate);
  toSelect.addEventListener('input', calculate);
  baseToggle.addEventListener('input', onBaseChange);

  calculate();

  return () => {
    valueInput.removeEventListener('input', calculate);
    fromSelect.removeEventListener('input', calculate);
    toSelect.removeEventListener('input', calculate);
    baseToggle.removeEventListener('input', onBaseChange);
  };
}
