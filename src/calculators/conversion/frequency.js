export const meta = {
  slug: 'frequency',
  name: 'Frequency & Wavelength Converter',
  title: 'Frequency & Wavelength Converter - Calcyx',
  description: 'Convert and translate between frequencies (Hz, kHz, MHz, GHz, THz) and vacuum wavelengths (m, cm, mm, µm, nm).',
  category: 'conversion',
  icon: '📡',
  keywords: ['frequency converter', 'wavelength converter', 'frequency to wavelength', 'wavelength to frequency', 'hertz', 'gigahertz', 'meters', 'nanometers', 'speed of light'],
  formula: 'λ = c / f and f = c / λ',
  relatedSlugs: ['speed', 'base-converter']
};

const C = 299792458; // Speed of light in m/s

const units = [
  // Frequency Units
  { id: 'hz', name: 'Hertz (Hz)', type: 'freq', factor: 1 },
  { id: 'khz', name: 'Kilohertz (kHz)', type: 'freq', factor: 1e3 },
  { id: 'mhz', name: 'Megahertz (MHz)', type: 'freq', factor: 1e6 },
  { id: 'ghz', name: 'Gigahertz (GHz)', type: 'freq', factor: 1e9 },
  { id: 'thz', name: 'Terahertz (THz)', type: 'freq', factor: 1e12 },
  // Wavelength Units
  { id: 'm', name: 'Meters (m)', type: 'wave', factor: 1 },
  { id: 'cm', name: 'Centimeters (cm)', type: 'wave', factor: 1e-2 },
  { id: 'mm', name: 'Millimeters (mm)', type: 'wave', factor: 1e-3 },
  { id: 'um', name: 'Micrometers (μm)', type: 'wave', factor: 1e-6 },
  { id: 'nm', name: 'Nanometers (nm)', type: 'wave', factor: 1e-9 }
];

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const freqOptions = units.filter(u => u.type === 'freq').map(u => `<option value="${u.id}">${u.name}</option>`).join('');
  const waveOptions = units.filter(u => u.type === 'wave').map(u => `<option value="${u.id}">${u.name}</option>`).join('');

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
          <input type="number" id="value" class="calc-input" placeholder="Enter value" step="any" min="0.000000001" value="1">
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="from-unit">From</label>
            <select id="from-unit" class="calc-select">
              <optgroup label="Frequency">
                ${freqOptions}
              </optgroup>
              <optgroup label="Wavelength in Vacuum">
                ${waveOptions}
              </optgroup>
            </select>
          </div>
          <div class="calc-input-group">
            <label for="to-unit">To</label>
            <select id="to-unit" class="calc-select">
              <optgroup label="Wavelength in Vacuum">
                ${waveOptions}
              </optgroup>
              <optgroup label="Frequency">
                ${freqOptions}
              </optgroup>
            </select>
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="main-result"></div>
          <div class="calc-result-label" id="main-label"></div>
          
          <h4 style="margin: 24px 0 12px 0; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9;">Equivalent Frequencies</h4>
          <div class="calc-result-grid" id="freq-conversions"></div>
          
          <h4 style="margin: 24px 0 12px 0; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9;">Equivalent Wavelengths (in Vacuum)</h4>
          <div class="calc-result-grid" id="wave-conversions"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>&lambda; = c / f</code> &nbsp;and&nbsp; <code>f = c / &lambda;</code>
        <p>Frequency (f) and wavelength (&lambda;) are inversely proportional to each other, related by the speed of light in vacuum (c &approx; 299,792,458 m/s). As frequency increases, wavelength decreases, and vice-versa.</p>
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
  const freqConversions = document.getElementById('freq-conversions');
  const waveConversions = document.getElementById('wave-conversions');

  // Set default values
  fromSelect.value = 'ghz';
  toSelect.value = 'cm';

  function formatNum(n) {
    if (Math.abs(n) >= 0.000001 && Math.abs(n) < 1e12) {
      return parseFloat(n.toPrecision(10)).toLocaleString(undefined, { maximumFractionDigits: 6 });
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

    // Get value in standard base unit for the active type
    const baseVal = val * fromUnit.factor; // Hz if freq, meters if wave
    
    // Calculate main result
    let converted;
    if (fromUnit.type === toUnit.type) {
      converted = baseVal / toUnit.factor;
    } else {
      if (fromUnit.type === 'freq') {
        const meters = C / baseVal;
        converted = meters / toUnit.factor;
      } else {
        const hz = C / baseVal;
        converted = hz / toUnit.factor;
      }
    }

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name}`;

    // Fill grids
    const isFreqSource = fromUnit.type === 'freq';
    const sourceHz = isFreqSource ? baseVal : C / baseVal;
    const sourceMeters = isFreqSource ? C / baseVal : baseVal;

    freqConversions.innerHTML = units
      .filter(u => u.type === 'freq')
      .map(u => {
        const result = sourceHz / u.factor;
        return `
          <div class="calc-result-item">
            <div class="calc-result-value">${formatNum(result)}</div>
            <div class="calc-result-label">${u.name}</div>
          </div>
        `;
      }).join('');

    waveConversions.innerHTML = units
      .filter(u => u.type === 'wave')
      .map(u => {
        const result = sourceMeters / u.factor;
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
