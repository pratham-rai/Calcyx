export const meta = {
  slug: 'vo2max',
  title: 'VO2 Max Estimator',
  description: 'Estimate your maximal oxygen uptake (VO2 Max) from a simple fitness test.',
  category: 'health',
  icon: '🫁',
  relatedSlugs: ['heart-rate', 'bmr'],
};

const TESTS = [
  { id: 'rockport', name: 'Rockport Walk Test (1 mile)' },
  { id: 'cooper', name: 'Cooper Run Test (12 min)' },
  { id: 'hrrest', name: 'Resting Heart Rate Method' },
];

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Test Method</label>
        <select id="vo2-test" class="form-control">
          ${TESTS.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Gender</label>
        <select id="vo2-gender" class="form-control"><option value="male">Male</option><option value="female">Female</option></select>
      </div>
      <div class="form-group">
        <label class="form-label">Age (years)</label>
        <input type="number" id="vo2-age" class="form-control" value="30" min="10" max="90" />
      </div>

      <div id="vo2-rockport-fields">
        <div class="form-group">
          <label class="form-label">Body Weight (kg)</label>
          <input type="number" id="vo2-weight" class="form-control" value="70" min="30" max="250" />
        </div>
        <div class="form-group">
          <label class="form-label">Walk Time (mm:ss)</label>
          <input type="text" id="vo2-walk-time" class="form-control" placeholder="e.g. 15:30" value="15:30" />
        </div>
        <div class="form-group">
          <label class="form-label">Heart Rate at End of Walk (bpm)</label>
          <input type="number" id="vo2-hr-end" class="form-control" value="140" min="60" max="220" />
        </div>
      </div>

      <div id="vo2-cooper-fields" style="display:none;">
        <div class="form-group">
          <label class="form-label">Distance Covered in 12 min (meters)</label>
          <input type="number" id="vo2-distance" class="form-control" value="2400" min="500" max="5000" />
        </div>
      </div>

      <div id="vo2-hrrest-fields" style="display:none;">
        <div class="form-group">
          <label class="form-label">Resting Heart Rate (bpm)</label>
          <input type="number" id="vo2-hr-rest" class="form-control" value="60" min="30" max="120" />
        </div>
        <div class="form-group">
          <label class="form-label">Max Heart Rate (bpm, or 0 to estimate)</label>
          <input type="number" id="vo2-hr-max" class="form-control" value="0" min="0" max="250" />
        </div>
      </div>
    </div>

    <div class="calc-result-section" id="vo2-results" style="display:none;">
      <div class="glass-card" style="padding:1.5rem;text-align:center;margin-bottom:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">Estimated VO2 Max</div>
        <div id="vo2-result-val" style="font-size:3rem;font-weight:800;color:var(--primary-color);"></div>
        <div style="font-size:0.8rem;color:var(--text-secondary);">mL/kg/min</div>
      </div>
      <div class="glass-card" style="padding:1rem;">
        <div id="vo2-rating" style="font-size:1.1rem;font-weight:600;text-align:center;"></div>
        <div id="vo2-desc" style="font-size:0.85rem;color:var(--text-secondary);text-align:center;margin-top:0.5rem;"></div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>About VO2 Max</h3>
      <p><strong>VO2 Max</strong> (maximal oxygen uptake) is the maximum rate at which your body can use oxygen during intense exercise. Higher values = better cardiovascular fitness.</p>
      <p><strong>Rockport:</strong> 132.853 - 0.0769×W - 0.3877×A + 6.315×G - 3.2649×T - 0.1565×HR (G=1 male, 0 female, T in minutes)</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const testSel = el.querySelector('#vo2-test');
  const genderSel = el.querySelector('#vo2-gender');
  const ageInput = el.querySelector('#vo2-age');
  const rockportFields = el.querySelector('#vo2-rockport-fields');
  const cooperFields = el.querySelector('#vo2-cooper-fields');
  const hrRestFields = el.querySelector('#vo2-hrrest-fields');
  const resultsDiv = el.querySelector('#vo2-results');
  const resultVal = el.querySelector('#vo2-result-val');
  const ratingDiv = el.querySelector('#vo2-rating');
  const descDiv = el.querySelector('#vo2-desc');

  const RATINGS = [
    { min: 60, label: '🏆 Superior', desc: 'Elite athlete level. Outstanding cardiovascular fitness.' },
    { min: 52, label: '🥇 Excellent', desc: 'Very high fitness. Well above average.' },
    { min: 44, label: '✅ Good', desc: 'Above average cardiovascular fitness.' },
    { min: 36, label: '👍 Fair', desc: 'Average fitness. Room for improvement with regular cardio.' },
    { min: 0,  label: '⚠️ Poor', desc: 'Below average. Consistent aerobic exercise is recommended.' },
  ];

  function getRating(vo2, gender) {
    // Simplified gender-adjusted thresholds (male baseline)
    const adj = gender === 'female' ? -8 : 0;
    for (const r of RATINGS) {
      if (vo2 >= r.min + adj) return r;
    }
    return RATINGS[RATINGS.length - 1];
  }

  function parseTime(str) {
    const parts = str.split(':').map(Number);
    if (parts.length === 2) return parts[0] + parts[1] / 60;
    return NaN;
  }

  function calculate() {
    const test = testSel.value;
    const gender = genderSel.value;
    const age = parseFloat(ageInput.value) || 30;
    let vo2 = NaN;

    if (test === 'rockport') {
      const weight = parseFloat(el.querySelector('#vo2-weight').value) || 70;
      const walkTimeStr = el.querySelector('#vo2-walk-time').value;
      const hrEnd = parseFloat(el.querySelector('#vo2-hr-end').value) || 140;
      const T = parseTime(walkTimeStr);
      const G = gender === 'male' ? 1 : 0;
      const W = weight * 2.205; // lbs
      if (!isNaN(T)) {
        vo2 = 132.853 - 0.0769 * W - 0.3877 * age + 6.315 * G - 3.2649 * T - 0.1565 * hrEnd;
      }
    } else if (test === 'cooper') {
      const d = parseFloat(el.querySelector('#vo2-distance').value) || 2400;
      vo2 = (d - 504.9) / 44.73;
    } else if (test === 'hrrest') {
      const hrRest = parseFloat(el.querySelector('#vo2-hr-rest').value) || 60;
      let hrMax = parseFloat(el.querySelector('#vo2-hr-max').value) || 0;
      if (!hrMax) hrMax = 220 - age;
      vo2 = 15 * (hrMax / hrRest);
    }

    if (isNaN(vo2) || vo2 <= 0) { resultsDiv.style.display = 'none'; return; }
    vo2 = Math.max(10, Math.min(90, vo2));
    const r = getRating(vo2, gender);
    resultVal.textContent = vo2.toFixed(1);
    ratingDiv.textContent = r.label;
    descDiv.textContent = r.desc;
    resultsDiv.style.display = '';
  }

  function updateFields() {
    rockportFields.style.display = testSel.value === 'rockport' ? '' : 'none';
    cooperFields.style.display = testSel.value === 'cooper' ? '' : 'none';
    hrRestFields.style.display = testSel.value === 'hrrest' ? '' : 'none';
    calculate();
  }

  testSel.addEventListener('change', updateFields);
  genderSel.addEventListener('change', calculate);
  ageInput.addEventListener('input', calculate);
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', calculate));

  calculate();

  return () => {
    testSel.removeEventListener('change', updateFields);
    genderSel.removeEventListener('change', calculate);
    ageInput.removeEventListener('input', calculate);
    el.querySelectorAll('input').forEach(i => i.removeEventListener('input', calculate));
  };
}
