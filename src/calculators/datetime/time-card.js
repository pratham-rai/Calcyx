export const meta = {
  slug: 'time-card',
  name: 'Time Card / Decimal Hours',
  title: 'Time Card / Decimal Hours Calculator - Calcyx',
  description: 'Calculate daily and weekly work hours with decimal conversion. Supports break deduction and overnight shifts.',
  category: 'datetime',
  icon: '🕐',
  keywords: ['time card', 'work hours', 'decimal hours', 'timesheet', 'payroll', 'weekly hours', 'break time'],
  formula: 'Decimal Hours = (End − Start − Break) ÷ 60',
  relatedSlugs: ['time-duration', 'work-days']
};

export function render() {
  const container = document.createElement('div');
  container.className = 'calc-page';
  container.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <div class="calc-icon">🕐</div>
        <h1 class="calc-title">Time Card / Decimal Hours</h1>
        <p class="calc-description">Enter your start time, end time, and break duration for each day. Overnight shifts are automatically detected.</p>
      </div>
      <div class="calc-body">
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;min-width:480px;">
            <thead>
              <tr style="text-align:left;">
                <th style="padding:8px 10px;opacity:0.7;font-weight:600;font-size:0.85rem;">Day</th>
                <th style="padding:8px 10px;opacity:0.7;font-weight:600;font-size:0.85rem;">Start</th>
                <th style="padding:8px 10px;opacity:0.7;font-weight:600;font-size:0.85rem;">End</th>
                <th style="padding:8px 10px;opacity:0.7;font-weight:600;font-size:0.85rem;">Break (min)</th>
                <th style="padding:8px 10px;opacity:0.7;font-weight:600;font-size:0.85rem;">Hours</th>
              </tr>
            </thead>
            <tbody id="tc-rows">
              ${['Monday','Tuesday','Wednesday','Thursday','Friday'].map((day, i) => `
              <tr data-day="${i}">
                <td style="padding:6px 10px;font-weight:600;white-space:nowrap;">${day}</td>
                <td style="padding:4px 6px;">
                  <input type="time" id="tc-start-${i}" class="calc-input" style="min-width:110px;" aria-label="${day} start time">
                </td>
                <td style="padding:4px 6px;">
                  <input type="time" id="tc-end-${i}" class="calc-input" style="min-width:110px;" aria-label="${day} end time">
                </td>
                <td style="padding:4px 6px;">
                  <input type="number" id="tc-break-${i}" class="calc-input" min="0" max="480" step="5" placeholder="0" style="min-width:80px;" aria-label="${day} break minutes">
                </td>
                <td style="padding:4px 10px;">
                  <span id="tc-daily-${i}" style="font-weight:600;white-space:nowrap;">—</span>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="calc-result" id="result">
          <div class="calc-result-grid">
            <div class="calc-result-item">
              <div class="calc-result-label">Weekly Total</div>
              <div class="calc-result-value" id="tc-total-std">—</div>
              <div class="calc-result-detail">HH:MM format</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Decimal Hours</div>
              <div class="calc-result-value" id="tc-total-dec">—</div>
              <div class="calc-result-detail">for payroll</div>
            </div>
          </div>
          <div id="tc-overnight-note" style="display:none;margin-top:12px;font-size:0.85rem;opacity:0.75;text-align:center;">
            🌙 Overnight shift detected on one or more days
          </div>
        </div>
        <div class="calc-formula">
          <h3>How It Works</h3>
          <code>Daily Minutes = End − Start − Break (minutes)</code>
          <p>If the end time is earlier than the start time, an overnight shift is assumed and 24 hours is added. Decimal hours = total minutes ÷ 60. Break duration is subtracted before conversion.</p>
        </div>
      </div>
    </div>
  `;
  return container;
}

export function mount() {
  const days = 5;
  const listeners = [];

  function toMinutes(timeStr) {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  function minsToHHMM(mins) {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  }

  function minsToDecimal(mins) {
    return (mins / 60).toFixed(2);
  }

  function calculate() {
    let totalMins = 0;
    let overnightDetected = false;

    for (let i = 0; i < days; i++) {
      const startEl = document.getElementById(`tc-start-${i}`);
      const endEl = document.getElementById(`tc-end-${i}`);
      const breakEl = document.getElementById(`tc-break-${i}`);
      const dailyEl = document.getElementById(`tc-daily-${i}`);

      const startMins = toMinutes(startEl?.value);
      const endMins = toMinutes(endEl?.value);
      const breakMins = parseFloat(breakEl?.value) || 0;

      if (startMins === null || endMins === null || !startEl.value || !endEl.value) {
        dailyEl.textContent = '—';
        dailyEl.style.color = '';
        continue;
      }

      let diff = endMins - startMins;
      let isOvernight = false;
      if (diff < 0) {
        diff += 24 * 60;
        isOvernight = true;
        overnightDetected = true;
      }

      const workedMins = Math.max(0, diff - breakMins);
      totalMins += workedMins;

      dailyEl.textContent = `${minsToHHMM(workedMins)} (${minsToDecimal(workedMins)}h)`;
      dailyEl.style.color = isOvernight ? '#f59e0b' : '';
    }

    document.getElementById('tc-total-std').textContent = totalMins > 0 ? minsToHHMM(totalMins) : '—';
    document.getElementById('tc-total-dec').textContent = totalMins > 0 ? `${minsToDecimal(totalMins)}h` : '—';
    document.getElementById('tc-overnight-note').style.display = overnightDetected ? 'block' : 'none';
  }

  for (let i = 0; i < days; i++) {
    ['start', 'end', 'break'].forEach(field => {
      const el = document.getElementById(`tc-${field}-${i}`);
      if (el) {
        const handler = () => calculate();
        el.addEventListener('input', handler);
        listeners.push({ el, handler });
      }
    });
  }

  return function cleanup() {
    listeners.forEach(({ el, handler }) => el.removeEventListener('input', handler));
  };
}
