export const meta = {
  slug: 'volume-shapes',
  title: '3D Shape Volume & Surface Area',
  description: 'Calculate volume and surface area for spheres, cylinders, cones, pyramids, and prisms.',
  category: 'math',
  icon: '📦',
  relatedSlugs: ['area-shapes', 'triangle'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Select 3D Shape</label>
        <select id="vol-shape-select" class="form-control">
          <option value="sphere">Sphere</option>
          <option value="cylinder">Cylinder</option>
          <option value="cone">Cone</option>
          <option value="prism">Rectangular Prism</option>
          <option value="pyramid">Square Pyramid</option>
        </select>
      </div>

      <!-- Sphere Fields -->
      <div id="vol-fields-sphere">
        <div class="form-group">
          <label class="form-label">Radius (r)</label>
          <input type="number" id="vol-sphere-r" class="form-control" value="5" min="0" step="any" />
        </div>
      </div>

      <!-- Cylinder Fields -->
      <div id="vol-fields-cylinder" style="display:none;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">Radius (r)</label>
            <input type="number" id="vol-cyl-r" class="form-control" value="3" min="0" step="any" />
          </div>
          <div class="form-group">
            <label class="form-label">Height (h)</label>
            <input type="number" id="vol-cyl-h" class="form-control" value="7" min="0" step="any" />
          </div>
        </div>
      </div>

      <!-- Cone Fields -->
      <div id="vol-fields-cone" style="display:none;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">Radius (r)</label>
            <input type="number" id="vol-cone-r" class="form-control" value="3" min="0" step="any" />
          </div>
          <div class="form-group">
            <label class="form-label">Height (h)</label>
            <input type="number" id="vol-cone-h" class="form-control" value="7" min="0" step="any" />
          </div>
        </div>
      </div>

      <!-- Rectangular Prism Fields -->
      <div id="vol-fields-prism" style="display:none;">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;">
          <div class="form-group">
            <label class="form-label">Length (l)</label>
            <input type="number" id="vol-prism-l" class="form-control" value="5" min="0" step="any" />
          </div>
          <div class="form-group">
            <label class="form-label">Width (w)</label>
            <input type="number" id="vol-prism-w" class="form-control" value="4" min="0" step="any" />
          </div>
          <div class="form-group">
            <label class="form-label">Height (h)</label>
            <input type="number" id="vol-prism-h" class="form-control" value="6" min="0" step="any" />
          </div>
        </div>
      </div>

      <!-- Square Pyramid Fields -->
      <div id="vol-fields-pyramid" style="display:none;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">Base Side Length (a)</label>
            <input type="number" id="vol-pyr-a" class="form-control" value="4" min="0" step="any" />
          </div>
          <div class="form-group">
            <label class="form-label">Height (h)</label>
            <input type="number" id="vol-pyr-h" class="form-control" value="6" min="0" step="any" />
          </div>
        </div>
      </div>
    </div>

    <div class="calc-result-section" id="vol-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Volume</div>
          <div id="vol-val" style="font-size:2rem;font-weight:800;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Surface Area</div>
          <div id="vol-sa-val" style="font-size:2rem;font-weight:800;color:var(--secondary-color);"></div>
        </div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Formula</h3>
      <div id="vol-formula-desc" style="font-size:0.9rem;"></div>
    </div>
  `;
  return el;
}

export function mount(el) {
  const shapeSelect = el.querySelector('#vol-shape-select');
  const resultsDiv = el.querySelector('#vol-results');
  const volVal = el.querySelector('#vol-val');
  const saVal = el.querySelector('#vol-sa-val');
  const formulaDesc = el.querySelector('#vol-formula-desc');

  const groups = {
    sphere: el.querySelector('#vol-fields-sphere'),
    cylinder: el.querySelector('#vol-fields-cylinder'),
    cone: el.querySelector('#vol-fields-cone'),
    prism: el.querySelector('#vol-fields-prism'),
    pyramid: el.querySelector('#vol-fields-pyramid'),
  };

  function updateShapeFields() {
    const activeShape = shapeSelect.value;
    Object.keys(groups).forEach(k => {
      groups[k].style.display = k === activeShape ? '' : 'none';
    });
    calculate();
  }

  function fmt(n) {
    if (isNaN(n) || n < 0) return 'Error';
    return parseFloat(n.toFixed(6)).toString();
  }

  function calculate() {
    const shape = shapeSelect.value;
    let vol = NaN, sa = NaN;

    if (shape === 'sphere') {
      const r = parseFloat(el.querySelector('#vol-sphere-r').value);
      if (r >= 0) {
        vol = (4 / 3) * Math.PI * Math.pow(r, 3);
        sa = 4 * Math.PI * r * r;
        formulaDesc.innerHTML = `
          <p><strong>Volume</strong> = ⁴/₃πr³ = ⁴/₃ × π × ${fmt(r)}³</p>
          <p><strong>Surface Area</strong> = 4πr² = 4 × π × ${fmt(r)}²</p>
        `;
      }
    } else if (shape === 'cylinder') {
      const r = parseFloat(el.querySelector('#vol-cyl-r').value);
      const h = parseFloat(el.querySelector('#vol-cyl-h').value);
      if (r >= 0 && h >= 0) {
        vol = Math.PI * r * r * h;
        sa = 2 * Math.PI * r * (r + h);
        formulaDesc.innerHTML = `
          <p><strong>Volume</strong> = πr²h = π × ${fmt(r)}² × ${fmt(h)}</p>
          <p><strong>Surface Area</strong> = 2πrh + 2πr² = 2πr(r + h)</p>
        `;
      }
    } else if (shape === 'cone') {
      const r = parseFloat(el.querySelector('#vol-cone-r').value);
      const h = parseFloat(el.querySelector('#vol-cone-h').value);
      if (r >= 0 && h >= 0) {
        vol = (1 / 3) * Math.PI * r * r * h;
        const s = Math.sqrt(r * r + h * h); // slant height
        sa = Math.PI * r * (r + s);
        formulaDesc.innerHTML = `
          <p><strong>Volume</strong> = ⅓πr²h = ⅓ × π × ${fmt(r)}² × ${fmt(h)}</p>
          <p><strong>Slant Height (s)</strong> = √(r² + h²) = √(${fmt(r)}² + ${fmt(h)}²) = ${fmt(s)}</p>
          <p><strong>Surface Area</strong> = πr(r + s)</p>
        `;
      }
    } else if (shape === 'prism') {
      const l = parseFloat(el.querySelector('#vol-prism-l').value);
      const w = parseFloat(el.querySelector('#vol-prism-w').value);
      const h = parseFloat(el.querySelector('#vol-prism-h').value);
      if (l >= 0 && w >= 0 && h >= 0) {
        vol = l * w * h;
        sa = 2 * (l * w + l * h + w * h);
        formulaDesc.innerHTML = `
          <p><strong>Volume</strong> = l × w × h = ${fmt(l)} × ${fmt(w)} × ${fmt(h)}</p>
          <p><strong>Surface Area</strong> = 2(lw + lh + wh)</p>
        `;
      }
    } else if (shape === 'pyramid') {
      const a = parseFloat(el.querySelector('#vol-pyr-a').value);
      const h = parseFloat(el.querySelector('#vol-pyr-h').value);
      if (a >= 0 && h >= 0) {
        vol = (1 / 3) * a * a * h;
        const slant = Math.sqrt(Math.pow(a / 2, 2) + h * h);
        sa = a * a + 2 * a * slant;
        formulaDesc.innerHTML = `
          <p><strong>Volume</strong> = ⅓ × Base Area × h = ⅓ × a²h</p>
          <p><strong>Surface Area</strong> = Base Area + 4 × (Lateral Triangle Area) = a² + 2a√(a²/4 + h²)</p>
        `;
      }
    }

    if (isNaN(vol)) {
      resultsDiv.style.display = 'none';
      return;
    }

    volVal.textContent = fmt(vol);
    saVal.textContent = fmt(sa);
    resultsDiv.style.display = '';
  }

  shapeSelect.addEventListener('change', updateShapeFields);
  el.querySelectorAll('input').forEach(i => i.addEventListener('input', calculate));

  updateShapeFields();

  return () => {
    shapeSelect.removeEventListener('change', updateShapeFields);
    el.querySelectorAll('input').forEach(i => i.removeEventListener('input', calculate));
  };
}
