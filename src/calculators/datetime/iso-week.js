export const meta = {
  slug: 'iso-week',
  name: 'ISO Week Date Converter',
  title: 'ISO Week Date Converter - Calcyx',
  description: 'Convert standard Gregorian calendar dates to the ISO 8601 week date format (e.g. YYYY-Www-D) and vice-versa.',
  category: 'datetime',
  icon: '📅',
  keywords: ['iso week', 'iso 8601', 'week number', 'gregorian to iso', 'iso to gregorian'],
  formula: 'ISO Week Date format: YYYY-Www-D',
  relatedSlugs: ['days-between', 'work-days']
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
          <div class="calc-input-group" style="flex: 1; min-width: 200px;">
            <label for="greg-date">Standard Date (Gregorian)</label>
            <input type="date" id="greg-date" class="calc-input">
          </div>
        </div>
        
        <div style="text-align: center; margin: 15px 0; font-weight: bold; color: var(--text-muted); font-size: 0.9rem;">
          OR ENTER ISO WEEK DATE
        </div>
        
        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1; min-width: 100px;">
            <label for="iso-year">ISO Year</label>
            <input type="number" id="iso-year" class="calc-input" min="1" step="1" placeholder="Year">
          </div>
          <div class="calc-input-group" style="flex: 1; min-width: 80px;">
            <label for="iso-week-num">ISO Week</label>
            <input type="number" id="iso-week-num" class="calc-input" min="1" max="53" step="1" placeholder="Week">
          </div>
          <div class="calc-input-group" style="flex: 1.2; min-width: 140px;">
            <label for="iso-day-of-week">Day of Week</label>
            <select id="iso-day-of-week" class="calc-select">
              <option value="1">1 - Monday</option>
              <option value="2">2 - Tuesday</option>
              <option value="3">3 - Wednesday</option>
              <option value="4">4 - Thursday</option>
              <option value="5">5 - Friday</option>
              <option value="6">6 - Saturday</option>
              <option value="7">7 - Sunday</option>
            </select>
          </div>
        </div>
        
        <div id="result" class="calc-result" style="margin-top: 25px;">
          <div class="calc-result-grid">
            <div class="calc-result-item">
              <div class="calc-result-label">ISO Week Date Format</div>
              <div class="calc-result-value" id="iso-result-display" style="font-size: 1.8rem; color: #3B82F6;"></div>
              <div class="calc-result-detail" id="iso-result-detail"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Gregorian Calendar Date</div>
              <div class="calc-result-value" id="greg-result-display" style="font-size: 1.6rem; color: #10B981;"></div>
              <div class="calc-result-detail" id="greg-result-detail"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How ISO Week Date Works</h3>
        <p>The ISO 8601 week-numbering year system is a leap week calendar system that is part of the ISO 8601 date and time standard:</p>
        <ul>
          <li><strong>ISO Year:</strong> Can start slightly before or after the Gregorian year.</li>
          <li><strong>ISO Week:</strong> The week number (01 to 53). Week 01 is the week containing the first Thursday of the calendar year.</li>
          <li><strong>ISO Day:</strong> Numbered from 1 (Monday) to 7 (Sunday).</li>
        </ul>
        <p>Example: <strong>2026-W28-7</strong> represents the 7th day (Sunday) of the 28th week of the ISO year 2026, which is July 12, 2026.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const gregDateInput = document.getElementById('greg-date');
  const isoYearInput = document.getElementById('iso-year');
  const isoWeekInput = document.getElementById('iso-week-num');
  const isoDaySelect = document.getElementById('iso-day-of-week');

  const isoResultDisplay = document.getElementById('iso-result-display');
  const isoResultDetail = document.getElementById('iso-result-detail');
  const gregResultDisplay = document.getElementById('greg-result-display');
  const gregResultDetail = document.getElementById('greg-result-detail');

  // Helper functions
  function getISOWeekDate(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayNum = d.getDay() || 7; // Sunday is 7, Monday is 1
    d.setDate(d.getDate() + 4 - dayNum);
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const diffDays = Math.round((d - yearStart) / 86400000);
    const weekNo = Math.ceil((diffDays + 1) / 7);
    return {
      year: d.getFullYear(),
      week: weekNo,
      day: dayNum
    };
  }

  function getDateFromISOWeek(year, week, day) {
    const simple = new Date(year, 0, 4);
    const dayOfWeek = simple.getDay() || 7;
    const ISOWeek1Monday = new Date(year, 0, 4 - dayOfWeek + 1);
    const targetDate = new Date(ISOWeek1Monday);
    targetDate.setDate(targetDate.getDate() + (week - 1) * 7 + (day - 1));
    return targetDate;
  }

  function parseLocalDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    return new Date(year, month, day);
  }

  function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getWeeksInISOYear(year) {
    const d1 = new Date(year, 0, 1).getDay();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (d1 === 4 || (isLeap && d1 === 3)) {
      return 53;
    }
    return 52;
  }

  // Update display based on a Gregorian Date
  function updateFromGregorian() {
    const dateStr = gregDateInput.value;
    if (!dateStr) return;

    const date = parseLocalDate(dateStr);
    if (!date || isNaN(date.getTime())) return;

    const iso = getISOWeekDate(date);
    
    // Update ISO inputs programmatically (does not trigger input events)
    isoYearInput.value = iso.year;
    isoWeekInput.value = iso.week;
    isoDaySelect.value = iso.day;

    displayResults(date, iso);
  }

  // Update display based on ISO Inputs
  function updateFromISO() {
    const year = parseInt(isoYearInput.value, 10);
    let week = parseInt(isoWeekInput.value, 10);
    const day = parseInt(isoDaySelect.value, 10);

    if (isNaN(year) || year < 1) return;
    
    const maxWeeks = getWeeksInISOYear(year);
    if (isNaN(week) || week < 1) {
      week = 1;
    } else if (week > maxWeeks) {
      week = maxWeeks;
      isoWeekInput.value = maxWeeks;
    }

    const date = getDateFromISOWeek(year, week, day);
    if (!date || isNaN(date.getTime())) return;

    // Update standard date input programmatically
    gregDateInput.value = formatLocalDate(date);

    const iso = { year, week, day };
    displayResults(date, iso);
  }

  function displayResults(date, iso) {
    const paddedWeek = String(iso.week).padStart(2, '0');
    const isoString = `${iso.year}-W${paddedWeek}-${iso.day}`;
    
    isoResultDisplay.textContent = isoString;
    const maxWeeks = getWeeksInISOYear(iso.year);
    isoResultDetail.textContent = `Week ${iso.week} of ${maxWeeks} weeks in the ISO Year ${iso.year}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    gregResultDisplay.textContent = date.toLocaleDateString(undefined, options);
    gregResultDetail.textContent = `Gregorian Date: ${formatLocalDate(date)}`;
  }

  // Initialize with today's date
  const defaultDate = new Date(2026, 6, 12); // July 12, 2026
  gregDateInput.value = formatLocalDate(defaultDate);
  updateFromGregorian();

  // Attach event listeners
  gregDateInput.addEventListener('input', updateFromGregorian);
  isoYearInput.addEventListener('input', updateFromISO);
  isoWeekInput.addEventListener('input', updateFromISO);
  isoDaySelect.addEventListener('input', updateFromISO);

  return () => {
    gregDateInput.removeEventListener('input', updateFromGregorian);
    isoYearInput.removeEventListener('input', updateFromISO);
    isoWeekInput.removeEventListener('input', updateFromISO);
    isoDaySelect.removeEventListener('input', updateFromISO);
  };
}
