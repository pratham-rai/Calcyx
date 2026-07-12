export const meta = {
  slug: 'sleep-cycle',
  title: 'Sleep Cycle Calculator',
  description: 'Calculate optimal wake-up or bedtimes based on 90-minute sleep cycles.',
  category: 'health',
  icon: '😴',
  relatedSlugs: ['bmr', 'heart-rate'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group" style="margin-bottom:1rem;">
        <label class="form-label">Mode</label>
        <div style="display:flex;gap:0.5rem;">
          <button id="sc-mode-wake" class="btn btn-primary" style="flex:1;">⏰ I want to wake at...</button>
          <button id="sc-mode-sleep" class="btn btn-secondary" style="flex:1;">🛏 I'm going to sleep at...</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" id="sc-time-label">Wake-up Time</label>
        <input type="time" id="sc-time" class="form-control" />
      </div>
      <div class="form-group">
        <label class="form-label">Time to fall asleep (minutes)</label>
        <input type="number" id="sc-latency" class="form-control" value="14" min="0" max="60" />
      </div>
    </div>
    <div class="calc-result-section" id="sc-results" style="display:none;">
      <p id="sc-intro" style="color:var(--text-secondary);margin-bottom:1rem;font-size:0.9rem;"></p>
      <div id="sc-times" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:0.75rem;"></div>
    </div>
    <div class="calc-formula">
      <h3>How Sleep Cycles Work</h3>
      <p>A full sleep cycle lasts approximately <strong>90 minutes</strong> and cycles through light sleep, deep sleep, and REM. Waking at the end of a cycle leaves you feeling more refreshed. This calculator suggests times for <strong>5–6 complete cycles</strong> (7.5–9 hours).</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const modeWakeBtn = el.querySelector('#sc-mode-wake');
  const modeSleepBtn = el.querySelector('#sc-mode-sleep');
  const timeInput = el.querySelector('#sc-time');
  const latencyInput = el.querySelector('#sc-latency');
  const resultsDiv = el.querySelector('#sc-results');
  const timesDiv = el.querySelector('#sc-times');
  const introP = el.querySelector('#sc-intro');
  const timeLabel = el.querySelector('#sc-time-label');

  let mode = 'wake';

  // default to now
  const now = new Date();
  timeInput.value = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  function setMode(m) {
    mode = m;
    if (m === 'wake') {
      modeWakeBtn.className = 'btn btn-primary';
      modeSleepBtn.className = 'btn btn-secondary';
      timeLabel.textContent = 'Wake-up Time';
    } else {
      modeWakeBtn.className = 'btn btn-secondary';
      modeSleepBtn.className = 'btn btn-primary';
      timeLabel.textContent = 'Bedtime';
    }
    calculate();
  }

  function fmtTime(totalMins) {
    let h = Math.floor(((totalMins % 1440) + 1440) / 60 % 24);
    let m = ((totalMins % 60) + 60) % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
  }

  function timeToMins(val) {
    const [h, m] = val.split(':').map(Number);
    return h * 60 + m;
  }

  function calculate() {
    if (!timeInput.value) { resultsDiv.style.display = 'none'; return; }
    const baseMin = timeToMins(timeInput.value);
    const latency = parseInt(latencyInput.value) || 14;
    const cycles = [3, 4, 5, 6];
    const cycleMin = 90;

    timesDiv.innerHTML = '';
    if (mode === 'wake') {
      introP.textContent = `To wake at ${fmtTime(baseMin)}, go to sleep at:`;
      cycles.forEach(c => {
        const sleepTime = baseMin - c * cycleMin - latency;
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.cssText = 'padding:1rem;text-align:center;';
        card.innerHTML = `<div style="font-size:1.4rem;font-weight:700;color:var(--primary-color);">${fmtTime(sleepTime)}</div><div style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.25rem;">${c} cycles · ${c * 1.5}h sleep</div>`;
        timesDiv.appendChild(card);
      });
    } else {
      introP.textContent = `If you sleep at ${fmtTime(baseMin)}, wake up at:`;
      cycles.forEach(c => {
        const wakeTime = baseMin + latency + c * cycleMin;
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.cssText = 'padding:1rem;text-align:center;';
        card.innerHTML = `<div style="font-size:1.4rem;font-weight:700;color:var(--primary-color);">${fmtTime(wakeTime)}</div><div style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.25rem;">${c} cycles · ${c * 1.5}h sleep</div>`;
        timesDiv.appendChild(card);
      });
    }
    resultsDiv.style.display = '';
  }

  modeWakeBtn.addEventListener('click', () => setMode('wake'));
  modeSleepBtn.addEventListener('click', () => setMode('sleep'));
  timeInput.addEventListener('input', calculate);
  latencyInput.addEventListener('input', calculate);

  calculate();

  return () => {
    modeWakeBtn.removeEventListener('click', () => setMode('wake'));
    modeSleepBtn.removeEventListener('click', () => setMode('sleep'));
    timeInput.removeEventListener('input', calculate);
    latencyInput.removeEventListener('input', calculate);
  };
}
