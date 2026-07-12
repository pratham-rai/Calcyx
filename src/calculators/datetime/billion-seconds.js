export const meta = {
  slug: 'billion-seconds',
  name: 'Billion Seconds Timer',
  title: 'Billion Seconds Milestone Calculator - Calcyx',
  description: 'Find out exactly when you or anyone will turn 1 billion seconds old, 500 million seconds, or reach day milestones like 10,000 days.',
  category: 'datetime',
  icon: '⏱️',
  keywords: ['billion seconds', 'billion seconds old', 'age milestones', 'day milestones', 'anniversary milestone', 'milestone calculator'],
  formula: 'Target Date = Birth Date + Milestone Duration',
  relatedSlugs: ['age', 'detailed-age']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  // Default birthdate: 30 years ago, at noon
  const thirtyYearsAgo = new Date();
  thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
  thirtyYearsAgo.setHours(12, 0, 0, 0);
  const tzOffset = thirtyYearsAgo.getTimezoneOffset() * 60000;
  const defaultBirthStr = new Date(thirtyYearsAgo.getTime() - tzOffset).toISOString().slice(0, 16);

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-row" style="gap: 15px;">
          <div class="calc-input-group" style="flex: 1.2;">
            <label for="birth-datetime">Date & Time of Birth</label>
            <input type="datetime-local" id="birth-datetime" class="calc-input" value="${defaultBirthStr}">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="milestone-select">Select Milestone</label>
            <select id="milestone-select" class="calc-select">
              <option value="1e9">1 Billion Seconds (approx. 31.7 yrs)</option>
              <option value="5e8">500 Million Seconds (approx. 15.8 yrs)</option>
              <option value="2.5e8">250 Million Seconds (approx. 7.9 yrs)</option>
              <option value="1e8">100 Million Seconds (approx. 3.2 yrs)</option>
              <option value="10000d">10,000 Days (approx. 27.4 yrs)</option>
              <option value="20000d">20,000 Days (approx. 54.8 yrs)</option>
              <option value="25000d">25,000 Days (approx. 68.4 yrs)</option>
              <option value="30000d">30,000 Days (approx. 82.1 yrs)</option>
            </select>
          </div>
        </div>

        <div id="result" class="calc-result" style="display:none; text-align: center; margin-top: 25px;">
          <div class="calc-result-item" style="max-width: 500px; margin: 0 auto 20px auto; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <div class="calc-result-label" style="font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Milestone Date & Time</div>
            <div class="calc-result-value" id="target-date-display" style="font-size: 1.5rem; margin: 8px 0; color: #60A5FA;">--</div>
            <div class="calc-result-detail" id="milestone-status" style="font-weight: 500;">--</div>
          </div>

          <h2 id="timer-title" style="font-size: 1.1rem; font-weight: 600; margin-bottom: 15px; color: #a0aec0;">Time Remaining / Elapsed</h2>
          <div class="calc-result-grid">
            <div class="calc-result-item">
              <div class="calc-result-value" id="t-days" style="font-size: 2rem;">0</div>
              <div class="calc-result-label">Days</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="t-hours" style="font-size: 2rem;">0</div>
              <div class="calc-result-label">Hours</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="t-minutes" style="font-size: 2rem;">0</div>
              <div class="calc-result-label">Minutes</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="t-seconds" style="font-size: 2rem; color: #10B981;">0</div>
              <div class="calc-result-label">Seconds</div>
            </div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <p>A billion seconds is an incredibly long time — specifically <strong>31 years, 251 days, 13 hours, 34 minutes, and 40 seconds</strong>. Most people celebrate their 1 billion seconds birthday in their early thirties!</p>
        <p>We calculate these milestones precisely down to the millisecond:</p>
        <code>Milestone Date = Birth Date + Milestone Duration</code>
        <p>If the milestone has occurred in the past, the timer displays how much time has elapsed since that special moment. If it is in the future, the timer counts down to the exact second.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const birthDatetimeInput = document.getElementById('birth-datetime');
  const milestoneSelect = document.getElementById('milestone-select');
  
  const resultDiv = document.getElementById('result');
  const targetDateDisplay = document.getElementById('target-date-display');
  const milestoneStatus = document.getElementById('milestone-status');
  
  const timerTitle = document.getElementById('timer-title');
  const tDays = document.getElementById('t-days');
  const tHours = document.getElementById('t-hours');
  const tMinutes = document.getElementById('t-minutes');
  const tSeconds = document.getElementById('t-seconds');

  let timerId = null;

  function getMilestoneDurationMs(val) {
    switch (val) {
      case '1e9': return 1000000000 * 1000;
      case '5e8': return 500000000 * 1000;
      case '2.5e8': return 250000000 * 1000;
      case '1e8': return 100000000000; // 100 million seconds
      case '10000d': return 10000 * 24 * 60 * 60 * 1000;
      case '20000d': return 20000 * 24 * 60 * 60 * 1000;
      case '25000d': return 25000 * 24 * 60 * 60 * 1000;
      case '30000d': return 30000 * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  }

  function getMilestoneName(val) {
    switch (val) {
      case '1e9': return '1 Billion Seconds';
      case '5e8': return '500 Million Seconds';
      case '2.5e8': return '250 Million Seconds';
      case '1e8': return '100 Million Seconds';
      case '10000d': return '10,000 Days';
      case '20000d': return '20,000 Days';
      case '25000d': return '25,000 Days';
      case '30000d': return '30,000 Days';
      default: return '';
    }
  }

  function updateMilestone() {
    const birthVal = birthDatetimeInput.value;
    const milestoneVal = milestoneSelect.value;

    if (!birthVal) {
      resultDiv.style.display = 'none';
      return;
    }

    const birthDate = new Date(birthVal);
    if (isNaN(birthDate.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    const durationMs = getMilestoneDurationMs(milestoneVal);
    const targetDate = new Date(birthDate.getTime() + durationMs);

    // Format target date
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };
    targetDateDisplay.textContent = targetDate.toLocaleString('en-US', options);

    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    const milestoneName = getMilestoneName(milestoneVal);

    if (diffMs > 0) {
      // Future milestone
      milestoneStatus.textContent = `🎯 You will reach this milestone in the future!`;
      milestoneStatus.style.color = '#3B82F6'; // Blue
      timerTitle.textContent = `Time Remaining Until ${milestoneName}`;
      tSeconds.style.color = '#10B981'; // Green
    } else {
      // Past milestone
      milestoneStatus.textContent = `✅ Milestone Achieved!`;
      milestoneStatus.style.color = '#10B981'; // Green
      timerTitle.textContent = `Time Elapsed Since ${milestoneName}`;
      tSeconds.style.color = '#EC4899'; // Pink/Purple
    }

    const absoluteDiff = Math.abs(diffMs);
    const days = Math.floor(absoluteDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absoluteDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absoluteDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absoluteDiff % (1000 * 60)) / 1000);

    tDays.textContent = days.toString();
    tHours.textContent = hours.toString();
    tMinutes.textContent = minutes.toString();
    tSeconds.textContent = seconds.toString();

    resultDiv.style.display = '';
  }

  birthDatetimeInput.addEventListener('input', updateMilestone);
  milestoneSelect.addEventListener('input', updateMilestone);

  // Initial calculation and start timer
  updateMilestone();
  timerId = setInterval(updateMilestone, 1000);

  return () => {
    if (timerId) clearInterval(timerId);
    birthDatetimeInput.removeEventListener('input', updateMilestone);
    milestoneSelect.removeEventListener('input', updateMilestone);
  };
}
