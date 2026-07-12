export const meta = {
  slug: 'tip-tax',
  name: 'Tip & Tax Combined',
  title: 'Tip & Tax Combined Calculator - Calcyx',
  description: 'Calculate tip, sales tax, total bill, and split the amounts per person with exact breakdowns.',
  category: 'everyday',
  icon: '💸',
  keywords: ['tip', 'tax', 'bill splitter', 'tip calculator', 'sales tax', 'restaurant bill', 'split bill'],
  formula: 'Tax = Subtotal × Tax%, Tip = Subtotal × Tip%, Total = Subtotal + Tax + Tip',
  relatedSlugs: ['tip', 'discount']
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
        <div class="calc-input-group">
          <label for="subtotal">Subtotal ($)</label>
          <input type="number" id="subtotal" class="calc-input" placeholder="e.g. 100.00" min="0" step="0.01">
        </div>

        <div class="calc-row">
          <div class="calc-input-group">
            <label for="tax-rate">Sales Tax Rate (%)</label>
            <input type="number" id="tax-rate" class="calc-input" placeholder="e.g. 8.25" min="0" max="100" step="0.01" value="0">
          </div>
          
          <div class="calc-input-group">
            <label for="tip-rate">Tip Rate (%)</label>
            <input type="number" id="tip-rate" class="calc-input" placeholder="e.g. 18" min="0" step="0.5" value="15">
          </div>
        </div>

        <div class="calc-input-group">
          <label>Quick Tip Presets</label>
          <div class="calc-row" id="tip-presets" style="gap:8px; flex-wrap:wrap">
            <button type="button" class="calc-select" data-tip="10" style="flex:1; min-width:50px; cursor:pointer; text-align:center">10%</button>
            <button type="button" class="calc-select" data-tip="15" style="flex:1; min-width:50px; cursor:pointer; text-align:center; outline: 2px solid var(--accent, #6c63ff)">15%</button>
            <button type="button" class="calc-select" data-tip="18" style="flex:1; min-width:50px; cursor:pointer; text-align:center">18%</button>
            <button type="button" class="calc-select" data-tip="20" style="flex:1; min-width:50px; cursor:pointer; text-align:center">20%</button>
            <button type="button" class="calc-select" data-tip="25" style="flex:1; min-width:50px; cursor:pointer; text-align:center">25%</button>
          </div>
        </div>

        <div class="calc-input-group">
          <label for="split-count">Number of People Splitting</label>
          <input type="number" id="split-count" class="calc-input" placeholder="e.g. 4" min="1" step="1" value="1">
        </div>

        <div id="result" class="calc-result" style="display: none; margin-top: 1.5rem;">
          <h3 style="font-size: 1.1rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; text-align: left;">📊 Bill Breakdown</h3>
          <div class="calc-result-grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="calc-result-item">
              <span class="calc-result-label">Tax Amount</span>
              <span class="calc-result-value" id="tax-amount" style="font-size: 1.6rem;">$0.00</span>
            </div>
            <div class="calc-result-item">
              <span class="calc-result-label">Tip Amount</span>
              <span class="calc-result-value" id="tip-amount" style="font-size: 1.6rem;">$0.00</span>
            </div>
            <div class="calc-result-item">
              <span class="calc-result-label">Grand Total</span>
              <span class="calc-result-value" id="grand-total" style="font-size: 1.6rem;">$0.00</span>
            </div>
          </div>

          <h3 style="font-size: 1.1rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; text-align: left;">👥 Share Per Person</h3>
          <div class="calc-result-grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem;">
            <div class="calc-result-item">
              <span class="calc-result-label">Subtotal Share</span>
              <span class="calc-result-value" id="subtotal-per-person" style="font-size: 1.6rem;">$0.00</span>
            </div>
            <div class="calc-result-item">
              <span class="calc-result-label">Tax Share</span>
              <span class="calc-result-value" id="tax-per-person" style="font-size: 1.6rem;">$0.00</span>
            </div>
            <div class="calc-result-item">
              <span class="calc-result-label">Tip Share</span>
              <span class="calc-result-value" id="tip-per-person" style="font-size: 1.6rem;">$0.00</span>
            </div>
            <div class="calc-result-item" style="grid-column: 1 / -1; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15);">
              <span class="calc-result-label" style="font-weight: bold;">Total Per Person</span>
              <span class="calc-result-value" id="total-per-person" style="font-size: 2.2rem; font-weight: 800;">$0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Tax & Tip Calculations</h3>
        <p>1. <strong>Sales Tax Amount:</strong> Calculated as a percentage of the subtotal bill.<br>
           <code>Tax = Subtotal × (Tax Rate % / 100)</code>
        </p>
        <p>2. <strong>Tip / Gratuity Amount:</strong> Calculated as a percentage of the subtotal (pre-tax) bill.<br>
           <code>Tip = Subtotal × (Tip Rate % / 100)</code>
        </p>
        <p>3. <strong>Grand Total:</strong> The sum of the subtotal, tax amount, and tip amount.<br>
           <code>Grand Total = Subtotal + Tax + Tip</code>
        </p>
        <p>4. <strong>Per Person Share:</strong> Each individual item is divided by the number of people to get their exact share.</p>
      </div>
    </div>
  `;

  return el;
}

export function mount() {
  const subtotalInput = document.getElementById('subtotal');
  const taxRateInput = document.getElementById('tax-rate');
  const tipRateInput = document.getElementById('tip-rate');
  const presetsContainer = document.getElementById('tip-presets');
  const splitCountInput = document.getElementById('split-count');
  const resultDiv = document.getElementById('result');

  const taxAmountSpan = document.getElementById('tax-amount');
  const tipAmountSpan = document.getElementById('tip-amount');
  const grandTotalSpan = document.getElementById('grand-total');
  const subtotalPerPersonSpan = document.getElementById('subtotal-per-person');
  const taxPerPersonSpan = document.getElementById('tax-per-person');
  const tipPerPersonSpan = document.getElementById('tip-per-person');
  const totalPerPersonSpan = document.getElementById('total-per-person');

  function formatCurrency(val) {
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculate() {
    const subtotal = parseFloat(subtotalInput.value);
    const taxRate = parseFloat(taxRateInput.value) || 0;
    const tipRate = parseFloat(tipRateInput.value) || 0;
    const splitCount = parseInt(splitCountInput.value, 10) || 1;

    if (isNaN(subtotal) || subtotal < 0 || taxRate < 0 || tipRate < 0 || splitCount < 1) {
      resultDiv.style.display = 'none';
      return;
    }

    const taxAmount = subtotal * (taxRate / 100);
    const tipAmount = subtotal * (tipRate / 100);
    const grandTotal = subtotal + taxAmount + tipAmount;

    const subtotalShare = subtotal / splitCount;
    const taxShare = taxAmount / splitCount;
    const tipShare = tipAmount / splitCount;
    const totalShare = grandTotal / splitCount;

    // Display bill breakdown
    taxAmountSpan.textContent = formatCurrency(taxAmount);
    tipAmountSpan.textContent = formatCurrency(tipAmount);
    grandTotalSpan.textContent = formatCurrency(grandTotal);

    // Display per-person splits
    subtotalPerPersonSpan.textContent = formatCurrency(subtotalShare);
    taxPerPersonSpan.textContent = formatCurrency(taxShare);
    tipPerPersonSpan.textContent = formatCurrency(tipShare);
    totalPerPersonSpan.textContent = formatCurrency(totalShare);

    resultDiv.style.display = 'block';
  }

  function handlePreset(e) {
    const btn = e.target.closest('[data-tip]');
    if (!btn) return;
    tipRateInput.value = btn.dataset.tip;
    
    // Highlight active preset
    presetsContainer.querySelectorAll('[data-tip]').forEach(b => {
      b.style.outline = '';
    });
    btn.style.outline = '2px solid var(--accent, #6c63ff)';
    calculate();
  }

  subtotalInput.addEventListener('input', calculate);
  taxRateInput.addEventListener('input', calculate);
  tipRateInput.addEventListener('input', () => {
    // Clear presets styling when typing custom
    presetsContainer.querySelectorAll('[data-tip]').forEach(b => {
      b.style.outline = '';
    });
    calculate();
  });
  splitCountInput.addEventListener('input', calculate);
  presetsContainer.addEventListener('click', handlePreset);

  return () => {
    subtotalInput.removeEventListener('input', calculate);
    taxRateInput.removeEventListener('input', calculate);
    tipRateInput.removeEventListener('input', calculate);
    splitCountInput.removeEventListener('input', calculate);
    presetsContainer.removeEventListener('click', handlePreset);
  };
}
