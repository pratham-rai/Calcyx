export const meta = {
  slug: 'ratio',
  title: 'Ratio & Proportion',
  description: 'Simplify ratios, solve proportions, scale recipes, and divide quantities.',
  category: 'math',
  icon: '⚖️',
  relatedSlugs: ['percentage', 'fraction'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group" style="margin-bottom:1rem;">
        <label class="form-label">Mode</label>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button id="r-mode-simplify" class="btn btn-primary" style="flex:1;min-width:120px;">Simplify Ratio</button>
          <button id="r-mode-proportion" class="btn btn-secondary" style="flex:1;min-width:120px;">Solve Proportion</button>
          <button id="r-mode-divide" class="btn btn-secondary" style="flex:1;min-width:120px;">Divide by Ratio</button>
        </div>
      </div>

      <div id="r-simplify-inputs">
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <input type="number" id="r-s-a" class="form-control" value="12" min="0" step="any" style="flex:1;" />
          <span style="font-size:1.5rem;font-weight:600;">:</span>
          <input type="number" id="r-s-b" class="form-control" value="18" min="0" step="any" style="flex:1;" />
          <span style="font-size:1.5rem;font-weight:600;">:</span>
          <input type="number" id="r-s-c" class="form-control" value="" min="0" step="any" style="flex:1;" placeholder="opt" />
        </div>
      </div>

      <div id="r-proportion-inputs" style="display:none;">
        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
          <input type="number" id="r-p-a" class="form-control" value="3" step="any" style="flex:1;min-width:60px;" />
          <span>:</span>
          <input type="number" id="r-p-b" class="form-control" value="4" step="any" style="flex:1;min-width:60px;" />
          <span>=</span>
          <input type="number" id="r-p-c" class="form-control" value="9" step="any" style="flex:1;min-width:60px;" />
          <span>:</span>
          <input type="number" id="r-p-d" class="form-control" value="" step="any" style="flex:1;min-width:60px;" placeholder="?" disabled style="background:var(--bg-secondary);" />
        </div>
        <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.4rem;">Fill in 3 values; the 4th (?) is computed.</div>
      </div>

      <div id="r-divide-inputs" style="display:none;">
        <div class="form-group">
          <label class="form-label">Total Quantity</label>
          <input type="number" id="r-d-total" class="form-control" value="100" step="any" />
        </div>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <input type="number" id="r-d-a" class="form-control" value="2" min="0" step="any" style="flex:1;" />
          <span style="font-size:1.5rem;font-weight:600;">:</span>
          <input type="number" id="r-d-b" class="form-control" value="3" min="0" step="any" style="flex:1;" />
          <span style="font-size:1.5rem;font-weight:600;">:</span>
          <input type="number" id="r-d-c" class="form-control" value="" min="0" step="any" style="flex:1;" placeholder="opt" />
        </div>
      </div>
    </div>

    <div class="calc-result-section" id="r-results" style="display:none;"></div>

    <div class="calc-formula">
      <h3>Key Concepts</h3>
      <p><strong>Simplify:</strong> Divide each part by the GCD.</p>
      <p><strong>Proportion:</strong> a:b = c:d → d = b×c/a</p>
      <p><strong>Divide:</strong> Each share = (part / total_parts) × quantity</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  let mode = 'simplify';
  const resultsDiv = el.querySelector('#r-results');

  const modeMap = {
    simplify: el.querySelector('#r-simplify-inputs'),
    proportion: el.querySelector('#r-proportion-inputs'),
    divide: el.querySelector('#r-divide-inputs'),
  };

  const btns = {
    simplify: el.querySelector('#r-mode-simplify'),
    proportion: el.querySelector('#r-mode-proportion'),
    divide: el.querySelector('#r-mode-divide'),
  };

  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

  function setMode(m) {
    mode = m;
    Object.keys(btns).forEach(k => btns[k].className = k === m ? 'btn btn-primary' : 'btn btn-secondary');
    Object.keys(modeMap).forEach(k => modeMap[k].style.display = k === m ? '' : 'none');
    calculate();
  }

  function showResult(html) {
    resultsDiv.innerHTML = html;
    resultsDiv.style.display = '';
  }

  function calculate() {
    if (mode === 'simplify') {
      const a = parseFloat(el.querySelector('#r-s-a').value);
      const b = parseFloat(el.querySelector('#r-s-b').value);
      const c = parseFloat(el.querySelector('#r-s-c').value);
      if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) { resultsDiv.style.display = 'none'; return; }
      const useC = !isNaN(c) && c > 0;
      let divisor = gcd(Math.round(a), Math.round(b));
      if (useC) divisor = gcd(divisor, Math.round(c));
      const sa = a / divisor, sb = b / divisor, sc = useC ? c / divisor : null;
      const ratio = useC ? `${fmt(sa)} : ${fmt(sb)} : ${fmt(sc)}` : `${fmt(sa)} : ${fmt(sb)}`;
      showResult(`
        <div class="glass-card" style="padding:1.5rem;text-align:center;">
          <div style="font-size:0.85rem;color:var(--text-secondary);">Simplified Ratio</div>
          <div style="font-size:2.2rem;font-weight:800;color:var(--primary-color);">${ratio}</div>
          <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.5rem;">GCD = ${divisor}</div>
        </div>
        <div class="glass-card" style="padding:1rem;margin-top:0.75rem;">
          <div style="font-size:0.85rem;color:var(--text-secondary);">Decimal equivalents: A = 1, B = ${fmt(b/a)}${useC ? `, C = ${fmt(c/a)}` : ''}</div>
          <div style="font-size:0.85rem;color:var(--text-secondary);">Percentages: A = ${fmt(a/(a+b+(useC?c:0))*100)}%${useC ? '' : ''}, B = ${fmt(b/(a+b+(useC?c:0))*100)}%${useC ? `, C = ${fmt(c/(a+b+(useC?c:0))*100)}%` : ''}</div>
        </div>`);
    } else if (mode === 'proportion') {
      const a = parseFloat(el.querySelector('#r-p-a').value);
      const b = parseFloat(el.querySelector('#r-p-b').value);
      const c = parseFloat(el.querySelector('#r-p-c').value);
      if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) { resultsDiv.style.display = 'none'; return; }
      const d = b * c / a;
      showResult(`<div class="glass-card" style="padding:1.5rem;text-align:center;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">Missing value (d)</div>
        <div style="font-size:2.5rem;font-weight:800;color:var(--primary-color);">${fmt(d)}</div>
        <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.5rem;">${a} : ${b} = ${c} : <strong>${fmt(d)}</strong></div>
      </div>`);
    } else {
      const total = parseFloat(el.querySelector('#r-d-total').value);
      const a = parseFloat(el.querySelector('#r-d-a').value);
      const b = parseFloat(el.querySelector('#r-d-b').value);
      const c = parseFloat(el.querySelector('#r-d-c').value);
      const useC = !isNaN(c) && c > 0;
      if (isNaN(total) || isNaN(a) || isNaN(b) || a < 0 || b < 0) { resultsDiv.style.display = 'none'; return; }
      const sum = a + b + (useC ? c : 0);
      if (sum === 0) { resultsDiv.style.display = 'none'; return; }
      const shareA = (a / sum) * total;
      const shareB = (b / sum) * total;
      const shareC = useC ? (c / sum) * total : null;
      const parts = [
        { label: 'Part A', ratio: a, share: shareA },
        { label: 'Part B', ratio: b, share: shareB },
        ...(useC ? [{ label: 'Part C', ratio: c, share: shareC }] : []),
      ];
      showResult(`<div class="glass-card" style="padding:1rem;">
        <div style="font-weight:600;margin-bottom:0.75rem;">Shares of ${total}</div>
        ${parts.map(p => `<div style="display:flex;justify-content:space-between;padding:0.4rem 0;border-bottom:1px solid var(--border-color);">
          <span>${p.label} (ratio ${p.ratio})</span>
          <span class="text-mono" style="color:var(--primary-color);font-weight:600;">${fmt(p.share)}</span>
        </div>`).join('')}
      </div>`);
    }
  }

  function fmt(n) { return parseFloat(n.toFixed(6)).toString(); }

  Object.keys(btns).forEach(k => btns[k].addEventListener('click', () => setMode(k)));
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', calculate));

  calculate();

  return () => {
    Object.keys(btns).forEach(k => btns[k].removeEventListener('click', () => setMode(k)));
    el.querySelectorAll('input').forEach(i => i.removeEventListener('input', calculate));
  };
}
