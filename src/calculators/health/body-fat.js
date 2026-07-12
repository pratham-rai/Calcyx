export const meta = {
  slug: 'body-fat',
  name: 'Body Fat % Calculator',
  title: 'Body Fat Percentage Calculator - Calcyx',
  description: 'Estimate your body fat percentage using the U.S. Navy method with waist, neck, height, and hip measurements.',
  category: 'health',
  icon: '📏',
  keywords: ['body fat', 'fat percentage', 'navy method', 'lean mass', 'fat mass', 'body composition'],
  formula: 'Male: 86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76 · Female: 163.205 × log₁₀(waist + hip − neck) − 97.684 × log₁₀(height) − 78.387',
  relatedSlugs: ['bmi', 'bmr', 'ideal-weight']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">📏</span>
        <h1 class="calc-title">Body Fat % Calculator</h1>
        <p class="calc-description">Estimate your body fat percentage using the U.S. Navy circumference method. Measure at the narrowest point for the neck and at the navel for the waist.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="bf-gender">Gender</label>
          <select id="bf-gender" class="calc-select">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="bf-height">Height (cm)</label>
            <input type="number" id="bf-height" class="calc-input" placeholder="175" min="1" step="0.1">
          </div>
          <div class="calc-input-group">
            <label for="bf-weight">Weight (kg)</label>
            <input type="number" id="bf-weight" class="calc-input" placeholder="70" min="1" step="0.1">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="bf-waist">Waist (cm)</label>
            <input type="number" id="bf-waist" class="calc-input" placeholder="85" min="1" step="0.1">
          </div>
          <div class="calc-input-group">
            <label for="bf-neck">Neck (cm)</label>
            <input type="number" id="bf-neck" class="calc-input" placeholder="38" min="1" step="0.1">
          </div>
        </div>
        <div class="calc-input-group" id="bf-hip-group">
          <label for="bf-hip">Hip (cm) — required for females</label>
          <input type="number" id="bf-hip" class="calc-input" placeholder="95" min="1" step="0.1">
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="bf-percent"></div>
        <div class="calc-result-label" id="bf-category"></div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Fat Mass</div>
            <div class="calc-result-detail" id="bf-fat-mass"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Lean Mass</div>
            <div class="calc-result-detail" id="bf-lean-mass"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📐 U.S. Navy Method</h3>
        <code>Male: 86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76</code>
        <code>Female: 163.205 × log₁₀(waist + hip − neck) − 97.684 × log₁₀(height) − 78.387</code>
        <p>All measurements should be in centimeters. Measure waist at navel level, neck at narrowest point, and hips at widest point.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const genderSelect = document.getElementById('bf-gender');
  const heightInput = document.getElementById('bf-height');
  const weightInput = document.getElementById('bf-weight');
  const waistInput = document.getElementById('bf-waist');
  const neckInput = document.getElementById('bf-neck');
  const hipInput = document.getElementById('bf-hip');
  const hipGroup = document.getElementById('bf-hip-group');

  function getCategory(bf, gender) {
    if (gender === 'male') {
      if (bf < 6) return { label: 'Essential Fat', color: '#3b82f6' };
      if (bf < 14) return { label: 'Athletes', color: '#10b981' };
      if (bf < 18) return { label: 'Fitness', color: '#22d3ee' };
      if (bf < 25) return { label: 'Average', color: '#f59e0b' };
      return { label: 'Obese', color: '#ef4444' };
    } else {
      if (bf < 14) return { label: 'Essential Fat', color: '#3b82f6' };
      if (bf < 21) return { label: 'Athletes', color: '#10b981' };
      if (bf < 25) return { label: 'Fitness', color: '#22d3ee' };
      if (bf < 32) return { label: 'Average', color: '#f59e0b' };
      return { label: 'Obese', color: '#ef4444' };
    }
  }

  function toggleHip() {
    hipGroup.style.display = genderSelect.value === 'female' ? '' : 'none';
    calculate();
  }

  function calculate() {
    const gender = genderSelect.value;
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    const waist = parseFloat(waistInput.value);
    const neck = parseFloat(neckInput.value);
    const hip = parseFloat(hipInput.value);

    if (!height || !weight || !waist || !neck || height <= 0 || weight <= 0 || waist <= 0 || neck <= 0) {
      document.getElementById('result').style.display = 'none';
      return;
    }

    if (gender === 'female' && (!hip || hip <= 0)) {
      document.getElementById('result').style.display = 'none';
      return;
    }

    let bodyFat;
    if (gender === 'male') {
      const diff = waist - neck;
      if (diff <= 0) {
        document.getElementById('result').style.display = 'none';
        return;
      }
      bodyFat = 86.010 * Math.log10(diff) - 70.041 * Math.log10(height) + 36.76;
    } else {
      const sum = waist + hip - neck;
      if (sum <= 0) {
        document.getElementById('result').style.display = 'none';
        return;
      }
      bodyFat = 163.205 * Math.log10(sum) - 97.684 * Math.log10(height) - 78.387;
    }

    bodyFat = Math.max(0, bodyFat);
    const fatMass = weight * bodyFat / 100;
    const leanMass = weight - fatMass;
    const cat = getCategory(bodyFat, gender);

    document.getElementById('bf-percent').textContent = bodyFat.toFixed(1) + '%';
    document.getElementById('bf-percent').style.color = cat.color;
    document.getElementById('bf-category').textContent = cat.label;
    document.getElementById('bf-category').style.color = cat.color;
    document.getElementById('bf-fat-mass').textContent = fatMass.toFixed(1) + ' kg';
    document.getElementById('bf-lean-mass').textContent = leanMass.toFixed(1) + ' kg';
    document.getElementById('result').style.display = '';
  }

  const inputs = [heightInput, weightInput, waistInput, neckInput, hipInput];
  inputs.forEach(el => el.addEventListener('input', calculate));
  genderSelect.addEventListener('change', toggleHip);

  toggleHip();

  return () => {
    inputs.forEach(el => el.removeEventListener('input', calculate));
    genderSelect.removeEventListener('change', toggleHip);
  };
}
