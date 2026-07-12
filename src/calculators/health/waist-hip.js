export const meta = {
  slug: 'waist-hip',
  name: 'Waist-to-Hip Ratio (WHR)',
  title: 'Waist-to-Hip Ratio Calculator - Calcyx',
  description: 'Calculate your Waist-to-Hip Ratio (WHR) to evaluate body fat distribution and assess health risk levels.',
  category: 'health',
  icon: '📏',
  keywords: ['waist to hip ratio', 'whr calculator', 'body shape', 'apple shape', 'pear shape', 'cardiovascular risk', 'visceral fat'],
  formula: 'WHR = Waist / Hip',
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
            <label for="whr-gender">Gender</label>
            <select id="whr-gender" class="calc-select">
              <option value="male" selected>Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="whr-waist">Waist Circumference (cm)</label>
            <input type="number" id="whr-waist" class="calc-input" value="90" min="30" max="250" step="0.1">
          </div>
          <div class="calc-input-group">
            <label for="whr-hip">Hip Circumference (cm)</label>
            <input type="number" id="whr-hip" class="calc-input" value="100" min="30" max="250" step="0.1">
          </div>
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="whr-ratio"></div>
        <div class="calc-result-label">Waist-to-Hip Ratio</div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Health Risk Level</div>
            <div class="calc-result-detail" id="whr-risk" style="font-weight: 600;"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Body Shape Category</div>
            <div class="calc-result-detail" id="whr-shape" style="font-weight: 600;"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Waist-to-Hip Status</div>
            <div class="calc-result-detail" id="whr-status"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📏 WHR Health Standards (World Health Organization)</h3>
        <code>WHR = Waist Circumference ÷ Hip Circumference</code>
        <p><strong>Risk Thresholds by Gender:</strong></p>
        <ul>
          <li><strong>Men:</strong> Low &lt; 0.90 · Moderate 0.90 – 1.00 · High &gt; 1.00</li>
          <li><strong>Women:</strong> Low &lt; 0.80 · Moderate 0.80 – 0.85 · High &gt; 0.85</li>
        </ul>
        <p>An <strong>Apple shape</strong> (android) indicates higher abdominal fat concentration, posing higher health risks, whereas a <strong>Pear shape</strong> (gynoid) carries more fat around hips and thighs, posing lower health risks.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const genderSelect = document.getElementById('whr-gender');
  const waistInput = document.getElementById('whr-waist');
  const hipInput = document.getElementById('whr-hip');
  const resultDiv = document.getElementById('result');

  function calculate() {
    const waist = parseFloat(waistInput.value);
    const hip = parseFloat(hipInput.value);
    const gender = genderSelect.value;

    if (isNaN(waist) || waist <= 0 || isNaN(hip) || hip <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const ratio = waist / hip;
    let riskLevel = '';
    let riskColor = '';
    let bodyShape = '';
    let statusText = '';

    if (gender === 'male') {
      if (ratio < 0.90) {
        riskLevel = 'Low';
        riskColor = '#10b981';
        bodyShape = 'Pear (Gynoid)';
        statusText = 'Lower risk of cardiovascular disease.';
      } else if (ratio <= 1.00) {
        riskLevel = 'Moderate';
        riskColor = '#f59e0b';
        bodyShape = 'Apple (Android)';
        statusText = 'Increased risk of weight-related issues.';
      } else {
        riskLevel = 'High';
        riskColor = '#ef4444';
        bodyShape = 'Apple (Android)';
        statusText = 'Higher risk of heart disease, diabetes, and stroke.';
      }
    } else {
      // female
      if (ratio < 0.80) {
        riskLevel = 'Low';
        riskColor = '#10b981';
        bodyShape = 'Pear (Gynoid)';
        statusText = 'Lower risk of cardiovascular disease.';
      } else if (ratio <= 0.85) {
        riskLevel = 'Moderate';
        riskColor = '#f59e0b';
        bodyShape = 'Apple (Android)';
        statusText = 'Increased risk of weight-related issues.';
      } else {
        riskLevel = 'High';
        riskColor = '#ef4444';
        bodyShape = 'Apple (Android)';
        statusText = 'Higher risk of heart disease, diabetes, and stroke.';
      }
    }

    const ratioEl = document.getElementById('whr-ratio');
    ratioEl.textContent = ratio.toFixed(2);
    ratioEl.style.color = riskColor;

    const riskEl = document.getElementById('whr-risk');
    riskEl.textContent = riskLevel;
    riskEl.style.color = riskColor;

    document.getElementById('whr-shape').textContent = bodyShape;
    document.getElementById('whr-status').textContent = statusText;

    resultDiv.style.display = '';
  }

  const inputs = [waistInput, hipInput];
  const selects = [genderSelect];

  inputs.forEach(el => el.addEventListener('input', calculate));
  selects.forEach(el => el.addEventListener('change', calculate));

  // Run initial calculation
  calculate();

  return () => {
    inputs.forEach(el => el.removeEventListener('input', calculate));
    selects.forEach(el => el.removeEventListener('change', calculate));
  };
}
