export const meta = {
  slug: 'sales-tax',
  name: 'Sales Tax / GST / VAT',
  title: 'Sales Tax / GST / VAT Calculator - Calcyx',
  description: 'Calculate sales tax, GST, or VAT to add to or remove from a price.',
  category: 'finance',
  icon: '🏷️',
  keywords: ['sales tax', 'gst', 'vat', 'tax calculator', 'add tax', 'remove tax'],
  formula: 'Add\\ Tax: T = A \\times \\frac{R}{100} \\quad | \\quad Remove\\ Tax: T = A - \\frac{A}{1 + R/100}',
  relatedSlugs: ['discount', 'percentage']
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
          <label for="tax-type">Calculation Type</label>
          <select id="tax-type" class="calc-select">
            <option value="add">Add Tax (Inclusive)</option>
            <option value="remove">Remove Tax (Exclusive)</option>
          </select>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="tax-amount" id="label-tax-amount">Amount ($)</label>
            <input type="number" id="tax-amount" class="calc-input" placeholder="e.g. 100" min="0" step="0.01">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="tax-rate">Tax Rate (%)</label>
            <input type="number" id="tax-rate" class="calc-input" placeholder="e.g. 15" min="0" max="100" step="0.1">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Net Price (Pre-tax)</span>
            <span class="calc-result-value" id="tax-net-val"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Tax Amount</span>
            <span class="calc-result-value" id="tax-amount-val"></span>
          </div>
          <div class="calc-result-item" style="grid-column: span 2;">
            <span class="calc-result-label">Total Price (Post-tax)</span>
            <span class="calc-result-value" id="tax-total-val" style="font-size: 2rem;"></span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Formula</h3>
        <p><strong>Add Tax:</strong></p>
        <code>Tax = Amount &times; (Rate / 100)</code><br>
        <code>Total = Amount + Tax</code>
        <p style="margin-top: 10px;"><strong>Remove Tax:</strong></p>
        <code>Tax = Amount &minus; (Amount / (1 + Rate / 100))</code><br>
        <code>Net = Amount &minus; Tax</code>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const typeSelect = document.getElementById('tax-type');
  const amountInput = document.getElementById('tax-amount');
  const rateInput = document.getElementById('tax-rate');
  const labelTaxAmount = document.getElementById('label-tax-amount');

  const resultDiv = document.getElementById('result');

  function updateLabel() {
    if (typeSelect.value === 'add') {
      labelTaxAmount.textContent = 'Amount (Pre-tax) ($)';
    } else {
      labelTaxAmount.textContent = 'Amount (Post-tax / Total) ($)';
    }
  }

  function calculate() {
    const type = typeSelect.value;
    const amount = parseFloat(amountInput.value);
    const rate = parseFloat(rateInput.value);

    if (isNaN(amount) || amount < 0 || isNaN(rate) || rate < 0) {
      resultDiv.style.display = 'none';
      return;
    }

    let net = 0;
    let tax = 0;
    let total = 0;

    if (type === 'add') {
      tax = amount * (rate / 100);
      net = amount;
      total = amount + tax;
    } else {
      tax = amount - (amount / (1 + rate / 100));
      net = amount - tax;
      total = amount;
    }

    document.getElementById('tax-net-val').textContent = '$' + net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('tax-amount-val').textContent = '$' + tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('tax-total-val').textContent = '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resultDiv.style.display = '';
  }

  function handleTypeChange() {
    updateLabel();
    calculate();
  }

  typeSelect.addEventListener('change', handleTypeChange);
  amountInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);

  // Initialize label
  updateLabel();

  return function cleanup() {
    typeSelect.removeEventListener('change', handleTypeChange);
    amountInput.removeEventListener('input', calculate);
    rateInput.removeEventListener('input', calculate);
  };
}
