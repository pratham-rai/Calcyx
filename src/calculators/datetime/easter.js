export const meta = {
  slug: 'easter',
  name: 'Easter Calculator',
  title: 'Easter Calculator - Calcyx',
  description: 'Calculate the Gregorian (Western) and Orthodox (Eastern) Easter dates for any year.',
  category: 'datetime',
  icon: '🥚',
  keywords: ['easter', 'orthodox easter', 'gregorian easter', 'computus', 'paschal full moon', 'holiday'],
  formula: 'Meeus/Jones/Butcher Computus Algorithms',
  relatedSlugs: ['days-between', 'add-subtract-days']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const currentYear = new Date().getFullYear();

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="year">Enter Year (1583 - 4099)</label>
          <input type="number" id="year" class="calc-input" value="${currentYear}" placeholder="e.g. ${currentYear}" min="1583" max="4099" step="1">
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-grid">
            <div class="calc-result-item">
              <div class="calc-result-label">Western (Gregorian) Easter</div>
              <div class="calc-result-value" id="western-easter-display" style="font-size: 1.4rem; margin: 10px 0;"></div>
              <div class="calc-result-detail">Used by Roman Catholic & Protestant churches.</div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Eastern (Orthodox) Easter</div>
              <div class="calc-result-value" id="eastern-easter-display" style="font-size: 1.4rem; margin: 10px 0;"></div>
              <div class="calc-result-detail">Used by Eastern Orthodox churches.</div>
            </div>
          </div>
          <div class="calc-result-detail" id="easter-difference" style="margin-top: 20px; font-weight: 500; font-size: 1.1rem; text-align: center;"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <p>Easter is a movable feast, meaning its date changes every year. It is calculated as the first Sunday after the first full moon (the Paschal Full Moon) that occurs on or after the vernal equinox (scientifically March 20, but fixed ecclesiastically on March 21).</p>
        <p><strong>Western Easter</strong> is calculated using the Gregorian calendar. We use the Meeus/Jones/Butcher algorithm, which is valid for any year from 1583 onwards.</p>
        <p><strong>Eastern Orthodox Easter</strong> is calculated using the Julian calendar for the astronomical dates, and is then converted to the Gregorian calendar date. This creates a shift due to the 13-day lag of the Julian calendar in the 20th/21st centuries.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const yearInput = document.getElementById('year');
  const resultDiv = document.getElementById('result');
  const westernEasterDisplay = document.getElementById('western-easter-display');
  const easternEasterDisplay = document.getElementById('eastern-easter-display');
  const easterDifference = document.getElementById('easter-difference');

  function getGregorianEaster(Y) {
    const a = Y % 19;
    const b = Math.floor(Y / 100);
    const c = Y % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const L = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * L) / 451);
    const month = Math.floor((h + L - 7 * m + 114) / 31);
    const day = ((h + L - 7 * m + 114) % 31) + 1;
    return new Date(Y, month - 1, day);
  }

  function getOrthodoxEaster(Y) {
    const a = Y % 19;
    const b = Y % 4;
    const c = Y % 7;
    const d = (19 * a + 15) % 30;
    const e = (2 * b + 4 * c + 6 * d + 6) % 7;
    
    let julianDay = 22 + d + e;
    let julianMonth = 3; // March
    if (julianDay > 31) {
      julianDay -= 31;
      julianMonth = 4; // April
    }
    
    // Julian calendar lags behind Gregorian by:
    const diff = Math.floor(Y / 100) - Math.floor(Y / 400) - 2;
    
    const julianDate = new Date(Y, julianMonth - 1, julianDay);
    return new Date(julianDate.getTime() + diff * 24 * 60 * 60 * 1000);
  }

  function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  function calculate() {
    const yearVal = parseInt(yearInput.value, 10);

    if (isNaN(yearVal) || yearVal < 1583 || yearVal > 4099) {
      resultDiv.style.display = 'none';
      return;
    }

    const westernEaster = getGregorianEaster(yearVal);
    const orthodoxEaster = getOrthodoxEaster(yearVal);

    westernEasterDisplay.textContent = formatDate(westernEaster);
    easternEasterDisplay.textContent = formatDate(orthodoxEaster);

    const diffMs = orthodoxEaster.getTime() - westernEaster.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      easterDifference.textContent = '⛪ Both Western and Eastern Easter coincide on the same day this year!';
    } else {
      const weeksStr = diffDays === 7 ? '1 week' : `${diffDays / 7} weeks`;
      easterDifference.textContent = `📅 Orthodox Easter is ${weeksStr} (${diffDays} days) after Western Easter.`;
    }

    resultDiv.style.display = '';
  }

  yearInput.addEventListener('input', calculate);

  // Initial calculation
  calculate();

  return () => {
    yearInput.removeEventListener('input', calculate);
  };
}
