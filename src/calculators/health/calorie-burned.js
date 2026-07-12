export const meta = {
  slug: 'calorie-burned',
  name: 'Calorie Burned / Activity',
  title: 'Calorie Burned / Activity - Calcyx',
  description: 'Calculate calories burned during various physical activities based on body weight, duration, and MET values.',
  category: 'health',
  icon: '🏃',
  keywords: ['calories burned', 'activity calculator', 'met value', 'exercise intensity', 'calorie burn', 'fitness'],
  formula: 'Calories = MET × 3.5 × weight(kg) / 200 × duration(mins)',
  relatedSlugs: ['bmr', 'bmi']
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
          <div class="calc-input-group" style="flex: 2;">
            <label for="cal-weight">Weight</label>
            <input type="number" id="cal-weight" class="calc-input" value="70" min="1" step="0.1" placeholder="70">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="cal-weight-unit">Unit</label>
            <select id="cal-weight-unit" class="calc-select">
              <option value="kg" selected>kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
        
        <div class="calc-input-group">
          <label for="cal-duration">Duration (minutes)</label>
          <input type="number" id="cal-duration" class="calc-input" value="30" min="1" step="1" placeholder="30">
        </div>

        <div class="calc-input-group">
          <label for="cal-activity">Activity</label>
          <select id="cal-activity" class="calc-select">
            <option value="3.5" selected>Walking (moderate pace, 3.5 MET)</option>
            <option value="9.8">Running (jogging, 9.8 MET)</option>
            <option value="7.5">Cycling (moderate effort, 7.5 MET)</option>
            <option value="8.0">Swimming (light/moderate, 8.0 MET)</option>
            <option value="5.0">Weightlifting (vigorous, 5.0 MET)</option>
            <option value="2.5">Yoga (2.5 MET)</option>
            <option value="custom">Custom MET Input</option>
          </select>
        </div>

        <div class="calc-input-group" id="cal-custom-met-group" style="display: none;">
          <label for="cal-custom-met">Custom MET Value</label>
          <input type="number" id="cal-custom-met" class="calc-input" value="5.0" min="0.1" max="30" step="0.1" placeholder="5.0">
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-value" id="cal-result-value">0</div>
        <div class="calc-result-label">Estimated Calories Burned</div>
        
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">MET Value</div>
            <div class="calc-result-detail" id="cal-met-used">3.5</div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Weight Used</div>
            <div class="calc-result-detail" id="cal-weight-used">70 kg</div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Duration</div>
            <div class="calc-result-detail" id="cal-duration-used">30 mins</div>
          </div>
        </div>

        <div style="margin-top: 1.5rem; text-align: left; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
          <h4 style="margin-bottom: 0.75rem; font-size: 0.95rem; font-weight: 600; opacity: 0.9;">Calories Burned in Other Activities:</h4>
          <div id="cal-comparison" style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
            <!-- Dynamic comparison entries will go here -->
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Formula & MET Explanation</h3>
        <code>Calories Burned = MET × 3.5 × Weight (kg) ÷ 200 × Duration (minutes)</code>
        <p><strong>What is a MET?</strong> MET stands for Metabolic Equivalent of Task. It measures the energy cost of physical activities. One MET is the rate of energy expenditure while sitting quietly (approximately 1 kcal/kg/hour).</p>
        <p>Activities with higher MET values require more physical exertion and burn calories at a faster rate.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const weightInput = document.getElementById('cal-weight');
  const weightUnitSelect = document.getElementById('cal-weight-unit');
  const durationInput = document.getElementById('cal-duration');
  const activitySelect = document.getElementById('cal-activity');
  const customMetGroup = document.getElementById('cal-custom-met-group');
  const customMetInput = document.getElementById('cal-custom-met');
  const resultDiv = document.getElementById('result');

  const comparisonActivities = [
    { name: 'Yoga', met: 2.5 },
    { name: 'Walking', met: 3.5 },
    { name: 'Weightlifting', met: 5.0 },
    { name: 'Cycling', met: 7.5 },
    { name: 'Swimming', met: 8.0 },
    { name: 'Running', met: 9.8 }
  ];

  function toggleCustomMet() {
    const isCustom = activitySelect.value === 'custom';
    customMetGroup.style.display = isCustom ? '' : 'none';
    calculate();
  }

  function calculate() {
    const weightVal = parseFloat(weightInput.value);
    const unit = weightUnitSelect.value;
    const duration = parseFloat(durationInput.value);
    const activityVal = activitySelect.value;

    if (isNaN(weightVal) || weightVal <= 0 || isNaN(duration) || duration <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    // Convert weight to kg if necessary
    const weightKg = unit === 'lbs' ? weightVal * 0.45359237 : weightVal;

    // Get MET
    let met = 3.5;
    if (activityVal === 'custom') {
      met = parseFloat(customMetInput.value);
      if (isNaN(met) || met <= 0) {
        resultDiv.style.display = 'none';
        return;
      }
    } else {
      met = parseFloat(activityVal);
    }

    // Calories = MET * 3.5 * weightKg / 200 * duration
    const caloriesBurned = met * 3.5 * weightKg / 200 * duration;

    // Update main results
    document.getElementById('cal-result-value').textContent = Math.round(caloriesBurned).toLocaleString();
    document.getElementById('cal-met-used').textContent = met.toFixed(1);
    document.getElementById('cal-weight-used').textContent = `${weightVal.toFixed(1)} ${unit}`;
    document.getElementById('cal-duration-used').textContent = `${duration} mins`;

    // Render comparison list
    const comparisonEl = document.getElementById('cal-comparison');
    comparisonEl.innerHTML = '';
    
    comparisonActivities.forEach(act => {
      const actCalories = act.met * 3.5 * weightKg / 200 * duration;
      const actRow = document.createElement('div');
      actRow.style.display = 'flex';
      actRow.style.justifyContent = 'space-between';
      actRow.style.padding = '0.35rem 0';
      actRow.style.borderBottom = '1px dashed rgba(255,255,255,0.05)';
      
      actRow.innerHTML = `
        <span style="opacity: 0.85;">${act.name} (${act.met.toFixed(1)} MET)</span>
        <span style="font-weight: 600;">${Math.round(actCalories).toLocaleString()} kcal</span>
      `;
      comparisonEl.appendChild(actRow);
    });

    resultDiv.style.display = '';
  }

  const inputs = [weightInput, durationInput, customMetInput];
  const selects = [weightUnitSelect, activitySelect];

  inputs.forEach(el => el.addEventListener('input', calculate));
  selects.forEach(el => el.addEventListener('change', calculate));
  activitySelect.addEventListener('change', toggleCustomMet);

  // Initial calculation
  calculate();

  return () => {
    inputs.forEach(el => el.removeEventListener('input', calculate));
    selects.forEach(el => el.removeEventListener('change', calculate));
    activitySelect.removeEventListener('change', toggleCustomMet);
  };
}
