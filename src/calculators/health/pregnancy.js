export const meta = {
  slug: 'pregnancy',
  name: 'Pregnancy Due Date',
  title: 'Pregnancy Due Date Calculator - Calcyx',
  description: 'Calculate your estimated pregnancy due date (EDD), current gestational age, trimester progress, and days remaining.',
  category: 'health',
  icon: '👶',
  keywords: ['pregnancy due date', 'edd', 'due date calculator', 'gestational age', 'baby due date', 'pregnancy calendar'],
  formula: 'EDD = LMP + 280 days + (Cycle Length - 28) or Conception Date + 266 days',
  relatedSlugs: ['ovulation', 'bmi']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

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
            <label for="preg-mode">Calculate Based On</label>
            <select id="preg-mode" class="calc-select">
              <option value="lmp">Last Menstrual Period (LMP)</option>
              <option value="conception">Conception Date</option>
            </select>
          </div>
          <div class="calc-input-group">
            <label for="preg-date" id="preg-date-label">Last Period Date</label>
            <input type="date" id="preg-date" class="calc-input" value="${today}">
          </div>
        </div>
        <div id="preg-cycle-container" class="calc-input-group">
          <label for="preg-cycle">Average Cycle Length (days)</label>
          <input type="number" id="preg-cycle" class="calc-input" value="28" min="20" max="45" step="1">
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="preg-edd"></div>
        <div class="calc-result-label">Estimated Due Date</div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Gestational Age</div>
            <div class="calc-result-detail" id="preg-age"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Current Trimester</div>
            <div class="calc-result-detail" id="preg-trimester"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Days Remaining</div>
            <div class="calc-result-detail" id="preg-days-left"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Pregnancy Progress</div>
            <div class="calc-result-detail" id="preg-progress"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📐 How It's Calculated</h3>
        <code>Based on LMP: Due Date = LMP + 280 days + (Cycle Length - 28)</code>
        <code>Based on Conception: Due Date = Conception + 266 days</code>
        <p>A normal pregnancy lasts about 40 weeks (280 days) from the first day of your last menstrual period (LMP), assuming a standard 28-day cycle. Conception usually happens about 14 days after the LMP.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const modeSelect = document.getElementById('preg-mode');
  const dateInput = document.getElementById('preg-date');
  const dateLabel = document.getElementById('preg-date-label');
  const cycleInput = document.getElementById('preg-cycle');
  const cycleContainer = document.getElementById('preg-cycle-container');
  const resultDiv = document.getElementById('result');

  function toggleMode() {
    const isLMP = modeSelect.value === 'lmp';
    dateLabel.textContent = isLMP ? 'Last Period Date' : 'Conception Date';
    cycleContainer.style.display = isLMP ? '' : 'none';
    calculate();
  }

  function calculate() {
    const mode = modeSelect.value;
    const dateVal = dateInput.value;

    if (!dateVal) {
      resultDiv.style.display = 'none';
      return;
    }

    const inputDate = new Date(dateVal + 'T00:00:00');
    if (isNaN(inputDate.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    let edd, gestationalDays;

    if (mode === 'lmp') {
      const cycleLength = parseInt(cycleInput.value) || 28;
      const cycleDiff = cycleLength - 28;
      
      // EDD = LMP + 280 days + cycleDiff days
      edd = new Date(inputDate.getTime());
      edd.setDate(edd.getDate() + 280 + cycleDiff);

      // Adjusted LMP = LMP + cycleDiff
      const adjustedLMP = new Date(inputDate.getTime());
      adjustedLMP.setDate(adjustedLMP.getDate() + cycleDiff);

      const diffMs = todayDate.getTime() - adjustedLMP.getTime();
      gestationalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    } else {
      // Conception mode
      edd = new Date(inputDate.getTime());
      edd.setDate(edd.getDate() + 266);

      const diffMs = todayDate.getTime() - inputDate.getTime();
      // Gestational age = embryonic age (days since conception) + 14 days
      gestationalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 14;
    }

    // Format EDD
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('preg-edd').textContent = edd.toLocaleDateString(undefined, options);

    // Gestational age formatting
    if (gestationalDays < 0) {
      document.getElementById('preg-age').textContent = '0 weeks, 0 days (Not started)';
      document.getElementById('preg-trimester').textContent = 'Not started';
      document.getElementById('preg-progress').textContent = '0%';
    } else {
      const weeks = Math.floor(gestationalDays / 7);
      const days = gestationalDays % 7;
      document.getElementById('preg-age').textContent = `${weeks} week${weeks === 1 ? '' : 's'}, ${days} day${days === 1 ? '' : 's'}`;

      // Trimester
      if (gestationalDays < 14 * 7) {
        document.getElementById('preg-trimester').textContent = `1st Trimester (Week ${weeks + 1})`;
      } else if (gestationalDays < 28 * 7) {
        document.getElementById('preg-trimester').textContent = `2nd Trimester (Week ${weeks + 1})`;
      } else {
        document.getElementById('preg-trimester').textContent = `3rd Trimester (Week ${weeks + 1})`;
      }

      // Progress
      const progressPercent = Math.min(100, Math.max(0, Math.round((gestationalDays / 280) * 100)));
      document.getElementById('preg-progress').textContent = `${progressPercent}%`;
    }

    // Days left calculation
    const timeDiff = edd.getTime() - todayDate.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      document.getElementById('preg-days-left').textContent = `Past due by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'}`;
    } else if (daysLeft === 0) {
      document.getElementById('preg-days-left').textContent = 'Today!';
    } else {
      document.getElementById('preg-days-left').textContent = `${daysLeft.toLocaleString()} day${daysLeft === 1 ? '' : 's'}`;
    }

    resultDiv.style.display = '';
  }

  const handlers = [
    [modeSelect, 'change', toggleMode],
    [dateInput, 'input', calculate],
    [cycleInput, 'input', calculate]
  ];

  handlers.forEach(([el, evt, fn]) => el.addEventListener(evt, fn));

  // Run initial calculation
  calculate();

  return () => {
    handlers.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  };
}
