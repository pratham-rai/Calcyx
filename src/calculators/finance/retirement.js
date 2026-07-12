export const meta = {
  slug: 'retirement',
  name: 'Retirement / 401k Planner',
  title: 'Retirement / 401k Planner - Calcyx',
  description: 'Calculate your retirement nest egg balance and project how much your savings will grow by your target age.',
  category: 'finance',
  icon: '👴',
  keywords: ['retirement', '401k', 'savings', 'pension', 'investment', 'nest egg', 'retirement planner'],
  formula: 'Nest\\ Egg = S(1+r)^n + PMT \\times \\frac{(1+r)^n - 1}{r}',
  relatedSlugs: ['compound-interest', 'sip']
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
            <label for="retire-current-age">Current Age</label>
            <input type="number" id="retire-current-age" class="calc-input" placeholder="e.g. 30" min="0" max="100" step="1">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="retire-target-age">Target Retirement Age</label>
            <input type="number" id="retire-target-age" class="calc-input" placeholder="e.g. 65" min="1" max="120" step="1">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="retire-savings">Current Savings ($)</label>
            <input type="number" id="retire-savings" class="calc-input" placeholder="e.g. 25000" min="0" step="100">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="retire-contribution">Monthly Contribution ($)</label>
            <input type="number" id="retire-contribution" class="calc-input" placeholder="e.g. 500" min="0" step="10">
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="retire-return">Expected Annual Return (%)</label>
            <input type="number" id="retire-return" class="calc-input" placeholder="e.g. 7" min="0" max="50" step="0.1">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none">
        <div class="calc-result-grid">
          <div class="calc-result-item" style="grid-column: span 2;">
            <span class="calc-result-label">Retirement Nest Egg</span>
            <span class="calc-result-value" id="retire-nest-egg"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Years to Retire</span>
            <span class="calc-result-value" id="retire-years" style="font-size: 1.5rem;"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Total Contributions</span>
            <span class="calc-result-value" id="retire-total-contributions" style="font-size: 1.5rem;"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Starting Balance</span>
            <span class="calc-result-detail" id="retire-starting"></span>
          </div>
          <div class="calc-result-item">
            <span class="calc-result-label">Interest Earned</span>
            <span class="calc-result-detail" id="retire-interest"></span>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Nest Egg Formula</h3>
        <code>Nest Egg = S &times; (1 + r)^n + PMT &times; [((1 + r)^n &minus; 1) / r]</code>
        <p>Where:</p>
        <ul style="padding-left: 20px; margin-top: 10px;">
          <li><strong>S</strong> = Current savings balance</li>
          <li><strong>PMT</strong> = Monthly savings contribution</li>
          <li><strong>r</strong> = Monthly expected return rate (annual return &divide; 12 &divide; 100)</li>
          <li><strong>n</strong> = Total contribution months (Years to retirement &times; 12)</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const currentAgeInput = document.getElementById('retire-current-age');
  const targetAgeInput = document.getElementById('retire-target-age');
  const savingsInput = document.getElementById('retire-savings');
  const contributionInput = document.getElementById('retire-contribution');
  const returnInput = document.getElementById('retire-return');

  const resultDiv = document.getElementById('result');

  function calculate() {
    const currentAge = parseInt(currentAgeInput.value, 10);
    const targetAge = parseInt(targetAgeInput.value, 10);
    const savings = parseFloat(savingsInput.value) || 0;
    const contribution = parseFloat(contributionInput.value) || 0;
    const annualReturn = parseFloat(returnInput.value) || 0;

    if (
      isNaN(currentAge) || isNaN(targetAge) || currentAge < 0 || targetAge <= currentAge ||
      savings < 0 || contribution < 0 || annualReturn < 0
    ) {
      resultDiv.style.display = 'none';
      return;
    }

    const years = targetAge - currentAge;
    const totalMonths = years * 12;
    const r = annualReturn / 12 / 100;

    let nestEgg = 0;
    let totalContributed = contribution * totalMonths;

    if (r === 0) {
      nestEgg = savings + totalContributed;
    } else {
      const compoundSavings = savings * Math.pow(1 + r, totalMonths);
      const compoundContributions = contribution * ((Math.pow(1 + r, totalMonths) - 1) / r);
      nestEgg = compoundSavings + compoundContributions;
    }

    const interestEarned = nestEgg - savings - totalContributed;

    document.getElementById('retire-nest-egg').textContent = '$' + nestEgg.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    document.getElementById('retire-years').textContent = years.toString() + ' yrs';
    document.getElementById('retire-total-contributions').textContent = '$' + totalContributed.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    document.getElementById('retire-starting').textContent = '$' + savings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    document.getElementById('retire-interest').textContent = '$' + interestEarned.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    resultDiv.style.display = '';
  }

  currentAgeInput.addEventListener('input', calculate);
  targetAgeInput.addEventListener('input', calculate);
  savingsInput.addEventListener('input', calculate);
  contributionInput.addEventListener('input', calculate);
  returnInput.addEventListener('input', calculate);

  return function cleanup() {
    currentAgeInput.removeEventListener('input', calculate);
    targetAgeInput.removeEventListener('input', calculate);
    savingsInput.removeEventListener('input', calculate);
    contributionInput.removeEventListener('input', calculate);
    returnInput.removeEventListener('input', calculate);
  };
}
