export const meta = {
  slug: 'tip',
  name: 'Tip / Bill Split Calculator',
  title: 'Tip / Bill Split Calculator - Calcyx',
  description: 'Calculate tip amount, split the bill between friends, and see each person\'s share instantly.',
  category: 'finance',
  icon: '🍽️',
  keywords: ['tip', 'bill split', 'gratuity', 'restaurant', 'split', 'per person'],
  formula: 'Tip = Bill \\times \\frac{Tip\\%}{100}',
  relatedSlugs: ['discount', 'percentage']
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
        <div class="calc-input-group">
          <label for="tip-bill">Bill Amount ($)</label>
          <input type="number" id="tip-bill" class="calc-input" placeholder="e.g. 85.50" min="0" step="0.01">
        </div>

        <div class="calc-input-group">
          <label>Quick Tip %</label>
          <div class="calc-row" id="tip-presets" style="gap:8px;flex-wrap:wrap">
            <button type="button" class="calc-select" data-tip="10" style="flex:1;min-width:50px;cursor:pointer;text-align:center">10%</button>
            <button type="button" class="calc-select" data-tip="15" style="flex:1;min-width:50px;cursor:pointer;text-align:center">15%</button>
            <button type="button" class="calc-select" data-tip="18" style="flex:1;min-width:50px;cursor:pointer;text-align:center">18%</button>
            <button type="button" class="calc-select" data-tip="20" style="flex:1;min-width:50px;cursor:pointer;text-align:center">20%</button>
            <button type="button" class="calc-select" data-tip="25" style="flex:1;min-width:50px;cursor:pointer;text-align:center">25%</button>
          </div>
        </div>

        <div class="calc-input-group">
          <label for="tip-pct">Custom Tip (%)</label>
          <input type="number" id="tip-pct" class="calc-input" placeholder="e.g. 18" min="0" max="100" step="0.5">
        </div>

        <div class="calc-input-group">
          <label for="tip-people">Number of People</label>
          <input type="number" id="tip-people" class="calc-input" placeholder="e.g. 4" min="1" step="1" value="1">
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <span class="calc-result-label">Tip Amount</span>
            <span class="calc-result-value" id="tip-amount"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Bill</span>
            <span class="calc-result-value" id="tip-total"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Per Person</span>
            <span class="calc-result-value" id="tip-per-person"></span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Formula</h3>
        <code>Tip = Bill × (Tip% / 100)</code>
        <p><strong>Total</strong> = Bill + Tip. <strong>Per Person</strong> = Total ÷ Number of People.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const billInput = document.getElementById('tip-bill');
  const pctInput = document.getElementById('tip-pct');
  const peopleInput = document.getElementById('tip-people');
  const presetsContainer = document.getElementById('tip-presets');

  function calculate() {
    const bill = parseFloat(billInput.value);
    const tipPct = parseFloat(pctInput.value);
    const people = parseInt(peopleInput.value, 10) || 1;

    const resultDiv = document.getElementById('result');

    if (isNaN(bill) || isNaN(tipPct) || bill <= 0 || tipPct < 0 || people < 1) {
      resultDiv.style.display = 'none';
      return;
    }

    const tipAmount = bill * tipPct / 100;
    const totalBill = bill + tipAmount;
    const perPerson = totalBill / people;

    document.getElementById('tip-amount').textContent = '$' + tipAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('tip-total').textContent = '$' + totalBill.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('tip-per-person').textContent = '$' + perPerson.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resultDiv.style.display = '';
  }

  function handlePreset(e) {
    const btn = e.target.closest('[data-tip]');
    if (!btn) return;
    pctInput.value = btn.dataset.tip;
    // Highlight active preset
    presetsContainer.querySelectorAll('[data-tip]').forEach(b => b.style.outline = '');
    btn.style.outline = '2px solid var(--accent, #6c63ff)';
    calculate();
  }

  billInput.addEventListener('input', calculate);
  pctInput.addEventListener('input', calculate);
  peopleInput.addEventListener('input', calculate);
  presetsContainer.addEventListener('click', handlePreset);

  return function cleanup() {
    billInput.removeEventListener('input', calculate);
    pctInput.removeEventListener('input', calculate);
    peopleInput.removeEventListener('input', calculate);
    presetsContainer.removeEventListener('click', handlePreset);
  };
}
