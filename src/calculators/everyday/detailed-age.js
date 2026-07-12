export const meta = {
  slug: 'detailed-age',
  name: 'Detailed Age Timer',
  title: 'Detailed Age Timer - Calcyx',
  description: 'Calculate your exact age in years, months, weeks, days, hours, minutes, seconds, and milliseconds with a real-time live-ticking display.',
  category: 'everyday',
  icon: '⏳',
  keywords: ['exact age', 'age timer', 'age ticker', 'age in seconds', 'chronological age', 'birthday timer'],
  formula: 'Age = Current Time − Birth Date & Time',
  relatedSlugs: ['age', 'countdown']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  // Default to exactly 25 years ago today for a realistic starting point
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 25);
  const defaultDateTime = defaultDate.toISOString().slice(0, 16);

  // Maximum date is right now
  const nowStr = new Date().toISOString().slice(0, 16);

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="birth-datetime">Enter Your Birth Date & Time</label>
          <input type="datetime-local" id="birth-datetime" class="calc-input" value="${defaultDateTime}" max="${nowStr}">
        </div>

        <div id="error-message" style="display: none; color: #ff6b6b; font-size: 0.9rem; margin-bottom: 1rem; font-family: monospace; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; padding: 0.5rem 0.75rem; border-radius: 4px;"></div>

        <div id="result" class="calc-result" style="display: none;">
          <div class="calc-result-label">Exact Chronological Age</div>
          <div class="calc-result-value" id="chronological-age" style="font-size: 1.6rem; margin-bottom: 1.5rem; line-height: 1.4;"></div>
          
          <div class="calc-result-label" style="margin-bottom: 0.75rem;">Time Lived Breakdown (Live Ticker)</div>
          <div class="calc-result-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <div class="calc-result-item" style="padding: 1rem;">
              <div class="calc-result-value" id="ticker-years" style="font-family: monospace; font-size: 1.4rem;">0.00000000</div>
              <div class="calc-result-label">Total Years</div>
            </div>
            <div class="calc-result-item" style="padding: 1rem;">
              <div class="calc-result-value" id="ticker-months" style="font-family: monospace; font-size: 1.4rem;">0.00000000</div>
              <div class="calc-result-label">Total Months</div>
            </div>
            <div class="calc-result-item" style="padding: 1rem;">
              <div class="calc-result-value" id="ticker-weeks" style="font-family: monospace; font-size: 1.4rem;">0.00000000</div>
              <div class="calc-result-label">Total Weeks</div>
            </div>
            <div class="calc-result-item" style="padding: 1rem;">
              <div class="calc-result-value" id="ticker-days" style="font-family: monospace; font-size: 1.4rem;">0.00000000</div>
              <div class="calc-result-label">Total Days</div>
            </div>
            <div class="calc-result-item" style="padding: 1rem;">
              <div class="calc-result-value" id="ticker-hours" style="font-family: monospace; font-size: 1.4rem;">0.00000000</div>
              <div class="calc-result-label">Total Hours</div>
            </div>
            <div class="calc-result-item" style="padding: 1rem;">
              <div class="calc-result-value" id="ticker-minutes" style="font-family: monospace; font-size: 1.4rem;">0.00000000</div>
              <div class="calc-result-label">Total Minutes</div>
            </div>
            <div class="calc-result-item" style="padding: 1rem;">
              <div class="calc-result-value" id="ticker-seconds" style="font-family: monospace; font-size: 1.4rem;">0.00000000</div>
              <div class="calc-result-label">Total Seconds</div>
            </div>
            <div class="calc-result-item" style="padding: 1rem;">
              <div class="calc-result-value" id="ticker-ms" style="font-family: monospace; font-size: 1.4rem;">0</div>
              <div class="calc-result-label">Total Milliseconds</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>📚 How Exact Age is Calculated</h3>
        <p>Your age is computed in real-time by taking the difference between the current system date/time and your date/time of birth.</p>
        <ul>
          <li><strong>Chronological Age:</strong> Accounts for calendar anomalies like varying month lengths and leap years.</li>
          <li><strong>Leap Year Factors:</strong> An average calendar year is estimated at <code>365.2425 days</code> (taking leap cycles into account), and an average month is estimated at <code>30.4375 days</code>.</li>
          <li><strong>High-Precision Ticker:</strong> The ticker displays fractional parts of years, months, days, etc., updating every 100 milliseconds as time moves forward.</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const birthInput = document.getElementById('birth-datetime');
  const errorMsg = document.getElementById('error-message');
  const resultDiv = document.getElementById('result');

  const ageDisplay = document.getElementById('chronological-age');
  const yearsTicker = document.getElementById('ticker-years');
  const monthsTicker = document.getElementById('ticker-months');
  const weeksTicker = document.getElementById('ticker-weeks');
  const daysTicker = document.getElementById('ticker-days');
  const hoursTicker = document.getElementById('ticker-hours');
  const minutesTicker = document.getElementById('ticker-minutes');
  const secondsTicker = document.getElementById('ticker-seconds');
  const msTicker = document.getElementById('ticker-ms');

  let timerId = null;

  function update() {
    const birthVal = birthInput.value;
    if (!birthVal) {
      resultDiv.style.display = 'none';
      errorMsg.style.display = 'none';
      if (timerId) clearInterval(timerId);
      return;
    }

    const birthDate = new Date(birthVal);
    const now = new Date();

    if (isNaN(birthDate.getTime())) {
      resultDiv.style.display = 'none';
      errorMsg.style.display = 'none';
      if (timerId) clearInterval(timerId);
      return;
    }

    if (birthDate > now) {
      errorMsg.textContent = 'Error: Birth date and time cannot be in the future.';
      errorMsg.style.display = 'block';
      resultDiv.style.display = 'none';
      if (timerId) clearInterval(timerId);
      return;
    }

    errorMsg.style.display = 'none';
    resultDiv.style.display = 'block';

    const diffMs = now.getTime() - birthDate.getTime();

    // Constant conversion factors
    const msPerSecond = 1000;
    const msPerMinute = msPerSecond * 60;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerWeek = msPerDay * 7;
    const msPerMonth = msPerDay * 30.4375; // average days in a month
    const msPerYear = msPerDay * 365.2425; // accounting for leap years

    // Update real-time tickers
    yearsTicker.textContent = (diffMs / msPerYear).toFixed(8);
    monthsTicker.textContent = (diffMs / msPerMonth).toFixed(8);
    weeksTicker.textContent = (diffMs / msPerWeek).toFixed(8);
    daysTicker.textContent = (diffMs / msPerDay).toFixed(8);
    hoursTicker.textContent = (diffMs / msPerHour).toFixed(8);
    minutesTicker.textContent = (diffMs / msPerMinute).toFixed(8);
    secondsTicker.textContent = (diffMs / msPerSecond).toFixed(8);
    msTicker.textContent = diffMs.toLocaleString();

    // Chronological Calendar Age
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();
    let minutes = now.getMinutes() - birthDate.getMinutes();
    let seconds = now.getSeconds() - birthDate.getSeconds();

    // Adjust negative values back
    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
    }
    if (days < 0) {
      // Find days in previous month relative to 'now'
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    const ageString = [];
    if (years > 0) ageString.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    if (months > 0) ageString.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    if (days > 0) ageString.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    if (hours > 0) ageString.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    if (minutes > 0) ageString.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    if (seconds >= 0) ageString.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);

    ageDisplay.textContent = ageString.join(', ');
  }

  function startTimer() {
    if (timerId) clearInterval(timerId);
    update();
    timerId = setInterval(update, 100);
  }

  birthInput.addEventListener('input', startTimer);
  
  // Start on initial mount
  startTimer();

  return () => {
    birthInput.removeEventListener('input', startTimer);
    if (timerId) {
      clearInterval(timerId);
    }
  };
}
