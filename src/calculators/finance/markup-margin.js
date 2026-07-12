export const meta = {
  slug: 'markup-margin',
  name: 'Markup & Margin Calculator',
  title: 'Markup & Margin Calculator - Calcyx',
  description: 'Calculate Cost Price, Selling Price, Markup %, and Profit Margin %. Enter any two values to solve the other two instantly.',
  category: 'finance',
  icon: '📊',
  keywords: ['markup', 'margin', 'profit', 'cost price', 'selling price', 'profit margin'],
  formula: '\\text{Selling Price} = \\text{Cost} \\times (1 + \\text{Markup}\\% / 100)\\\\\\text{Margin}\\% = \\frac{\\text{Selling} - \\text{Cost}}{\\text{Selling}} \\times 100',
  relatedSlugs: ['discount', 'sales-tax']
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
            <label for="markup-cost">Cost Price ($)</label>
            <input type="number" id="markup-cost" class="calc-input" placeholder="e.g. 50" min="0.01" step="0.01">
          </div>
          <div class="calc-input-group">
            <label for="markup-selling">Selling Price ($)</label>
            <input type="number" id="markup-selling" class="calc-input" placeholder="e.g. 75" min="0.01" step="0.01">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="markup-pct">Markup (%)</label>
            <input type="number" id="markup-pct" class="calc-input" placeholder="e.g. 50" step="0.1">
          </div>
          <div class="calc-input-group">
            <label for="markup-margin">Profit Margin (%)</label>
            <input type="number" id="markup-margin" class="calc-input" placeholder="e.g. 33.3" max="99.99" step="0.1">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Gross Profit</span>
            <span class="calc-result-value" id="res-profit"></span>
            <span class="calc-result-detail">Selling Price - Cost</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Markup</span>
            <span class="calc-result-value" id="res-markup"></span>
            <span class="calc-result-detail">Profit / Cost</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Profit Margin</span>
            <span class="calc-result-value" id="res-margin"></span>
            <span class="calc-result-detail">Profit / Selling Price</span>
          </div>
        </div>
        
        <div style="margin-top: 20px; text-align: left; font-size: 0.95rem; opacity: 0.95; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Cost Price:</span>
            <strong id="detail-cost"></strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Selling Price:</span>
            <strong id="detail-selling"></strong>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Formulas & Definitions</h3>
        <code>Profit = Selling Price &minus; Cost Price</code>
        <code>Markup % = (Profit / Cost Price) &times; 100</code>
        <code>Margin % = (Profit / Selling Price) &times; 100</code>
        <p><strong>Markup</strong> is the percentage added to the Cost Price to calculate the Selling Price. It represents profit relative to your cost.</p>
        <p><strong>Margin (Profit Margin)</strong> is the percentage of the Selling Price that is profit. It represents profit relative to the final sale price.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const costInput = document.getElementById('markup-cost');
  const sellingInput = document.getElementById('markup-selling');
  const pctInput = document.getElementById('markup-pct');
  const marginInput = document.getElementById('markup-margin');
  
  const resultDiv = document.getElementById('result');
  const resProfit = document.getElementById('res-profit');
  const resMarkup = document.getElementById('res-markup');
  const resMargin = document.getElementById('res-margin');
  const detailCost = document.getElementById('detail-cost');
  const detailSelling = document.getElementById('detail-selling');

  let editHistory = [];

  function formatCurrency(val) {
    if (val < 0) {
      return '-$' + Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function handleInput(e) {
    const id = e.target.id;
    editHistory = editHistory.filter(x => x !== id);
    editHistory.push(id);
    calculate();
  }

  function calculate() {
    const costVal = parseFloat(costInput.value);
    const sellingVal = parseFloat(sellingInput.value);
    const pctVal = parseFloat(pctInput.value);
    const marginVal = parseFloat(marginInput.value);

    const activeFields = new Set();
    if (!isNaN(costVal) && costInput.value !== '') activeFields.add('markup-cost');
    if (!isNaN(sellingVal) && sellingInput.value !== '') activeFields.add('markup-selling');
    if (!isNaN(pctVal) && pctInput.value !== '') activeFields.add('markup-pct');
    if (!isNaN(marginVal) && marginInput.value !== '') activeFields.add('markup-margin');

    // Keep history consistent with active fields
    editHistory = editHistory.filter(id => activeFields.has(id));

    if (activeFields.size < 2) {
      resultDiv.style.display = 'none';
      return;
    }

    // Determine the solvable pair (needs at least one dollar value field: cost or selling)
    let last = editHistory[editHistory.length - 1];
    let prev = editHistory[editHistory.length - 2];

    if ((last === 'markup-pct' && prev === 'markup-margin') || (last === 'markup-margin' && prev === 'markup-pct')) {
      const dollarField = editHistory.slice().reverse().find(id => id === 'markup-cost' || id === 'markup-selling');
      if (!dollarField) {
        resultDiv.style.display = 'none';
        return;
      }
      prev = dollarField;
    }

    let cost = NaN, selling = NaN, markup = NaN, margin = NaN;
    const pair = new Set([last, prev]);

    if (pair.has('markup-cost') && pair.has('markup-selling')) {
      cost = parseFloat(costInput.value);
      selling = parseFloat(sellingInput.value);
      if (cost <= 0 || selling <= 0) {
        resultDiv.style.display = 'none';
        return;
      }
      const profit = selling - cost;
      markup = (profit / cost) * 100;
      margin = (profit / selling) * 100;
    } else if (pair.has('markup-cost') && pair.has('markup-pct')) {
      cost = parseFloat(costInput.value);
      markup = parseFloat(pctInput.value);
      if (cost <= 0 || markup <= -100) {
        resultDiv.style.display = 'none';
        return;
      }
      selling = cost * (1 + markup / 100);
      const profit = selling - cost;
      margin = selling !== 0 ? (profit / selling) * 100 : 0;
    } else if (pair.has('markup-cost') && pair.has('markup-margin')) {
      cost = parseFloat(costInput.value);
      margin = parseFloat(marginInput.value);
      if (cost <= 0 || margin >= 100) {
        resultDiv.style.display = 'none';
        return;
      }
      selling = cost / (1 - margin / 100);
      const profit = selling - cost;
      markup = (profit / cost) * 100;
    } else if (pair.has('markup-selling') && pair.has('markup-pct')) {
      selling = parseFloat(sellingInput.value);
      markup = parseFloat(pctInput.value);
      if (selling <= 0 || markup <= -100) {
        resultDiv.style.display = 'none';
        return;
      }
      cost = selling / (1 + markup / 100);
      const profit = selling - cost;
      margin = (profit / selling) * 100;
    } else if (pair.has('markup-selling') && pair.has('markup-margin')) {
      selling = parseFloat(sellingInput.value);
      margin = parseFloat(marginInput.value);
      if (selling <= 0 || margin >= 100) {
        resultDiv.style.display = 'none';
        return;
      }
      cost = selling * (1 - margin / 100);
      const profit = selling - cost;
      markup = cost !== 0 ? (profit / cost) * 100 : 0;
    } else {
      resultDiv.style.display = 'none';
      return;
    }

    if (isNaN(cost) || isNaN(selling) || isNaN(markup) || isNaN(margin) || !isFinite(cost) || !isFinite(selling) || !isFinite(markup) || !isFinite(margin)) {
      resultDiv.style.display = 'none';
      return;
    }

    // Update non-input fields
    if (!pair.has('markup-cost')) {
      costInput.value = cost.toFixed(2);
    }
    if (!pair.has('markup-selling')) {
      sellingInput.value = selling.toFixed(2);
    }
    if (!pair.has('markup-pct')) {
      pctInput.value = markup.toFixed(2);
    }
    if (!pair.has('markup-margin')) {
      marginInput.value = margin.toFixed(2);
    }

    // Show results
    const profit = selling - cost;
    resProfit.textContent = formatCurrency(profit);
    resMarkup.textContent = markup.toFixed(2) + '%';
    resMargin.textContent = margin.toFixed(2) + '%';
    detailCost.textContent = formatCurrency(cost);
    detailSelling.textContent = formatCurrency(selling);

    resultDiv.style.display = '';
  }

  costInput.addEventListener('input', handleInput);
  sellingInput.addEventListener('input', handleInput);
  pctInput.addEventListener('input', handleInput);
  marginInput.addEventListener('input', handleInput);

  return function cleanup() {
    costInput.removeEventListener('input', handleInput);
    sellingInput.removeEventListener('input', handleInput);
    pctInput.removeEventListener('input', handleInput);
    marginInput.removeEventListener('input', handleInput);
  };
}
