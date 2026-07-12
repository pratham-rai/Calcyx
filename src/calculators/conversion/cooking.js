export const meta = {
  slug: 'cooking',
  name: 'Cooking Measurements',
  title: 'Cooking Measurements - Calcyx',
  description: 'Convert between cooking measurements like cups, tablespoons, teaspoons, fluid ounces, milliliters, and grams, accounting for ingredient density.',
  category: 'conversion',
  icon: '🍳',
  keywords: ['cooking', 'convert', 'recipe', 'cups to grams', 'tablespoons', 'milliliters', 'grams', 'density', 'baking'],
  formula: 'Mass = Volume × Density',
  relatedSlugs: ['volume', 'weight']
};

const ingredients = [
  { id: 'water', name: 'Water', density: 1.0 },
  { id: 'flour', name: 'Flour (All-purpose)', density: 0.57 },
  { id: 'sugar', name: 'Sugar (Granulated)', density: 0.85 },
  { id: 'milk', name: 'Milk', density: 1.03 },
  { id: 'butter', name: 'Butter', density: 0.92 }
];

const units = [
  { id: 'cup', name: 'Cups (US cup)', type: 'volume', toMl: 236.5882365 },
  { id: 'tbsp', name: 'Tablespoons (US tbsp)', type: 'volume', toMl: 14.78676478125 },
  { id: 'tsp', name: 'Teaspoons (US tsp)', type: 'volume', toMl: 4.92892159375 },
  { id: 'fl_oz', name: 'Fluid Ounces (US fl oz)', type: 'volume', toMl: 29.5735295625 },
  { id: 'ml', name: 'Milliliters (ml)', type: 'volume', toMl: 1.0 },
  { id: 'g', name: 'Grams (g)', type: 'weight' }
];

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const ingredientOptions = ingredients.map(i => `<option value="${i.id}">${i.name} (${i.density.toFixed(2)} g/ml)</option>`).join('');
  const unitOptions = units.map(u => `<option value="${u.id}">${u.name}</option>`).join('');

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="ingredient">Ingredient</label>
          <select id="ingredient" class="calc-select">${ingredientOptions}</select>
        </div>
        <div class="calc-input-group">
          <label for="value">Value</label>
          <input type="number" id="value" class="calc-input" placeholder="Enter value" step="any" value="1">
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="from-unit">From</label>
            <select id="from-unit" class="calc-select">${unitOptions}</select>
          </div>
          <div class="calc-input-group">
            <label for="to-unit">To</label>
            <select id="to-unit" class="calc-select">${unitOptions}</select>
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="main-result"></div>
          <div class="calc-result-label" id="main-label"></div>
          <div class="calc-result-grid" id="all-conversions"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <p>Converting between volume (like cups or milliliters) and weight (grams) requires knowing the density of the ingredient:</p>
        <code>Weight (g) = Volume (ml) × Density (g/ml)</code>
        <code>Volume (ml) = Weight (g) ÷ Density (g/ml)</code>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const ingredientSelect = document.getElementById('ingredient');
  const valueInput = document.getElementById('value');
  const fromSelect = document.getElementById('from-unit');
  const toSelect = document.getElementById('to-unit');
  const resultDiv = document.getElementById('result');
  const mainResult = document.getElementById('main-result');
  const mainLabel = document.getElementById('main-label');
  const allConversions = document.getElementById('all-conversions');

  // Set defaults: 1 Cup of Flour to Grams (g)
  ingredientSelect.value = 'flour';
  fromSelect.value = 'cup';
  toSelect.value = 'g';

  function formatNum(n) {
    if (Math.abs(n) >= 0.01 && Math.abs(n) < 1e6) {
      return parseFloat(n.toPrecision(6)).toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
    return n.toExponential(4);
  }

  function getDensity() {
    const ing = ingredients.find(i => i.id === ingredientSelect.value);
    return ing ? ing.density : 1.0;
  }

  function convert(val, fromId, toId, density) {
    const fromUnit = units.find(u => u.id === fromId);
    const toUnit = units.find(u => u.id === toId);

    let mlValue = 0;
    let gramsValue = 0;

    // Convert input to base metrics (ml for volume, grams for weight)
    if (fromUnit.type === 'volume') {
      mlValue = val * fromUnit.toMl;
      gramsValue = mlValue * density;
    } else {
      gramsValue = val;
      mlValue = gramsValue / density;
    }

    // Convert base metrics to target unit
    if (toUnit.type === 'volume') {
      return mlValue / toUnit.toMl;
    } else {
      return gramsValue;
    }
  }

  function calculate() {
    const val = parseFloat(valueInput.value);
    if (isNaN(val)) {
      resultDiv.style.display = 'none';
      return;
    }

    const fromId = fromSelect.value;
    const toId = toSelect.value;
    const density = getDensity();

    const converted = convert(val, fromId, toId, density);

    const fromUnit = units.find(u => u.id === fromId);
    const toUnit = units.find(u => u.id === toId);
    const ing = ingredients.find(i => i.id === ingredientSelect.value);

    mainResult.textContent = formatNum(converted);
    mainLabel.textContent = `${fromUnit.name} → ${toUnit.name} (${ing.name})`;

    allConversions.innerHTML = units
      .filter(u => u.id !== fromId)
      .map(u => {
        const result = convert(val, fromId, u.id, density);
        return `
          <div class="calc-result-item">
            <div class="calc-result-value">${formatNum(result)}</div>
            <div class="calc-result-label">${u.name}</div>
          </div>
        `;
      }).join('');

    resultDiv.style.display = '';
  }

  const inputs = [ingredientSelect, valueInput, fromSelect, toSelect];
  inputs.forEach(input => input.addEventListener('input', calculate));

  calculate();

  return () => {
    inputs.forEach(input => input.removeEventListener('input', calculate));
  };
}
