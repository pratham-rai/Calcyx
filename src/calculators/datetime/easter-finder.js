export const meta = {
  slug: 'easter-finder',
  name: 'Easter & Holidays Finder',
  title: 'Easter & Holidays Finder - Calcyx',
  description: 'Find the dates of Easter Sunday and related holidays (Good Friday, Easter Monday, Ascension, and Pentecost) for any Gregorian year.',
  category: 'datetime',
  icon: '🕊️',
  keywords: ['easter date', 'good friday', 'easter monday', 'ascension day', 'pentecost', 'holiday finder', 'church calendar', 'computus'],
  formula: 'Meeus/Jones/Butcher Gregorian Easter Algorithm',
  relatedSlugs: ['leap-year', 'dob-details']
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
          <label for="year">Enter Year (1583 or later)</label>
          <input type="number" id="year" class="calc-input" value="${currentYear}" placeholder="e.g. ${currentYear}" min="1583" step="1">
        </div>
        
        <div id="result" class="calc-result" style="display:none; margin-top: 25px;">
          <!-- Primary Highlight Result: Easter Sunday -->
          <div style="text-align: center; margin-bottom: 25px; padding: 20px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
            <div class="calc-result-label" style="font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">Easter Sunday</div>
            <div class="calc-result-value" id="easter-sunday-display" style="font-size: 2.2rem; color: #10B981; margin: 10px 0;"></div>
            <div class="calc-result-detail" id="easter-days-diff"></div>
          </div>
          
          <div class="calc-result-grid">
            <div class="calc-result-item">
              <div class="calc-result-label">Good Friday</div>
              <div class="calc-result-value" id="good-friday-display" style="font-size: 1.2rem; margin-top: 5px; color: #EAB308;"></div>
              <div class="calc-result-detail">Easter Sunday − 2 days</div>
            </div>
            
            <div class="calc-result-item">
              <div class="calc-result-label">Easter Monday</div>
              <div class="calc-result-value" id="easter-monday-display" style="font-size: 1.2rem; margin-top: 5px; color: #3B82F6;"></div>
              <div class="calc-result-detail">Easter Sunday + 1 day</div>
            </div>
            
            <div class="calc-result-item">
              <div class="calc-result-label">Ascension Day</div>
              <div class="calc-result-value" id="ascension-display" style="font-size: 1.2rem; margin-top: 5px; color: #A855F7;"></div>
              <div class="calc-result-detail">Easter Sunday + 39 days</div>
            </div>
            
            <div class="calc-result-item">
              <div class="calc-result-label">Pentecost (Whitsun)</div>
              <div class="calc-result-value" id="pentecost-display" style="font-size: 1.2rem; margin-top: 5px; color: #F43F5E;"></div>
              <div class="calc-result-detail">Easter Sunday + 49 days</div>
            </div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How Christian Holidays are Calculated</h3>
        <p>In Western Christianity, the dates of many major holidays are calculated relative to Easter Sunday (known as the movable feasts of the liturgical year):</p>
        <ul>
          <li><strong>Easter Sunday:</strong> The first Sunday after the Paschal Full Moon (the first full moon occurring on or after March 21). Calculated via the Meeus/Jones/Butcher algorithm.</li>
          <li><strong>Good Friday:</strong> Commemorates the crucifixion of Jesus, occurring exactly 2 days before Easter.</li>
          <li><strong>Easter Monday:</strong> The day after Easter Sunday.</li>
          <li><strong>Ascension Day:</strong> Commemorates the ascension of Jesus into heaven, occurring on a Thursday 39 days (40 days inclusive) after Easter.</li>
          <li><strong>Pentecost:</strong> Commemorates the descent of the Holy Spirit, occurring on a Sunday 49 days (50 days inclusive) after Easter.</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const yearInput = document.getElementById('year');
  const resultDiv = document.getElementById('result');
  
  const easterSundayDisplay = document.getElementById('easter-sunday-display');
  const easterDaysDiff = document.getElementById('easter-days-diff');
  
  const goodFridayDisplay = document.getElementById('good-friday-display');
  const easterMondayDisplay = document.getElementById('easter-monday-display');
  const ascensionDisplay = document.getElementById('ascension-display');
  const pentecostDisplay = document.getElementById('pentecost-display');

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

  function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  function calculate() {
    const yearVal = parseInt(yearInput.value, 10);

    if (isNaN(yearVal) || yearVal < 1583) {
      resultDiv.style.display = 'none';
      return;
    }

    // Compute Easter Sunday
    const easter = getGregorianEaster(yearVal);
    easterSundayDisplay.textContent = formatDate(easter);

    // Compute relative dates
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);

    const easterMonday = new Date(easter);
    easterMonday.setDate(easter.getDate() + 1);

    const ascension = new Date(easter);
    ascension.setDate(easter.getDate() + 39);

    const pentecost = new Date(easter);
    pentecost.setDate(easter.getDate() + 49);

    // Format display elements
    goodFridayDisplay.textContent = formatDate(goodFriday);
    easterMondayDisplay.textContent = formatDate(easterMonday);
    ascensionDisplay.textContent = formatDate(ascension);
    pentecostDisplay.textContent = formatDate(pentecost);

    // Calculate days from current date (for visual context)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const easterMidnight = new Date(easter);
    easterMidnight.setHours(0, 0, 0, 0);

    const diffMs = easterMidnight.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / 86400000);

    if (diffDays === 0) {
      easterDaysDiff.textContent = "Today is Easter Sunday!";
    } else if (diffDays > 0) {
      easterDaysDiff.textContent = `Occurs in ${diffDays.toLocaleString()} days from today`;
    } else {
      easterDaysDiff.textContent = `Occurred ${Math.abs(diffDays).toLocaleString()} days ago`;
    }

    resultDiv.style.display = '';
  }

  yearInput.addEventListener('input', calculate);

  // Initial run
  calculate();

  return () => {
    yearInput.removeEventListener('input', calculate);
  };
}
