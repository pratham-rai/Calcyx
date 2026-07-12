export const meta = {
  slug: 'period-tracker',
  name: 'Period Tracker & Cycle',
  title: 'Period Tracker & Cycle - Calcyx',
  description: 'Track and predict your menstrual cycles, estimated period dates, ovulation, and fertile windows for the next 6 months.',
  category: 'health',
  icon: '📅',
  keywords: ['period tracker', 'menstrual cycle predictor', 'fertility window', 'ovulation date', 'period log', 'cycle calendar'],
  formula: 'Next Period = LMP + Cycle Length; Ovulation = Next Period - 14 days; Fertile Window = Ovulation - 5 to + 1 days',
  relatedSlugs: ['pregnancy', 'ovulation']
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
        <div class="calc-input-group">
          <label for="pt-date">Start Day of Last Period</label>
          <input type="date" id="pt-date" class="calc-input" value="${today}">
        </div>

        <div class="calc-input-group">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <label for="pt-cycle">Average Cycle Length</label>
            <span id="pt-cycle-val" style="font-weight: 600; opacity: 0.9;">28 days</span>
          </div>
          <input type="range" id="pt-cycle" min="21" max="45" value="28" class="calc-input" style="padding: 0; background: transparent; cursor: pointer;">
        </div>

        <div class="calc-input-group">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <label for="pt-duration">Period Duration (Bleeding Days)</label>
            <span id="pt-duration-val" style="font-weight: 600; opacity: 0.9;">5 days</span>
          </div>
          <input type="range" id="pt-duration" min="2" max="10" value="5" class="calc-input" style="padding: 0; background: transparent; cursor: pointer;">
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <h3 style="text-align: left; margin-bottom: 1rem; font-size: 1.1rem; font-weight: 600; opacity: 0.9;">Predictions for Next 6 Periods</h3>
        <div id="pt-predictions-list" style="display: flex; flex-direction: column; gap: 0.75rem; text-align: left;">
          <!-- Predictive period list cards will be rendered here dynamically -->
        </div>
      </div>

      <div class="calc-formula">
        <h3>📅 Prediction Methodology</h3>
        <code>Cycle Start = LMP + (Cycle Length × n)</code>
        <code>Fertile Window = Ovulation - 5 days to Ovulation + 1 day</code>
        <p>Your period predictor uses the standard calendar method. <strong>Ovulation</strong> is estimated to occur 14 days before your next period begins. The <strong>fertile window</strong> is the 6-day interval that ends on the day after ovulation, reflecting the lifespan of both sperm (up to 5 days) and egg (up to 24 hours).</p>
        <p>Please note that biological cycles can vary, and this calculator provides estimates. It should not be used as a primary method of contraception.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const dateInput = document.getElementById('pt-date');
  const cycleInput = document.getElementById('pt-cycle');
  const durationInput = document.getElementById('pt-duration');
  
  const cycleValSpan = document.getElementById('pt-cycle-val');
  const durationValSpan = document.getElementById('pt-duration-val');
  const resultDiv = document.getElementById('result');
  const listContainer = document.getElementById('pt-predictions-list');

  function addDays(date, days) {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() + days);
    return d;
  }

  function calculate() {
    const dateVal = dateInput.value;
    const cycleLength = parseInt(cycleInput.value);
    const periodDuration = parseInt(durationInput.value);

    // Update slider value displays
    cycleValSpan.textContent = `${cycleLength} days`;
    durationValSpan.textContent = `${periodDuration} days`;

    if (!dateVal || isNaN(cycleLength) || isNaN(periodDuration)) {
      resultDiv.style.display = 'none';
      return;
    }

    const lmp = new Date(dateVal + 'T00:00:00');
    if (isNaN(lmp.getTime())) {
      resultDiv.style.display = 'none';
      return;
    }

    listContainer.innerHTML = '';

    const shortOpt = { month: 'short', day: 'numeric' };
    const yearOpt = { month: 'short', day: 'numeric', year: 'numeric' };

    for (let i = 0; i < 6; i++) {
      // Start of next cycle
      const periodStart = addDays(lmp, (i + 1) * cycleLength);
      const periodEnd = addDays(periodStart, periodDuration - 1);
      
      // Ovulation occurs 14 days before the following period
      const nextPeriodStart = addDays(periodStart, cycleLength);
      const ovulation = addDays(nextPeriodStart, -14);
      
      const fertileStart = addDays(ovulation, -5);
      const fertileEnd = addDays(ovulation, 1);

      // Create list item card
      const card = document.createElement('div');
      card.style.background = 'rgba(255, 255, 255, 0.03)';
      card.style.border = '1px solid rgba(255, 255, 255, 0.08)';
      card.style.borderRadius = '12px';
      card.style.padding = '1rem';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '0.75rem';

      // Heading row
      const headRow = document.createElement('div');
      headRow.style.display = 'flex';
      headRow.style.justifyContent = 'space-between';
      headRow.style.alignItems = 'center';
      headRow.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
      headRow.style.paddingBottom = '0.5rem';

      // Highlight the very next period
      const isNext = i === 0;
      headRow.innerHTML = `
        <span style="font-weight: 700; color: ${isNext ? '#f472b6' : 'rgba(255,255,255,0.85)'};">
          ${isNext ? '🌟 Cycle 1 (Next Period)' : `Cycle ${i + 1}`}
        </span>
        <span style="font-size: 0.8rem; opacity: 0.65; background: rgba(255,255,255,0.06); padding: 0.2rem 0.5rem; border-radius: 20px;">
          ${periodStart.getFullYear()}
        </span>
      `;
      card.appendChild(headRow);

      // Body grid
      const grid = document.createElement('div');
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = '1fr 1fr';
      grid.style.gap = '1rem';

      // Period dates
      const periodCol = document.createElement('div');
      periodCol.innerHTML = `
        <div style="font-size: 0.75rem; opacity: 0.5; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.5px;">Period Dates</div>
        <div style="font-weight: 600; font-size: 0.95rem;">
          ${periodStart.toLocaleDateString(undefined, shortOpt)} – ${periodEnd.toLocaleDateString(undefined, shortOpt)}
        </div>
      `;
      grid.appendChild(periodCol);

      // Fertile window
      const fertileCol = document.createElement('div');
      fertileCol.innerHTML = `
        <div style="font-size: 0.75rem; opacity: 0.5; margin-bottom: 0.2rem; text-transform: uppercase; letter-spacing: 0.5px;">Fertile Window</div>
        <div style="font-weight: 600; font-size: 0.95rem; color: #fb7185;">
          ${fertileStart.toLocaleDateString(undefined, shortOpt)} – ${fertileEnd.toLocaleDateString(undefined, shortOpt)}
        </div>
      `;
      grid.appendChild(fertileCol);

      card.appendChild(grid);

      // Detail footer showing ovulation
      const footer = document.createElement('div');
      footer.style.fontSize = '0.8rem';
      footer.style.opacity = '0.7';
      footer.style.background = 'rgba(251, 113, 133, 0.05)';
      footer.style.padding = '0.4rem 0.75rem';
      footer.style.borderRadius = '6px';
      footer.style.display = 'flex';
      footer.style.justifyContent = 'space-between';
      footer.innerHTML = `
        <span>Estimated Ovulation:</span>
        <span style="font-weight: 600;">${ovulation.toLocaleDateString(undefined, yearOpt)}</span>
      `;
      card.appendChild(footer);

      listContainer.appendChild(card);
    }

    resultDiv.style.display = '';
  }

  const handlers = [
    [dateInput, 'input', calculate],
    [cycleInput, 'input', calculate],
    [durationInput, 'input', calculate]
  ];

  handlers.forEach(([el, evt, fn]) => el.addEventListener(evt, fn));

  // Run initial calculation
  calculate();

  return () => {
    handlers.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  };
}
