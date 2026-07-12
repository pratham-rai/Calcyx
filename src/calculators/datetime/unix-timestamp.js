export const meta = {
  slug: 'unix-timestamp',
  name: 'Unix Time Converter',
  title: 'Unix Timestamp Converter - Calcyx',
  description: 'Convert between Unix timestamps (seconds or milliseconds) and human-readable dates. Grab the current timestamp instantly.',
  category: 'datetime',
  icon: '⏱️',
  keywords: ['unix timestamp', 'epoch', 'unix time', 'timestamp converter', 'epoch converter', 'unix epoch'],
  formula: 'Unix Time = seconds since 1970-01-01T00:00:00Z (UTC)',
  relatedSlugs: ['timezone', 'time-duration']
};

export function render() {
  const container = document.createElement('div');
  container.className = 'calc-page';
  container.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <div class="calc-icon">⏱️</div>
        <h1 class="calc-title">Unix Time Converter</h1>
        <p class="calc-description">Convert between Unix timestamps and human-readable dates in real time.</p>
      </div>
      <div class="calc-body">

        <div class="calc-row" style="margin-bottom:16px;gap:8px;">
          <button id="ut-mode-ts" class="calc-input" style="cursor:pointer;flex:1;font-weight:600;border:2px solid transparent;transition:all 0.2s;">
            ⬅ Timestamp → Date
          </button>
          <button id="ut-mode-dt" class="calc-input" style="cursor:pointer;flex:1;font-weight:600;border:2px solid transparent;transition:all 0.2s;">
            Date → Timestamp ➡
          </button>
        </div>

        <!-- Mode A: Timestamp to Date -->
        <div id="ut-panel-ts">
          <div class="calc-input-group">
            <label for="ut-ts-input">Unix Timestamp</label>
            <input type="number" id="ut-ts-input" class="calc-input" placeholder="e.g. 1720000000" step="1">
          </div>
          <div class="calc-row" style="gap:8px;margin-top:4px;">
            <label style="display:flex;align-items:center;gap:6px;font-size:0.9rem;cursor:pointer;">
              <input type="radio" name="ut-unit" id="ut-unit-sec" value="s" checked> Seconds
            </label>
            <label style="display:flex;align-items:center;gap:6px;font-size:0.9rem;cursor:pointer;">
              <input type="radio" name="ut-unit" id="ut-unit-ms" value="ms"> Milliseconds
            </label>
            <button id="ut-now-btn" class="calc-input" style="cursor:pointer;padding:6px 14px;font-size:0.85rem;font-weight:600;">
              📍 Current Time
            </button>
          </div>
        </div>

        <!-- Mode B: Date to Timestamp -->
        <div id="ut-panel-dt" style="display:none;">
          <div class="calc-input-group">
            <label for="ut-dt-input">Date & Time (local)</label>
            <input type="datetime-local" id="ut-dt-input" class="calc-input">
          </div>
        </div>

        <div class="calc-result" id="result" style="display:none;">
          <div class="calc-result-grid">
            <div class="calc-result-item" id="ut-res-a">
              <div class="calc-result-label" id="ut-res-a-label">UTC Date & Time</div>
              <div class="calc-result-value" id="ut-res-a-val" style="font-size:1.1rem;word-break:break-all;"></div>
            </div>
            <div class="calc-result-item" id="ut-res-b">
              <div class="calc-result-label" id="ut-res-b-label">Local Date & Time</div>
              <div class="calc-result-value" id="ut-res-b-val" style="font-size:1.1rem;word-break:break-all;"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label" id="ut-res-c-label">Timestamp (s)</div>
              <div class="calc-result-value" id="ut-res-c-val" style="font-size:1.1rem;"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Timestamp (ms)</div>
              <div class="calc-result-value" id="ut-res-d-val" style="font-size:1.1rem;"></div>
            </div>
          </div>
        </div>

        <div class="calc-formula">
          <h3>About Unix Time</h3>
          <code>Unix Epoch = 1970-01-01 00:00:00 UTC</code>
          <p>Unix timestamps count the number of seconds (or milliseconds) elapsed since the Unix epoch. They are timezone-independent and used universally in programming, databases, and APIs. Millisecond timestamps are ~1000× larger than second timestamps.</p>
        </div>
      </div>
    </div>
  `;
  return container;
}

export function mount() {
  const modeTsBtn = document.getElementById('ut-mode-ts');
  const modeDtBtn = document.getElementById('ut-mode-dt');
  const panelTs = document.getElementById('ut-panel-ts');
  const panelDt = document.getElementById('ut-panel-dt');
  const tsInput = document.getElementById('ut-ts-input');
  const dtInput = document.getElementById('ut-dt-input');
  const nowBtn = document.getElementById('ut-now-btn');
  const resultEl = document.getElementById('result');

  let currentMode = 'ts'; // 'ts' or 'dt'

  function setActiveMode(mode) {
    currentMode = mode;
    if (mode === 'ts') {
      panelTs.style.display = 'block';
      panelDt.style.display = 'none';
      modeTsBtn.style.opacity = '1';
      modeDtBtn.style.opacity = '0.5';
    } else {
      panelTs.style.display = 'none';
      panelDt.style.display = 'block';
      modeTsBtn.style.opacity = '0.5';
      modeDtBtn.style.opacity = '1';
    }
    calculate();
  }

  function formatUTC(d) {
    return d.toUTCString().replace(' GMT', ' UTC');
  }

  function formatLocal(d) {
    return d.toLocaleString(undefined, {
      weekday: 'short', year: 'numeric', month: 'short',
      day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }

  function showResults(d) {
    if (!d || isNaN(d.getTime())) { resultEl.style.display = 'none'; return; }
    document.getElementById('ut-res-a-val').textContent = formatUTC(d);
    document.getElementById('ut-res-b-val').textContent = formatLocal(d);
    const ts = Math.floor(d.getTime() / 1000);
    const ms = d.getTime();
    document.getElementById('ut-res-c-val').textContent = ts.toLocaleString();
    document.getElementById('ut-res-d-val').textContent = ms.toLocaleString();
    resultEl.style.display = 'block';
  }

  function calculate() {
    if (currentMode === 'ts') {
      const val = parseFloat(tsInput.value);
      if (isNaN(val)) { resultEl.style.display = 'none'; return; }
      const unit = document.querySelector('input[name="ut-unit"]:checked')?.value;
      const ms = unit === 'ms' ? val : val * 1000;
      showResults(new Date(ms));
    } else {
      const val = dtInput.value;
      if (!val) { resultEl.style.display = 'none'; return; }
      showResults(new Date(val));
    }
  }

  const listeners = [];

  function addListener(el, event, fn) {
    el.addEventListener(event, fn);
    listeners.push({ el, event, fn });
  }

  addListener(modeTsBtn, 'click', () => setActiveMode('ts'));
  addListener(modeDtBtn, 'click', () => setActiveMode('dt'));
  addListener(tsInput, 'input', calculate);
  addListener(dtInput, 'input', calculate);
  addListener(nowBtn, 'click', () => {
    tsInput.value = Math.floor(Date.now() / 1000);
    document.getElementById('ut-unit-sec').checked = true;
    setActiveMode('ts');
    calculate();
  });

  document.querySelectorAll('input[name="ut-unit"]').forEach(r => addListener(r, 'change', calculate));

  // Initialize
  setActiveMode('ts');

  return function cleanup() {
    listeners.forEach(({ el, event, fn }) => el.removeEventListener(event, fn));
  };
}
