export const meta = {
  slug: 'blood-pressure',
  title: 'Blood Pressure Analyzer',
  description: 'Classify your blood pressure reading and understand cardiovascular health risk.',
  category: 'health',
  icon: '💉',
  relatedSlugs: ['bmi', 'heart-rate'],
};

const CATEGORIES = [
  { label: 'Low (Hypotension)', color: '#3b82f6', sys: [0, 90], dia: [0, 60], desc: 'Blood pressure is below normal. May cause dizziness or fainting. Stay hydrated.' },
  { label: 'Normal', color: '#22c55e', sys: [0, 120], dia: [0, 80], desc: 'Optimal blood pressure. Maintain healthy habits.' },
  { label: 'Elevated', color: '#eab308', sys: [120, 130], dia: [0, 80], desc: 'Higher than normal but not yet hypertension. Lifestyle changes recommended.' },
  { label: 'High – Stage 1', color: '#f97316', sys: [130, 140], dia: [80, 90], desc: 'Hypertension Stage 1. Consult a doctor and consider lifestyle/medication changes.' },
  { label: 'High – Stage 2', color: '#ef4444', sys: [140, 180], dia: [90, 120], desc: 'Hypertension Stage 2. Requires medical treatment.' },
  { label: 'Hypertensive Crisis', color: '#dc2626', sys: [180, 999], dia: [120, 999], desc: '⚠️ Seek emergency medical care immediately!' },
];

function classify(sys, dia) {
  // Crisis first
  if (sys >= 180 || dia >= 120) return CATEGORIES[5];
  if (sys >= 140 || dia >= 90) return CATEGORIES[4];
  if (sys >= 130 && dia < 90) return CATEGORIES[3];
  if ((sys >= 120 && sys < 130) && dia < 80) return CATEGORIES[2];
  if (sys < 90 || dia < 60) return CATEGORIES[0];
  return CATEGORIES[1];
}

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="form-group">
          <label class="form-label">Systolic Pressure (mmHg)</label>
          <input type="number" id="bp-sys" class="form-control" value="120" min="50" max="300" placeholder="Top number" />
        </div>
        <div class="form-group">
          <label class="form-label">Diastolic Pressure (mmHg)</label>
          <input type="number" id="bp-dia" class="form-control" value="80" min="30" max="200" placeholder="Bottom number" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Pulse / Heart Rate (bpm, optional)</label>
        <input type="number" id="bp-pulse" class="form-control" value="" min="30" max="250" placeholder="Optional" />
      </div>
    </div>

    <div class="calc-result-section" id="bp-results" style="display:none;">
      <div id="bp-category-card" class="glass-card" style="padding:1.5rem;text-align:center;margin-bottom:1rem;border-left:5px solid #ccc;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">Reading</div>
        <div id="bp-reading" style="font-size:2.5rem;font-weight:800;color:var(--primary-color);"></div>
        <div id="bp-cat-label" style="font-size:1.2rem;font-weight:700;margin-top:0.5rem;"></div>
        <div id="bp-cat-desc" style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.5rem;max-width:400px;margin-inline:auto;"></div>
      </div>
      <div id="bp-pulse-card" class="glass-card" style="padding:1rem;display:none;text-align:center;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">Pulse Pressure</div>
        <div id="bp-pulse-pressure" style="font-size:1.5rem;font-weight:700;color:var(--secondary-color);"></div>
        <div style="font-size:0.8rem;color:var(--text-secondary);">(Normal: 40–60 mmHg)</div>
      </div>
      <div style="margin-top:1rem;">
        <div style="font-weight:600;margin-bottom:0.5rem;font-size:0.9rem;">Reference Chart</div>
        ${CATEGORIES.map(c => `<div style="display:flex;align-items:center;gap:0.75rem;padding:0.4rem 0.5rem;border-radius:6px;margin-bottom:4px;font-size:0.82rem;">
          <div style="width:12px;height:12px;border-radius:50%;background:${c.color};flex-shrink:0;"></div>
          <div style="flex:1;">${c.label}</div>
          <div class="text-mono" style="color:var(--text-secondary);font-size:0.78rem;">${c.sys[0] === 0 ? '< ' + c.sys[1] : c.sys[0] + '–' + c.sys[1]}/${c.dia[0] === 0 ? '< ' + c.dia[1] : c.dia[0] + '–' + c.dia[1]}</div>
        </div>`).join('')}
      </div>
    </div>
    <div class="calc-formula">
      <h3>Understanding Blood Pressure</h3>
      <p>Blood pressure is written as <strong>Systolic/Diastolic</strong> (e.g. 120/80 mmHg). Systolic = pressure when heart beats. Diastolic = pressure between beats.</p>
      <p>⚠️ This tool is for educational use. Always consult a healthcare professional for medical advice.</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const sysInput = el.querySelector('#bp-sys');
  const diaInput = el.querySelector('#bp-dia');
  const pulseInput = el.querySelector('#bp-pulse');
  const resultsDiv = el.querySelector('#bp-results');
  const card = el.querySelector('#bp-category-card');

  function calculate() {
    const sys = parseFloat(sysInput.value);
    const dia = parseFloat(diaInput.value);
    if (isNaN(sys) || isNaN(dia) || sys < 50 || dia < 30) { resultsDiv.style.display = 'none'; return; }

    const cat = classify(sys, dia);
    el.querySelector('#bp-reading').textContent = `${sys} / ${dia}`;
    el.querySelector('#bp-cat-label').textContent = cat.label;
    el.querySelector('#bp-cat-label').style.color = cat.color;
    el.querySelector('#bp-cat-desc').textContent = cat.desc;
    card.style.borderLeftColor = cat.color;

    const pulse = parseFloat(pulseInput.value);
    const pulseCard = el.querySelector('#bp-pulse-card');
    if (!isNaN(pulse) && pulse > 0) {
      const pp = sys - dia;
      el.querySelector('#bp-pulse-pressure').textContent = `${pp} mmHg`;
      pulseCard.style.display = '';
    } else {
      pulseCard.style.display = 'none';
    }

    resultsDiv.style.display = '';
  }

  [sysInput, diaInput, pulseInput].forEach(i => i.addEventListener('input', calculate));
  calculate();

  return () => {
    [sysInput, diaInput, pulseInput].forEach(i => i.removeEventListener('input', calculate));
  };
}
