export const meta = {
  slug: 'list-shuffler',
  name: 'List Randomizer & Shuffler',
  title: 'List Randomizer & Shuffler - Calcyx',
  description: 'Shuffle lists of names, numbers, or items randomly using the Fisher-Yates algorithm, or split them into random groups.',
  category: 'everyday',
  icon: '🔀',
  keywords: ['shuffle', 'randomize', 'list shuffler', 'randomizer', 'group generator', 'split groups'],
  formula: 'Fisher-Yates Shuffle Algorithm: for i from n-1 down to 1, swap a[i] with a[random(0, i)]',
  relatedSlugs: ['random-decision', 'average']
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
          <label for="list-input">Items to Shuffle (separated by commas or new lines)</label>
          <textarea id="list-input" class="calc-input" rows="6" placeholder="e.g.&#10;Alice&#10;Bob&#10;Charlie&#10;David&#10;Eve&#10;Frank" style="resize: vertical; font-family: monospace;"></textarea>
        </div>

        <div class="calc-row">
          <div class="calc-input-group">
            <label for="separator-select">Separator</label>
            <select id="separator-select" class="calc-select">
              <option value="auto">Auto-detect (New Line or Comma)</option>
              <option value="newline">New Line only</option>
              <option value="comma">Comma only</option>
              <option value="semicolon">Semicolon only</option>
            </select>
          </div>
          <div class="calc-input-group">
            <label for="group-count">Split into Groups (Optional)</label>
            <input type="number" id="group-count" class="calc-input" min="1" step="1" placeholder="e.g. 3" />
          </div>
        </div>

        <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
          <button id="shuffle-btn" class="calc-input" style="flex: 1; cursor: pointer; font-weight: bold; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); transition: background-color 0.2s; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>🔀</span> Reshuffle
          </button>
          <button id="copy-btn" class="calc-input" style="flex: 1; cursor: pointer; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); transition: background-color 0.2s; height: 44px; border-radius: 8px; display: none;">
            📋 Copy Shuffled
          </button>
        </div>

        <div id="result" class="calc-result" style="display: none; margin-top: 1.5rem;">
          <div class="calc-result-label">Shuffled Items</div>
          <textarea id="shuffled-output" class="calc-input" rows="6" readonly style="resize: vertical; font-family: monospace; background: rgba(255, 255, 255, 0.05); cursor: text; margin-top: 0.5rem;"></textarea>
          
          <div id="groups-result-section" style="margin-top: 1.5rem; display: none;">
            <h3 style="font-size: 1.1rem; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">👥 Group Splits</h3>
            <div id="groups-grid" class="calc-result-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;"></div>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>📚 Fisher-Yates Shuffle Algorithm</h3>
        <p>This tool shuffles your list of items using the mathematically unbiased <strong>Fisher-Yates (Knuth) Shuffle algorithm</strong>. It runs in O(n) time complexity and ensures every possible permutation is equally likely.</p>
        <p>If you specify a number of groups, the shuffled list is divided sequentially into equal chunks. If the items do not divide evenly, the first few groups will receive one extra item.</p>
      </div>
    </div>
  `;

  return el;
}

export function mount() {
  const listInput = document.getElementById('list-input');
  const separatorSelect = document.getElementById('separator-select');
  const groupCountInput = document.getElementById('group-count');
  const shuffleBtn = document.getElementById('shuffle-btn');
  const copyBtn = document.getElementById('copy-btn');
  const resultDiv = document.getElementById('result');
  const shuffledOutput = document.getElementById('shuffled-output');
  const groupsSection = document.getElementById('groups-result-section');
  const groupsGrid = document.getElementById('groups-grid');

  let debounceTimeout = null;

  function parseItems() {
    const text = listInput.value || '';
    const sep = separatorSelect.value;
    let rawItems = [];

    if (sep === 'auto') {
      if (text.includes('\\n') || text.includes('\n')) {
        rawItems = text.split(/\n/);
      } else if (text.includes(',')) {
        rawItems = text.split(',');
      } else if (text.includes(';')) {
        rawItems = text.split(';');
      } else {
        rawItems = text.split(/[\r\n]+/);
      }
    } else if (sep === 'newline') {
      rawItems = text.split(/\n/);
    } else if (sep === 'comma') {
      rawItems = text.split(',');
    } else if (sep === 'semicolon') {
      rawItems = text.split(';');
    }

    return rawItems
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function calculate() {
    const items = parseItems();
    if (items.length === 0) {
      resultDiv.style.display = 'none';
      copyBtn.style.display = 'none';
      return;
    }

    const shuffled = shuffleArray(items);
    
    // Set text representation
    const sep = separatorSelect.value;
    let delimiter = '\n';
    if (sep === 'comma') delimiter = ', ';
    else if (sep === 'semicolon') delimiter = '; ';
    else if (sep === 'auto' && !listInput.value.includes('\n') && listInput.value.includes(',')) delimiter = ', ';
    else if (sep === 'auto' && !listInput.value.includes('\n') && listInput.value.includes(';')) delimiter = '; ';
    
    shuffledOutput.value = shuffled.join(delimiter);

    resultDiv.style.display = 'block';
    copyBtn.style.display = 'block';

    // Handle group split
    const gCount = parseInt(groupCountInput.value, 10);
    if (!isNaN(gCount) && gCount > 0) {
      const numGroups = Math.min(gCount, shuffled.length);
      const groups = Array.from({ length: numGroups }, () => []);
      
      // Even chunk split
      const baseSize = Math.floor(shuffled.length / numGroups);
      const extra = shuffled.length % numGroups;
      let idx = 0;
      for (let i = 0; i < numGroups; i++) {
        const size = baseSize + (i < extra ? 1 : 0);
        groups[i] = shuffled.slice(idx, idx + size);
        idx += size;
      }

      groupsGrid.innerHTML = '';
      groups.forEach((group, index) => {
        const groupEl = document.createElement('div');
        groupEl.className = 'calc-result-item';
        groupEl.style.background = 'rgba(255, 255, 255, 0.03)';
        groupEl.style.border = '1px solid rgba(255, 255, 255, 0.08)';
        groupEl.style.padding = '1rem';
        groupEl.style.borderRadius = '8px';
        
        groupEl.innerHTML = `
          <div class="calc-result-label" style="font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem; margin-bottom: 0.5rem; text-align: left;">
            Group ${index + 1} (${group.length})
          </div>
          <ol style="margin: 0; padding-left: 1.2rem; text-align: left; opacity: 0.9; line-height: 1.5;">
            ${group.map(item => `<li>${item}</li>`).join('')}
          </ol>
        `;
        groupsGrid.appendChild(groupEl);
      });

      groupsSection.style.display = 'block';
    } else {
      groupsSection.style.display = 'none';
    }
  }

  function onInput() {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      calculate();
    }, 400);
  }

  function onReshuffleClick() {
    calculate();
  }

  function onCopyClick() {
    const textToCopy = shuffledOutput.value;
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '✅ Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  listInput.addEventListener('input', onInput);
  separatorSelect.addEventListener('change', calculate);
  groupCountInput.addEventListener('input', calculate);
  shuffleBtn.addEventListener('click', onReshuffleClick);
  copyBtn.addEventListener('click', onCopyClick);

  // Initial calculation if there's prefilled value
  if (listInput.value) {
    calculate();
  }

  return () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    listInput.removeEventListener('input', onInput);
    separatorSelect.removeEventListener('change', calculate);
    groupCountInput.removeEventListener('input', calculate);
    shuffleBtn.removeEventListener('click', onReshuffleClick);
    copyBtn.removeEventListener('click', onCopyClick);
  };
}
