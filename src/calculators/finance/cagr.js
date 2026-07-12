export const meta = {
  slug: 'cagr',
  name: 'CAGR Calculator',
  title: 'CAGR Calculator - Calcyx',
  description: 'Calculate the Compound Annual Growth Rate (CAGR) of an investment over a period of years, along with total growth and annual progress.',
  category: 'finance',
  icon: '📈',
  keywords: ['cagr', 'compound annual growth rate', 'annual growth rate', 'investment growth', 'annual return', 'growth table'],
  formula: '\\text{CAGR} = \\left(\\frac{V_{end}}{V_{begin}}\\right)^{\\frac{1}{t}} - 1',
  relatedSlugs: ['roi', 'compound-interest']
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
            <label for="cagr-begin">Beginning Value ($)</label>
            <input type="number" id="cagr-begin" class="calc-input" placeholder="e.g. 10000" min="0.01" step="100">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="cagr-end">Ending Value ($)</label>
            <input type="number" id="cagr-end" class="calc-input" placeholder="e.g. 20000" min="0" step="100">
          </div>
        </div>

        <div class="calc-input-group">
          <label for="cagr-years">Number of Years</label>
          <input type="number" id="cagr-years" class="calc-input" placeholder="e.g. 5" min="0.01" step="0.1">
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">CAGR (Annual Return)</span>
            <span class="calc-result-value" id="cagr-rate-val"></span>
            <span class="calc-result-detail">Annualized compound rate</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Growth</span>
            <span class="calc-result-value" id="cagr-total-val"></span>
            <span class="calc-result-detail">Absolute return percentage</span>
          </div>
        </div>

        <div style="margin-top: 25px; overflow-x: auto;">
          <h3 style="margin-bottom: 12px; font-size: 1.1rem; opacity: 0.9;">Annual Progress Schedule</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; min-width: 320px;">
            <thead>
              <tr style="border-bottom: 2px solid rgba(255, 255, 255, 0.15); text-align: left; opacity: 0.8;">
                <th style="padding: 10px 8px;">Year</th>
                <th style="padding: 10px 8px; text-align: right;">Value</th>
                <th style="padding: 10px 8px; text-align: right;">Total Gain</th>
                <th style="padding: 10px 8px; text-align: right;">Total Growth</th>
              </tr>
            </thead>
            <tbody id="cagr-table-body">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 CAGR Formula</h3>
        <p>Compound Annual Growth Rate is calculated as:</p>
        <code>CAGR = (Ending Value / Beginning Value) ^ (1 / Years) &minus; 1</code>
        <p style="margin-top: 10px;">Where:</p>
        <ul style="padding-left: 20px; margin-top: 5px;">
          <li><strong>Ending Value</strong> = Final value of the investment</li>
          <li><strong>Beginning Value</strong> = Initial value of the investment</li>
          <li><strong>Years</strong> = Duration of the investment</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const beginInput = document.getElementById('cagr-begin');
  const endInput = document.getElementById('cagr-end');
  const yearsInput = document.getElementById('cagr-years');
  const resultDiv = document.getElementById('result');

  const rateVal = document.getElementById('cagr-rate-val');
  const totalVal = document.getElementById('cagr-total-val');
  const tableBody = document.getElementById('cagr-table-body');

  function calculate() {
    const begin = parseFloat(beginInput.value);
    const end = parseFloat(endInput.value);
    const years = parseFloat(yearsInput.value);

    if (isNaN(begin) || begin <= 0 || isNaN(end) || end < 0 || isNaN(years) || years <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const cagr = (Math.pow(end / begin, 1 / years) - 1) * 100;
    const totalGrowth = ((end - begin) / begin) * 100;

    // Output main results
    if (cagr >= 0) {
      rateVal.textContent = '+' + cagr.toFixed(2) + '%';
      rateVal.style.color = '#10b981'; // Green
    } else {
      rateVal.textContent = cagr.toFixed(2) + '%';
      rateVal.style.color = '#ef4444'; // Red
    }

    if (totalGrowth >= 0) {
      totalVal.textContent = '+' + totalGrowth.toFixed(2) + '%';
      totalVal.style.color = '#10b981';
    } else {
      totalVal.textContent = totalGrowth.toFixed(2) + '%';
      totalVal.style.color = '#ef4444';
    }

    // Build the table rows
    let tableHtml = '';
    const g = cagr / 100;
    const intYears = Math.floor(years);

    // Initial Year 0
    tableHtml += `
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
        <td style="padding: 10px 8px; opacity: 0.7;">Initial</td>
        <td style="padding: 10px 8px; text-align: right; font-weight: 500;">$${begin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style="padding: 10px 8px; text-align: right; opacity: 0.7;">$0.00</td>
        <td style="padding: 10px 8px; text-align: right; opacity: 0.7;">0.00%</td>
      </tr>
    `;

    for (let y = 1; y <= intYears; y++) {
      const yearVal = begin * Math.pow(1 + g, y);
      const yearGain = yearVal - begin;
      const yearGrowth = (yearGain / begin) * 100;

      tableHtml += `
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
          <td style="padding: 10px 8px; opacity: 0.9;">Year ${y}</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 500;">$${yearVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="padding: 10px 8px; text-align: right; color: ${yearGain >= 0 ? '#10b981' : '#ef4444'}">
            ${yearGain >= 0 ? '+$' : '-$'}${Math.abs(yearGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td style="padding: 10px 8px; text-align: right; color: ${yearGrowth >= 0 ? '#10b981' : '#ef4444'}">
            ${yearGrowth >= 0 ? '+' : ''}${yearGrowth.toFixed(2)}%
          </td>
        </tr>
      `;
    }

    // If years has a fractional part, append the final year row
    if (years > intYears) {
      const finalGain = end - begin;
      tableHtml += `
        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
          <td style="padding: 10px 8px; font-weight: 600;">Year ${years.toFixed(1)} (End)</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 600;">$${end.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 600; color: ${finalGain >= 0 ? '#10b981' : '#ef4444'}">
            ${finalGain >= 0 ? '+$' : '-$'}${Math.abs(finalGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 600; color: ${totalGrowth >= 0 ? '#10b981' : '#ef4444'}">
            ${totalGrowth >= 0 ? '+' : ''}${totalGrowth.toFixed(2)}%
          </td>
        </tr>
      `;
    }

    tableBody.innerHTML = tableHtml;
    resultDiv.style.display = '';
  }

  beginInput.addEventListener('input', calculate);
  endInput.addEventListener('input', calculate);
  yearsInput.addEventListener('input', calculate);

  return function cleanup() {
    beginInput.removeEventListener('input', calculate);
    endInput.removeEventListener('input', calculate);
    yearsInput.removeEventListener('input', calculate);
  };
}
