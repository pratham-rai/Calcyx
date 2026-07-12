export const meta = {
  slug: 'waist-height',
  name: 'Waist-to-Height Ratio (WHtR)',
  title: 'Waist-to-Height Ratio Calculator - Calcyx',
  description: 'Calculate your Waist-to-Height Ratio (WHtR) to evaluate body fat distribution and assess health risk levels.',
  category: 'health',
  icon: '📏',
  keywords: ['waist to height ratio', 'whtr calculator', 'body shape', 'abdominal fat', 'cardiovascular risk', 'visceral fat'],
  formula: 'WHtR = Waist / Height',
  relatedSlugs: ['waist-hip', 'bmi']
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
            <label for="whtr-gender">Gender</label>
            <select id="whtr-gender" class="calc-select">
              <option value="male" selected>Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div class="calc-input-group">
            <label for="whtr-unit">Unit System</label>
            <select id="whtr-unit" class="calc-select">
              <option value="metric" selected>Metric (cm)</option>
              <option value="imperial">Imperial (inches)</option>
            </select>
          </div>
        </div>
        
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="whtr-waist" id="whtr-waist-label">Waist Circumference (cm)</label>
            <input type="number" id="whtr-waist" class="calc-input" value="80" min="10" max="300" step="0.1" placeholder="80">
          </div>
          <div class="calc-input-group">
            <label for="whtr-height" id="whtr-height-label">Height (cm)</label>
            <input type="number" id="whtr-height" class="calc-input" value="170" min="30" max="300" step="0.1" placeholder="170">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-value" id="whtr-ratio">0.00</div>
        <div class="calc-result-label">Waist-to-Height Ratio (WHtR)</div>
        
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Health Category</div>
            <div class="calc-result-detail" id="whtr-category" style="font-weight: 600;">-</div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Health Risk Level</div>
            <div class="calc-result-detail" id="whtr-risk" style="font-weight: 600;">-</div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Target Waist Range</div>
            <div class="calc-result-detail" id="whtr-target-waist">-</div>
          </div>
        </div>

        <div style="margin-top: 1.5rem; text-align: left; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
          <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem; font-weight: 600; opacity: 0.9;">WHtR Reference Table:</h4>
          <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem;" id="whtr-ranges-table">
            <!-- Dynamic boundaries shown here -->
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 WHR vs WHtR</h3>
        <code>WHtR = Waist Circumference ÷ Height</code>
        <p>The waist-to-height ratio (WHtR) is a simple and highly effective screening tool for cardiovascular risk and obesity. Research suggests that keeping your waist circumference to less than half your height is associated with a higher life expectancy and lower health risks.</p>
        <p>A WHtR of <strong>0.50 or higher</strong> indicates increased visceral fat storage, which is linked to metabolic syndrome, type 2 diabetes, and cardiovascular diseases.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const genderSelect = document.getElementById('whtr-gender');
  const unitSelect = document.getElementById('whtr-unit');
  const waistInput = document.getElementById('whtr-waist');
  const heightInput = document.getElementById('whtr-height');
  const waistLabel = document.getElementById('whtr-waist-label');
  const heightLabel = document.getElementById('whtr-height-label');
  const resultDiv = document.getElementById('result');

  function toggleUnits() {
    const isMetric = unitSelect.value === 'metric';
    const waistVal = parseFloat(waistInput.value);
    const heightVal = parseFloat(heightInput.value);

    waistLabel.textContent = isMetric ? 'Waist Circumference (cm)' : 'Waist Circumference (inches)';
    heightLabel.textContent = isMetric ? 'Height (cm)' : 'Height (inches)';

    if (!isNaN(waistVal)) {
      waistInput.value = isMetric ? (waistVal * 2.54).toFixed(1) : (waistVal / 2.54).toFixed(1);
    }
    if (!isNaN(heightVal)) {
      heightInput.value = isMetric ? (heightVal * 2.54).toFixed(1) : (heightVal / 2.54).toFixed(1);
    }

    calculate();
  }

  function calculate() {
    const gender = genderSelect.value;
    const isMetric = unitSelect.value === 'metric';
    const waist = parseFloat(waistInput.value);
    const height = parseFloat(heightInput.value);

    if (isNaN(waist) || waist <= 0 || isNaN(height) || height <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const ratio = waist / height;
    let category = '';
    let risk = '';
    let color = '';

    if (gender === 'male') {
      if (ratio < 0.35) {
        category = 'Extremely Slim';
        risk = 'Low (Underweight Risk)';
        color = '#3b82f6'; // blue
      } else if (ratio < 0.44) {
        category = 'Healthy';
        risk = 'Low / Normal Risk';
        color = '#10b981'; // green
      } else if (ratio < 0.53) {
        category = 'Overweight';
        risk = 'Increased Risk';
        color = '#f59e0b'; // orange
      } else {
        category = 'Highly Obese';
        risk = 'High Risk';
        color = '#ef4444'; // red
      }
    } else {
      // female
      if (ratio < 0.35) {
        category = 'Extremely Slim';
        risk = 'Low (Underweight Risk)';
        color = '#3b82f6'; // blue
      } else if (ratio < 0.43) {
        category = 'Healthy';
        risk = 'Low / Normal Risk';
        color = '#10b981'; // green
      } else if (ratio < 0.49) {
        category = 'Overweight';
        risk = 'Increased Risk';
        color = '#f59e0b'; // orange
      } else {
        category = 'Highly Obese';
        risk = 'High Risk';
        color = '#ef4444'; // red
      }
    }

    // Healthy waist range is 0.35 * height to (gender limit) * height
    const unitText = isMetric ? 'cm' : 'in';
    const minHealthyWaist = (0.35 * height).toFixed(1);
    const maxHealthyWaist = ((gender === 'male' ? 0.439 : 0.429) * height).toFixed(1);

    // Update outputs
    const ratioEl = document.getElementById('whtr-ratio');
    ratioEl.textContent = ratio.toFixed(2);
    ratioEl.style.color = color;

    const catEl = document.getElementById('whtr-category');
    catEl.textContent = category;
    catEl.style.color = color;

    const riskEl = document.getElementById('whtr-risk');
    riskEl.textContent = risk;
    riskEl.style.color = color;

    document.getElementById('whtr-target-waist').textContent = `${minHealthyWaist} – ${maxHealthyWaist} ${unitText}`;

    // Render table
    const tableEl = document.getElementById('whtr-ranges-table');
    if (gender === 'male') {
      tableEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; padding: 0.15rem 0; opacity: ${ratio < 0.35 ? '1' : '0.6'}; font-weight: ${ratio < 0.35 ? 'bold' : 'normal'}; color: #3b82f6;">
          <span>Extremely Slim:</span> <span>&lt; 0.35</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.15rem 0; opacity: ${ratio >= 0.35 && ratio < 0.44 ? '1' : '0.6'}; font-weight: ${ratio >= 0.35 && ratio < 0.44 ? 'bold' : 'normal'}; color: #10b981;">
          <span>Healthy (Male):</span> <span>0.35 – 0.43</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.15rem 0; opacity: ${ratio >= 0.44 && ratio < 0.53 ? '1' : '0.6'}; font-weight: ${ratio >= 0.44 && ratio < 0.53 ? 'bold' : 'normal'}; color: #f59e0b;">
          <span>Overweight (Male):</span> <span>0.44 – 0.52</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.15rem 0; opacity: ${ratio >= 0.53 ? '1' : '0.6'}; font-weight: ${ratio >= 0.53 ? 'bold' : 'normal'}; color: #ef4444;">
          <span>Highly Obese (Male):</span> <span>&ge; 0.53</span>
        </div>
      `;
    } else {
      tableEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; padding: 0.15rem 0; opacity: ${ratio < 0.35 ? '1' : '0.6'}; font-weight: ${ratio < 0.35 ? 'bold' : 'normal'}; color: #3b82f6;">
          <span>Extremely Slim:</span> <span>&lt; 0.35</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.15rem 0; opacity: ${ratio >= 0.35 && ratio < 0.43 ? '1' : '0.6'}; font-weight: ${ratio >= 0.35 && ratio < 0.43 ? 'bold' : 'normal'}; color: #10b981;">
          <span>Healthy (Female):</span> <span>0.35 – 0.42</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.15rem 0; opacity: ${ratio >= 0.43 && ratio < 0.49 ? '1' : '0.6'}; font-weight: ${ratio >= 0.43 && ratio < 0.49 ? 'bold' : 'normal'}; color: #f59e0b;">
          <span>Overweight (Female):</span> <span>0.43 – 0.48</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.15rem 0; opacity: ${ratio >= 0.49 ? '1' : '0.6'}; font-weight: ${ratio >= 0.49 ? 'bold' : 'normal'}; color: #ef4444;">
          <span>Highly Obese (Female):</span> <span>&ge; 0.49</span>
        </div>
      `;
    }

    resultDiv.style.display = '';
  }

  const inputs = [waistInput, heightInput];
  const selects = [genderSelect, unitSelect];

  inputs.forEach(el => el.addEventListener('input', calculate));
  selects.forEach(el => el.addEventListener('change', calculate));
  unitSelect.addEventListener('change', toggleUnits);

  // Initial calculation
  calculate();

  return () => {
    inputs.forEach(el => el.removeEventListener('input', calculate));
    selects.forEach(el => el.removeEventListener('change', calculate));
    unitSelect.removeEventListener('change', toggleUnits);
  };
}
