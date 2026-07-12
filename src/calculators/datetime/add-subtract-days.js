export const meta = {
  slug: 'add-subtract-days',
  name: 'Add or Subtract Days',
  title: 'Add or Subtract Days Calculator - Calcyx',
  description: 'Add or subtract days, weeks, months, or years to calculate target dates.',
  category: 'datetime',
  icon: '📅',
  keywords: ['add days', 'subtract days', 'date calculator', 'date offset', 'add time to date'],
  formula: 'Target Date = Start Date ± Duration',
  relatedSlugs: ['days-between', 'age']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  // Get local today in YYYY-MM-DD format
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const today = `${y}-${m}-${day}`;

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
            <label for="direction">Action</label>
            <select id="direction" class="calc-select">
              <option value="add">Add (+)</option>
              <option value="subtract">Subtract (-)</option>
            </select>
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="value">Value</label>
            <input type="number" id="value" class="calc-input" min="0" step="1" value="10">
          </div>
          <div class="calc-input-group">
            <label for="unit">Unit</label>
            <select id="unit" class="calc-select">
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="target-date"></div>
          <div class="calc-result-label" id="target-dayofweek"></div>
          <div class="calc-result-detail" id="summary" style="margin-top: 8px; font-size: 0.95rem; opacity: 0.85;"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Target Date = Start Date ± Duration</code>
        <p>Select a starting date, choose whether to add or subtract, and specify the duration in days, weeks, months, or years. The calculator accounts for leap years and the varying number of days in each month.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const startInput = document.getElementById('start-date');
  const directionSelect = document.getElementById('direction');
  const valueInput = document.getElementById('value');
  const unitSelect = document.getElementById('unit');

  const resultDiv = document.getElementById('result');
  const targetDateEl = document.getElementById('target-date');
  const targetDayOfWeekEl = document.getElementById('target-dayofweek');
  const summaryEl = document.getElementById('summary');

  function calculate() {
    const startVal = startInput.value;
    const direction = directionSelect.value;
    const valueVal = valueInput.value;
    const unit = unitSelect.value;

    if (!startVal || valueVal === '') {
      resultDiv.style.display = 'none';
      return;
    }

    const start = new Date(startVal + 'T00:00:00');
    if (isNaN(start.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    const num = Math.abs(parseInt(valueVal, 10));
    if (isNaN(num)) {
      resultDiv.style.display = 'none';
      return;
    }

    const sign = direction === 'add' ? 1 : -1;
    const date = new Date(start);

    if (unit === 'days') {
      date.setDate(date.getDate() + sign * num);
    } else if (unit === 'weeks') {
      date.setDate(date.getDate() + sign * num * 7);
    } else if (unit === 'months') {
      const originalDay = date.getDate();
      date.setMonth(date.getMonth() + sign * num);
      if (date.getDate() !== originalDay) {
        // Adjust for month-end overflows (e.g. March 31 - 1 month is Feb 28)
        date.setDate(0);
      }
    } else if (unit === 'years') {
      const originalDay = date.getDate();
      const originalMonth = date.getMonth();
      date.setFullYear(date.getFullYear() + sign * num);
      if (date.getMonth() !== originalMonth) {
        // Adjust for leap years (e.g. Feb 29 + 1 year is Feb 28)
        date.setDate(0);
      }
    }

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dayOfWeekOptions = { weekday: 'long' };

    targetDateEl.textContent = date.toLocaleDateString('en-US', dateOptions);
    targetDayOfWeekEl.textContent = date.toLocaleDateString('en-US', dayOfWeekOptions);

    const formatShort = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const signText = direction === 'add' ? 'after' : 'before';
    const unitText = num === 1 ? unit.slice(0, -1) : unit;

    summaryEl.textContent = `${num.toLocaleString()} ${unitText} ${signText} ${formatShort(start)} is ${formatShort(date)}`;
    resultDiv.style.display = '';
  }

  const inputs = [startInput, directionSelect, valueInput, unitSelect];
  inputs.forEach(input => input.addEventListener('input', calculate));

  calculate();

  return () => {
    inputs.forEach(input => input.removeEventListener('input', calculate));
  };
}
