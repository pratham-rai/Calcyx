export const meta = {
  slug: 'blood-volume',
  name: 'Blood Volume Calculator',
  title: 'Blood Volume Calculator - Calcyx',
  description: 'Estimate your total blood volume using Nadler\'s and Lemmens-Bernstein formulas based on height, weight, and gender.',
  category: 'health',
  icon: '🩸',
  keywords: ['blood volume calculator', 'nadlers formula', 'lemmens bernstein', 'total blood volume', 'plasma volume', 'medical calculator'],
  formula: 'Nadler Formula: Male = 0.3669×H³ + 0.03219×W + 0.6041; Lemmens Formula: BV = W × 70 / sqrt(BMI/22)',
  relatedSlugs: ['bmi', 'body-fat']
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
            <label for="bv-gender">Gender</label>
            <select id="bv-gender" class="calc-select">
              <option value="male" selected>Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div class="calc-row">
          <div class="calc-input-group">
            <label for="bv-height">Height (cm)</label>
            <input type="number" id="bv-height" class="calc-input" value="175" min="30" max="300" step="0.1" placeholder="175">
          </div>
          <div class="calc-input-group">
            <label for="bv-weight">Weight (kg)</label>
            <input type="number" id="bv-weight" class="calc-input" value="70" min="5" max="300" step="0.1" placeholder="70">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display: none;">
        <h3 style="text-align: left; margin-bottom: 1rem; font-size: 1.1rem; font-weight: 600; opacity: 0.9;">Estimated Blood Volume</h3>
        
        <div class="calc-result-grid" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="calc-result-item" style="text-align: center; padding: 1.25rem 0.75rem;">
            <div style="font-size: 2.2rem; font-weight: 800; color: #fb7185; line-height: 1.2;" id="bv-nadler-val">0.00 L</div>
            <div class="calc-result-label" style="margin-top: 0.5rem; font-weight: 600;">Nadler's Formula</div>
            <div class="calc-result-detail" id="bv-nadler-ml" style="margin-top: 0.25rem; font-size: 0.85rem; opacity: 0.75;">0 mL</div>
          </div>
          
          <div class="calc-result-item" style="text-align: center; padding: 1.25rem 0.75rem;">
            <div style="font-size: 2.2rem; font-weight: 800; color: #f43f5e; line-height: 1.2;" id="bv-lemmens-val">0.00 L</div>
            <div class="calc-result-label" style="margin-top: 0.5rem; font-weight: 600;">Lemmens-Bernstein</div>
            <div class="calc-result-detail" id="bv-lemmens-ml" style="margin-top: 0.25rem; font-size: 0.85rem; opacity: 0.75;">0 mL</div>
          </div>
        </div>

        <div style="margin-top: 1.5rem; text-align: left; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; font-size: 0.85rem; opacity: 0.85; line-height: 1.4;">
          <p><strong>Note:</strong> On average, an adult's blood volume represents approximately 7% to 8% of their total body weight. This is equivalent to about 70–75 mL of blood per kilogram of body weight.</p>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📐 Mathematical Formulas</h3>
        <p><strong>Nadler's Formula:</strong></p>
        <code>Male: BV = 0.3669 × H³ + 0.03219 × W + 0.6041</code>
        <code>Female: BV = 0.3561 × H³ + 0.03308 × W + 0.1833</code>
        <p style="font-size: 0.85rem; margin-top: -0.5rem; opacity: 0.8;">Where H is height in meters (m) and W is weight in kilograms (kg).</p>
        
        <p><strong>Lemmens-Bernstein Formula:</strong></p>
        <code>BV = Weight × 70 / sqrt(BMI / 22)</code>
        <p style="font-size: 0.85rem; margin-top: -0.5rem; opacity: 0.8;">Where BMI is calculated as Weight (kg) / Height² (m). This indexing formula adjusts for body composition by scaling blood volume in relation to deviation from ideal BMI (22).</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const genderSelect = document.getElementById('bv-gender');
  const heightInput = document.getElementById('bv-height');
  const weightInput = document.getElementById('bv-weight');
  const resultDiv = document.getElementById('result');

  function calculate() {
    const gender = genderSelect.value;
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (isNaN(height) || height <= 0 || isNaN(weight) || weight <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const hM = height / 100;
    const bmi = weight / (hM * hM);

    if (bmi <= 0 || isNaN(bmi)) {
      resultDiv.style.display = 'none';
      return;
    }

    // 1. Nadler's Formula
    let bvNadlerL = 0;
    if (gender === 'male') {
      bvNadlerL = 0.3669 * Math.pow(hM, 3) + 0.03219 * weight + 0.6041;
    } else {
      bvNadlerL = 0.3561 * Math.pow(hM, 3) + 0.03308 * weight + 0.1833;
    }

    // 2. Lemmens-Bernstein Formula
    // BV = weight * 70 / sqrt(bmi / 22) (in mL)
    const scaleFactor = Math.sqrt(bmi / 22);
    const bvLemmensMl = (weight * 70) / scaleFactor;
    const bvLemmensL = bvLemmensMl / 1000;

    // Format and display
    document.getElementById('bv-nadler-val').textContent = `${bvNadlerL.toFixed(2)} L`;
    document.getElementById('bv-nadler-ml').textContent = `${Math.round(bvNadlerL * 1000).toLocaleString()} mL`;

    document.getElementById('bv-lemmens-val').textContent = `${bvLemmensL.toFixed(2)} L`;
    document.getElementById('bv-lemmens-ml').textContent = `${Math.round(bvLemmensMl).toLocaleString()} mL`;

    resultDiv.style.display = '';
  }

  const inputs = [heightInput, weightInput];
  const selects = [genderSelect];

  inputs.forEach(el => el.addEventListener('input', calculate));
  selects.forEach(el => el.addEventListener('change', calculate));

  // Initial calculation
  calculate();

  return () => {
    inputs.forEach(el => el.removeEventListener('input', calculate));
    selects.forEach(el => el.removeEventListener('change', calculate));
  };
}
