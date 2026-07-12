export const meta = {
  slug: 'matrix',
  name: 'Matrix Calculator',
  title: 'Matrix Calculator - Calcyx',
  description: 'Calculate matrix determinant, transpose, and inverse for 2x2 and 3x3 matrices with step-by-step fractions or decimals.',
  category: 'math',
  icon: '🧮',
  keywords: ['matrix', 'determinant', 'inverse matrix', 'transpose', 'linear algebra', '2x2 matrix', '3x3 matrix'],
  formula: 'det(A), Aᵀ, A⁻¹ = adj(A)/det(A)',
  relatedSlugs: ['quadratic', 'base-converter']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">🧮</span>
        <h1 class="calc-title">Matrix Calculator</h1>
        <p class="calc-description">Compute the determinant, transpose, and inverse of a 2x2 or 3x3 matrix. Values can be integers or decimals.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="matrix-size">Matrix Size</label>
          <select id="matrix-size" class="calc-select">
            <option value="2">2 x 2</option>
            <option value="3" selected>3 x 3</option>
          </select>
        </div>
        
        <label style="display: block; font-weight: 500; margin-top: 1rem; margin-bottom: 0.25rem;">Enter Matrix Elements:</label>
        <div id="matrix-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin: 0.5rem auto; max-width: 320px;">
          <!-- Row 1 -->
          <div><input type="number" id="m-1-1" class="calc-input" placeholder="a11" style="text-align: center;" value="1"></div>
          <div><input type="number" id="m-1-2" class="calc-input" placeholder="a12" style="text-align: center;" value="2"></div>
          <div id="col-3-1"><input type="number" id="m-1-3" class="calc-input" placeholder="a13" style="text-align: center;" value="3"></div>
          
          <!-- Row 2 -->
          <div><input type="number" id="m-2-1" class="calc-input" placeholder="a21" style="text-align: center;" value="0"></div>
          <div><input type="number" id="m-2-2" class="calc-input" placeholder="a22" style="text-align: center;" value="1"></div>
          <div id="col-3-2"><input type="number" id="m-2-3" class="calc-input" placeholder="a23" style="text-align: center;" value="4"></div>
          
          <!-- Row 3 -->
          <div id="row-3-1"><input type="number" id="m-3-1" class="calc-input" placeholder="a31" style="text-align: center;" value="5"></div>
          <div id="row-3-2"><input type="number" id="m-3-2" class="calc-input" placeholder="a32" style="text-align: center;" value="6"></div>
          <div id="row-3-3"><input type="number" id="m-3-3" class="calc-input" placeholder="a33" style="text-align: center;" value="0"></div>
        </div>
      </div>
      
      <div id="result" class="calc-result" style="display: none;">
        <div class="calc-result-grid" style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Determinant Result -->
          <div class="calc-result-item" style="padding: 1rem;">
            <div class="calc-result-label">Determinant (det A)</div>
            <div class="calc-result-value" id="matrix-det-val"></div>
            <div class="calc-result-detail" id="matrix-det-detail" style="margin-top: 0.5rem; word-break: break-all;"></div>
          </div>
          
          <!-- Transpose Result -->
          <div class="calc-result-item" style="padding: 1rem;">
            <div class="calc-result-label">Transpose (Aᵀ)</div>
            <div id="matrix-transpose-grid" style="display: grid; gap: 0.5rem; justify-content: center; margin: 0.75rem auto 0 auto; padding: 0.25rem;">
              <!-- Elements will be generated dynamically -->
            </div>
          </div>
          
          <!-- Inverse Result -->
          <div class="calc-result-item" style="padding: 1rem;">
            <div class="calc-result-label">Inverse (A⁻¹)</div>
            <div id="matrix-inverse-status" class="calc-result-detail" style="margin-bottom: 0.5rem; font-weight: 500;"></div>
            <div id="matrix-inverse-grid" style="display: grid; gap: 0.5rem; justify-content: center; margin: 0.75rem auto 0 auto; padding: 0.25rem;">
              <!-- Elements will be generated dynamically -->
            </div>
          </div>
          
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>📐 Matrix Formulas</h3>
        <p><strong>Determinant (2x2):</strong></p>
        <code>det(A) = ad − bc</code>
        <p><strong>Determinant (3x3):</strong></p>
        <code>det(A) = a(ei − fh) − b(di − fg) + c(dh − eg)</code>
        <p><strong>Inverse:</strong></p>
        <code>A⁻¹ = (1 / det(A)) × adj(A)</code>
        <p>An inverse exists if and only if the determinant is non-zero (matrix is non-singular).</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const sizeSelect = document.getElementById('matrix-size');
  const gridContainer = document.getElementById('matrix-grid');
  
  const col31 = document.getElementById('col-3-1');
  const col32 = document.getElementById('col-3-2');
  const row31 = document.getElementById('row-3-1');
  const row32 = document.getElementById('row-3-2');
  const row33 = document.getElementById('row-3-3');
  
  const m11 = document.getElementById('m-1-1');
  const m12 = document.getElementById('m-1-2');
  const m13 = document.getElementById('m-1-3');
  const m21 = document.getElementById('m-2-1');
  const m22 = document.getElementById('m-2-2');
  const m23 = document.getElementById('m-2-3');
  const m31 = document.getElementById('m-3-1');
  const m32 = document.getElementById('m-3-2');
  const m33 = document.getElementById('m-3-3');
  
  const allInputs = [m11, m12, m13, m21, m22, m23, m31, m32, m33];

  function formatNum(n) {
    if (Math.abs(n) < 1e-9) return '0';
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }

  function toFraction(val) {
    if (isNaN(val) || !isFinite(val)) return 'NaN';
    const sign = val < 0 ? '−' : '';
    const absVal = Math.abs(val);
    if (absVal < 1e-9) return '0';
    if (Math.abs(absVal - Math.round(absVal)) < 1e-9) return sign + Math.round(absVal).toString();
    
    let x = absVal;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    for (let i = 0; i < 8; i++) {
      let a = Math.floor(x);
      let h = a * h1 + h2;
      let k = a * k1 + k2;
      if (k > 100) break;
      h2 = h1; h1 = h;
      k2 = k1; k1 = k;
      if (Math.abs(x - a) < 1e-9) break;
      x = 1 / (x - a);
    }
    
    if (Math.abs(absVal - h1 / k1) < 1e-5) {
      if (k1 === 1) return sign + h1;
      return sign + h1 + '/' + k1;
    }
    return sign + absVal.toFixed(4).replace(/\.?0+$/, '');
  }

  function renderMatrixGrid(container, arr, size) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.style.width = '100%';
    container.style.maxWidth = size === 2 ? '140px' : '210px';
    container.style.borderLeft = '2px solid currentColor';
    container.style.borderRight = '2px solid currentColor';
    container.style.padding = '0 0.5rem';
    container.style.borderRadius = '6px';
    
    arr.forEach(val => {
      const item = document.createElement('div');
      item.style.textAlign = 'center';
      item.style.padding = '0.35rem';
      item.style.fontSize = size === 3 ? '0.9rem' : '1rem';
      item.style.fontWeight = '500';
      
      const frac = toFraction(val);
      const dec = formatNum(val);
      
      if (frac !== dec && frac.includes('/')) {
        const hasMinus = frac.startsWith('−');
        const cleanFrac = hasMinus ? frac.substring(1) : frac;
        const [num, den] = cleanFrac.split('/');
        item.innerHTML = `
          <div style="display: inline-flex; align-items: center; justify-content: center; gap: 2px;">
            ${hasMinus ? '<span>−</span>' : ''}
            <div style="display: inline-flex; flex-direction: column; align-items: center; line-height: 1;">
              <span style="border-bottom: 1px solid currentColor; padding-bottom: 1px; width: 100%; text-align: center;">${num}</span>
              <span style="padding-top: 1px; width: 100%; text-align: center;">${den}</span>
            </div>
          </div>
        `;
      } else {
        item.textContent = frac;
        item.style.lineHeight = '2';
      }
      container.appendChild(item);
    });
  }

  function calculate() {
    const size = parseInt(sizeSelect.value, 10);
    const resultEl = document.getElementById('result');
    const detValEl = document.getElementById('matrix-det-val');
    const detDetailEl = document.getElementById('matrix-det-detail');
    const transposeGrid = document.getElementById('matrix-transpose-grid');
    const inverseStatus = document.getElementById('matrix-inverse-status');
    const inverseGrid = document.getElementById('matrix-inverse-grid');
    
    const v11 = parseFloat(m11.value);
    const v12 = parseFloat(m12.value);
    const v13 = size === 3 ? parseFloat(m13.value) : 0;
    const v21 = parseFloat(m21.value);
    const v22 = parseFloat(m22.value);
    const v23 = size === 3 ? parseFloat(m23.value) : 0;
    const v31 = size === 3 ? parseFloat(m31.value) : 0;
    const v32 = size === 3 ? parseFloat(m32.value) : 0;
    const v33 = size === 3 ? parseFloat(m33.value) : 0;
    
    let hasNaN = false;
    if (size === 2) {
      if (isNaN(v11) || isNaN(v12) || isNaN(v21) || isNaN(v22)) {
        hasNaN = true;
      }
    } else {
      if (allInputs.some(input => isNaN(parseFloat(input.value)))) {
        hasNaN = true;
      }
    }
    
    if (hasNaN) {
      resultEl.style.display = 'none';
      return;
    }
    
    let det = 0;
    let inv = null;
    let trans = [];
    
    if (size === 2) {
      det = v11 * v22 - v12 * v21;
      trans = [v11, v21, v12, v22];
      if (Math.abs(det) > 1e-12) {
        inv = [
          v22 / det, -v12 / det,
          -v21 / det, v11 / det
        ];
      }
      
      detDetailEl.textContent = `det(A) = (${formatNum(v11)} × ${formatNum(v22)}) − (${formatNum(v12)} × ${formatNum(v21)})`;
    } else {
      const term1 = v11 * (v22 * v33 - v23 * v32);
      const term2 = v12 * (v21 * v33 - v23 * v31);
      const term3 = v13 * (v21 * v32 - v22 * v31);
      det = term1 - term2 + term3;
      
      trans = [
        v11, v21, v31,
        v12, v22, v32,
        v13, v23, v33
      ];
      
      if (Math.abs(det) > 1e-12) {
        const c11 = +(v22 * v33 - v23 * v32);
        const c12 = -(v21 * v33 - v23 * v31);
        const c13 = +(v21 * v32 - v22 * v31);
        const c21 = -(v12 * v33 - v13 * v32);
        const c22 = +(v11 * v33 - v13 * v31);
        const c23 = -(v11 * v32 - v12 * v31);
        const c31 = +(v12 * v23 - v13 * v22);
        const c32 = -(v11 * v23 - v13 * v21);
        const c33 = +(v11 * v22 - v12 * v21);
        
        inv = [
          c11 / det, c21 / det, c31 / det,
          c12 / det, c22 / det, c32 / det,
          c13 / det, c23 / det, c33 / det
        ];
      }
      
      detDetailEl.textContent = `det(A) = ${formatNum(v11)}×(${formatNum(v22)}×${formatNum(v33)} − ${formatNum(v23)}×${formatNum(v32)}) − ${formatNum(v12)}×(${formatNum(v21)}×${formatNum(v33)} − ${formatNum(v23)}×${formatNum(v31)}) + ${formatNum(v13)}×(${formatNum(v21)}×${formatNum(v32)} − ${formatNum(v22)}×${formatNum(v31)})`;
    }
    
    detValEl.textContent = formatNum(det);
    
    renderMatrixGrid(transposeGrid, trans, size);
    
    if (inv) {
      inverseStatus.textContent = 'Matrix is invertible (det ≠ 0).';
      inverseStatus.style.color = '';
      renderMatrixGrid(inverseGrid, inv, size);
    } else {
      inverseStatus.textContent = 'Matrix is singular (det = 0). No inverse exists.';
      inverseStatus.style.color = '#ef4444';
      inverseGrid.innerHTML = '';
    }
    
    resultEl.style.display = '';
  }

  function handleSizeChange() {
    const size = parseInt(sizeSelect.value, 10);
    if (size === 2) {
      gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
      gridContainer.style.maxWidth = '220px';
      col31.style.display = 'none';
      col32.style.display = 'none';
      row31.style.display = 'none';
      row32.style.display = 'none';
      row33.style.display = 'none';
    } else {
      gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
      gridContainer.style.maxWidth = '320px';
      col31.style.display = '';
      col32.style.display = '';
      row31.style.display = '';
      row32.style.display = '';
      row33.style.display = '';
    }
    calculate();
  }

  sizeSelect.addEventListener('change', handleSizeChange);
  allInputs.forEach(el => el.addEventListener('input', calculate));
  
  handleSizeChange();
  
  return () => {
    sizeSelect.removeEventListener('change', handleSizeChange);
    allInputs.forEach(el => el.removeEventListener('input', calculate));
  };
}
