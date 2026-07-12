export const meta = {
  slug: 'ideal-weight',
  name: 'Ideal Weight Calculator',
  title: 'Ideal Weight Calculator - Calcyx',
  description: 'Estimate your ideal body weight using four established formulas: Devine, Robinson, Miller, and Hamwi.',
  category: 'health',
  icon: '🎯',
  keywords: ['ideal weight', 'healthy weight', 'devine', 'robinson', 'miller', 'hamwi', 'height', 'weight goal'],
  formula: 'Devine: Male = 50 + 2.3 × (height_in − 60), Female = 45.5 + 2.3 × (height_in − 60)',
  relatedSlugs: ['bmi', 'bmr']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">🎯</span>
        <h1 class="calc-title">Ideal Weight Calculator</h1>
        <p class="calc-description">Find your ideal body weight using four scientifically established formulas. Results vary because each formula was developed from different population studies.</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="iw-height">Height (cm)</label>
            <input type="number" id="iw-height" class="calc-input" placeholder="175" min="100" max="250" step="0.1">
          </div>
          <div class="calc-input-group">
            <label for="iw-gender">Gender</label>
            <select id="iw-gender" class="calc-select">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="iw-range"></div>
        <div class="calc-result-label">Ideal Weight Range (kg)</div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Devine Formula</div>
            <div class="calc-result-detail" id="iw-devine"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Robinson Formula</div>
            <div class="calc-result-detail" id="iw-robinson"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Miller Formula</div>
            <div class="calc-result-detail" id="iw-miller"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Hamwi Formula</div>
            <div class="calc-result-detail" id="iw-hamwi"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📐 Formulas (height in inches, result in kg)</h3>
        <code>Devine:   M = 50.0 + 2.3 × (in − 60)   F = 45.5 + 2.3 × (in − 60)</code>
        <code>Robinson: M = 52.0 + 1.9 × (in − 60)   F = 49.0 + 1.7 × (in − 60)</code>
        <code>Miller:   M = 56.2 + 1.41 × (in − 60)  F = 53.1 + 1.36 × (in − 60)</code>
        <code>Hamwi:    M = 48.0 + 2.7 × (in − 60)   F = 45.5 + 2.2 × (in − 60)</code>
        <p>All formulas are designed for adults over 152 cm (5 ft). Results may be less accurate for very short or very tall individuals.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const heightInput = document.getElementById('iw-height');
  const genderSelect = document.getElementById('iw-gender');

  function calculate() {
    const heightCm = parseFloat(heightInput.value);
    const gender = genderSelect.value;

    if (!heightCm || heightCm <= 0) {
      document.getElementById('result').style.display = 'none';
      return;
    }

    const inches = heightCm / 2.54;
    const over60 = inches - 60;

    let devine, robinson, miller, hamwi;

    if (gender === 'male') {
      devine = 50.0 + 2.3 * over60;
      robinson = 52.0 + 1.9 * over60;
      miller = 56.2 + 1.41 * over60;
      hamwi = 48.0 + 2.7 * over60;
    } else {
      devine = 45.5 + 2.3 * over60;
      robinson = 49.0 + 1.7 * over60;
      miller = 53.1 + 1.36 * over60;
      hamwi = 45.5 + 2.2 * over60;
    }

    const all = [devine, robinson, miller, hamwi];
    const min = Math.min(...all);
    const max = Math.max(...all);

    document.getElementById('iw-range').textContent = min.toFixed(1) + ' – ' + max.toFixed(1) + ' kg';
    document.getElementById('iw-devine').textContent = devine.toFixed(1) + ' kg';
    document.getElementById('iw-robinson').textContent = robinson.toFixed(1) + ' kg';
    document.getElementById('iw-miller').textContent = miller.toFixed(1) + ' kg';
    document.getElementById('iw-hamwi').textContent = hamwi.toFixed(1) + ' kg';
    document.getElementById('result').style.display = '';
  }

  heightInput.addEventListener('input', calculate);
  genderSelect.addEventListener('change', calculate);

  return () => {
    heightInput.removeEventListener('input', calculate);
    genderSelect.removeEventListener('change', calculate);
  };
}
