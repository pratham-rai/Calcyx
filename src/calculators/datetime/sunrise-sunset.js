export const meta = {
  slug: 'sunrise-sunset',
  name: 'Sunrise & Sunset',
  title: 'Sunrise & Sunset Calculator - Calcyx',
  description: 'Calculate approximate sunrise, sunset times and day length for any location using latitude, longitude, and date.',
  category: 'datetime',
  icon: '🌅',
  keywords: ['sunrise', 'sunset', 'dawn', 'dusk', 'day length', 'solar', 'golden hour', 'latitude', 'longitude'],
  formula: 'NOAA Solar Calculator algorithm (Spencer/Fourier series approximation)',
  relatedSlugs: ['timezone', 'days-between']
};

export function render() {
  const container = document.createElement('div');
  container.className = 'calc-page';
  container.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <div class="calc-icon">🌅</div>
        <h1 class="calc-title">Sunrise &amp; Sunset</h1>
        <p class="calc-description">Calculate approximate sunrise and sunset times for any location and date using astronomical equations.</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="ss-lat">Latitude (°)</label>
            <input type="number" id="ss-lat" class="calc-input" placeholder="e.g. 40.7128" min="-90" max="90" step="0.0001">
          </div>
          <div class="calc-input-group">
            <label for="ss-lon">Longitude (°)</label>
            <input type="number" id="ss-lon" class="calc-input" placeholder="e.g. -74.0060" min="-180" max="180" step="0.0001">
          </div>
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="ss-date">Date</label>
            <input type="date" id="ss-date" class="calc-input">
          </div>
          <div class="calc-input-group">
            <label for="ss-tz">UTC Offset (hours)</label>
            <input type="number" id="ss-tz" class="calc-input" placeholder="e.g. -5 or +5.5" min="-12" max="14" step="0.5">
          </div>
        </div>
        <button id="ss-locate-btn" class="calc-input" style="cursor:pointer;font-weight:600;padding:8px 16px;margin-bottom:8px;">
          📍 Use My Location
        </button>
        <div id="ss-locate-status" style="font-size:0.8rem;opacity:0.65;min-height:18px;"></div>

        <div class="calc-result" id="result" style="display:none;">
          <div class="calc-result-grid">
            <div class="calc-result-item">
              <div class="calc-result-label">🌄 Sunrise</div>
              <div class="calc-result-value" id="ss-rise" style="font-size:1.6rem;"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">🌇 Sunset</div>
              <div class="calc-result-value" id="ss-set" style="font-size:1.6rem;"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">☀️ Day Length</div>
              <div class="calc-result-value" id="ss-length" style="font-size:1.6rem;"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">🌙 Night Length</div>
              <div class="calc-result-value" id="ss-night" style="font-size:1.6rem;"></div>
            </div>
          </div>
          <div id="ss-polar-note" style="display:none;text-align:center;margin-top:12px;font-size:0.9rem;opacity:0.8;"></div>
        </div>

        <div class="calc-formula">
          <h3>Calculation Method</h3>
          <code>Solar declination + hour angle → sunrise/sunset</code>
          <p>Uses the NOAA simplified solar position algorithm. The sun's declination angle is computed from the day of year, then the hour angle formula H = arccos((sin(z) − sin(lat)·sin(dec)) / (cos(lat)·cos(dec))) gives the time offset from solar noon. Accuracy is typically within 1–2 minutes.</p>
        </div>
      </div>
    </div>
  `;
  return container;
}

export function mount() {
  const latEl = document.getElementById('ss-lat');
  const lonEl = document.getElementById('ss-lon');
  const dateEl = document.getElementById('ss-date');
  const tzEl = document.getElementById('ss-tz');
  const resultEl = document.getElementById('result');
  const riseEl = document.getElementById('ss-rise');
  const setEl = document.getElementById('ss-set');
  const lengthEl = document.getElementById('ss-length');
  const nightEl = document.getElementById('ss-night');
  const polarEl = document.getElementById('ss-polar-note');
  const locateBtn = document.getElementById('ss-locate-btn');
  const locateStatus = document.getElementById('ss-locate-status');

  // Defaults
  dateEl.value = new Date().toISOString().split('T')[0];
  tzEl.value = (-(new Date().getTimezoneOffset()) / 60).toString();

  const DEG = Math.PI / 180;

  function dayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / 86400000);
  }

  function calcSunriseSunset(lat, lon, date, tzOffset) {
    const doy = dayOfYear(date);
    // Solar declination (Spencer's equation)
    const B = (2 * Math.PI / 365) * (doy - 1);
    const dec = 0.006918 - 0.399912 * Math.cos(B) + 0.070257 * Math.sin(B)
      - 0.006758 * Math.cos(2*B) + 0.000907 * Math.sin(2*B)
      - 0.002697 * Math.cos(3*B) + 0.00148  * Math.sin(3*B);

    // Equation of time (minutes)
    const ET = 229.18 * (0.000075 + 0.001868 * Math.cos(B) - 0.032077 * Math.sin(B)
      - 0.014615 * Math.cos(2*B) - 0.04089 * Math.sin(2*B));

    // Solar zenith at sunrise/sunset = 90.833 degrees (accounts for refraction + solar disk)
    const z = 90.833 * DEG;
    const latR = lat * DEG;

    const cosH = (Math.cos(z) - Math.sin(latR) * Math.sin(dec)) / (Math.cos(latR) * Math.cos(dec));

    if (cosH < -1) return { type: 'polar-day' };
    if (cosH > 1) return { type: 'polar-night' };

    const H = Math.acos(cosH) / DEG; // hour angle in degrees

    // Solar noon in minutes from midnight (UTC)
    const solarNoonUTC = 720 - 4 * lon - ET;

    const sunriseUTC = solarNoonUTC - 4 * H; // minutes from midnight UTC
    const sunsetUTC = solarNoonUTC + 4 * H;

    const sunriseMins = sunriseUTC + tzOffset * 60;
    const sunsetMins = sunsetUTC + tzOffset * 60;

    return { type: 'normal', sunriseMins, sunsetMins };
  }

  function minsToTime(totalMins) {
    let m = ((totalMins % 1440) + 1440) % 1440; // wrap to 0-1440
    const h = Math.floor(m / 60);
    const min = Math.round(m % 60);
    const suffix = h < 12 ? 'AM' : 'PM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${min.toString().padStart(2,'0')} ${suffix}`;
  }

  function minsToHHMM(mins) {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h}h ${m.toString().padStart(2,'0')}m`;
  }

  function calculate() {
    const lat = parseFloat(latEl.value);
    const lon = parseFloat(lonEl.value);
    const dateStr = dateEl.value;
    const tz = parseFloat(tzEl.value);

    if (isNaN(lat) || isNaN(lon) || !dateStr || isNaN(tz)) {
      resultEl.style.display = 'none'; return;
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      resultEl.style.display = 'none'; return;
    }

    const date = new Date(dateStr + 'T12:00:00Z');
    const result = calcSunriseSunset(lat, lon, date, tz);

    if (result.type === 'polar-day') {
      riseEl.textContent = '—';
      setEl.textContent = '—';
      lengthEl.textContent = '24h 00m';
      nightEl.textContent = '0h 00m';
      polarEl.textContent = '☀️ Polar Day — The sun does not set on this date at this location.';
      polarEl.style.display = 'block';
    } else if (result.type === 'polar-night') {
      riseEl.textContent = '—';
      setEl.textContent = '—';
      lengthEl.textContent = '0h 00m';
      nightEl.textContent = '24h 00m';
      polarEl.textContent = '🌑 Polar Night — The sun does not rise on this date at this location.';
      polarEl.style.display = 'block';
    } else {
      riseEl.textContent = minsToTime(result.sunriseMins);
      setEl.textContent = minsToTime(result.sunsetMins);
      const dayMins = result.sunsetMins - result.sunriseMins;
      const nightMins = 1440 - dayMins;
      lengthEl.textContent = minsToHHMM(Math.max(0, dayMins));
      nightEl.textContent = minsToHHMM(Math.max(0, nightMins));
      polarEl.style.display = 'none';
    }

    resultEl.style.display = 'block';
  }

  const listeners = [];
  function addListener(el, event, fn) {
    el.addEventListener(event, fn);
    listeners.push({ el, event, fn });
  }

  addListener(latEl, 'input', calculate);
  addListener(lonEl, 'input', calculate);
  addListener(dateEl, 'input', calculate);
  addListener(tzEl, 'input', calculate);

  addListener(locateBtn, 'click', () => {
    if (!navigator.geolocation) {
      locateStatus.textContent = 'Geolocation not supported by this browser.';
      return;
    }
    locateStatus.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(pos => {
      latEl.value = pos.coords.latitude.toFixed(4);
      lonEl.value = pos.coords.longitude.toFixed(4);
      locateStatus.textContent = `📍 ${pos.coords.latitude.toFixed(4)}°, ${pos.coords.longitude.toFixed(4)}°`;
      calculate();
    }, () => {
      locateStatus.textContent = 'Unable to retrieve location. Please enter manually.';
    });
  });

  return function cleanup() {
    listeners.forEach(({ el, event, fn }) => el.removeEventListener(event, fn));
  };
}
