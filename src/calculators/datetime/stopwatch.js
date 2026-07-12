export const meta = {
  slug: 'stopwatch',
  name: 'Stopwatch & Timer',
  title: 'Stopwatch & Timer - Calcyx',
  description: 'A responsive stopwatch displaying minutes, seconds, and milliseconds with lap splits, alongside a countdown timer featuring a visual progress bar.',
  category: 'datetime',
  icon: '⏱️',
  keywords: ['stopwatch', 'timer', 'countdown', 'lap timer', 'clock', 'time tracker'],
  formula: 'Elapsed Time = Current Time - Start Time',
  relatedSlugs: ['countdown', 'time-duration']
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
      
      <!-- Tab Selection -->
      <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
        <button id="tab-stopwatch" class="calc-input" style="flex: 1; font-weight: bold; background: rgba(59, 130, 246, 0.2); border-color: #3B82F6; cursor: pointer; text-align: center; justify-content: center; height: 40px;">Stopwatch</button>
        <button id="tab-timer" class="calc-input" style="flex: 1; font-weight: bold; background: transparent; cursor: pointer; border-color: transparent; text-align: center; justify-content: center; height: 40px; color: var(--text-muted);">Countdown Timer</button>
      </div>

      <div class="calc-body">
        <!-- Stopwatch Tab Content -->
        <div id="stopwatch-tab">
          <div style="text-align: center; margin-bottom: 25px;">
            <div id="stopwatch-display" style="font-family: monospace; font-size: 3.5rem; font-weight: bold; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.1); letter-spacing: 1px;">00:00:00.000</div>
          </div>
          
          <div class="calc-row" style="margin-bottom: 25px; gap: 10px;">
            <button id="sw-start-stop" class="calc-input" style="flex: 1.2; background: #10B981; color: white; border: none; font-weight: bold; cursor: pointer; text-align: center; justify-content: center; height: 45px; border-radius: 8px;">Start</button>
            <button id="sw-lap" class="calc-input" style="flex: 1; background: #4B5563; color: white; border: none; font-weight: bold; cursor: pointer; text-align: center; justify-content: center; height: 45px; border-radius: 8px;" disabled>Lap</button>
            <button id="sw-reset" class="calc-input" style="flex: 1; background: #EF4444; color: white; border: none; font-weight: bold; cursor: pointer; text-align: center; justify-content: center; height: 45px; border-radius: 8px;">Reset</button>
          </div>

          <!-- Laps Container -->
          <div id="sw-laps-container" style="display: none; max-height: 220px; overflow-y: auto; background: rgba(255, 255, 255, 0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); padding: 12px;">
            <table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.95rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-muted);">
                  <th style="padding: 8px 4px;">Lap</th>
                  <th style="padding: 8px 4px;">Split Time</th>
                  <th style="padding: 8px 4px;">Total Time</th>
                </tr>
              </thead>
              <tbody id="sw-laps-list"></tbody>
            </table>
          </div>
        </div>

        <!-- Timer Tab Content -->
        <div id="timer-tab" style="display: none;">
          <div class="calc-row" style="margin-bottom: 25px;">
            <div class="calc-input-group" style="flex: 1;">
              <label for="timer-h">Hours</label>
              <input type="number" id="timer-h" class="calc-input" min="0" max="23" value="0" placeholder="0">
            </div>
            <div class="calc-input-group" style="flex: 1;">
              <label for="timer-m">Minutes</label>
              <input type="number" id="timer-m" class="calc-input" min="0" max="59" value="5" placeholder="5">
            </div>
            <div class="calc-input-group" style="flex: 1;">
              <label for="timer-s">Seconds</label>
              <input type="number" id="timer-s" class="calc-input" min="0" max="59" value="0" placeholder="0">
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 25px;">
            <div id="timer-display" style="font-family: monospace; font-size: 3.5rem; font-weight: bold; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.1); letter-spacing: 1px;">00:05:00</div>
            
            <!-- Progress Bar -->
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-top: 15px; border: 1px solid rgba(255,255,255,0.05);">
              <div id="timer-progress" style="width: 100%; height: 100%; background: linear-gradient(90deg, #3B82F6, #10B981); transition: width 0.15s linear;"></div>
            </div>
          </div>

          <div class="calc-row" style="gap: 10px;">
            <button id="tm-start-pause" class="calc-input" style="flex: 1.2; background: #3B82F6; color: white; border: none; font-weight: bold; cursor: pointer; text-align: center; justify-content: center; height: 45px; border-radius: 8px;">Start</button>
            <button id="tm-reset" class="calc-input" style="flex: 1; background: #EF4444; color: white; border: none; font-weight: bold; cursor: pointer; text-align: center; justify-content: center; height: 45px; border-radius: 8px;">Reset</button>
          </div>
        </div>
      </div>

      <div class="calc-formula">
        <h3>How it Works</h3>
        <p><strong>Stopwatch:</strong> Utilizes high-precision internal browser time ('Date.now()') to track splits and elapsed milliseconds without timer drift. The Lap feature allows recording individual lap lengths on the fly.</p>
        <p><strong>Timer:</strong> Counts down to zero from the specified hours, minutes, and seconds. Relies on difference math to ensure timing accuracy, paired with a dynamic visual percentage bar and a custom frequency oscillator sound when completed.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  // Tabs
  const tabSw = document.getElementById('tab-stopwatch');
  const tabTm = document.getElementById('tab-timer');
  const swTab = document.getElementById('stopwatch-tab');
  const tmTab = document.getElementById('timer-tab');

  // Stopwatch elements
  const swDisplay = document.getElementById('stopwatch-display');
  const swStartStop = document.getElementById('sw-start-stop');
  const swLap = document.getElementById('sw-lap');
  const swReset = document.getElementById('sw-reset');
  const swLapsContainer = document.getElementById('sw-laps-container');
  const swLapsList = document.getElementById('sw-laps-list');

  // Timer elements
  const tmH = document.getElementById('timer-h');
  const tmM = document.getElementById('timer-m');
  const tmS = document.getElementById('timer-s');
  const tmDisplay = document.getElementById('timer-display');
  const tmProgress = document.getElementById('timer-progress');
  const tmStartPause = document.getElementById('tm-start-pause');
  const tmReset = document.getElementById('tm-reset');

  // Stopwatch State
  let swRunning = false;
  let swStartTime = 0;
  let swElapsedTime = 0;
  let swInterval = null;
  let swLaps = [];
  let lastLapTime = 0;

  // Timer State
  let tmRunning = false;
  let tmTotalDuration = 0;
  let tmRemaining = 0;
  let tmStartTime = 0;
  let tmInterval = null;

  // Tab switching
  function selectSwTab() {
    swTab.style.display = 'block';
    tmTab.style.display = 'none';
    tabSw.style.background = 'rgba(59, 130, 246, 0.2)';
    tabSw.style.borderColor = '#3B82F6';
    tabSw.style.color = '#fff';
    tabTm.style.background = 'transparent';
    tabTm.style.borderColor = 'transparent';
    tabTm.style.color = 'var(--text-muted)';
  }

  function selectTmTab() {
    swTab.style.display = 'none';
    tmTab.style.display = 'block';
    tabTm.style.background = 'rgba(59, 130, 246, 0.2)';
    tabTm.style.borderColor = '#3B82F6';
    tabTm.style.color = '#fff';
    tabSw.style.background = 'transparent';
    tabSw.style.borderColor = 'transparent';
    tabSw.style.color = 'var(--text-muted)';
  }

  // Format Helpers
  function formatTime(ms) {
    let temp = ms;
    const hours = Math.floor(temp / 3600000);
    temp %= 3600000;
    const minutes = Math.floor(temp / 60000);
    temp %= 60000;
    const seconds = Math.floor(temp / 1000);
    const milliseconds = temp % 1000;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const mss = String(milliseconds).padStart(3, '0');

    return `${hh}:${mm}:${ss}.${mss}`;
  }

  function formatCountdown(ms) {
    let temp = Math.ceil(ms / 1000);
    if (temp < 0) temp = 0;
    const hours = Math.floor(temp / 3600);
    temp %= 3600;
    const minutes = Math.floor(temp / 60);
    const seconds = temp % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
  }

  function getTimerInputsMs() {
    const h = Math.max(0, parseInt(tmH.value, 10) || 0);
    const m = Math.max(0, parseInt(tmM.value, 10) || 0);
    const s = Math.max(0, parseInt(tmS.value, 10) || 0);
    return (h * 3600 + m * 60 + s) * 1000;
  }

  // Synthesis Beep
  function playAlarm() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Play 3 short beeps
      const playBeep = (delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.25);
      };

      playBeep(0);
      playBeep(0.3);
      playBeep(0.6);
    } catch (e) {
      console.warn("AudioContext block/failure", e);
    }
  }

  // --- Stopwatch Logic ---
  function updateStopwatch() {
    const currentElapsed = Date.now() - swStartTime;
    swDisplay.textContent = formatTime(currentElapsed);
  }

  function toggleStopwatch() {
    if (!swRunning) {
      swRunning = true;
      swStartTime = Date.now() - swElapsedTime;
      swInterval = setInterval(updateStopwatch, 29); // 30+ FPS refresh
      swStartStop.textContent = 'Stop';
      swStartStop.style.background = '#EF4444'; // Red for Stop
      swLap.disabled = false;
      swLap.style.background = '#3B82F6'; // Blue active
    } else {
      swRunning = false;
      swElapsedTime = Date.now() - swStartTime;
      clearInterval(swInterval);
      swStartStop.textContent = 'Start';
      swStartStop.style.background = '#10B981'; // Green for Start
      swLap.disabled = true;
      swLap.style.background = '#4B5563';
    }
  }

  function triggerLap() {
    if (!swRunning) return;
    const currentElapsed = Date.now() - swStartTime;
    const lapSplit = currentElapsed - lastLapTime;
    swLaps.push({ split: lapSplit, total: currentElapsed });
    lastLapTime = currentElapsed;

    // Show lap table
    swLapsContainer.style.display = 'block';

    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    tr.innerHTML = `
      <td style="padding: 6px 4px;">#${swLaps.length}</td>
      <td style="padding: 6px 4px; color: #3B82F6;">${formatTime(lapSplit)}</td>
      <td style="padding: 6px 4px; color: #10B981;">${formatTime(currentElapsed)}</td>
    `;
    swLapsList.insertBefore(tr, swLapsList.firstChild);
  }

  function resetStopwatch() {
    swRunning = false;
    swElapsedTime = 0;
    lastLapTime = 0;
    if (swInterval) clearInterval(swInterval);
    swLaps = [];
    
    swDisplay.textContent = '00:00:00.000';
    swStartStop.textContent = 'Start';
    swStartStop.style.background = '#10B981';
    swLap.disabled = true;
    swLap.style.background = '#4B5563';
    swLapsList.innerHTML = '';
    swLapsContainer.style.display = 'none';
  }

  // --- Timer Logic ---
  function updateTimer() {
    const elapsed = Date.now() - tmStartTime;
    let remaining = tmRemaining - elapsed;

    if (remaining <= 0) {
      remaining = 0;
      clearInterval(tmInterval);
      tmRunning = false;
      tmRemaining = 0;
      
      tmDisplay.textContent = '00:00:00';
      tmProgress.style.width = '0%';
      tmStartPause.textContent = 'Start';
      tmStartPause.style.background = '#3B82F6';

      tmH.disabled = false;
      tmM.disabled = false;
      tmS.disabled = false;

      playAlarm();
      return;
    }

    tmDisplay.textContent = formatCountdown(remaining);
    const pct = Math.max(0, Math.min(100, (remaining / tmTotalDuration) * 100));
    tmProgress.style.width = `${pct}%`;
  }

  function toggleTimer() {
    if (!tmRunning) {
      const inputMs = getTimerInputsMs();
      if (inputMs <= 0 && tmRemaining <= 0) {
        return; // nothing to count down
      }

      if (tmRemaining <= 0) {
        tmRemaining = inputMs;
        tmTotalDuration = inputMs;
      }

      tmRunning = true;
      tmStartTime = Date.now();
      tmInterval = setInterval(updateTimer, 50);

      tmStartPause.textContent = 'Pause';
      tmStartPause.style.background = '#EAB308'; // Yellow for pause

      tmH.disabled = true;
      tmM.disabled = true;
      tmS.disabled = true;
    } else {
      tmRunning = false;
      tmRemaining = Math.max(0, tmRemaining - (Date.now() - tmStartTime));
      clearInterval(tmInterval);

      tmStartPause.textContent = 'Resume';
      tmStartPause.style.background = '#3B82F6';
    }
  }

  function resetTimer() {
    tmRunning = false;
    if (tmInterval) clearInterval(tmInterval);
    
    tmRemaining = getTimerInputsMs();
    tmTotalDuration = tmRemaining;

    tmDisplay.textContent = formatCountdown(tmRemaining);
    tmProgress.style.width = '100%';

    tmStartPause.textContent = 'Start';
    tmStartPause.style.background = '#3B82F6';

    tmH.disabled = false;
    tmM.disabled = false;
    tmS.disabled = false;
  }

  function onTimerInputsChange() {
    if (!tmRunning) {
      resetTimer();
    }
  }

  // Attach Event Listeners
  tabSw.addEventListener('click', selectSwTab);
  tabTm.addEventListener('click', selectTmTab);

  swStartStop.addEventListener('click', toggleStopwatch);
  swLap.addEventListener('click', triggerLap);
  swReset.addEventListener('click', resetStopwatch);

  tmStartPause.addEventListener('click', toggleTimer);
  tmReset.addEventListener('click', resetTimer);

  tmH.addEventListener('input', onTimerInputsChange);
  tmM.addEventListener('input', onTimerInputsChange);
  tmS.addEventListener('input', onTimerInputsChange);

  // Initial Timer Display
  resetTimer();

  // Cleanup
  return () => {
    tabSw.removeEventListener('click', selectSwTab);
    tabTm.removeEventListener('click', selectTmTab);

    swStartStop.removeEventListener('click', toggleStopwatch);
    swLap.removeEventListener('click', triggerLap);
    swReset.removeEventListener('click', resetStopwatch);

    tmStartPause.removeEventListener('click', toggleTimer);
    tmReset.removeEventListener('click', resetTimer);

    tmH.removeEventListener('input', onTimerInputsChange);
    tmM.removeEventListener('input', onTimerInputsChange);
    tmS.removeEventListener('input', onTimerInputsChange);

    if (swInterval) clearInterval(swInterval);
    if (tmInterval) clearInterval(tmInterval);
  };
}
