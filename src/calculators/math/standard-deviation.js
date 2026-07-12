export const meta = {
  slug: 'standard-deviation',
  name: 'Standard Deviation Calculator',
  title: 'Standard Deviation Calculator - Calcyx',
  description: 'Calculate population and sample standard deviation, variance, mean, and count from a dataset of numbers.',
  category: 'math',
  icon: '📉',
  keywords: ['standard deviation', 'variance', 'statistics', 'sigma', 'spread', 'dispersion', 'data analysis'],
  formula: 'σ = √(Σ(xᵢ − μ)² / N) · s = √(Σ(xᵢ − x̄)² / (n−1))',
  relatedSlugs: ['average', 'percentage']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">📉</span>
        <h1 class="calc-title">Standard Deviation Calculator</h1>
        <p class="calc-description">Enter a list of comma-separated numbers to calculate population and sample standard deviation, variance, and other statistics.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="sd-numbers">Numbers (comma-separated)</label>
          <input type="text" id="sd-numbers" class="calc-input" placeholder="4, 8, 6, 5, 3, 7, 2, 9">
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="sd-pop-sd"></div>
        <div class="calc-result-label">Population Standard Deviation (σ)</div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Sample SD (s)</div>
            <div class="calc-result-detail" id="sd-sample-sd"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Population Variance (σ²)</div>
            <div class="calc-result-detail" id="sd-pop-var"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Sample Variance (s²)</div>
            <div class="calc-result-detail" id="sd-sample-var"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Mean (μ)</div>
            <div class="calc-result-detail" id="sd-mean"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Count (N)</div>
            <div class="calc-result-detail" id="sd-count"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Sum of Squares</div>
            <div class="calc-result-detail" id="sd-ss"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📐 Formulas</h3>
        <code>Population SD: σ = √( Σ(xᵢ − μ)² / N )</code>
        <code>Sample SD: s = √( Σ(xᵢ − x̄)² / (n − 1) )</code>
        <p><strong>Population</strong> SD divides by N (the entire dataset). <strong>Sample</strong> SD divides by n−1 (Bessel's correction) to give an unbiased estimate when working with a sample from a larger population.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const numbersInput = document.getElementById('sd-numbers');

  function parseNumbers(str) {
    return str.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number)
      .filter(n => !isNaN(n));
  }

  function calculate() {
    const nums = parseNumbers(numbersInput.value);
    if (nums.length === 0) {
      document.getElementById('result').style.display = 'none';
      return;
    }

    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const sumOfSquares = nums.reduce((acc, x) => acc + (x - mean) * (x - mean), 0);
    const popVariance = sumOfSquares / n;
    const popSD = Math.sqrt(popVariance);

    const sampleVariance = n > 1 ? sumOfSquares / (n - 1) : 0;
    const sampleSD = Math.sqrt(sampleVariance);

    const fmt = (v) => v.toLocaleString(undefined, { maximumFractionDigits: 6 });

    document.getElementById('sd-pop-sd').textContent = fmt(popSD);
    document.getElementById('sd-sample-sd').textContent = n > 1 ? fmt(sampleSD) : 'N/A (need n ≥ 2)';
    document.getElementById('sd-pop-var').textContent = fmt(popVariance);
    document.getElementById('sd-sample-var').textContent = n > 1 ? fmt(sampleVariance) : 'N/A (need n ≥ 2)';
    document.getElementById('sd-mean').textContent = fmt(mean);
    document.getElementById('sd-count').textContent = n.toLocaleString();
    document.getElementById('sd-ss').textContent = fmt(sumOfSquares);
    document.getElementById('result').style.display = '';
  }

  numbersInput.addEventListener('input', calculate);

  return () => {
    numbersInput.removeEventListener('input', calculate);
  };
}
