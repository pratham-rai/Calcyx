export const meta = {
  slug: 'days-between',
  name: 'Days Between Dates',
  title: 'Days Between Dates Calculator - Calcyx',
  description: 'Calculate the exact number of days, weeks, months, and business days between any two dates.',
  category: 'datetime',
  icon: '📅',
  keywords: ['days between', 'date difference', 'business days', 'weekdays', 'duration', 'date range'],
  formula: 'Days = End Date − Start Date',
  relatedSlugs: ['age', 'countdown']
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
            <label for="start-date">Start Date</label>
            <input type="date" id="start-date" class="calc-input" value="${today}">
          </div>
          <div class="calc-input-group">
            <label for="end-date">End Date</label>
            <input type="date" id="end-date" class="calc-input" value="${today}">
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="main-days"></div>
          <div class="calc-result-label">Total Days</div>
          <div class="calc-result-grid" id="details-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Days = |End Date − Start Date|</code>
        <p>Calendar days are calculated from the absolute difference between two dates. Business days exclude Saturdays and Sundays. Weeks, months, and years are derived from the calendar difference.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const startInput = document.getElementById('start-date');
  const endInput = document.getElementById('end-date');
  const resultDiv = document.getElementById('result');
  const mainDays = document.getElementById('main-days');
  const detailsGrid = document.getElementById('details-grid');

  function countBusinessDays(start, end) {
    let count = 0;
    const d = new Date(start);
    const direction = end >= start ? 1 : -1;
    const absStart = direction === 1 ? new Date(start) : new Date(end);
    const absEnd = direction === 1 ? new Date(end) : new Date(start);
    const cursor = new Date(absStart);

    while (cursor < absEnd) {
      cursor.setDate(cursor.getDate() + 1);
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) count++;
    }
    return count;
  }

  function calculate() {
    const startVal = startInput.value;
    const endVal = endInput.value;

    if (!startVal || !endVal) {
      resultDiv.style.display = 'none';
      return;
    }

    const start = new Date(startVal + 'T00:00:00');
    const end = new Date(endVal + 'T00:00:00');

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    const diffMs = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Calculate months and years
    const earlier = start <= end ? start : end;
    const later = start <= end ? end : start;

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

    const totalMonths = years * 12 + months;
    const businessDays = countBusinessDays(earlier, later);
    const weekendDays = totalDays - businessDays;

    mainDays.textContent = totalDays.toLocaleString() + ' days';

    detailsGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">${totalWeeks} wk ${remainingDays} d</div>
        <div class="calc-result-label">Weeks & Days</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${years}y ${months}m ${days}d</div>
        <div class="calc-result-label">Years, Months, Days</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${totalMonths.toLocaleString()}</div>
        <div class="calc-result-label">Total Months</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${businessDays.toLocaleString()}</div>
        <div class="calc-result-label">Business Days</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${weekendDays.toLocaleString()}</div>
        <div class="calc-result-label">Weekend Days</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${(totalDays * 24).toLocaleString()}</div>
        <div class="calc-result-label">Total Hours</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  startInput.addEventListener('input', calculate);
  endInput.addEventListener('input', calculate);

  // Initial calculation
  calculate();

  return () => {
    startInput.removeEventListener('input', calculate);
    endInput.removeEventListener('input', calculate);
  };
}
