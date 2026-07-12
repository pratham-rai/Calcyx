export const meta = {
  slug: 'gcd-lcm',
  name: 'GCD / LCM Calculator',
  title: 'GCD & LCM Calculator - Calcyx',
  description: 'Find the Greatest Common Divisor and Least Common Multiple of two or more numbers using the Euclidean algorithm.',
  category: 'math',
  icon: '🔢',
  keywords: ['gcd', 'lcm', 'greatest common divisor', 'least common multiple', 'euclidean', 'factors', 'hcf'],
  formula: 'GCD via Euclidean: gcd(a,b) = gcd(b, a mod b) · LCM(a,b) = |a × b| / GCD(a,b)',
  relatedSlugs: ['percentage', 'quadratic']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">🔢</span>
        <h1 class="calc-title">GCD / LCM Calculator</h1>
        <p class="calc-description">Enter two or more positive integers separated by commas to find their Greatest Common Divisor and Least Common Multiple.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="gl-numbers">Numbers (comma-separated)</label>
          <input type="text" id="gl-numbers" class="calc-input" placeholder="12, 18, 24">
        </div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">GCD</div>
            <div class="calc-result-value" id="gl-gcd"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">LCM</div>
            <div class="calc-result-value" id="gl-lcm"></div>
          </div>
        </div>
        <div class="calc-result-detail" id="gl-steps" style="margin-top:1rem; text-align:left; white-space:pre-line;"></div>
      </div>
      <div class="calc-formula">
        <h3>📐 Euclidean Algorithm</h3>
        <code>gcd(a, b) = gcd(b, a mod b), until b = 0</code>
        <code>LCM(a, b) = |a × b| / GCD(a, b)</code>
        <p>For multiple numbers, GCD and LCM are computed iteratively: gcd(a, b, c) = gcd(gcd(a, b), c) and similarly for LCM.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const numbersInput = document.getElementById('gl-numbers');

  function gcdTwo(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    const steps = [];
    const origA = a;
    const origB = b;
    while (b !== 0) {
      const remainder = a % b;
      steps.push('gcd(' + a + ', ' + b + ') → ' + a + ' mod ' + b + ' = ' + remainder);
      a = b;
      b = remainder;
    }
    steps.push('gcd(' + origA + ', ' + origB + ') = ' + a);
    return { result: a, steps };
  }

  function lcmTwo(a, b) {
    const g = gcdTwo(a, b).result;
    return g === 0 ? 0 : Math.abs(a * b) / g;
  }

  function calculate() {
    const parts = numbersInput.value.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number)
      .filter(n => !isNaN(n) && Number.isInteger(n) && n > 0);

    if (parts.length < 2) {
      document.getElementById('result').style.display = 'none';
      return;
    }

    let currentGcd = parts[0];
    let currentLcm = parts[0];
    const allSteps = [];

    for (let i = 1; i < parts.length; i++) {
      const { result, steps } = gcdTwo(currentGcd, parts[i]);
      if (parts.length <= 4) {
        allSteps.push('— Step ' + i + ': gcd(' + currentGcd + ', ' + parts[i] + ')');
        steps.forEach(s => allSteps.push('  ' + s));
      }
      currentGcd = result;
      currentLcm = lcmTwo(currentLcm, parts[i]);
    }

    if (parts.length > 4) {
      allSteps.push('(Step-by-step shown for ≤ 4 numbers)');
    }

    document.getElementById('gl-gcd').textContent = currentGcd.toLocaleString();
    document.getElementById('gl-lcm').textContent = currentLcm.toLocaleString();
    document.getElementById('gl-steps').textContent = allSteps.join('\n');
    document.getElementById('result').style.display = '';
  }

  numbersInput.addEventListener('input', calculate);

  return () => {
    numbersInput.removeEventListener('input', calculate);
  };
}
