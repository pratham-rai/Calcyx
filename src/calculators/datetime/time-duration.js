export const meta = {
  slug: 'time-duration',
  name: 'Time Duration Calculator',
  title: 'Time Duration Calculator - Calcyx',
  description: 'Calculate elapsed time between two times or add and subtract time durations (hours, minutes, seconds).',
  category: 'datetime',
  icon: '⏱️',
  keywords: ['time duration', 'add time', 'subtract time', 'elapsed time', 'time converter', 'hours calculator'],
  formula: 'Duration = End Time − Start Time',
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
          <label for="calc-mode">Calculator Mode</label>
          <select id="calc-mode" class="calc-select">
            <option value="between" selected>Duration Between Times</option>
            <option value="math">Add / Subtract Time</option>
          </select>
        </div>

        <!-- Mode 1: Duration Between Times -->
        <div id="mode-between-container">
          <div class="calc-row">
            <div class="calc-input-group">
              <label for="start-time">Start Time</label>
              <input type="time" id="start-time" class="calc-input" value="09:00:00" step="1">
            </div>
            <div class="calc-input-group">
              <label for="end-time">End Time</label>
              <input type="time" id="end-time" class="calc-input" value="17:30:00" step="1">
            </div>
          </div>
          <div class="calc-input-group" style="margin-top: 8px;">
            <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;">
              <input type="checkbox" id="next-day-auto" checked> Auto-assume next day if end time is earlier than start time
            </label>
          </div>
        </div>

        <!-- Mode 2: Add / Subtract Time -->
        <div id="mode-math-container" style="display:none;">
          <div class="calc-row" style="margin-bottom: 12px;">
            <div class="calc-input-group" style="flex: 2;">
              <label>Base Duration (Hours / Mins / Secs)</label>
              <div style="display: flex; gap: 8px;">
                <input type="number" id="base-h" class="calc-input" placeholder="HH" min="0" value="1" style="flex: 1;">
                <input type="number" id="base-m" class="calc-input" placeholder="MM" min="0" max="59" value="30" style="flex: 1;">
                <input type="number" id="base-s" class="calc-input" placeholder="SS" min="0" max="59" value="0" style="flex: 1;">
              </div>
            </div>
            <div class="calc-input-group" style="max-width: 120px; flex: 1;">
              <label for="operation">Operation</label>
              <select id="operation" class="calc-select">
                <option value="add">Add (+)</option>
                <option value="subtract">Subtract (-)</option>
              </select>
            </div>
          </div>

          <div class="calc-input-group">
            <label>Time to Add/Subtract (Hours / Mins / Secs)</label>
            <div style="display: flex; gap: 8px;">
              <input type="number" id="val-h" class="calc-input" placeholder="HH" min="0" value="0" style="flex: 1;">
              <input type="number" id="val-m" class="calc-input" placeholder="MM" min="0" max="59" value="45" style="flex: 1;">
              <input type="number" id="val-s" class="calc-input" placeholder="SS" min="0" max="59" value="0" style="flex: 1;">
            </div>
          </div>
        </div>

        <!-- Result Display -->
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="result-display-val"></div>
          <div class="calc-result-label" id="result-display-label">Elapsed Time</div>

          <div class="calc-result-grid" id="result-breakdown" style="margin-top: 16px;"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <div id="formula-between">
          <code>Duration = End Time − Start Time</code>
          <p>Calculates the elapsed hours, minutes, and seconds between two daily times. If the end time is earlier than the start time and the "auto-assume next day" option is checked, it adds 24 hours to the end time.</p>
        </div>
        <div id="formula-math" style="display:none;">
          <code>Result Duration = Base Duration ± Modifier Duration</code>
          <p>Adds or subtracts hours, minutes, and seconds from a base duration, automatically borrowing and carrying over values (60 seconds = 1 minute, 60 minutes = 1 hour).</p>
        </div>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const calcModeSelect = document.getElementById('calc-mode');

  const modeBetweenContainer = document.getElementById('mode-between-container');
  const modeMathContainer = document.getElementById('mode-math-container');

  const startTimeInput = document.getElementById('start-time');
  const endTimeInput = document.getElementById('end-time');
  const nextDayAutoCheckbox = document.getElementById('next-day-auto');

  const baseHInput = document.getElementById('base-h');
  const baseMInput = document.getElementById('base-m');
  const baseSInput = document.getElementById('base-s');
  const operationSelect = document.getElementById('operation');
  const valHInput = document.getElementById('val-h');
  const valMInput = document.getElementById('val-m');
  const valSInput = document.getElementById('val-s');

  const resultDiv = document.getElementById('result');
  const resultDisplayValEl = document.getElementById('result-display-val');
  const resultDisplayLabelEl = document.getElementById('result-display-label');
  const resultBreakdownEl = document.getElementById('result-breakdown');

  const formulaBetween = document.getElementById('formula-between');
  const formulaMath = document.getElementById('formula-math');

  function parseTime(val) {
    if (!val) return null;
    const parts = val.split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    const s = parseInt(parts[2], 10) || 0;
    return h * 3600 + m * 60 + s;
  }

  function formatTotalHours(secs) {
    const h = secs / 3600;
    return h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' hrs';
  }

  function formatTotalMins(secs) {
    const m = secs / 60;
    return m.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' min';
  }

  function formatTotalSecs(secs) {
    return secs.toLocaleString() + ' sec';
  }

  function calculate() {
    const mode = calcModeSelect.value;

    if (mode === 'between') {
      const startSecs = parseTime(startTimeInput.value);
      const endSecs = parseTime(endTimeInput.value);

      if (startSecs === null || endSecs === null) {
        resultDiv.style.display = 'none';
        return;
      }

      let diffSecs = endSecs - startSecs;
      let isNextDay = false;

      if (diffSecs < 0 && nextDayAutoCheckbox.checked) {
        diffSecs += 24 * 3600;
        isNextDay = true;
      }

      const absDiff = Math.abs(diffSecs);
      const h = Math.floor(absDiff / 3600);
      const m = Math.floor((absDiff % 3600) / 60);
      const s = absDiff % 60;

      const formatted = `${diffSecs < 0 ? '-' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

      resultDisplayValEl.textContent = formatted;
      resultDisplayLabelEl.innerHTML = `Elapsed Time${isNextDay ? ' <span style="font-size: 0.85rem; opacity: 0.85; font-weight: normal;">(Crosses Midnight)</span>' : ''}`;

      resultBreakdownEl.innerHTML = `
        <div class="calc-result-item">
          <div class="calc-result-value">${formatTotalHours(diffSecs)}</div>
          <div class="calc-result-label">Total Hours</div>
        </div>
        <div class="calc-result-item">
          <div class="calc-result-value">${formatTotalMins(diffSecs)}</div>
          <div class="calc-result-label">Total Minutes</div>
        </div>
        <div class="calc-result-item">
          <div class="calc-result-value">${formatTotalSecs(diffSecs)}</div>
          <div class="calc-result-label">Total Seconds</div>
        </div>
      `;
    } else {
      const bh = parseInt(baseHInput.value, 10) || 0;
      const bm = parseInt(baseMInput.value, 10) || 0;
      const bs = parseInt(baseSInput.value, 10) || 0;

      const vh = parseInt(valHInput.value, 10) || 0;
      const vm = parseInt(valMInput.value, 10) || 0;
      const vs = parseInt(valSInput.value, 10) || 0;

      const baseTotal = bh * 3600 + bm * 60 + bs;
      const valTotal = vh * 3600 + vm * 60 + vs;

      const op = operationSelect.value;
      const resultTotal = op === 'add' ? (baseTotal + valTotal) : (baseTotal - valTotal);

      const isNegative = resultTotal < 0;
      const absResult = Math.abs(resultTotal);

      const rh = Math.floor(absResult / 3600);
      const rm = Math.floor((absResult % 3600) / 60);
      const rs = absResult % 60;

      const formatted = `${isNegative ? '-' : ''}${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}:${String(rs).padStart(2, '0')}`;

      resultDisplayValEl.textContent = formatted;
      resultDisplayLabelEl.textContent = 'Calculated Duration';

      resultBreakdownEl.innerHTML = `
        <div class="calc-result-item">
          <div class="calc-result-value">${formatTotalHours(resultTotal)}</div>
          <div class="calc-result-label">Total Hours</div>
        </div>
        <div class="calc-result-item">
          <div class="calc-result-value">${formatTotalMins(resultTotal)}</div>
          <div class="calc-result-label">Total Minutes</div>
        </div>
        <div class="calc-result-item">
          <div class="calc-result-value">${formatTotalSecs(resultTotal)}</div>
          <div class="calc-result-label">Total Seconds</div>
        </div>
      `;
    }

    resultDiv.style.display = '';
  }

  function updateMode() {
    const mode = calcModeSelect.value;
    if (mode === 'between') {
      modeBetweenContainer.style.display = '';
      modeMathContainer.style.display = 'none';
      formulaBetween.style.display = '';
      formulaMath.style.display = 'none';
    } else {
      modeBetweenContainer.style.display = 'none';
      modeMathContainer.style.display = '';
      formulaBetween.style.display = 'none';
      formulaMath.style.display = '';
    }
    calculate();
  }

  const inputs = [
    calcModeSelect, startTimeInput, endTimeInput, nextDayAutoCheckbox,
    baseHInput, baseMInput, baseSInput, operationSelect, valHInput, valMInput, valSInput
  ];

  inputs.forEach(input => {
    input.addEventListener('input', calculate);
    input.addEventListener('change', calculate);
  });

  calcModeSelect.addEventListener('change', updateMode);

  // Set initial view
  updateMode();

  return () => {
    inputs.forEach(input => {
      input.removeEventListener('input', calculate);
      input.removeEventListener('change', calculate);
    });
    calcModeSelect.removeEventListener('change', updateMode);
  };
}
