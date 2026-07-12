export const meta = {
  slug: 'cpm',
  title: 'CPM Ad Cost Calculator',
  description: 'Solve Cost Per Mille (CPM) ad campaign metrics — calculate cost, impressions, or CPM rate.',
  category: 'business',
  icon: '📺',
  relatedSlugs: ['roi-roas', 'conversion-rate'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Solve For</label>
        <select id="cpm-solve" class="form-control">
          <option value="cpm">CPM Rate ($)</option>
          <option value="cost">Total Cost ($)</option>
          <option value="impressions">Total Impressions</option>
        </select>
      </div>

      <div class="form-group" id="cpm-group-cost">
        <label class="form-label">Total Cost ($)</label>
        <input type="number" id="cpm-cost" class="form-control" value="500" min="0.01" step="any" />
      </div>

      <div class="form-group" id="cpm-group-impressions">
        <label class="form-label">Total Impressions</label>
        <input type="number" id="cpm-impressions" class="form-control" value="50000" min="1" />
      </div>

      <div class="form-group" id="cpm-group-cpm" style="display:none;">
        <label class="form-label">CPM Rate ($ per 1,000 impressions)</label>
        <input type="number" id="cpm-cpm" class="form-control" value="10" min="0.01" step="any" />
      </div>
    </div>

    <div class="calc-result-section" id="cpm-results" style="display:none;">
      <div class="glass-card" style="padding:1.5rem;text-align:center;margin-bottom:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);" id="cpm-res-label">Result</div>
        <div id="cpm-res-val" style="font-size:2.5rem;font-weight:800;color:var(--primary-color);"></div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Formula</h3>
      <p><strong>CPM</strong> = (Total Cost ÷ Total Impressions) × 1,000</p>
      <p>Where CPM is the Cost Per Mille (Mille is Latin for thousand), representing cost per 1,000 ad views.</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const solveSelect = el.querySelector('#cpm-solve');
  const costInput = el.querySelector('#cpm-cost');
  const impressionsInput = el.querySelector('#cpm-impressions');
  const cpmInput = el.querySelector('#cpm-cpm');
  const resultsDiv = el.querySelector('#cpm-results');
  const resLabel = el.querySelector('#cpm-res-label');
  const resVal = el.querySelector('#cpm-res-val');

  const inputs = {
    cost: el.querySelector('#cpm-group-cost'),
    impressions: el.querySelector('#cpm-group-impressions'),
    cpm: el.querySelector('#cpm-group-cpm'),
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
    const cost = parseFloat(costInput.value);
    const impressions = parseFloat(impressionsInput.value);
    const cpm = parseFloat(cpmInput.value);

    let result = NaN;
    let label = '';

    if (s === 'cpm') {
      if (!isNaN(cost) && !isNaN(impressions) && impressions > 0) {
        result = (cost / impressions) * 1000;
        label = 'CPM Rate';
      }
    } else if (s === 'cost') {
      if (!isNaN(impressions) && !isNaN(cpm)) {
        result = (impressions / 1000) * cpm;
        label = 'Total Cost';
      }
    } else if (s === 'impressions') {
      if (!isNaN(cost) && !isNaN(cpm) && cpm > 0) {
        result = (cost / cpm) * 1000;
        label = 'Total Impressions';
      }
    }

    if (isNaN(result) || result < 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    resLabel.textContent = label;
    if (s === 'impressions') {
      resVal.textContent = Math.round(result).toLocaleString();
    } else {
      resVal.textContent = `$${result.toFixed(2)}`;
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
