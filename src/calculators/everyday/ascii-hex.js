export const meta = {
  slug: 'ascii-hex',
  name: 'ASCII / Hex Converter',
  title: 'ASCII / Hex Converter - Calcyx',
  description: 'Convert plain text to ASCII decimal codes or Hexadecimal representations, and decode them back to text with custom separator choices.',
  category: 'everyday',
  icon: '🔡',
  keywords: ['ascii', 'hex', 'converter', 'ascii converter', 'hex converter', 'hexadecimal', 'decoder', 'encoder'],
  formula: 'ASCII decimal: byte code (0-255), Hexadecimal: byte code in base-16 (00-FF)',
  relatedSlugs: ['binary-text', 'morse-code']
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
        <div class="calc-row">
          <div class="calc-input-group" style="flex: 2;">
            <label for="mode-select">Conversion Mode</label>
            <select id="mode-select" class="calc-select">
              <option value="text-to-ascii">Text to ASCII (Decimal)</option>
              <option value="ascii-to-text">ASCII (Decimal) to Text</option>
              <option value="text-to-hex">Text to Hexadecimal</option>
              <option value="hex-to-text">Hexadecimal to Text</option>
            </select>
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="separator-select">Separator</label>
            <select id="separator-select" class="calc-select">
              <option value="space">Space</option>
              <option value="comma">Comma</option>
              <option value="comma-space">Comma & Space</option>
              <option value="none">None (Hex only)</option>
            </select>
          </div>
        </div>

        <div class="calc-input-group">
          <label for="input-data" id="input-label">Source Text</label>
          <textarea id="input-data" class="calc-input" rows="5" placeholder="Enter text to convert..." style="resize: vertical; font-family: monospace;"></textarea>
        </div>

        <div id="error-message" style="display: none; color: #ff6b6b; font-size: 0.9rem; margin-top: -0.5rem; margin-bottom: 1rem; font-family: monospace; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; padding: 0.5rem 0.75rem; border-radius: 4px;"></div>

        <div id="result" class="calc-result" style="display: none;">
          <div class="calc-result-label" id="result-label">Output</div>
          <textarea id="output-data" class="calc-input" rows="5" readonly style="resize: vertical; font-family: monospace; background: rgba(255, 255, 255, 0.05); cursor: text; margin-top: 0.5rem;"></textarea>
          
          <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
            <button id="copy-btn" class="calc-input" style="flex: 1; cursor: pointer; font-weight: bold; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); transition: background-color 0.2s; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span>📋</span> Copy Output
            </button>
          </div>
          <div class="calc-result-detail" id="result-info" style="margin-top: 0.5rem; font-size: 0.85rem; opacity: 0.8;"></div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📚 How Character Code Conversion Works</h3>
        <p>Computers represent text characters using numbers. The standard <strong>UTF-8</strong> encoding maps every character, digit, and symbol to one or more bytes (numbers from 0 to 255).</p>
        <p>1. <strong>Text to ASCII/Hex:</strong> Each character's UTF-8 bytes are converted to decimal (base-10) or hexadecimal (base-16, two digits).</p>
        <p>2. <strong>ASCII/Hex to Text:</strong> Numbers are parsed from their corresponding decimal or hex format using the chosen separator, converted back to bytes, and decoded into readable UTF-8 strings.</p>
      </div>
    </div>
  `;

  return el;
}

export function mount() {
  const modeSelect = document.getElementById('mode-select');
  const separatorSelect = document.getElementById('separator-select');
  const inputData = document.getElementById('input-data');
  const inputLabel = document.getElementById('input-label');
  const errorMsg = document.getElementById('error-message');
  const resultDiv = document.getElementById('result');
  const resultLabel = document.getElementById('result-label');
  const outputData = document.getElementById('output-data');
  const copyBtn = document.getElementById('copy-btn');
  const resultInfo = document.getElementById('result-info');

  const placeholders = {
    'text-to-ascii': 'Enter plain text to convert to ASCII decimal numbers...',
    'ascii-to-text': 'Enter ASCII decimal numbers (e.g., 72 101 108 108 111)...',
    'text-to-hex': 'Enter plain text to convert to hexadecimal...',
    'hex-to-text': 'Enter hexadecimal values (e.g., 48 65 6c 6c 6f or 48656c6c6f)...'
  };

  const labels = {
    'text-to-ascii': { input: 'Source Text', output: 'ASCII Decimal Output' },
    'ascii-to-text': { input: 'ASCII Decimal Input', output: 'Decoded Text' },
    'text-to-hex': { input: 'Source Text', output: 'Hexadecimal Output' },
    'hex-to-text': { input: 'Hexadecimal Input', output: 'Decoded Text' }
  };

  function getSeparatorString() {
    const val = separatorSelect.value;
    if (val === 'space') return ' ';
    if (val === 'comma') return ',';
    if (val === 'comma-space') return ', ';
    return '';
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    resultDiv.style.display = 'none';
  }

  function hideError() {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
  }

  function updateLayout() {
    const mode = modeSelect.value;
    inputData.placeholder = placeholders[mode];
    inputLabel.textContent = labels[mode].input;
    resultLabel.textContent = labels[mode].output;

    // "None" separator is only valid for Hex modes
    if (mode.includes('ascii')) {
      if (separatorSelect.value === 'none') {
        separatorSelect.value = 'space';
      }
      separatorSelect.options[3].disabled = true; // Disable "None"
    } else {
      separatorSelect.options[3].disabled = false;
    }
    
    convert();
  }

  function convert() {
    const text = inputData.value;
    const mode = modeSelect.value;
    const separatorMode = separatorSelect.value;
    const sepStr = getSeparatorString();

    hideError();

    if (!text.trim()) {
      resultDiv.style.display = 'none';
      return;
    }

    try {
      if (mode === 'text-to-ascii') {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const asciiParts = [];
        for (let i = 0; i < bytes.length; i++) {
          asciiParts.push(bytes[i].toString(10));
        }
        outputData.value = asciiParts.join(sepStr);
        resultInfo.textContent = `Character count: ${text.length} | Encoded bytes: ${bytes.length}`;
        resultDiv.style.display = 'block';
      }
      else if (mode === 'ascii-to-text') {
        // Parse input decimal codes
        // Split by standard separation characters (whitespace, comma, semicolon)
        let chunks = [];
        if (text.includes(',') || text.includes(';') || /\\s/.test(text)) {
          chunks = text.trim().split(/[\s,;]+/);
        } else {
          // If no spacing characters, split by chosen separator if possible
          const cleanText = text.trim();
          chunks = sepStr ? cleanText.split(sepStr) : [cleanText];
        }

        chunks = chunks.filter(c => c.length > 0);
        const bytes = [];
        
        for (const chunk of chunks) {
          if (!/^\d+$/.test(chunk)) {
            showError(`Invalid ASCII decimal character: "${chunk}". Decimal values must contain digits only.`);
            return;
          }
          const val = parseInt(chunk, 10);
          if (val < 0 || val > 255) {
            showError(`ASCII/Byte value out of range (0-255): ${val}`);
            return;
          }
          bytes.push(val);
        }

        const decoded = new TextDecoder().decode(new Uint8Array(bytes));
        outputData.value = decoded;
        resultInfo.textContent = `Decoded characters: ${decoded.length} | Decimal groups processed: ${bytes.length}`;
        resultDiv.style.display = 'block';
      }
      else if (mode === 'text-to-hex') {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const hexParts = [];
        for (let i = 0; i < bytes.length; i++) {
          hexParts.push(bytes[i].toString(16).padStart(2, '0').toUpperCase());
        }
        outputData.value = hexParts.join(sepStr);
        resultInfo.textContent = `Character count: ${text.length} | Encoded bytes: ${bytes.length}`;
        resultDiv.style.display = 'block';
      }
      else if (mode === 'hex-to-text') {
        // Strip out common prefixes: 0x, %
        let cleanHex = text.replace(/0x/gi, '').replace(/%/g, '');
        
        let chunks = [];
        const hasSpaces = /[\s,;]+/.test(cleanHex);
        
        if (hasSpaces) {
          chunks = cleanHex.trim().split(/[\s,;]+/);
        } else if (separatorMode === 'none') {
          // Splitting by 2 characters
          const matched = cleanHex.trim().match(/.{1,2}/g);
          chunks = matched ? matched : [];
        } else {
          chunks = [cleanHex.trim()];
        }

        chunks = chunks.filter(c => c.length > 0);
        const bytes = [];

        for (const chunk of chunks) {
          if (!/^[0-9A-Fa-f]+$/.test(chunk)) {
            showError(`Invalid Hexadecimal token: "${chunk}". Must contain only characters 0-9 and A-F.`);
            return;
          }
          // A single hex group shouldn't exceed 2 characters if separator is spaces or none
          if (chunk.length > 2) {
            // If they entered a long hex string without spaces, and separator is space, guide them
            if (separatorMode !== 'none') {
              showError(`Hex token "${chunk}" is too long. If you don't have spaces, switch "Separator" to "None".`);
              return;
            }
          }
          const val = parseInt(chunk, 16);
          if (isNaN(val) || val < 0 || val > 255) {
            showError(`Hex token value out of range (00-FF): ${chunk}`);
            return;
          }
          bytes.push(val);
        }

        const decoded = new TextDecoder().decode(new Uint8Array(bytes));
        outputData.value = decoded;
        resultInfo.textContent = `Decoded characters: ${decoded.length} | Hex groups processed: ${bytes.length}`;
        resultDiv.style.display = 'block';
      }
    } catch (err) {
      showError('Conversion error: ' + err.message);
    }
  }

  function onCopyClick() {
    navigator.clipboard.writeText(outputData.value).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>✅</span> Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  modeSelect.addEventListener('change', updateLayout);
  separatorSelect.addEventListener('change', convert);
  inputData.addEventListener('input', convert);
  copyBtn.addEventListener('click', onCopyClick);

  // Initialize
  updateLayout();

  return () => {
    modeSelect.removeEventListener('change', updateLayout);
    separatorSelect.removeEventListener('change', convert);
    inputData.removeEventListener('input', convert);
    copyBtn.removeEventListener('click', onCopyClick);
  };
}
