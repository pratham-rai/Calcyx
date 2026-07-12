export const meta = {
  slug: 'biorhythm',
  name: 'Biorhythm Calculator',
  title: 'Biorhythm Calculator - Calcyx',
  description: 'Calculate your physical, emotional, and intellectual biorhythm cycles based on your birth date and a target date.',
  category: 'everyday',
  icon: '📈',
  keywords: ['biorhythm', 'biorhythm calculator', 'physical cycle', 'emotional cycle', 'intellectual cycle', 'critical days', 'cycles'],
  formula: 'Percent = sin(2π × days / cycle_length) × 100',
  relatedSlugs: ['age', 'countdown']
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
            <label for="birth-date">Date of Birth</label>
            <input type="date" id="birth-date" class="calc-input">
          </div>
          <div class="calc-input-group">
            <label for="target-date">Target Date</label>
            <input type="date" id="target-date" class="calc-input">
          </div>
        </div>

        <div id="error-message" style="display: none; color: #ff6b6b; font-size: 0.9rem; margin-top: -0.5rem; margin-bottom: 1rem; font-family: monospace; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; padding: 0.5rem 0.75rem; border-radius: 4px;"></div>

        <div id="result" class="calc-result" style="display: none; margin-top: 1.5rem;">
          <div class="calc-result-item" style="grid-column: 1 / -1; background: rgba(255, 255, 255, 0.05); margin-bottom: 1.5rem; padding: 1rem; text-align: center; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08);">
            <span class="calc-result-label">Days Lived</span>
            <span class="calc-result-value" id="days-lived-val" style="font-size: 2.5rem; font-weight: 800;">0</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Physical Cycle -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <div>
                  <strong style="font-size: 1.1rem; color: #ff5e62;">💪 Physical Cycle</strong>
                  <div style="font-size: 0.8rem; opacity: 0.6;">23-day cycle: coordination, strength, stamina</div>
                </div>
                <div style="text-align: right;">
                  <span id="physical-pct" style="font-size: 1.3rem; font-weight: bold; display: block;">0%</span>
                  <span id="physical-status" style="font-size: 0.8rem; font-weight: bold;">-</span>
                </div>
              </div>
              <!-- Bar -->
              <div style="background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; overflow: hidden; position: relative; margin-top: 0.75rem;">
                <div id="physical-bar" style="background: linear-gradient(90deg, #ff9966, #ff5e62); width: 50%; height: 100%; transition: width 0.3s;"></div>
                <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1.5px; background: rgba(255,255,255,0.5);"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; opacity: 0.5; margin-top: 0.25rem;">
                <span>-100% (Low)</span>
                <span>0%</span>
                <span>+100% (Peak)</span>
              </div>
            </div>

            <!-- Emotional Cycle -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <div>
                  <strong style="font-size: 1.1rem; color: #00f2fe;">❤️ Emotional Cycle</strong>
                  <div style="font-size: 0.8rem; opacity: 0.6;">28-day cycle: mood, sensitivity, creativity</div>
                </div>
                <div style="text-align: right;">
                  <span id="emotional-pct" style="font-size: 1.3rem; font-weight: bold; display: block;">0%</span>
                  <span id="emotional-status" style="font-size: 0.8rem; font-weight: bold;">-</span>
                </div>
              </div>
              <!-- Bar -->
              <div style="background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; overflow: hidden; position: relative; margin-top: 0.75rem;">
                <div id="emotional-bar" style="background: linear-gradient(90deg, #4facfe, #00f2fe); width: 50%; height: 100%; transition: width 0.3s;"></div>
                <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1.5px; background: rgba(255,255,255,0.5);"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; opacity: 0.5; margin-top: 0.25rem;">
                <span>-100% (Low)</span>
                <span>0%</span>
                <span>+100% (Peak)</span>
              </div>
            </div>

            <!-- Intellectual Cycle -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <div>
                  <strong style="font-size: 1.1rem; color: #b180ff;">🧠 Intellectual Cycle</strong>
                  <div style="font-size: 0.8rem; opacity: 0.6;">33-day cycle: memory, analysis, alertness</div>
                </div>
                <div style="text-align: right;">
                  <span id="intellectual-pct" style="font-size: 1.3rem; font-weight: bold; display: block;">0%</span>
                  <span id="intellectual-status" style="font-size: 0.8rem; font-weight: bold;">-</span>
                </div>
              </div>
              <!-- Bar -->
              <div style="background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; overflow: hidden; position: relative; margin-top: 0.75rem;">
                <div id="intellectual-bar" style="background: linear-gradient(90deg, #b180ff, #ece2ff); width: 50%; height: 100%; transition: width 0.3s;"></div>
                <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1.5px; background: rgba(255,255,255,0.5);"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; opacity: 0.5; margin-top: 0.25rem;">
                <span>-100% (Low)</span>
                <span>0%</span>
                <span>+100% (Peak)</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📈 Biorhythm Cycles Science & Math</h3>
        <p>Biorhythms are cyclical rhythms of energy that supposedly govern human life, originating from birth. The theory posits three primary cycles:</p>
        <ul>
          <li><strong>Physical Cycle (23 days):</strong> Affects coordination, strength, stamina, and physical well-being.</li>
          <li><strong>Emotional Cycle (28 days):</strong> Governs mood, sensitivity, temperament, and emotional reactivity.</li>
          <li><strong>Intellectual Cycle (33 days):</strong> Rules memory, learning, mental alertness, logic, and analytical capabilities.</li>
        </ul>
        <p>Each cycle oscillates between Peak (active) and Low (regenerative) phases according to a sine wave starting at birth (0%):</p>
        <code>Percent = sin(2π × days / cycle_length) × 100</code>
        <p><strong>Critical Days:</strong> Days when the curve crosses the zero line (0%) are considered "critical days". During transitions, energy states are highly unstable, meaning you are more prone to errors, accidents, or sudden fluctuations in mood or energy.</p>
      </div>
    </div>
  `;

  return el;
}

export function mount() {
  const birthDateInput = document.getElementById('birth-date');
  const targetDateInput = document.getElementById('target-date');
  const errorMsg = document.getElementById('error-message');
  const resultDiv = document.getElementById('result');

  const daysLivedVal = document.getElementById('days-lived-val');

  const physicalPct = document.getElementById('physical-pct');
  const physicalStatus = document.getElementById('physical-status');
  const physicalBar = document.getElementById('physical-bar');

  const emotionalPct = document.getElementById('emotional-pct');
  const emotionalStatus = document.getElementById('emotional-status');
  const emotionalBar = document.getElementById('emotional-bar');

  const intellectualPct = document.getElementById('intellectual-pct');
  const intellectualStatus = document.getElementById('intellectual-status');
  const intellectualBar = document.getElementById('intellectual-bar');

  // Set default target date to today
  const today = new Date();
  targetDateInput.value = today.toISOString().split('T')[0];

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    resultDiv.style.display = 'none';
  }

  function hideError() {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
  }

  function getStatusLabel(val) {
    if (Math.abs(val) < 5) {
      return { text: '🚨 CRITICAL TRANSITION', color: '#ff6b6b' };
    }
    if (val > 0) {
      return { text: '📈 ACTIVE PEAK', color: '#4ebd74' };
    }
    return { text: '📉 REGENERATIVE LOW', color: '#3a86ff' };
  }

  function calculate() {
    hideError();

    if (!birthDateInput.value) {
      resultDiv.style.display = 'none';
      return;
    }

    const birth = new Date(birthDateInput.value);
    const target = new Date(targetDateInput.value);

    if (isNaN(birth.getTime())) {
      showError('Invalid Date of Birth.');
      return;
    }

    if (isNaN(target.getTime())) {
      showError('Invalid Target Date.');
      return;
    }

    // Set time component to noon to avoid daylight saving offsets issues
    birth.setHours(12, 0, 0, 0);
    target.setHours(12, 0, 0, 0);

    const diffMs = target - birth;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      showError('Target date must be on or after your date of birth.');
      return;
    }

    daysLivedVal.textContent = diffDays.toLocaleString('en-US');

    // Calculate Cycles
    const physVal = Math.sin(2 * Math.PI * diffDays / 23) * 100;
    const emotVal = Math.sin(2 * Math.PI * diffDays / 28) * 100;
    const intelVal = Math.sin(2 * Math.PI * diffDays / 33) * 100;

    // Update Physical display
    physicalPct.textContent = `${physVal >= 0 ? '+' : ''}${physVal.toFixed(0)}%`;
    const physStatusObj = getStatusLabel(physVal);
    physicalStatus.textContent = physStatusObj.text;
    physicalStatus.style.color = physStatusObj.color;
    physicalBar.style.width = `${(physVal + 100) / 2}%`;

    // Update Emotional display
    emotionalPct.textContent = `${emotVal >= 0 ? '+' : ''}${emotVal.toFixed(0)}%`;
    const emotStatusObj = getStatusLabel(emotVal);
    emotionalStatus.textContent = emotStatusObj.text;
    emotionalStatus.style.color = emotStatusObj.color;
    emotionalBar.style.width = `${(emotVal + 100) / 2}%`;

    // Update Intellectual display
    intellectualPct.textContent = `${intelVal >= 0 ? '+' : ''}${intelVal.toFixed(0)}%`;
    const intelStatusObj = getStatusLabel(intelVal);
    intellectualStatus.textContent = intelStatusObj.text;
    intellectualStatus.style.color = intelStatusObj.color;
    intellectualBar.style.width = `${(intelVal + 100) / 2}%`;

    resultDiv.style.display = 'block';
  }

  birthDateInput.addEventListener('input', calculate);
  targetDateInput.addEventListener('input', calculate);

  // Run calculation immediately if birth date is prefilled
  if (birthDateInput.value) {
    calculate();
  }

  return () => {
    birthDateInput.removeEventListener('input', calculate);
    targetDateInput.removeEventListener('input', calculate);
  };
}
