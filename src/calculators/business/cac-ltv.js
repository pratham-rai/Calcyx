export const meta = {
  slug: 'cac-ltv',
  title: 'CAC & LTV Unit Economics',
  description: 'Evaluate your business unit economics — calculate Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV), and LTV:CAC ratios.',
  category: 'business',
  icon: '📈',
  relatedSlugs: ['roi-roas', 'cagr'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div style="font-weight:600;margin-bottom:0.5rem;font-size:0.95rem;">Customer Acquisition Cost (CAC)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div class="form-group">
          <label class="form-label">Total Sales & Marketing Spend ($)</label>
          <input type="number" id="cl-sales-spend" class="form-control" value="5000" min="0" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">New Customers Acquired</label>
          <input type="number" id="cl-new-custs" class="form-control" value="100" min="1" />
        </div>
      </div>

      <div style="font-weight:600;margin-bottom:0.5rem;font-size:0.95rem;">Customer Lifetime Value (LTV)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-bottom:1rem;">
        <div class="form-group">
          <label class="form-label">Avg Order Value ($)</label>
          <input type="number" id="cl-aov" class="form-control" value="50" min="0" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Purchase Freq (per year)</label>
          <input type="number" id="cl-freq" class="form-control" value="4" min="0.1" step="any" />
        </div>
        <div class="form-group">
          <label class="form-label">Gross Margin (%)</label>
          <input type="number" id="cl-margin" class="form-control" value="70" min="1" max="100" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Average Customer Lifespan (years)</label>
        <input type="number" id="cl-lifespan" class="form-control" value="3" min="0.1" step="any" />
      </div>
    </div>

    <div class="calc-result-section" id="cl-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">CAC</div>
          <div id="cl-res-cac" style="font-size:1.5rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">LTV (Gross)</div>
          <div id="cl-res-ltv" style="font-size:1.5rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;border:2px solid var(--primary-color);" id="cl-ratio-card">
          <div style="font-size:0.75rem;color:var(--text-secondary);">LTV : CAC Ratio</div>
          <div id="cl-res-ratio" style="font-size:1.6rem;font-weight:800;"></div>
        </div>
      </div>

      <div class="glass-card" style="padding:1rem;margin-bottom:1rem;">
        <div style="font-weight:600;margin-bottom:0.35rem;" id="cl-health-title"></div>
        <div style="font-size:0.85rem;color:var(--text-secondary);" id="cl-health-desc"></div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Key Concepts</h3>
      <p><strong>CAC</strong> = Total Marketing Spend ÷ New Customers Acquired</p>
      <p><strong>LTV</strong> = Average Order Value × Purchase Frequency × Customer Lifespan × Gross Margin %</p>
      <p><strong>LTV : CAC benchmark:</strong> &lt; 1:1 is losing money, 3:1 is healthy/ideal, &gt; 5:1 means you could be growing faster by investing more in acquisition.</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const spendInput = el.querySelector('#cl-sales-spend');
  const custsInput = el.querySelector('#cl-new-custs');
  const aovInput = el.querySelector('#cl-aov');
  const freqInput = el.querySelector('#cl-freq');
  const marginInput = el.querySelector('#cl-margin');
  const lifespanInput = el.querySelector('#cl-lifespan');
  const resultsDiv = el.querySelector('#cl-results');
  const ratioCard = el.querySelector('#cl-ratio-card');

  function calculate() {
    const spend = parseFloat(spendInput.value);
    const custs = parseFloat(custsInput.value);
    const aov = parseFloat(aovInput.value);
    const freq = parseFloat(freqInput.value);
    const margin = parseFloat(marginInput.value) / 100;
    const lifespan = parseFloat(lifespanInput.value);

    if (isNaN(spend) || isNaN(custs) || isNaN(aov) || isNaN(freq) || isNaN(margin) || isNaN(lifespan) || custs <= 0 || lifespan <= 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    const cac = spend / custs;
    const ltv = aov * freq * lifespan * margin;
    const ratio = cac > 0 ? ltv / cac : 0;

    el.querySelector('#cl-res-cac').textContent = `$${cac.toFixed(2)}`;
    el.querySelector('#cl-res-ltv').textContent = `$${ltv.toFixed(2)}`;

    const ratioText = cac > 0 ? `${ratio.toFixed(1)}x` : 'N/A';
    el.querySelector('#cl-res-ratio').textContent = ratioText;

    let color = '#ef4444', title = '⚠️ Unhealthy Unit Economics', desc = 'Your CAC is higher than or equal to the LTV. You are losing money on each acquired customer.';
    if (ratio >= 5) {
      color = '#3b82f6';
      title = '💡 Highly Profitable (Underinvested)';
      desc = 'Your LTV:CAC ratio is extremely high (> 5x). While highly profitable, you are likely leaving growth on the table and should increase marketing spend.';
    } else if (ratio >= 3) {
      color = '#22c55e';
      title = '✅ Ideal Unit Economics';
      desc = 'An LTV:CAC ratio of 3x to 4x is the gold standard for sustainable, venture-scale business models.';
    } else if (ratio >= 1.5) {
      color = '#eab308';
      title = '😶 Borderline Unit Economics';
      desc = 'Your LTV:CAC is between 1.5x and 3x. The business is viable but margins are tight. Focus on retention or reducing acquisition costs.';
    }

    el.querySelector('#cl-res-ratio').style.color = color;
    ratioCard.style.borderColor = color;
    el.querySelector('#cl-health-title').textContent = title;
    el.querySelector('#cl-health-title').style.color = color;
    el.querySelector('#cl-health-desc').textContent = desc;

    resultsDiv.style.display = '';
  }

  [spendInput, custsInput, aovInput, freqInput, marginInput, lifespanInput].forEach(i => i.addEventListener('input', calculate));
  calculate();

  return () => [spendInput, custsInput, aovInput, freqInput, marginInput, lifespanInput].forEach(i => i.removeEventListener('input', calculate));
}
