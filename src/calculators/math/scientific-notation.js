export const meta = {
  slug: 'scientific-notation',
  name: 'Scientific Notation Converter',
  title: 'Scientific Notation Converter - Calcyx',
  description: 'Convert between standard decimal numbers and scientific notation. Supports custom input formats and displays engineering notation.',
  category: 'math',
  icon: '🔬',
  keywords: ['scientific notation', 'e notation', 'exponential notation', 'engineering notation', 'decimal converter', 'math converter'],
  formula: 'a × 10ᵇ',
  relatedSlugs: ['base-converter', 'percentage']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">🔬</span>
        <h1 class="calc-title">Scientific Notation Converter</h1>
        <p class="calc-description">Enter a standard decimal (e.g., 0.00045) or a scientific notation (e.g., 4.5 x 10^-4 or 4.5e-4) to convert between formats.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="sci-input">Input Value</label>
          <input type="text" id="sci-input" class="calc-input" placeholder="e.g., 3.5 x 10^4 or 0.00045" value="3.5 x 10^4">
        </div>
        <div id="sci-error" class="calc-result-detail" style="color: #ef4444; margin-top: 0.5rem; display: none;">Invalid number or format.</div>
      </div>
      
      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid">
          <!-- Scientific Notation -->
          <div class="calc-result-item" style="grid-column: span 2;">
            <div class="calc-result-label">Scientific Notation</div>
            <div class="calc-result-value" id="sci-result-sci" style="font-size: 1.6rem; min-height: 2.2rem; display: flex; align-items: center; justify-content: center;"></div>
            <div class="calc-result-detail">a × 10ᵇ (1 ≤ |a| &lt; 10)</div>
          </div>
          
          <!-- Decimal Notation -->
          <div class="calc-result-item" style="grid-column: span 2;">
            <div class="calc-result-label">Decimal Notation</div>
            <div class="calc-result-value" id="sci-result-dec" style="font-size: 1.6rem; min-height: 2.2rem; display: flex; align-items: center; justify-content: center; word-break: break-all; padding: 0.5rem;"></div>
            <div class="calc-result-detail">Standard decimal representation</div>
          </div>
          
          <!-- Engineering Notation -->
          <div class="calc-result-item">
            <div class="calc-result-label">Engineering Notation</div>
            <div class="calc-result-value" id="sci-result-eng" style="font-size: 1.4rem; min-height: 2.2rem; display: flex; align-items: center; justify-content: center;"></div>
            <div class="calc-result-detail">Exponent is a multiple of 3</div>
          </div>
          
          <!-- E-Notation -->
          <div class="calc-result-item">
            <div class="calc-result-label">E-Notation</div>
            <div class="calc-result-value" id="sci-result-e" style="font-size: 1.4rem; min-height: 2.2rem; display: flex; align-items: center; justify-content: center;"></div>
            <div class="calc-result-detail">Standard calculator format</div>
          </div>
        </div>
        
        <!-- Step Details / Breakdown -->
        <div class="calc-result-item" style="grid-column: span 2; margin-top: 1rem; padding: 1rem; text-align: left;">
          <div class="calc-result-label" style="text-align: center; margin-bottom: 0.5rem;">How it works / Breakdown</div>
          <div id="sci-breakdown" class="calc-result-detail" style="font-size: 0.95rem; line-height: 1.6; color: currentColor;"></div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>📐 Scientific Notation Rules</h3>
        <p>Scientific notation represents numbers as <code>a × 10ᵇ</code> where:</p>
        <ul>
          <li><strong>a</strong> (the coefficient) is a number whose absolute value is between 1 and 10 (inclusive of 1, exclusive of 10).</li>
          <li><strong>b</strong> (the exponent) is an integer indicating the power of 10.</li>
        </ul>
        <p>For example, <code>35,000</code> is written as <code>3.5 × 10⁴</code> because we move the decimal point 4 places to the left. <code>0.00035</code> is written as <code>3.5 × 10⁻⁴</code> because we move the decimal point 4 places to the right.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const inputEl = document.getElementById('sci-input');
  const errorEl = document.getElementById('sci-error');
  const resultEl = document.getElementById('result');
  
  const resultSci = document.getElementById('sci-result-sci');
  const resultDec = document.getElementById('sci-result-dec');
  const resultEng = document.getElementById('sci-result-eng');
  const resultE = document.getElementById('sci-result-e');
  const breakdownEl = document.getElementById('sci-breakdown');

  const WORD_SUFFIXES = {
    15: 'quadrillion',
    12: 'trillion',
    9: 'billion',
    6: 'million',
    3: 'thousand',
    0: '',
    '-3': 'thousandth',
    '-6': 'millionth',
    '-9': 'billionth',
    '-12': 'trillionth',
    '-15': 'quadrillionth'
  };

  function parseInput(str) {
    str = str.trim().toLowerCase();
    if (!str) return null;
    
    // Match customized scientific notation formats (e.g. "3.5 x 10^4", "1.2 * 10^-3", "-10^4")
    const sciRegex = /^([+-]?(?:\d*\.?\d+)?)\s*(?:[x*·•]|\s|\\times|\\cdot)?\s*10\s*(?:\^|\*\*)\s*([+-]?\d+)$/;
    const match = str.match(sciRegex);
    if (match) {
      const coeffStr = match[1] ? match[1].trim() : '';
      let coeff = 1;
      if (coeffStr === '-') coeff = -1;
      else if (coeffStr === '+' || coeffStr === '') coeff = 1;
      else coeff = parseFloat(coeffStr);

      const exp = parseInt(match[2], 10);
      if (!isNaN(coeff) && !isNaN(exp)) {
        return {
          coefficient: coeff,
          exponent: exp,
          value: coeff * Math.pow(10, exp)
        };
      }
    }
    
    // Try standard e-notation or decimal numbers
    const numVal = parseFloat(str);
    if (isNaN(numVal) || !isFinite(numVal)) {
      return null;
    }
    
    const expStr = numVal.toExponential();
    const parts = expStr.split('e');
    const coeff = parseFloat(parts[0]);
    const exp = parseInt(parts[1], 10);
    
    return {
      coefficient: coeff,
      exponent: exp,
      value: numVal
    };
  }

  function formatScientific(coeff, exp) {
    const formattedCoeff = coeff.toLocaleString(undefined, { maximumFractionDigits: 6 });
    return `${formattedCoeff} × 10<sup>${exp}</sup>`;
  }

  function toEngineering(val) {
    if (val === 0) return { coefficient: 0, exponent: 0 };
    const absVal = Math.abs(val);
    const log10 = Math.log10(absVal);
    let exp = Math.floor(log10 / 3) * 3;
    let coeff = val / Math.pow(10, exp);
    
    if (Math.abs(coeff) >= 1000) {
      coeff /= 1000;
      exp += 3;
    } else if (Math.abs(coeff) < 1 && Math.abs(coeff) > 0) {
      coeff *= 1000;
      exp -= 3;
    }
    return { coefficient: coeff, exponent: exp };
  }

  function formatDecimal(val) {
    const absVal = Math.abs(val);
    if (absVal === 0) return '0';
    if (absVal >= 1e15 || absVal < 1e-6) {
      return val.toString();
    }
    return val.toLocaleString(undefined, { maximumFractionDigits: 10 });
  }

  function calculate() {
    const rawVal = inputEl.value;
    const parsed = parseInput(rawVal);
    
    if (!parsed) {
      errorEl.style.display = 'block';
      resultEl.style.display = 'none';
      return;
    }
    
    errorEl.style.display = 'none';
    
    const { coefficient, exponent, value } = parsed;
    
    // 1. Scientific Notation
    resultSci.innerHTML = formatScientific(coefficient, exponent);
    
    // 2. Decimal Notation
    resultDec.textContent = formatDecimal(value);
    
    // 3. Engineering Notation
    const eng = toEngineering(value);
    resultEng.innerHTML = formatScientific(eng.coefficient, eng.exponent);
    
    // 4. E-Notation
    const sign = exponent >= 0 ? '+' : '';
    resultE.textContent = `${coefficient.toLocaleString(undefined, { maximumFractionDigits: 6 })}e${sign}${exponent}`;
    
    // 5. Breakdown steps
    let steps = '';
    steps += `• <strong>Input parsed as:</strong> ${coefficient} × 10<sup>${exponent}</sup> (Value = ${formatDecimal(value)})<br>`;
    
    if (exponent === 0) {
      steps += `• Since the exponent is 0, the decimal point does not move. The value is simply <strong>${coefficient}</strong>.`;
    } else if (exponent > 0) {
      steps += `• To convert to decimal, move the decimal point <strong>${exponent}</strong> places to the <strong>right</strong> (multiply by ${Math.pow(10, exponent).toLocaleString()}).<br>`;
    } else {
      steps += `• To convert to decimal, move the decimal point <strong>${Math.abs(exponent)}</strong> places to the <strong>left</strong> (divide by ${Math.pow(10, Math.abs(exponent)).toLocaleString()}).<br>`;
    }
    
    const engWord = WORD_SUFFIXES[eng.exponent];
    if (engWord) {
      steps += `<br>• <strong>Engineering word form:</strong> ${eng.coefficient.toLocaleString(undefined, { maximumFractionDigits: 3 })} ${engWord}`;
    }
    
    breakdownEl.innerHTML = steps;
    resultEl.style.display = '';
  }

  inputEl.addEventListener('input', calculate);
  
  // Initial run
  calculate();
  
  return () => {
    inputEl.removeEventListener('input', calculate);
  };
}
