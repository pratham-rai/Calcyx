export const meta = {
  slug: 'age',
  name: 'Age Calculator',
  title: 'Age Calculator - Calcyx',
  description: 'Calculate your exact age in years, months, and days. See your next birthday countdown and total days lived.',
  category: 'datetime',
  icon: '🎂',
  keywords: ['age', 'birthday', 'date of birth', 'how old', 'years old', 'days lived'],
  formula: 'Age = Current Date − Date of Birth',
  relatedSlugs: ['days-between', 'countdown']
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
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" class="calc-input" max="${today}">
          </div>
          <div class="calc-input-group">
            <label for="calc-to">Calculate To</label>
            <input type="date" id="calc-to" class="calc-input" value="${today}">
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="age-display"></div>
          <div class="calc-result-label">Your Age</div>
          <div class="calc-result-grid" id="details-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Age = Target Date − Date of Birth</code>
        <p>Your exact age is calculated by finding the difference in years, months, and days between your date of birth and the target date. The next birthday countdown shows how many days remain until your next birthday.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const dobInput = document.getElementById('dob');
  const calcToInput = document.getElementById('calc-to');
  const resultDiv = document.getElementById('result');
  const ageDisplay = document.getElementById('age-display');
  const detailsGrid = document.getElementById('details-grid');

  function calculate() {
    const dobVal = dobInput.value;
    const toVal = calcToInput.value;

    if (!dobVal || !toVal) {
      resultDiv.style.display = 'none';
      return;
    }

    const dob = new Date(dobVal + 'T00:00:00');
    const to = new Date(toVal + 'T00:00:00');

    if (isNaN(dob.getTime()) || isNaN(to.getTime()) || dob > to) {
      resultDiv.style.display = 'none';
      return;
    }

    // Calculate years, months, days
    let years = to.getFullYear() - dob.getFullYear();
    let months = to.getMonth() - dob.getMonth();
    let days = to.getDate() - dob.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Total days
    const diffMs = to.getTime() - dob.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Next birthday
    let nextBirthday = new Date(to.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday <= to) {
      nextBirthday = new Date(to.getFullYear() + 1, dob.getMonth(), dob.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - to.getTime()) / (1000 * 60 * 60 * 24));

    ageDisplay.textContent = `${years} years, ${months} months, ${days} days`;

    detailsGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">${totalDays.toLocaleString()}</div>
        <div class="calc-result-label">Total Days</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${totalWeeks.toLocaleString()}</div>
        <div class="calc-result-label">Total Weeks</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${totalMonths.toLocaleString()}</div>
        <div class="calc-result-label">Total Months</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${daysUntilBirthday}</div>
        <div class="calc-result-label">Days Until Next Birthday 🎉</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${(totalDays * 24).toLocaleString()}</div>
        <div class="calc-result-label">Total Hours Lived</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${(totalDays * 24 * 60).toLocaleString()}</div>
        <div class="calc-result-label">Total Minutes Lived</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  dobInput.addEventListener('input', calculate);
  calcToInput.addEventListener('input', calculate);

  return () => {
    dobInput.removeEventListener('input', calculate);
    calcToInput.removeEventListener('input', calculate);
  };
}
