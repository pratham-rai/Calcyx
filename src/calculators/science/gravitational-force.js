export const meta = {
  slug: 'gravitational-force',
  title: 'Gravitational Force Calculator',
  description: 'Calculate the gravitational attraction between two masses at a distance using Newtons Law of Universal Gravitation.',
  category: 'science',
  icon: '🌌',
  relatedSlugs: ['triangle', 'scientific-notation'],
};

const G_CONST = 6.6743e-11;

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Mass of Body 1 (m₁) — kg</label>
          <input type="number" id="gf-m1" class="form-control" value="5.972e24" step="any" placeholder="e.g. 5.972e24" />
        </div>
        <div class="form-group">
          <label class="form-label">Mass of Body 2 (m₂) — kg</label>
          <input type="number" id="gf-m2" class="form-control" value="7.348e22" step="any" placeholder="e.g. 7.348e22" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Distance between centers (r) — meters</label>
        <input type="number" id="gf-r" class="form-control" value="3.844e8" step="any" placeholder="e.g. 3.844e8" />
      </div>
      <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:-0.5rem;margin-bottom:1rem;">Default values represent the Earth-Moon system attraction. Exponential notation like "6e24" is supported.</div>
    </div>

    <div class="calc-result-section" id="gf-results" style="display:none;">
      <div class="glass-card" style="padding:1.5rem;text-align:center;margin-bottom:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">Gravitational Force (F)</div>
        <div id="gf-val" style="font-size:2.2rem;font-weight:800;color:var(--primary-color);"></div>
        <div style="font-size:0.8rem;color:var(--text-secondary);">Newtons (N)</div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Formula</h3>
      <p><strong>Newton's Law of Universal Gravitation:</strong> F = G × (m₁ × m₂) / r²</p>
      <p>Where G = Gravitational Constant ≈ 6.6743 × 10⁻¹¹ N·m²/kg².</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const m1Input = el.querySelector('#gf-m1');
  const m2Input = el.querySelector('#gf-m2');
  const rInput = el.querySelector('#gf-r');
  const resultsDiv = el.querySelector('#gf-results');
  const valDiv = el.querySelector('#gf-val');

  function fmt(n) {
    if (n > 10000 || n < 0.01) return n.toExponential(4);
    return parseFloat(n.toFixed(6)).toString();
  }

  function calculate() {
    const m1 = parseFloat(m1Input.value);
    const m2 = parseFloat(m2Input.value);
    const r = parseFloat(rInput.value);

    if (isNaN(m1) || isNaN(m2) || isNaN(r) || m1 <= 0 || m2 <= 0 || r <= 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    const force = G_CONST * (m1 * m2) / (r * r);

    valDiv.textContent = fmt(force);
    resultsDiv.style.display = '';
  }

  [m1Input, m2Input, rInput].forEach(i => i.addEventListener('input', calculate));
  calculate();

  return () => [m1Input, m2Input, rInput].forEach(i => i.removeEventListener('input', calculate));
}
