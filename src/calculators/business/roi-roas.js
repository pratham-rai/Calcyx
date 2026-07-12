export const meta = {
  slug: 'roi-roas',
  title: 'ROI & ROAS Calculator',
  description: 'Calculate Return on Investment (ROI) and Return on Ad Spend (ROAS) for marketing campaigns and investments.',
  category: 'business',
  icon: '💸',
  relatedSlugs: ['cac-ltv', 'conversion-rate'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Total Ad Spend / Cost of Investment ($)</label>
        <input type="number" id="rr-cost" class="form-control" value="2000" min="1" step="any" />
      </div>
      <div class="form-group">
        <label class="form-label">Total Revenue Generated ($)</label>
        <input type="number" id="rr-revenue" class="form-control" value="6000" min="0" step="any" />
      </div>
      <div class="form-group">
        <label class="form-label">Other Marketing Expenses (optional, $)</label>
        <input type="number" id="rr-extra" class="form-control" value="500" min="0" step="any" />
      </div>
    </div>

    <div class="calc-result-section" id="rr-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Return on Investment (ROI)</div>
          <div id="rr-res-roi" style="font-size:2rem;font-weight:800;color:var(--primary-color);"></div>
          <div style="font-size:0.75rem;color:var(--text-secondary);">Net Profit / Total Cost</div>
        </div>
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Return on Ad Spend (ROAS)</div>
          <div id="rr-res-roas" style="font-size:2rem;font-weight:800;color:var(--secondary-color);"></div>
          <div style="font-size:0.75rem;color:var(--text-secondary);">Revenue / Ad Spend</div>
        </div>
      </div>
      <div class="glass-card" style="padding:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">
          Total Cost: <strong id="rr-total-cost"></strong> &nbsp;|&nbsp; Net Profit: <strong id="rr-net-profit"></strong>
        </div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Formulas</h3>
      <p><strong>ROAS</strong> = Revenue ÷ Ad Spend (expressed as ratio like 3:1 or 300%)</p>
      <p><strong>ROI</strong> = (Revenue − Total Cost) ÷ Total Cost × 100%</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const costInput = el.querySelector('#rr-cost');
  const revInput = el.querySelector('#rr-revenue');
  const extraInput = el.querySelector('#rr-extra');
  const resultsDiv = el.querySelector('#rr-results');

  function calculate() {
    const adSpend = parseFloat(costInput.value);
    const rev = parseFloat(revInput.value);
    const extra = parseFloat(extraInput.value) || 0;

    if (isNaN(adSpend) || isNaN(rev) || adSpend <= 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    const totalCost = adSpend + extra;
    const netProfit = rev - totalCost;
    const roi = (netProfit / totalCost) * 100;
    const roas = rev / adSpend;

    el.querySelector('#rr-res-roi').textContent = `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;
    el.querySelector('#rr-res-roi').style.color = roi >= 0 ? '#22c55e' : '#ef4444';

    el.querySelector('#rr-res-roas').textContent = `${roas.toFixed(2)}x (${(roas * 100).toFixed(0)}%)`;
    el.querySelector('#rr-total-cost').textContent = `$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    el.querySelector('#rr-net-profit').textContent = `$${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    el.querySelector('#rr-net-profit').style.color = netProfit >= 0 ? '#22c55e' : '#ef4444';

    resultsDiv.style.display = '';
  }

  [costInput, revInput, extraInput].forEach(i => i.addEventListener('input', calculate));
  calculate();

  return () => [costInput, revInput, extraInput].forEach(i => i.removeEventListener('input', calculate));
}
