export const meta = {
  slug: 'percent-error',
  name: 'Percent Error Calculator',
  title: 'Percent Error Calculator - Calcyx',
  description: 'Calculate the percentage difference between an experimental (observed) value and a theoretical (actual) value, with full step-by-step math.',
  category: 'everyday',
  icon: '🎯',
  keywords: ['percent error', 'experimental value', 'theoretical value', 'observed value', 'actual value', 'percentage error', 'accuracy'],
  formula: 'Percent Error = (|Observed - Actual| / |Actual|) * 100%',
  relatedSlugs: ['percentage', 'average']
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
            <label for="theoretical">Theoretical Value (Actual)</label>
            <input type="number" id="theoretical" class="calc-input" value="10" step="any" placeholder="e.g., 10">
          </div>
          <div class="calc-input-group">
            <label for="experimental">Experimental Value (Observed)</label>
            <input type="number" id="experimental" class="calc-input" value="9.8" step="any" placeholder="e.g., 9.8">
          </div>
        </div>

        <div id="error-message" style="display: none; color: #ff6b6b; font-size: 0.9rem; margin-bottom: 1rem; font-family: monospace; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; padding: 0.5rem 0.75rem; border-radius: 4px;"></div>

        <div id="result" class="calc-result" style="display: none;">
          <div class="calc-result-value" id="percent-error-display"></div>
          <div class="calc-result-label">Percent Error</div>
          
          <div class="calc-formula" style="background: rgba(255, 255, 255, 0.03); margin-top: 1.5rem; border-left: 3px solid var(--accent, #6366f1);">
            <h3 style="margin-top: 0;">🔢 Step-by-Step Calculation</h3>
            <div id="step-breakdown" style="font-family: monospace; font-size: 0.95rem; line-height: 1.6; color: #e2e8f0;"></div>
          </div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>📚 What is Percent Error?</h3>
        <code>Percent Error = (|Experimental - Theoretical| / |Theoretical|) × 100%</code>
        <p>Percent error measures the accuracy of an experimental measurement compared to the true, accepted, or theoretical value. It shows how large the discrepancy is relative to the actual size of the measurement.</p>
        <ul>
          <li><strong>Experimental Value:</strong> The value obtained from a lab experiment, survey, or observation.</li>
          <li><strong>Theoretical Value:</strong> The accepted standard, true value, or predicted value.</li>
          <li><strong>Absolute Difference:</strong> We take the absolute value of the difference (represented by <code>| |</code>), which means the percent error is always expressed as a positive percentage indicating the magnitude of the error.</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const theoreticalInput = document.getElementById('theoretical');
  const experimentalInput = document.getElementById('experimental');
  const errorMsg = document.getElementById('error-message');
  const resultDiv = document.getElementById('result');
  const errorDisplay = document.getElementById('percent-error-display');
  const stepBreakdown = document.getElementById('step-breakdown');

  function calculate() {
    const theoreticalVal = theoreticalInput.value;
    const experimentalVal = experimentalInput.value;

    if (theoreticalVal === '' || experimentalVal === '') {
      resultDiv.style.display = 'none';
      errorMsg.style.display = 'none';
      return;
    }

    const t = parseFloat(theoreticalVal);
    const e = parseFloat(experimentalVal);

    if (isNaN(t) || isNaN(e)) {
      resultDiv.style.display = 'none';
      errorMsg.style.display = 'none';
      return;
    }

    if (t === 0) {
      errorMsg.textContent = 'Error: Theoretical value cannot be zero because division by zero is undefined.';
      errorMsg.style.display = 'block';
      resultDiv.style.display = 'none';
      return;
    }

    errorMsg.style.display = 'none';

    // Math steps
    const diff = Math.abs(e - t);
    const ratio = diff / Math.abs(t);
    const percentError = ratio * 100;

    // Formatting outputs
    const formattedDiff = diff.toLocaleString(undefined, { maximumFractionDigits: 6 });
    const formattedTheoretical = Math.abs(t).toLocaleString(undefined, { maximumFractionDigits: 6 });
    const formattedRatio = ratio.toLocaleString(undefined, { maximumFractionDigits: 8 });
    const formattedPercent = percentError.toLocaleString(undefined, { maximumFractionDigits: 4 });

    errorDisplay.textContent = `${formattedPercent}%`;

    // Detailed step-by-step
    stepBreakdown.innerHTML = `
      <strong>Step 1: Calculate the absolute difference between values:</strong><br>
      &nbsp;&nbsp;|Experimental - Theoretical| = |${e} - ${t}| = |${(e - t).toFixed(6).replace(/\.?0+$/, '')}| = <strong>${formattedDiff}</strong><br><br>
      
      <strong>Step 2: Divide by the absolute theoretical value:</strong><br>
      &nbsp;&nbsp;Difference / |Theoretical| = ${formattedDiff} / |${t}| = ${formattedDiff} / ${formattedTheoretical} = <strong>${formattedRatio}</strong><br><br>
      
      <strong>Step 3: Convert to a percentage:</strong><br>
      &nbsp;&nbsp;Relative Error × 100% = ${formattedRatio} × 100% = <strong>${formattedPercent}%</strong>
    `;

    resultDiv.style.display = 'block';
  }

  theoreticalInput.addEventListener('input', calculate);
  experimentalInput.addEventListener('input', calculate);

  calculate();

  return () => {
    theoreticalInput.removeEventListener('input', calculate);
    experimentalInput.removeEventListener('input', calculate);
  };
}
