export const meta = {
  slug: 'triangle',
  title: 'Triangle Calculator',
  description: 'Solve any triangle — find sides, angles, area, and perimeter from any 3 known values.',
  category: 'math',
  icon: '📐',
  relatedSlugs: ['quadratic', 'percentage'],
};

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem;">Enter any 3 known values (at least one must be a side). Sides: a, b, c. Angles: A (opposite a), B (opposite b), C (opposite c).</p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;">
        <div class="form-group">
          <label class="form-label">Side a</label>
          <input type="number" id="tri-a" class="form-control" placeholder="?" min="0" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Side b</label>
          <input type="number" id="tri-b" class="form-control" placeholder="?" min="0" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Side c</label>
          <input type="number" id="tri-c" class="form-control" placeholder="?" min="0" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Angle A (°)</label>
          <input type="number" id="tri-A" class="form-control" placeholder="?" min="0" max="179" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Angle B (°)</label>
          <input type="number" id="tri-B" class="form-control" placeholder="?" min="0" max="179" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Angle C (°)</label>
          <input type="number" id="tri-C" class="form-control" placeholder="?" min="0" max="179" step="any" />
        </div>
      </div>
      <button id="tri-reset" class="btn btn-secondary" style="margin-top:0.5rem;font-size:0.82rem;">Reset</button>
    </div>

    <div class="calc-result-section" id="tri-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Side a</div>
          <div id="tri-res-a" style="font-size:1.4rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Side b</div>
          <div id="tri-res-b" style="font-size:1.4rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Side c</div>
          <div id="tri-res-c" style="font-size:1.4rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Angle A</div>
          <div id="tri-res-A" style="font-size:1.4rem;font-weight:700;color:var(--secondary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Angle B</div>
          <div id="tri-res-B" style="font-size:1.4rem;font-weight:700;color:var(--secondary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Angle C</div>
          <div id="tri-res-C" style="font-size:1.4rem;font-weight:700;color:var(--secondary-color);"></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;">
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Area</div>
          <div id="tri-res-area" style="font-size:1.4rem;font-weight:700;"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Perimeter</div>
          <div id="tri-res-perim" style="font-size:1.4rem;font-weight:700;"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Type</div>
          <div id="tri-res-type" style="font-size:1rem;font-weight:700;"></div>
        </div>
      </div>
    </div>

    <div id="tri-error" style="display:none;padding:1rem;border-radius:8px;background:#fee2e2;color:#dc2626;margin-top:0.5rem;font-size:0.85rem;"></div>

    <div class="calc-formula">
      <h3>Laws Used</h3>
      <p><strong>Law of Sines:</strong> a/sin(A) = b/sin(B) = c/sin(C)</p>
      <p><strong>Law of Cosines:</strong> c² = a² + b² - 2ab·cos(C)</p>
      <p><strong>Heron's Formula:</strong> Area = √(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const ids = ['a','b','c','A','B','C'];
  const inputs = {};
  ids.forEach(id => inputs[id] = el.querySelector(`#tri-${id}`));
  const resultsDiv = el.querySelector('#tri-results');
  const errorDiv = el.querySelector('#tri-error');

  function fmt(n) { return isNaN(n) ? '?' : parseFloat(n.toFixed(4)).toString(); }

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = '';
    resultsDiv.style.display = 'none';
  }

  function setResults(t) {
    ['a','b','c'].forEach(k => { el.querySelector(`#tri-res-${k}`).textContent = fmt(t[k]); });
    ['A','B','C'].forEach(k => { el.querySelector(`#tri-res-${k}`).textContent = fmt(t[k]) + '°'; });
    el.querySelector('#tri-res-area').textContent = fmt(t.area);
    el.querySelector('#tri-res-perim').textContent = fmt(t.a + t.b + t.c);

    let type = [];
    if (Math.abs(t.A - 90) < 0.01 || Math.abs(t.B - 90) < 0.01 || Math.abs(t.C - 90) < 0.01) type.push('Right');
    else if (t.A > 90 || t.B > 90 || t.C > 90) type.push('Obtuse');
    else type.push('Acute');
    if (Math.abs(t.a - t.b) < 0.001 && Math.abs(t.b - t.c) < 0.001) type.push('Equilateral');
    else if (Math.abs(t.a - t.b) < 0.001 || Math.abs(t.b - t.c) < 0.001 || Math.abs(t.a - t.c) < 0.001) type.push('Isosceles');
    else type.push('Scalene');
    el.querySelector('#tri-res-type').textContent = type.join(' · ');
  }

  function heron(a, b, c) {
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  function calculate() {
    errorDiv.style.display = 'none';
    const v = {};
    ids.forEach(id => {
      const val = parseFloat(inputs[id].value);
      v[id] = isNaN(val) ? null : val;
    });

    const sides = [v.a, v.b, v.c].filter(x => x !== null).length;
    const angles = [v.A, v.B, v.C].filter(x => x !== null).length;
    const known = sides + angles;
    if (known < 3) { resultsDiv.style.display = 'none'; return; }
    if (sides === 0) { showError('At least one side must be provided.'); return; }

    let t = { ...v };

    // Fill missing angle if two are known
    if (t.A !== null && t.B !== null && t.C === null) t.C = 180 - t.A - t.B;
    if (t.A !== null && t.C !== null && t.B === null) t.B = 180 - t.A - t.C;
    if (t.B !== null && t.C !== null && t.A === null) t.A = 180 - t.B - t.C;

    // SSS
    if (t.a !== null && t.b !== null && t.c !== null) {
      const cosA = (t.b ** 2 + t.c ** 2 - t.a ** 2) / (2 * t.b * t.c);
      if (Math.abs(cosA) > 1) { showError('These sides cannot form a valid triangle.'); return; }
      t.A = Math.acos(cosA) * RAD;
      t.B = Math.asin(t.b * Math.sin(t.A * DEG) / t.a) * RAD;
      t.C = 180 - t.A - t.B;
    }
    // AAS/ASA
    else if (t.A !== null && t.B !== null && t.C !== null) {
      if (t.a !== null) {
        t.b = t.a * Math.sin(t.B * DEG) / Math.sin(t.A * DEG);
        t.c = t.a * Math.sin(t.C * DEG) / Math.sin(t.A * DEG);
      } else if (t.b !== null) {
        t.a = t.b * Math.sin(t.A * DEG) / Math.sin(t.B * DEG);
        t.c = t.b * Math.sin(t.C * DEG) / Math.sin(t.B * DEG);
      } else if (t.c !== null) {
        t.a = t.c * Math.sin(t.A * DEG) / Math.sin(t.C * DEG);
        t.b = t.c * Math.sin(t.B * DEG) / Math.sin(t.C * DEG);
      }
    }
    // SAS
    else if (t.a !== null && t.b !== null && t.C !== null) {
      t.c = Math.sqrt(t.a ** 2 + t.b ** 2 - 2 * t.a * t.b * Math.cos(t.C * DEG));
      t.A = Math.asin(t.a * Math.sin(t.C * DEG) / t.c) * RAD;
      t.B = 180 - t.A - t.C;
    } else if (t.a !== null && t.c !== null && t.B !== null) {
      t.b = Math.sqrt(t.a ** 2 + t.c ** 2 - 2 * t.a * t.c * Math.cos(t.B * DEG));
      t.A = Math.asin(t.a * Math.sin(t.B * DEG) / t.b) * RAD;
      t.C = 180 - t.A - t.B;
    } else if (t.b !== null && t.c !== null && t.A !== null) {
      t.a = Math.sqrt(t.b ** 2 + t.c ** 2 - 2 * t.b * t.c * Math.cos(t.A * DEG));
      t.B = Math.asin(t.b * Math.sin(t.A * DEG) / t.a) * RAD;
      t.C = 180 - t.A - t.B;
    }

    if ([t.a, t.b, t.c, t.A, t.B, t.C].some(x => x === null || isNaN(x) || x <= 0)) {
      showError('Cannot solve triangle with these inputs. Check values.'); return;
    }

    t.area = heron(t.a, t.b, t.c);
    setResults(t);
    resultsDiv.style.display = '';
  }

  ids.forEach(id => inputs[id].addEventListener('input', calculate));
  el.querySelector('#tri-reset').addEventListener('click', () => {
    ids.forEach(id => { inputs[id].value = ''; });
    resultsDiv.style.display = 'none';
    errorDiv.style.display = 'none';
  });

  return () => ids.forEach(id => inputs[id].removeEventListener('input', calculate));
}
