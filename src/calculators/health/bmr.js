export const meta = {
  slug: 'bmr',
  name: 'BMR / Calorie Calculator',
  title: 'BMR & Calorie Calculator - Calcyx',
  description: 'Calculate your Basal Metabolic Rate and daily calorie needs using the Mifflin-St Jeor equation with activity level adjustments.',
  category: 'health',
  icon: '🔥',
  keywords: ['bmr', 'basal metabolic rate', 'calories', 'tdee', 'weight loss', 'weight gain', 'metabolism', 'diet'],
  formula: 'Male: BMR = 10×weight + 6.25×height - 5×age + 5 · Female: BMR = 10×weight + 6.25×height - 5×age - 161',
  relatedSlugs: ['bmi', 'ideal-weight', 'body-fat']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">🔥</span>
        <h1 class="calc-title">BMR / Calorie Calculator</h1>
        <p class="calc-description">Estimate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to plan your caloric intake.</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="bmr-age">Age (years)</label>
            <input type="number" id="bmr-age" class="calc-input" placeholder="25" min="1" max="120" step="1">
          </div>
          <div class="calc-input-group">
            <label for="bmr-gender">Gender</label>
            <select id="bmr-gender" class="calc-select">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="bmr-weight">Weight (kg)</label>
            <input type="number" id="bmr-weight" class="calc-input" placeholder="70" min="1" step="0.1">
          </div>
          <div class="calc-input-group">
            <label for="bmr-height">Height (cm)</label>
            <input type="number" id="bmr-height" class="calc-input" placeholder="175" min="1" step="0.1">
          </div>
        </div>
        <div class="calc-input-group">
          <label for="bmr-activity">Activity Level</label>
          <select id="bmr-activity" class="calc-select">
            <option value="1.2">Sedentary (little or no exercise)</option>
            <option value="1.375">Lightly Active (1–3 days/week)</option>
            <option value="1.55" selected>Moderately Active (3–5 days/week)</option>
            <option value="1.725">Very Active (6–7 days/week)</option>
            <option value="1.9">Extra Active (athlete / physical job)</option>
          </select>
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="bmr-bmr"></div>
        <div class="calc-result-label">Basal Metabolic Rate (kcal/day)</div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">TDEE</div>
            <div class="calc-result-detail" id="bmr-tdee"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Mild Weight Loss (0.25 kg/wk)</div>
            <div class="calc-result-detail" id="bmr-mild-loss"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Weight Loss (0.5 kg/wk)</div>
            <div class="calc-result-detail" id="bmr-loss"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Extreme Loss (1 kg/wk)</div>
            <div class="calc-result-detail" id="bmr-extreme-loss"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Mild Weight Gain (0.25 kg/wk)</div>
            <div class="calc-result-detail" id="bmr-mild-gain"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Weight Gain (0.5 kg/wk)</div>
            <div class="calc-result-detail" id="bmr-gain"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📐 Mifflin-St Jeor Equation</h3>
        <code>Male: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5</code>
        <code>Female: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161</code>
        <p><strong>TDEE</strong> = BMR × Activity Factor. To lose ~0.5 kg/week, create a 500 kcal/day deficit. To gain ~0.5 kg/week, add a 500 kcal/day surplus.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const ageInput = document.getElementById('bmr-age');
  const genderSelect = document.getElementById('bmr-gender');
  const weightInput = document.getElementById('bmr-weight');
  const heightInput = document.getElementById('bmr-height');
  const activitySelect = document.getElementById('bmr-activity');

  function calculate() {
    const age = parseFloat(ageInput.value);
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    const activity = parseFloat(activitySelect.value);
    const gender = genderSelect.value;

    if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) {
      document.getElementById('result').style.display = 'none';
      return;
    }

    const bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * activity;

    document.getElementById('bmr-bmr').textContent = Math.round(bmr).toLocaleString() + ' kcal';
    document.getElementById('bmr-tdee').textContent = Math.round(tdee).toLocaleString() + ' kcal/day';
    document.getElementById('bmr-mild-loss').textContent = Math.round(tdee - 250).toLocaleString() + ' kcal/day';
    document.getElementById('bmr-loss').textContent = Math.round(tdee - 500).toLocaleString() + ' kcal/day';
    document.getElementById('bmr-extreme-loss').textContent = Math.round(tdee - 1000).toLocaleString() + ' kcal/day';
    document.getElementById('bmr-mild-gain').textContent = Math.round(tdee + 250).toLocaleString() + ' kcal/day';
    document.getElementById('bmr-gain').textContent = Math.round(tdee + 500).toLocaleString() + ' kcal/day';
    document.getElementById('result').style.display = '';
  }

  const inputs = [ageInput, weightInput, heightInput];
  const selects = [genderSelect, activitySelect];

  inputs.forEach(el => el.addEventListener('input', calculate));
  selects.forEach(el => el.addEventListener('change', calculate));

  return () => {
    inputs.forEach(el => el.removeEventListener('input', calculate));
    selects.forEach(el => el.removeEventListener('change', calculate));
  };
}
