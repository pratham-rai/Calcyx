export const meta = {
  slug: 'roi',
  name: 'ROI Calculator',
  title: 'ROI Calculator - Calcyx',
  description: 'Calculate the total gain, absolute return percentage, and compound annualized rate of return (ROI) on your investments.',
  category: 'finance',
  icon: '📈',
  keywords: ['roi', 'return on investment', 'investment return', 'cagr', 'profitability', 'yield'],
  formula: '\\text{Total Gain} = V_f - V_i \\\\ \\text{Absolute Return} = \\frac{V_f - V_i}{V_i} \\times 100 \\\\ \\text{Annualized ROI} = \\left(\\frac{V_f}{V_i}\\right)^{\\frac{1}{t}} - 1',
  relatedSlugs: ['compound-interest', 'cagr']
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
            <label for="roi-initial">Initial Investment ($)</label>
            <input type="number" id="roi-initial" class="calc-input" placeholder="e.g. 10000" min="0.01" step="100">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="roi-final">Final Value ($)</label>
            <input type="number" id="roi-final" class="calc-input" placeholder="e.g. 15000" min="0" step="100">
          </div>
        </div>

        <div class="calc-input-group">
          <label for="roi-years">Holding Period (years)</label>
          <input type="number" id="roi-years" class="calc-input" placeholder="e.g. 3" min="0.001" step="0.1">
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Total Gain / Loss</span>
            <span class="calc-result-value" id="roi-gain-val"></span>
            <span class="calc-result-detail">Net profit or loss amount</span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Absolute Return</span>
            <span class="calc-result-value" id="roi-absolute-val"></span>
            <span class="calc-result-detail">Total percentage return</span>
          </div>
          <div class="calc-result-item" style="grid-column: span 2;">
            <span class="calc-result-label">Annualized ROI (CAGR)</span>
            <span class="calc-result-value" id="roi-annualized-val"></span>
            <span class="calc-result-detail">Compound annual growth rate of the investment</span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 ROI Formulas</h3>
        <p>Return on Investment is calculated using three main metrics:</p>
        <ul style="padding-left: 20px; margin-top: 10px; margin-bottom: 10px;">
          <li><strong>Total Gain / Loss:</strong> <code>Final Value &minus; Initial Investment</code></li>
          <li><strong>Absolute Return:</strong> <code>(Total Gain / Initial Investment) &times; 100</code></li>
          <li><strong>Annualized ROI:</strong> <code>((Final Value / Initial Investment) ^ (1 / Years) &minus; 1) &times; 100</code></li>
        </ul>
        <p>Annualized ROI represents the geometric progression ratio that provides a constant rate of return over the holding period, allowing direct comparison between investments of different durations.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const initialInput = document.getElementById('roi-initial');
  const finalInput = document.getElementById('roi-final');
  const yearsInput = document.getElementById('roi-years');
  const resultDiv = document.getElementById('result');

  const gainVal = document.getElementById('roi-gain-val');
  const absoluteVal = document.getElementById('roi-absolute-val');
  const annualizedVal = document.getElementById('roi-annualized-val');

  function calculate() {
    const initial = parseFloat(initialInput.value);
    const final = parseFloat(finalInput.value);
    const years = parseFloat(yearsInput.value);

    if (isNaN(initial) || initial <= 0 || isNaN(final) || final < 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const gain = final - initial;
    const absoluteReturn = (gain / initial) * 100;

    // Formatting Gain/Loss
    if (gain >= 0) {
      gainVal.textContent = '+$' + gain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      gainVal.style.color = '#10b981'; // Green
    } else {
      gainVal.textContent = '-$' + Math.abs(gain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      gainVal.style.color = '#ef4444'; // Red
    }

    // Formatting Absolute Return
    if (absoluteReturn >= 0) {
      absoluteVal.textContent = '+' + absoluteReturn.toFixed(2) + '%';
      absoluteVal.style.color = '#10b981';
    } else {
      absoluteVal.textContent = absoluteReturn.toFixed(2) + '%';
      absoluteVal.style.color = '#ef4444';
    }

    // Annualized Return (requires years > 0 and final value >= 0)
    if (!isNaN(years) && years > 0) {
      if (final === 0) {
        annualizedVal.textContent = '-100.00%';
        annualizedVal.style.color = '#ef4444';
      } else {
        const annualizedReturn = (Math.pow(final / initial, 1 / years) - 1) * 100;
        if (annualizedReturn >= 0) {
          annualizedVal.textContent = '+' + annualizedReturn.toFixed(2) + '%';
          annualizedVal.style.color = '#10b981';
        } else {
          annualizedVal.textContent = annualizedReturn.toFixed(2) + '%';
          annualizedVal.style.color = '#ef4444';
        }
      }
    } else {
      annualizedVal.textContent = '—';
      annualizedVal.style.color = '';
    }

    resultDiv.style.display = '';
  }

  initialInput.addEventListener('input', calculate);
  finalInput.addEventListener('input', calculate);
  yearsInput.addEventListener('input', calculate);

  return function cleanup() {
    initialInput.removeEventListener('input', calculate);
    finalInput.removeEventListener('input', calculate);
    yearsInput.removeEventListener('input', calculate);
  };
}
