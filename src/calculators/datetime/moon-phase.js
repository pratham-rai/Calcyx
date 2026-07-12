export const meta = {
  slug: 'moon-phase',
  name: 'Moon Phase Calculator',
  title: 'Moon Phase Calculator - Calcyx',
  description: "Determine the moon's current phase, illumination level, and age in the lunar cycle for any calendar date.",
  category: 'datetime',
  icon: '🌙',
  keywords: ['moon phase', 'lunar cycle', 'moon illumination', 'full moon', 'new moon', 'astronomy'],
  formula: 'Lunar Age = (Date − Reference New Moon) mod 29.53059 days',
  relatedSlugs: ['sunrise-sunset', 'day-of-year']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  
  const today = new Date().toISOString().split('T')[0];
  
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
            <label for="target-date">Select Date</label>
            <input type="date" id="target-date" class="calc-input" value="${today}">
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="phase-display"></div>
          <div class="calc-result-label" id="phase-name-label">Moon Phase</div>
          <div class="calc-result-grid" id="details-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Lunar Cycle = 29.53059 Days</code>
        <p>A synodic month (the time between successive new moons) lasts approximately 29.53 days. Using a known astronomical reference point (a New Moon on January 6, 2000), we calculate the fractional days elapsed. The illumination is computed as a cosine function of the lunar age.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const dateInput = document.getElementById('target-date');
  const resultDiv = document.getElementById('result');
  const phaseDisplay = document.getElementById('phase-display');
  const phaseNameLabel = document.getElementById('phase-name-label');
  const detailsGrid = document.getElementById('details-grid');

  function calculate() {
    const dateVal = dateInput.value;
    if (!dateVal) {
      resultDiv.style.display = 'none';
      return;
    }

    const userDate = new Date(dateVal + 'T12:00:00');
    if (isNaN(userDate.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    // Ref New Moon: Jan 6, 2000 at 18:14 UTC
    const refTime = Date.UTC(2000, 0, 6, 18, 14, 0);
    const userTime = userDate.getTime();
    const cycle = 29.530588853;
    
    const diffMs = userTime - refTime;
    const diffDays = diffMs / (24 * 60 * 60 * 1000);
    
    let age = diffDays % cycle;
    if (age < 0) {
      age += cycle;
    }

    const phaseVal = age / cycle;
    const illumination = (1 - Math.cos(phaseVal * 2 * Math.PI)) / 2 * 100;

    let phaseName = '';
    let phaseEmoji = '';

    if (age < 1.0 || age >= 28.53) {
      phaseName = 'New Moon';
      phaseEmoji = '🌑';
    } else if (age >= 1.0 && age < 6.38) {
      phaseName = 'Waxing Crescent';
      phaseEmoji = '🌒';
    } else if (age >= 6.38 && age < 8.38) {
      phaseName = 'First Quarter';
      phaseEmoji = '🌓';
    } else if (age >= 8.38 && age < 13.77) {
      phaseName = 'Waxing Gibbous';
      phaseEmoji = '🌔';
    } else if (age >= 13.77 && age < 15.77) {
      phaseName = 'Full Moon';
      phaseEmoji = '🌕';
    } else if (age >= 15.77 && age < 21.15) {
      phaseName = 'Waning Gibbous';
      phaseEmoji = '🌖';
    } else if (age >= 21.15 && age < 23.15) {
      phaseName = 'Last Quarter';
      phaseEmoji = '🌗';
    } else { // age >= 23.15 && age < 28.53
      phaseName = 'Waning Crescent';
      phaseEmoji = '🌘';
    }

    // Next New Moon and Full Moon Dates
    const daysToNewMoon = cycle - age;
    const nextNewMoonDate = new Date(userDate.getTime() + daysToNewMoon * 24 * 60 * 60 * 1000);

    let daysToFullMoon = (cycle / 2) - age;
    if (daysToFullMoon < 0) {
      daysToFullMoon += cycle;
    }
    const nextFullMoonDate = new Date(userDate.getTime() + daysToFullMoon * 24 * 60 * 60 * 1000);

    const formatDateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedNewMoon = nextNewMoonDate.toLocaleDateString(undefined, formatDateOptions);
    const formattedFullMoon = nextFullMoonDate.toLocaleDateString(undefined, formatDateOptions);

    phaseDisplay.innerHTML = `${phaseEmoji} <span style="font-size: 0.9em;">${phaseName}</span>`;
    phaseNameLabel.textContent = `Age of Cycle: ${age.toFixed(2)} days`;

    detailsGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">${illumination.toFixed(1)}%</div>
        <div class="calc-result-label">Illumination</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${(phaseVal * 100).toFixed(1)}%</div>
        <div class="calc-result-label">Cycle Progress</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value" style="font-size: 0.95rem; line-height: 1.4;">${formattedNewMoon}</div>
        <div class="calc-result-label">Next New Moon</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value" style="font-size: 0.95rem; line-height: 1.4;">${formattedFullMoon}</div>
        <div class="calc-result-label">Next Full Moon</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  dateInput.addEventListener('input', calculate);

  // Initial calculation
  calculate();

  return () => {
    dateInput.removeEventListener('input', calculate);
  };
}
