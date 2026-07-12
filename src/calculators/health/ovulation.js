export const meta = {
  slug: 'ovulation',
  name: 'Ovulation & Fertility',
  title: 'Ovulation & Fertility Calculator - Calcyx',
  description: 'Track your menstrual cycle, estimate your next period, and identify your most fertile window and ovulation day.',
  category: 'health',
  icon: '🌸',
  keywords: ['ovulation calculator', 'fertility calendar', 'conception window', 'menstrual cycle tracker', 'fertile days', 'next period'],
  formula: 'Ovulation = LMP + Cycle Length - 14 days; Fertile Window = Ovulation - 5 to + 1 days',
  relatedSlugs: ['pregnancy', 'bmi']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

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
            <label for="ov-date">First Day of Last Period</label>
            <input type="date" id="ov-date" class="calc-input" value="${today}">
          </div>
          <div class="calc-input-group">
            <label for="ov-cycle">Cycle Length (days)</label>
            <input type="number" id="ov-cycle" class="calc-input" value="28" min="20" max="45" step="1">
          </div>
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="ov-fertile-main"></div>
        <div class="calc-result-label">Next Fertile Window</div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Estimated Ovulation Day</div>
            <div class="calc-result-detail" id="ov-day"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Next Period Start</div>
            <div class="calc-result-detail" id="ov-next-period"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Peak Fertility Days</div>
            <div class="calc-result-detail" id="ov-peaks"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Earliest Pregnancy Test</div>
            <div class="calc-result-detail" id="ov-test-date"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>🌸 How it Works</h3>
        <code>Ovulation Day = Last Period + Cycle Length - 14 days</code>
        <code>Fertile Window = Ovulation - 5 days to Ovulation + 1 day</code>
        <p>The fertile window is the time in a woman's cycle when pregnancy is possible. Sperm can live inside the female body for up to 5 days, while an egg survives for about 24 hours after release. The most fertile days are the 2 days leading up to ovulation and the day of ovulation itself.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const dateInput = document.getElementById('ov-date');
  const cycleInput = document.getElementById('ov-cycle');
  const resultDiv = document.getElementById('result');

  function calculate() {
    const dateVal = dateInput.value;
    const cycle = parseInt(cycleInput.value);

    if (!dateVal || !cycle || cycle < 20 || cycle > 45) {
      resultDiv.style.display = 'none';
      return;
    }

    const lmp = new Date(dateVal + 'T00:00:00');
    if (isNaN(lmp.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    // 1. Next Period Start
    const nextPeriod = new Date(lmp.getTime());
    nextPeriod.setDate(nextPeriod.getDate() + cycle);

    // 2. Ovulation Day
    const ovulation = new Date(lmp.getTime());
    ovulation.setDate(ovulation.getDate() + cycle - 14);

    // 3. Fertile Window (Ovulation - 5 days to Ovulation + 1 day)
    const windowStart = new Date(ovulation.getTime());
    windowStart.setDate(windowStart.getDate() - 5);

    const windowEnd = new Date(ovulation.getTime());
    windowEnd.setDate(windowEnd.getDate() + 1);

    // 4. Peak Fertility Days (Ovulation - 2 days to Ovulation)
    const peakStart = new Date(ovulation.getTime());
    peakStart.setDate(peakStart.getDate() - 2);

    // Format results
    const shortOpt = { month: 'short', day: 'numeric' };
    const longOpt = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const fullOpt = { month: 'short', day: 'numeric', year: 'numeric' };

    document.getElementById('ov-fertile-main').textContent = 
      `${windowStart.toLocaleDateString(undefined, shortOpt)} – ${windowEnd.toLocaleDateString(undefined, fullOpt)}`;

    document.getElementById('ov-day').textContent = ovulation.toLocaleDateString(undefined, longOpt);
    document.getElementById('ov-next-period').textContent = nextPeriod.toLocaleDateString(undefined, longOpt);
    
    document.getElementById('ov-peaks').textContent = 
      `${peakStart.toLocaleDateString(undefined, shortOpt)} – ${ovulation.toLocaleDateString(undefined, shortOpt)}`;
      
    document.getElementById('ov-test-date').textContent = nextPeriod.toLocaleDateString(undefined, longOpt);

    resultDiv.style.display = '';
  }

  const handlers = [
    [dateInput, 'input', calculate],
    [cycleInput, 'input', calculate]
  ];

  handlers.forEach(([el, evt, fn]) => el.addEventListener(evt, fn));

  // Run initial calculation
  calculate();

  return () => {
    handlers.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  };
}
