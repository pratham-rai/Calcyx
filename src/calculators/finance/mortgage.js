export const meta = {
  slug: 'mortgage',
  name: 'Mortgage Calculator',
  title: 'Mortgage Calculator - Calcyx',
  description: 'Calculate monthly mortgage payments including principal, interest, taxes, insurance, and HOA fees.',
  category: 'finance',
  icon: '🏡',
  keywords: ['mortgage', 'home loan', 'house payment', 'piti', 'tax', 'insurance'],
  formula: 'Monthly\\ Payment = P \\times \\frac{r(1+r)^n}{(1+r)^n - 1} + T + I + H',
  relatedSlugs: ['emi', 'compound-interest', 'simple-interest']
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
          <div class="calc-input-group" style="flex: 1;">
            <label for="mortgage-home-price">Home Price ($)</label>
            <input type="number" id="mortgage-home-price" class="calc-input" placeholder="e.g. 400000" min="0" step="1000">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="mortgage-down-payment-amt">Down Payment ($)</label>
            <input type="number" id="mortgage-down-payment-amt" class="calc-input" placeholder="e.g. 80000" min="0" step="1000">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="mortgage-down-payment-pct">Down Payment (%)</label>
            <input type="number" id="mortgage-down-payment-pct" class="calc-input" placeholder="e.g. 20" min="0" max="100" step="0.1">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="mortgage-interest-rate">Interest Rate (%)</label>
            <input type="number" id="mortgage-interest-rate" class="calc-input" placeholder="e.g. 6.5" min="0" max="100" step="0.01">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="mortgage-loan-term">Loan Term (Years)</label>
            <input type="number" id="mortgage-loan-term" class="calc-input" placeholder="e.g. 30" min="1" step="1">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="mortgage-property-tax">Property Tax (Annual %)</label>
            <input type="number" id="mortgage-property-tax" class="calc-input" placeholder="e.g. 1.2" min="0" step="0.01">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="mortgage-home-insurance">Home Insurance (Annual $)</label>
            <input type="number" id="mortgage-home-insurance" class="calc-input" placeholder="e.g. 1200" min="0" step="10">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="mortgage-hoa-fees">HOA Fees (Monthly $)</label>
            <input type="number" id="mortgage-hoa-fees" class="calc-input" placeholder="e.g. 150" min="0" step="5">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item" style="grid-column: span 2;">
            <span class="calc-result-label">Total Monthly Payment</span>
            <span class="calc-result-value" id="mortgage-total-payment"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Principal & Interest</span>
            <span class="calc-result-detail" id="mortgage-p-i"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Monthly Property Tax</span>
            <span class="calc-result-detail" id="mortgage-monthly-tax"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Monthly Home Insurance</span>
            <span class="calc-result-detail" id="mortgage-monthly-insurance"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Monthly HOA Fees</span>
            <span class="calc-result-detail" id="mortgage-monthly-hoa"></span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Formula & Breakdown</h3>
        <code>Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1] + Tax + Ins + HOA</code>
        <p>Where:</p>
        <ul style="padding-left: 20px; margin-top: 10px;">
          <li><strong>P</strong> = Loan Amount (Home Price − Down Payment)</li>
          <li><strong>r</strong> = Monthly Interest Rate (Annual Rate ÷ 12 ÷ 100)</li>
          <li><strong>n</strong> = Total number of payments (Loan Term in Years × 12)</li>
          <li><strong>Tax</strong> = Monthly Property Tax (Home Price × Annual Tax Rate % ÷ 12)</li>
          <li><strong>Ins</strong> = Monthly Home Insurance (Annual Insurance ÷ 12)</li>
          <li><strong>HOA</strong> = Monthly HOA fees (monthly)</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const homePriceInput = document.getElementById('mortgage-home-price');
  const downPaymentAmtInput = document.getElementById('mortgage-down-payment-amt');
  const downPaymentPctInput = document.getElementById('mortgage-down-payment-pct');
  const interestRateInput = document.getElementById('mortgage-interest-rate');
  const loanTermInput = document.getElementById('mortgage-loan-term');
  const propertyTaxInput = document.getElementById('mortgage-property-tax');
  const homeInsuranceInput = document.getElementById('mortgage-home-insurance');
  const hoaFeesInput = document.getElementById('mortgage-hoa-fees');

  const resultDiv = document.getElementById('result');

  function calculate(e) {
    const homePrice = parseFloat(homePriceInput.value) || 0;
    let downPaymentAmt = parseFloat(downPaymentAmtInput.value) || 0;
    let downPaymentPct = parseFloat(downPaymentPctInput.value) || 0;

    if (e && e.target) {
      if (e.target.id === 'mortgage-home-price') {
        downPaymentAmt = homePrice * (downPaymentPct / 100);
        downPaymentAmtInput.value = parseFloat(downPaymentAmt.toFixed(2)) || '';
      } else if (e.target.id === 'mortgage-down-payment-amt') {
        if (homePrice > 0) {
          downPaymentPct = (downPaymentAmt / homePrice) * 100;
          downPaymentPctInput.value = parseFloat(downPaymentPct.toFixed(2)) || '';
        } else {
          downPaymentPct = 0;
          downPaymentPctInput.value = 0;
        }
      } else if (e.target.id === 'mortgage-down-payment-pct') {
        downPaymentAmt = homePrice * (downPaymentPct / 100);
        downPaymentAmtInput.value = parseFloat(downPaymentAmt.toFixed(2)) || '';
      }
    }

    const interestRate = parseFloat(interestRateInput.value);
    const loanTerm = parseFloat(loanTermInput.value);
    const propertyTaxPct = parseFloat(propertyTaxInput.value) || 0;
    const homeInsurance = parseFloat(homeInsuranceInput.value) || 0;
    const hoaFees = parseFloat(hoaFeesInput.value) || 0;

    // Validation
    if (
      isNaN(homePrice) || homePrice <= 0 ||
      isNaN(interestRate) || interestRate < 0 ||
      isNaN(loanTerm) || loanTerm <= 0 ||
      downPaymentAmt < 0 || downPaymentAmt > homePrice
    ) {
      resultDiv.style.display = 'none';
      return;
    }

    const loanAmount = homePrice - downPaymentAmt;
    const r = interestRate / 12 / 100;
    const n = loanTerm * 12;

    let piPayment = 0;
    if (r === 0) {
      piPayment = loanAmount / n;
    } else {
      const factor = Math.pow(1 + r, n);
      piPayment = (loanAmount * r * factor) / (factor - 1);
    }

    const monthlyTax = (homePrice * (propertyTaxPct / 100)) / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthly = piPayment + monthlyTax + monthlyInsurance + hoaFees;

    document.getElementById('mortgage-total-payment').textContent = '$' + totalMonthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('mortgage-p-i').textContent = '$' + piPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('mortgage-monthly-tax').textContent = '$' + monthlyTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('mortgage-monthly-insurance').textContent = '$' + monthlyInsurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('mortgage-monthly-hoa').textContent = '$' + hoaFees.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resultDiv.style.display = '';
  }

  homePriceInput.addEventListener('input', calculate);
  downPaymentAmtInput.addEventListener('input', calculate);
  downPaymentPctInput.addEventListener('input', calculate);
  interestRateInput.addEventListener('input', calculate);
  loanTermInput.addEventListener('input', calculate);
  propertyTaxInput.addEventListener('input', calculate);
  homeInsuranceInput.addEventListener('input', calculate);
  hoaFeesInput.addEventListener('input', calculate);

  return function cleanup() {
    homePriceInput.removeEventListener('input', calculate);
    downPaymentAmtInput.removeEventListener('input', calculate);
    downPaymentPctInput.removeEventListener('input', calculate);
    interestRateInput.removeEventListener('input', calculate);
    loanTermInput.removeEventListener('input', calculate);
    propertyTaxInput.removeEventListener('input', calculate);
    homeInsuranceInput.removeEventListener('input', calculate);
    hoaFeesInput.removeEventListener('input', calculate);
  };
}
