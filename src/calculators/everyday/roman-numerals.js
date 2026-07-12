export const meta = {
  slug: 'roman-numerals',
  name: 'Roman Numerals Converter',
  title: 'Roman Numerals Converter - Calcyx',
  description: 'Convert Arabic numbers (1-3999) to Roman numerals, or Roman numerals to Arabic numbers, with detailed step-by-step calculations.',
  category: 'everyday',
  icon: '🏛️',
  keywords: ['roman', 'numerals', 'arabic', 'numbers', 'converter', 'translation', 'roman to arabic', 'arabic to roman'],
  formula: 'I=1 · V=5 · X=10 · L=50 · C=100 · D=500 · M=1000',
  relatedSlugs: ['base-converter', 'gcd-lcm']
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
        <div class="calc-input-group">
          <label for="numeral-input">Enter Number or Roman Numeral</label>
          <input type="text" id="numeral-input" class="calc-input" placeholder="e.g. 2026 or MMXXVI" autocomplete="off">
        </div>

        <!-- Success Result -->
        <div id="result" class="calc-result" style="display:none; margin-top: 1.5rem;">
          <div class="calc-result-value" id="conversion-result" style="font-size: 2.5rem; word-break: break-all;"></div>
          <div class="calc-result-label" id="conversion-type">Converted Value</div>
          
          <div style="margin-top: 1.5rem; text-align: left;">
            <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8;">Conversion Steps:</h4>
            <div id="conversion-steps" style="display: flex; flex-direction: column; gap: 0.35rem; font-family: monospace; font-size: 0.85rem; background: rgba(0,0,0,0.15); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); max-height: 250px; overflow-y: auto;">
            </div>
          </div>
        </div>

        <!-- Warning Result -->
        <div id="warning-result" class="calc-result" style="display:none; margin-top: 1.5rem; border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.05);">
          <div id="warning-text" style="color: #f87171; font-weight: 500; text-align: center;"></div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>🏛️ Roman Numeral Key</h3>
        <code>M = 1000 · D = 500 · C = 100 · L = 50 · X = 10 · V = 5 · I = 1</code>
        <p><strong>Subtractive Notation:</strong> If a smaller numeral is placed before a larger one, it is subtracted (e.g. IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900). Otherwise, values are added from left to right.</p>
        <p>Note: Standard Roman numerals support values from 1 to 3,999.</p>
      </div>
    </div>
  `;

  return el;
}

export function mount() {
  const numeralInput = document.getElementById('numeral-input');
  const resultDiv = document.getElementById('result');
  const conversionResult = document.getElementById('conversion-result');
  const conversionType = document.getElementById('conversion-type');
  const conversionSteps = document.getElementById('conversion-steps');
  const warningResult = document.getElementById('warning-result');
  const warningText = document.getElementById('warning-text');

  const ROMAN_VALUES = [
    ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
    ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
  ];

  const ROMAN_MAP = {
    M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1
  };

  function toRoman(num) {
    let temp = num;
    let roman = '';
    const steps = [];
    
    for (const [char, value] of ROMAN_VALUES) {
      while (temp >= value) {
        roman += char;
        temp -= value;
        steps.push(`Add ${char} (+${value}) ➔ Remaining: ${temp}`);
      }
    }
    return { result: roman, steps };
  }

  function toArabic(romanStr) {
    const clean = romanStr.trim().toUpperCase();
    
    // Check characters
    if (!/^[IVXLCDM]+$/.test(clean)) {
      return { error: 'Contains invalid characters. Only I, V, X, L, C, D, M are allowed.' };
    }

    // Standard Roman numerals grammar validation
    const grammarRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
    if (!grammarRegex.test(clean)) {
      return { error: 'Invalid Roman numeral sequence. Please check standard subtractive rules (e.g. IV instead of IIII, IX instead of VIIII).' };
    }

    let arabic = 0;
    const steps = [];
    
    for (let i = 0; i < clean.length; i++) {
      const currentVal = ROMAN_MAP[clean[i]];
      const nextVal = ROMAN_MAP[clean[i + 1]];
      
      if (nextVal && currentVal < nextVal) {
        const diff = nextVal - currentVal;
        arabic += diff;
        steps.push(`Subtractive pair: ${clean[i]}${clean[i+1]} (${nextVal} - ${currentVal}) ➔ Add ${diff} ➔ Total: ${arabic}`);
        i++; // Skip the next character
      } else {
        arabic += currentVal;
        steps.push(`Single symbol: ${clean[i]} ➔ Add ${currentVal} ➔ Total: ${arabic}`);
      }
    }

    return { result: arabic, steps };
  }

  function calculate() {
    const val = numeralInput.value.trim();

    if (!val) {
      resultDiv.style.display = 'none';
      warningResult.style.display = 'none';
      return;
    }

    // Determine type: Arabic (digits) or Roman (letters)
    const isArabic = /^\d+$/.test(val);

    if (isArabic) {
      warningResult.style.display = 'none';
      const num = parseInt(val, 10);
      
      if (num < 1 || num > 3999) {
        warningText.textContent = 'Arabic numbers must be between 1 and 3,999.';
        warningResult.style.display = '';
        resultDiv.style.display = 'none';
        return;
      }

      const conversion = toRoman(num);
      conversionResult.textContent = conversion.result;
      conversionType.textContent = `Roman Numeral for ${num}`;
      
      conversionSteps.innerHTML = '';
      conversion.steps.forEach(step => {
        const item = document.createElement('div');
        item.textContent = step;
        conversionSteps.appendChild(item);
      });
      resultDiv.style.display = '';

    } else {
      // Roman to Arabic conversion
      const conversion = toArabic(val);
      
      if (conversion.error) {
        warningText.textContent = conversion.error;
        warningResult.style.display = '';
        resultDiv.style.display = 'none';
        return;
      }

      warningResult.style.display = 'none';
      conversionResult.textContent = conversion.result.toLocaleString();
      conversionType.textContent = `Arabic Number for "${val.toUpperCase()}"`;

      conversionSteps.innerHTML = '';
      conversion.steps.forEach(step => {
        const item = document.createElement('div');
        item.textContent = step;
        conversionSteps.appendChild(item);
      });
      resultDiv.style.display = '';
    }
  }

  numeralInput.addEventListener('input', calculate);

  return () => {
    numeralInput.removeEventListener('input', calculate);
  };
}
