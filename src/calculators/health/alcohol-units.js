export const meta = {
  slug: 'alcohol-units',
  title: 'Alcohol Units Calculator',
  description: 'Calculate alcohol units, estimated BAC, and safe drinking guidelines.',
  category: 'health',
  icon: '🍺',
  relatedSlugs: ['water-intake', 'bmi'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Gender</label>
          <select id="al-gender" class="form-control"><option value="male">Male</option><option value="female">Female</option></select>
        </div>
        <div class="form-group">
          <label class="form-label">Body Weight (kg)</label>
          <input type="number" id="al-weight" class="form-control" value="70" min="30" max="250" />
        </div>
      </div>

      <div style="font-weight:600;margin-bottom:0.75rem;margin-top:0.5rem;">Drinks Consumed</div>
      <div id="al-drinks-list"></div>
      <button id="al-add-drink" class="btn btn-secondary" style="margin-top:0.75rem;width:100%;">+ Add Drink</button>

      <div class="form-group" style="margin-top:1rem;">
        <label class="form-label">Hours since drinking started</label>
        <input type="number" id="al-hours" class="form-control" value="2" min="0" max="24" step="0.5" />
      </div>
    </div>

    <div class="calc-result-section" id="al-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Total Units</div>
          <div id="al-units" style="font-size:2rem;font-weight:800;color:var(--primary-color);"></div>
          <div style="font-size:0.75rem;color:var(--text-secondary);">UK units</div>
        </div>
        <div class="glass-card" style="padding:1.25rem;text-align:center;" id="al-bac-card">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Est. BAC</div>
          <div id="al-bac" style="font-size:2rem;font-weight:800;"></div>
          <div style="font-size:0.75rem;color:var(--text-secondary);">g/dL</div>
        </div>
      </div>
      <div id="al-bac-desc" class="glass-card" style="padding:1rem;margin-bottom:1rem;font-size:0.9rem;"></div>
      <div class="glass-card" style="padding:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">
          <strong>Weekly Guidelines (UK NHS):</strong> No more than 14 units/week (men & women), spread over 3+ days.<br>
          <strong>Sober time (est.):</strong> BAC reduces ~0.015 g/dL per hour.
        </div>
        <div id="al-sober-time" style="margin-top:0.5rem;font-weight:600;color:var(--primary-color);"></div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>How Units Are Calculated</h3>
      <p><strong>Units</strong> = (Volume in mL × ABV%) ÷ 1000. Example: 250ml wine at 12% = 3 units.</p>
      <p><strong>BAC (Widmark)</strong> = Units × 10 / (weight(kg) × r) − 0.015 × hours, where r = 0.68 (male) or 0.55 (female).</p>
      <p>⚠️ This is an estimate only. Never drink and drive.</p>
    </div>
  `;
  return el;
}

const DRINK_PRESETS = [
  { name: 'Beer (Pint, 4%)', ml: 568, abv: 4 },
  { name: 'Wine (Glass, 12%)', ml: 175, abv: 12 },
  { name: 'Spirit (Single, 40%)', ml: 25, abv: 40 },
  { name: 'Cider (Can, 5%)', ml: 440, abv: 5 },
  { name: 'Custom', ml: 330, abv: 5 },
];

let drinkCount = 0;

export function mount(el) {
  const genderSel = el.querySelector('#al-gender');
  const weightInput = el.querySelector('#al-weight');
  const hoursInput = el.querySelector('#al-hours');
  const addBtn = el.querySelector('#al-add-drink');
  const drinksList = el.querySelector('#al-drinks-list');
  const resultsDiv = el.querySelector('#al-results');
  drinkCount = 0;

  function addDrink(preset = DRINK_PRESETS[0]) {
    const id = ++drinkCount;
    const row = document.createElement('div');
    row.id = `al-drink-${id}`;
    row.style.cssText = 'display:grid;grid-template-columns:1fr 80px 70px 70px 36px;gap:0.5rem;margin-bottom:0.5rem;align-items:center;';
    row.innerHTML = `
      <select class="form-control al-preset" style="font-size:0.82rem;">
        ${DRINK_PRESETS.map((p, i) => `<option value="${i}" ${p === preset ? 'selected' : ''}>${p.name}</option>`).join('')}
      </select>
      <input type="number" class="form-control al-ml" value="${preset.ml}" min="1" max="2000" placeholder="mL" />
      <input type="number" class="form-control al-abv" value="${preset.abv}" min="0.1" max="100" step="0.1" placeholder="ABV%" />
      <input type="number" class="form-control al-qty" value="1" min="1" max="20" placeholder="Qty" />
      <button class="btn btn-secondary al-remove" style="padding:0.4rem;font-size:1rem;">✕</button>
    `;
    drinksList.appendChild(row);

    row.querySelector('.al-preset').addEventListener('change', function() {
      const p = DRINK_PRESETS[parseInt(this.value)];
      if (p && p.name !== 'Custom') {
        row.querySelector('.al-ml').value = p.ml;
        row.querySelector('.al-abv').value = p.abv;
      }
      calculate();
    });
    row.querySelector('.al-remove').addEventListener('click', () => { row.remove(); calculate(); });
    row.querySelectorAll('input').forEach(i => i.addEventListener('input', calculate));
    calculate();
  }

  function calculate() {
    let totalUnits = 0;
    drinksList.querySelectorAll('[id^="al-drink-"]').forEach(row => {
      const ml = parseFloat(row.querySelector('.al-ml').value) || 0;
      const abv = parseFloat(row.querySelector('.al-abv').value) || 0;
      const qty = parseFloat(row.querySelector('.al-qty').value) || 1;
      totalUnits += (ml * abv / 1000) * qty;
    });

    const weight = parseFloat(weightInput.value) || 70;
    const gender = genderSel.value;
    const hours = parseFloat(hoursInput.value) || 0;
    const r = gender === 'male' ? 0.68 : 0.55;

    const rawBAC = (totalUnits * 10) / (weight * r);
    const bac = Math.max(0, rawBAC - 0.015 * hours);

    el.querySelector('#al-units').textContent = totalUnits.toFixed(1);
    const bacEl = el.querySelector('#al-bac');
    bacEl.textContent = bac.toFixed(3);

    let bacColor = '#22c55e', bacDesc = '✅ Sober — little to no impairment.';
    if (bac >= 0.4) { bacColor = '#dc2626'; bacDesc = '☠️ Potentially fatal — life-threatening.'; }
    else if (bac >= 0.2) { bacColor = '#ef4444'; bacDesc = '🚨 Severe impairment — risk of alcohol poisoning.'; }
    else if (bac >= 0.08) { bacColor = '#f97316'; bacDesc = '⚠️ Legally impaired in most countries. Do NOT drive.'; }
    else if (bac >= 0.04) { bacColor = '#eab308'; bacDesc = '😶 Mild impairment — judgment & coordination affected.'; }
    bacEl.style.color = bacColor;
    el.querySelector('#al-bac-desc').textContent = bacDesc;
    el.querySelector('#al-bac-desc').style.color = bacColor;

    const hoursToSober = bac / 0.015;
    el.querySelector('#al-sober-time').textContent = bac > 0
      ? `Estimated time to be sober: ${hoursToSober.toFixed(1)} more hours`
      : 'Your BAC is at or near zero.';

    resultsDiv.style.display = '';
  }

  addBtn.addEventListener('click', () => addDrink());
  genderSel.addEventListener('change', calculate);
  weightInput.addEventListener('input', calculate);
  hoursInput.addEventListener('input', calculate);

  addDrink(DRINK_PRESETS[0]);

  return () => {
    addBtn.removeEventListener('click', () => addDrink());
    genderSel.removeEventListener('change', calculate);
    weightInput.removeEventListener('input', calculate);
    hoursInput.removeEventListener('input', calculate);
  };
}
