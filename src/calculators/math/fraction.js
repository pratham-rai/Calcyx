export const meta = {
  slug: 'fraction',
  name: 'Fraction Calculator',
  title: 'Fraction Calculator - Calcyx',
  description: 'Add, subtract, multiply, and divide fractions and mixed numbers. Get simplified fraction, improper fraction, and decimal results with step-by-step workings.',
  category: 'math',
  icon: '🧮',
  keywords: ['fraction', 'mixed fraction', 'improper fraction', 'fraction math', 'simplify fraction', 'fraction solver'],
  formula: 'a/b ± c/d = (ad ± bc)/bd · a/b × c/d = ac/bd · a/b ÷ c/d = ad/bc',
  relatedSlugs: ['percentage', 'average']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">🧮</span>
        <h1 class="calc-title">Fraction Calculator</h1>
        <p class="calc-description">Perform arithmetic operations on fractions and mixed numbers with detailed step-by-step simplification.</p>
      </div>
      <div class="calc-body">
        <!-- Fraction 1 Group -->
        <h3 style="margin-bottom: 0.5rem; font-size: 1rem; opacity: 0.9;">Fraction 1</h3>
        <div class="calc-row" style="margin-bottom: 1.5rem;">
          <div class="calc-input-group" style="flex: 1;">
            <label for="frac-w1">Whole</label>
            <input type="number" id="frac-w1" class="calc-input" placeholder="e.g. 1" step="1">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="frac-n1">Numerator</label>
            <input type="number" id="frac-n1" class="calc-input" placeholder="e.g. 1" step="1">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="frac-d1">Denominator</label>
            <input type="number" id="frac-d1" class="calc-input" placeholder="e.g. 2" step="1">
          </div>
        </div>

        <!-- Operator Selection -->
        <div class="calc-input-group" style="margin-bottom: 1.5rem; max-width: 150px;">
          <label for="frac-op">Operation</label>
          <select id="frac-op" class="calc-select">
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="*">×</option>
            <option value="/">÷</option>
          </select>
        </div>

        <!-- Fraction 2 Group -->
        <h3 style="margin-bottom: 0.5rem; font-size: 1rem; opacity: 0.9;">Fraction 2</h3>
        <div class="calc-row" style="margin-bottom: 1.5rem;">
          <div class="calc-input-group" style="flex: 1;">
            <label for="frac-w2">Whole</label>
            <input type="number" id="frac-w2" class="calc-input" placeholder="e.g. 2" step="1">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="frac-n2">Numerator</label>
            <input type="number" id="frac-n2" class="calc-input" placeholder="e.g. 3" step="1">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="frac-d2">Denominator</label>
            <input type="number" id="frac-d2" class="calc-input" placeholder="e.g. 4" step="1">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="frac-result-mixed"></div>
        <div class="calc-result-label">Result (Mixed Number)</div>
        <div class="calc-result-grid" style="margin-top: 1rem;">
          <div class="calc-result-item">
            <div class="calc-result-label">Improper Fraction</div>
            <div class="calc-result-detail" id="frac-result-improper" style="font-size: 1.2rem; font-weight: 600;"></div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Decimal Value</div>
            <div class="calc-result-detail" id="frac-result-decimal" style="font-size: 1.2rem; font-weight: 600;"></div>
          </div>
        </div>
        <div class="calc-result-detail" id="frac-steps" style="margin-top: 1.5rem; text-align: left; white-space: pre-line; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; line-height: 1.5;"></div>
      </div>

      <div class="calc-formula">
        <h3>📐 Fraction Arithmetic Formulas</h3>
        <code>Addition: a/b + c/d = (ad + bc)/bd</code>
        <code>Subtraction: a/b - c/d = (ad - bc)/bd</code>
        <code>Multiplication: a/b × c/d = (a × c) / (b × d)</code>
        <code>Division: a/b ÷ c/d = (a × d) / (b × c)</code>
        <p>Mixed numbers are first converted into improper fractions: <code>w n/d = (w × d + n)/d</code>. The operation is then performed on the improper fractions and simplified using the Greatest Common Divisor (GCD).</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const ids = ['frac-w1', 'frac-n1', 'frac-d1', 'frac-op', 'frac-w2', 'frac-n2', 'frac-d2'];
  const inputs = ids.map(id => document.getElementById(id));

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  function parseFraction(wStr, nStr, dStr) {
    let w = parseInt(wStr) || 0;
    let n = parseInt(nStr) || 0;
    let d = parseInt(dStr);

    if (isNaN(d)) {
      // If denominator is omitted but numerator is present, assume 1
      d = nStr ? 1 : 1;
    }
    if (d === 0) return null;

    let sign = 1;
    if (w < 0) {
      sign = -1;
      w = Math.abs(w);
    }
    if (n < 0) {
      sign *= -1;
      n = Math.abs(n);
    }
    if (d < 0) {
      sign *= -1;
      d = Math.abs(d);
    }

    const num = sign * (w * d + n);
    const den = d;
    return { num, den, original: { w, n, d, isNegative: sign < 0 } };
  }

  function simplify(num, den) {
    if (den === 0) return null;
    if (num === 0) return { num: 0, den: 1, w: 0, n: 0, d: 1 };

    const g = gcd(num, den);
    let sNum = num / g;
    let sDen = den / g;

    if (sDen < 0) {
      sNum = -sNum;
      sDen = -sDen;
    }

    const sign = sNum < 0 ? -1 : 1;
    const absNum = Math.abs(sNum);

    const w = Math.floor(absNum / sDen);
    const n = absNum % sDen;

    return {
      num: sNum,
      den: sDen,
      w: sign * w,
      n: n,
      d: sDen
    };
  }

  function formatMixed(fraction) {
    if (!fraction) return '';
    const { w, n, d, num } = fraction;
    if (w === 0 && n === 0) return '0';

    let parts = [];
    if (w !== 0) {
      parts.push(w);
    }
    if (n !== 0) {
      const prefix = (w === 0 && num < 0) ? '-' : '';
      parts.push(prefix + n + '/' + d);
    }
    return parts.join(' ');
  }

  function calculate() {
    const w1 = document.getElementById('frac-w1').value;
    const n1 = document.getElementById('frac-n1').value;
    const d1 = document.getElementById('frac-d1').value;
    const op = document.getElementById('frac-op').value;
    const w2 = document.getElementById('frac-w2').value;
    const n2 = document.getElementById('frac-n2').value;
    const d2 = document.getElementById('frac-d2').value;

    // Check if at least some inputs are provided to prevent empty calculations
    if (!w1 && !n1 && !d1 && !w2 && !n2 && !d2) {
      document.getElementById('result').style.display = 'none';
      return;
    }

    const f1 = parseFraction(w1, n1, d1);
    const f2 = parseFraction(w2, n2, d2);

    const resultDiv = document.getElementById('result');
    const stepsDiv = document.getElementById('frac-steps');

    if (!f1 || !f2) {
      resultDiv.style.display = '';
      document.getElementById('frac-result-mixed').textContent = 'Error';
      document.getElementById('frac-result-improper').textContent = 'N/A';
      document.getElementById('frac-result-decimal').textContent = 'N/A';
      stepsDiv.textContent = 'Error: Denominator cannot be zero.';
      return;
    }

    // Step calculations
    let steps = [];
    
    // Step 1: Improper Fractions conversion
    const formatImproperStr = (f) => `${f.num}/${f.den}`;
    const formatMixedStr = (w, n, d, isNeg) => {
      if (w === 0 && n === 0) return '0';
      const sign = isNeg ? '-' : '';
      if (w === 0) return `${sign}${n}/${d}`;
      if (n === 0) return `${sign}${w}`;
      return `${sign}${w} ${n}/${d}`;
    };

    const f1StrMixed = formatMixedStr(f1.original.w, f1.original.n, f1.original.d, f1.original.isNegative);
    const f2StrMixed = formatMixedStr(f2.original.w, f2.original.n, f2.original.d, f2.original.isNegative);

    steps.push(`📝 Step 1: Convert to improper fractions
• Fraction 1: ${f1StrMixed} = ${formatImproperStr(f1)}
• Fraction 2: ${f2StrMixed} = ${formatImproperStr(f2)}`);

    let resNum, resDen;
    let opSymbol = op;
    if (op === '*') opSymbol = '×';
    if (op === '/') opSymbol = '÷';

    steps.push(`\n📝 Step 2: Set up the equation
• ${formatImproperStr(f1)} ${opSymbol} ${formatImproperStr(f2)}`);

    if (op === '+') {
      resNum = f1.num * f2.den + f2.num * f1.den;
      resDen = f1.den * f2.den;
      steps.push(`\n📝 Step 3: Find a common denominator and add
• (${f1.num} × ${f2.den}) / (${f1.den} × ${f2.den}) + (${f2.num} × ${f1.den}) / (${f2.den} × ${f1.den})
• ${f1.num * f2.den}/${resDen} + ${f2.num * f1.den}/${resDen}
• = ${resNum}/${resDen}`);
    } else if (op === '-') {
      resNum = f1.num * f2.den - f2.num * f1.den;
      resDen = f1.den * f2.den;
      steps.push(`\n📝 Step 3: Find a common denominator and subtract
• (${f1.num} × ${f2.den}) / (${f1.den} × ${f2.den}) - (${f2.num} × ${f1.den}) / (${f2.den} × ${f1.den})
• ${f1.num * f2.den}/${resDen} - ${f2.num * f1.den}/${resDen}
• = ${resNum}/${resDen}`);
    } else if (op === '*') {
      resNum = f1.num * f2.num;
      resDen = f1.den * f2.den;
      steps.push(`\n📝 Step 3: Multiply numerators and denominators
• (${f1.num} × ${f2.num}) / (${f1.den} × ${f2.den})
• = ${resNum}/${resDen}`);
    } else if (op === '/') {
      if (f2.num === 0) {
        resultDiv.style.display = '';
        document.getElementById('frac-result-mixed').textContent = 'Error';
        document.getElementById('frac-result-improper').textContent = 'N/A';
        document.getElementById('frac-result-decimal').textContent = 'N/A';
        stepsDiv.textContent = 'Error: Cannot divide by zero.';
        return;
      }
      resNum = f1.num * f2.den;
      resDen = f1.den * f2.num;
      steps.push(`\n📝 Step 3: Multiply by the reciprocal (flip and multiply)
• ${formatImproperStr(f1)} × ${f2.den}/${f2.num}
• (${f1.num} × ${f2.den}) / (${f1.den} × ${f2.num})
• = ${resNum}/${resDen}`);
    }

    const simplified = simplify(resNum, resDen);
    const decimalValue = simplified.num / simplified.den;

    steps.push(`\n📝 Step 4: Simplify to lowest terms
• Find Greatest Common Divisor (GCD) of ${Math.abs(resNum)} and ${Math.abs(resDen)} = ${gcd(resNum, resDen)}
• Divided numerator and denominator by GCD: ${simplified.num}/${simplified.den}
• Convert to mixed number: ${formatMixed(simplified)}
• Convert to decimal: ${decimalValue.toLocaleString(undefined, { maximumFractionDigits: 6 })}`);

    document.getElementById('frac-result-mixed').textContent = formatMixed(simplified);
    document.getElementById('frac-result-improper').textContent = `${simplified.num}/${simplified.den}`;
    document.getElementById('frac-result-decimal').textContent = decimalValue.toLocaleString(undefined, { maximumFractionDigits: 6 });
    stepsDiv.textContent = steps.join('\n');
    resultDiv.style.display = '';
  }

  inputs.forEach(el => {
    if (el) el.addEventListener('input', calculate);
  });

  // Calculate immediately if there is any initial input (though inputs start blank)
  calculate();

  return () => {
    inputs.forEach(el => {
      if (el) el.removeEventListener('input', calculate);
    });
  };
}
