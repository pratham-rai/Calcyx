export const meta = {
  slug: 'quadratic',
  name: 'Quadratic Equation Solver',
  title: 'Quadratic Equation Solver - Calcyx',
  description: 'Solve quadratic equations ax² + bx + c = 0 and find discriminant, roots (real or complex), vertex, and axis of symmetry.',
  category: 'math',
  icon: '📈',
  keywords: ['quadratic', 'equation', 'roots', 'discriminant', 'vertex', 'parabola', 'complex roots', 'algebra'],
  formula: 'x = (−b ± √(b² − 4ac)) / 2a',
  relatedSlugs: ['gcd-lcm', 'standard-deviation']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">📈</span>
        <h1 class="calc-title">Quadratic Equation Solver</h1>
        <p class="calc-description">Enter the coefficients a, b, and c of the equation ax² + bx + c = 0 to find its roots and properties.</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="quad-a">a (x² coefficient)</label>
            <input type="number" id="quad-a" class="calc-input" placeholder="1" step="any">
          </div>
          <div class="calc-input-group">
            <label for="quad-b">b (x coefficient)</label>
            <input type="number" id="quad-b" class="calc-input" placeholder="-5" step="any">
          </div>
          <div class="calc-input-group">
            <label for="quad-c">c (constant)</label>
            <input type="number" id="quad-c" class="calc-input" placeholder="6" step="any">
          </div>
        </div>
        <div class="calc-result-detail" id="quad-equation" style="text-align:center; font-size:1.1rem; margin-top:0.5rem;"></div>
      </div>
      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-grid">
          <div class="calc-result-item">
            <div class="calc-result-label">Discriminant (Δ)</div>
            <div class="calc-result-value" id="quad-disc"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Nature of Roots</div>
            <div class="calc-result-detail" id="quad-nature"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Root x₁</div>
            <div class="calc-result-value" id="quad-x1"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Root x₂</div>
            <div class="calc-result-value" id="quad-x2"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Vertex</div>
            <div class="calc-result-detail" id="quad-vertex"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Axis of Symmetry</div>
            <div class="calc-result-detail" id="quad-axis"></div>
          </div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>📐 Quadratic Formula</h3>
        <code>x = (−b ± √(b² − 4ac)) / 2a</code>
        <code>Discriminant Δ = b² − 4ac</code>
        <code>Vertex = (−b/2a, −Δ/4a)</code>
        <p>If Δ &gt; 0: two distinct real roots. If Δ = 0: one repeated real root. If Δ &lt; 0: two complex conjugate roots.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const aInput = document.getElementById('quad-a');
  const bInput = document.getElementById('quad-b');
  const cInput = document.getElementById('quad-c');

  function formatNum(n) {
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  function formatEquation(a, b, c) {
    let str = '';
    if (a === 1) str += 'x²';
    else if (a === -1) str += '−x²';
    else str += a + 'x²';

    if (b > 0) str += ' + ' + (b === 1 ? '' : b) + 'x';
    else if (b < 0) str += ' − ' + (b === -1 ? '' : Math.abs(b)) + 'x';

    if (c > 0) str += ' + ' + c;
    else if (c < 0) str += ' − ' + Math.abs(c);

    str += ' = 0';
    return str;
  }

  function calculate() {
    const a = parseFloat(aInput.value);
    const b = parseFloat(bInput.value);
    const c = parseFloat(cInput.value);

    const eqEl = document.getElementById('quad-equation');

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      document.getElementById('result').style.display = 'none';
      eqEl.textContent = '';
      return;
    }

    eqEl.textContent = formatEquation(a, b, c);

    if (a === 0) {
      document.getElementById('result').style.display = 'none';
      eqEl.textContent = 'Coefficient "a" cannot be zero for a quadratic equation.';
      return;
    }

    const disc = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = -disc / (4 * a);

    document.getElementById('quad-disc').textContent = formatNum(disc);
    document.getElementById('quad-axis').textContent = 'x = ' + formatNum(vertexX);
    document.getElementById('quad-vertex').textContent = '(' + formatNum(vertexX) + ', ' + formatNum(vertexY) + ')';

    if (disc > 0) {
      const sqrtDisc = Math.sqrt(disc);
      const x1 = (-b + sqrtDisc) / (2 * a);
      const x2 = (-b - sqrtDisc) / (2 * a);
      document.getElementById('quad-nature').textContent = 'Two distinct real roots (Δ > 0)';
      document.getElementById('quad-x1').textContent = formatNum(x1);
      document.getElementById('quad-x2').textContent = formatNum(x2);
    } else if (disc === 0) {
      const x = -b / (2 * a);
      document.getElementById('quad-nature').textContent = 'One repeated real root (Δ = 0)';
      document.getElementById('quad-x1').textContent = formatNum(x);
      document.getElementById('quad-x2').textContent = formatNum(x);
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(Math.abs(disc)) / (2 * a);
      document.getElementById('quad-nature').textContent = 'Two complex conjugate roots (Δ < 0)';
      document.getElementById('quad-x1').textContent = formatNum(realPart) + ' + ' + formatNum(Math.abs(imagPart)) + 'i';
      document.getElementById('quad-x2').textContent = formatNum(realPart) + ' − ' + formatNum(Math.abs(imagPart)) + 'i';
    }

    document.getElementById('result').style.display = '';
  }

  const inputs = [aInput, bInput, cInput];
  inputs.forEach(el => el.addEventListener('input', calculate));

  return () => {
    inputs.forEach(el => el.removeEventListener('input', calculate));
  };
}
