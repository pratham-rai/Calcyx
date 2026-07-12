export const meta = {
  slug: 'ratio-divider',
  name: 'Ratio Divider',
  title: 'Ratio Divider - Calcyx',
  description: 'Divide a total sum or amount into individual shares according to a specific ratio. Simplifies ratios and calculates percentage breakdowns.',
  category: 'everyday',
  icon: '⚖️',
  keywords: ['ratio', 'divide ratio', 'ratio calculator', 'share divider', 'ratio sharing', 'proportional division'],
  formula: 'Share = Total × (Part / Sum of Parts)',
  relatedSlugs: ['percentage', 'fraction']
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
          <div class="calc-input-group" style="flex: 2;">
            <label for="total-amount">Total Amount to Divide</label>
            <input type="number" id="total-amount" class="calc-input" value="1000" min="0" step="any" placeholder="e.g., 1000">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="currency-unit">Unit / Currency</label>
            <select id="currency-unit" class="calc-select">
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="₹">₹ (INR)</option>
              <option value="¥">¥ (JPY)</option>
              <option value="">None (Generic Units)</option>
            </select>
          </div>
        </div>

        <div class="calc-input-group">
          <label for="ratio-input">Ratio Values (separated by colons, commas, or spaces)</label>
          <input type="text" id="ratio-input" class="calc-input" value="3:5:2" placeholder="e.g., 3:5:2 or 1.5, 2.5, 5">
          <small style="display: block; margin-top: 0.25rem; font-size: 0.8rem; opacity: 0.7;">Supports decimal ratios (e.g. 1.5:2:2.5) which will be automatically simplified.</small>
        </div>

        <div id="error-message" style="display: none; color: #ff6b6b; font-size: 0.9rem; margin-bottom: 1rem; font-family: monospace; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; padding: 0.5rem 0.75rem; border-radius: 4px;"></div>

        <div id="result" class="calc-result" style="display: none;">
          <div class="calc-result-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 1.5rem;">
            <div class="calc-result-item">
              <div class="calc-result-label">Simplified Ratio</div>
              <div class="calc-result-value" id="simplified-ratio-display" style="font-size: 1.5rem;"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Sum of Ratio Parts</div>
              <div class="calc-result-value" id="sum-parts-display" style="font-size: 1.5rem;"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Number of Shares</div>
              <div class="calc-result-value" id="num-shares-display" style="font-size: 1.5rem;"></div>
            </div>
          </div>

          <div class="calc-result-label" style="margin-bottom: 0.75rem; font-weight: 600;">Share Breakdown</div>
          <div id="share-breakdown-list" style="display: flex; flex-direction: column; gap: 0.75rem;"></div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>📚 How Proportional Division Works</h3>
        <code>Share Value = Total Amount × (Share Part / Sum of All Parts)</code>
        <p>To divide a total amount into a given ratio:</p>
        <ol>
          <li><strong>Sum the parts:</strong> Add all individual ratio values together to get the total number of parts (e.g., <code>3 + 5 + 2 = 10 parts</code>).</li>
          <li><strong>Find the value of one part:</strong> Divide the total amount by the sum of parts (e.g., <code>$1,000 / 10 = $100 per part</code>).</li>
          <li><strong>Multiply to get individual shares:</strong> Multiply each ratio value by the value of one part (e.g., 3 parts = <code>3 × $100 = $300</code>).</li>
        </ol>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const totalInput = document.getElementById('total-amount');
  const currencySelect = document.getElementById('currency-unit');
  const ratioInput = document.getElementById('ratio-input');
  const errorMsg = document.getElementById('error-message');
  const resultDiv = document.getElementById('result');

  const simplifiedRatioDisplay = document.getElementById('simplified-ratio-display');
  const sumPartsDisplay = document.getElementById('sum-parts-display');
  const numSharesDisplay = document.getElementById('num-shares-display');
  const breakdownList = document.getElementById('share-breakdown-list');

  function gcd(a, b) {
    while (b) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  function getDecimalsCount(num) {
    const parts = num.toString().split('.');
    return parts.length > 1 ? parts[1].length : 0;
  }

  function calculate() {
    const totalVal = totalInput.value;
    const ratioVal = ratioInput.value.trim();

    if (totalVal === '' || !ratioVal) {
      resultDiv.style.display = 'none';
      errorMsg.style.display = 'none';
      return;
    }

    const total = parseFloat(totalVal);
    if (isNaN(total) || total < 0) {
      errorMsg.textContent = 'Please enter a valid positive total amount.';
      errorMsg.style.display = 'block';
      resultDiv.style.display = 'none';
      return;
    }

    // Parse the ratio
    const originalParts = ratioVal
      .split(/[:,\s]+/)
      .map(x => parseFloat(x))
      .filter(x => !isNaN(x));

    if (originalParts.length === 0) {
      resultDiv.style.display = 'none';
      errorMsg.style.display = 'none';
      return;
    }

    // Check for negative or zero parts
    if (originalParts.some(p => p <= 0)) {
      errorMsg.textContent = 'Error: Ratio parts must be positive numbers greater than zero.';
      errorMsg.style.display = 'block';
      resultDiv.style.display = 'none';
      return;
    }

    errorMsg.style.display = 'none';

    // Simplify ratio parts if possible
    const maxDecimals = Math.max(...originalParts.map(getDecimalsCount));
    const scalingFactor = Math.pow(10, maxDecimals);
    const integers = originalParts.map(x => Math.round(x * scalingFactor));
    
    const commonGcd = integers.reduce((acc, val) => gcd(acc, val));
    const simplifiedParts = integers.map(x => x / commonGcd);

    const sumOriginal = originalParts.reduce((a, b) => a + b, 0);
    const sumSimplified = simplifiedParts.reduce((a, b) => a + b, 0);
    const unit = currencySelect.value;

    simplifiedRatioDisplay.textContent = simplifiedParts.join(' : ');
    sumPartsDisplay.textContent = sumOriginal.toLocaleString(undefined, { maximumFractionDigits: 4 });
    numSharesDisplay.textContent = originalParts.length.toString();

    // Generate breakdown items
    breakdownList.innerHTML = originalParts.map((part, index) => {
      const shareAmount = total * (part / sumOriginal);
      const percentage = (part / sumOriginal) * 100;
      
      const formattedShare = shareAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      const formattedPercentage = percentage.toFixed(2);
      
      return `
        <div class="calc-result-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-left: 4px solid var(--accent, #6366f1); background: rgba(255, 255, 255, 0.02); border-radius: 4px;">
          <div>
            <div class="calc-result-label" style="text-align: left; margin: 0; font-size: 0.95rem; font-weight: 500;">
              Share ${index + 1} (${part.toLocaleString(undefined, { maximumFractionDigits: 4 })})
            </div>
            <div style="font-size: 0.8rem; opacity: 0.6; text-align: left;">
              ${formattedPercentage}% of total
            </div>
          </div>
          <div class="calc-result-value" style="font-size: 1.25rem; margin: 0; text-align: right;">
            ${unit}${formattedShare}
          </div>
        </div>
      `;
    }).join('');

    resultDiv.style.display = 'block';
  }

  totalInput.addEventListener('input', calculate);
  currencySelect.addEventListener('change', calculate);
  ratioInput.addEventListener('input', calculate);

  calculate();

  return () => {
    totalInput.removeEventListener('input', calculate);
    currencySelect.removeEventListener('change', calculate);
    ratioInput.removeEventListener('input', calculate);
  };
}
