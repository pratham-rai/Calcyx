export const meta = {
  slug: 'day-of-year',
  name: 'Day of Year / Julian Date',
  title: 'Day of Year & Julian Date Calculator - Calcyx',
  description: 'Compute the ordinal day of the year, year progress percentage, remaining days, and astronomical Julian Date.',
  category: 'datetime',
  icon: '🌞',
  keywords: ['day of year', 'julian date', 'ordinal date', 'year progress', 'astronomical julian date', 'calendar day'],
  formula: 'Day of Year & Astronomical Julian Date Algorithms',
  relatedSlugs: ['leap-year', 'days-between']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const todayStr = new Date().toISOString().split('T')[0];

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="date-input">Select Date</label>
          <input type="date" id="date-input" class="calc-input" value="${todayStr}">
        </div>
        
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-grid" style="margin-bottom: 20px;">
            <div class="calc-result-item">
              <div class="calc-result-label">Day of the Year (Ordinal)</div>
              <div class="calc-result-value" id="day-of-year-display" style="font-size: 2rem;"></div>
              <div class="calc-result-detail" id="leap-indicator">Out of 365 days</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Year Progress</div>
              <div class="calc-result-value" id="progress-display" style="font-size: 2rem;"></div>
              <div class="calc-result-detail" id="days-remaining"></div>
            </div>
          </div>

          <div class="calc-result-grid">
            <div class="calc-result-item">
              <div class="calc-result-label">Julian Date (JD at Noon UTC)</div>
              <div class="calc-result-value" id="julian-date-display" style="font-size: 1.3rem; margin: 8px 0;"></div>
              <div class="calc-result-detail">Continuous days since 4713 BC</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Modified Julian Date (MJD)</div>
              <div class="calc-result-value" id="mjd-display" style="font-size: 1.3rem; margin: 8px 0;"></div>
              <div class="calc-result-detail">JD − 2400000.5</div>
            </div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <p><strong>Day of the Year:</strong> Calculated as the total number of days elapsed since January 1st of the same year. Leap years have 366 days, while common years have 365.</p>
        <p><strong>Julian Date (JD):</strong> A continuous count of days used by astronomers to avoid calendar confusion. The Julian epoch starts on January 1, 4713 BC at noon (12:00 UTC). We calculate JD using the standard Meeus astronomical algorithm:</p>
        <code>JD = 367Y − ⌊7(Y + ⌊(M + 9)/12⌋)/4⌋ + ⌊275M/9⌋ + D + 1721013.5</code>
        <p><strong>Modified Julian Date (MJD):</strong> A simplified system that starts on November 17, 1858 (midnight), making the numbers smaller and easier to work with.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const dateInput = document.getElementById('date-input');
  const resultDiv = document.getElementById('result');
  const dayOfYearDisplay = document.getElementById('day-of-year-display');
  const leapIndicator = document.getElementById('leap-indicator');
  const progressDisplay = document.getElementById('progress-display');
  const daysRemaining = document.getElementById('days-remaining');
  const julianDateDisplay = document.getElementById('julian-date-display');
  const mjdDisplay = document.getElementById('mjd-display');

  function isLeapYear(y) {
    return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  }

  function getJulianDate(year, month, day) {
    let Y = year;
    let M = month;
    let D = day + 0.5; // Compute for 12:00 Noon UTC
    
    if (M <= 2) {
      Y = Y - 1;
      M = M + 12;
    }

    const A = Math.floor(Y / 100);
    const B = Math.floor(A / 4);
    const C = 2 - A + B;
    const E = Math.floor(365.25 * (Y + 4716));
    const F = Math.floor(30.6001 * (M + 1));

    return C + D + E + F - 1524.5;
  }

  function calculate() {
    const val = dateInput.value;
    if (!val) {
      resultDiv.style.display = 'none';
      return;
    }

    // Parse safely to avoid timezone shifts
    const parts = val.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month - 1, day);
    const startOfYear = new Date(year, 0, 1);
    
    const diffMs = date.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1;
    
    const totalDays = isLeapYear(year) ? 366 : 365;
    const progress = (dayOfYear / totalDays) * 100;
    const remaining = totalDays - dayOfYear;

    dayOfYearDisplay.textContent = dayOfYear.toLocaleString();
    leapIndicator.textContent = `Day ${dayOfYear} out of ${totalDays} days (${isLeapYear(year) ? 'Leap Year' : 'Common Year'})`;
    
    progressDisplay.textContent = progress.toFixed(2) + '%';
    daysRemaining.textContent = `${remaining} ${remaining === 1 ? 'day' : 'days'} remaining in ${year}`;

    // Julian Date calculation
    const jd = getJulianDate(year, month, day);
    const mjd = jd - 2400000.5;

    julianDateDisplay.textContent = jd.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 5 });
    mjdDisplay.textContent = mjd.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 5 });

    resultDiv.style.display = '';
  }

  dateInput.addEventListener('input', calculate);

  // Initial calculation
  calculate();

  return () => {
    dateInput.removeEventListener('input', calculate);
  };
}
