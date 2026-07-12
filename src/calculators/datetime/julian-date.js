export const meta = {
  slug: 'julian-date',
  title: 'Julian Date Converter',
  description: 'Convert Gregorian dates to Julian Dates (JD) and Modified Julian Dates (MJD), used in astronomy.',
  category: 'datetime',
  icon: '📜',
  relatedSlugs: ['unix-timestamp', 'timezone'],
};

/**
 * Convert a Gregorian date to Julian Date Number.
 * @param {number} year
 * @param {number} month  1-12
 * @param {number} day
 * @param {number} hour
 * @param {number} minute
 * @param {number} second
 * @returns {number} JD
 */
function gregorianToJD(year, month, day, hour = 12, minute = 0, second = 0) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFraction = day + (hour + minute / 60 + second / 3600) / 24;
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + dayFraction + B - 1524.5;
}

/**
 * Convert Julian Date to Gregorian calendar date.
 * @param {number} jd
 * @returns {{year, month, day, hour, minute, second}}
 */
function jdToGregorian(jd) {
  const z = Math.floor(jd + 0.5);
  const f = (jd + 0.5) - z;

  let A;
  if (z < 2299161) {
    A = z;
  } else {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const dayFull = B - D - Math.floor(30.6001 * E) + f;
  const day = Math.floor(dayFull);
  const timeFraction = (dayFull - day) * 24;
  const hour = Math.floor(timeFraction);
  const minuteFull = (timeFraction - hour) * 60;
  const minute = Math.floor(minuteFull);
  const second = Math.round((minuteFull - minute) * 60);

  let month, year;
  if (E < 14) {
    month = E - 1;
  } else {
    month = E - 13;
  }
  if (month > 2) {
    year = C - 4716;
  } else {
    year = C - 4715;
  }

  return { year, month, day, hour, minute, second };
}

function pad(n, digits = 2) {
  return String(n).padStart(digits, '0');
}

function formatGregorian({ year, month, day, hour, minute, second }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${pad(day)} ${months[month - 1]} ${year} ${pad(hour)}:${pad(minute)}:${pad(second)} UTC`;
}

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group" style="margin-bottom: 1rem;">
        <label class="form-label">Conversion Mode</label>
        <div style="display:flex;gap:0.5rem;">
          <button id="jd-mode-greg" class="btn btn-primary" style="flex:1;">📅 Gregorian → JD</button>
          <button id="jd-mode-jd" class="btn btn-secondary" style="flex:1;">🔢 JD → Gregorian</button>
        </div>
      </div>

      <div id="jd-greg-inputs">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" id="jd-date" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Time (UTC)</label>
            <input type="time" id="jd-time" class="form-control" step="1" value="12:00:00" />
          </div>
        </div>
        <button id="jd-now-btn" class="btn btn-secondary" style="margin-top:0.5rem;font-size:0.85rem;">⏱ Use Current Date & Time</button>
      </div>

      <div id="jd-jd-inputs" style="display:none;">
        <div class="form-group">
          <label class="form-label">Julian Date (JD)</label>
          <input type="number" id="jd-jd-input" class="form-control" step="0.00001" placeholder="e.g. 2451545.0" />
        </div>
      </div>
    </div>

    <div class="calc-result-section" id="jd-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.5rem;">Julian Date (JD)</div>
          <div id="jd-result-jd" class="text-mono" style="font-size:1.5rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.5rem;">Modified Julian Date (MJD)</div>
          <div id="jd-result-mjd" class="text-mono" style="font-size:1.5rem;font-weight:700;color:var(--secondary-color);"></div>
        </div>
      </div>

      <div class="glass-card" style="padding:1.25rem;">
        <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.5rem;">Gregorian Date & Time (UTC)</div>
        <div id="jd-result-greg" class="text-mono" style="font-size:1.2rem;font-weight:600;"></div>
      </div>

      <div id="jd-description" style="margin-top:1rem;padding:0.75rem 1rem;background:var(--bg-secondary,#f8f9fa);border-radius:8px;font-size:0.85rem;color:var(--text-secondary);"></div>
    </div>

    <div class="calc-formula">
      <h3>About Julian Dates</h3>
      <p><strong>Julian Date (JD)</strong> is a continuous count of days from the beginning of the Julian Period on January 1, 4713 BC (proleptic Julian calendar) at noon UTC. Used widely in astronomy.</p>
      <p><strong>Modified Julian Date (MJD)</strong> = JD − 2,400,000.5. Starts from midnight on November 17, 1858. More convenient for modern use.</p>
      <p><strong>J2000.0 Epoch:</strong> January 1.5, 2000 TT = JD 2,451,545.0</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const modeGregBtn = el.querySelector('#jd-mode-greg');
  const modeJDBtn = el.querySelector('#jd-mode-jd');
  const gregInputs = el.querySelector('#jd-greg-inputs');
  const jdInputs = el.querySelector('#jd-jd-inputs');
  const dateInput = el.querySelector('#jd-date');
  const timeInput = el.querySelector('#jd-time');
  const jdInput = el.querySelector('#jd-jd-input');
  const nowBtn = el.querySelector('#jd-now-btn');
  const resultsSection = el.querySelector('#jd-results');
  const resultJD = el.querySelector('#jd-result-jd');
  const resultMJD = el.querySelector('#jd-result-mjd');
  const resultGreg = el.querySelector('#jd-result-greg');
  const description = el.querySelector('#jd-description');

  let mode = 'greg'; // 'greg' or 'jd'

  // Set default date to today
  const now = new Date();
  dateInput.value = now.toISOString().slice(0, 10);

  function setMode(m) {
    mode = m;
    if (m === 'greg') {
      modeGregBtn.className = 'btn btn-primary';
      modeJDBtn.className = 'btn btn-secondary';
      gregInputs.style.display = '';
      jdInputs.style.display = 'none';
    } else {
      modeGregBtn.className = 'btn btn-secondary';
      modeJDBtn.className = 'btn btn-primary';
      gregInputs.style.display = 'none';
      jdInputs.style.display = '';
    }
    calculate();
  }

  function calculate() {
    if (mode === 'greg') {
      const dateVal = dateInput.value;
      const timeVal = timeInput.value || '12:00:00';
      if (!dateVal) {
        resultsSection.style.display = 'none';
        return;
      }
      const [year, month, day] = dateVal.split('-').map(Number);
      const [hour, minute, second] = timeVal.split(':').map(Number);
      const jd = gregorianToJD(year, month, day, hour || 12, minute || 0, second || 0);
      const mjd = jd - 2400000.5;

      resultJD.textContent = jd.toFixed(5);
      resultMJD.textContent = mjd.toFixed(5);
      resultGreg.textContent = formatGregorian({ year, month, day, hour: hour || 12, minute: minute || 0, second: second || 0 });
      description.textContent = `This corresponds to Julian Day Number ${Math.floor(jd)} with a fractional day of ${(jd % 1).toFixed(5)}.`;
    } else {
      const jdVal = parseFloat(jdInput.value);
      if (isNaN(jdVal)) {
        resultsSection.style.display = 'none';
        return;
      }
      const greg = jdToGregorian(jdVal);
      const mjd = jdVal - 2400000.5;

      resultJD.textContent = jdVal.toFixed(5);
      resultMJD.textContent = mjd.toFixed(5);
      resultGreg.textContent = formatGregorian(greg);
      description.textContent = `JD ${jdVal.toFixed(5)} falls on ${formatGregorian(greg)}.`;
    }
    resultsSection.style.display = '';
  }

  function onNow() {
    const n = new Date();
    dateInput.value = n.toISOString().slice(0, 10);
    const h = pad(n.getUTCHours());
    const m = pad(n.getUTCMinutes());
    const s = pad(n.getUTCSeconds());
    timeInput.value = `${h}:${m}:${s}`;
    calculate();
  }

  modeGregBtn.addEventListener('click', () => setMode('greg'));
  modeJDBtn.addEventListener('click', () => setMode('jd'));
  dateInput.addEventListener('input', calculate);
  timeInput.addEventListener('input', calculate);
  jdInput.addEventListener('input', calculate);
  nowBtn.addEventListener('click', onNow);

  calculate();

  return () => {
    modeGregBtn.removeEventListener('click', () => setMode('greg'));
    modeJDBtn.removeEventListener('click', () => setMode('jd'));
    dateInput.removeEventListener('input', calculate);
    timeInput.removeEventListener('input', calculate);
    jdInput.removeEventListener('input', calculate);
    nowBtn.removeEventListener('click', onNow);
  };
}
