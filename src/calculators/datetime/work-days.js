export const meta = {
  slug: 'work-days',
  name: 'Work Days Calculator',
  title: 'Work Days Calculator - Calcyx',
  description: 'Calculate the total days, weekend days, and net working days between two dates with customizable weekends.',
  category: 'datetime',
  icon: '💼',
  keywords: ['work days', 'business days', 'working days', 'exclude weekends', 'date difference'],
  formula: 'Working Days = Total Days − Weekend Days',
  relatedSlugs: ['days-between', 'age']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  // Get local today and 30 days later
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const today = `${y}-${m}-${day}`;

  const d30 = new Date(d);
  d30.setDate(d30.getDate() + 30);
  const future30 = `${d30.getFullYear()}-${String(d30.getMonth() + 1).padStart(2, '0')}-${String(d30.getDate()).padStart(2, '0')}`;

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="start-date">Start Date</label>
            <input type="date" id="start-date" class="calc-input" value="${today}">
          </div>
          <div class="calc-input-group">
            <label for="end-date">End Date</label>
            <input type="date" id="end-date" class="calc-input" value="${future30}">
          </div>
        </div>

        <div class="calc-input-group">
          <label>Select Weekend Days</label>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px; margin-top: 8px;">
            <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;">
              <input type="checkbox" id="wknd-0" value="0" checked> Sun
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;">
              <input type="checkbox" id="wknd-1" value="1"> Mon
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;">
              <input type="checkbox" id="wknd-2" value="2"> Tue
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;">
              <input type="checkbox" id="wknd-3" value="3"> Wed
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;">
              <input type="checkbox" id="wknd-4" value="4"> Thu
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;">
              <input type="checkbox" id="wknd-5" value="5"> Fri
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-weight: normal; cursor: pointer;">
              <input type="checkbox" id="wknd-6" value="6" checked> Sat
            </label>
          </div>
        </div>

        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="net-working-days"></div>
          <div class="calc-result-label">Net Working Days</div>

          <div class="calc-result-grid" style="margin-top: 16px;">
            <div class="calc-result-item">
              <div class="calc-result-value" id="total-days"></div>
              <div class="calc-result-label">Total Days</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-value" id="weekend-days"></div>
              <div class="calc-result-label">Weekend Days</div>
            </div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Working Days = Total Days − Weekend Days</code>
        <p>Computes the total number of calendar days between the selected start and end dates (inclusive of both dates) and subtracts the count of selected weekend days falling within that date range.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const startInput = document.getElementById('start-date');
  const endInput = document.getElementById('end-date');
  const resultDiv = document.getElementById('result');
  const workingDaysEl = document.getElementById('net-working-days');
  const totalDaysEl = document.getElementById('total-days');
  const weekendDaysEl = document.getElementById('weekend-days');

  const checkboxes = [];
  for (let i = 0; i <= 6; i++) {
    checkboxes.push(document.getElementById(`wknd-${i}`));
  }

  function calculate() {
    const startVal = startInput.value;
    const endVal = endInput.value;

    if (!startVal || !endVal) {
      resultDiv.style.display = 'none';
      return;
    }

    const start = new Date(startVal + 'T00:00:00');
    const end = new Date(endVal + 'T00:00:00');

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    const earlier = start <= end ? start : end;
    const later = start <= end ? end : start;

    let totalDays = 0;
    let weekendDays = 0;
    let workDays = 0;

    const weekendSet = new Set();
    checkboxes.forEach(cb => {
      if (cb && cb.checked) {
        weekendSet.add(parseInt(cb.value, 10));
      }
    });

    const cursor = new Date(earlier);
    while (cursor <= later) {
      totalDays++;
      const dayOfWeek = cursor.getDay();
      if (weekendSet.has(dayOfWeek)) {
        weekendDays++;
      } else {
        workDays++;
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    workingDaysEl.textContent = workDays.toLocaleString();
    totalDaysEl.textContent = totalDays.toLocaleString();
    weekendDaysEl.textContent = weekendDays.toLocaleString();

    resultDiv.style.display = '';
  }

  const inputs = [startInput, endInput];
  inputs.forEach(input => input.addEventListener('input', calculate));
  checkboxes.forEach(cb => cb.addEventListener('change', calculate));

  calculate();

  return () => {
    inputs.forEach(input => input.removeEventListener('input', calculate));
    checkboxes.forEach(cb => cb.removeEventListener('change', calculate));
  };
}
