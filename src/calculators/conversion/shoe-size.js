export const meta = {
  slug: 'shoe-size',
  name: 'Shoe Size Converter',
  title: 'Shoe Size Converter - Calcyx',
  description: 'Convert shoe sizes instantly between US, UK, EU, JP regions, and Foot Length in centimeters and inches for Men, Women, and Kids.',
  category: 'conversion',
  icon: '👟',
  keywords: ['shoe size converter', 'shoe size conversion', 'us to eu shoe size', 'men shoe size', 'women shoe size', 'kids shoe size'],
  formula: 'Region-specific standard size mapping tables',
  relatedSlugs: ['length', 'cooking']
};

const sizeTables = {
  men: [
    { us: '6.0', uk: '5.0', eu: '39.0', jp: '24.0', inches: '9.375', cm: '23.8' },
    { us: '6.5', uk: '5.5', eu: '39.5', jp: '24.5', inches: '9.5', cm: '24.1' },
    { us: '7.0', uk: '6.0', eu: '40.0', jp: '25.0', inches: '9.6875', cm: '24.6' },
    { us: '7.5', uk: '6.5', eu: '40.5', jp: '25.5', inches: '9.875', cm: '25.1' },
    { us: '8.0', uk: '7.0', eu: '41.0', jp: '26.0', inches: '10.0625', cm: '25.6' },
    { us: '8.5', uk: '7.5', eu: '42.0', jp: '26.5', inches: '10.25', cm: '26.0' },
    { us: '9.0', uk: '8.0', eu: '42.5', jp: '27.0', inches: '10.4375', cm: '26.5' },
    { us: '9.5', uk: '8.5', eu: '43.0', jp: '27.5', inches: '10.5625', cm: '26.8' },
    { us: '10.0', uk: '9.0', eu: '44.0', jp: '28.0', inches: '10.75', cm: '27.3' },
    { us: '10.5', uk: '9.5', eu: '44.5', jp: '28.5', inches: '10.9375', cm: '27.8' },
    { us: '11.0', uk: '10.0', eu: '45.0', jp: '29.0', inches: '11.125', cm: '28.3' },
    { us: '11.5', uk: '10.5', eu: '45.5', jp: '29.5', inches: '11.25', cm: '28.6' },
    { us: '12.0', uk: '11.0', eu: '46.0', jp: '30.0', inches: '11.4375', cm: '29.1' },
    { us: '13.0', uk: '12.0', eu: '47.5', jp: '31.0', inches: '11.75', cm: '29.8' },
    { us: '14.0', uk: '13.0', eu: '48.5', jp: '32.0', inches: '12.0625', cm: '30.6' }
  ],
  women: [
    { us: '4.0', uk: '2.0', eu: '35.0', jp: '21.0', inches: '8.1875', cm: '20.8' },
    { us: '4.5', uk: '2.5', eu: '35.0', jp: '21.5', inches: '8.375', cm: '21.3' },
    { us: '5.0', uk: '3.0', eu: '35.5', jp: '22.0', inches: '8.5', cm: '21.6' },
    { us: '5.5', uk: '3.5', eu: '36.0', jp: '22.5', inches: '8.6875', cm: '22.1' },
    { us: '6.0', uk: '4.0', eu: '37.0', jp: '23.0', inches: '8.875', cm: '22.5' },
    { us: '6.5', uk: '4.5', eu: '37.5', jp: '23.5', inches: '9.0625', cm: '23.0' },
    { us: '7.0', uk: '5.0', eu: '38.0', jp: '24.0', inches: '9.25', cm: '23.5' },
    { us: '7.5', uk: '5.5', eu: '38.5', jp: '24.5', inches: '9.375', cm: '23.8' },
    { us: '8.0', uk: '6.0', eu: '39.0', jp: '25.0', inches: '9.5', cm: '24.1' },
    { us: '8.5', uk: '6.5', eu: '40.0', jp: '25.5', inches: '9.6875', cm: '24.6' },
    { us: '9.0', uk: '7.0', eu: '40.5', jp: '26.0', inches: '9.875', cm: '25.1' },
    { us: '9.5', uk: '7.5', eu: '41.0', jp: '26.5', inches: '10.0625', cm: '25.6' },
    { us: '10.0', uk: '8.0', eu: '42.0', jp: '27.0', inches: '10.25', cm: '26.0' },
    { us: '10.5', uk: '8.5', eu: '42.5', jp: '27.5', inches: '10.4375', cm: '26.5' },
    { us: '11.0', uk: '9.0', eu: '43.0', jp: '28.0', inches: '10.5625', cm: '26.8' },
    { us: '12.0', uk: '10.0', eu: '44.0', jp: '29.0', inches: '10.875', cm: '27.6' }
  ],
  kids: [
    { us: '4C', uk: '3.0', eu: '19.0', jp: '11.0', inches: '4.375', cm: '11.1' },
    { us: '4.5C', uk: '3.5', eu: '20.0', jp: '11.5', inches: '4.5', cm: '11.4' },
    { us: '5C', uk: '4.0', eu: '20.5', jp: '12.0', inches: '4.75', cm: '12.1' },
    { us: '5.5C', uk: '4.5', eu: '21.0', jp: '12.5', inches: '4.875', cm: '12.4' },
    { us: '6C', uk: '5.0', eu: '22.0', jp: '13.0', inches: '5.125', cm: '13.0' },
    { us: '6.5C', uk: '5.5', eu: '22.5', jp: '13.5', inches: '5.25', cm: '13.3' },
    { us: '7C', uk: '6.0', eu: '23.0', jp: '14.0', inches: '5.5', cm: '14.0' },
    { us: '7.5C', uk: '6.5', eu: '23.5', jp: '14.5', inches: '5.625', cm: '14.3' },
    { us: '8C', uk: '7.0', eu: '24.0', jp: '15.0', inches: '5.75', cm: '14.6' },
    { us: '8.5C', uk: '7.5', eu: '25.0', jp: '15.5', inches: '6.0', cm: '15.2' },
    { us: '9C', uk: '8.0', eu: '25.5', jp: '16.0', inches: '6.125', cm: '15.6' },
    { us: '9.5C', uk: '8.5', eu: '26.0', jp: '16.5', inches: '6.25', cm: '15.9' },
    { us: '10C', uk: '9.0', eu: '27.0', jp: '17.0', inches: '6.5', cm: '16.5' },
    { us: '10.5C', uk: '9.5', eu: '27.5', jp: '17.5', inches: '6.625', cm: '16.8' },
    { us: '11C', uk: '10.0', eu: '28.0', jp: '18.0', inches: '6.75', cm: '17.1' },
    { us: '11.5C', uk: '10.5', eu: '28.5', jp: '18.5', inches: '7.0', cm: '17.8' },
    { us: '12C', uk: '11.0', eu: '29.5', jp: '19.0', inches: '7.125', cm: '18.1' },
    { us: '12.5C', uk: '11.5', eu: '30.0', jp: '19.5', inches: '7.25', cm: '18.4' },
    { us: '13C', uk: '12.0', eu: '31.0', jp: '20.0', inches: '7.5', cm: '19.1' },
    { us: '13.5C', uk: '12.5', eu: '31.5', jp: '20.5', inches: '7.625', cm: '19.4' },
    { us: '1Y', uk: '13.0', eu: '32.0', jp: '21.0', inches: '7.75', cm: '19.7' },
    { us: '1.5Y', uk: '13.5', eu: '32.5', jp: '21.5', inches: '8.0', cm: '20.3' },
    { us: '2Y', uk: '1.0', eu: '33.0', jp: '22.0', inches: '8.125', cm: '20.6' },
    { us: '2.5Y', uk: '1.5', eu: '34.0', jp: '22.5', inches: '8.25', cm: '21.0' },
    { us: '3Y', uk: '2.0', eu: '34.5', jp: '23.0', inches: '8.5', cm: '21.6' }
  ]
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="category">Category</label>
            <select id="category" class="calc-select">
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </div>
          <div class="calc-input-group">
            <label for="source-region">Source Region</label>
            <select id="source-region" class="calc-select">
              <option value="us">US</option>
              <option value="uk">UK</option>
              <option value="eu">EU</option>
              <option value="jp">Japan (JP)</option>
              <option value="cm">Foot Length (cm)</option>
              <option value="inches">Foot Length (inches)</option>
            </select>
          </div>
        </div>
        <div class="calc-input-group">
          <label for="shoe-size">Value / Size</label>
          <select id="shoe-size" class="calc-select"></select>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-grid" id="all-sizes-grid"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <p>Shoe sizes vary significantly based on category (Men, Women, and Kids) and region. This converter uses standardized regional size tables to map shoe sizes directly to foot length in inches and centimeters, translating between US, UK, EU, and JP sizing standards.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const categorySelect = document.getElementById('category');
  const regionSelect = document.getElementById('source-region');
  const sizeSelect = document.getElementById('shoe-size');
  const resultDiv = document.getElementById('result');
  const allSizesGrid = document.getElementById('all-sizes-grid');

  function updateSizeOptions() {
    const cat = categorySelect.value;
    const region = regionSelect.value;
    const table = sizeTables[cat];

    // De-duplicate standard values
    const uniqueValues = [...new Set(table.map(item => item[region]))];
    
    sizeSelect.innerHTML = uniqueValues.map(val => `<option value="${val}">${val}</option>`).join('');

    // Pre-select a reasonable default size if available
    if (cat === 'men' && region === 'us') {
      sizeSelect.value = '9.0';
    } else if (cat === 'women' && region === 'us') {
      sizeSelect.value = '7.0';
    } else if (cat === 'kids' && region === 'us') {
      sizeSelect.value = '10C';
    }

    calculate();
  }

  function calculate() {
    const cat = categorySelect.value;
    const region = regionSelect.value;
    const selectedVal = sizeSelect.value;

    const table = sizeTables[cat];
    const match = table.find(item => item[region] === selectedVal);

    if (!match) {
      resultDiv.style.display = 'none';
      return;
    }

    allSizesGrid.innerHTML = `
      <div class="calc-result-item">
        <div class="calc-result-value">${match.us}</div>
        <div class="calc-result-label">US Size</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${match.uk}</div>
        <div class="calc-result-label">UK Size</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${match.eu}</div>
        <div class="calc-result-label">EU Size</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${match.jp} cm</div>
        <div class="calc-result-label">Japan (JP) Size</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${match.cm} cm</div>
        <div class="calc-result-label">Foot Length (Metric)</div>
      </div>
      <div class="calc-result-item">
        <div class="calc-result-value">${match.inches} in</div>
        <div class="calc-result-label">Foot Length (Imperial)</div>
      </div>
    `;

    resultDiv.style.display = '';
  }

  // Bind change events
  categorySelect.addEventListener('input', updateSizeOptions);
  regionSelect.addEventListener('input', updateSizeOptions);
  sizeSelect.addEventListener('input', calculate);

  // Initialize options
  updateSizeOptions();

  return () => {
    categorySelect.removeEventListener('input', updateSizeOptions);
    regionSelect.removeEventListener('input', updateSizeOptions);
    sizeSelect.removeEventListener('input', calculate);
  };
}
