export const meta = {
  slug: 'bmi',
  name: 'BMI Calculator',
  title: 'BMI Calculator - Calcyx',
  description: 'Calculate your Body Mass Index (BMI) using weight and height. Supports metric and imperial units with instant category classification.',
  category: 'health',
  icon: '⚖️',
  keywords: ['bmi', 'body mass index', 'weight', 'height', 'obesity', 'underweight', 'overweight', 'health'],
  formula: 'BMI = weight(kg) / height(m)²',
  relatedSlugs: ['bmr', 'ideal-weight', 'body-fat']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">⚖️</span>
        <h1 class="calc-title">BMI Calculator</h1>
        <p class="calc-description">Calculate your Body Mass Index to assess whether your weight is in a healthy range for your height.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="bmi-unit">Unit System</label>
          <select id="bmi-unit" class="calc-select">
            <option value="metric">Metric (kg / cm)</option>
            <option value="imperial">Imperial (lbs / ft & in)</option>
          </select>
        </div>
        <div class="calc-input-group">
          <label for="bmi-weight" id="bmi-weight-label">Weight (kg)</label>
          <input type="number" id="bmi-weight" class="calc-input" placeholder="70" min="1" step="0.1">
        </div>
        <div id="bmi-height-metric">
          <div class="calc-input-group">
            <label for="bmi-height-cm">Height (cm)</label>
            <input type="number" id="bmi-height-cm" class="calc-input" placeholder="175" min="1" step="0.1">
          </div>
        </div>
        <div id="bmi-height-imperial" style="display:none;">
          <div class="calc-row">
            <div class="calc-input-group">
              <label for="bmi-feet">Feet</label>
              <input type="number" id="bmi-feet" class="calc-input" placeholder="5" min="0" step="1">
            </div>
            <div class="calc-input-group">
              <label for="bmi-inches">Inches</label>
              <input type="number" id="bmi-inches" class="calc-input" placeholder="9" min="0" max="11" step="0.1">
            </div>
          </div>
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="bmi-value"></div>
        <div class="calc-result-label" id="bmi-category"></div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Weight Used</div>
            <div class="calc-result-detail" id="bmi-weight-used"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Height Used</div>
            <div class="calc-result-detail" id="bmi-height-used"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Healthy Weight Range</div>
            <div class="calc-result-detail" id="bmi-healthy-range"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📐 Formula</h3>
        <code>BMI = weight (kg) ÷ height (m)²</code>
        <p><strong>Categories:</strong> Underweight &lt; 18.5 · Normal 18.5–24.9 · Overweight 25–29.9 · Obese ≥ 30</p>
        <p>BMI is a screening tool, not a diagnostic measure. It does not account for muscle mass, bone density, or body composition.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const unitSelect = document.getElementById('bmi-unit');
  const weightInput = document.getElementById('bmi-weight');
  const heightCmInput = document.getElementById('bmi-height-cm');
  const feetInput = document.getElementById('bmi-feet');
  const inchesInput = document.getElementById('bmi-inches');
  const weightLabel = document.getElementById('bmi-weight-label');
  const metricDiv = document.getElementById('bmi-height-metric');
  const imperialDiv = document.getElementById('bmi-height-imperial');

  function toggleUnits() {
    const isMetric = unitSelect.value === 'metric';
    weightLabel.textContent = isMetric ? 'Weight (kg)' : 'Weight (lbs)';
    weightInput.placeholder = isMetric ? '70' : '154';
    metricDiv.style.display = isMetric ? '' : 'none';
    imperialDiv.style.display = isMetric ? 'none' : '';
    calculate();
  }

  function getCategory(bmi) {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
    if (bmi < 25) return { label: 'Normal Weight', color: '#10b981' };
    if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  }

  function calculate() {
    const isMetric = unitSelect.value === 'metric';
    let weightKg, heightM;

    if (isMetric) {
      weightKg = parseFloat(weightInput.value);
      const heightCm = parseFloat(heightCmInput.value);
      if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
        document.getElementById('result').style.display = 'none';
        return;
      }
      heightM = heightCm / 100;
    } else {
      const weightLbs = parseFloat(weightInput.value);
      const feet = parseFloat(feetInput.value) || 0;
      const inches = parseFloat(inchesInput.value) || 0;
      const totalInches = feet * 12 + inches;
      if (!weightLbs || totalInches <= 0 || weightLbs <= 0) {
        document.getElementById('result').style.display = 'none';
        return;
      }
      weightKg = weightLbs * 0.453592;
      heightM = totalInches * 0.0254;
    }

    const bmi = weightKg / (heightM * heightM);
    const cat = getCategory(bmi);

    const healthyMin = (18.5 * heightM * heightM).toFixed(1);
    const healthyMax = (24.9 * heightM * heightM).toFixed(1);

    document.getElementById('bmi-value').textContent = bmi.toFixed(1);
    document.getElementById('bmi-value').style.color = cat.color;
    document.getElementById('bmi-category').textContent = cat.label;
    document.getElementById('bmi-category').style.color = cat.color;
    document.getElementById('bmi-weight-used').textContent = weightKg.toFixed(1) + ' kg';
    document.getElementById('bmi-height-used').textContent = (heightM * 100).toFixed(1) + ' cm';
    document.getElementById('bmi-healthy-range').textContent = healthyMin + ' – ' + healthyMax + ' kg';
    document.getElementById('result').style.display = '';
  }

  const handlers = [
    [unitSelect, 'change', toggleUnits],
    [weightInput, 'input', calculate],
    [heightCmInput, 'input', calculate],
    [feetInput, 'input', calculate],
    [inchesInput, 'input', calculate]
  ];

  handlers.forEach(([el, evt, fn]) => el.addEventListener(evt, fn));

  return () => {
    handlers.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
  };
}
