# Calcyx — PWA Calculator Hub 🚀

Calcyx is a lightweight, mobile-first, installable Progressive Web App (PWA) that offers a simple/scientific calculator widget on the homepage alongside a searchable database of specialized calculators spanning **Finance, Health, Math, Date & Time, Conversions, and Everyday** categories.

All calculators run completely client-side. The app operates **100% offline** once cached, requiring zero backend server execution.

---

## 🛠️ Technology Stack
- **Frontend**: Vanilla HTML5, CSS3 (tokens, glassmorphism), and modern ES Modules.
- **Routing**: Clean client-side routing via HTML5 History API (`/calculators/bmi` instead of hashes).
- **Bundler**: [Vite](https://vite.dev) (minimal setup, fast hot module replacement, asset optimization).
- **PWA**: Custom service worker utilizing a 3-tier caching system (App shell / Calculator modules / Dynamic runtime) and a custom web app manifest.
- **Data storage**: `localStorage` (theme persistence, favorite states, and recently used logs).

---

## 📂 Folder Structure

```
Calcyx/
├── index.html            # Single page application container shell
├── manifest.json         # PWA installer specifications
├── sw.js                 # Service worker script (3-tier caching)
├── offline.html          # Fallback screen for offline usage
├── logo.svg              # Dynamic geometric SVG logo
├── package.json          # Vite scripts and dependencies config
├── vite.config.js        # Server history fallbacks and building rules
└── src/
    ├── main.js           # Client bootstrapper & PWA SW registration
    ├── router.js         # Navigation manager & SEO meta tag updates
    ├── styles/           # Styling modules
    │   ├── index.css     # CSS Custom Properties, light/dark themes
    │   ├── components.css# Shared component templates (glasscards, buttons)
    │   └── calculator.css# Calculator elements (keypad grid, output blocks)
    ├── utils/            # Helper utility modules
    │   ├── storage.js    # LocalStorage favorites & recents logger
    │   ├── format.js     # Number formatting & currency helpers
    │   └── share.js      # Web Share API & clipboard toast fallbacks
    ├── components/       # Shared UI parts
    │   ├── header.js     # Header, dynamic breadcrumbs, theme toggle
    │   ├── search.js     # Search inputs with autocomplete keyboard mappings
    │   ├── categoryTiles.js# Categories selection grids
    │   ├── calculatorCard.js# Calculator item previews with favorites toggle
    │   ├── favorites.js  # Favorites & recents list renderer
    │   └── installPrompt.js# Install banner trigger
    ├── pages/            # Router-level page containers
    │   ├── home.js       # Main calculator app & directory
    │   ├── category.js   # Category details tool list
    │   └── calculatorPage.js# Lazy loader page container shell
    └── calculators/      # Individual tool modules
        ├── registry.js   # Master index listing all 25 calculators
        ├── base.js       # Base UI container builder
        ├── finance/      # EMI, compound growth, tip splitter, etc.
        ├── health/       # BMI, BMR, Ideal weight, Navy Body fat
        ├── math/         # Percentage, GCD/LCM, quadratic solver
        ├── datetime/     # Age, days difference, event countdown
        ├── conversion/   # Length, mass, temp, digital storage
        └── everyday/     # Fuel usage cost, unit value comparison
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed on your system.

### Installation
Clone or navigate to the project directory and install the developer dependencies:
```bash
npm install
```

### Run Locally (Development)
Launch the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to the address displayed in the console (usually `http://localhost:3000`).

### Production Build & Preview
To bundle and optimize the project for hosting:
```bash
npm run build
npm run preview
```
The optimized files will be outputted to the `dist` directory.

---

## 📈 Adding a New Calculator (Convention-over-Configuration)

To add calculator **#26** and beyond, follow this standard contract:

1. Create a javascript file in the correct subfolder under `src/calculators/{category}/{slug}.js`.
2. Define and export the `meta` descriptor, `render()` function, and `mount()` setup:

```javascript
// src/calculators/everyday/my-new-tool.js
import { createCalculatorShell, mountCalculatorShell } from '../base.js';

export const meta = {
  slug: 'my-new-tool',
  name: 'My New Tool',
  title: 'My New Tool Calculator — Calcyx',
  description: 'Instantly calculate XYZ values for daily use.',
  category: 'everyday',
  icon: '🛠️',
  keywords: ['new tool', 'xyz', 'math'],
  relatedSlugs: ['fuel-cost']
};

export function render() {
  const inputs = `
    <div class="calc-input-group">
      <label for="input-xyz">Input Value</label>
      <input type="number" id="input-xyz" class="calc-input" placeholder="0">
    </div>
  `;
  const results = `
    <div class="calc-result-value" id="res-xyz">0.00</div>
    <div class="calc-result-label">Result Value</div>
  `;
  const formula = `
    <h3>Formula</h3>
    <code>Result = Input * 2</code>
  `;

  return createCalculatorShell(meta, inputs, results, formula);
}

export function mount() {
  const input = document.getElementById('input-xyz');
  const result = document.getElementById('res-xyz');

  const calculate = () => {
    const val = parseFloat(input.value) || 0;
    result.textContent = (val * 2).toFixed(2);
  };

  input.addEventListener('input', calculate);

  // Standard share support
  const cleanShell = mountCalculatorShell(meta, () => `Input: ${input.value} -> Result: ${result.textContent}`);

  return () => {
    input.removeEventListener('input', calculate);
    cleanShell();
  };
}
```

3. Register your new module inside the master registry file (`src/calculators/registry.js`):
```javascript
{
  slug: 'my-new-tool',
  category: 'everyday',
  icon: '🛠️',
  name: 'My New Tool',
  description: 'Instantly calculate XYZ values for daily use.',
  keywords: ['new', 'xyz'],
  loader: () => import('./everyday/my-new-tool.js')
}
```
The router, search utility, sitemap generator, and service worker caching system will automatically pick up and lazy-load the new calculator!

---

## 🔒 Security & Privacy
Calcyx processes **all data locally** in the client's browser. No form data, calculations, or private indicators are sent to any external server. Offline support means you can calculate safely on flights, in remote areas, or without network availability.
