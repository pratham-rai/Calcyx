export const meta = {
  slug: 'projectile-motion',
  title: 'Projectile Motion Solver',
  description: 'Calculate flight duration, maximum height, range, and final velocity for ideal projectiles.',
  category: 'science',
  icon: '☄️',
  relatedSlugs: ['triangle', 'quadratic'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Initial Velocity (v₀) — m/s</label>
          <input type="number" id="pm-v0" class="form-control" value="20" min="0" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Launch Angle (θ) — degrees</label>
          <input type="number" id="pm-angle" class="form-control" value="45" min="0" max="90" step="any" />
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Initial Height (y₀) — meters</label>
          <input type="number" id="pm-y0" class="form-control" value="0" min="0" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Gravity (g) — m/s²</label>
          <input type="number" id="pm-g" class="form-control" value="9.80665" min="0.1" step="any" />
        </div>
      </div>
    </div>

    <div class="calc-result-section" id="pm-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Horizontal Range</div>
          <div id="pm-range" style="font-size:1.6rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Maximum Height</div>
          <div id="pm-max-h" style="font-size:1.6rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Total Flight Time</div>
          <div id="pm-time" style="font-size:1.6rem;font-weight:700;color:var(--secondary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Impact Velocity</div>
          <div id="pm-v-impact" style="font-size:1.6rem;font-weight:700;color:var(--secondary-color);"></div>
        </div>
      </div>
      <div class="glass-card" style="padding:1rem;">
        <div style="font-weight:600;margin-bottom:0.5rem;">Trajectory Coordinates</div>
        <div style="font-size:0.85rem;color:var(--text-secondary);">Peak reaches at x = <strong id="pm-peak-x"></strong> m, y = <strong id="pm-peak-y"></strong> m.</div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Physics Equations</h3>
      <p><strong>Initial Components:</strong> v₀ₓ = v₀ cos(θ) &nbsp;|&nbsp; v₀ᵧ = v₀ sin(θ)</p>
      <p><strong>Flight Time (t):</strong> Solve quadratic: -½gt² + v₀ᵧt + y₀ = 0</p>
      <p><strong>Range:</strong> R = v₀ₓ × t &nbsp;|&nbsp; <strong>Max Height:</strong> H = y₀ + v₀ᵧ² / (2g)</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const v0Input = el.querySelector('#pm-v0');
  const angleInput = el.querySelector('#pm-angle');
  const y0Input = el.querySelector('#pm-y0');
  const gInput = el.querySelector('#pm-g');
  const resultsDiv = el.querySelector('#pm-results');

  function fmt(n) {
    return parseFloat(n.toFixed(4)).toString();
  }

  function calculate() {
    const v0 = parseFloat(v0Input.value);
    const angleDeg = parseFloat(angleInput.value);
    const y0 = parseFloat(y0Input.value);
    const g = parseFloat(gInput.value);

    if (isNaN(v0) || isNaN(angleDeg) || isNaN(y0) || isNaN(g) || v0 < 0 || angleDeg < 0 || angleDeg > 90 || y0 < 0 || g <= 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    const rad = angleDeg * Math.PI / 180;
    const v0x = v0 * Math.cos(rad);
    const v0y = v0 * Math.sin(rad);

    // Solve flight time: -0.5 * g * t^2 + v0y * t + y0 = 0
    // a = -0.5 * g, b = v0y, c = y0
    const a = -0.5 * g;
    const b = v0y;
    const c = y0;
    const disc = b * b - 4 * a * c;

    if (disc < 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    const t1 = (-b + Math.sqrt(disc)) / (2 * a);
    const t2 = (-b - Math.sqrt(disc)) / (2 * a);
    const t = Math.max(t1, t2); // select the positive time

    const range = v0x * t;
    const tPeak = v0y / g;
    const maxH = y0 + (v0y * v0y) / (2 * g);
    const xPeak = v0x * tPeak;

    // Final velocity components at impact
    const vfx = v0x;
    const vfy = v0y - g * t;
    const vf = Math.sqrt(vfx * vfx + vfy * vfy);

    el.querySelector('#pm-range').textContent = fmt(range) + ' m';
    el.querySelector('#pm-max-h').textContent = fmt(maxH) + ' m';
    el.querySelector('#pm-time').textContent = fmt(t) + ' s';
    el.querySelector('#pm-v-impact').textContent = fmt(vf) + ' m/s';
    el.querySelector('#pm-peak-x').textContent = fmt(xPeak);
    el.querySelector('#pm-peak-y').textContent = fmt(maxH);

    resultsDiv.style.display = '';
  }

  [v0Input, angleInput, y0Input, gInput].forEach(i => i.addEventListener('input', calculate));
  calculate();

  return () => [v0Input, angleInput, y0Input, gInput].forEach(i => i.removeEventListener('input', calculate));
}
