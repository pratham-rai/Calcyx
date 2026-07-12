export const meta = {
  slug: 'week-number',
  name: 'Week Number Calculator',
  title: 'ISO Week Number Calculator - Calcyx',
  description: 'Calculate the ISO 8601 week number, weekday name, and start/end dates of the week for any given date.',
  category: 'datetime',
  icon: '📅',
  keywords: ['week number', 'iso week', 'iso 8601', 'calendar week', 'weekday', 'week range'],
  formula: 'ISO Week starting on Monday, first week contains January 4th',
  relatedSlugs: ['day-of-year', 'days-between']
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
            <label for="week-date">Select Date</label>
            <input type="date" id="week-date" class="calc-input" value="${today}">
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="week-display"></div>
          <div class="calc-result-label" id="weekday-label"></div>
          <div class="calc-result-grid" id="details-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>ISO 8601 Standard</code>
        <p>Under the ISO 8601 standard, week 1 of a calendar year is the week that contains the first Thursday of that year (equivalent to containing January 4th). Weeks begin on Monday and end on Sunday. A year has either 52 or 53 weeks.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const dateInput = document.getElementById('week-date');
  const resultDiv = document.getElementById('result');
  const weekDisplay = document.getElementById('week-display');
  const weekdayLabel = document.getElementById('weekday-label');
  const detailsGrid = document.getElementById('details-grid');

  function getISOWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return { week: weekNo, year: d.getUTCFullYear() };
  }

  function calculate() {
    const dateVal = dateInput.value;
    if (!dateVal) {
      resultDiv.style.display = 'none';
      return;
    }

    const date = new Date(dateVal + 'T12:00:00');
    if (isNaN(date.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    const { week, year } = getISOWeek(date);
    const weekdayName = date.toLocaleDateString(undefined, { weekday: 'long' });

    // Monday to Sunday Range
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedRange = `${monday.toLocaleDateString(undefined, formatDateOptions)} – ${sunday.toLocaleDateString(undefined, formatDateOptions)}`;

    // Day of year
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diffMs = date - startOfYear;
    const dayOfYear = Math.floor(diffMs / 86400000) + 1;

    // Leap year
    const isLeap = (date.getFullYear() % 4 === 0 && date.getFullYear() % 100 !== 0) || (date.getFullYear() % 400 === 0);
    const totalDays = isLeap ? 366 : 365;

    weekDisplay.textContent = `Week ${week}`;
    weekdayLabel.textContent = `${weekdayName}, ISO Year ${year}`;

    detailsGrid.innerHTML = `
      <div class="calc-result-item" style="grid-column: span 2;">
        <div class="calc-result-value" style="font-size: 1.1rem; line-height: 1.4;">${formattedRange}</div>
        <div class="calc-result-label">Week Date Range (Mon – Sun)</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${dayOfYear} / ${totalDays}</div>
        <div class="calc-result-label">Day of Year</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${isLeap ? 'Yes' : 'No'}</div>
        <div class="calc-result-label">Leap Year</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  dateInput.addEventListener('input', calculate);

  // Initial calculation
  calculate();

  return () => {
    dateInput.removeEventListener('input', calculate);
  };
}
