export const meta = {
  slug: 'loan-to-value',
  name: 'Loan-to-Value (LTV) Calculator',
  title: 'Loan-to-Value (LTV) & Appraisal Ratio Calculator - Calcyx',
  description: 'Calculate your Loan-to-Value (LTV) ratio, evaluate home equity, check risk status, and determine if Private Mortgage Insurance (PMI) is required.',
  category: 'everyday',
  icon: '🏦',
  keywords: ['loan to value', 'ltv', 'appraisal ratio', 'mortgage', 'home equity', 'pmi', 'home loan'],
  formula: 'LTV Ratio = (Loan Amount ÷ Appraised Value) × 100; Lending LTV = (Loan Amount ÷ Min(Purchase Price, Appraised Value)) × 100',
  relatedSlugs: ['mortgage', 'emi']
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
            <label for="purchase-price">Purchase Price ($)</label>
            <input type="number" id="purchase-price" class="calc-input" placeholder="e.g. 300000" step="1000" min="0" value="300000">
          </div>
          <div class="calc-input-group">
            <label for="appraised-value">Appraised Value ($)</label>
            <input type="number" id="appraised-value" class="calc-input" placeholder="e.g. 310000" step="1000" min="0" value="310000">
          </div>
        </div>

        <div class="calc-input-group">
          <label for="loan-amount">Loan Amount ($)</label>
          <input type="number" id="loan-amount" class="calc-input" placeholder="e.g. 240000" step="1000" min="0" value="240000">
        </div>

        <div id="error-message" style="display: none; color: #ff6b6b; font-size: 0.9rem; margin-top: -0.5rem; margin-bottom: 1rem; font-family: monospace; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; padding: 0.5rem 0.75rem; border-radius: 4px;"></div>

        <div id="result" class="calc-result" style="display: none;">
          <div class="calc-result-value" id="ltv-appraisal-val">77.4%</div>
          <div class="calc-result-label">Appraisal-based LTV Ratio</div>
          
          <div class="calc-result-grid" style="margin-top: 1.5rem;">
            <div class="calc-result-item">
              <div class="calc-result-value" id="ltv-lending-val">80.0%</div>
              <div class="calc-result-label">Standard Lending LTV</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="equity-pct-val">22.6%</div>
              <div class="calc-result-label">Home Equity (Appraisal)</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="pmi-required-val">No</div>
              <div class="calc-result-label">PMI Required</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="risk-status-val">Low Risk</div>
              <div class="calc-result-label">Risk Assessment</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>🏦 Understanding Loan-to-Value (LTV)</h3>
        <p>The Loan-to-Value (LTV) ratio is a financial metric used by lenders to assess the risk of a mortgage loan before approving it.</p>
        <p>1. <strong>Appraisal-based LTV:</strong> Calculated using only the appraised value of the property.</p>
        <code>LTV (Appraisal) = (Loan Amount ÷ Appraised Value) × 100</code>
        <p>2. <strong>Standard Lending LTV:</strong> Lenders typically base their loan approval on the <em>lesser</em> of the purchase price or the appraised value. This represents the true lending risk.</p>
        <code>Lending LTV = (Loan Amount ÷ Min(Purchase Price, Appraised Value)) × 100</code>
        <p>3. <strong>Private Mortgage Insurance (PMI):</strong> If the Lending LTV exceeds <strong>80%</strong> (meaning you put down less than 20% equity), lenders usually require you to pay for PMI to protect them in case of default.</p>
        <p>4. <strong>Risk Assessment Categories:</strong></p>
        <ul>
          <li><strong>Low Risk (LTV &le; 80%):</strong> No PMI required. Best interest rates.</li>
          <li><strong>Medium Risk (80% &lt; LTV &le; 95%):</strong> PMI required. Moderate rates.</li>
          <li><strong>High Risk (LTV &gt; 95%):</strong> High PMI premiums, strict lending criteria.</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const purchasePriceInput = document.getElementById('purchase-price');
  const appraisedValueInput = document.getElementById('appraised-value');
  const loanAmountInput = document.getElementById('loan-amount');

  const errorMsg = document.getElementById('error-message');
  const resultDiv = document.getElementById('result');
  const ltvAppraisalVal = document.getElementById('ltv-appraisal-val');
  const ltvLendingVal = document.getElementById('ltv-lending-val');
  const equityPctVal = document.getElementById('equity-pct-val');
  const pmiRequiredVal = document.getElementById('pmi-required-val');
  const riskStatusVal = document.getElementById('risk-status-val');

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    resultDiv.style.display = 'none';
  }

  function hideError() {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
  }

  function calculate() {
    const purchasePrice = parseFloat(purchasePriceInput.value);
    const appraisedValue = parseFloat(appraisedValueInput.value);
    const loanAmount = parseFloat(loanAmountInput.value);

    hideError();

    if (isNaN(purchasePrice) || isNaN(appraisedValue) || isNaN(loanAmount)) {
      resultDiv.style.display = 'none';
      return;
    }

    if (purchasePrice <= 0 || appraisedValue <= 0) {
      showError('Purchase price and appraised value must be greater than zero.');
      return;
    }

    if (loanAmount < 0) {
      showError('Loan amount cannot be negative.');
      return;
    }

    if (loanAmount > Math.max(purchasePrice, appraisedValue) * 1.5) {
      showError('Loan amount exceeds 150% of the property value. Please double-check your loan amount.');
      return;
    }

    // Calculations
    const appraisalLtv = (loanAmount / appraisedValue) * 100;
    const lendingVal = Math.min(purchasePrice, appraisedValue);
    const lendingLtv = (loanAmount / lendingVal) * 100;
    const equityPct = Math.max(0, 100 - appraisalLtv);

    // Formatted Outputs
    ltvAppraisalVal.textContent = `${appraisalLtv.toFixed(1)}%`;
    ltvLendingVal.textContent = `${lendingLtv.toFixed(1)}%`;
    equityPctVal.textContent = `${equityPct.toFixed(1)}%`;

    // PMI Check
    if (lendingLtv > 80.001) { // Floating point leniency
      pmiRequiredVal.textContent = 'Yes';
      pmiRequiredVal.style.color = '#ff6b6b';
    } else {
      pmiRequiredVal.textContent = 'No';
      pmiRequiredVal.style.color = '#2ed573';
    }

    // Risk Status
    let riskStr = '';
    let riskColor = '';
    if (lendingLtv <= 80.001) {
      riskStr = 'Low Risk';
      riskColor = '#2ed573';
    } else if (lendingLtv <= 95.001) {
      riskStr = 'Moderate Risk';
      riskColor = '#ffa502';
    } else {
      riskStr = 'High Risk';
      riskColor = '#ff6b6b';
    }

    riskStatusVal.textContent = riskStr;
    riskStatusVal.style.color = riskColor;

    resultDiv.style.display = 'block';
  }

  // Event Listeners
  purchasePriceInput.addEventListener('input', calculate);
  appraisedValueInput.addEventListener('input', calculate);
  loanAmountInput.addEventListener('input', calculate);

  // Initialize
  calculate();

  return () => {
    purchasePriceInput.removeEventListener('input', calculate);
    appraisedValueInput.removeEventListener('input', calculate);
    loanAmountInput.removeEventListener('input', calculate);
  };
}
