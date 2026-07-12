export const meta = {
  slug: 'discount',
  name: 'Discount / Margin Calculator',
  title: 'Discount / Margin Calculator - Calcyx',
  description: 'Calculate discount savings, final price after discount, and compute profit margin or markup from cost to selling price.',
  category: 'finance',
  icon: '🏷️',
  keywords: ['discount', 'sale', 'savings', 'margin', 'markup', 'profit', 'price'],
  formula: 'Discount = Price \\times \\frac{Discount\\%}{100}',
  relatedSlugs: ['tip', 'percentage']
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
        <h3 style="margin:0 0 8px">🛒 Discount Calculator</h3>

        <div class="calc-input-group">
          <label for="disc-price">Original Price ($)</label>
          <input type="number" id="disc-price" class="calc-input" placeholder="e.g. 120" min="0" step="0.01">
        </div>

        <div class="calc-input-group">
          <label for="disc-pct">Discount (%)</label>
          <input type="number" id="disc-pct" class="calc-input" placeholder="e.g. 25" min="0" max="100" step="0.5">
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">You Save</span>
            <span class="calc-result-value" id="disc-saving"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Final Price</span>
            <span class="calc-result-value" id="disc-final"></span>
          </div>
        </div>
      </div>

      <div class="calc-body" style="margin-top:24px">
        <h3 style="margin:0 0 8px">📊 Markup / Margin</h3>

        <div class="calc-input-group">
          <label for="margin-cost">Cost Price ($)</label>
          <input type="number" id="margin-cost" class="calc-input" placeholder="e.g. 60" min="0" step="0.01">
        </div>

        <div class="calc-input-group">
          <label for="margin-sell">Selling Price ($)</label>
          <input type="number" id="margin-sell" class="calc-input" placeholder="e.g. 100" min="0" step="0.01">
        </div>
      </div>

      <div id="margin-result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Profit</span>
            <span class="calc-result-value" id="margin-profit"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Markup %</span>
            <span class="calc-result-value" id="margin-markup"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Margin %</span>
            <span class="calc-result-value" id="margin-margin"></span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Formulas</h3>
        <code>Discount = Price × (Discount% / 100)</code>
        <p><strong>Final Price</strong> = Original Price − Discount Amount.</p>
        <code>Markup% = ((Sell − Cost) / Cost) × 100</code>
        <code>Margin% = ((Sell − Cost) / Sell) × 100</code>
        <p><strong>Markup</strong> is profit relative to cost; <strong>Margin</strong> is profit relative to selling price.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const priceInput = document.getElementById('disc-price');
  const pctInput = document.getElementById('disc-pct');
  const costInput = document.getElementById('margin-cost');
  const sellInput = document.getElementById('margin-sell');

  function calcDiscount() {
    const price = parseFloat(priceInput.value);
    const pct = parseFloat(pctInput.value);
    const resultDiv = document.getElementById('result');

    if (isNaN(price) || isNaN(pct) || price <= 0 || pct < 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const saving = price * pct / 100;
    const finalPrice = price - saving;

    document.getElementById('disc-saving').textContent = '$' + saving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('disc-final').textContent = '$' + finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resultDiv.style.display = '';
  }

  function calcMargin() {
    const cost = parseFloat(costInput.value);
    const sell = parseFloat(sellInput.value);
    const resultDiv = document.getElementById('margin-result');

    if (isNaN(cost) || isNaN(sell) || cost <= 0 || sell <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const profit = sell - cost;
    const markup = (profit / cost) * 100;
    const margin = (profit / sell) * 100;

    document.getElementById('margin-profit').textContent = '$' + profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('margin-markup').textContent = markup.toFixed(2) + '%';
    document.getElementById('margin-margin').textContent = margin.toFixed(2) + '%';

    resultDiv.style.display = '';
  }

  priceInput.addEventListener('input', calcDiscount);
  pctInput.addEventListener('input', calcDiscount);
  costInput.addEventListener('input', calcMargin);
  sellInput.addEventListener('input', calcMargin);

  return function cleanup() {
    priceInput.removeEventListener('input', calcDiscount);
    pctInput.removeEventListener('input', calcDiscount);
    costInput.removeEventListener('input', calcMargin);
    sellInput.removeEventListener('input', calcMargin);
  };
}
