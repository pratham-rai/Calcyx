export const meta = {
  slug: 'leap-year',
  name: 'Leap Year Calculator',
  title: 'Leap Year Calculator - Calcyx',
  description: 'Check if any year is a leap year and view the next 5 upcoming leap years with full rules explanation.',
  category: 'datetime',
  icon: '🗓️',
  keywords: ['leap year', 'calendar', 'year', 'february 29', 'gregorian'],
  formula: '(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)',
  relatedSlugs: ['age', 'year-progress']
};

export function render() {
  const container = document.createElement('div');
  container.className = 'calc-page';
  container.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <div class="calc-icon">🗓️</div>
        <h1 class="calc-title">Leap Year Calculator</h1>
        <p class="calc-description">Find out if a year is a leap year and discover the next upcoming leap years.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="ly-year">Year</label>
          <input type="number" id="ly-year" class="calc-input" placeholder="e.g. 2024" min="1" max="9999" step="1">
        </div>
        <div class="calc-result" id="result">
          <div class="calc-result-item" style="text-align:center;padding:16px 0;">
            <div class="calc-result-value" id="ly-verdict" style="font-size:2.5rem;">—</div>
            <div class="calc-result-label" id="ly-label"></div>
          </div>
          <div id="ly-details" style="display:none;margin-top:16px;">
            <div style="font-size:0.9rem;opacity:0.8;margin-bottom:8px;text-align:center;" id="ly-reason"></div>
            <div style="margin-top:16px;">
              <div style="font-weight:600;margin-bottom:8px;opacity:0.7;font-size:0.85rem;">Next 5 Leap Years</div>
              <div id="ly-next" style="display:flex;flex-wrap:wrap;gap:8px;"></div>
            </div>
          </div>
        </div>
        <div class="calc-formula">
          <h3>Leap Year Rules (Gregorian Calendar)</h3>
          <code>(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)</code>
          <p><strong>Rule 1:</strong> A year divisible by 4 is a leap year.<br>
          <strong>Exception:</strong> Years divisible by 100 are NOT leap years...<br>
          <strong>Exception to exception:</strong> ...unless also divisible by 400 (e.g. 2000 ✅, 1900 ❌).<br>
          Leap years add February 29, keeping the calendar aligned with Earth's orbit (~365.2422 days/year).</p>
        </div>
      </div>
    </div>
  `;
  return container;
}

export function mount() {
  const yearEl = document.getElementById('ly-year');
  const verdictEl = document.getElementById('ly-verdict');
  const labelEl = document.getElementById('ly-label');
  const detailsEl = document.getElementById('ly-details');
  const reasonEl = document.getElementById('ly-reason');
  const nextEl = document.getElementById('ly-next');

  function isLeap(y) {
    return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  }

  function getReason(y) {
    if (y % 400 === 0) return `${y} is divisible by 400 → Leap Year ✅`;
    if (y % 100 === 0) return `${y} is divisible by 100 but not 400 → Not a Leap Year ❌`;
    if (y % 4 === 0) return `${y} is divisible by 4 but not 100 → Leap Year ✅`;
    return `${y} is not divisible by 4 → Not a Leap Year ❌`;
  }

  function getNextLeaps(fromYear, count) {
    const leaps = [];
    let y = fromYear;
    while (leaps.length < count) {
      if (isLeap(y)) leaps.push(y);
      y++;
    }
    return leaps;
  }

  function calculate() {
    const y = parseInt(yearEl.value);
    if (isNaN(y) || y < 1 || y > 9999) {
      verdictEl.textContent = '—';
      labelEl.textContent = '';
      detailsEl.style.display = 'none';
      return;
    }

    const leap = isLeap(y);
    verdictEl.textContent = leap ? '✅ Leap Year' : '❌ Not a Leap Year';
    verdictEl.style.fontSize = '1.8rem';
    labelEl.textContent = leap ? `${y} has 366 days (Feb has 29 days)` : `${y} has 365 days (Feb has 28 days)`;
    reasonEl.textContent = getReason(y);

    const nextStart = leap ? y + 1 : y;
    const nextLeaps = getNextLeaps(nextStart, 5);
    nextEl.innerHTML = nextLeaps.map(ly =>
      `<span style="background:rgba(255,255,255,0.1);border-radius:8px;padding:6px 14px;font-weight:600;">${ly}</span>`
    ).join('');

    detailsEl.style.display = 'block';
  }

  yearEl.addEventListener('input', calculate);

  // Default to current year
  yearEl.value = new Date().getFullYear();
  calculate();

  return function cleanup() {
    yearEl.removeEventListener('input', calculate);
  };
}
