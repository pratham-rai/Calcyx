export const meta = {
  slug: 'conversion-rate',
  title: 'Marketing Conversion Rate',
  description: 'Calculate marketing conversion rates, total clicks/visitors, or number of conversions.',
  category: 'business',
  icon: '🎯',
  relatedSlugs: ['cac-ltv', 'percentage'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Solve For</label>
        <select id="cr-solve" class="form-control">
          <option value="rate">Conversion Rate (%)</option>
          <option value="conversions">Number of Conversions</option>
          <option value="visitors">Total Visitors / Clicks</option>
        </select>
      </div>

      <div class="form-group" id="cr-group-visitors">
        <label class="form-label">Total Visitors / Clicks</label>
        <input type="number" id="cr-visitors" class="form-control" value="10000" min="1" />
      </div>

      <div class="form-group" id="cr-group-conversions">
        <label class="form-label">Conversions</label>
        <input type="number" id="cr-conversions" class="form-control" value="250" min="0" />
      </div>

      <div class="form-group" id="cr-group-rate" style="display:none;">
        <label class="form-label">Conversion Rate (%)</label>
        <input type="number" id="cr-rate" class="form-control" value="2.5" min="0" max="100" step="0.01" />
      </div>
    </div>

    <div class="calc-result-section" id="cr-results" style="display:none;">
      <div class="glass-card" style="padding:1.5rem;text-align:center;margin-bottom:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);" id="cr-res-label">Result</div>
        <div id="cr-res-val" style="font-size:2.5rem;font-weight:800;color:var(--primary-color);"></div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Formula</h3>
      <p><strong>Conversion Rate</strong> = (Conversions ÷ Total Visitors) × 100%</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const solveSelect = el.querySelector('#cr-solve');
  const visitorsInput = el.querySelector('#cr-visitors');
  const conversionsInput = el.querySelector('#cr-conversions');
  const rateInput = el.querySelector('#cr-rate');
  const resultsDiv = el.querySelector('#cr-results');
  const resLabel = el.querySelector('#cr-res-label');
  const resVal = el.querySelector('#cr-res-val');

  const inputs = {
    visitors: el.querySelector('#cr-group-visitors'),
    conversions: el.querySelector('#cr-group-conversions'),
    rate: el.querySelector('#cr-group-rate'),
  };

  function updateSolve() {
    const s = solveSelect.value;
    Object.keys(inputs).forEach(k => {
      inputs[k].style.display = k === s ? 'none' : '';
    });
    calculate();
  }

  function calculate() {
    const s = solveSelect.value;
    const visitors = parseFloat(visitorsInput.value);
    const conversions = parseFloat(conversionsInput.value);
    const rate = parseFloat(rateInput.value);

    let result = NaN;
    let label = '';
    let unit = '';

    if (s === 'rate') {
      if (!isNaN(visitors) && !isNaN(conversions) && visitors > 0) {
        result = (conversions / visitors) * 100;
        label = 'Conversion Rate';
        unit = '%';
      }
    } else if (s === 'conversions') {
      if (!isNaN(visitors) && !isNaN(rate)) {
        result = (rate / 100) * visitors;
        label = 'Expected Conversions';
      }
    } else if (s === 'visitors') {
      if (!isNaN(conversions) && !isNaN(rate) && rate > 0) {
        result = conversions / (rate / 100);
        label = 'Required Visitors / Clicks';
      }
    }

    if (isNaN(result) || result < 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    resLabel.textContent = label;
    if (s === 'rate') {
      resVal.textContent = result.toFixed(2) + unit;
    } else {
      resVal.textContent = Math.round(result).toLocaleString();
    }

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
