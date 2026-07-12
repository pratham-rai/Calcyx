export const meta = {
  slug: 'protein-intake',
  title: 'Protein Intake Calculator',
  description: 'Calculate your optimal daily protein intake based on weight, activity level, and fitness goal.',
  category: 'health',
  icon: '🥩',
  relatedSlugs: ['macros', 'bmr'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Body Weight</label>
          <input type="number" id="pi-weight" class="form-control" value="70" min="20" max="300" />
        </div>
        <div class="form-group">
          <label class="form-label">Unit</label>
          <select id="pi-unit" class="form-control"><option value="kg">kg</option><option value="lbs">lbs</option></select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Activity Level</label>
        <select id="pi-activity" class="form-control">
          <option value="0.8">Sedentary (little/no exercise)</option>
          <option value="1.2" selected>Lightly Active (1-3x/week)</option>
          <option value="1.6">Moderately Active (3-5x/week)</option>
          <option value="2.0">Very Active (6-7x/week)</option>
          <option value="2.4">Athlete (2x/day training)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Fitness Goal</label>
        <select id="pi-goal" class="form-control">
          <option value="maintain">Maintain Weight</option>
          <option value="lose">Lose Weight / Cut</option>
          <option value="gain">Gain Muscle / Bulk</option>
          <option value="athlete">Peak Athletic Performance</option>
        </select>
      </div>
    </div>
    <div class="calc-result-section" id="pi-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Minimum</div>
          <div id="pi-min" style="font-size:1.6rem;font-weight:700;color:var(--secondary-color);"></div>
          <div style="font-size:0.7rem;color:var(--text-secondary);">g/day</div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;border:2px solid var(--primary-color);">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Recommended</div>
          <div id="pi-rec" style="font-size:1.8rem;font-weight:800;color:var(--primary-color);"></div>
          <div style="font-size:0.7rem;color:var(--text-secondary);">g/day</div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.75rem;color:var(--text-secondary);">Maximum</div>
          <div id="pi-max" style="font-size:1.6rem;font-weight:700;color:var(--secondary-color);"></div>
          <div style="font-size:0.7rem;color:var(--text-secondary);">g/day</div>
        </div>
      </div>
      <div class="glass-card" style="padding:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">Per kg body weight: <strong id="pi-per-kg"></strong> g/kg/day &nbsp;|&nbsp; Per lb: <strong id="pi-per-lb"></strong> g/lb/day</div>
        <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.5rem;">Protein calories: <strong id="pi-cal"></strong> kcal/day (at recommended intake)</div>
      </div>
      <div id="pi-foods" style="margin-top:1rem;"></div>
    </div>
    <div class="calc-formula">
      <h3>Protein Guidelines</h3>
      <p>Protein needs range from <strong>0.8 g/kg/day</strong> (sedentary adults, RDA) up to <strong>2.2–2.4 g/kg/day</strong> for athletes in intense training. 1 gram of protein provides <strong>4 calories</strong>.</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const weightInput = el.querySelector('#pi-weight');
  const unitSel = el.querySelector('#pi-unit');
  const activitySel = el.querySelector('#pi-activity');
  const goalSel = el.querySelector('#pi-goal');
  const resultsDiv = el.querySelector('#pi-results');

  const FOOD_SOURCES = [
    { name: 'Chicken breast (100g)', protein: 31 },
    { name: 'Eggs (1 large)', protein: 6 },
    { name: 'Greek yogurt (170g)', protein: 17 },
    { name: 'Whey protein (1 scoop)', protein: 25 },
    { name: 'Lentils (100g cooked)', protein: 9 },
    { name: 'Tuna (100g)', protein: 30 },
  ];

  function calculate() {
    let weight = parseFloat(weightInput.value) || 70;
    if (unitSel.value === 'lbs') weight = weight / 2.205;
    const actMult = parseFloat(activitySel.value);
    const goal = goalSel.value;

    let minRatio = 0.8, recRatio = actMult, maxRatio = actMult * 1.3;

    if (goal === 'lose') { recRatio = Math.max(1.6, actMult); maxRatio = 2.2; }
    else if (goal === 'gain') { recRatio = Math.max(1.8, actMult); maxRatio = 2.4; }
    else if (goal === 'athlete') { recRatio = Math.max(2.0, actMult); maxRatio = 2.6; }

    const min = Math.round(weight * minRatio);
    const rec = Math.round(weight * recRatio);
    const max = Math.round(weight * maxRatio);

    el.querySelector('#pi-min').textContent = min;
    el.querySelector('#pi-rec').textContent = rec;
    el.querySelector('#pi-max').textContent = max;
    el.querySelector('#pi-per-kg').textContent = recRatio.toFixed(1);
    el.querySelector('#pi-per-lb').textContent = (recRatio / 2.205).toFixed(2);
    el.querySelector('#pi-cal').textContent = (rec * 4).toLocaleString();

    const foodsDiv = el.querySelector('#pi-foods');
    foodsDiv.innerHTML = `<div class="glass-card" style="padding:1rem;"><div style="font-weight:600;margin-bottom:0.75rem;">🍗 Food Sources to reach ${rec}g</div>
      ${FOOD_SOURCES.map(f => {
        const servings = (rec / f.protein).toFixed(1);
        return `<div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border-color);font-size:0.85rem;">
          <span>${f.name}</span><span class="text-mono" style="color:var(--primary-color);">${servings}x</span></div>`;
      }).join('')}</div>`;

    resultsDiv.style.display = '';
  }

  [weightInput, unitSel, activitySel, goalSel].forEach(i => i.addEventListener('change', calculate));
  [weightInput].forEach(i => i.addEventListener('input', calculate));

  calculate();

  return () => {
    [weightInput, unitSel, activitySel, goalSel].forEach(i => i.removeEventListener('change', calculate));
    [weightInput].forEach(i => i.removeEventListener('input', calculate));
  };
}
