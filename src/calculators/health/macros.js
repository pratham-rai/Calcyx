export const meta = {
  slug: 'macros',
  name: 'Macro / Nutrition Split',
  title: 'Macro Calculator - Calcyx',
  description: 'Calculate your daily macronutrient (protein, carbs, fat) targets based on calorie goals and diet style.',
  category: 'health',
  icon: '🥑',
  keywords: ['macro calculator', 'macronutrients', 'protein split', 'keto macros', 'nutrition split', 'carbs protein fat', 'diet calculator'],
  formula: 'Carbs/Protein = (Cal × %) / 4g; Fat = (Cal × %) / 9g',
  relatedSlugs: ['bmr', 'heart-rate']
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
            <label for="macro-calories">Daily Calorie Target (kcal)</label>
            <input type="number" id="macro-calories" class="calc-input" value="2000" min="500" max="10000" step="50">
          </div>
          <div class="calc-input-group">
            <label for="macro-goal">Diet Plan / Split</label>
            <select id="macro-goal" class="calc-select">
              <option value="balanced" selected>Balanced (40/30/30)</option>
              <option value="keto">Low Carb / Keto (5/30/65)</option>
              <option value="high-protein">High Protein (40/40/20)</option>
            </select>
          </div>
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="macro-summary"></div>
        <div class="calc-result-label">Recommended Macro Split (Carbs / Protein / Fat)</div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Carbohydrates</div>
            <div class="calc-result-value" id="macro-carbs" style="font-size: 1.5rem; margin: 0.5rem 0;"></div>
            <div class="calc-result-detail" id="macro-carbs-kcal"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Protein</div>
            <div class="calc-result-value" id="macro-protein" style="font-size: 1.5rem; margin: 0.5rem 0;"></div>
            <div class="calc-result-detail" id="macro-protein-kcal"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Fats</div>
            <div class="calc-result-value" id="macro-fats" style="font-size: 1.5rem; margin: 0.5rem 0;"></div>
            <div class="calc-result-detail" id="macro-fats-kcal"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>🥑 Diet Plans Explanation</h3>
        <p>Macronutrient distributions determine what portion of your calories come from carbohydrates, proteins, and fats:</p>
        <p>• <strong>Balanced (40/30/30):</strong> A versatile split for active lifestyles and general weight management.</p>
        <p>• <strong>Low Carb / Keto (5/30/65):</strong> Minimizes carbs to stimulate ketone production for fat burning.</p>
        <p>• <strong>High Protein (40/40/20):</strong> Optimizes lean muscle maintenance, satiety, and athletic recovery.</p>
        <p>Proteins and carbohydrates supply 4 kcal per gram, while fats supply 9 kcal per gram.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const caloriesInput = document.getElementById('macro-calories');
  const goalSelect = document.getElementById('macro-goal');
  const resultDiv = document.getElementById('result');

  function calculate() {
    const calories = parseFloat(caloriesInput.value);
    const goal = goalSelect.value;

    if (isNaN(calories) || calories <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    let carbsRatio, proteinRatio, fatRatio;

    if (goal === 'balanced') {
      carbsRatio = 0.40;
      proteinRatio = 0.30;
      fatRatio = 0.30;
    } else if (goal === 'keto') {
      carbsRatio = 0.05;
      proteinRatio = 0.30;
      fatRatio = 0.65;
    } else {
      // high-protein
      carbsRatio = 0.40;
      proteinRatio = 0.40;
      fatRatio = 0.20;
    }

    const carbsKcal = calories * carbsRatio;
    const proteinKcal = calories * proteinRatio;
    const fatKcal = calories * fatRatio;

    const carbsG = carbsKcal / 4;
    const proteinG = proteinKcal / 4;
    const fatG = fatKcal / 9;

    document.getElementById('macro-summary').textContent = 
      `${Math.round(carbsG)}g / ${Math.round(proteinG)}g / ${Math.round(fatG)}g`;

    document.getElementById('macro-carbs').textContent = `${Math.round(carbsG)} g`;
    document.getElementById('macro-carbs-kcal').textContent = 
      `${Math.round(carbsKcal).toLocaleString()} kcal (${Math.round(carbsRatio * 100)}%)`;

    document.getElementById('macro-protein').textContent = `${Math.round(proteinG)} g`;
    document.getElementById('macro-protein-kcal').textContent = 
      `${Math.round(proteinKcal).toLocaleString()} kcal (${Math.round(proteinRatio * 100)}%)`;

    document.getElementById('macro-fats').textContent = `${Math.round(fatG)} g`;
    document.getElementById('macro-fats-kcal').textContent = 
      `${Math.round(fatKcal).toLocaleString()} kcal (${Math.round(fatRatio * 100)}%)`;

    resultDiv.style.display = '';
  }

  const handlers = [
    [caloriesInput, 'input', calculate],
    [goalSelect, 'change', calculate]
  ];

  handlers.forEach(([el, evt, fn]) => el.addEventListener(evt, fn));

  // Run initial calculation
  calculate();

  return () => {
    handlers.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  };
}
