export const meta = {
  slug: 'prime-factors',
  title: 'Prime Factorization',
  description: 'Find the prime factorization of any number with step-by-step factor trees.',
  category: 'math',
  icon: '🔢',
  relatedSlugs: ['gcd-lcm', 'base-converter'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Number to Factorize</label>
        <input type="number" id="pf-num" class="form-control" value="360" min="2" max="999999999" placeholder="Enter a positive integer" />
      </div>
    </div>
    <div class="calc-result-section" id="pf-results" style="display:none;">
      <div class="glass-card" style="padding:1.5rem;text-align:center;margin-bottom:1rem;">
        <div style="font-size:0.85rem;color:var(--text-secondary);">Prime Factorization</div>
        <div id="pf-result-expr" style="font-size:1.8rem;font-weight:700;color:var(--primary-color);margin-top:0.5rem;word-break:break-all;"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem;">
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Number of Divisors</div>
          <div id="pf-divisor-count" style="font-size:1.6rem;font-weight:700;color:var(--secondary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Is Prime?</div>
          <div id="pf-is-prime" style="font-size:1.6rem;font-weight:700;"></div>
        </div>
      </div>
      <div class="glass-card" style="padding:1rem;">
        <div style="font-weight:600;margin-bottom:0.5rem;">All Divisors</div>
        <div id="pf-divisors" style="display:flex;flex-wrap:wrap;gap:0.4rem;"></div>
      </div>
      <div class="glass-card" style="padding:1rem;margin-top:0.75rem;">
        <div style="font-weight:600;margin-bottom:0.5rem;">Division Steps</div>
        <div id="pf-steps" style="font-size:0.85rem;font-family:monospace;"></div>
      </div>
    </div>
    <div class="calc-formula">
      <h3>What is Prime Factorization?</h3>
      <p>Every integer &gt; 1 can be expressed as a unique product of prime numbers (Fundamental Theorem of Arithmetic). Example: 360 = 2³ × 3² × 5.</p>
    </div>
  `;
  return el;
}

export function mount(el) {
  const numInput = el.querySelector('#pf-num');
  const resultsDiv = el.querySelector('#pf-results');

  function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
    return true;
  }

  function factorize(n) {
    const factors = {};
    const steps = [];
    let d = 2;
    while (n > 1) {
      if (n % d === 0) {
        steps.push({ divisor: d, quotient: n / d, value: n });
        factors[d] = (factors[d] || 0) + 1;
        n = n / d;
      } else {
        d++;
      }
    }
    return { factors, steps };
  }

  function getDivisors(n) {
    const divs = [];
    for (let i = 1; i * i <= n; i++) {
      if (n % i === 0) {
        divs.push(i);
        if (i !== n / i) divs.push(n / i);
      }
    }
    return divs.sort((a, b) => a - b);
  }

  function calculate() {
    const n = parseInt(numInput.value);
    if (isNaN(n) || n < 2 || n > 999999999) { resultsDiv.style.display = 'none'; return; }

    const { factors, steps } = factorize(n);
    const isP = isPrime(n);

    // Expression
    const expr = Object.entries(factors).map(([p, e]) => e === 1 ? p : `${p}<sup>${e}</sup>`).join(' × ');
    el.querySelector('#pf-result-expr').innerHTML = isP ? String(n) + ' (prime)' : expr;

    const divisors = getDivisors(n);
    el.querySelector('#pf-divisor-count').textContent = divisors.length;

    const isPrimeEl = el.querySelector('#pf-is-prime');
    isPrimeEl.textContent = isP ? 'Yes ✅' : 'No';
    isPrimeEl.style.color = isP ? '#22c55e' : 'var(--text-primary)';

    const divsDiv = el.querySelector('#pf-divisors');
    divsDiv.innerHTML = divisors.map(d => `<span style="background:var(--bg-secondary,#f1f5f9);padding:0.2rem 0.5rem;border-radius:4px;font-size:0.82rem;font-family:monospace;">${d}</span>`).join('');

    const stepsDiv = el.querySelector('#pf-steps');
    stepsDiv.innerHTML = steps.map(s => `<div style="padding:0.2rem 0;">${s.value} ÷ ${s.divisor} = ${s.quotient}</div>`).join('') +
      `<div style="padding:0.2rem 0;color:var(--primary-color);font-weight:600;">1 (done)</div>`;

    resultsDiv.style.display = '';
  }

  numInput.addEventListener('input', calculate);
  calculate();

  return () => numInput.removeEventListener('input', calculate);
}
