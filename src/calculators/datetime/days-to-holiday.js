export const meta = {
  slug: 'days-to-holiday',
  name: 'Days to Next Holiday',
  title: 'Days to Next Holiday Calculator - Calcyx',
  description: 'Count down the days, hours, minutes, and seconds remaining until major global holidays or your own custom events.',
  category: 'datetime',
  icon: '🎉',
  keywords: ['days to holiday', 'holiday countdown', 'christmas countdown', 'new year countdown', 'countdown', 'time until'],
  formula: 'Countdown = Target Date & Time - Current Date & Time',
  relatedSlugs: ['countdown', 'days-between']
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
          <label for="holiday-select">Choose a Holiday</label>
          <select id="holiday-select" class="calc-select">
            <option value="new-year">New Year's Day (Jan 1)</option>
            <option value="valentine">Valentine's Day (Feb 14)</option>
            <option value="st-patrick">St. Patrick's Day (Mar 17)</option>
            <option value="earth-day">Earth Day (Apr 22)</option>
            <option value="halloween">Halloween (Oct 31)</option>
            <option value="christmas">Christmas Day (Dec 25)</option>
            <option value="custom">-- Custom Holiday / Event --</option>
          </select>
        </div>

        <div id="custom-group" class="calc-row" style="display: none; gap: 15px; margin-bottom: 20px;">
          <div class="calc-input-group" style="flex: 1; margin-bottom: 0;">
            <label for="custom-name">Event Name</label>
            <input type="text" id="custom-name" class="calc-input" value="My Special Day" placeholder="e.g. Birthday">
          </div>
          <div class="calc-input-group" style="flex: 1; margin-bottom: 0;">
            <label for="custom-date">Event Date & Time</label>
            <input type="datetime-local" id="custom-date" class="calc-input">
          </div>
        </div>

        <div id="result" class="calc-result" style="display:none; text-align: center;">
          <h2 id="countdown-title" style="font-size: 1.25rem; font-weight: 600; margin-bottom: 20px; color: #a0aec0;">Time Until New Year's Day</h2>
          <div class="calc-result-grid">
            <div class="calc-result-item">
              <div class="calc-result-value" id="cd-days" style="font-size: 2.2rem;">0</div>
              <div class="calc-result-label">Days</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="cd-hours" style="font-size: 2.2rem;">0</div>
              <div class="calc-result-label">Hours</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="cd-minutes" style="font-size: 2.2rem;">0</div>
              <div class="calc-result-label">Minutes</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="cd-seconds" style="font-size: 2.2rem; color: #10B981;">0</div>
              <div class="calc-result-label">Seconds</div>
            </div>
          </div>
          <div class="calc-result-detail" id="total-days-detail" style="margin-top: 15px; font-weight: 500;"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <p>The time remaining is calculated by finding the difference in milliseconds between the target holiday's date/time and the current system date/time. This difference is then converted into standard days, hours, minutes, and seconds:</p>
        <code>Time Difference = Target Date − Current Date</code>
        <p>For global holidays, if the holiday has already occurred in the current year, the calculator automatically shifts to target the holiday in the next calendar year.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const holidaySelect = document.getElementById('holiday-select');
  const customGroup = document.getElementById('custom-group');
  const customNameInput = document.getElementById('custom-name');
  const customDateInput = document.getElementById('custom-date');
  
  const resultDiv = document.getElementById('result');
  const countdownTitle = document.getElementById('countdown-title');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');
  const totalDaysDetail = document.getElementById('total-days-detail');

  let timerId = null;

  const holidays = {
    'new-year': { name: "New Year's Day", month: 1, day: 1 },
    'valentine': { name: "Valentine's Day", month: 2, day: 14 },
    'st-patrick': { name: "St. Patrick's Day", month: 3, day: 17 },
    'earth-day': { name: "Earth Day", month: 4, day: 22 },
    'halloween': { name: "Halloween", month: 10, day: 31 },
    'christmas': { name: "Christmas Day", month: 12, day: 25 }
  };

  function getTargetDate() {
    const selected = holidaySelect.value;
    const now = new Date();

    if (selected === 'custom') {
      const dateVal = customDateInput.value;
      if (!dateVal) return null;
      return new Date(dateVal);
    }

    const info = holidays[selected];
    if (!info) return null;

    let target = new Date(now.getFullYear(), info.month - 1, info.day, 0, 0, 0);
    if (target < now) {
      target = new Date(now.getFullYear() + 1, info.month - 1, info.day, 0, 0, 0);
    }
    return target;
  }

  function getTitle() {
    const selected = holidaySelect.value;
    if (selected === 'custom') {
      return customNameInput.value || 'Custom Event';
    }
    return holidays[selected] ? holidays[selected].name : 'Holiday';
  }

  function updateCountdown() {
    const target = getTargetDate();
    const now = new Date();

    if (!target || isNaN(target.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    const title = getTitle();
    countdownTitle.textContent = `Time Until ${title}`;

    const diffMs = target.getTime() - now.getTime();

    if (diffMs <= 0) {
      cdDays.textContent = '0';
      cdHours.textContent = '0';
      cdMinutes.textContent = '0';
      cdSeconds.textContent = '0';
      cdSeconds.style.color = '#EF4444';
      totalDaysDetail.textContent = `🎉 The event "${title}" is happening now or has already passed!`;
      resultDiv.style.display = '';
      return;
    }

    cdSeconds.style.color = '#10B981';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    cdDays.textContent = days.toString();
    cdHours.textContent = hours.toString();
    cdMinutes.textContent = minutes.toString();
    cdSeconds.textContent = seconds.toString();

    const totalDaysFloat = diffMs / (1000 * 60 * 60 * 24);
    totalDaysDetail.textContent = `Equivalent to ${totalDaysFloat.toFixed(2)} total days remaining.`;

    resultDiv.style.display = '';
  }

  function onInputChanged() {
    if (holidaySelect.value === 'custom') {
      customGroup.style.display = '';
    } else {
      customGroup.style.display = 'none';
    }
    updateCountdown();
  }

  // Bind event listeners
  holidaySelect.addEventListener('input', onInputChanged);
  customNameInput.addEventListener('input', updateCountdown);
  customDateInput.addEventListener('input', updateCountdown);

  // Set default custom date to a week from now
  const oneWeekLater = new Date();
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  // Format for datetime-local input (YYYY-MM-DDTHH:MM)
  const tzOffset = oneWeekLater.getTimezoneOffset() * 60000; // in ms
  const localISOTime = new Date(oneWeekLater.getTime() - tzOffset).toISOString().slice(0, 16);
  customDateInput.value = localISOTime;

  // Initial calculation and start timer
  onInputChanged();
  timerId = setInterval(updateCountdown, 1000);

  return () => {
    if (timerId) clearInterval(timerId);
    holidaySelect.removeEventListener('input', onInputChanged);
    customNameInput.removeEventListener('input', updateCountdown);
    customDateInput.removeEventListener('input', updateCountdown);
  };
}
