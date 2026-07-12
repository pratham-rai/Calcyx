export const meta = {
  slug: 'password-generator',
  name: 'Password Generator',
  title: 'Secure Password Generator & Strength Analyzer - Calcyx',
  description: 'Generate secure, cryptographically random passwords. Analyze password strength (entropy bits) and estimate brute-force crack time.',
  category: 'everyday',
  icon: '🔐',
  keywords: ['password generator', 'password strength', 'entropy', 'secure password', 'random password', 'credential generator'],
  formula: 'Entropy (E) = L × log₂(R), where L is length and R is character pool size.',
  relatedSlugs: ['binary-text', 'random-decision']
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
          <label for="generated-password">Generated Password</label>
          <div style="display: flex; gap: 0.5rem; width: 100%;">
            <input type="text" id="generated-password" class="calc-input" readonly style="font-family: monospace; font-size: 1.25rem; font-weight: bold; flex: 1; letter-spacing: 0.05em; background: rgba(255,255,255,0.05); text-align: center;">
            <button id="btn-copy" class="calc-input" style="width: auto; padding: 0 1.25rem; cursor: pointer; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; transition: background 0.2s; font-weight: 500;" title="Copy to clipboard">📋 Copy</button>
            <button id="btn-regenerate" class="calc-input" style="width: auto; padding: 0 1.25rem; cursor: pointer; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; transition: background 0.2s; font-weight: 500;" title="Generate new password">🔄 New</button>
          </div>
          <div id="copy-success" style="display: none; color: #4caf50; font-size: 0.85rem; margin-top: 0.25rem; font-weight: bold; text-align: center;">Copied successfully!</div>
        </div>

        <div class="calc-input-group" style="margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between;">
            <label for="password-length">Password Length</label>
            <span id="length-val" style="font-weight: bold; font-family: monospace; color: #fff;">16</span>
          </div>
          <input type="range" id="password-length" min="6" max="64" value="16" step="1" style="width: 100%; height: 6px; border-radius: 3px; outline: none; margin: 10px 0; cursor: pointer;">
        </div>

        <div class="calc-row" style="flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; margin-top: 1rem;">
          <div class="calc-input-group" style="flex: 1; min-width: 120px; flex-direction: row; align-items: center; gap: 0.5rem;">
            <input type="checkbox" id="chk-lowercase" checked style="width: 18px; height: 18px; cursor: pointer;">
            <label for="chk-lowercase" style="margin-bottom: 0; cursor: pointer; user-select: none;">a-z (Lowercase)</label>
          </div>
          <div class="calc-input-group" style="flex: 1; min-width: 120px; flex-direction: row; align-items: center; gap: 0.5rem;">
            <input type="checkbox" id="chk-uppercase" checked style="width: 18px; height: 18px; cursor: pointer;">
            <label for="chk-uppercase" style="margin-bottom: 0; cursor: pointer; user-select: none;">A-Z (Uppercase)</label>
          </div>
          <div class="calc-input-group" style="flex: 1; min-width: 120px; flex-direction: row; align-items: center; gap: 0.5rem;">
            <input type="checkbox" id="chk-numbers" checked style="width: 18px; height: 18px; cursor: pointer;">
            <label for="chk-numbers" style="margin-bottom: 0; cursor: pointer; user-select: none;">0-9 (Numbers)</label>
          </div>
          <div class="calc-input-group" style="flex: 1; min-width: 120px; flex-direction: row; align-items: center; gap: 0.5rem;">
            <input type="checkbox" id="chk-symbols" checked style="width: 18px; height: 18px; cursor: pointer;">
            <label for="chk-symbols" style="margin-bottom: 0; cursor: pointer; user-select: none;">!@#$ (Symbols)</label>
          </div>
        </div>

        <div id="error-message" style="display: none; color: #ff6b6b; font-size: 0.9rem; margin-bottom: 1.5rem; font-family: monospace; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; padding: 0.5rem 0.75rem; border-radius: 4px;">
          Please select at least one character set!
        </div>

        <div id="result" class="calc-result">
          <div class="calc-result-value" id="strength-val" style="font-size: 2.25rem;">Strong</div>
          <div class="calc-result-label" id="strength-label">Password Strength</div>
          <div class="calc-result-grid" style="margin-top: 1.5rem;">
            <div class="calc-result-item">
              <div class="calc-result-value" id="entropy-val" style="font-size: 1.5rem;">96 bits</div>
              <div class="calc-result-label">Entropy</div>
            </div>
            <div class="calc-result-item" style="grid-column: span 2;">
              <div class="calc-result-value" id="crack-time-val" style="font-size: 1.25rem; word-break: break-word; line-height: 1.3;">12 million years</div>
              <div class="calc-result-label">Est. Crack Time</div>
            </div>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>🔒 How Password Strength is Evaluated</h3>
        <p>Password strength is measured in <strong>information entropy</strong> (bits), which represents how difficult a password is to guess or brute-force by an automated system.</p>
        <code>Entropy (E) = L × log₂(R)</code>
        <p>Where <code>L</code> is the password length, and <code>R</code> is the size of the character pool (lowercase = 26, uppercase = 26, numbers = 10, symbols = 30). A higher entropy value means a much stronger password:</p>
        <ul>
          <li><strong>&lt; 40 bits:</strong> Very Weak. Easily cracked in seconds.</li>
          <li><strong>40 - 59 bits:</strong> Weak. Crackable in minutes to days.</li>
          <li><strong>60 - 79 bits:</strong> Moderate. Solid for normal accounts.</li>
          <li><strong>80 - 119 bits:</strong> Strong. Ideal for secure logins.</li>
          <li><strong>120+ bits:</strong> Very Strong. Virtually uncrackable.</li>
        </ul>
        <p><em>Note: Crack time is calculated assuming an offline GPU cracking cluster capable of 1 billion (10⁹) guesses per second.</em></p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const pwdInput = document.getElementById('generated-password');
  const btnCopy = document.getElementById('btn-copy');
  const btnRegen = document.getElementById('btn-regenerate');
  const lengthInput = document.getElementById('password-length');
  const lengthVal = document.getElementById('length-val');
  
  const chkLower = document.getElementById('chk-lowercase');
  const chkUpper = document.getElementById('chk-uppercase');
  const chkNum = document.getElementById('chk-numbers');
  const chkSym = document.getElementById('chk-symbols');
  
  const errorMsg = document.getElementById('error-message');
  const resultDiv = document.getElementById('result');
  const strengthVal = document.getElementById('strength-val');
  const entropyVal = document.getElementById('entropy-val');
  const crackTimeVal = document.getElementById('crack-time-val');
  const copySuccess = document.getElementById('copy-success');

  const lowercaseSet = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberSet = '0123456789';
  const symbolSet = '!@#$%^&*()_+-=[]{}|;:\'",./<>?~';

  function getRandomInt(max) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  function generateSecurePassword(length, options) {
    let charPool = '';
    const guaranteedChars = [];

    if (options.lowercase) {
      charPool += lowercaseSet;
      guaranteedChars.push(lowercaseSet[getRandomInt(lowercaseSet.length)]);
    }
    if (options.uppercase) {
      charPool += uppercaseSet;
      guaranteedChars.push(uppercaseSet[getRandomInt(uppercaseSet.length)]);
    }
    if (options.numbers) {
      charPool += numberSet;
      guaranteedChars.push(numberSet[getRandomInt(numberSet.length)]);
    }
    if (options.symbols) {
      charPool += symbolSet;
      guaranteedChars.push(symbolSet[getRandomInt(symbolSet.length)]);
    }

    if (charPool.length === 0) return '';

    const passwordArr = [...guaranteedChars];
    const remainingLength = length - guaranteedChars.length;

    if (remainingLength > 0) {
      const randomBytes = new Uint32Array(remainingLength);
      window.crypto.getRandomValues(randomBytes);
      for (let i = 0; i < remainingLength; i++) {
        passwordArr.push(charPool[randomBytes[i] % charPool.length]);
      }
    }

    // Secure shuffle of password array (Fisher-Yates)
    const shuffleBytes = new Uint32Array(passwordArr.length);
    window.crypto.getRandomValues(shuffleBytes);
    for (let i = passwordArr.length - 1; i > 0; i--) {
      const j = shuffleBytes[i] % (i + 1);
      const temp = passwordArr[i];
      passwordArr[i] = passwordArr[j];
      passwordArr[j] = temp;
    }

    return passwordArr.join('');
  }

  function formatCrackTime(logSeconds) {
    if (logSeconds < 0) return 'Instantly (less than 1 second)';
    
    const seconds = Math.pow(10, logSeconds);
    if (seconds < 60) return `${Math.round(seconds)} second${Math.round(seconds) !== 1 ? 's' : ''}`;
    
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.round(minutes)} minute${Math.round(minutes) !== 1 ? 's' : ''}`;
    
    const hours = minutes / 60;
    if (hours < 24) return `${Math.round(hours)} hour${Math.round(hours) !== 1 ? 's' : ''}`;
    
    const days = hours / 24;
    if (days < 365) return `${Math.round(days)} day${Math.round(days) !== 1 ? 's' : ''}`;
    
    const yearsLog = logSeconds - 7.4989; // log10(31536000)
    const years = Math.pow(10, yearsLog);
    
    if (years < 1000) {
      return `${Math.round(years)} year${Math.round(years) !== 1 ? 's' : ''}`;
    } else if (years < 1000000) {
      return `${(years / 1000).toFixed(1).replace(/\.0$/, '')} thousand years`;
    } else if (years < 1000000000) {
      return `${(years / 1000000).toFixed(1).replace(/\.0$/, '')} million years`;
    } else if (years < 1000000000000) {
      return `${(years / 1000000000).toFixed(1).replace(/\.0$/, '')} billion years`;
    } else if (years < 1000000000000000) {
      return `${(years / 1000000000000).toFixed(1).replace(/\.0$/, '')} trillion years`;
    } else {
      return 'Over 1 quadrillion years';
    }
  }

  function run() {
    const length = parseInt(lengthInput.value);
    lengthVal.textContent = length;

    const options = {
      lowercase: chkLower.checked,
      uppercase: chkUpper.checked,
      numbers: chkNum.checked,
      symbols: chkSym.checked
    };

    let poolSize = 0;
    if (options.lowercase) poolSize += 26;
    if (options.uppercase) poolSize += 26;
    if (options.numbers) poolSize += 10;
    if (options.symbols) poolSize += 30; // 30 characters in standard list

    if (poolSize === 0) {
      errorMsg.style.display = 'block';
      resultDiv.style.display = 'none';
      pwdInput.value = '';
      return;
    }

    errorMsg.style.display = 'none';
    resultDiv.style.display = 'block';

    // Generate
    const password = generateSecurePassword(length, options);
    pwdInput.value = password;

    // Calculate Entropy
    const entropy = length * Math.log2(poolSize);
    entropyVal.textContent = `${Math.round(entropy)} bits`;

    // Categorize Strength
    let category = '';
    let color = '';
    if (entropy < 40) {
      category = 'Very Weak';
      color = '#ff6b6b';
    } else if (entropy < 60) {
      category = 'Weak';
      color = '#ffa502';
    } else if (entropy < 80) {
      category = 'Moderate';
      color = '#eccc68';
    } else if (entropy < 120) {
      category = 'Strong';
      color = '#2ed573';
    } else {
      category = 'Very Strong';
      color = '#1e90ff';
    }

    strengthVal.textContent = category;
    strengthVal.style.color = color;

    // Crack time (assuming 1 billion guesses per second)
    // log10(seconds) = length * log10(poolSize) - log10(2) - 9
    const logSeconds = length * Math.log10(poolSize) - Math.log10(2) - 9;
    crackTimeVal.textContent = formatCrackTime(logSeconds);
  }

  function handleCopy() {
    if (!pwdInput.value) return;
    navigator.clipboard.writeText(pwdInput.value).then(() => {
      copySuccess.style.display = 'block';
      setTimeout(() => {
        copySuccess.style.display = 'none';
      }, 2000);
    }).catch(err => {
      console.error('Clipboard copy failed: ', err);
    });
  }

  // Event listeners
  lengthInput.addEventListener('input', run);
  chkLower.addEventListener('change', run);
  chkUpper.addEventListener('change', run);
  chkNum.addEventListener('change', run);
  chkSym.addEventListener('change', run);
  btnRegen.addEventListener('click', run);
  btnCopy.addEventListener('click', handleCopy);

  // Initialize
  run();

  return () => {
    lengthInput.removeEventListener('input', run);
    chkLower.removeEventListener('change', run);
    chkUpper.removeEventListener('change', run);
    chkNum.removeEventListener('change', run);
    chkSym.removeEventListener('change', run);
    btnRegen.removeEventListener('click', run);
    btnCopy.removeEventListener('click', handleCopy);
  };
}
