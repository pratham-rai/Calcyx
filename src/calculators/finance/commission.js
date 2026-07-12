export const meta = {
  slug: 'commission',
  name: 'Sales Commission Calculator',
  title: 'Sales Commission Calculator - Calcyx',
  description: 'Calculate sales commission earnings using flat rate or tiered/graduated structures. Compute total pay including base salary.',
  category: 'finance',
  icon: '💼',
  keywords: ['commission', 'sales commission', 'sales salary', 'tiered commission', 'sales commission calculator', 'paycheck'],
  formula: '\\text{Total Pay} = \\text{Base Salary} + \\text{Commission}',
  relatedSlugs: ['salary', 'discount']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>

      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="comm-base">Base Salary ($)</label>
            <input type="number" id="comm-base" class="calc-input" placeholder="e.g. 3000" min="0" step="100">
          </div>
          <div class="calc-input-group">
            <label for="comm-sales">Sales Volume ($)</label>
            <input type="number" id="comm-sales" class="calc-input" placeholder="e.g. 75000" min="0" step="500">
          </div>
        </div>
        
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="comm-type">Commission Structure</label>
            <select id="comm-type" class="calc-select">
              <option value="flat">Flat Rate</option>
              <option value="tiered">Tiered / Graduated</option>
            </select>
          </div>
          <div class="calc-input-group" id="comm-rate-group">
            <label for="comm-rate">Commission Rate (%)</label>
            <input type="number" id="comm-rate" class="calc-input" placeholder="e.g. 5" min="0" max="100" step="0.1">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Base Salary</span>
            <span class="calc-result-value" id="res-base"></span>
            <span class="calc-result-detail">Fixed monthly pay</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Commission</span>
            <span class="calc-result-value" id="res-comm"></span>
            <span class="calc-result-detail">Variable commission pay</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Pay</span>
            <span class="calc-result-value" id="res-total"></span>
            <span class="calc-result-detail">Base + Commission</span>
          </div>
        </div>

        <div id="tier-breakdown-section" style="margin-top: 25px; display: none;">
          <h4 style="margin: 0 0 12px; font-size: 1.05rem; opacity: 0.9; text-align: left;">Tiered Breakdown</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left; min-width: 280px;">
            <thead>
              <tr style="border-bottom: 2px solid rgba(255, 255, 255, 0.15); opacity: 0.8;">
                <th style="padding: 8px 6px;">Tier Bracket</th>
                <th style="padding: 8px 6px; text-align: right;">Sales in Tier</th>
                <th style="padding: 8px 6px; text-align: right;">Commission</th>
              </tr>
            </thead>
            <tbody id="tier-breakdown-body">
              <!-- Populated dynamically -->
            </tbody>
          </table>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Commission Formulas</h3>
        <p><strong>Flat Rate:</strong> Commission is computed as a fixed percentage of all sales.</p>
        <code>Commission = Sales Volume &times; (Commission Rate / 100)</code>
        <p style="margin-top: 12px;"><strong>Tiered / Graduated Structure:</strong> Higher commission rates apply as sales reach higher brackets. Our standard rates are:</p>
        <code>
          First $10,000 of sales: 2.0% commission<br>
          Next $40,000 (up to $50,000): 5.0% commission<br>
          Remaining sales (over $50,000): 10.0% commission
        </code>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const baseInput = document.getElementById('comm-base');
  const salesInput = document.getElementById('comm-sales');
  const typeSelect = document.getElementById('comm-type');
  const rateInput = document.getElementById('comm-rate');
  const rateGroup = document.getElementById('comm-rate-group');
  
  const resultDiv = document.getElementById('result');
  const resBase = document.getElementById('res-base');
  const resComm = document.getElementById('res-comm');
  const resTotal = document.getElementById('res-total');
  
  const tierSection = document.getElementById('tier-breakdown-section');
  const tierBody = document.getElementById('tier-breakdown-body');

  function formatCurrency(val) {
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function handleTypeChange() {
    if (typeSelect.value === 'tiered') {
      rateGroup.style.display = 'none';
    } else {
      rateGroup.style.display = '';
    }
    calculate();
  }

  function calculate() {
    const base = parseFloat(baseInput.value) || 0;
    const sales = parseFloat(salesInput.value);
    const type = typeSelect.value;
    const rate = parseFloat(rateInput.value);

    // Validate base pay and sales
    if (isNaN(sales) || sales < 0 || base < 0) {
      resultDiv.style.display = 'none';
      return;
    }

    if (type === 'flat' && (isNaN(rate) || rate < 0)) {
      resultDiv.style.display = 'none';
      return;
    }

    let commission = 0;
    let tiers = [];

    if (type === 'flat') {
      commission = sales * (rate / 100);
      tierSection.style.display = 'none';
    } else {
      // Tiered: 0-$10k @ 2%, $10k-$50k @ 5%, >$50k @ 10%
      if (sales <= 10000) {
        const c1 = sales * 0.02;
        commission = c1;
        tiers.push({ range: '$0 - $10,000 (2%)', sales: sales, earned: c1 });
      } else if (sales <= 50000) {
        const c1 = 10000 * 0.02;
        const s2 = sales - 10000;
        const c2 = s2 * 0.05;
        commission = c1 + c2;
        tiers.push({ range: '$0 - $10,000 (2%)', sales: 10000, earned: c1 });
        tiers.push({ range: '$10,000 - $50,000 (5%)', sales: s2, earned: c2 });
      } else {
        const c1 = 10000 * 0.02;
        const c2 = 40000 * 0.05;
        const s3 = sales - 50000;
        const c3 = s3 * 0.10;
        commission = c1 + c2 + c3;
        tiers.push({ range: '$0 - $10,000 (2%)', sales: 10000, earned: c1 });
        tiers.push({ range: '$10,000 - $50,000 (5%)', sales: 40000, earned: c2 });
        tiers.push({ range: 'Over $50,000 (10%)', sales: s3, earned: c3 });
      }

      // Populate Tiered Breakdown Table
      let tableHtml = '';
      tiers.forEach(t => {
        tableHtml += `
          <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
            <td style="padding: 8px 6px; opacity: 0.95;">${t.range}</td>
            <td style="padding: 8px 6px; text-align: right;">${formatCurrency(t.sales)}</td>
            <td style="padding: 8px 6px; text-align: right; font-weight: 600; color: #10b981;">${formatCurrency(t.earned)}</td>
          </tr>
        `;
      });
      tierBody.innerHTML = tableHtml;
      tierSection.style.display = '';
    }

    const total = base + commission;

    resBase.textContent = formatCurrency(base);
    resComm.textContent = formatCurrency(commission);
    resTotal.textContent = formatCurrency(total);

    resultDiv.style.display = '';
  }

  baseInput.addEventListener('input', calculate);
  salesInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);
  typeSelect.addEventListener('change', handleTypeChange);

  // Initial layout configuration
  handleTypeChange();

  return function cleanup() {
    baseInput.removeEventListener('input', calculate);
    salesInput.removeEventListener('input', calculate);
    rateInput.removeEventListener('input', calculate);
    typeSelect.removeEventListener('change', handleTypeChange);
  };
}
