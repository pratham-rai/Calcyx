export const meta = {
  slug: 'salary',
  name: 'Salary / Take-Home Pay',
  title: 'Salary / Take-Home Pay Calculator - Calcyx',
  description: 'Calculate your net take-home pay after federal taxes, state taxes, and monthly deductions.',
  category: 'finance',
  icon: '💵',
  keywords: ['salary', 'take-home pay', 'net income', 'income tax', 'paycheck', 'deductions'],
  formula: 'Net\\ Annual = Gross - Taxes - (Deductions \\times 12)',
  relatedSlugs: ['break-even', 'discount']
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
            <label for="salary-gross">Gross Annual Salary ($)</label>
            <input type="number" id="salary-gross" class="calc-input" placeholder="e.g. 75000" min="0" step="1000">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="salary-fed-tax">Federal Tax Rate (%)</label>
            <input type="number" id="salary-fed-tax" class="calc-input" placeholder="e.g. 12" min="0" max="100" step="0.1">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="salary-state-tax">State Tax Rate (%)</label>
            <input type="number" id="salary-state-tax" class="calc-input" placeholder="e.g. 4" min="0" max="100" step="0.1">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="salary-deductions">Monthly Deductions ($)</label>
            <input type="number" id="salary-deductions" class="calc-input" placeholder="e.g. 350" min="0" step="10">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item" style="grid-column: span 2;">
            <span class="calc-result-label">Net Annual Take-Home</span>
            <span class="calc-result-value" id="salary-net-annual"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Monthly Take-Home</span>
            <span class="calc-result-value" id="salary-net-monthly" style="font-size: 1.5rem;"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Weekly Take-Home</span>
            <span class="calc-result-value" id="salary-net-weekly" style="font-size: 1.5rem;"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Annual Tax Paid</span>
            <span class="calc-result-detail" id="salary-tax-total"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Annual Deductions</span>
            <span class="calc-result-detail" id="salary-deductions-total"></span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Calculation Breakdown</h3>
        <p>Your take-home income is calculated by subtracting annual taxes and deductions from your gross salary:</p>
        <ul style="padding-left: 20px; margin-top: 10px;">
          <li><strong>Federal Tax</strong> = Gross Salary &times; Federal Tax Rate %</li>
          <li><strong>State Tax</strong> = Gross Salary &times; State Tax Rate %</li>
          <li><strong>Annual Deductions</strong> = Monthly Deductions &times; 12</li>
          <li><strong>Net Annual Take-Home</strong> = Gross Salary &minus; Federal Tax &minus; State Tax &minus; Annual Deductions</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const grossInput = document.getElementById('salary-gross');
  const fedTaxInput = document.getElementById('salary-fed-tax');
  const stateTaxInput = document.getElementById('salary-state-tax');
  const deductionsInput = document.getElementById('salary-deductions');

  const resultDiv = document.getElementById('result');

  function calculate() {
    const gross = parseFloat(grossInput.value);
    const fedTax = parseFloat(fedTaxInput.value) || 0;
    const stateTax = parseFloat(stateTaxInput.value) || 0;
    const deductions = parseFloat(deductionsInput.value) || 0;

    if (isNaN(gross) || gross < 0 || fedTax < 0 || stateTax < 0 || deductions < 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const fedTaxPaid = gross * (fedTax / 100);
    const stateTaxPaid = gross * (stateTax / 100);
    const totalTaxPaid = fedTaxPaid + stateTaxPaid;
    const totalDeductions = deductions * 12;

    const netAnnual = gross - totalTaxPaid - totalDeductions;
    const netMonthly = netAnnual / 12;
    const netWeekly = netAnnual / 52;

    document.getElementById('salary-net-annual').textContent = '$' + netAnnual.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    document.getElementById('salary-net-monthly').textContent = '$' + netMonthly.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    document.getElementById('salary-net-weekly').textContent = '$' + netWeekly.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    document.getElementById('salary-tax-total').textContent = '$' + totalTaxPaid.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ` (${(fedTax + stateTax).toFixed(1)}%)`;
    document.getElementById('salary-deductions-total').textContent = '$' + totalDeductions.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    resultDiv.style.display = '';
  }

  grossInput.addEventListener('input', calculate);
  fedTaxInput.addEventListener('input', calculate);
  stateTaxInput.addEventListener('input', calculate);
  deductionsInput.addEventListener('input', calculate);

  return function cleanup() {
    grossInput.removeEventListener('input', calculate);
    fedTaxInput.removeEventListener('input', calculate);
    stateTaxInput.removeEventListener('input', calculate);
    deductionsInput.removeEventListener('input', calculate);
  };
}
