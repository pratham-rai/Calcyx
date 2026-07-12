export const meta = {
  slug: 'time-subtract',
  name: 'Time Subtraction Calculator',
  title: 'Time Subtraction Calculator - Calcyx',
  description: 'Subtract hours, minutes, and seconds from a start date and time to calculate the resulting date and time.',
  category: 'datetime',
  icon: '⏰',
  keywords: ['time subtraction', 'subtract time', 'date subtraction', 'subtract hours', 'time calculator'],
  formula: 'Result Time = Start Time − Duration',
  relatedSlugs: ['add-subtract-days', 'time-duration']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  // Get local ISO date time string for default input value
  const now = new Date();
  const tzoffset = now.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(now - tzoffset)).toISOString().slice(0, 16);

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group" style="flex: 1;">
            <label for="start-datetime">Start Date & Time</label>
            <input type="datetime-local" id="start-datetime" class="calc-input" value="${localISOTime}">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="sub-hours">Hours</label>
            <input type="number" id="sub-hours" class="calc-input" min="0" value="2" step="1" placeholder="0">
          </div>
          <div class="calc-input-group">
            <label for="sub-minutes">Minutes</label>
            <input type="number" id="sub-minutes" class="calc-input" min="0" max="59" value="30" step="1" placeholder="0">
          </div>
          <div class="calc-input-group">
            <label for="sub-seconds">Seconds</label>
            <input type="number" id="sub-seconds" class="calc-input" min="0" max="59" value="0" step="1" placeholder="0">
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="result-datetime-display" style="font-size: 1.5rem; line-height: 1.4;"></div>
          <div class="calc-result-label">Resulting Date & Time</div>
          <div class="calc-result-grid" id="details-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Result Time = Start Time − Duration</code>
        <p>This calculator converts the specified hours, minutes, and seconds subtraction values into milliseconds, subtracts them from the millisecond timestamp of the start date and time, and converts the resulting timestamp back to a formatted date and time in your local timezone.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const startInput = document.getElementById('start-datetime');
  const hoursInput = document.getElementById('sub-hours');
  const minutesInput = document.getElementById('sub-minutes');
  const secondsInput = document.getElementById('sub-seconds');
  const resultDiv = document.getElementById('result');
  const datetimeDisplay = document.getElementById('result-datetime-display');
  const detailsGrid = document.getElementById('details-grid');

  function calculate() {
    const startVal = startInput.value;
    if (!startVal) {
      resultDiv.style.display = 'none';
      return;
    }

    const baseDate = new Date(startVal);
    if (isNaN(baseDate.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    const hours = Math.abs(parseInt(hoursInput.value)) || 0;
    const minutes = Math.abs(parseInt(minutesInput.value)) || 0;
    const seconds = Math.abs(parseInt(secondsInput.value)) || 0;

    // Milliseconds to subtract
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    const totalMs = totalSeconds * 1000;
    
    const resultDate = new Date(baseDate.getTime() - totalMs);

    const formattedDate = resultDate.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formattedTime = resultDate.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    datetimeDisplay.textContent = `${formattedDate} at ${formattedTime}`;

    detailsGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">${totalSeconds.toLocaleString()}s</div>
        <div class="calc-result-label">Total Seconds Subtracted</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${((hours * 60) + minutes).toLocaleString()}m</div>
        <div class="calc-result-label">Total Minutes Subtracted</div>
      </div>
      <div class="calc-result-item" style="grid-column: span 2;">
        <div class="calc-result-value">${(totalSeconds / 3600).toFixed(4)} hrs</div>
        <div class="calc-result-label">Equivalent Hours</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  // Event Listeners
  startInput.addEventListener('input', calculate);
  hoursInput.addEventListener('input', calculate);
  minutesInput.addEventListener('input', calculate);
  secondsInput.addEventListener('input', calculate);

  // Initial calculation
  calculate();

  return () => {
    startInput.removeEventListener('input', calculate);
    hoursInput.removeEventListener('input', calculate);
    minutesInput.removeEventListener('input', calculate);
    secondsInput.removeEventListener('input', calculate);
  };
}
