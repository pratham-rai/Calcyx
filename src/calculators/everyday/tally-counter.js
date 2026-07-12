export const meta = {
  slug: 'tally-counter',
  name: 'Tally Counter',
  title: 'Tally Counter - Calcyx',
  description: 'Keep count of items, events, or habits. Supports custom increments, target goals, progress tracking, and persistence.',
  category: 'everyday',
  icon: '🔢',
  keywords: ['tally', 'counter', 'count', 'clicker', 'tracker', 'increment', 'decrement', 'goal'],
  formula: 'Count = Previous Count ± Step Size',
  relatedSlugs: ['average', 'percentage']
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
        <!-- Display Card -->
        <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 12px; text-align: center; margin-bottom: 1.5rem;">
          <div id="counter-value" style="font-size: 5rem; font-weight: bold; line-height: 1; margin: 1rem 0; color: #fff; text-shadow: 0 0 20px rgba(255, 255, 255, 0.2); user-select: none;">0</div>
        </div>

        <!-- Controls -->
        <div class="calc-row" style="gap: 1rem; margin-bottom: 1rem;">
          <button id="btn-dec" class="calc-input" style="font-size: 2.2rem; cursor: pointer; flex: 1; height: 60px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; transition: all 0.1s; user-select: none;">−</button>
          <button id="btn-inc" class="calc-input" style="font-size: 2.2rem; cursor: pointer; flex: 2; height: 60px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 12px; transition: all 0.1s; font-weight: bold; user-select: none;">+</button>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <button id="btn-reset" class="calc-input" style="cursor: pointer; width: 100%; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; font-weight: 500; font-size: 0.95rem;">🔄 Reset Counter</button>
        </div>

        <!-- Configuration -->
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="counter-step">Step Size</label>
            <input type="number" id="counter-step" class="calc-input" value="1" min="0.0001" step="any" placeholder="1">
          </div>
          <div class="calc-input-group">
            <label for="counter-goal">Target Goal (Optional)</label>
            <input type="number" id="counter-goal" class="calc-input" min="1" step="1" placeholder="e.g. 100">
          </div>
        </div>

        <!-- Goal Progress Result Area -->
        <div id="result" class="calc-result" style="display:none; margin-top: 1.5rem;">
          <div class="calc-result-value" id="progress-percent">0%</div>
          <div class="calc-result-label">Goal Progress</div>
          
          <div style="width: 100%; height: 12px; background: rgba(255, 255, 255, 0.08); border-radius: 6px; overflow: hidden; margin: 0.75rem 0; border: 1px solid rgba(255, 255, 255, 0.05);">
            <div id="progress-bar-fill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%); transition: width 0.2s ease;"></div>
          </div>
          <div class="calc-result-detail" id="progress-detail">Remaining: 0</div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Count = Current Value ± Step Size</code>
        <code>Progress % = (Current Value ÷ Target Goal) × 100</code>
        <p>The counter stores the current value in local state. If a Target Goal is defined, the progress bar indicates progress toward the goal. The counter value persists even if you reload the page.</p>
      </div>
    </div>
  `;

  return el;
}

export function mount() {
  const valueDisplay = document.getElementById('counter-value');
  const btnInc = document.getElementById('btn-inc');
  const btnDec = document.getElementById('btn-dec');
  const btnReset = document.getElementById('btn-reset');
  const stepInput = document.getElementById('counter-step');
  const goalInput = document.getElementById('counter-goal');
  
  const resultDiv = document.getElementById('result');
  const progressPercent = document.getElementById('progress-percent');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressDetail = document.getElementById('progress-detail');

  let count = 0;

  // Load persisted value
  try {
    const saved = localStorage.getItem('calcyx-tally-count');
    if (saved !== null) {
      count = parseFloat(saved);
      if (isNaN(count)) count = 0;
    }
  } catch (e) {
    // Ignore localStorage blockages
  }

  function saveCount() {
    try {
      localStorage.setItem('calcyx-tally-count', count.toString());
    } catch (e) {}
  }

  function updateUI() {
    valueDisplay.textContent = count.toLocaleString(undefined, { maximumFractionDigits: 4 });

    const step = parseFloat(stepInput.value) || 1;
    const goal = parseInt(goalInput.value, 10);

    if (isNaN(goal) || goal <= 0) {
      resultDiv.style.display = 'none';
      return;
    }

    resultDiv.style.display = '';
    const progress = (count / goal) * 100;
    const boundedProgress = Math.max(0, Math.min(100, progress));
    
    progressPercent.textContent = `${Math.round(progress)}%`;
    progressBarFill.style.width = `${boundedProgress}%`;

    const remaining = goal - count;
    if (remaining <= 0) {
      progressDetail.innerHTML = '🎉 Goal reached! ' + (remaining < 0 ? `Exceeded by ${Math.abs(remaining).toLocaleString()}` : '');
    } else {
      progressDetail.textContent = `Remaining: ${remaining.toLocaleString(undefined, { maximumFractionDigits: 4 })} to reach goal of ${goal.toLocaleString()}`;
    }
  }

  function handleIncrement() {
    const step = parseFloat(stepInput.value);
    count += isNaN(step) || step <= 0 ? 1 : step;
    saveCount();
    updateUI();
  }

  function handleDecrement() {
    const step = parseFloat(stepInput.value);
    count -= isNaN(step) || step <= 0 ? 1 : step;
    saveCount();
    updateUI();
  }

  function handleReset() {
    if (confirm('Are you sure you want to reset the counter to 0?')) {
      count = 0;
      saveCount();
      updateUI();
    }
  }

  btnInc.addEventListener('click', handleIncrement);
  btnDec.addEventListener('click', handleDecrement);
  btnReset.addEventListener('click', handleReset);
  stepInput.addEventListener('input', updateUI);
  goalInput.addEventListener('input', updateUI);

  // Initial draw
  updateUI();

  return () => {
    btnInc.removeEventListener('click', handleIncrement);
    btnDec.removeEventListener('click', handleDecrement);
    btnReset.removeEventListener('click', handleReset);
    stepInput.removeEventListener('input', updateUI);
    goalInput.removeEventListener('input', updateUI);
  };
}
