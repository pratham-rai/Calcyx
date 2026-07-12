export const meta = {
  slug: 'rental-yield',
  name: 'Rental Yield Calculator',
  title: 'Rental Yield Calculator - Calcyx',
  description: 'Calculate gross and net rental yield on real estate property. Analyze annual rental income and expense ratios.',
  category: 'finance',
  icon: '🏡',
  keywords: ['rental yield', 'property yield', 'real estate yield', 'gross rental yield', 'net rental yield', 'investment property'],
  formula: '\\text{Gross Yield} = \\frac{\\text{Rent} \\times 12}{\\text{Price}} \\times 100',
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
            <label for="yield-price">Property Purchase Price ($)</label>
            <input type="number" id="yield-price" class="calc-input" placeholder="e.g. 350000" min="1000" step="1000">
          </div>
          <div class="calc-input-group">
            <label for="yield-rent">Monthly Rent ($)</label>
            <input type="number" id="yield-rent" class="calc-input" placeholder="e.g. 2000" min="0" step="50">
          </div>
        </div>

        <h3 style="margin: 15px 0 5px; font-size: 1.1rem; opacity: 0.9;">Annual Operating Expenses</h3>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="yield-tax">Property Tax ($/year)</label>
            <input type="number" id="yield-tax" class="calc-input" placeholder="e.g. 3000" min="0" step="100">
          </div>
          <div class="calc-input-group">
            <label for="yield-hoa">HOA Fees ($/year)</label>
            <input type="number" id="yield-hoa" class="calc-input" placeholder="e.g. 1200" min="0" step="100">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="yield-ins">Home Insurance ($/year)</label>
            <input type="number" id="yield-ins" class="calc-input" placeholder="e.g. 1000" min="0" step="100">
          </div>
          <div class="calc-input-group">
            <label for="yield-maint">Maintenance / Repairs ($/year)</label>
            <input type="number" id="yield-maint" class="calc-input" placeholder="e.g. 1500" min="0" step="100">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Gross Rental Yield</span>
            <span class="calc-result-value" id="res-gross"></span>
            <span class="calc-result-detail">Before expenses</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Net Rental Yield</span>
            <span class="calc-result-value" id="res-net"></span>
            <span class="calc-result-detail">After expenses</span>
          </div>
        </div>

        <div style="margin-top: 20px; text-align: left; font-size: 0.95rem; opacity: 0.95; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Annual Gross Rent:</span>
            <strong id="detail-gross-rent"></strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Total Annual Expenses:</span>
            <strong id="detail-expenses"></strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Annual Net Income:</span>
            <strong id="detail-net-income"></strong>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Rental Yield Formulas</h3>
        <code>Gross Rental Yield = (Annual Gross Rent / Purchase Price) &times; 100</code>
        <code>Net Rental Yield = (Annual Net Rent / Purchase Price) &times; 100</code>
        <p>Where:</p>
        <ul style="padding-left: 20px; margin-top: 5px;">
          <li><strong>Annual Gross Rent</strong> = Monthly Rent &times; 12</li>
          <li><strong>Annual Expenses</strong> = Property Tax + HOA + Insurance + Maintenance</li>
          <li><strong>Annual Net Rent</strong> = Annual Gross Rent &minus; Annual Expenses</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const priceInput = document.getElementById('yield-price');
  const rentInput = document.getElementById('yield-rent');
  const taxInput = document.getElementById('yield-tax');
  const hoaInput = document.getElementById('yield-hoa');
  const insInput = document.getElementById('yield-ins');
  const maintInput = document.getElementById('yield-maint');

  const resultDiv = document.getElementById('result');
  const resGross = document.getElementById('res-gross');
  const resNet = document.getElementById('res-net');
  const detailGrossRent = document.getElementById('detail-gross-rent');
  const detailExpenses = document.getElementById('detail-expenses');
  const detailNetIncome = document.getElementById('detail-net-income');

  function formatCurrency(val) {
    if (val < 0) {
      return '-$' + Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculate() {
    const price = parseFloat(priceInput.value);
    const rent = parseFloat(rentInput.value);
    
    const tax = parseFloat(taxInput.value) || 0;
    const hoa = parseFloat(hoaInput.value) || 0;
    const ins = parseFloat(insInput.value) || 0;
    const maint = parseFloat(maintInput.value) || 0;

    // Validate inputs
    if (isNaN(price) || price <= 0 || isNaN(rent) || rent < 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const annualGrossRent = rent * 12;
    const annualExpenses = tax + hoa + ins + maint;
    const annualNetIncome = annualGrossRent - annualExpenses;

    const grossYield = (annualGrossRent / price) * 100;
    const netYield = (annualNetIncome / price) * 100;

    resGross.textContent = grossYield.toFixed(2) + '%';
    resNet.textContent = netYield.toFixed(2) + '%';

    // Apply color indications for positive vs negative net yield
    if (netYield >= 0) {
      resNet.style.color = '#10b981'; // Green
    } else {
      resNet.style.color = '#ef4444'; // Red
    }

    detailGrossRent.textContent = formatCurrency(annualGrossRent);
    detailExpenses.textContent = formatCurrency(annualExpenses);
    detailNetIncome.textContent = formatCurrency(annualNetIncome);

    // Apply color class/styles to net income row
    if (annualNetIncome >= 0) {
      detailNetIncome.style.color = '';
    } else {
      detailNetIncome.style.color = '#ef4444';
    }

    resultDiv.style.display = '';
  }

  const inputs = [priceInput, rentInput, taxInput, hoaInput, insInput, maintInput];
  inputs.forEach(input => input.addEventListener('input', calculate));

  return function cleanup() {
    inputs.forEach(input => input.removeEventListener('input', calculate));
  };
}
