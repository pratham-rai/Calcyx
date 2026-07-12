export const meta = {
  slug: 'heart-rate',
  name: 'Heart Rate Zones',
  title: 'Heart Rate Zone Calculator - Calcyx',
  description: 'Determine your maximum heart rate and target heart rate zones for fat burn, cardio, and peak performance using the Karvonen formula.',
  category: 'health',
  icon: '💓',
  keywords: ['heart rate zones', 'karvonen formula', 'target heart rate', 'max heart rate', 'cardio zone', 'fat burn zone', 'fitness tracking'],
  formula: 'Max HR = 220 − Age; Target HR = Resting HR + Intensity × (Max HR − Resting HR)',
  relatedSlugs: ['bmr', 'macros']
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
            <label for="hr-age">Age (years)</label>
            <input type="number" id="hr-age" class="calc-input" value="25" min="1" max="110" step="1">
          </div>
          <div class="calc-input-group">
            <label for="hr-resting">Resting Heart Rate (bpm)</label>
            <input type="number" id="hr-resting" class="calc-input" value="60" min="30" max="150" step="1">
          </div>
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="hr-max"></div>
        <div class="calc-result-label">Maximum Heart Rate (bpm)</div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Zone 1: Warm Up (50-60%)</div>
            <div class="calc-result-detail" id="hr-zone1"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Zone 2: Fat Burn (60-70%)</div>
            <div class="calc-result-detail" id="hr-zone2"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Zone 3: Cardio (70-80%)</div>
            <div class="calc-result-detail" id="hr-zone3"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Zone 4: Peak (80-90%)</div>
            <div class="calc-result-detail" id="hr-zone4"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Zone 5: Red Line (90-100%)</div>
            <div class="calc-result-detail" id="hr-zone5"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Heart Rate Reserve (HRR)</div>
            <div class="calc-result-detail" id="hr-reserve"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📈 Karvonen Formula</h3>
        <code>Max Heart Rate = 220 − Age</code>
        <code>HR Reserve = Max HR − Resting HR</code>
        <code>Target HR Range = Resting HR + Intensity × HR Reserve</code>
        <p>The Karvonen formula is one of the most effective ways to calculate target heart rate zones because it factors in your individual resting heart rate (RHR), reflecting your baseline aerobic fitness level.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const ageInput = document.getElementById('hr-age');
  const restingInput = document.getElementById('hr-resting');
  const resultDiv = document.getElementById('result');

  function calculate() {
    const age = parseInt(ageInput.value);
    const resting = parseInt(restingInput.value);

    if (isNaN(age) || age <= 0 || age >= 220 || isNaN(resting) || resting <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const maxHR = 220 - age;
    const hrReserve = maxHR - resting;

    if (hrReserve <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const zone1Min = Math.round(resting + 0.5 * hrReserve);
    const zone1Max = Math.round(resting + 0.6 * hrReserve);
    const zone2Min = Math.round(resting + 0.6 * hrReserve);
    const zone2Max = Math.round(resting + 0.7 * hrReserve);
    const zone3Min = Math.round(resting + 0.7 * hrReserve);
    const zone3Max = Math.round(resting + 0.8 * hrReserve);
    const zone4Min = Math.round(resting + 0.8 * hrReserve);
    const zone4Max = Math.round(resting + 0.9 * hrReserve);
    const zone5Min = Math.round(resting + 0.9 * hrReserve);
    const zone5Max = maxHR;

    document.getElementById('hr-max').textContent = `${maxHR} bpm`;
    document.getElementById('hr-reserve').textContent = `${hrReserve} bpm`;
    
    document.getElementById('hr-zone1').textContent = `${zone1Min} – ${zone1Max} bpm`;
    document.getElementById('hr-zone2').textContent = `${zone2Min} – ${zone2Max} bpm`;
    document.getElementById('hr-zone3').textContent = `${zone3Min} – ${zone3Max} bpm`;
    document.getElementById('hr-zone4').textContent = `${zone4Min} – ${zone4Max} bpm`;
    document.getElementById('hr-zone5').textContent = `${zone5Min} – ${zone5Max} bpm`;

    resultDiv.style.display = '';
  }

  const inputs = [ageInput, restingInput];

  inputs.forEach(el => el.addEventListener('input', calculate));

  // Run initial calculation
  calculate();

  return () => {
    inputs.forEach(el => el.removeEventListener('input', calculate));
  };
}
