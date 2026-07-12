export const meta = {
  slug: 'dob-details',
  name: 'Date of Birth Details',
  title: 'Date of Birth Details Calculator - Calcyx',
  description: 'Enter your date of birth to discover your day of the week, zodiac sign, Chinese zodiac animal, birthstone, and birth flower.',
  category: 'datetime',
  icon: '🎂',
  keywords: ['date of birth', 'birthday', 'zodiac', 'star sign', 'chinese zodiac', 'birthstone', 'birth flower'],
  formula: 'Gregorian calendar + astronomical zodiac boundaries',
  relatedSlugs: ['age', 'biorhythm']
};

export function render() {
  const container = document.createElement('div');
  container.className = 'calc-page';
  container.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <div class="calc-icon">🎂</div>
        <h1 class="calc-title">Date of Birth Details</h1>
        <p class="calc-description">Enter your date of birth to uncover fascinating details — from your star sign to your birth flower.</p>
      </div>
      <div class="calc-body">
        <div class="calc-input-group">
          <label for="dob-date">Date of Birth</label>
          <input type="date" id="dob-date" class="calc-input" max="">
        </div>
        <div class="calc-result" id="result" style="display:none;">
          <div class="calc-result-grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr));">
            <div class="calc-result-item">
              <div class="calc-result-label">Day Born</div>
              <div class="calc-result-value" id="dob-day" style="font-size:1.3rem;"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Star Sign</div>
              <div class="calc-result-value" id="dob-zodiac" style="font-size:1.3rem;"></div>
              <div class="calc-result-detail" id="dob-zodiac-dates"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Chinese Zodiac</div>
              <div class="calc-result-value" id="dob-chinese" style="font-size:1.3rem;"></div>
              <div class="calc-result-detail" id="dob-chinese-element"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Birthstone</div>
              <div class="calc-result-value" id="dob-stone" style="font-size:1.3rem;"></div>
            </div>
            <div class="calc-result-item">
              <div class="calc-result-label">Birth Flower</div>
              <div class="calc-result-value" id="dob-flower" style="font-size:1.3rem;"></div>
            </div>
          </div>
        </div>
        <div class="calc-formula">
          <h3>About These Details</h3>
          <code>Zodiac: based on tropical astrology boundaries</code>
          <p>Western zodiac uses the tropical system (fixed calendar dates). Chinese zodiac follows lunar year cycles with a 12-year animal rotation and 5 elemental cycles. Birthstones and birth flowers follow traditional monthly assignments.</p>
        </div>
      </div>
    </div>
  `;
  return container;
}

export function mount() {
  const dateEl = document.getElementById('dob-date');
  const resultEl = document.getElementById('result');

  // Set max date to today
  dateEl.max = new Date().toISOString().split('T')[0];

  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  const ZODIAC = [
    { name: '♑ Capricorn',  start: [12,22], end: [1,19],  dates: 'Dec 22 – Jan 19' },
    { name: '♒ Aquarius',   start: [1,20],  end: [2,18],  dates: 'Jan 20 – Feb 18' },
    { name: '♓ Pisces',     start: [2,19],  end: [3,20],  dates: 'Feb 19 – Mar 20' },
    { name: '♈ Aries',      start: [3,21],  end: [4,19],  dates: 'Mar 21 – Apr 19' },
    { name: '♉ Taurus',     start: [4,20],  end: [5,20],  dates: 'Apr 20 – May 20' },
    { name: '♊ Gemini',     start: [5,21],  end: [6,20],  dates: 'May 21 – Jun 20' },
    { name: '♋ Cancer',     start: [6,21],  end: [7,22],  dates: 'Jun 21 – Jul 22' },
    { name: '♌ Leo',        start: [7,23],  end: [8,22],  dates: 'Jul 23 – Aug 22' },
    { name: '♍ Virgo',      start: [8,23],  end: [9,22],  dates: 'Aug 23 – Sep 22' },
    { name: '♎ Libra',      start: [9,23],  end: [10,22], dates: 'Sep 23 – Oct 22' },
    { name: '♏ Scorpio',    start: [10,23], end: [11,21], dates: 'Oct 23 – Nov 21' },
    { name: '♐ Sagittarius',start: [11,22], end: [12,21], dates: 'Nov 22 – Dec 21' },
  ];

  const CHINESE_ANIMALS = ['🐀 Rat','🐂 Ox','🐯 Tiger','🐇 Rabbit','🐉 Dragon','🐍 Snake','🐴 Horse','🐑 Goat','🐒 Monkey','🐓 Rooster','🐕 Dog','🐖 Pig'];
  const CHINESE_ELEMENTS = ['Wood','Fire','Earth','Metal','Water'];

  const BIRTHSTONES = ['Garnet','Amethyst','Aquamarine','Diamond','Emerald','Pearl','Ruby','Peridot','Sapphire','Tourmaline','Topaz','Turquoise'];
  const STONE_ICONS = ['💎','💜','💙','💠','💚','🪩','❤️','🍏','💙','🟤','🟡','🔵'];

  const BIRTH_FLOWERS = [
    '🌹 Carnation (Jan)','🌸 Violet (Feb)','💐 Daffodil (Mar)','🌼 Daisy (Apr)',
    '🌷 Lily of the Valley (May)','🌹 Rose (Jun)','🌸 Larkspur (Jul)','🌻 Gladiolus (Aug)',
    '💐 Aster (Sep)','🍂 Marigold (Oct)','🌼 Chrysanthemum (Nov)','🎄 Narcissus (Dec)'
  ];

  function getZodiac(month, day) {
    for (const z of ZODIAC) {
      const [sm, sd] = z.start;
      const [em, ed] = z.end;
      if (sm > em) {
        // Spans year boundary (Capricorn)
        if ((month === sm && day >= sd) || (month === em && day <= ed)) return z;
      } else {
        if ((month === sm && day >= sd) || (month > sm && month < em) || (month === em && day <= ed)) return z;
      }
    }
    return ZODIAC[0];
  }

  function getChineseZodiac(year) {
    // Chinese New Year approximation — use year offset from 1900 (Rat year)
    const animalIndex = (year - 1900) % 12;
    const animal = CHINESE_ANIMALS[((animalIndex % 12) + 12) % 12];
    const elementIndex = Math.floor(((year - 1900) % 10) / 2);
    const element = CHINESE_ELEMENTS[((elementIndex % 5) + 5) % 5];
    return { animal, element };
  }

  function calculate() {
    const val = dateEl.value;
    if (!val) { resultEl.style.display = 'none'; return; }

    const [year, month, day] = val.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    document.getElementById('dob-day').textContent = DAYS[date.getDay()];

    const zodiac = getZodiac(month, day);
    document.getElementById('dob-zodiac').textContent = zodiac.name;
    document.getElementById('dob-zodiac-dates').textContent = zodiac.dates;

    const chinese = getChineseZodiac(year);
    document.getElementById('dob-chinese').textContent = chinese.animal;
    document.getElementById('dob-chinese-element').textContent = `${chinese.element} element`;

    const monthIdx = month - 1;
    document.getElementById('dob-stone').textContent = `${STONE_ICONS[monthIdx]} ${BIRTHSTONES[monthIdx]}`;
    document.getElementById('dob-flower').textContent = BIRTH_FLOWERS[monthIdx];

    resultEl.style.display = 'block';
  }

  dateEl.addEventListener('input', calculate);

  return function cleanup() {
    dateEl.removeEventListener('input', calculate);
  };
}
