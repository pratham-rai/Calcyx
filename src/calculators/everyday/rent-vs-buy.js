export const meta = {
  slug: 'rent-vs-buy',
  name: 'Rent vs Buy Calculator',
  title: 'Rent vs Buy Calculator - Calcyx',
  description: 'Compare the total cost of renting a home versus buying one over a set period, taking into account rent inflation, property appreciation, mortgage costs, and investment returns.',
  category: 'everyday',
  icon: '🏠',
  keywords: ['rent vs buy', 'home purchase', 'mortgage', 'renting', 'buying home', 'real estate investment'],
  formula: 'Net Cost Comparison = Renting Net Cost vs Buying Net Cost',
  relatedSlugs: ['mortgage', 'compound-interest']
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
            <label for="monthly-rent">Monthly Rent ($)</label>
            <input type="number" id="monthly-rent" class="calc-input" placeholder="e.g. 2000" min="0" step="50" required>
          </div>
          <div class="calc-input-group">
            <label for="rent-increase">Annual Rent Increase (%)</label>
            <input type="number" id="rent-increase" class="calc-input" placeholder="e.g. 3" min="0" max="100" step="0.1">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="home-price">Home Purchase Price ($)</label>
            <input type="number" id="home-price" class="calc-input" placeholder="e.g. 400000" min="0" step="5000" required>
          </div>
          <div class="calc-input-group">
            <label for="down-payment">Down Payment ($)</label>
            <input type="number" id="down-payment" class="calc-input" placeholder="e.g. 80000" min="0" step="1000">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="interest-rate">Mortgage Interest Rate (%)</label>
            <input type="number" id="interest-rate" class="calc-input" placeholder="e.g. 6.5" min="0" max="100" step="0.01">
          </div>
          <div class="calc-input-group">
            <label for="home-appreciation">Annual Home Appreciation (%)</label>
            <input type="number" id="home-appreciation" class="calc-input" placeholder="e.g. 4" min="0" max="100" step="0.1">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="investment-return">Investment Return Rate (%)</label>
            <input type="number" id="investment-return" class="calc-input" placeholder="e.g. 8" min="0" max="100" step="0.1">
          </div>
          <div class="calc-input-group">
            <label for="length-of-stay">Length of Stay (years)</label>
            <input type="number" id="length-of-stay" class="calc-input" placeholder="e.g. 7" min="1" max="100" step="1" required>
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="comparison-verdict"></div>
          <div class="calc-result-label" id="comparison-details"></div>
          <div class="calc-result-grid" id="comparison-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Renting Net Cost = Total Rent Paid - Investment Return on Down Payment</code>
        <code>Buying Net Cost = Total Mortgage Payments + Fees & Taxes - Home Equity Gain</code>
        <p>This comparison evaluates renting vs buying. We assume the Down Payment is invested in the renting scenario to yield the specified Investment Return Rate. Buying costs include mortgage payments (30-year term), estimated closing/selling fees (2% buy, 6% sell), and annual taxes/maintenance (estimated at 2.5% of home value annually). Home Equity Gain is the final home value minus the remaining mortgage balance and your initial down payment.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const rentInput = document.getElementById('monthly-rent');
  const rentIncreaseInput = document.getElementById('rent-increase');
  const homePriceInput = document.getElementById('home-price');
  const downPaymentInput = document.getElementById('down-payment');
  const interestInput = document.getElementById('interest-rate');
  const appreciationInput = document.getElementById('home-appreciation');
  const investmentInput = document.getElementById('investment-return');
  const stayInput = document.getElementById('length-of-stay');

  const resultDiv = document.getElementById('result');
  const verdictEl = document.getElementById('comparison-verdict');
  const detailsEl = document.getElementById('comparison-details');
  const gridEl = document.getElementById('comparison-grid');

  function calculate() {
    const rent = parseFloat(rentInput.value);
    const homePrice = parseFloat(homePriceInput.value);
    const years = parseFloat(stayInput.value);

    if (isNaN(rent) || rent <= 0 || isNaN(homePrice) || homePrice <= 0 || isNaN(years) || years <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const rentIncrease = (parseFloat(rentIncreaseInput.value) || 0) / 100;
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const interestRate = (parseFloat(interestInput.value) || 0) / 100;
    const appreciation = (parseFloat(appreciationInput.value) || 0) / 100;
    const investmentReturn = (parseFloat(investmentInput.value) || 0) / 100;

    // --- Renting Calculations ---
    let totalRentPaid = 0;
    for (let t = 1; t <= years; t++) {
      totalRentPaid += rent * 12 * Math.pow(1 + rentIncrease, t - 1);
    }
    const finalInvestmentValue = downPayment * Math.pow(1 + investmentReturn, years);
    const savingsReturn = finalInvestmentValue - downPayment;
    const netRentingCost = totalRentPaid - savingsReturn;

    // --- Buying Calculations ---
    const loanAmount = Math.max(0, homePrice - downPayment);
    const termMonths = 360; // 30 years standard
    const r = interestRate / 12;
    let monthlyMortgage = 0;
    if (loanAmount > 0) {
      if (r > 0) {
        monthlyMortgage = (loanAmount * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
      } else {
        monthlyMortgage = loanAmount / termMonths;
      }
    }

    const monthsPaid = Math.min(termMonths, years * 12);
    const totalMortgagePaid = monthlyMortgage * monthsPaid;

    let remainingBalance = 0;
    if (years < 30 && loanAmount > 0) {
      if (r > 0) {
        remainingBalance = loanAmount * (Math.pow(1 + r, termMonths) - Math.pow(1 + r, monthsPaid)) / (Math.pow(1 + r, termMonths) - 1);
      } else {
        remainingBalance = loanAmount * (1 - (monthsPaid / termMonths));
      }
    }

    const finalHomeValue = homePrice * Math.pow(1 + appreciation, years);
    const homeEquity = Math.max(0, finalHomeValue - remainingBalance);
    const homeEquityGain = homeEquity - downPayment;

    // Fees & Taxes estimation:
    // Buying costs: 2% of price; Selling costs: 6% of resale price
    // Property tax + insurance + maintenance: estimated 2.5% of purchase price annually
    const buyingClosingFees = homePrice * 0.02;
    const sellingFees = finalHomeValue * 0.06;
    const annualTaxesMaintenance = homePrice * 0.025 * years;
    const totalFeesAndTaxes = buyingClosingFees + sellingFees + annualTaxesMaintenance;

    const netBuyingCost = totalMortgagePaid + totalFeesAndTaxes - homeEquityGain;

    // --- Comparison verdict ---
    const buyingIsCheaper = netBuyingCost < netRentingCost;
    const savings = Math.abs(netRentingCost - netBuyingCost);

    if (buyingIsCheaper) {
      verdictEl.textContent = `Buying is better!`;
      detailsEl.textContent = `You would save $${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} over ${years} years by buying instead of renting.`;
    } else {
      verdictEl.textContent = `Renting is better!`;
      detailsEl.textContent = `You would save $${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} over ${years} years by renting instead of buying.`;
    }

    gridEl.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">$${netRentingCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div class="calc-result-label">Net Renting Cost</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${netBuyingCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div class="calc-result-label">Net Buying Cost</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${totalRentPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div class="calc-result-label">Total Rent Paid</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${savingsReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div class="calc-result-label">Rent Opportunity Gain</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${totalMortgagePaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div class="calc-result-label">Mortgage Paid</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${homeEquityGain.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div class="calc-result-label">Home Equity Gain</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${totalFeesAndTaxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div class="calc-result-label">Fees & Taxes Paid</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">$${finalHomeValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div class="calc-result-label">Future Home Value</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  const inputs = [rentInput, rentIncreaseInput, homePriceInput, downPaymentInput, interestInput, appreciationInput, investmentInput, stayInput];
  inputs.forEach(input => input.addEventListener('input', calculate));

  calculate();

  return () => {
    inputs.forEach(input => input.removeEventListener('input', calculate));
  };
}
