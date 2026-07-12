export const meta = {
  slug: 'half-life',
  title: 'Radioactive Half-Life',
  description: 'Solve radioactive decay properties — initial quantity, remaining quantity, half-life, or time elapsed.',
  category: 'science',
  icon: '☢️',
  relatedSlugs: ['series', 'logarithm'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Solve For</label>
        <select id="hl-solve" class="form-control">
          <option value="nt">Remaining Quantity (Nₜ)</option>
          <option value="n0">Initial Quantity (N₀)</option>
          <option value="t12">Half-Life (t₁/₂)</option>
          <option value="t">Time Elapsed (t)</option>
        </select>
      </div>

      <div class="form-group" id="hl-group-n0">
        <label class="form-label">Initial Quantity (N₀)</label>
        <input type="number" id="hl-n0" class="form-control" value="100" min="0" step="any" />
      </div>

      <div class="form-group" id="hl-group-nt" style="display:none;">
        <label class="form-label">Remaining Quantity (Nₜ)</label>
        <input type="number" id="hl-nt" class="form-control" value="25" min="0" step="any" />
      </div>

      <div class="form-group" id="hl-group-t12">
        <label class="form-label">Half-Life (t₁/₂)</label>
        <input type="number" id="hl-t12" class="form-control" value="8" min="0.000001" step="any" />
      </div>

      <div class="form-group" id="hl-group-t">
        <label class="form-label">Time Elapsed (t)</label>
        <input type="number" id="hl-t" class="form-control" value="16" min="0" step="any" />
      </div>
    </div>

    <div class="calc-result-section" id="hl-results" style="display:none;">
      <div class="glass-card" style="padding:1.5rem;text-align:center;margin-bottom:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);" id="hl-res-label">Result</div>
        <div id="hl-res-val" style="font-size:2.2rem;font-weight:800;color:var(--primary-color);"></div>
      </div>

      <div class="glass-card" style="padding:1rem;">
        <div style="font-weight:600;margin-bottom:0.75rem;">🗓 Decay Milestones</div>
        <div id="hl-milestones"></div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Formula</h3>
      <p><strong>Decay Equation:</strong> Nₜ = N₀ × (1/2)<sup>t / t₁/₂</sup></p>
      <p>Where Nₜ = remaining amount, N₀ = initial amount, t = time elapsed, t₁/₂ = half-life.</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const solveSelect = el.querySelector('#hl-solve');
  const n0Input = el.querySelector('#hl-n0');
  const ntInput = el.querySelector('#hl-nt');
  const t12Input = el.querySelector('#hl-t12');
  const tInput = el.querySelector('#hl-t');
  const resultsDiv = el.querySelector('#hl-results');
  const resLabel = el.querySelector('#hl-res-label');
  const resVal = el.querySelector('#hl-res-val');
  const milestonesDiv = el.querySelector('#hl-milestones');

  const inputs = {
    n0: el.querySelector('#hl-group-n0'),
    nt: el.querySelector('#hl-group-nt'),
    t12: el.querySelector('#hl-group-t12'),
    t: el.querySelector('#hl-group-t'),
  };

  function updateSolve() {
    const s = solveSelect.value;
    Object.keys(inputs).forEach(k => {
      inputs[k].style.display = k === s ? 'none' : '';
    });
    calculate();
  }

  function fmt(n) {
    return parseFloat(n.toFixed(6)).toString();
  }

  function calculate() {
    const s = solveSelect.value;
    const n0 = parseFloat(n0Input.value);
    const nt = parseFloat(ntInput.value);
    const t12 = parseFloat(t12Input.value);
    const t = parseFloat(tInput.value);

    let result = NaN;
    let label = '';
    let calN0 = n0, calNt = nt, calT = t, calT12 = t12;

    if (s === 'nt') {
      if (!isNaN(n0) && !isNaN(t12) && !isNaN(t)) {
        result = n0 * Math.pow(0.5, t / t12);
        calNt = result;
        label = 'Remaining Quantity (Nₜ)';
      }
    } else if (s === 'n0') {
      if (!isNaN(nt) && !isNaN(t12) && !isNaN(t)) {
        result = nt / Math.pow(0.5, t / t12);
        calN0 = result;
        label = 'Initial Quantity (N₀)';
      }
    } else if (s === 't12') {
      if (!isNaN(n0) && !isNaN(nt) && !isNaN(t) && n0 > 0 && nt > 0) {
        result = t / (Math.log(nt / n0) / Math.log(0.5));
        calT12 = result;
        label = 'Half-Life (t₁/₂)';
      }
    } else if (s === 't') {
      if (!isNaN(n0) && !isNaN(nt) && !isNaN(t12) && n0 > 0 && nt > 0) {
        result = t12 * (Math.log(nt / n0) / Math.log(0.5));
        calT = result;
        label = 'Time Elapsed (t)';
      }
    }

    if (isNaN(result) || !isFinite(result) || result < 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    resLabel.textContent = label;
    resVal.textContent = fmt(result);

    // Milestones (0, 1, 2, 3 half-lives)
    const milestones = [];
    for (let i = 0; i <= 4; i++) {
      const msTime = i * calT12;
      const msAmt = calN0 * Math.pow(0.5, i);
      const isPast = calT >= msTime;
      milestones.push(`
        <div style="display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid var(--border-color);font-size:0.85rem;color:${isPast ? 'var(--text-primary)' : 'var(--text-secondary)'};">
          <span>${i} Half-life (${fmt(msTime)} time units)</span>
          <span class="text-mono" style="font-weight:600;">${fmt(msAmt)} (${(Math.pow(0.5, i)*100).toFixed(1)}%)</span>
        </div>
      `);
    }
    milestonesDiv.innerHTML = milestones.join('');

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
