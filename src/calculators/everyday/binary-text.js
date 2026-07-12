export const meta = {
  slug: 'binary-text',
  name: 'Binary / Text Translator',
  title: 'Binary / Text Translator - Calcyx',
  description: 'Convert plain text to binary or hexadecimal codes, and decode binary or hex back into readable text.',
  category: 'everyday',
  icon: '🔢',
  keywords: ['binary', 'text', 'hex', 'hexadecimal', 'translator', 'converter', 'ascii', 'encoder', 'decoder'],
  formula: 'Converts character bytes into base-2 (binary) or base-16 (hexadecimal) values, or parses them back to UTF-8 strings.',
  relatedSlugs: ['morse-code', 'base-converter']
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
          <label for="conversion-mode">Translation Mode</label>
          <select id="conversion-mode" class="calc-select">
            <option value="text-to-binary">Text to Binary</option>
            <option value="binary-to-text">Binary to Text</option>
            <option value="text-to-hex">Text to Hexadecimal</option>
            <option value="hex-to-text">Hexadecimal to Text</option>
          </select>
        </div>
        
        <div class="calc-input-group">
          <label for="input-text" id="input-label">Source Text</label>
          <textarea id="input-text" class="calc-input" rows="5" placeholder="Enter text to translate..." style="resize: vertical; font-family: monospace;"></textarea>
        </div>

        <div id="error-message" style="display: none; color: #ff6b6b; font-size: 0.9rem; margin-top: -0.5rem; margin-bottom: 1rem; font-family: monospace; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; padding: 0.5rem 0.75rem; border-radius: 4px;"></div>

        <div id="result" class="calc-result" style="display: none;">
          <div class="calc-result-label" id="result-label">Binary Output</div>
          <textarea id="result-text" class="calc-input" rows="5" readonly style="resize: vertical; font-family: monospace; background: rgba(255, 255, 255, 0.05); cursor: text; margin-top: 0.5rem;"></textarea>
          <div class="calc-result-detail" id="result-info" style="margin-top: 0.5rem; font-size: 0.85rem; opacity: 0.8;"></div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>📚 How Binary & Hex Translation Works</h3>
        <p>Computers represent text characters using numbers. The standard UTF-8 encoding maps every character, digit, and emoji to one or more bytes (numbers from 0 to 255).</p>
        <p>1. <strong>Text to Binary/Hex:</strong> Each character's UTF-8 bytes are converted to binary (base-2, 8 bits) or hexadecimal (base-16, 2 digits).</p>
        <p>2. <strong>Binary/Hex to Text:</strong> Binary or hexadecimal strings are split into individual bytes, converted back to decimal values, and decoded into readable characters.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const modeSelect = document.getElementById('conversion-mode');
  const inputText = document.getElementById('input-text');
  const inputLabel = document.getElementById('input-label');
  const errorMsg = document.getElementById('error-message');
  const resultDiv = document.getElementById('result');
  const resultLabel = document.getElementById('result-label');
  const resultText = document.getElementById('result-text');
  const resultInfo = document.getElementById('result-info');

  const placeholders = {
    'text-to-binary': 'Enter text to translate...',
    'binary-to-text': 'Enter binary code (e.g., 01001000 01100101 01101100 01101100 01101111)...',
    'text-to-hex': 'Enter text to translate...',
    'hex-to-text': 'Enter hex code (e.g., 48 65 6c 6c 6f)...'
  };

  const labels = {
    'text-to-binary': { input: 'Source Text', output: 'Binary Output' },
    'binary-to-text': { input: 'Binary Input', output: 'Decoded Plain Text' },
    'text-to-hex': { input: 'Source Text', output: 'Hexadecimal Output' },
    'hex-to-text': { input: 'Hexadecimal Input', output: 'Decoded Plain Text' }
  };

  function updateMode() {
    const mode = modeSelect.value;
    inputText.placeholder = placeholders[mode];
    inputLabel.textContent = labels[mode].input;
    resultLabel.textContent = labels[mode].output;
    translate();
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

  function translate() {
    const text = inputText.value;
    const mode = modeSelect.value;

    hideError();

    if (!text.trim()) {
      resultDiv.style.display = 'none';
      return;
    }

    try {
      if (mode === 'text-to-binary') {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const binaryParts = [];
        for (let i = 0; i < bytes.length; i++) {
          binaryParts.push(bytes[i].toString(2).padStart(8, '0'));
        }
        resultText.value = binaryParts.join(' ');
        resultInfo.textContent = `Character count: ${text.length} | Encoded bytes: ${bytes.length}`;
        resultDiv.style.display = 'block';
      } 
      else if (mode === 'binary-to-text') {
        const cleanBinary = text.replace(/[\s\r\n]+/g, '');
        if (cleanBinary && !/^[01]+$/.test(cleanBinary)) {
          showError('Invalid binary format. Please enter only 0s, 1s, and spaces.');
          return;
        }

        let chunks;
        if (text.trim().includes(' ')) {
          chunks = text.trim().split(/[\s\r\n]+/);
        } else {
          chunks = cleanBinary.match(/.{1,8}/g) || [];
        }

        const bytes = [];
        for (const chunk of chunks) {
          if (chunk.length > 0) {
            const byteVal = parseInt(chunk, 2);
            if (!isNaN(byteVal)) {
              bytes.push(byteVal);
            }
          }
        }

        const decoded = new TextDecoder().decode(new Uint8Array(bytes));
        resultText.value = decoded;
        resultInfo.textContent = `Decoded characters: ${decoded.length} | Binary groups processed: ${bytes.length}`;
        resultDiv.style.display = 'block';
      } 
      else if (mode === 'text-to-hex') {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const hexParts = [];
        for (let i = 0; i < bytes.length; i++) {
          hexParts.push(bytes[i].toString(16).padStart(2, '0').toUpperCase());
        }
        resultText.value = hexParts.join(' ');
        resultInfo.textContent = `Character count: ${text.length} | Encoded bytes: ${bytes.length}`;
        resultDiv.style.display = 'block';
      } 
      else if (mode === 'hex-to-text') {
        let cleanHex = text.replace(/0x/g, '').replace(/%/g, '');
        const hexValStr = cleanHex.replace(/[\s\r\n]+/g, '');
        
        if (hexValStr && !/^[0-9A-Fa-f]+$/.test(hexValStr)) {
          showError('Invalid hexadecimal format. Please enter only 0-9, A-F, and spaces.');
          return;
        }

        let chunks;
        if (text.trim().includes(' ')) {
          chunks = text.trim().split(/[\s\r\n]+/).map(c => c.replace(/0x/g, '').replace(/%/g, ''));
        } else {
          chunks = hexValStr.match(/.{1,2}/g) || [];
        }

        const bytes = [];
        for (const chunk of chunks) {
          if (chunk.length > 0) {
            const byteVal = parseInt(chunk, 16);
            if (!isNaN(byteVal)) {
              bytes.push(byteVal);
            }
          }
        }

        const decoded = new TextDecoder().decode(new Uint8Array(bytes));
        resultText.value = decoded;
        resultInfo.textContent = `Decoded characters: ${decoded.length} | Hex groups processed: ${bytes.length}`;
        resultDiv.style.display = 'block';
      }
    } catch (e) {
      showError('Error processing input: ' + e.message);
    }
  }

  modeSelect.addEventListener('change', updateMode);
  inputText.addEventListener('input', translate);

  // Initialize view
  updateMode();

  return () => {
    modeSelect.removeEventListener('change', updateMode);
    inputText.removeEventListener('input', translate);
  };
}
