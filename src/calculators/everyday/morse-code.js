export const meta = {
  slug: 'morse-code',
  name: 'Morse Code Translator',
  title: 'Morse Code Translator - Calcyx',
  description: 'Translate text to Morse code, or Morse code to plain text. Play the Morse sequence with a visual blinking indicator.',
  category: 'everyday',
  icon: '📡',
  keywords: ['morse', 'code', 'translator', 'translation', 'telegraph', 'binary', 'decode', 'encode'],
  formula: 'A=•- · B=-••• · C=-•-• · D=-••',
  relatedSlugs: ['binary-text', 'base-converter']
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
          <label for="morse-mode">Translation Mode</label>
          <select id="morse-mode" class="calc-select">
            <option value="text-to-morse">Plain Text ➔ Morse Code</option>
            <option value="morse-to-text">Morse Code ➔ Plain Text</option>
          </select>
        </div>
        
        <div class="calc-input-group">
          <label for="morse-input" id="input-label">Enter Plain Text</label>
          <textarea id="morse-input" class="calc-input" rows="4" placeholder="e.g. Hello World!" style="resize: vertical; width: 100%; box-sizing: border-box; font-family: inherit;"></textarea>
        </div>

        <div id="result" class="calc-result" style="display:none; margin-top: 1.5rem;">
          <div class="calc-result-value" id="morse-output" style="font-size: 1.6rem; word-break: break-all; white-space: pre-wrap; font-family: monospace; letter-spacing: 0.05em;"></div>
          <div class="calc-result-label" id="output-label">Morse Code Output</div>
          
          <div id="playback-section" style="margin-top: 1.5rem; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 1.5rem;">
            <button id="play-btn" class="calc-input" style="cursor: pointer; font-weight: bold; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); transition: background-color 0.15s; width: 100%; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 0.95rem; user-select: none;">
              📡 Play Morse Light Sequence
            </button>
            
            <div style="display: flex; flex-direction: column; align-items: center; margin-top: 1.25rem;">
              <div id="morse-light" style="width: 50px; height: 50px; border-radius: 50%; background: #374151; border: 3px solid #4b5563; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); transition: background-color 0.1s, box-shadow 0.1s;"></div>
              <div id="morse-status" style="margin-top: 0.5rem; font-size: 0.85rem; font-family: monospace; opacity: 0.8;">Idle</div>
            </div>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Dot (.) = 1 unit · Dash (-) = 3 units</code>
        <code>Between symbols = 1 unit · Between letters = 3 units · Between words = 7 units</code>
        <p>Text is mapped to Morse Code using international standards. When playing back, the light stays ON for 1 unit of time (150ms) for a dot, and 3 units of time (450ms) for a dash. Gaps of appropriate lengths are added between signals, letters, and words.</p>
      </div>
    </div>
  `;

  return el;
}

export function mount() {
  const modeSelect = document.getElementById('morse-mode');
  const morseInput = document.getElementById('morse-input');
  const resultDiv = document.getElementById('result');
  const morseOutput = document.getElementById('morse-output');
  const inputLabel = document.getElementById('input-label');
  const outputLabel = document.getElementById('output-label');
  
  const playBtn = document.getElementById('play-btn');
  const morseLight = document.getElementById('morse-light');
  const morseStatus = document.getElementById('morse-status');

  const MORSE_MAP = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
    '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
    ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
    '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
  };

  const REVERSE_MAP = {};
  for (const [key, val] of Object.entries(MORSE_MAP)) {
    REVERSE_MAP[val] = key;
  }

  let playTimeout = null;
  let timeline = [];
  let timelineIndex = 0;

  function setLight(on) {
    if (on) {
      morseLight.style.backgroundColor = '#facc15';
      morseLight.style.boxShadow = '0 0 25px #facc15, 0 0 50px rgba(250, 204, 21, 0.4)';
      morseLight.style.borderColor = '#fef08a';
    } else {
      morseLight.style.backgroundColor = '#374151';
      morseLight.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
      morseLight.style.borderColor = '#4b5563';
    }
  }

  function stopPlayback() {
    if (playTimeout) {
      clearTimeout(playTimeout);
      playTimeout = null;
    }
    timeline = [];
    timelineIndex = 0;
    setLight(false);
    morseStatus.textContent = 'Idle';
    playBtn.innerHTML = '📡 Play Morse Light Sequence';
  }

  function tick() {
    if (timelineIndex >= timeline.length) {
      stopPlayback();
      return;
    }

    const event = timeline[timelineIndex];
    setLight(event.on);
    morseStatus.textContent = event.label;
    
    timelineIndex++;
    playTimeout = setTimeout(tick, event.duration);
  }

  function startPlayback() {
    const isTextToMorse = modeSelect.value === 'text-to-morse';
    const morseStr = isTextToMorse ? morseOutput.textContent : morseInput.value;

    if (!morseStr.trim()) return;

    stopPlayback();

    const UNIT = 150; // ms per dot
    const words = morseStr.split('/');

    for (let w = 0; w < words.length; w++) {
      const word = words[w].trim();
      if (!word) continue;

      const letters = word.split(/\s+/);
      for (let l = 0; l < letters.length; l++) {
        const letter = letters[l];
        
        for (let s = 0; s < letter.length; s++) {
          const symbol = letter[s];
          if (symbol === '.') {
            timeline.push({ on: true, duration: UNIT, label: 'Dot (•)' });
          } else if (symbol === '-' || symbol === '—') {
            timeline.push({ on: true, duration: 3 * UNIT, label: 'Dash (—)' });
          }

          // Gap between symbols in the same letter
          if (s < letter.length - 1) {
            timeline.push({ on: false, duration: UNIT, label: 'Intra-char Gap' });
          }
        }

        // Gap between letters in the same word
        if (l < letters.length - 1) {
          timeline.push({ on: false, duration: 3 * UNIT, label: 'Letter Gap' });
        }
      }

      // Gap between words
      if (w < words.length - 1) {
        timeline.push({ on: false, duration: 7 * UNIT, label: 'Word Gap' });
      }
    }

    if (timeline.length === 0) return;

    playBtn.innerHTML = '⏹️ Stop Playback';
    tick();
  }

  function translate() {
    stopPlayback();
    const val = morseInput.value;
    const isTextToMorse = modeSelect.value === 'text-to-morse';

    if (!val.trim()) {
      resultDiv.style.display = 'none';
      return;
    }

    if (isTextToMorse) {
      const translated = val.toUpperCase().split('').map(char => {
        return MORSE_MAP[char] || '?';
      }).join(' ');
      
      morseOutput.textContent = translated;
      resultDiv.style.display = '';
    } else {
      // Morse Code ➔ Text
      const normalized = val.trim()
        .replace(/\s*\/\s*/g, ' | ') // Standard slash boundary
        .replace(/\s{3,}/g, ' | ');  // Triple-space boundary
      
      const words = normalized.split('|');
      const translated = words.map(word => {
        const chars = word.trim().split(/\s+/);
        return chars.map(char => {
          if (!char) return '';
          return REVERSE_MAP[char] || '?';
        }).join('');
      }).join(' ');

      morseOutput.textContent = translated;
      resultDiv.style.display = '';
    }
  }

  function handleModeChange() {
    const isTextToMorse = modeSelect.value === 'text-to-morse';
    
    inputLabel.textContent = isTextToMorse ? 'Enter Plain Text' : 'Enter Morse Code';
    outputLabel.textContent = isTextToMorse ? 'Morse Code Output' : 'Plain Text Output';
    morseInput.placeholder = isTextToMorse 
      ? 'e.g. Hello World!' 
      : 'e.g. .... . .-.. .-.. --- / .-- --- .-. .-.. -..';
    
    morseInput.value = '';
    translate();
  }

  function handlePlayClick() {
    if (playTimeout) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }

  modeSelect.addEventListener('change', handleModeChange);
  morseInput.addEventListener('input', translate);
  playBtn.addEventListener('click', handlePlayClick);

  return () => {
    stopPlayback();
    modeSelect.removeEventListener('change', handleModeChange);
    morseInput.removeEventListener('input', translate);
    playBtn.removeEventListener('click', handlePlayClick);
  };
}
