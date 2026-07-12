export const meta = {
  slug: 'credit-card',
  name: 'Credit Card Payoff',
  title: 'Credit Card Payoff Calculator - Calcyx',
  description: 'Calculate how long it will take to pay off your credit card balance, or find the monthly payment needed to meet a target payoff date.',
  category: 'finance',
  icon: '💳',
  keywords: ['credit card', 'payoff', 'debt payoff', 'credit card interest', 'apr', 'debt free'],
  formula: 'N = \\frac{\\ln(P) - \\ln(P - B \\cdot r)}{\\ln(1 + r)} \\quad \\text{or} \\quad P = B \\cdot \\frac{r(1+r)^N}{(1+r)^N - 1}',
  relatedSlugs: ['emi', 'compound-interest']
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
            <label for="cc-balance">Card Balance ($)</label>
            <input type="number" id="cc-balance" class="calc-input" placeholder="e.g. 5000" min="0" step="100">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="cc-rate">Annual Interest Rate (APR %)</label>
            <input type="number" id="cc-rate" class="calc-input" placeholder="e.g. 18.9" min="0" max="100" step="0.01">
          </div>
        </div>

        <div class="calc-input-group">
          <label for="cc-type">Calculation Goal</label>
          <select id="cc-type" class="calc-select">
            <option value="payment">Calculate Payoff Time (using Fixed Payment)</option>
            <option value="time">Calculate Payment (using Target Time)</option>
          </select>
        </div>

        <div class="calc-input-group" id="cc-payment-group">
          <label for="cc-payment">Monthly Payment ($)</label>
          <input type="number" id="cc-payment" class="calc-input" placeholder="e.g. 200" min="0" step="10">
        </div>

        <div class="calc-input-group" id="cc-time-group" style="display: none;">
          <label for="cc-time">Target Payoff Time (months)</label>
          <input type="number" id="cc-time" class="calc-input" placeholder="e.g. 24" min="1" step="1">
        </div>

        <div id="cc-error" style="display: none; color: #ef4444; margin-top: 15px; font-weight: 500; font-size: 0.9rem; text-align: center;">
          ⚠️ Payment must be greater than the monthly interest of <span id="cc-min-payment"></span> to pay off the card.
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label" id="cc-label-1">Payoff Time</span>
            <span class="calc-result-value" id="cc-val-1"></span>
            <span class="calc-result-detail" id="cc-detail-1"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Interest Paid</span>
            <span class="calc-result-value" id="cc-val-2"></span>
            <span class="calc-result-detail">Cost of borrowing</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Amount Paid</span>
            <span class="calc-result-value" id="cc-val-3"></span>
            <span class="calc-result-detail">Principal + Interest</span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Credit Card Payoff Formula</h3>
        <p>When paying a fixed monthly payment, the number of months <strong>N</strong> to pay off the card is calculated as:</p>
        <code>N = -ln(1 - (B * r) / P) / ln(1 + r)</code>
        <p style="margin-top: 10px;">When targeting a specific number of months <strong>N</strong>, the required monthly payment <strong>P</strong> is:</p>
        <code>P = B * [r(1 + r)^N] / [(1 + r)^N - 1]</code>
        <p style="margin-top: 10px;">Where:</p>
        <ul style="padding-left: 20px; margin-top: 5px;">
          <li><strong>B</strong> = Credit card balance</li>
          <li><strong>r</strong> = Monthly interest rate (APR / 12 / 100)</li>
          <li><strong>P</strong> = Monthly payment</li>
          <li><strong>N</strong> = Number of months</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const balanceInput = document.getElementById('cc-balance');
  const rateInput = document.getElementById('cc-rate');
  const typeSelect = document.getElementById('cc-type');
  const paymentInput = document.getElementById('cc-payment');
  const timeInput = document.getElementById('cc-time');

  const paymentGroup = document.getElementById('cc-payment-group');
  const timeGroup = document.getElementById('cc-time-group');
  const errorDiv = document.getElementById('cc-error');
  const minPaymentSpan = document.getElementById('cc-min-payment');
  const resultDiv = document.getElementById('result');

  const val1 = document.getElementById('cc-val-1');
  const val2 = document.getElementById('cc-val-2');
  const val3 = document.getElementById('cc-val-3');
  const label1 = document.getElementById('cc-label-1');
  const detail1 = document.getElementById('cc-detail-1');

  function toggleInputs() {
    if (typeSelect.value === 'payment') {
      paymentGroup.style.display = '';
      timeGroup.style.display = 'none';
    } else {
      paymentGroup.style.display = 'none';
      timeGroup.style.display = '';
    }
    calculate();
  }

  function calculate() {
    const B = parseFloat(balanceInput.value);
    const APR = parseFloat(rateInput.value);
    const type = typeSelect.value;

    if (isNaN(B) || B <= 0 || isNaN(APR) || APR < 0) {
      resultDiv.style.display = 'none';
      errorDiv.style.display = 'none';
      return;
    }

    const r = APR / 12 / 100;

    if (type === 'payment') {
      const P = parseFloat(paymentInput.value);
      if (isNaN(P) || P <= 0) {
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        return;
      }

      const minPayable = B * r;
      if (r > 0 && P <= minPayable) {
        minPaymentSpan.textContent = '$' + minPayable.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        errorDiv.style.display = '';
        resultDiv.style.display = 'none';
        return;
      }

      errorDiv.style.display = 'none';

      let tempBalance = B;
      let months = 0;
      let totalPaid = 0;
      let totalInterest = 0;
      const maxMonths = 1200; // 100 years limit

      while (tempBalance > 0.009 && months < maxMonths) {
        const monthlyInterest = r > 0 ? tempBalance * r : 0;
        totalInterest += monthlyInterest;
        const paymentThisMonth = Math.min(tempBalance + monthlyInterest, P);
        tempBalance = tempBalance + monthlyInterest - paymentThisMonth;
        totalPaid += paymentThisMonth;
        months++;
      }

      label1.textContent = 'Payoff Time';
      val1.textContent = months + (months === 1 ? ' month' : ' months');
      detail1.textContent = 'Time to become debt-free';

      val2.textContent = '$' + totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      val3.textContent = '$' + totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      resultDiv.style.display = '';

    } else {
      // By target time
      const N = parseInt(timeInput.value, 10);
      if (isNaN(N) || N <= 0) {
        resultDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        return;
      }

      errorDiv.style.display = 'none';

      let P = 0;
      if (r === 0) {
        P = B / N;
      } else {
        P = B * (r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
      }

      // Round payment to 2 decimal places to simulate real world behavior
      P = Math.round(P * 100) / 100;

      let tempBalance = B;
      let totalPaid = 0;
      let totalInterest = 0;

      for (let m = 0; m < N; m++) {
        const monthlyInterest = r > 0 ? tempBalance * r : 0;
        totalInterest += monthlyInterest;
        let paymentThisMonth = P;
        if (m === N - 1) {
          paymentThisMonth = tempBalance + monthlyInterest;
        } else {
          paymentThisMonth = Math.min(tempBalance + monthlyInterest, P);
        }
        tempBalance = tempBalance + monthlyInterest - paymentThisMonth;
        totalPaid += paymentThisMonth;
      }

      label1.textContent = 'Required Monthly Payment';
      val1.textContent = '$' + P.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      detail1.textContent = `For a ${N}-month payoff plan`;

      val2.textContent = '$' + totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      val3.textContent = '$' + totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      resultDiv.style.display = '';
    }
  }

  balanceInput.addEventListener('input', calculate);
  rateInput.addEventListener('input', calculate);
  typeSelect.addEventListener('change', toggleInputs);
  paymentInput.addEventListener('input', calculate);
  timeInput.addEventListener('input', calculate);

  // Initial setup
  toggleInputs();

  return function cleanup() {
    balanceInput.removeEventListener('input', calculate);
    rateInput.removeEventListener('input', calculate);
    typeSelect.removeEventListener('change', toggleInputs);
    paymentInput.removeEventListener('input', calculate);
    timeInput.removeEventListener('input', calculate);
  };
}
