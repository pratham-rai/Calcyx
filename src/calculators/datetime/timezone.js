export const meta = {
  slug: 'timezone',
  name: 'Time Zone Converter',
  title: 'Time Zone Converter - Calcyx',
  description: 'Convert date and time between standard time zones including UTC, GMT, EST, PST, IST, CET, and JST.',
  category: 'datetime',
  icon: '🌐',
  keywords: ['timezone converter', 'time zones', 'convert pst to ist', 'est to gmt', 'utc offset', 'world clock'],
  formula: 'Target Time = Source Time + (Target Offset − Source Offset)',
  relatedSlugs: ['countdown', 'days-between']
};

const offsets = {
  UTC: 0,
  GMT: 0,
  EST: -5,
  PST: -8,
  IST: 5.5,
  CET: 1,
  JST: 9
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  // Get local datetime for default input
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const localDateTime = `${y}-${m}-${d}T${hh}:${mm}`;

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="date-time">Select Date & Time</label>
          <input type="datetime-local" id="date-time" class="calc-input" value="${localDateTime}">
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="src-tz">Source Timezone</label>
            <select id="src-tz" class="calc-select">
              <option value="UTC" selected>UTC (GMT+0)</option>
              <option value="GMT">GMT (GMT+0)</option>
              <option value="EST">EST (UTC-5)</option>
              <option value="PST">PST (UTC-8)</option>
              <option value="IST">IST (UTC+5.5)</option>
              <option value="CET">CET (UTC+1)</option>
              <option value="JST">JST (UTC+9)</option>
            </select>
          </div>
          <div class="calc-input-group">
            <label for="tgt-tz">Target Timezone</label>
            <select id="tgt-tz" class="calc-select">
              <option value="UTC">UTC (GMT+0)</option>
              <option value="GMT">GMT (GMT+0)</option>
              <option value="EST">EST (UTC-5)</option>
              <option value="PST">PST (UTC-8)</option>
              <option value="IST" selected>IST (UTC+5.5)</option>
              <option value="CET">CET (UTC+1)</option>
              <option value="JST">JST (UTC+9)</option>
            </select>
          </div>
        </div>

        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="target-time-val"></div>
          <div class="calc-result-label" id="target-timezone-label"></div>
          <div class="calc-result-detail" id="timezone-details" style="margin-top: 8px; font-size: 0.95rem; opacity: 0.85;"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Target Time = Source Time + (Target Offset − Source Offset)</code>
        <p>Converts selected datetime using standard offsets: UTC/GMT (+0), EST (-5), PST (-8), IST (+5.5), CET (+1), JST (+9). This calculation uses standard offsets and does not account for local daylight saving time changes.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const dateTimeInput = document.getElementById('date-time');
  const srcTzSelect = document.getElementById('src-tz');
  const tgtTzSelect = document.getElementById('tgt-tz');

  const resultDiv = document.getElementById('result');
  const targetTimeValEl = document.getElementById('target-time-val');
  const targetTimezoneLabelEl = document.getElementById('target-timezone-label');
  const detailsEl = document.getElementById('timezone-details');

  function calculate() {
    const dtVal = dateTimeInput.value;
    const srcTz = srcTzSelect.value;
    const tgtTz = tgtTzSelect.value;

    if (!dtVal) {
      resultDiv.style.display = 'none';
      return;
    }

    const parts = dtVal.split(/[T:-]/);
    if (parts.length < 5) {
      resultDiv.style.display = 'none';
      return;
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const hour = parseInt(parts[3], 10);
    const minute = parseInt(parts[4], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
      resultDiv.style.display = 'none';
      return;
    }

    const utcDate = new Date(Date.UTC(year, month, day, hour, minute));
    const offsetSrc = offsets[srcTz];
    const offsetTgt = offsets[tgtTz];

    const diffMs = (offsetTgt - offsetSrc) * 60 * 60 * 1000;
    const targetDate = new Date(utcDate.getTime() + diffMs);

    const targetYear = targetDate.getUTCFullYear();
    const targetMonth = targetDate.getUTCMonth();
    const targetDay = targetDate.getUTCDate();
    const targetHour = targetDate.getUTCHours();
    const targetMinute = targetDate.getUTCMinutes();
    const targetDayOfWeek = targetDate.getUTCDay();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const ampm = targetHour >= 12 ? 'PM' : 'AM';
    const dispHour = targetHour % 12 || 12;
    const dispMin = String(targetMinute).padStart(2, '0');

    const formattedTime = `${dispHour}:${dispMin} ${ampm}`;
    const formattedDate = `${dayNames[targetDayOfWeek]}, ${monthNames[targetMonth]} ${targetDay}, ${targetYear}`;

    targetTimeValEl.textContent = formattedTime;
    targetTimezoneLabelEl.textContent = `${formattedDate} (${tgtTz})`;

    const diffHours = offsetTgt - offsetSrc;
    const diffHoursText = diffHours === 0 
      ? 'no time difference' 
      : (diffHours > 0 ? `${diffHours} hours ahead` : `${Math.abs(diffHours)} hours behind`);

    const srcAmpm = hour >= 12 ? 'PM' : 'AM';
    const srcDispHour = hour % 12 || 12;
    const srcDispMin = String(minute).padStart(2, '0');
    const formattedSrcTime = `${srcDispHour}:${srcDispMin} ${srcAmpm}`;

    let relativeDayText = '';
    const startMidnight = new Date(Date.UTC(year, month, day));
    const targetMidnight = new Date(Date.UTC(targetYear, targetMonth, targetDay));
    const dayDiff = Math.round((targetMidnight - startMidnight) / (24 * 60 * 60 * 1000));

    if (dayDiff === 1) {
      relativeDayText = ' (next day)';
    } else if (dayDiff === -1) {
      relativeDayText = ' (previous day)';
    } else if (dayDiff > 1) {
      relativeDayText = ` (+${dayDiff} days)`;
    } else if (dayDiff < -1) {
      relativeDayText = ` (${dayDiff} days)`;
    }

    detailsEl.textContent = `${formattedSrcTime} ${srcTz} is ${formattedTime} ${tgtTz}${relativeDayText} (${diffHoursText})`;

    resultDiv.style.display = '';
  }

  const inputs = [dateTimeInput];
  const selects = [srcTzSelect, tgtTzSelect];

  inputs.forEach(input => input.addEventListener('input', calculate));
  selects.forEach(select => select.addEventListener('change', calculate));

  calculate();

  return () => {
    inputs.forEach(input => input.removeEventListener('input', calculate));
    selects.forEach(select => select.removeEventListener('change', calculate));
  };
}
