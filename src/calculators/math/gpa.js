export const meta = {
  slug: 'gpa',
  name: 'GPA / Grade Calculator',
  title: 'GPA and Grade Calculator - Calcyx',
  description: 'Calculate your semester or cumulative GPA (Grade Point Average) based on course credits and letter grades.',
  category: 'math',
  icon: '🎓',
  keywords: ['gpa calculator', 'grade calculator', 'grade point average', 'semester gpa', 'class grade', 'weighted gpa'],
  formula: 'GPA = Σ (Grade Points × Credits) / Σ Credits',
  relatedSlugs: ['average', 'percentage']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';
  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">🎓</span>
        <h1 class="calc-title">GPA / Grade Calculator</h1>
        <p class="calc-description">Determine your weighted semester or cumulative GPA by entering your course names, grades, and credits. You can add or remove courses (3 to 8 rows).</p>
      </div>
      <div class="calc-body">
        <div id="gpa-courses-container">
          <!-- Dynamic course rows will be inserted here -->
        </div>

        <div style="margin-top: 1.5rem; margin-bottom: 1.5rem; display: flex; gap: 0.5rem;">
          <button type="button" id="gpa-add-row" class="calc-input" style="cursor: pointer; display: inline-block; width: auto; padding: 0.5rem 1rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 6px; font-weight: 500; font-size: 0.9rem;">+ Add Course</button>
          <button type="button" id="gpa-remove-row" class="calc-input" style="cursor: pointer; display: inline-block; width: auto; padding: 0.5rem 1rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 6px; font-weight: 500; font-size: 0.9rem;">− Remove Last</button>
        </div>
      </div>

      <div id="result" class="calc-result" style="display:none;">
        <div class="calc-result-value" id="gpa-value">0.00</div>
        <div class="calc-result-label">Weighted GPA</div>
        <div class="calc-result-grid" style="margin-top: 1rem;">
          <div class="calc-result-item">
            <div class="calc-result-label">Total Credits</div>
            <div class="calc-result-detail" id="gpa-total-credits" style="font-size: 1.2rem; font-weight: 600;">0</div>
          </div>
          <div class="calc-result-item">
            <div class="calc-result-label">Total Grade Points</div>
            <div class="calc-result-detail" id="gpa-total-points" style="font-size: 1.2rem; font-weight: 600;">0</div>
          </div>
        </div>
        <div class="calc-result-detail" id="gpa-steps" style="margin-top: 1.5rem; text-align: left; white-space: pre-line; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; line-height: 1.5; font-family: monospace; font-size: 0.9rem;"></div>
      </div>

      <div class="calc-formula">
        <h3>📐 GPA Calculation Formula</h3>
        <code>GPA = Total Grade Points ÷ Total Credits</code>
        <p>Where <strong>Grade Points</strong> for a course is the product of the credit value and the numerical grade value:</p>
        <p>• A = 4.0 | A- = 3.7 | B+ = 3.3 | B = 3.0 | B- = 2.7 | C+ = 2.3 | C = 2.0 | D = 1.0 | F = 0.0</p>
        <p>Courses with incomplete details or 0 credits are excluded from the GPA calculation.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const container = document.getElementById('gpa-courses-container');
  const addBtn = document.getElementById('gpa-add-row');
  const removeBtn = document.getElementById('gpa-remove-row');
  
  let rowCount = 5;

  function createRow(index) {
    const row = document.createElement('div');
    row.className = 'calc-row course-row';
    row.id = `gpa-row-${index}`;
    row.style.alignItems = 'flex-end';
    row.style.marginBottom = '1rem';
    row.innerHTML = `
      <div class="calc-input-group" style="flex: 2; margin-bottom: 0;">
        <label for="gpa-name-${index}">Course ${index} Name</label>
        <input type="text" id="gpa-name-${index}" class="calc-input gpa-name" placeholder="e.g. Course ${index}">
      </div>
      <div class="calc-input-group" style="flex: 1.2; margin-bottom: 0; margin-left: 0.5rem;">
        <label for="gpa-grade-${index}">Grade</label>
        <select id="gpa-grade-${index}" class="calc-select gpa-grade">
          <option value="">Grade</option>
          <option value="4.0">A (4.0)</option>
          <option value="3.7">A- (3.7)</option>
          <option value="3.3">B+ (3.3)</option>
          <option value="3.0">B (3.0)</option>
          <option value="2.7">B- (2.7)</option>
          <option value="2.3">C+ (2.3)</option>
          <option value="2.0">C (2.0)</option>
          <option value="1.0">D (1.0)</option>
          <option value="0.0">F (0.0)</option>
        </select>
      </div>
      <div class="calc-input-group" style="flex: 1; margin-bottom: 0; margin-left: 0.5rem;">
        <label for="gpa-credits-${index}">Credits</label>
        <input type="number" id="gpa-credits-${index}" class="calc-input gpa-credits" placeholder="Credits" min="0" max="20" step="0.5">
      </div>
    `;
    return row;
  }

  // Add initial rows
  for (let i = 1; i <= rowCount; i++) {
    container.appendChild(createRow(i));
  }

  function calculate() {
    let totalCredits = 0;
    let totalPoints = 0;
    const details = [];

    for (let i = 1; i <= rowCount; i++) {
      const nameEl = document.getElementById(`gpa-name-${i}`);
      const gradeEl = document.getElementById(`gpa-grade-${i}`);
      const creditsEl = document.getElementById(`gpa-credits-${i}`);

      if (!nameEl || !gradeEl || !creditsEl) continue;

      const gradeVal = gradeEl.value;
      const creditsVal = parseFloat(creditsEl.value);
      const courseName = nameEl.value.trim() || `Course ${i}`;

      if (gradeVal !== '' && !isNaN(creditsVal) && creditsVal > 0) {
        const gradePoints = parseFloat(gradeVal);
        const coursePoints = gradePoints * creditsVal;
        totalCredits += creditsVal;
        totalPoints += coursePoints;
        
        const gradeText = gradeEl.options[gradeEl.selectedIndex].text.split(' ')[0];
        details.push(`• ${courseName}: Grade ${gradeText} (${gradePoints.toFixed(1)}) × ${creditsVal} Credits = ${coursePoints.toFixed(2)} Points`);
      }
    }

    const resultDiv = document.getElementById('result');
    if (totalCredits === 0) {
      resultDiv.style.display = 'none';
      return;
    }

    const finalGpa = totalPoints / totalCredits;

    document.getElementById('gpa-value').textContent = finalGpa.toFixed(2);
    document.getElementById('gpa-total-credits').textContent = totalCredits.toLocaleString(undefined, { maximumFractionDigits: 2 });
    document.getElementById('gpa-total-points').textContent = totalPoints.toLocaleString(undefined, { maximumFractionDigits: 2 });

    const stepsDiv = document.getElementById('gpa-steps');
    let stepText = `📝 Calculation breakdown:\n` + details.join('\n');
    stepText += `\n\nWeighted GPA = Total Grade Points ÷ Total Credits\n`;
    stepText += `= ${totalPoints.toFixed(2)} ÷ ${totalCredits.toFixed(2)}\n`;
    stepText += `= ${finalGpa.toFixed(4)} → ${finalGpa.toFixed(2)}`;

    stepsDiv.textContent = stepText;
    resultDiv.style.display = '';
  }

  function onInput(e) {
    if (e.target.classList.contains('gpa-name') || e.target.classList.contains('gpa-grade') || e.target.classList.contains('gpa-credits')) {
      calculate();
    }
  }

  container.addEventListener('input', onInput);

  function addRow() {
    if (rowCount < 8) {
      rowCount++;
      container.appendChild(createRow(rowCount));
      calculate();
    }
  }

  function removeRow() {
    if (rowCount > 3) {
      const row = document.getElementById(`gpa-row-${rowCount}`);
      if (row) {
        container.removeChild(row);
      }
      rowCount--;
      calculate();
    }
  }

  addBtn.addEventListener('click', addRow);
  removeBtn.addEventListener('click', removeRow);

  return () => {
    container.removeEventListener('input', onInput);
    addBtn.removeEventListener('click', addRow);
    removeBtn.removeEventListener('click', removeRow);
  };
}
