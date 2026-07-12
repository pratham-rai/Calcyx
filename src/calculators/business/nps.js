export const meta = {
  slug: 'nps',
  title: 'Net Promoter Score (NPS)',
  description: 'Calculate your Net Promoter Score (NPS) based on Promoters, Passives, and Detractors survey segments.',
  category: 'business',
  icon: '🗣️',
  relatedSlugs: ['percentage', 'conversion-rate'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-bottom:1rem;">
        <div class="form-group">
          <label class="form-label" style="color:#22c55e;">Promoters (9-10)</label>
          <input type="number" id="nps-prom" class="form-control" value="60" min="0" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#a8a29e;">Passives (7-8)</label>
          <input type="number" id="nps-pass" class="form-control" value="30" min="0" />
        </div>
        <div class="form-group">
          <label class="form-label" style="color:#ef4444;">Detractors (0-6)</label>
          <input type="number" id="nps-detr" class="form-control" value="10" min="0" />
        </div>
      </div>
    </div>

    <div class="calc-result-section" id="nps-results" style="display:none;">
      <div class="glass-card" style="padding:1.5rem;text-align:center;margin-bottom:1rem;border-left:5px solid #ccc;" id="nps-card">
        <div style="font-size:0.85rem;color:var(--text-secondary);">Net Promoter Score</div>
        <div id="nps-val" style="font-size:3rem;font-weight:800;"></div>
        <div id="nps-rating-label" style="font-size:1.1rem;font-weight:700;margin-top:0.25rem;"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;margin-bottom:1rem;font-size:0.85rem;text-align:center;">
        <div class="glass-card" style="padding:0.75rem;">
          <div style="color:var(--text-secondary);">% Promoters</div>
          <div id="nps-pct-prom" style="font-weight:700;color:#22c55e;font-size:1.1rem;margin-top:0.25rem;"></div>
        </div>
        <div class="glass-card" style="padding:0.75rem;">
          <div style="color:var(--text-secondary);">% Passives</div>
          <div id="nps-pct-pass" style="font-weight:700;color:#a8a29e;font-size:1.1rem;margin-top:0.25rem;"></div>
        </div>
        <div class="glass-card" style="padding:0.75rem;">
          <div style="color:var(--text-secondary);">% Detractors</div>
          <div id="nps-pct-detr" style="font-weight:700;color:#ef4444;font-size:1.1rem;margin-top:0.25rem;"></div>
        </div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Formula</h3>
      <p><strong>NPS</strong> = % Promoters − % Detractors</p>
      <p>Range is from <strong>-100</strong> to <strong>+100</strong>. Above 0 is good, above 50 is excellent, above 70 is world-class.</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const promInput = el.querySelector('#nps-prom');
  const passInput = el.querySelector('#nps-pass');
  const detrInput = el.querySelector('#nps-detr');
  const resultsDiv = el.querySelector('#nps-results');
  const npsCard = el.querySelector('#nps-card');

  function calculate() {
    const prom = parseInt(promInput.value) || 0;
    const pass = parseInt(passInput.value) || 0;
    const detr = parseInt(detrInput.value) || 0;
    const total = prom + pass + detr;

    if (total === 0) {
      resultsDiv.style.display = 'none';
      return;
    }

    const pctProm = (prom / total) * 100;
    const pctPass = (pass / total) * 100;
    const pctDetr = (detr / total) * 100;
    const nps = pctProm - pctDetr;

    const npsVal = el.querySelector('#nps-val');
    npsVal.textContent = (nps >= 0 ? '+' : '') + Math.round(nps);

    let color = '#ef4444', label = 'Needs Improvement';
    if (nps >= 70) { color = '#22c55e'; label = '🏆 World Class'; }
    else if (nps >= 50) { color = '#10b981'; label = '🥇 Excellent'; }
    else if (nps >= 0) { color = '#eab308'; label = '✅ Good'; }

    npsVal.style.color = color;
    npsCard.style.borderLeftColor = color;
    el.querySelector('#nps-rating-label').textContent = label;
    el.querySelector('#nps-rating-label').style.color = color;

    el.querySelector('#nps-pct-prom').textContent = pctProm.toFixed(1) + '%';
    el.querySelector('#nps-pct-pass').textContent = pctPass.toFixed(1) + '%';
    el.querySelector('#nps-pct-detr').textContent = pctDetr.toFixed(1) + '%';

    resultsDiv.style.display = '';
  }

  [promInput, passInput, detrInput].forEach(i => i.addEventListener('input', calculate));
  calculate();

  return () => [promInput, passInput, detrInput].forEach(i => i.removeEventListener('input', calculate));
}
