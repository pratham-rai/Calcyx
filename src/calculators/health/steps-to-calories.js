export const meta = {
  slug: 'steps-to-calories',
  title: 'Steps to Calories',
  description: 'Convert daily step count to calories burned, distance, and active minutes.',
  category: 'health',
  icon: '👟',
  relatedSlugs: ['calorie-burned', 'water-intake'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Daily Steps</label>
        <input type="number" id="st-steps" class="form-control" value="8000" min="100" max="100000" />
        <div style="margin-top:0.75rem;">
          <input type="range" id="st-slider" min="0" max="30000" value="8000" step="100" style="width:100%;" />
          <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-secondary);">
            <span>0</span><span>10k</span><span>20k</span><span>30k</span>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Body Weight (kg)</label>
          <input type="number" id="st-weight" class="form-control" value="70" min="30" max="250" />
        </div>
        <div class="form-group">
          <label class="form-label">Avg Step Length</label>
          <select id="st-stride" class="form-control">
            <option value="0.67">Average Adult (~67cm)</option>
            <option value="0.58">Short (~58cm)</option>
            <option value="0.76">Tall (~76cm)</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>
      <div class="form-group" id="st-custom-stride" style="display:none;">
        <label class="form-label">Step Length (cm)</label>
        <input type="number" id="st-stride-cm" class="form-control" value="67" min="30" max="130" />
      </div>
    </div>

    <div class="calc-result-section" id="st-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Calories Burned</div>
          <div id="st-calories" style="font-size:2.2rem;font-weight:800;color:var(--primary-color);"></div>
          <div style="font-size:0.75rem;color:var(--text-secondary);">kcal</div>
        </div>
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Distance</div>
          <div id="st-distance" style="font-size:2.2rem;font-weight:800;color:var(--secondary-color);"></div>
          <div style="font-size:0.75rem;color:var(--text-secondary);">km</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Active Minutes</div>
          <div id="st-minutes" style="font-size:1.6rem;font-weight:700;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">vs 10k Goal</div>
          <div id="st-vs-goal" style="font-size:1.6rem;font-weight:700;"></div>
        </div>
      </div>
      <div class="glass-card" style="padding:1rem;">
        <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;font-size:0.85rem;font-weight:600;">
          <span>Step Goal Progress</span><span id="st-pct"></span>
        </div>
        <div style="height:8px;background:var(--bg-secondary,#e2e8f0);border-radius:4px;overflow:hidden;">
          <div id="st-progress-bar" style="height:100%;background:var(--primary-color);border-radius:4px;transition:width 0.3s ease;"></div>
        </div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>How It Works</h3>
      <p><strong>Distance</strong> = Steps × Step Length. <strong>Calories</strong> ≈ MET × weight(kg) × time(h), where MET for brisk walking ≈ 3.5 and speed is derived from step rate.</p>
      <p>Average walking pace is assumed at ~100 steps/minute. The WHO recommends <strong>10,000 steps/day</strong> for general health.</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const stepsInput = el.querySelector('#st-steps');
  const slider = el.querySelector('#st-slider');
  const weightInput = el.querySelector('#st-weight');
  const strideSel = el.querySelector('#st-stride');
  const customStrideGroup = el.querySelector('#st-custom-stride');
  const strideCmInput = el.querySelector('#st-stride-cm');
  const resultsDiv = el.querySelector('#st-results');

  function syncSlider(from) {
    if (from === 'input') slider.value = stepsInput.value;
    else stepsInput.value = slider.value;
    calculate();
  }

  function calculate() {
    const steps = parseFloat(stepsInput.value) || 0;
    const weight = parseFloat(weightInput.value) || 70;
    let strideM = parseFloat(strideSel.value);
    if (strideSel.value === 'custom') strideM = (parseFloat(strideCmInput.value) || 67) / 100;

    const distKm = (steps * strideM) / 1000;
    const minutes = steps / 100; // ~100 steps/min
    const met = 3.5;
    const calories = met * weight * (minutes / 60);

    const goal = 10000;
    const pct = Math.min(100, (steps / goal) * 100);
    const diff = steps - goal;

    el.querySelector('#st-calories').textContent = Math.round(calories);
    el.querySelector('#st-distance').textContent = distKm.toFixed(2);
    el.querySelector('#st-minutes').textContent = Math.round(minutes) + ' min';
    el.querySelector('#st-pct').textContent = pct.toFixed(0) + '%';
    el.querySelector('#st-progress-bar').style.width = pct + '%';

    const vsGoalEl = el.querySelector('#st-vs-goal');
    if (diff >= 0) {
      vsGoalEl.textContent = `+${diff.toLocaleString()} ✅`;
      vsGoalEl.style.color = '#22c55e';
    } else {
      vsGoalEl.textContent = `${diff.toLocaleString()} ⬆️`;
      vsGoalEl.style.color = '#ef4444';
    }

    resultsDiv.style.display = '';
  }

  stepsInput.addEventListener('input', () => syncSlider('input'));
  slider.addEventListener('input', () => syncSlider('slider'));
  weightInput.addEventListener('input', calculate);
  strideSel.addEventListener('change', () => {
    customStrideGroup.style.display = strideSel.value === 'custom' ? '' : 'none';
    calculate();
  });
  strideCmInput.addEventListener('input', calculate);

  calculate();

  return () => {
    stepsInput.removeEventListener('input', () => syncSlider('input'));
    slider.removeEventListener('input', () => syncSlider('slider'));
    weightInput.removeEventListener('input', calculate);
    strideSel.removeEventListener('change', calculate);
    strideCmInput.removeEventListener('input', calculate);
  };
}
