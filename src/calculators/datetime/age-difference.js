export const meta = {
  slug: 'age-difference',
  name: 'Chronological Age Diff',
  title: 'Age Difference Calculator - Calcyx',
  description: 'Calculate the exact age difference between two people or dates in years, months, and days, and find who is older.',
  category: 'datetime',
  icon: '👥',
  keywords: ['age difference', 'chronological age', 'who is older', 'age comparison', 'date comparison'],
  formula: 'Difference = |Birthdate 1 − Birthdate 2|',
  relatedSlugs: ['age', 'days-between']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  
  const today = new Date().toISOString().split('T')[0];
  
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
            <label for="dob1">Birthdate of Person 1</label>
            <input type="date" id="dob1" class="calc-input" max="${today}" value="${today}">
          </div>
          <div class="calc-input-group">
            <label for="dob2">Birthdate of Person 2</label>
            <input type="date" id="dob2" class="calc-input" max="${today}" value="${today}">
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="age-diff-display"></div>
          <div class="calc-result-label" id="older-label"></div>
          <div class="calc-result-grid" id="details-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Difference = |Birthdate 1 − Birthdate 2|</code>
        <p>The chronological age difference is calculated by finding the absolute difference in years, months, and days between the two birthdates. The person with the earlier birthdate is older.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const dob1Input = document.getElementById('dob1');
  const dob2Input = document.getElementById('dob2');
  const resultDiv = document.getElementById('result');
  const ageDiffDisplay = document.getElementById('age-diff-display');
  const olderLabel = document.getElementById('older-label');
  const detailsGrid = document.getElementById('details-grid');

  function calculate() {
    const dob1Val = dob1Input.value;
    const dob2Val = dob2Input.value;

    if (!dob1Val || !dob2Val) {
      resultDiv.style.display = 'none';
      return;
    }

    const d1 = new Date(dob1Val + 'T00:00:00');
    const d2 = new Date(dob2Val + 'T00:00:00');

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    let olderPerson = '';
    let earlier = d1;
    let later = d2;

    if (d1.getTime() < d2.getTime()) {
      olderPerson = 'Person 1 is older';
      earlier = d1;
      later = d2;
    } else if (d1.getTime() > d2.getTime()) {
      olderPerson = 'Person 2 is older';
      earlier = d2;
      later = d1;
    } else {
      olderPerson = 'Both are the exact same age';
      earlier = d1;
      later = d2;
    }

    // Chronological difference
    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Total difference calculations
    const diffMs = later.getTime() - earlier.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    if (d1.getTime() === d2.getTime()) {
      ageDiffDisplay.textContent = '0 years, 0 months, 0 days';
    } else {
      ageDiffDisplay.textContent = `${years} years, ${months} months, ${days} days`;
    }
    olderLabel.textContent = olderPerson;

    detailsGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">${totalDays.toLocaleString()}</div>
        <div class="calc-result-label">Difference in Days</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${totalWeeks.toLocaleString()}</div>
        <div class="calc-result-label">Difference in Weeks</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${totalMonths.toLocaleString()}</div>
        <div class="calc-result-label">Difference in Months</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${(totalDays * 24).toLocaleString()}</div>
        <div class="calc-result-label">Difference in Hours</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  dob1Input.addEventListener('input', calculate);
  dob2Input.addEventListener('input', calculate);

  // Initial calculation
  calculate();

  return () => {
    dob1Input.removeEventListener('input', calculate);
    dob2Input.removeEventListener('input', calculate);
  };
}
