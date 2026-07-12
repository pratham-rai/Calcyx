export const meta = {
  slug: 'unit-price',
  name: 'Unit Price Comparison',
  title: 'Unit Price Comparison Calculator - Calcyx',
  description: 'Compare up to 4 products by price and quantity to find the best value. Instantly see which item gives you the most for your money.',
  category: 'everyday',
  icon: '🏷️',
  keywords: ['unit price', 'price comparison', 'best value', 'cost per unit', 'shopping', 'compare prices'],
  formula: 'Unit Price = Price ÷ Quantity',
  relatedSlugs: ['fuel-cost', 'discount']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  function itemRow(n, show) {
    return `
      <div class="calc-item-row" id="item-row-${n}" style="${show ? '' : 'display:none;'}">
        <div class="calc-result-label" style="font-weight:600; margin-bottom:0.25rem;">Item ${n}</div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="name-${n}">Name</label>
            <input type="text" id="name-${n}" class="calc-input" placeholder="e.g. Brand A">
          </div>
          <div class="calc-input-group">
            <label for="price-${n}">Price ($)</label>
            <input type="number" id="price-${n}" class="calc-input" placeholder="0.00" step="any" min="0">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="qty-${n}">Quantity</label>
            <input type="number" id="qty-${n}" class="calc-input" placeholder="e.g. 500" step="any" min="0">
          </div>
          <div class="calc-input-group">
            <label for="unit-${n}">Unit</label>
            <select id="unit-${n}" class="calc-select">
              <option value="g">Grams (g)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="oz">Ounces (oz)</option>
              <option value="lb">Pounds (lb)</option>
              <option value="ml">Milliliters (mL)</option>
              <option value="L">Liters (L)</option>
              <option value="fl oz">Fluid oz</option>
              <option value="pcs">Pieces</option>
              <option value="pack">Packs</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="item-count">Number of Items to Compare</label>
          <select id="item-count" class="calc-select">
            <option value="2" selected>2 Items</option>
            <option value="3">3 Items</option>
            <option value="4">4 Items</option>
          </select>
        </div>
        ${itemRow(1, true)}
        ${itemRow(2, true)}
        ${itemRow(3, false)}
        ${itemRow(4, false)}
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="best-value"></div>
          <div class="calc-result-label">Best Value</div>
          <div class="calc-result-grid" id="comparison-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Unit Price = Total Price ÷ Quantity</code>
        <p>The unit price tells you the cost per single unit of measurement (per gram, per ounce, per piece, etc.). The item with the lowest unit price is the best value for your money. Make sure all items use the same unit for a fair comparison.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const itemCountSelect = document.getElementById('item-count');
  const resultDiv = document.getElementById('result');
  const bestValueEl = document.getElementById('best-value');
  const comparisonGrid = document.getElementById('comparison-grid');

  function getItemCount() {
    return parseInt(itemCountSelect.value, 10);
  }

  function showHideRows() {
    const count = getItemCount();
    for (let i = 1; i <= 4; i++) {
      const row = document.getElementById(`item-row-${i}`);
      if (row) row.style.display = i <= count ? '' : 'none';
    }
    calculate();
  }

  function calculate() {
    const count = getItemCount();
    const items = [];

    for (let i = 1; i <= count; i++) {
      const name = document.getElementById(`name-${i}`).value.trim() || `Item ${i}`;
      const price = parseFloat(document.getElementById(`price-${i}`).value);
      const qty = parseFloat(document.getElementById(`qty-${i}`).value);
      const unit = document.getElementById(`unit-${i}`).value;

      if (!isNaN(price) && !isNaN(qty) && price > 0 && qty > 0) {
        items.push({ name, price, qty, unit, unitPrice: price / qty, index: i });
      }
    }

    if (items.length < 2) {
      resultDiv.style.display = 'none';
      return;
    }

    // Find best value (lowest unit price — only fair among same units)
    const allSameUnit = items.every(it => it.unit === items[0].unit);
    let bestIdx = -1;

    if (allSameUnit) {
      let minPrice = Infinity;
      items.forEach((it, idx) => {
        if (it.unitPrice < minPrice) {
          minPrice = it.unitPrice;
          bestIdx = idx;
        }
      });
    }

    bestValueEl.textContent = bestIdx >= 0
      ? `🏆 ${items[bestIdx].name}`
      : '⚠️ Use same units to compare';

    comparisonGrid.innerHTML = items.map((it, idx) => {
      const isBest = idx === bestIdx;
      const highlight = isBest ? 'border: 2px solid #4ade80; border-radius: 0.5rem;' : '';
      return `
        <div class="calc-result-item" style="${highlight}">
          <div class="calc-result-value"${isBest ? ' style="color:#4ade80;"' : ''}>
            $${it.unitPrice.toFixed(4)}/${it.unit}
          </div>
          <div class="calc-result-label">
            ${it.name}${isBest ? ' ✅' : ''}
          </div>
          <div class="calc-result-detail">
            $${it.price.toFixed(2)} for ${it.qty} ${it.unit}
          </div>
        </div>
      `;
    }).join('');

    resultDiv.style.display = '';
  }

  // Collect all input elements for event listeners
  const allInputs = [];
  for (let i = 1; i <= 4; i++) {
    allInputs.push(document.getElementById(`name-${i}`));
    allInputs.push(document.getElementById(`price-${i}`));
    allInputs.push(document.getElementById(`qty-${i}`));
    allInputs.push(document.getElementById(`unit-${i}`));
  }

  allInputs.forEach(inp => inp.addEventListener('input', calculate));
  itemCountSelect.addEventListener('input', showHideRows);

  return () => {
    allInputs.forEach(inp => inp.removeEventListener('input', calculate));
    itemCountSelect.removeEventListener('input', showHideRows);
  };
}
