export const meta = {
  slug: 'year-progress',
  name: 'Year Progress',
  title: 'Year Progress Calculator - Calcyx',
  description: 'Visualize the progress of the current year in real-time, including elapsed and remaining days, weeks, and month-by-month breakdown.',
  category: 'datetime',
  icon: '⏳',
  keywords: ['year progress', 'time left', 'percentage of year', 'days remaining', 'countdown', 'leap year progress'],
  formula: 'Year Progress (%) = (Current Timestamp − Start of Year) / Total Milliseconds in Year * 100',
  relatedSlugs: ['leap-year', 'countdown']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const currentYear = new Date().getFullYear();

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="year">Select Year</label>
          <input type="number" id="year" class="calc-input" value="${currentYear}" placeholder="e.g. ${currentYear}" min="1" max="9999" step="1">
        </div>

        <div id="result" class="calc-result" style="margin-top: 20px;">
          <!-- Realtime percentage display -->
          <div class="calc-result-value" id="progress-percent" style="font-size: 2.5rem; font-family: monospace; letter-spacing: -1px; color: #60a5fa;">
            0.000000%
          </div>
          <div class="calc-result-label" id="progress-label">Year Progress</div>

          <!-- Custom styled progress bar -->
          <div style="width: 100%; height: 20px; background: rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); margin: 15px 0;">
            <div id="progress-bar-fill" style="height: 100%; width: 0%; background: linear-gradient(90deg, #3b82f6, #10b981); transition: width 0.1s linear;"></div>
          </div>

          <div class="calc-result-grid" style="margin-top: 20px;">
            <div class="calc-result-item">
              <div class="calc-result-value" id="days-elapsed">0</div>
              <div class="calc-result-label">Days Elapsed</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="days-remaining">0</div>
              <div class="calc-result-label">Days Remaining</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="weeks-remaining">0</div>
              <div class="calc-result-label">Weeks Remaining</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="total-days">365</div>
              <div class="calc-result-label">Total Days in Year</div>
            </div>
          </div>

          <div style="margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
            <h4 style="margin: 0 0 12px 0; font-size: 0.95rem; font-weight: 600; color: #a0aec0;">Month-by-Month Days Count</h4>
            <div id="months-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How Year Progress is Computed</h3>
        <p>The year progress calculates the exact ratio between the elapsed duration of the year and the total duration of that year:</p>
        <code>Progress (%) = (Current Timestamp − Start of Year) / Total Milliseconds in Year * 100</code>
        <p>For past years, it displays 100% progressed, and for future years, 0% progressed. For the current year, it ticks in real-time, showing the passing milliseconds.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const yearInput = document.getElementById('year');
  const progressPercent = document.getElementById('progress-percent');
  const progressLabel = document.getElementById('progress-label');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const daysElapsed = document.getElementById('days-elapsed');
  const daysRemaining = document.getElementById('days-remaining');
  const weeksRemaining = document.getElementById('weeks-remaining');
  const totalDays = document.getElementById('total-days');
  const monthsGrid = document.getElementById('months-grid');

  function isLeapYear(y) {
    return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  }

  function getMonthData(y) {
    const leap = isLeapYear(y);
    return [
      { name: 'January', days: 31 },
      { name: 'February', days: leap ? 29 : 28 },
      { name: 'March', days: 31 },
      { name: 'April', days: 30 },
      { name: 'May', days: 31 },
      { name: 'June', days: 30 },
      { name: 'July', days: 31 },
      { name: 'August', days: 31 },
      { name: 'September', days: 30 },
      { name: 'October', days: 31 },
      { name: 'November', days: 30 },
      { name: 'December', days: 31 }
    ];
  }

  function calculate() {
    const now = new Date();
    const yVal = parseInt(yearInput.value, 10) || now.getFullYear();

    const isLeap = isLeapYear(yVal);
    const yrTotalDays = isLeap ? 366 : 365;
    totalDays.textContent = yrTotalDays;

    let percent = 0;
    let elapsed = 0;
    let remaining = yrTotalDays;
    let label = 'Year Progress';

    if (yVal < now.getFullYear()) {
      percent = 100;
      elapsed = yrTotalDays;
      remaining = 0;
      label = `Year ${yVal} Completed (Past)`;
      progressPercent.textContent = '100.000000%';
      progressBarFill.style.width = '100%';
    } else if (yVal > now.getFullYear()) {
      percent = 0;
      elapsed = 0;
      remaining = yrTotalDays;
      label = `Year ${yVal} Progress (Future)`;
      progressPercent.textContent = '0.000000%';
      progressBarFill.style.width = '0%';
    } else {
      // Current year
      const start = new Date(yVal, 0, 1);
      const end = new Date(yVal + 1, 0, 1);
      const totalMs = end.getTime() - start.getTime();
      const elapsedMs = now.getTime() - start.getTime();

      percent = (elapsedMs / totalMs) * 100;
      elapsed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
      remaining = yrTotalDays - elapsed;
      label = `Year ${yVal} Progress (Current)`;

      progressPercent.textContent = percent.toFixed(6) + '%';
      progressBarFill.style.width = percent.toFixed(4) + '%';
    }

    progressLabel.textContent = label;
    daysElapsed.textContent = elapsed.toLocaleString();
    daysRemaining.textContent = remaining.toLocaleString();
    weeksRemaining.textContent = (remaining / 7).toFixed(1);

    // Populate month-by-month days count
    const months = getMonthData(yVal);
    monthsGrid.innerHTML = months.map(m => `
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 8px; border-radius: 6px; text-align: center;">
        <div style="font-size: 0.8rem; color: #a0aec0; font-weight: 500;">${m.name}</div>
        <div style="font-size: 1.1rem; font-weight: bold; color: #fff; margin-top: 4px;">${m.days} days</div>
      </div>
    `).join('');
  }

  // Set interval to update in real-time
  const intervalId = setInterval(() => {
    const now = new Date();
    const yVal = parseInt(yearInput.value, 10) || now.getFullYear();
    if (yVal === now.getFullYear()) {
      calculate();
    }
  }, 1000);

  yearInput.addEventListener('input', calculate);

  calculate();

  return () => {
    clearInterval(intervalId);
    yearInput.removeEventListener('input', calculate);
  };
}
