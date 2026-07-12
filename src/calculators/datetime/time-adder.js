export const meta = {
  slug: 'time-adder',
  name: 'Time Adder & Subtracter',
  title: 'Time Adder & Subtracter - Calcyx',
  description: 'Add or subtract hours, minutes, and seconds to/from a base time, with automatic day rollover and cumulative duration formatting.',
  category: 'datetime',
  icon: '⏰',
  keywords: ['time adder', 'time subtracter', 'time math', 'add hours', 'subtract minutes', 'duration math'],
  formula: 'New Time = Base Time ± Duration',
  relatedSlugs: ['time-duration', 'timezone']
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
        <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">1. Base Time</h3>
        <div class="calc-row" style="margin-bottom: 20px;">
          <div class="calc-input-group" style="flex: 1;">
            <label for="base-h">Hours</label>
            <input type="number" id="base-h" class="calc-input" min="0" value="1" placeholder="0">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="base-m">Minutes (0-59)</label>
            <input type="number" id="base-m" class="calc-input" min="0" max="59" value="45" placeholder="0">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="base-s">Seconds (0-59)</label>
            <input type="number" id="base-s" class="calc-input" min="0" max="59" value="0" placeholder="0">
          </div>
        </div>

        <div class="calc-input-group" style="margin-bottom: 20px;">
          <label for="operation">Operation</label>
          <select id="operation" class="calc-select">
            <option value="add">Add (+)</option>
            <option value="subtract">Subtract (-)</option>
          </select>
        </div>

        <h3 style="margin-bottom: 10px; font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">2. Duration</h3>
        <div class="calc-row" style="margin-bottom: 25px;">
          <div class="calc-input-group" style="flex: 1;">
            <label for="dur-h">Hours</label>
            <input type="number" id="dur-h" class="calc-input" min="0" value="0" placeholder="0">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="dur-m">Minutes</label>
            <input type="number" id="dur-m" class="calc-input" min="0" value="90" placeholder="0">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="dur-s">Seconds</label>
            <input type="number" id="dur-s" class="calc-input" min="0" value="0" placeholder="0">
          </div>
        </div>

        <div id="result" class="calc-result">
          <div class="calc-result-grid">
            <div class="calc-result-item">
              <div class="calc-result-label">Clock Time (24-Hour)</div>
              <div class="calc-result-value" id="clock-display" style="font-size: 1.8rem; color: #10B981; font-family: monospace;">03:15:00</div>
              <div class="calc-result-detail" id="clock-detail">Same day</div>
            </div>
            
            <div class="calc-result-item">
              <div class="calc-result-label">Total Duration Format</div>
              <div class="calc-result-value" id="total-display" style="font-size: 1.8rem; color: #3B82F6; font-family: monospace;">+03:15:00</div>
              <div class="calc-result-detail" id="total-detail">3 hours, 15 minutes, 0 seconds</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>How It Works</h3>
        <p>This calculator processes time arithmetic using cumulative second intervals:</p>
        <ol>
          <li>Converts the Base Time and Duration into total seconds.</li>
          <li>Applies the selected arithmetic operation (addition or subtraction).</li>
          <li>For the <strong>Clock Time Result</strong>, it uses modulo 24-hour arithmetic (86,400 seconds in a day) to display the time on a standard digital clock, indicating any day rollover offset (e.g. +1 day).</li>
          <li>For the <strong>Total Duration Result</strong>, it displays the cumulative elapsed time length, which can exceed 24 hours or be negative.</li>
        </ol>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const baseH = document.getElementById('base-h');
  const baseM = document.getElementById('base-m');
  const baseS = document.getElementById('base-s');
  const durH = document.getElementById('dur-h');
  const durM = document.getElementById('dur-m');
  const durS = document.getElementById('dur-s');
  const operation = document.getElementById('operation');

  const clockDisplay = document.getElementById('clock-display');
  const clockDetail = document.getElementById('clock-detail');
  const totalDisplay = document.getElementById('total-display');
  const totalDetail = document.getElementById('total-detail');

  function calculate() {
    // Parse values, defaulting to 0
    const bH = Math.max(0, parseInt(baseH.value, 10) || 0);
    const bM = Math.max(0, Math.min(59, parseInt(baseM.value, 10) || 0));
    const bS = Math.max(0, Math.min(59, parseInt(baseS.value, 10) || 0));

    const dH = Math.max(0, parseInt(durH.value, 10) || 0);
    const dM = Math.max(0, parseInt(durM.value, 10) || 0);
    const dS = Math.max(0, parseInt(durS.value, 10) || 0);

    const op = operation.value;

    // Convert to total seconds
    const baseTotalSec = bH * 3600 + bM * 60 + bS;
    const durTotalSec = dH * 3600 + dM * 60 + dS;

    let resultSec = 0;
    if (op === 'add') {
      resultSec = baseTotalSec + durTotalSec;
    } else {
      resultSec = baseTotalSec - durTotalSec;
    }

    // 1. Total Duration Display
    const isNeg = resultSec < 0;
    const absSec = Math.abs(resultSec);
    const totH = Math.floor(absSec / 3600);
    const totM = Math.floor((absSec % 3600) / 60);
    const totS = absSec % 60;

    const sign = isNeg ? '-' : '+';
    totalDisplay.textContent = `${sign}${String(totH).padStart(2, '0')}:${String(totM).padStart(2, '0')}:${String(totS).padStart(2, '0')}`;
    
    const hLabel = totH === 1 ? 'hour' : 'hours';
    const mLabel = totM === 1 ? 'minute' : 'minutes';
    const sLabel = totS === 1 ? 'second' : 'seconds';
    totalDetail.textContent = `${isNeg ? 'Minus ' : ''}${totH.toLocaleString()} ${hLabel}, ${totM} ${mLabel}, ${totS} ${sLabel}`;

    // 2. 24-Hour Clock Time Display
    let dayOffset = 0;
    let timeOfDaySec = 0;

    if (resultSec >= 0) {
      dayOffset = Math.floor(resultSec / 86400);
      timeOfDaySec = resultSec % 86400;
    } else {
      dayOffset = Math.floor(resultSec / 86400);
      timeOfDaySec = (resultSec % 86400 + 86400) % 86400;
    }

    const clkH = Math.floor(timeOfDaySec / 3600);
    const clkM = Math.floor((timeOfDaySec % 3600) / 60);
    const clkS = timeOfDaySec % 60;

    clockDisplay.textContent = `${String(clkH).padStart(2, '0')}:${String(clkM).padStart(2, '0')}:${String(clkS).padStart(2, '0')}`;

    if (dayOffset === 0) {
      clockDetail.textContent = 'Same day';
    } else if (dayOffset > 0) {
      clockDetail.textContent = `+${dayOffset} day${dayOffset > 1 ? 's' : ''} later`;
    } else {
      clockDetail.textContent = `${dayOffset} day${dayOffset < -1 ? 's' : ''} earlier`;
    }
  }

  // Attach event listeners for real-time calculation
  baseH.addEventListener('input', calculate);
  baseM.addEventListener('input', calculate);
  baseS.addEventListener('input', calculate);
  durH.addEventListener('input', calculate);
  durM.addEventListener('input', calculate);
  durS.addEventListener('input', calculate);
  operation.addEventListener('input', calculate);

  // Initial calculation
  calculate();

  return () => {
    baseH.removeEventListener('input', calculate);
    baseM.removeEventListener('input', calculate);
    baseS.removeEventListener('input', calculate);
    durH.removeEventListener('input', calculate);
    durM.removeEventListener('input', calculate);
    durS.removeEventListener('input', calculate);
    operation.removeEventListener('input', calculate);
  };
}
