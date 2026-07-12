export const meta = {
  slug: 'countdown',
  name: 'Countdown Timer',
  title: 'Countdown Timer - Calcyx',
  description: 'Live countdown to any future date and time. See days, hours, minutes, and seconds remaining in real time.',
  category: 'datetime',
  icon: '⏳',
  keywords: ['countdown', 'timer', 'days until', 'time remaining', 'event countdown', 'deadline'],
  formula: 'Remaining = Target Date − Now',
  relatedSlugs: ['age', 'days-between']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  // Default to tomorrow at noon
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(12, 0, 0, 0);
  const defaultDate = tomorrow.toISOString().split('T')[0];
  const defaultTime = '12:00';

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="event-name">Event Name (optional)</label>
          <input type="text" id="event-name" class="calc-input" placeholder="e.g. New Year's Eve">
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="target-date">Target Date</label>
            <input type="date" id="target-date" class="calc-input" value="${defaultDate}">
          </div>
          <div class="calc-input-group">
            <label for="target-time">Target Time</label>
            <input type="time" id="target-time" class="calc-input" value="${defaultTime}">
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-label" id="event-label"></div>
          <div class="calc-result-grid" id="countdown-grid"></div>
          <div class="calc-result-detail" id="total-seconds-display"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Remaining = Target DateTime − Current DateTime</code>
        <p>The countdown updates every second, breaking the total remaining time into days, hours, minutes, and seconds. When the target is reached, the countdown shows zero.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const dateInput = document.getElementById('target-date');
  const timeInput = document.getElementById('target-time');
  const eventInput = document.getElementById('event-name');
  const resultDiv = document.getElementById('result');
  const eventLabel = document.getElementById('event-label');
  const countdownGrid = document.getElementById('countdown-grid');
  const totalSecondsDisplay = document.getElementById('total-seconds-display');

  let intervalId = null;

  function updateCountdown() {
    const dateVal = dateInput.value;
    const timeVal = timeInput.value || '00:00';

    if (!dateVal) {
      resultDiv.style.display = 'none';
      return;
    }

    const target = new Date(`${dateVal}T${timeVal}:00`);
    if (isNaN(target.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    const now = new Date();
    const eventName = eventInput.value.trim();
    eventLabel.textContent = eventName
      ? `Countdown to ${eventName}`
      : 'Countdown';

    let diffMs = target.getTime() - now.getTime();
    const isPast = diffMs < 0;

    if (isPast) {
      diffMs = Math.abs(diffMs);
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">${days.toLocaleString()}</div>
        <div class="calc-result-label">Days</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${String(hours).padStart(2, '0')}</div>
        <div class="calc-result-label">Hours</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${String(minutes).padStart(2, '0')}</div>
        <div class="calc-result-label">Minutes</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${String(seconds).padStart(2, '0')}</div>
        <div class="calc-result-label">Seconds</div>
      </div>
    `;

    totalSecondsDisplay.textContent = isPast
      ? `⚠️ This event was ${totalSeconds.toLocaleString()} seconds ago`
      : `${totalSeconds.toLocaleString()} total seconds remaining`;

    resultDiv.style.display = '';
  }

  function startTimer() {
    if (intervalId) clearInterval(intervalId);
    updateCountdown();
    intervalId = setInterval(updateCountdown, 1000);
  }

  dateInput.addEventListener('input', startTimer);
  timeInput.addEventListener('input', startTimer);
  eventInput.addEventListener('input', updateCountdown);

  // Start immediately
  startTimer();

  return () => {
    if (intervalId) clearInterval(intervalId);
    dateInput.removeEventListener('input', startTimer);
    timeInput.removeEventListener('input', startTimer);
    eventInput.removeEventListener('input', updateCountdown);
  };
}
