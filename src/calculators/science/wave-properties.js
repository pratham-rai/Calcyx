export const meta = {
  slug: 'wave-properties',
  title: 'Wave Speed & Frequency',
  description: 'Solve wave speed, frequency, or wavelength parameters with preset speed standards.',
  category: 'science',
  icon: '🌊',
  relatedSlugs: ['frequency', 'scientific-notation'],
};

const PRESETS = [
  { name: 'Custom Speed', v: null },
  { name: 'Light in Vacuum', v: 299792458 },
  { name: 'Sound in Air (20°C)', v: 343 },
  { name: 'Sound in Fresh Water (25°C)', v: 1497 },
  { name: 'Sound in Steel', v: 5960 },
];

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Solve For</label>
        <select id="wave-solve" class="form-control">
          <option value="v">Wave Speed (v)</option>
          <option value="f">Frequency (f)</option>
          <option value="l">Wavelength (λ)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Medium/Speed Preset</label>
        <select id="wave-preset" class="form-control">
          ${PRESETS.map((p, i) => `<option value="${p.v !== null ? p.v : 'custom'}">${p.name} ${p.v ? `(${p.v.toLocaleString()} m/s)` : ''}</option>`).join('')}
        </select>
      </div>

      <div class="form-group" id="wave-group-v">
        <label class="form-label">Wave Speed (v) — m/s</label>
        <input type="number" id="wave-v" class="form-control" value="343" min="0.0001" step="any" />
      </div>

      <div class="form-group" id="wave-group-f">
        <label class="form-label">Frequency (f) — Hz</label>
        <input type="number" id="wave-f" class="form-control" value="1000" min="0.0001" step="any" />
      </div>

      <div class="form-group" id="wave-group-l" style="display:none;">
        <label class="form-label">Wavelength (λ) — meters</label>
        <input type="number" id="wave-l" class="form-control" value="0.343" min="0.0001" step="any" />
      </div>
    </div>

    <div class="calc-result-section" id="wave-results" style="display:none;">
      <div class="glass-card" style="padding:1.5rem;text-align:center;margin-bottom:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);" id="wave-res-label">Result</div>
        <div id="wave-res-val" style="font-size:2.2rem;font-weight:800;color:var(--primary-color);"></div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Formula</h3>
      <p><strong>Wave Equation:</strong> v = f × λ</p>
      <p>Where v = wave velocity (speed), f = frequency, and λ = wavelength.</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const solveSelect = el.querySelector('#wave-solve');
  const presetSelect = el.querySelector('#wave-preset');
  const vInput = el.querySelector('#wave-v');
  const fInput = el.querySelector('#wave-f');
  const lInput = el.querySelector('#wave-l');
  const resultsDiv = el.querySelector('#wave-results');
  const resLabel = el.querySelector('#wave-res-label');
  const resVal = el.querySelector('#wave-res-val');

  const groups = {
    v: el.querySelector('#wave-group-v'),
    f: el.querySelector('#wave-group-f'),
    l: el.querySelector('#wave-group-l'),
  };

  function updateSolve() {
    const s = solveSelect.value;
    Object.keys(groups).forEach(k => {
      groups[k].style.display = k === s ? 'none' : '';
    });
    // If solving for speed, preset selector is disabled
    presetSelect.disabled = (s === 'v');
    if (s === 'v') presetSelect.value = 'custom';
    calculate();
  }

  presetSelect.addEventListener('change', function() {
    if (this.value !== 'custom') {
      vInput.value = this.value;
    }
    calculate();
  });

  function fmt(n) {
    if (n > 1e6 || n < 1e-4) return n.toExponential(4);
    return parseFloat(n.toFixed(6)).toString();
  }

  function calculate() {
    const s = solveSelect.value;
    const v = parseFloat(vInput.value);
    const f = parseFloat(fInput.value);
    const l = parseFloat(lInput.value);

    let result = NaN;
    let label = '';

    if (s === 'v') {
      if (!isNaN(f) && !isNaN(l)) {
        result = f * l;
        label = 'Wave Speed (v)';
      }
    } else if (s === 'f') {
      if (!isNaN(v) && !isNaN(l) && l > 0) {
        result = v / l;
        label = 'Frequency (f)';
      }
    } else if (s === 'l') {
      if (!isNaN(v) && !isNaN(f) && f > 0) {
        result = v / f;
        label = 'Wavelength (λ)';
      }
    }

    if (isNaN(result) || result <= 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    let unit = ' m/s';
    if (s === 'f') unit = ' Hz';
    else if (s === 'l') unit = ' m';

    resLabel.textContent = label;
    resVal.textContent = fmt(result) + unit;

    resultsDiv.style.display = '';
  }

  solveSelect.addEventListener('change', updateSolve);
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', calculate));

  updateSolve();

  return () => {
    solveSelect.removeEventListener('change', updateSolve);
    el.querySelectorAll('input').forEach(i => i.removeEventListener('input', calculate));
  };
}
