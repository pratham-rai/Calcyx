export const meta = {
  slug: 'auto-loan',
  name: 'Auto Loan Calculator',
  title: 'Auto Loan Calculator - Calcyx',
  description: 'Calculate monthly auto payments, total loan amount, interest, and total cost of ownership for a vehicle loan.',
  category: 'everyday',
  icon: '🚗',
  keywords: ['car loan', 'auto loan', 'car payment', 'monthly payment', 'vehicle finance', 'trade-in value'],
  formula: 'Monthly Payment = P × [r(1+r)^n] ÷ [(1+r)^n - 1]',
  relatedSlugs: ['emi', 'mortgage']
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
            <label for="vehicle-price">Vehicle Price ($)</label>
            <input type="number" id="vehicle-price" class="calc-input" placeholder="e.g. 35000" min="0" step="100" required>
          </div>
          <div class="calc-input-group">
            <label for="down-payment">Down Payment ($)</label>
            <input type="number" id="down-payment" class="calc-input" placeholder="e.g. 5000" min="0" step="100">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="trade-in">Trade-in Value ($)</label>
            <input type="number" id="trade-in" class="calc-input" placeholder="e.g. 2000" min="0" step="100">
          </div>
          <div class="calc-input-group">
            <label for="dealer-fees">Dealer & Gov Fees ($)</label>
            <input type="number" id="dealer-fees" class="calc-input" placeholder="e.g. 1200" min="0" step="50">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="interest-rate">Interest Rate (% APY)</label>
            <input type="number" id="interest-rate" class="calc-input" placeholder="e.g. 5.5" min="0" max="100" step="0.01">
          </div>
          <div class="calc-input-group">
            <label for="loan-term">Loan Term (months)</label>
            <input type="number" id="loan-term" class="calc-input" placeholder="e.g. 60" min="1" step="1" required>
          </div>
        </div>
        <div class="calc-input-group">
          <label for="sales-tax">Sales Tax (%)</label>
          <input type="number" id="sales-tax" class="calc-input" placeholder="e.g. 7.5" min="0" max="100" step="0.1">
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="monthly-payment"></div>
          <div class="calc-result-label">Estimated Monthly Payment</div>
          <div class="calc-result-grid" id="details-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Taxable Price = Vehicle Price - Trade-in Value</code>
        <code>Sales Tax = Taxable Price × Tax Rate (%)</code>
        <code>Loan Amount = Taxable Price + Sales Tax + Fees - Down Payment</code>
        <code>Monthly Payment = Loan Amount × [r(1+r)ⁿ] ÷ [(1+r)ⁿ - 1]</code>
        <p>Where <strong>r</strong> is the monthly interest rate (annual rate ÷ 12 ÷ 100), and <strong>n</strong> is the loan term in months. Total Cost of Ownership is computed as Down Payment + Trade-in Value + Total Monthly Payments.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const priceInput = document.getElementById('vehicle-price');
  const downPaymentInput = document.getElementById('down-payment');
  const tradeInInput = document.getElementById('trade-in');
  const feesInput = document.getElementById('dealer-fees');
  const interestInput = document.getElementById('interest-rate');
  const termInput = document.getElementById('loan-term');
  const taxInput = document.getElementById('sales-tax');
  const resultDiv = document.getElementById('result');
  const monthlyPaymentEl = document.getElementById('monthly-payment');
  const detailsGrid = document.getElementById('details-grid');

  function calculate() {
    const price = parseFloat(priceInput.value);
    const term = parseFloat(termInput.value);

    if (isNaN(price) || price <= 0 || isNaN(term) || term <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const tradeIn = parseFloat(tradeInInput.value) || 0;
    const fees = parseFloat(feesInput.value) || 0;
    const interestRate = parseFloat(interestInput.value) || 0;
    const taxRate = parseFloat(taxInput.value) || 0;

    const taxablePrice = Math.max(0, price - tradeIn);
    const taxAmount = taxablePrice * (taxRate / 100);
    
    let loanAmount = price - tradeIn + taxAmount + fees - downPayment;
    if (loanAmount < 0) loanAmount = 0;

    let monthlyPayment = 0;
    let totalInterest = 0;

    if (loanAmount > 0) {
      if (interestRate === 0) {
        monthlyPayment = loanAmount / term;
      } else {
        const monthlyRate = (interestRate / 100) / 12;
        monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
      }
      totalInterest = (monthlyPayment * term) - loanAmount;
    }

    const totalCostOfOwnership = downPayment + tradeIn + (monthlyPayment * term);

    monthlyPaymentEl.textContent = `$${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    detailsGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">$${loanAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="calc-result-label">Loan Amount</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="calc-result-label">Total Interest</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="calc-result-label">Sales Tax Paid</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${totalCostOfOwnership.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="calc-result-label">Total Cash Outlay</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  priceInput.addEventListener('input', calculate);
  downPaymentInput.addEventListener('input', calculate);
  tradeInInput.addEventListener('input', calculate);
  feesInput.addEventListener('input', calculate);
  interestInput.addEventListener('input', calculate);
  termInput.addEventListener('input', calculate);
  taxInput.addEventListener('input', calculate);

  // Trigger calculation on load if values are present
  calculate();

  return () => {
    priceInput.removeEventListener('input', calculate);
    downPaymentInput.removeEventListener('input', calculate);
    tradeInInput.removeEventListener('input', calculate);
    feesInput.removeEventListener('input', calculate);
    interestInput.removeEventListener('input', calculate);
    termInput.removeEventListener('input', calculate);
    taxInput.removeEventListener('input', calculate);
  };
}
