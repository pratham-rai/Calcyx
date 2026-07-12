export const meta = {
  slug: 'ohms-law',
  title: "Ohm's Law Calculator",
  description: "Solve for Voltage (V), Current (I), Resistance (R), or Power (P) using Ohm's Law.",
  category: 'science',
  icon: '⚡',
  relatedSlugs: ['frequency', 'appliance-energy'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem;">Enter any 2 known values to calculate the other 2. Voltage (V), Current (I), Resistance (R), and Power (P).</p>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Voltage (V) — Volts</label>
          <input type="number" id="ohm-v" class="form-control" placeholder="?" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Current (I) — Amps</label>
          <input type="number" id="ohm-i" class="form-control" placeholder="?" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Resistance (R) — Ohms (Ω)</label>
          <input type="number" id="ohm-r" class="form-control" placeholder="?" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Power (P) — Watts</label>
          <input type="number" id="ohm-p" class="form-control" placeholder="?" step="any" />
        </div>
      </div>
      <button id="ohm-reset" class="btn btn-secondary" style="margin-top:0.5rem;font-size:0.82rem;">Reset</button>
    </div>

    <div class="calc-result-section" id="ohm-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Voltage (V)</div>
          <div id="ohm-res-v" style="font-size:1.4rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Current (I)</div>
          <div id="ohm-res-i" style="font-size:1.4rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Resistance (R)</div>
          <div id="ohm-res-r" style="font-size:1.4rem;font-weight:700;color:var(--secondary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Power (P)</div>
          <div id="ohm-res-p" style="font-size:1.4rem;font-weight:700;color:var(--secondary-color);"></div>
        </div>
      </div>
    </div>

    <div id="ohm-error" style="display:none;padding:1rem;border-radius:8px;background:#fee2e2;color:#dc2626;margin-top:0.5rem;font-size:0.85rem;"></div>

    <div class="calc-formula">
      <h3>Ohm's Law Formulas</h3>
      <p><strong>Voltage:</strong> V = I × R</p>
      <p><strong>Power:</strong> P = V × I = I² × R = V² / R</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const ids = ['v', 'i', 'r', 'p'];
  const inputs = {};
  ids.forEach(id => inputs[id] = el.querySelector(`#ohm-${id}`));
  const resultsDiv = el.querySelector('#ohm-results');
  const errorDiv = el.querySelector('#ohm-error');

  function fmt(n) {
    return parseFloat(n.toFixed(6)).toString();
  }

  function calculate() {
    errorDiv.style.display = 'none';
    const v = {};
    ids.forEach(id => {
      const val = parseFloat(inputs[id].value);
      v[id] = isNaN(val) ? null : val;
    });

    const knownList = ids.filter(id => v[id] !== null);
    if (knownList.length < 2) {
      resultsDiv.style.display = 'none';
      return;
    }

    let V = v.v, I = v.i, R = v.r, P = v.p;

    // We need exactly two to solve for all 4. Let's list the 6 cases of combinations of 2:
    if (V !== null && I !== null) {
      R = V / I;
      P = V * I;
    } else if (V !== null && R !== null) {
      I = V / R;
      P = (V * V) / R;
    } else if (V !== null && P !== null) {
      I = P / V;
      R = (V * V) / P;
    } else if (I !== null && R !== null) {
      V = I * R;
      P = I * I * R;
    } else if (I !== null && P !== null) {
      V = P / I;
      R = P / (I * I);
    } else if (R !== null && P !== null) {
      V = Math.sqrt(P * R);
      I = Math.sqrt(P / R);
    }

    if (isNaN(V) || isNaN(I) || isNaN(R) || isNaN(P) || !isFinite(V) || !isFinite(I) || !isFinite(R) || !isFinite(P) || R < 0 || I < 0 || V < 0 || P < 0) {
      errorDiv.textContent = 'Invalid values or mathematically impossible combination.';
      errorDiv.style.display = '';
      resultsDiv.style.display = 'none';
      return;
    }

    el.querySelector('#ohm-res-v').textContent = fmt(V) + ' V';
    el.querySelector('#ohm-res-i').textContent = fmt(I) + ' A';
    el.querySelector('#ohm-res-r').textContent = fmt(R) + ' Ω';
    el.querySelector('#ohm-res-p').textContent = fmt(P) + ' W';

    resultsDiv.style.display = '';
  }

  ids.forEach(id => inputs[id].addEventListener('input', calculate));
  el.querySelector('#ohm-reset').addEventListener('click', () => {
    ids.forEach(id => inputs[id].value = '');
    resultsDiv.style.display = 'none';
    errorDiv.style.display = 'none';
  });

  calculate();

  return () => ids.forEach(id => inputs[id].removeEventListener('input', calculate));
}
