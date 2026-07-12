export const meta = {
  slug: 'z-score',
  name: 'Z-Score Calculator',
  title: 'Z-Score Calculator - Calcyx',
  description: 'Calculate the Z-score of a raw value, find the normal distribution probability CDF, and analyze two-tailed statistics.',
  category: 'math',
  icon: '📊',
  keywords: ['z-score', 'statistics', 'normal distribution', 'standard score', 'p-value', 'mean', 'standard deviation', 'probability'],
  formula: 'z = (x − μ) / σ',
  relatedSlugs: ['standard-deviation', 'average']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">📊</span>
        <h1 class="calc-title">Z-Score Calculator</h1>
        <p class="calc-description">Find the Z-score (standard score) for a raw value given the population mean and standard deviation, along with its normal distribution probabilities.</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="z-x">Raw Score (x)</label>
            <input type="number" id="z-x" class="calc-input" placeholder="e.g., 85" step="any" value="85">
          </div>
          <div class="calc-input-group">
            <label for="z-mean">Population Mean (μ)</label>
            <input type="number" id="z-mean" class="calc-input" placeholder="e.g., 70" step="any" value="70">
          </div>
          <div class="calc-input-group">
            <label for="z-sd">Std Deviation (σ)</label>
            <input type="number" id="z-sd" class="calc-input" placeholder="e.g., 10" step="any" value="10">
          </div>
        </div>
        <div id="z-error" class="calc-result-detail" style="color: #ef4444; margin-top: 0.5rem; display: none;"></div>
      </div>
      
      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <!-- Z-Score Value -->
          <div class="calc-result-item" style="grid-column: span 3; padding: 1rem;">
            <div class="calc-result-label">Calculated Z-Score</div>
            <div class="calc-result-value" id="z-score-val" style="font-size: 2.5rem;"></div>
            <div class="calc-result-detail" id="z-score-interpretation" style="font-weight: 500; margin-top: 0.25rem;"></div>
          </div>
          
          <!-- P(Z < z) -->
          <div class="calc-result-item">
            <div class="calc-result-label">P(Z &lt; z)</div>
            <div class="calc-result-value" id="z-prob-left" style="font-size: 1.5rem; min-height: 2rem;"></div>
            <div class="calc-result-detail">Left-tailed (Cumulative)</div>
          </div>
          
          <!-- P(Z > z) -->
          <div class="calc-result-item">
            <div class="calc-result-label">P(Z &gt; z)</div>
            <div class="calc-result-value" id="z-prob-right" style="font-size: 1.5rem; min-height: 2rem;"></div>
            <div class="calc-result-detail">Right-tailed</div>
          </div>
          
          <!-- P(-|z| < Z < |z|) -->
          <div class="calc-result-item">
            <div class="calc-result-label">P(−|z| &lt; Z &lt; |z|)</div>
            <div class="calc-result-value" id="z-prob-between" style="font-size: 1.5rem; min-height: 2rem;"></div>
            <div class="calc-result-detail">Two-sided (Middle Area)</div>
          </div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>📐 Z-Score Formulas &amp; Normal Distribution</h3>
        <p>A Z-score indicates how many standard deviations a raw score is from the population mean.</p>
        <code>z = (x − μ) / σ</code>
        <p>Where:</p>
        <ul>
          <li><strong>x</strong> is the raw score</li>
          <li><strong>μ</strong> (mu) is the population mean</li>
          <li><strong>σ</strong> (sigma) is the standard deviation</li>
        </ul>
        <p><strong>Probability Interpretations:</strong></p>
        <ul>
          <li><strong>P(Z &lt; z):</strong> The percentage of the population scoring below your raw score.</li>
          <li><strong>P(Z &gt; z):</strong> The percentage of the population scoring above your raw score.</li>
          <li><strong>P(−|z| &lt; Z &lt; |z|):</strong> The percentage of the population that falls within <code>|z|</code> standard deviations of the mean.</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const xInput = document.getElementById('z-x');
  const meanInput = document.getElementById('z-mean');
  const sdInput = document.getElementById('z-sd');
  
  const errorEl = document.getElementById('z-error');
  const resultEl = document.getElementById('result');
  const scoreValEl = document.getElementById('z-score-val');
  const interpretationEl = document.getElementById('z-score-interpretation');
  const probLeftEl = document.getElementById('z-prob-left');
  const probRightEl = document.getElementById('z-prob-right');
  const probBetweenEl = document.getElementById('z-prob-between');

  function formatNum(n) {
    if (Math.abs(n) < 1e-9) return '0';
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }

  function formatPercent(val) {
    return (val * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
  }

  function stdNormalCDF(z) {
    const absZ = Math.abs(z);
    const p = 0.2316419;
    const b1 = 0.319381530;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;
    
    const t = 1 / (1 + p * absZ);
    const cdf = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * absZ * absZ) * 
                (b1 * t + b2 * t * t + b3 * Math.pow(t, 3) + b4 * Math.pow(t, 4) + b5 * Math.pow(t, 5));
                
    return z >= 0 ? cdf : 1 - cdf;
  }

  function calculate() {
    const x = parseFloat(xInput.value);
    const mean = parseFloat(meanInput.value);
    const sd = parseFloat(sdInput.value);
    
    errorEl.style.display = 'none';
    errorEl.textContent = '';
    
    if (isNaN(x) || isNaN(mean) || isNaN(sd)) {
      resultEl.style.display = 'none';
      return;
    }
    
    if (sd <= 0) {
      errorEl.textContent = 'Error: Standard Deviation (σ) must be strictly greater than 0.';
      errorEl.style.display = 'block';
      resultEl.style.display = 'none';
      return;
    }
    
    const z = (x - mean) / sd;
    const pLeft = stdNormalCDF(z);
    const pRight = 1 - pLeft;
    const pBetween = 2 * stdNormalCDF(Math.abs(z)) - 1;
    
    scoreValEl.textContent = formatNum(z);
    
    const formattedZ = formatNum(Math.abs(z));
    if (z === 0) {
      interpretationEl.textContent = 'Your score is exactly equal to the mean.';
    } else if (z > 0) {
      interpretationEl.textContent = `Your score is ${formattedZ} standard deviations above the mean.`;
    } else {
      interpretationEl.textContent = `Your score is ${formattedZ} standard deviations below the mean.`;
    }
    
    probLeftEl.textContent = formatPercent(pLeft);
    probRightEl.textContent = formatPercent(pRight);
    probBetweenEl.textContent = formatPercent(pBetween);
    
    resultEl.style.display = '';
  }

  const inputs = [xInput, meanInput, sdInput];
  inputs.forEach(el => el.addEventListener('input', calculate));
  
  // Initial run
  calculate();
  
  return () => {
    inputs.forEach(el => el.removeEventListener('input', calculate));
  };
}
