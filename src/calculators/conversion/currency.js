export const meta = {
  slug: 'currency',
  name: 'Currency Converter',
  title: 'Currency Converter - Calcyx',
  description: 'Convert between major global currencies with daily updated exchange rates. Supports USD, EUR, GBP, INR, JPY, CAD, AUD, CHF, CNY, and NZD.',
  category: 'conversion',
  icon: '💱',
  keywords: ['currency', 'convert', 'exchange rate', 'usd', 'eur', 'gbp', 'inr', 'forex', 'money'],
  formula: 'Result = Value × (Target Rate ÷ Source Rate)',
  relatedSlugs: ['sales-tax', 'salary']
};

const currencies = [
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'GBP', name: 'British Pound (£)' },
  { code: 'INR', name: 'Indian Rupee (₹)' },
  { code: 'JPY', name: 'Japanese Yen (¥)' },
  { code: 'CAD', name: 'Canadian Dollar (C$)' },
  { code: 'AUD', name: 'Australian Dollar (A$)' },
  { code: 'CHF', name: 'Swiss Franc (CHF)' },
  { code: 'CNY', name: 'Chinese Yuan (¥)' },
  { code: 'NZD', name: 'New Zealand Dollar (NZ$)' }
];

const fallbackRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.50,
  JPY: 158.0,
  CAD: 1.37,
  AUD: 1.50,
  CHF: 0.89,
  CNY: 7.26,
  NZD: 1.63
};

let currentRates = { ...fallbackRates };

function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  const options = currencies.map(c => `<option value="${c.code}">${c.name}</option>`).join('');

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="value">Amount</label>
          <input type="number" id="value" class="calc-input" placeholder="Enter amount" step="any" value="100">
        </div>
        <div class="calc-row">
          <div class="calc-input-group">
            <label for="from-currency">From</label>
            <select id="from-currency" class="calc-select">${options}</select>
          </div>
          <div class="calc-input-group">
            <label for="to-currency">To</label>
            <select id="to-currency" class="calc-select">${options}</select>
          </div>
        </div>
        <div id="result" class="calc-result" style="display:none;">
          <div class="calc-result-value" id="main-result"></div>
          <div class="calc-result-label" id="main-label"></div>
          <div class="calc-result-detail" id="rate-detail" style="margin-bottom: 1.5rem; font-size: 0.85rem; opacity: 0.8;"></div>
          <div class="calc-result-grid" id="quick-conversions"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How It Works</h3>
        <code>Result = Value × (Target Rate ÷ Source Rate)</code>
        <p>Exchange rates are fetched relative to USD. The source currency amount is converted to USD, and then converted from USD to the target currency. Rates are cached locally and updated daily.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const valueInput = document.getElementById('value');
  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');
  const resultDiv = document.getElementById('result');
  const mainResult = document.getElementById('main-result');
  const mainLabel = document.getElementById('main-label');
  const rateDetail = document.getElementById('rate-detail');
  const quickConversions = document.getElementById('quick-conversions');

  let isMounted = true;

  // Defaults: from USD to EUR
  fromSelect.value = 'USD';
  toSelect.value = 'EUR';

  function formatCurrency(val, code, decimals = 2) {
    try {
      return val.toLocaleString(undefined, {
        style: 'currency',
        currency: code,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    } catch (e) {
      return `${val.toFixed(decimals)} ${code}`;
    }
  }

  function calculate() {
    const val = parseFloat(valueInput.value);
    if (isNaN(val)) {
      resultDiv.style.display = 'none';
      return;
    }

    const fromCode = fromSelect.value;
    const toCode = toSelect.value;

    const rateFrom = currentRates[fromCode] || fallbackRates[fromCode];
    const rateTo = currentRates[toCode] || fallbackRates[toCode];

    // Convert fromCode to USD, then USD to toCode
    const inUSD = val / rateFrom;
    const converted = inUSD * rateTo;

    // Exchange rates (1 unit of each)
    const rateFromTo = rateTo / rateFrom;
    const rateToFrom = rateFrom / rateTo;

    mainResult.textContent = formatCurrency(converted, toCode);
    mainLabel.textContent = `${formatCurrency(val, fromCode)} =`;
    
    rateDetail.innerHTML = `
      1 ${fromCode} = ${rateFromTo.toFixed(4)} ${toCode} &nbsp;•&nbsp; 
      1 ${toCode} = ${rateToFrom.toFixed(4)} ${fromCode}
    `;

    // Cheat sheet grid
    const amounts = [1, 10, 50, 100, 500, 1000];
    let gridHtml = '';

    // From -> To
    amounts.forEach(amt => {
      const res = amt * rateFromTo;
      gridHtml += `
        <div class="calc-result-item">
          <div class="calc-result-value">${formatCurrency(res, toCode, toCode === 'JPY' ? 0 : 2)}</div>
          <div class="calc-result-label">${amt} ${fromCode}</div>
        </div>
      `;
    });

    // To -> From
    amounts.forEach(amt => {
      const res = amt * rateToFrom;
      gridHtml += `
        <div class="calc-result-item">
          <div class="calc-result-value">${formatCurrency(res, fromCode, fromCode === 'JPY' ? 0 : 2)}</div>
          <div class="calc-result-label">${amt} ${toCode}</div>
        </div>
      `;
    });

    quickConversions.innerHTML = gridHtml;
    resultDiv.style.display = '';
  }

  // Load from cache or fallback first
  const today = getLocalDateString();
  const cachedTimestamp = localStorage.getItem('calcyx_currency_timestamp');
  const cachedRatesStr = localStorage.getItem('calcyx_currency_rates');

  if (cachedTimestamp === today && cachedRatesStr) {
    try {
      const parsed = JSON.parse(cachedRatesStr);
      if (parsed && typeof parsed === 'object') {
        currentRates = { ...fallbackRates, ...parsed };
      }
    } catch (e) {
      console.error('Error parsing cached rates', e);
    }
  }

  // Run initial calculation with cached/static rates
  calculate();

  // If cache is outdated, fetch new rates in the background
  if (cachedTimestamp !== today) {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then(data => {
        if (data && data.result === 'success' && data.rates) {
          localStorage.setItem('calcyx_currency_timestamp', today);
          localStorage.setItem('calcyx_currency_rates', JSON.stringify(data.rates));
          currentRates = { ...fallbackRates, ...data.rates };
          if (isMounted) {
            calculate();
          }
        }
      })
      .catch(err => {
        console.warn('Could not fetch latest currency rates. Using cached/fallback rates.', err);
      });
  }

  const inputs = [valueInput, fromSelect, toSelect];
  inputs.forEach(input => input.addEventListener('input', calculate));

  return () => {
    isMounted = false;
    inputs.forEach(input => input.removeEventListener('input', calculate));
  };
}
