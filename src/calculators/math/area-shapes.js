export const meta = {
  slug: 'area-shapes',
  title: '2D Shape Area & Perimeter',
  description: 'Calculate area, perimeter, and dimensions for circles, rectangles, triangles, ellipses, and polygons.',
  category: 'math',
  icon: '🔲',
  relatedSlugs: ['triangle', 'percentage'],
};

export function render() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="calc-input-section">
      <div class="form-group">
        <label class="form-label">Select Shape</label>
        <select id="area-shape-select" class="form-control">
          <option value="circle">Circle</option>
          <option value="rectangle">Rectangle</option>
          <option value="ellipse">Ellipse</option>
          <option value="trapezoid">Trapezoid</option>
          <option value="polygon">Regular Polygon</option>
        </select>
      </div>

      <!-- Circle Fields -->
      <div id="area-fields-circle">
        <div class="form-group">
          <label class="form-label">Radius (r)</label>
          <input type="number" id="area-circle-r" class="form-control" value="5" min="0" step="any" />
        </div>
      </div>

      <!-- Rectangle Fields -->
      <div id="area-fields-rectangle" style="display:none;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">Length (l)</label>
            <input type="number" id="area-rect-l" class="form-control" value="6" min="0" step="any" />
          </div>
          <div class="form-group">
            <label class="form-label">Width (w)</label>
            <input type="number" id="area-rect-w" class="form-control" value="4" min="0" step="any" />
          </div>
        </div>
      </div>

      <!-- Ellipse Fields -->
      <div id="area-fields-ellipse" style="display:none;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">Semi-major Axis (a)</label>
            <input type="number" id="area-ellipse-a" class="form-control" value="6" min="0" step="any" />
          </div>
          <div class="form-group">
            <label class="form-label">Semi-minor Axis (b)</label>
            <input type="number" id="area-ellipse-b" class="form-control" value="4" min="0" step="any" />
          </div>
        </div>
      </div>

      <!-- Trapezoid Fields -->
      <div id="area-fields-trapezoid" style="display:none;">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;">
          <div class="form-group">
            <label class="form-label">Base a</label>
            <input type="number" id="area-trap-a" class="form-control" value="6" min="0" step="any" />
          </div>
          <div class="form-group">
            <label class="form-label">Base b</label>
            <input type="number" id="area-trap-b" class="form-control" value="8" min="0" step="any" />
          </div>
          <div class="form-group">
            <label class="form-label">Height (h)</label>
            <input type="number" id="area-trap-h" class="form-control" value="5" min="0" step="any" />
          </div>
        </div>
      </div>

      <!-- Regular Polygon Fields -->
      <div id="area-fields-polygon" style="display:none;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">Number of Sides (n)</label>
            <input type="number" id="area-poly-n" class="form-control" value="5" min="3" max="100" />
          </div>
          <div class="form-group">
            <label class="form-label">Side Length (s)</label>
            <input type="number" id="area-poly-s" class="form-control" value="4" min="0" step="any" />
          </div>
        </div>
      </div>
    </div>

    <div class="calc-result-section" id="area-results" style="display:none;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);">Area</div>
          <div id="area-val" style="font-size:2rem;font-weight:800;color:var(--primary-color);"></div>
        </div>
        <div class="glass-card" style="padding:1.25rem;text-align:center;">
          <div style="font-size:0.8rem;color:var(--text-secondary);" id="area-perim-label">Perimeter</div>
          <div id="area-perim-val" style="font-size:2rem;font-weight:800;color:var(--secondary-color);"></div>
        </div>
      </div>
    </div>

    <div class="calc-formula">
      <h3>Formula</h3>
      <div id="area-formula-desc" style="font-size:0.9rem;"></div>
    </div>
  `;
  return el;
}

export function mount(el) {
  const shapeSelect = el.querySelector('#area-shape-select');
  const resultsDiv = el.querySelector('#area-results');
  const areaVal = el.querySelector('#area-val');
  const perimVal = el.querySelector('#area-perim-val');
  const perimLabel = el.querySelector('#area-perim-label');
  const formulaDesc = el.querySelector('#area-formula-desc');

  const groups = {
    circle: el.querySelector('#area-fields-circle'),
    rectangle: el.querySelector('#area-fields-rectangle'),
    ellipse: el.querySelector('#area-fields-ellipse'),
    trapezoid: el.querySelector('#area-fields-trapezoid'),
    polygon: el.querySelector('#area-fields-polygon'),
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
    let area = NaN, perimeter = NaN;

    if (shape === 'circle') {
      const r = parseFloat(el.querySelector('#area-circle-r').value);
      if (r >= 0) {
        area = Math.PI * r * r;
        perimeter = 2 * Math.PI * r;
        perimLabel.textContent = 'Circumference';
        formulaDesc.innerHTML = `
          <p><strong>Area</strong> = πr² = π × ${fmt(r)}²</p>
          <p><strong>Circumference</strong> = 2πr = 2 × π × ${fmt(r)}</p>
        `;
      }
    } else if (shape === 'rectangle') {
      const l = parseFloat(el.querySelector('#area-rect-l').value);
      const w = parseFloat(el.querySelector('#area-rect-w').value);
      if (l >= 0 && w >= 0) {
        area = l * w;
        perimeter = 2 * (l + w);
        perimLabel.textContent = 'Perimeter';
        formulaDesc.innerHTML = `
          <p><strong>Area</strong> = l × w = ${fmt(l)} × ${fmt(w)}</p>
          <p><strong>Perimeter</strong> = 2(l + w) = 2 × (${fmt(l)} + ${fmt(w)})</p>
        `;
      }
    } else if (shape === 'ellipse') {
      const a = parseFloat(el.querySelector('#area-ellipse-a').value);
      const b = parseFloat(el.querySelector('#area-ellipse-b').value);
      if (a >= 0 && b >= 0) {
        area = Math.PI * a * b;
        // Ramanujan approximation for ellipse perimeter
        const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
        perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
        perimLabel.textContent = 'Perimeter (Approx.)';
        formulaDesc.innerHTML = `
          <p><strong>Area</strong> = πab = π × ${fmt(a)} × ${fmt(b)}</p>
          <p><strong>Perimeter</strong> ≈ π(a + b)[1 + 3h / (10 + √(4 - 3h))]</p>
        `;
      }
    } else if (shape === 'trapezoid') {
      const a = parseFloat(el.querySelector('#area-trap-a').value);
      const b = parseFloat(el.querySelector('#area-trap-b').value);
      const h = parseFloat(el.querySelector('#area-trap-h').value);
      if (a >= 0 && b >= 0 && h >= 0) {
        area = ((a + b) / 2) * h;
        // slant height perimeter needs assuming symmetrical isosceles trapezoid
        const slant = Math.sqrt(Math.pow((b - a) / 2, 2) + h * h);
        perimeter = a + b + 2 * slant;
        perimLabel.textContent = 'Perimeter (Isosceles)';
        formulaDesc.innerHTML = `
          <p><strong>Area</strong> = ½(a + b)h = ½ × (${fmt(a)} + ${fmt(b)}) × ${fmt(h)}</p>
          <p><strong>Slant Height</strong> = √[((b-a)/2)² + h²]</p>
        `;
      }
    } else if (shape === 'polygon') {
      const n = parseInt(el.querySelector('#area-poly-n').value);
      const s = parseFloat(el.querySelector('#area-poly-s').value);
      if (n >= 3 && s >= 0) {
        area = (n * s * s) / (4 * Math.tan(Math.PI / n));
        perimeter = n * s;
        perimLabel.textContent = 'Perimeter';
        formulaDesc.innerHTML = `
          <p><strong>Area</strong> = (n × s²) / [4 × tan(π/n)]</p>
          <p><strong>Perimeter</strong> = n × s = ${n} × ${fmt(s)}</p>
        `;
      }
    }

    if (isNaN(area)) {
      resultsDiv.style.display = 'none';
      return;
    }

    areaVal.textContent = fmt(area);
    perimVal.textContent = fmt(perimeter);
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
