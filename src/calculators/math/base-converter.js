export const meta = {
  slug: 'base-converter',
  name: 'Number Base Converter',
  title: 'Number Base Converter - Calcyx',
  description: 'Convert numbers between Binary, Octal, Decimal, Hexadecimal, and any custom base from 2 to 36. Validates digits for each base.',
  category: 'math',
  icon: '🎛️',
  keywords: ['base converter', 'binary to decimal', 'hex to decimal', 'octal', 'binary', 'hexadecimal', 'radix converter'],
  formula: 'Radix expansion and successive division/multiplication algorithms',
  relatedSlugs: ['percentage', 'gcd-lcm']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">🎛️</span>
        <h1 class="calc-title">Number Base Converter</h1>
        <p class="calc-description">Convert integers and fractional numbers between standard bases (Binary, Octal, Decimal, Hexadecimal) or any custom base from 2 to 36.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group" style="margin-bottom: 1.5rem;">
          <label for="base-input">Number Value</label>
          <input type="text" id="base-input" class="calc-input" placeholder="Enter number (e.g. 10101.101, 2A5F)" autocomplete="off">
        </div>

        <div class="calc-row" style="margin-bottom: 1rem;">
          <div class="calc-input-group" style="flex: 1;">
            <label for="base-src-select">From Base</label>
            <select id="base-src-select" class="calc-select">
              <option value="10" selected>Decimal (10)</option>
              <option value="2">Binary (2)</option>
              <option value="8">Octal (8)</option>
              <option value="16">Hexadecimal (16)</option>
              <option value="custom">Custom Base...</option>
            </select>
          </div>
          <div class="calc-input-group" id="base-src-custom-group" style="flex: 1; display: none;">
            <label for="base-src-custom">Source Base (2-36)</label>
            <input type="number" id="base-src-custom" class="calc-input" min="2" max="36" value="10" step="1">
          </div>
        </div>

        <div class="calc-row" style="margin-bottom: 1.5rem;">
          <div class="calc-input-group" style="flex: 1;">
            <label for="base-tgt-select">To Base</label>
            <select id="base-tgt-select" class="calc-select">
              <option value="2" selected>Binary (2)</option>
              <option value="8">Octal (8)</option>
              <option value="10">Decimal (10)</option>
              <option value="16">Hexadecimal (16)</option>
              <option value="custom">Custom Base...</option>
            </select>
          </div>
          <div class="calc-input-group" id="base-tgt-custom-group" style="flex: 1; display: none;">
            <label for="base-tgt-custom">Target Base (2-36)</label>
            <input type="number" id="base-tgt-custom" class="calc-input" min="2" max="36" value="2" step="1">
          </div>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="base-output-val" style="font-size: 2rem; word-break: break-all; font-family: monospace;"></div>
        <div class="calc-result-label" id="base-output-label">Result</div>
        
        <div class="calc-result-detail" id="base-steps" style="margin-top: 1.5rem; text-align: left; white-space: pre-line; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; line-height: 1.5; font-family: monospace; font-size: 0.9rem;"></div>
      </div>

      <div class="calc-formula">
        <h3>📐 How Base Conversion Works</h3>
        <p>1. <strong>To Decimal (Base 10):</strong> Multiply each digit by the base raised to the power of its position index (counting from 0 for the integer part, and starting from -1 for the fractional part). Sum all terms.</p>
        <p>2. <strong>From Decimal:</strong> Divide the integer part successively by the target base and record the remainders (read bottom to top). Multiply the fractional part successively by the target base and record the integer parts (read top to bottom).</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const baseInput = document.getElementById('base-input');
  const srcSelect = document.getElementById('base-src-select');
  const srcCustom = document.getElementById('base-src-custom');
  const srcCustomGroup = document.getElementById('base-src-custom-group');
  const tgtSelect = document.getElementById('base-tgt-select');
  const tgtCustom = document.getElementById('base-tgt-custom');
  const tgtCustomGroup = document.getElementById('base-tgt-custom-group');

  const charSet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function getActiveSourceBase() {
    if (srcSelect.value === 'custom') {
      const val = parseInt(srcCustom.value);
      return isNaN(val) ? 10 : Math.max(2, Math.min(36, val));
    }
    return parseInt(srcSelect.value);
  }

  function getActiveTargetBase() {
    if (tgtSelect.value === 'custom') {
      const val = parseInt(tgtCustom.value);
      return isNaN(val) ? 2 : Math.max(2, Math.min(36, val));
    }
    return parseInt(tgtSelect.value);
  }

  function isValidForBase(str, base) {
    str = str.trim().toUpperCase();
    if (str === '') return false;
    
    if (str.startsWith('-')) {
      str = str.slice(1);
    }
    
    const parts = str.split('.');
    if (parts.length > 2) return false;
    
    const allowedChars = charSet.substring(0, base);
    
    for (let part of parts) {
      if (part === '' && parts.length === 2) continue; // Allow things like .5 or 5.
      if (part === '' && parts.length === 1) return false;
      for (let char of part) {
        if (!allowedChars.includes(char)) {
          return false;
        }
      }
    }
    return true;
  }

  // BigInt conversion for integers (preserves precision for huge numbers)
  function intBaseToDecimal(str, base) {
    str = str.trim().toUpperCase();
    let isNegative = false;
    if (str.startsWith('-')) {
      isNegative = true;
      str = str.slice(1);
    }
    
    let decimalValue = 0n;
    const baseBig = BigInt(base);
    
    for (let i = 0; i < str.length; i++) {
      const val = BigInt(charSet.indexOf(str[i]));
      decimalValue = decimalValue * baseBig + val;
    }
    
    return { isNegative, val: decimalValue };
  }

  function decimalToIntBase(decimalObj, base) {
    let { isNegative, val } = decimalObj;
    if (val === 0n) return '0';
    
    const baseBig = BigInt(base);
    let res = '';
    
    while (val > 0n) {
      const rem = Number(val % baseBig);
      res = charSet[rem] + res;
      val = val / baseBig;
    }
    
    return (isNegative ? '-' : '') + res;
  }

  // Floating point conversions (for fractions)
  function baseToDecimal(str, base) {
    str = str.trim().toUpperCase();
    let isNegative = false;
    if (str.startsWith('-')) {
      isNegative = true;
      str = str.slice(1);
    }
    
    const parts = str.split('.');
    const intPart = parts[0] || '';
    const fracPart = parts[1] || '';
    
    let decimalValue = 0;
    
    for (let i = 0; i < intPart.length; i++) {
      const char = intPart[i];
      const val = charSet.indexOf(char);
      decimalValue = decimalValue * base + val;
    }
    
    if (fracPart.length > 0) {
      let fracValue = 0;
      for (let i = fracPart.length - 1; i >= 0; i--) {
        const char = fracPart[i];
        const val = charSet.indexOf(char);
        fracValue = (fracValue + val) / base;
      }
      decimalValue += fracValue;
    }
    
    return isNegative ? -decimalValue : decimalValue;
  }

  function decimalToBase(num, base) {
    if (num === 0) return '0';
    
    let isNegative = num < 0;
    num = Math.abs(num);
    
    let intPart = Math.floor(num);
    let fracPart = num - intPart;
    
    let intStr = '';
    if (intPart === 0) {
      intStr = '0';
    } else {
      while (intPart > 0) {
        const rem = intPart % base;
        intStr = charSet[rem] + intStr;
        intPart = Math.floor(intPart / base);
      }
    }
    
    let fracStr = '';
    if (fracPart > 0) {
      fracStr = '.';
      let count = 0;
      while (fracPart > 0 && count < 12) {
        fracPart *= base;
        const val = Math.floor(fracPart);
        fracStr += charSet[val];
        fracPart -= val;
        count++;
      }
    }
    
    return (isNegative ? '-' : '') + intStr + fracStr;
  }

  function getConversionSteps(str, srcBase, tgtBase) {
    str = str.trim().toUpperCase();
    let isNegative = str.startsWith('-');
    if (isNegative) {
      str = str.slice(1);
    }
    const parts = str.split('.');
    const intPart = parts[0] || '';
    const fracPart = parts[1] || '';
    
    let steps = [];
    steps.push(`📝 Step 1: Convert from Base ${srcBase} to Base 10 (Decimal)`);
    
    // Parse Integer Part
    let intSumStr = [];
    let intVal = 0;
    for (let i = 0; i < intPart.length; i++) {
      const char = intPart[i];
      const val = charSet.indexOf(char);
      const power = intPart.length - 1 - i;
      intSumStr.push(`(${char} × ${srcBase}^${power})`);
      intVal = intVal * srcBase + val;
    }
    
    // Parse Fractional Part
    let fracSumStr = [];
    let fracVal = 0;
    if (fracPart.length > 0) {
      for (let i = 0; i < fracPart.length; i++) {
        const char = fracPart[i];
        const val = charSet.indexOf(char);
        const power = -(i + 1);
        fracSumStr.push(`(${char} × ${srcBase}^${power})`);
      }
      
      let tempFrac = 0;
      for (let i = fracPart.length - 1; i >= 0; i--) {
        const char = fracPart[i];
        const val = charSet.indexOf(char);
        tempFrac = (tempFrac + val) / srcBase;
      }
      fracVal = tempFrac;
    }
    
    const totalDecimal = intVal + fracVal;
    
    if (intPart.length > 0) {
      steps.push(`• Integer Part: ${intPart} → ${intSumStr.join(' + ')} = ${intVal}`);
    }
    if (fracPart.length > 0) {
      steps.push(`• Fractional Part: .${fracPart} → ${fracSumStr.join(' + ')} = ${fracVal.toFixed(6)}`);
    }
    steps.push(`• Total Decimal Value = ${isNegative ? '-' : ''}${totalDecimal}`);
    
    steps.push(`\n📝 Step 2: Convert Decimal (${totalDecimal}) to Base ${tgtBase}`);
    
    // Integer Division
    let tempInt = intVal;
    let divSteps = [];
    if (tempInt === 0) {
      divSteps.push(`• 0 ÷ ${tgtBase} = 0 (Remainder: 0)`);
    } else {
      while (tempInt > 0) {
        const next = Math.floor(tempInt / tgtBase);
        const rem = tempInt % tgtBase;
        const remChar = charSet[rem];
        divSteps.push(`• ${tempInt} ÷ ${tgtBase} = ${next} with Remainder ${remChar} (${rem})`);
        tempInt = next;
      }
    }
    steps.push(`• Integer Division (read remainders from bottom to top):`);
    steps.push(divSteps.join('\n'));
    
    // Fractional Multiplication
    if (fracVal > 0) {
      steps.push(`\n• Fractional Multiplication (multiply fraction by target base and take integer part):`);
      let tempFracVal = fracVal;
      let multSteps = [];
      let count = 0;
      while (tempFracVal > 0 && count < 8) {
        const next = tempFracVal * tgtBase;
        const digitVal = Math.floor(next);
        const digitChar = charSet[digitVal];
        multSteps.push(`  ${tempFracVal.toFixed(6)} × ${tgtBase} = ${next.toFixed(6)} → Digit ${digitChar} (${digitVal})`);
        tempFracVal = next - digitVal;
        count++;
      }
      steps.push(multSteps.join('\n'));
    }
    
    return steps.join('\n');
  }

  function handleUI() {
    if (srcSelect.value === 'custom') {
      srcCustomGroup.style.display = 'block';
    } else {
      srcCustomGroup.style.display = 'none';
    }

    if (tgtSelect.value === 'custom') {
      tgtCustomGroup.style.display = 'block';
    } else {
      tgtCustomGroup.style.display = 'none';
    }
  }

  function calculate() {
    handleUI();

    const valStr = baseInput.value.trim();
    if (valStr === '') {
      document.getElementById('result').style.display = 'none';
      return;
    }

    const srcBase = getActiveSourceBase();
    const tgtBase = getActiveTargetBase();

    const resultDiv = document.getElementById('result');
    const outputVal = document.getElementById('base-output-val');
    const outputLabel = document.getElementById('base-output-label');
    const stepsDiv = document.getElementById('base-steps');

    // Validation
    if (!isValidForBase(valStr, srcBase)) {
      resultDiv.style.display = '';
      outputVal.textContent = 'Invalid Input';
      outputLabel.textContent = `Allowed characters for base ${srcBase}: ${charSet.substring(0, srcBase)}`;
      stepsDiv.textContent = `Error: The input "${valStr}" contains characters that are not valid in Base ${srcBase}.`;
      return;
    }

    let result = '';
    let steps = '';

    const hasFraction = valStr.includes('.');
    const isBigIntCapable = !hasFraction && valStr.length > 10;

    try {
      if (isBigIntCapable) {
        // High-precision BigInt logic
        const decObj = intBaseToDecimal(valStr, srcBase);
        result = decimalToIntBase(decObj, tgtBase);
        steps = `Converted using BigInt arithmetic (for maximum integer precision):\n• Input Value: ${valStr} (Base ${srcBase})\n• Result Value: ${result} (Base ${tgtBase})`;
      } else {
        // Standard precision logic (which also generates detailed steps)
        const decVal = baseToDecimal(valStr, srcBase);
        result = decimalToBase(decVal, tgtBase);
        steps = getConversionSteps(valStr, srcBase, tgtBase);
      }

      outputVal.textContent = result;
      outputLabel.textContent = `Value in Base ${tgtBase}`;
      stepsDiv.textContent = steps;
      resultDiv.style.display = '';
    } catch (e) {
      outputVal.textContent = 'Error';
      outputLabel.textContent = 'Calculation Error';
      stepsDiv.textContent = 'An unexpected error occurred during conversion: ' + e.message;
      resultDiv.style.display = '';
    }
  }

  const inputs = [baseInput, srcSelect, srcCustom, tgtSelect, tgtCustom];
  inputs.forEach(el => {
    if (el) el.addEventListener('input', calculate);
  });

  // Calculate immediately if input exists
  calculate();

  return () => {
    inputs.forEach(el => {
      if (el) el.removeEventListener('input', calculate);
    });
  };
}
