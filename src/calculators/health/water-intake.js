export const meta = {
  slug: 'water-intake',
  name: 'Water Intake Tracker',
  title: 'Water Intake Calculator - Calcyx',
  description: 'Calculate your recommended daily water intake based on weight, activity level, and climate factors.',
  category: 'health',
  icon: '💧',
  keywords: ['water intake calculator', 'daily water needs', 'hydration tracker', 'how much water to drink', 'hydration calculator', 'water target'],
  formula: 'Water (ml) = Weight × 35 + (Exercise Mins / 30) × 350 + Climate Adj',
  relatedSlugs: ['bmi', 'bmr']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

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
            <label for="water-weight">Weight (kg)</label>
            <input type="number" id="water-weight" class="calc-input" value="70" min="1" max="300" step="0.1">
          </div>
          <div class="calc-input-group">
            <label for="water-exercise">Daily Exercise (minutes)</label>
            <input type="number" id="water-exercise" class="calc-input" value="30" min="0" max="480" step="5">
          </div>
        </div>
        <div class="calc-input-group">
          <label for="water-climate">Climate</label>
          <select id="water-climate" class="calc-select">
            <option value="cold">Cold (Less sweating)</option>
            <option value="normal" selected>Normal</option>
            <option value="hot">Hot / Dry (More sweating)</option>
          </select>
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="water-ml"></div>
        <div class="calc-result-label">Recommended Daily Water Intake</div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Liters</div>
            <div class="calc-result-detail" id="water-liters"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Glasses (250 ml)</div>
            <div class="calc-result-detail" id="water-glasses"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">US Fluid Ounces</div>
            <div class="calc-result-detail" id="water-ounces"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>💧 Hydration Formula</h3>
        <code>Base Water (ml) = Weight (kg) × 35</code>
        <code>+ 350 ml per 30 mins of exercise</code>
        <code>+ 500 ml for hot climate / -200 ml for cold climate</code>
        <p>Staying hydrated supports muscle function, energy levels, brain function, and overall body health. Adjust upward if you are pregnant, breastfeeding, or feeling unwell.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const weightInput = document.getElementById('water-weight');
  const exerciseInput = document.getElementById('water-exercise');
  const climateSelect = document.getElementById('water-climate');
  const resultDiv = document.getElementById('result');

  function calculate() {
    const weight = parseFloat(weightInput.value);
    const exercise = parseFloat(exerciseInput.value);
    const climate = climateSelect.value;

    if (isNaN(weight) || weight <= 0 || isNaN(exercise) || exercise < 0) {
      resultDiv.style.display = 'none';
      return;
    }

    let totalMl = weight * 35;
    
    // Add 350ml for every 30 mins of exercise
    totalMl += (exercise / 30) * 350;

    // Climate adjustment
    if (climate === 'hot') {
      totalMl += 500;
    } else if (climate === 'cold') {
      totalMl -= 200;
    }

    // Minimum water intake baseline
    totalMl = Math.max(1000, totalMl);

    const liters = totalMl / 1000;
    const glasses = totalMl / 250;
    const ounces = totalMl * 0.033814;

    document.getElementById('water-ml').textContent = `${Math.round(totalMl).toLocaleString()} ml`;
    document.getElementById('water-liters').textContent = `${liters.toFixed(2)} L`;
    document.getElementById('water-glasses').textContent = `${glasses.toFixed(1)} glasses`;
    document.getElementById('water-ounces').textContent = `${ounces.toFixed(1)} fl oz`;

    resultDiv.style.display = '';
  }

  const inputs = [weightInput, exerciseInput];
  const selects = [climateSelect];

  inputs.forEach(el => el.addEventListener('input', calculate));
  selects.forEach(el => el.addEventListener('change', calculate));

  // Run initial calculation
  calculate();

  return () => {
    inputs.forEach(el => el.removeEventListener('input', calculate));
    selects.forEach(el => el.removeEventListener('change', calculate));
  };
}
