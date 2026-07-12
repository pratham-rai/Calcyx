export const meta = {
  slug: 'linear-equations',
  title: 'Linear Equations System Solver',
  description: 'Solve systems of 2 linear equations with 2 variables step-by-step using Cramers rule.',
  category: 'math',
  icon: '🔲',
  relatedSlugs: ['matrix', 'quadratic'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem;">Solve for x and y in equations of the form:<br><strong>a₁x + b₁y = c₁</strong><br><strong>a₂x + b₂y = c₂</strong></p>
      
      <div style="font-weight:600;margin-bottom:0.5rem;font-size:0.9rem;">Equation 1</div>
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
        <input type="number" id="le-a1" class="form-control" value="2" style="flex:1;" />
        <span>x +</span>
        <input type="number" id="le-b1" class="form-control" value="3" style="flex:1;" />
        <span>y =</span>
        <input type="number" id="le-c1" class="form-control" value="12" style="flex:1;" />
      </div>

      <div style="font-weight:600;margin-bottom:0.5rem;font-size:0.9rem;">Equation 2</div>
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
        <input type="number" id="le-a2" class="form-control" value="5" style="flex:1;" />
        <span>x +</span>
        <input type="number" id="le-b2" class="form-control" value="-1" style="flex:1;" />
        <span>y =</span>
        <input type="number" id="le-c2" class="form-control" value="13" style="flex:1;" />
      </div>
    </div>

    <div class="calc-result-section" id="le-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.85rem;color:var(--text-secondary);">Solution x</div>
          <div id="le-res-x" style="font-size:2rem;font-weight:800;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.85rem;color:var(--text-secondary);">Solution y</div>
          <div id="le-res-y" style="font-size:2rem;font-weight:800;color:var(--secondary-color);"></div>
        </div>
      </div>

      <div class="glass-card" style="padding:1rem;">
        <div style="font-weight:600;margin-bottom:0.5rem;">Cramer's Rule Step-by-Step</div>
        <div id="le-steps" style="font-size:0.85rem;line-height:1.5;"></div>
      </div>
    </div>

    <div id="le-error" style="display:none;padding:1rem;border-radius:8px;background:#fee2e2;color:#dc2626;margin-top:0.5rem;font-size:0.85rem;"></div>

    <div class="calc-formula">
      <h3>Cramer's Rule Formulas</h3>
      <p>Given: a₁x + b₁y = c₁ &amp; a₂x + b₂y = c₂</p>
      <p>Determinant <strong>D</strong> = a₁b₂ - a₂b₁</p>
      <p>Determinant <strong>Dₓ</strong> = c₁b₂ - c₂b₁</p>
      <p>Determinant <strong>Dᵧ</strong> = a₁c₂ - a₂c₁</p>
      <p>If D ≠ 0: <strong>x = Dₓ/D</strong>, &nbsp; <strong>y = Dᵧ/D</strong></p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const ids = ['a1','b1','c1','a2','b2','c2'];
  const inputs = {};
  ids.forEach(id => inputs[id] = el.querySelector(`#le-${id}`));
  const resultsDiv = el.querySelector('#le-results');
  const errorDiv = el.querySelector('#le-error');

  function fmt(n) {
    return parseFloat(n.toFixed(6)).toString();
  }

  function calculate() {
    errorDiv.style.display = 'none';
    const v = {};
    let hasNaN = false;
    ids.forEach(id => {
      v[id] = parseFloat(inputs[id].value);
      if (isNaN(v[id])) hasNaN = true;
    });

    if (hasNaN) {
      resultsDiv.style.display = 'none';
      return;
    }

    const D = v.a1 * v.b2 - v.a2 * v.b1;
    const Dx = v.c1 * v.b2 - v.c2 * v.b1;
    const Dy = v.a1 * v.c2 - v.a2 * v.c1;

    if (D === 0) {
      if (Dx === 0 && Dy === 0) {
        errorDiv.textContent = 'Infinite solutions exist (dependent equations).';
      } else {
        errorDiv.textContent = 'No solution exists (inconsistent/parallel equations).';
      }
      errorDiv.style.display = '';
      resultsDiv.style.display = 'none';
      return;
    }

    const x = Dx / D;
    const y = Dy / D;

    el.querySelector('#le-res-x').textContent = fmt(x);
    el.querySelector('#le-res-y').textContent = fmt(y);

    el.querySelector('#le-steps').innerHTML = `
      1. Calculate main determinant: D = (${v.a1} × ${v.b2}) - (${v.a2} × ${v.b1}) = <strong>${fmt(D)}</strong><br>
      2. Calculate x determinant: Dₓ = (${v.c1} × ${v.b2}) - (${v.c2} × ${v.b1}) = <strong>${fmt(Dx)}</strong><br>
      3. Calculate y determinant: Dᵧ = (${v.a1} × ${v.c2}) - (${v.a2} × ${v.c1}) = <strong>${fmt(Dy)}</strong><br>
      4. Solve for x: x = Dₓ / D = ${fmt(Dx)} / ${fmt(D)} = <strong>${fmt(x)}</strong><br>
      5. Solve for y: y = Dᵧ / D = ${fmt(Dy)} / ${fmt(D)} = <strong>${fmt(y)}</strong>
    `;

    resultsDiv.style.display = '';
  }

  ids.forEach(id => inputs[id].addEventListener('input', calculate));
  calculate();

  return () => ids.forEach(id => inputs[id].removeEventListener('input', calculate));
}
