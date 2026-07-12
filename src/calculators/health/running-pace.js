export const meta = {
  slug: 'running-pace',
  title: 'Running Pace Calculator',
  description: 'Calculate running pace, speed, finish time, or distance for any race.',
  category: 'health',
  icon: '🏃',
  relatedSlugs: ['calorie-burned', 'heart-rate'],
};

const DISTANCES = [
  { name: '5K', km: 5 },
  { name: '10K', km: 10 },
  { name: 'Half Marathon', km: 21.0975 },
  { name: 'Marathon', km: 42.195 },
  { name: 'Custom', km: null },
];

function secToHMS(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.round(s % 60);
  return [h, m, sec].map((v, i) => (i === 0 && v === 0 ? null : String(v).padStart(2, '0'))).filter(Boolean).join(':');
}

function hmsTotalSec(h, m, s) {
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
}

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Solve For</label>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <button id="rp-solve-time" class="btn btn-primary" style="flex:1;min-width:100px;">⏱ Finish Time</button>
          <button id="rp-solve-pace" class="btn btn-secondary" style="flex:1;min-width:100px;">🏃 Pace</button>
          <button id="rp-solve-dist" class="btn btn-secondary" style="flex:1;min-width:100px;">📏 Distance</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Distance</label>
        <select id="rp-dist-preset" class="form-control">
          ${DISTANCES.map(d => `<option value="${d.km}">${d.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group" id="rp-custom-dist-group" style="display:none;">
        <label class="form-label">Custom Distance</label>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <input type="number" id="rp-custom-dist" class="form-control" value="10" min="0.1" />
          <select id="rp-dist-unit" class="form-control" style="width:80px;"><option value="km">km</option><option value="mi">mi</option></select>
        </div>
      </div>

      <div id="rp-time-input" class="form-group">
        <label class="form-label">Finish Time (h:mm:ss)</label>
        <div style="display:flex;gap:0.5rem;">
          <input type="number" id="rp-time-h" class="form-control" placeholder="h" min="0" max="24" value="0" style="width:80px;" />
          <input type="number" id="rp-time-m" class="form-control" placeholder="mm" min="0" max="59" value="25" style="width:80px;" />
          <input type="number" id="rp-time-s" class="form-control" placeholder="ss" min="0" max="59" value="0" style="width:80px;" />
        </div>
      </div>

      <div id="rp-pace-input" class="form-group" style="display:none;">
        <label class="form-label">Pace (min:ss per km)</label>
        <div style="display:flex;gap:0.5rem;">
          <input type="number" id="rp-pace-m" class="form-control" placeholder="min" min="1" max="60" value="5" style="width:80px;" />
          <input type="number" id="rp-pace-s" class="form-control" placeholder="ss" min="0" max="59" value="0" style="width:80px;" />
        </div>
      </div>
    </div>

    <div class="calc-result-section" id="rp-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;">
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Finish Time</div>
          <div id="rp-res-time" style="font-size:1.4rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Pace (min/km)</div>
          <div id="rp-res-pace" style="font-size:1.4rem;font-weight:700;color:var(--secondary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Speed (km/h)</div>
          <div id="rp-res-speed" style="font-size:1.4rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
      </div>
      <div id="rp-splits" style="margin-top:1rem;"></div>
    </div>

    <div class="calc-formula">
      <h3>Formulas</h3>
      <p><strong>Finish Time</strong> = Distance × Pace</p>
      <p><strong>Pace</strong> = Finish Time ÷ Distance</p>
      <p><strong>Speed</strong> = 60 ÷ Pace (min/km)</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  let solveFor = 'time';

  const btns = {
    time: el.querySelector('#rp-solve-time'),
    pace: el.querySelector('#rp-solve-pace'),
    dist: el.querySelector('#rp-solve-dist'),
  };

  function setSolve(s) {
    solveFor = s;
    Object.keys(btns).forEach(k => btns[k].className = k === s ? 'btn btn-primary' : 'btn btn-secondary');
    el.querySelector('#rp-time-input').style.display = s !== 'time' ? '' : 'none';
    el.querySelector('#rp-pace-input').style.display = s !== 'pace' ? '' : 'none';
    calculate();
  }

  el.querySelector('#rp-dist-preset').addEventListener('change', function() {
    el.querySelector('#rp-custom-dist-group').style.display = this.value === 'null' ? '' : 'none';
    calculate();
  });

  function getDistKm() {
    const preset = parseFloat(el.querySelector('#rp-dist-preset').value);
    if (!isNaN(preset)) return preset;
    const custom = parseFloat(el.querySelector('#rp-custom-dist').value) || 10;
    const unit = el.querySelector('#rp-dist-unit').value;
    return unit === 'mi' ? custom * 1.60934 : custom;
  }

  function calculate() {
    const dist = getDistKm();
    const timeH = parseFloat(el.querySelector('#rp-time-h').value) || 0;
    const timeM = parseFloat(el.querySelector('#rp-time-m').value) || 0;
    const timeS = parseFloat(el.querySelector('#rp-time-s').value) || 0;
    const paceM = parseFloat(el.querySelector('#rp-pace-m').value) || 5;
    const paceS = parseFloat(el.querySelector('#rp-pace-s').value) || 0;
    const resultsDiv = el.querySelector('#rp-results');

    let totalSec, paceSec, speed;

    if (solveFor === 'time') {
      paceSec = paceM * 60 + paceS;
      totalSec = paceSec * dist;
    } else if (solveFor === 'pace') {
      totalSec = hmsTotalSec(timeH, timeM, timeS);
      if (totalSec <= 0 || dist <= 0) { resultsDiv.style.display = 'none'; return; }
      paceSec = totalSec / dist;
    } else {
      totalSec = hmsTotalSec(timeH, timeM, timeS);
      paceSec = hmsTotalSec(0, paceM, paceS);
      if (paceSec <= 0) { resultsDiv.style.display = 'none'; return; }
    }

    speed = 3600 / paceSec;
    const pMin = Math.floor(paceSec / 60);
    const pSec = Math.round(paceSec % 60);

    el.querySelector('#rp-res-time').textContent = secToHMS(totalSec);
    el.querySelector('#rp-res-pace').textContent = `${pMin}:${String(pSec).padStart(2,'0')}`;
    el.querySelector('#rp-res-speed').textContent = speed.toFixed(2);

    // Splits
    const splits = [];
    for (let i = 1; i <= Math.ceil(dist); i++) {
      const km = Math.min(i, dist);
      const splitSec = km * paceSec;
      splits.push(`<div style="display:flex;justify-content:space-between;padding:0.3rem 0;font-size:0.82rem;border-bottom:1px solid var(--border-color);">
        <span>km ${i}</span><span class="text-mono">${secToHMS(splitSec)}</span></div>`);
      if (i >= 10 && dist > 15) break;
    }
    el.querySelector('#rp-splits').innerHTML = splits.length > 1 ? `<div class="glass-card" style="padding:1rem;"><div style="font-weight:600;margin-bottom:0.5rem;">Splits</div>${splits.join('')}</div>` : '';

    resultsDiv.style.display = '';
  }

  Object.keys(btns).forEach(k => btns[k].addEventListener('click', () => setSolve(k)));
  el.querySelectorAll('input, select').forEach(i => i.addEventListener('input', calculate));

  setSolve('time');

  return () => {
    Object.keys(btns).forEach(k => btns[k].removeEventListener('click', () => setSolve(k)));
    el.querySelectorAll('input, select').forEach(i => i.removeEventListener('input', calculate));
  };
}
