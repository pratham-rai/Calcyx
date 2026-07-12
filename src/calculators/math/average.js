export const meta = {
  slug: 'average',
  name: 'Average Calculator',
  title: 'Average Calculator - Calcyx',
  description: 'Calculate mean, median, mode, range, sum, and count from a list of numbers.',
  category: 'math',
  icon: '📊',
  keywords: ['average', 'mean', 'median', 'mode', 'range', 'sum', 'statistics', 'central tendency'],
  formula: 'Mean = Σx / n · Median = middle value · Mode = most frequent value',
  relatedSlugs: ['standard-deviation', 'percentage']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">📊</span>
        <h1 class="calc-title">Average Calculator</h1>
        <p class="calc-description">Enter a list of comma-separated numbers to instantly compute common statistical measures.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="avg-numbers">Numbers (comma-separated)</label>
          <input type="text" id="avg-numbers" class="calc-input" placeholder="10, 20, 30, 40, 50">
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="avg-mean"></div>
        <div class="calc-result-label">Mean (Average)</div>
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Median</div>
            <div class="calc-result-detail" id="avg-median"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Mode</div>
            <div class="calc-result-detail" id="avg-mode"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Range</div>
            <div class="calc-result-detail" id="avg-range"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Sum</div>
            <div class="calc-result-detail" id="avg-sum"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Count</div>
            <div class="calc-result-detail" id="avg-count"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Min / Max</div>
            <div class="calc-result-detail" id="avg-minmax"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📐 Formulas</h3>
        <code>Mean = (x₁ + x₂ + ... + xₙ) ÷ n</code>
        <code>Median = middle value when sorted</code>
        <code>Mode = most frequently occurring value(s)</code>
        <code>Range = max − min</code>
        <p>If there are an even number of values, the median is the average of the two middle values. If all values appear equally often, there is no mode.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const numbersInput = document.getElementById('avg-numbers');

  function parseNumbers(str) {
    return str.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number)
      .filter(n => !isNaN(n));
  }

  function getMode(arr) {
    const freq = {};
    arr.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    if (maxFreq === 1) return 'No mode';
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
    return modes.join(', ');
  }

  function calculate() {
    const nums = parseNumbers(numbersInput.value);
    if (nums.length === 0) {
      document.getElementById('result').style.display = 'none';
      return;
    }

    const sorted = [...nums].sort((a, b) => a - b);
    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    let median;
    if (n % 2 === 1) {
      median = sorted[Math.floor(n / 2)];
    } else {
      median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    }

    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;
    const mode = getMode(nums);

    document.getElementById('avg-mean').textContent = mean.toLocaleString(undefined, { maximumFractionDigits: 6 });
    document.getElementById('avg-median').textContent = median.toLocaleString(undefined, { maximumFractionDigits: 6 });
    document.getElementById('avg-mode').textContent = mode;
    document.getElementById('avg-range').textContent = range.toLocaleString(undefined, { maximumFractionDigits: 6 });
    document.getElementById('avg-sum').textContent = sum.toLocaleString(undefined, { maximumFractionDigits: 6 });
    document.getElementById('avg-count').textContent = n.toLocaleString();
    document.getElementById('avg-minmax').textContent = min.toLocaleString(undefined, { maximumFractionDigits: 6 }) + ' / ' + max.toLocaleString(undefined, { maximumFractionDigits: 6 });
    document.getElementById('result').style.display = '';
  }

  numbersInput.addEventListener('input', calculate);

  return () => {
    numbersInput.removeEventListener('input', calculate);
  };
}
