export const meta = {
  slug: 'due-date',
  title: 'IVF & Due Date (Detailed)',
  description: 'Calculate an IVF or LMP-based due date with a full pregnancy milestone timeline.',
  category: 'health',
  icon: '🍼',
  relatedSlugs: ['pregnancy', 'ovulation'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Method</label>
        <div style="display:flex;gap:0.5rem;">
          <button id="dd-lmp" class="btn btn-primary" style="flex:1;">📅 Last Period (LMP)</button>
          <button id="dd-ivf3" class="btn btn-secondary" style="flex:1;">🧪 IVF – Day 3</button>
          <button id="dd-ivf5" class="btn btn-secondary" style="flex:1;">🧪 IVF – Day 5</button>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" id="dd-date-label">Date of Last Period</label>
        <input type="date" id="dd-date" class="form-control" />
      </div>
    </div>

    <div class="calc-result-section" id="dd-results" style="display:none;">
      <div class="glass-card" style="padding:1.5rem;text-align:center;margin-bottom:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">Estimated Due Date</div>
        <div id="dd-due" style="font-size:2rem;font-weight:800;color:var(--primary-color);"></div>
        <div id="dd-weeks-left" style="font-size:0.9rem;color:var(--text-secondary);margin-top:0.25rem;"></div>
      </div>

      <div class="glass-card" style="padding:1rem;margin-bottom:1rem;">
        <div style="font-weight:600;margin-bottom:0.75rem;">📊 Current Progress</div>
        <div id="dd-progress-bar-wrap" style="margin-bottom:0.5rem;">
          <div style="height:10px;background:var(--bg-secondary,#e2e8f0);border-radius:5px;overflow:hidden;">
            <div id="dd-progress-bar" style="height:100%;background:var(--primary-color);border-radius:5px;transition:width 0.3s;"></div>
          </div>
          <div id="dd-progress-label" style="text-align:center;font-size:0.82rem;color:var(--text-secondary);margin-top:0.3rem;"></div>
        </div>
        <div id="dd-trimester" style="font-size:0.9rem;font-weight:600;text-align:center;"></div>
      </div>

      <div class="glass-card" style="padding:1rem;">
        <div style="font-weight:600;margin-bottom:0.75rem;">🗓 Key Milestones</div>
        <div id="dd-milestones"></div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Methods</h3>
      <p><strong>LMP Method (Naegele's Rule)</strong>: Due date = LMP + 280 days (40 weeks).</p>
      <p><strong>IVF Day 3 Transfer</strong>: Due date = transfer date + 263 days.</p>
      <p><strong>IVF Day 5 Transfer (Blastocyst)</strong>: Due date = transfer date + 261 days.</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const lmpBtn = el.querySelector('#dd-lmp');
  const ivf3Btn = el.querySelector('#dd-ivf3');
  const ivf5Btn = el.querySelector('#dd-ivf5');
  const dateInput = el.querySelector('#dd-date');
  const dateLabel = el.querySelector('#dd-date-label');
  const resultsDiv = el.querySelector('#dd-results');

  const now = new Date();
  dateInput.value = now.toISOString().slice(0, 10);
  let method = 'lmp';

  const MILESTONES = [
    { week: 6, label: 'Heartbeat detectable (ultrasound)' },
    { week: 10, label: 'End of embryonic period' },
    { week: 12, label: 'End of 1st Trimester / NT scan' },
    { week: 16, label: 'Quad screen blood test' },
    { week: 20, label: 'Anatomy ultrasound (mid-pregnancy)' },
    { week: 24, label: 'Viability milestone' },
    { week: 28, label: 'Start of 3rd Trimester / GD test' },
    { week: 32, label: 'Fetal position usually established' },
    { week: 36, label: 'Weekly OB checks begin' },
    { week: 37, label: 'Full term begins' },
    { week: 40, label: '🎉 Estimated Due Date' },
  ];

  function setMethod(m) {
    method = m;
    lmpBtn.className = m === 'lmp' ? 'btn btn-primary' : 'btn btn-secondary';
    ivf3Btn.className = m === 'ivf3' ? 'btn btn-primary' : 'btn btn-secondary';
    ivf5Btn.className = m === 'ivf5' ? 'btn btn-primary' : 'btn btn-secondary';
    dateLabel.textContent = m === 'lmp' ? 'Date of Last Period' : 'IVF Transfer Date';
    calculate();
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function fmtDate(d) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function calculate() {
    if (!dateInput.value) { resultsDiv.style.display = 'none'; return; }
    const startDate = new Date(dateInput.value);
    const offset = method === 'lmp' ? 280 : method === 'ivf3' ? 263 : 261;
    const conceptDate = method === 'lmp' ? addDays(startDate, 14) : startDate;
    const dueDate = addDays(startDate, offset);

    const today = new Date();
    const totalDays = 280;
    const daysPassed = Math.round((today - addDays(startDate, 0)) / 86400000);
    const weeksPregnant = Math.max(0, Math.floor(daysPassed / 7));
    const daysFrac = daysPassed % 7;
    const daysLeft = Math.max(0, Math.round((dueDate - today) / 86400000));
    const pct = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

    el.querySelector('#dd-due').textContent = fmtDate(dueDate);
    el.querySelector('#dd-weeks-left').textContent = daysLeft > 0
      ? `${daysLeft} days remaining (approx ${Math.ceil(daysLeft/7)} weeks)`
      : 'Due date has passed — congratulations! 🎉';

    el.querySelector('#dd-progress-bar').style.width = pct.toFixed(0) + '%';
    el.querySelector('#dd-progress-label').textContent = daysPassed > 0
      ? `Week ${weeksPregnant}+${daysFrac} (${pct.toFixed(0)}%)`
      : 'Before pregnancy start';

    let tri = '1st Trimester (Weeks 1–12)';
    if (weeksPregnant >= 28) tri = '3rd Trimester (Weeks 28–40)';
    else if (weeksPregnant >= 13) tri = '2nd Trimester (Weeks 13–27)';
    el.querySelector('#dd-trimester').textContent = daysPassed > 0 ? tri : '';

    const milestonesDiv = el.querySelector('#dd-milestones');
    milestonesDiv.innerHTML = MILESTONES.map(m => {
      const mDate = addDays(startDate, m.week * 7);
      const isPast = mDate < today;
      const isNear = !isPast && mDate - today < 14 * 86400000;
      return `<div style="display:flex;align-items:center;gap:0.75rem;padding:0.4rem 0;border-bottom:1px solid var(--border-color);font-size:0.82rem;">
        <div style="width:22px;text-align:center;">${isPast ? '✅' : isNear ? '🔜' : '○'}</div>
        <div style="flex:1;color:${isPast ? 'var(--text-secondary)' : 'inherit'};">${m.label}</div>
        <div class="text-mono" style="font-size:0.75rem;color:var(--text-secondary);">Wk ${m.week} · ${fmtDate(mDate)}</div>
      </div>`;
    }).join('');

    resultsDiv.style.display = '';
  }

  lmpBtn.addEventListener('click', () => setMethod('lmp'));
  ivf3Btn.addEventListener('click', () => setMethod('ivf3'));
  ivf5Btn.addEventListener('click', () => setMethod('ivf5'));
  dateInput.addEventListener('input', calculate);

  calculate();

  return () => {
    lmpBtn.removeEventListener('click', () => setMethod('lmp'));
    ivf3Btn.removeEventListener('click', () => setMethod('ivf3'));
    ivf5Btn.removeEventListener('click', () => setMethod('ivf5'));
    dateInput.removeEventListener('input', calculate);
  };
}
