export const meta = {
  slug: 'random-decision',
  name: 'Random Decision Maker',
  title: 'Random Decision Maker - Calcyx',
  description: 'Quickly pick a random option from a list of choices. Perfect for deciding what to eat, watch, or do.',
  category: 'everyday',
  icon: '🎲',
  keywords: ['random', 'decision', 'picker', 'choice', 'decide', 'randomizer', 'spin', 'yes or no'],
  formula: 'Winner = Choices[Random Index]',
  relatedSlugs: ['percentage', 'average']
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
          <label for="choices-input">Enter Choices (separated by commas or new lines)</label>
          <textarea id="choices-input" class="calc-input" rows="5" placeholder="e.g.&#10;Pizza&#10;Burgers&#10;Tacos&#10;Sushi" style="resize: vertical; width: 100%; box-sizing: border-box; min-height: 120px; font-family: inherit;"></textarea>
        </div>
        
        <div style="margin-top: 1rem;">
          <button id="roll-btn" class="calc-input" style="cursor: pointer; font-weight: bold; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); transition: background-color 0.2s, transform 0.1s; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; height: 44px; border-radius: 8px;">
            <span>🎲</span> Decide / Roll Again
          </button>
        </div>

        <div id="result" class="calc-result" style="display:none; margin-top: 1.5rem;">
          <div class="calc-result-value" id="winner-display" style="font-size: 2.2rem; word-break: break-word;"></div>
          <div class="calc-result-label">Selected Option</div>
          
          <div style="margin-top: 1.5rem;">
            <h4 style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">All Options</h4>
            <div id="options-chips" style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;"></div>
          </div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Index = Floor(Random() × Options Count)</code>
        <p>The input text is split by commas or new lines, and empty entries are filtered out. A random option is then selected using a uniform random distribution (Math.random()).</p>
      </div>
    </div>
  `;

  return el;
}

export function mount() {
  const choicesInput = document.getElementById('choices-input');
  const rollBtn = document.getElementById('roll-btn');
  const resultDiv = document.getElementById('result');
  const winnerDisplay = document.getElementById('winner-display');
  const optionsChips = document.getElementById('options-chips');

  let animTimeout = null;
  let debounceTimeout = null;

  function parseChoices() {
    const val = choicesInput.value || '';
    return val
      .split(/[\n,]+/)
      .map(c => c.trim())
      .filter(c => c.length > 0);
  }

  function renderChips(choices, highlightedIndex, isWinner = false) {
    optionsChips.innerHTML = '';
    choices.forEach((choice, idx) => {
      const chip = document.createElement('span');
      chip.textContent = choice;
      
      // Default chip styling
      let style = 'display: inline-block; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.9rem; transition: all 0.1s; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.8);';
      
      if (idx === highlightedIndex) {
        if (isWinner) {
          // Highlight winning chip
          style = 'display: inline-block; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.9rem; font-weight: bold; border: 1px solid rgba(250, 204, 21, 0.6); background: rgba(250, 204, 21, 0.25); color: #facc15; transform: scale(1.08); box-shadow: 0 0 10px rgba(250, 204, 21, 0.2);';
        } else {
          // Blinking highlight chip
          style = 'display: inline-block; padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.9rem; font-weight: bold; border: 1px solid rgba(255, 255, 255, 0.5); background: rgba(255, 255, 255, 0.2); color: #fff; transform: scale(1.05);';
        }
      }
      
      chip.setAttribute('style', style);
      optionsChips.appendChild(chip);
    });
  }

  function runDecision(isTyping = false) {
    if (animTimeout) {
      clearTimeout(animTimeout);
      animTimeout = null;
    }

    const choices = parseChoices();

    if (choices.length < 2) {
      resultDiv.style.display = 'none';
      return;
    }

    resultDiv.style.display = '';

    const winnerIndex = Math.floor(Math.random() * choices.length);

    if (isTyping) {
      // Direct, fast output with no blinking animation to feel instant and prevent keyboard lags
      winnerDisplay.textContent = choices[winnerIndex];
      renderChips(choices, winnerIndex, true);
    } else {
      // Fun micro-animation blinking selection
      let steps = 0;
      const maxSteps = 10;
      const stepDelay = 80; // ms

      function blink() {
        if (steps < maxSteps) {
          const randomIndex = Math.floor(Math.random() * choices.length);
          winnerDisplay.textContent = choices[randomIndex];
          renderChips(choices, randomIndex, false);
          steps++;
          animTimeout = setTimeout(blink, stepDelay);
        } else {
          winnerDisplay.textContent = choices[winnerIndex];
          renderChips(choices, winnerIndex, true);
        }
      }
      blink();
    }
  }

  function onInput() {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    // Debounce slightly to prevent constant redraw while typing
    debounceTimeout = setTimeout(() => {
      runDecision(true);
    }, 300);
  }

  function onRollClick() {
    // Immediate full animation roll
    runDecision(false);
  }

  choicesInput.addEventListener('input', onInput);
  rollBtn.addEventListener('click', onRollClick);

  // Initial calculation if textarea already contains data
  if (choicesInput.value) {
    runDecision(true);
  }

  return () => {
    if (animTimeout) clearTimeout(animTimeout);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    choicesInput.removeEventListener('input', onInput);
    rollBtn.removeEventListener('click', onRollClick);
  };
}
