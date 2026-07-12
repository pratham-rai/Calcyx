export const meta = {
  slug: 'generation',
  name: 'Generational Era Finder',
  title: 'Generational Era Finder - Calcyx',
  description: 'Identify your generational cohort (Silent, Baby Boomer, Gen X, Millennial, Gen Z, Gen Alpha, Gen Beta) based on your birth year.',
  category: 'datetime',
  icon: '👥',
  keywords: ['generation finder', 'millennials', 'gen z', 'baby boomers', 'gen alpha', 'generation years', 'cohorts', 'birth year'],
  formula: 'Cohort determined by Birth Year Range',
  relatedSlugs: ['dob-details', 'age']
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
        <div class="calc-input-group">
          <label for="birth-year">Enter Birth Year</label>
          <input type="number" id="birth-year" class="calc-input" min="1880" max="2100" value="1995" placeholder="e.g. 1995" step="1">
        </div>

        <div id="result" class="calc-result" style="display:none; margin-top: 25px;">
          <!-- Primary Cohort Highlight Card -->
          <div id="cohort-card" style="padding: 22px; border-radius: 12px; background: rgba(255, 255, 255, 0.03); margin-bottom: 25px; border-width: 1px; border-style: solid;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px;">
              <span id="cohort-icon" style="font-size: 2.5rem;"></span>
              <div>
                <h2 id="cohort-name" style="margin: 0; font-size: 1.6rem; color: #fff; font-weight: 700;"></h2>
                <div id="cohort-years" style="font-size: 1rem; font-weight: bold; margin-top: 2px;"></div>
              </div>
            </div>

            <p id="cohort-desc" style="line-height: 1.6; margin: 15px 0; color: rgba(255,255,255,0.85); font-size: 0.95rem;"></p>
            <div id="cohort-age" style="font-size: 0.9rem; font-weight: 500; color: #10B981; margin-bottom: 15px;"></div>
            
            <div class="calc-result-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
              <div>
                <strong style="color: #fff; font-size: 0.9rem; display: block; margin-bottom: 6px;">Key Characteristics:</strong>
                <ul id="cohort-traits" style="margin: 0; padding-left: 18px; font-size: 0.85rem; line-height: 1.5; color: rgba(255,255,255,0.75);"></ul>
              </div>
              <div>
                <strong style="color: #fff; font-size: 0.9rem; display: block; margin-bottom: 6px;">Defining Events:</strong>
                <ul id="cohort-events" style="margin: 0; padding-left: 18px; font-size: 0.85rem; line-height: 1.5; color: rgba(255,255,255,0.75);"></ul>
              </div>
            </div>
          </div>

          <!-- All Generations Timeline -->
          <h3 style="font-size: 1rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">Generational Timeline</h3>
          <div id="generations-timeline" style="display: flex; flex-direction: column;"></div>
        </div>
      </div>
      <div class="calc-formula">
        <h3>How Generational Cohorts Work</h3>
        <p>Generational cohorts are social groupings defined by demographers and researchers. Individuals within a cohort share a birth year range and experienced similar historical events, technological milestones, and cultural shifts during their formative coming-of-age years.</p>
        <p>While the exact boundary years can vary slightly between researchers, this calculator uses the widely accepted standard ranges defined by the Pew Research Center and demographic consensus.</p>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const birthYearInput = document.getElementById('birth-year');
  const resultDiv = document.getElementById('result');

  const cohortCard = document.getElementById('cohort-card');
  const cohortIcon = document.getElementById('cohort-icon');
  const cohortName = document.getElementById('cohort-name');
  const cohortYears = document.getElementById('cohort-years');
  const cohortDesc = document.getElementById('cohort-desc');
  const cohortAge = document.getElementById('cohort-age');
  const cohortTraits = document.getElementById('cohort-traits');
  const cohortEvents = document.getElementById('cohort-events');
  const timelineDiv = document.getElementById('generations-timeline');

  const cohorts = [
    {
      name: 'Lost Generation',
      start: 1883,
      end: 1900,
      icon: '⏳',
      color: '#9CA3AF',
      description: 'Coined by Gertrude Stein, this cohort came of age during World War I, experiencing deep disillusionment, economic upheaval, and rapid industrial shifts.',
      characteristics: ['Disillusionment and skepticism', 'Rebellion against Victorian ideals', 'High artistic and literary expression'],
      events: ['World War I', 'The Great Migration', 'Roaring Twenties emergence']
    },
    {
      name: 'Greatest Generation',
      start: 1901,
      end: 1927,
      icon: '🎖️',
      color: '#F59E0B',
      description: 'Also called the G.I. Generation, they endured the hardships of the Great Depression and fought in World War II, laying the foundation for modern global institutions.',
      characteristics: ['Strong sense of personal duty', 'Patriotism and resilience', 'Traditional family focus', 'Frugality'],
      events: ['The Great Depression', 'World War II', 'Rise of cinema and radio']
    },
    {
      name: 'Silent Generation',
      start: 1928,
      end: 1945,
      icon: '🤫',
      color: '#8B5CF6',
      description: 'Born during war and economic struggle, they grew up in a quiet, conformist era, adapting to institutions rather than rebelling, yet producing key civil rights leaders.',
      characteristics: ['Conformist and cautious', 'Respect for authority', 'Pragmatism and dedication', 'Financial safety-seeking'],
      events: ['The Cold War begins', 'Korean War', 'Post-WWII economic growth']
    },
    {
      name: 'Baby Boomers',
      start: 1946,
      end: 1964,
      icon: '👴',
      color: '#EF4444',
      description: 'The product of the post-WWII spike in birth rates, Boomers drove massive economic expansion, questioned traditional values, and initiated major social reforms.',
      characteristics: ['Optimistic and goal-driven', 'Strong work ethic (workaholism)', 'Desire for self-realization', 'Consumerism'],
      events: ['Vietnam War', 'Civil Rights Movement', 'First Moon Landing', 'Cold War / Cuban Missile Crisis']
    },
    {
      name: 'Generation X',
      start: 1965,
      end: 1980,
      icon: '🎸',
      color: '#EAB308',
      description: 'Often called "latchkey kids" due to working parents, Gen X developed strong independence, navigated the dawn of computing, and pioneered the grunge/hip-hop eras.',
      characteristics: ['Self-reliance and autonomy', 'Work-life balance prioritizers', 'Skepticism of institutions', 'First tech-adopters'],
      events: ['Fall of the Berlin Wall', 'Rise of Personal Computers', 'AIDS Crisis', 'MTV and Grunge culture']
    },
    {
      name: 'Millennials (Gen Y)',
      start: 1981,
      end: 1996,
      icon: '🥑',
      color: '#10B981',
      description: 'The first cohort to enter adulthood in the 21st century. They witnessed the birth of the consumer internet, social networks, and mobile smartphone culture.',
      characteristics: ['Tech-savvy and collaborative', 'Value-driven (purpose over pay)', 'Highly adaptive to change', 'Experience-oriented'],
      events: ['9/11 Terror Attacks', '2008 Global Financial Crisis', 'Smartphone & Social Media boom', 'Internet generalization']
    },
    {
      name: 'Generation Z',
      start: 1997,
      end: 2012,
      icon: '💀',
      color: '#3B82F6',
      description: 'The first generation of true digital natives. Gen Z is hyper-connected, highly conscious of climate and social issues, and highly creative online.',
      characteristics: ['Always-connected digital natives', 'Pragmatic and risk-averse', 'Highly inclusive and globalized', 'Visual-first communication'],
      events: ['COVID-19 Pandemic', 'Climate Action movements', 'Smartphones from infancy', 'TikTok & streaming media']
    },
    {
      name: 'Generation Alpha',
      start: 2013,
      end: 2024,
      icon: '📱',
      color: '#EC4899',
      description: 'The children of Millennials, Alphas are growing up in a world of tablet interfaces, streaming services, and the early steps of generative AI.',
      characteristics: ['Highly integrated with screens', 'AI-conditioned learning', 'Globalized virtual social circles'],
      events: ['Generative AI explosion', 'COVID-19 remote learning', 'Virtual gaming platforms (Roblox/Minecraft)']
    },
    {
      name: 'Generation Beta',
      start: 2025,
      end: 2039,
      icon: '🤖',
      color: '#06B6D4',
      description: 'The upcoming cohort. Betas will grow up alongside advanced AI automation, renewable energy transitions, and commercial space exploration advances.',
      characteristics: ['AI-coexistent childhood', 'Virtual-physical hybrid spaces', 'Ecological and climate-focused mindset'],
      events: ['Commercial space travel advances', 'Quantum computing scaling', 'Decarbonized economy efforts']
    }
  ];

  function getCohort(year) {
    return cohorts.find(c => year >= c.start && year <= c.end);
  }

  function calculate() {
    const yearVal = parseInt(birthYearInput.value, 10);

    if (isNaN(yearVal) || yearVal < 1800 || yearVal > 2150) {
      resultDiv.style.display = 'none';
      return;
    }

    const currentYear = 2026;
    const ageIn2026 = currentYear - yearVal;

    // Find active cohort
    let activeCohort = getCohort(yearVal);
    
    // Handle edge cases
    if (!activeCohort) {
      if (yearVal < 1883) {
        activeCohort = {
          name: 'Historical Era (Pre-Lost)',
          start: 1800,
          end: 1882,
          icon: '📜',
          color: '#9CA3AF',
          description: 'Born before the Lost Generation. This era witnessed the industrial revolution, early steam power, and massive global empires.',
          characteristics: ['Traditional rural living', 'Manual labor culture', 'High community interdependence'],
          events: ['Industrial Revolution', 'Napoleonic Wars', 'American Civil War']
        };
      } else {
        activeCohort = {
          name: 'Generation Gamma (Future)',
          start: 2040,
          end: 2060,
          icon: '🚀',
          color: '#84CC16',
          description: 'Future generation expected to explore deep automation, advanced biotechnology, and potentially interstellar outreach.',
          characteristics: ['Post-AI natives', 'Ecological restorers', 'Deep virtual connection'],
          events: ['Advanced Mars settlement', 'General Artificial Intelligence era']
        };
      }
    }

    // Render cohort details
    cohortCard.style.borderColor = activeCohort.color;
    cohortIcon.textContent = activeCohort.icon;
    cohortName.textContent = activeCohort.name;
    cohortName.style.color = activeCohort.color;
    cohortYears.textContent = `${activeCohort.start} – ${activeCohort.end}`;
    cohortYears.style.color = activeCohort.color;
    cohortDesc.textContent = activeCohort.description;

    if (ageIn2026 >= 0) {
      cohortAge.textContent = `👤 In 2026, individuals born in ${yearVal} turn ${ageIn2026} years old.`;
    } else {
      cohortAge.textContent = `🚀 Born in the future (in ${Math.abs(ageIn2026)} years).`;
    }

    // Render lists
    cohortTraits.innerHTML = activeCohort.characteristics.map(c => `<li>${c}</li>`).join('');
    cohortEvents.innerHTML = activeCohort.events.map(e => `<li>${e}</li>`).join('');

    // Render timeline
    timelineDiv.innerHTML = cohorts.map(c => {
      const isActive = c.name === activeCohort.name;
      const cardStyle = isActive
        ? `border: 2px solid ${c.color}; background: rgba(255, 255, 255, 0.05);`
        : `border: 1px solid rgba(255, 255, 255, 0.03); opacity: 0.5;`;
      const activeBadge = isActive
        ? `<span style="background: ${c.color}; color: #000; padding: 2px 8px; border-radius: 9999px; font-size: 0.7rem; font-weight: bold; margin-left: auto;">YOUR COHORT</span>`
        : '';
      return `
        <div style="display: flex; align-items: center; gap: 12px; padding: 10px; margin-bottom: 8px; border-radius: 8px; ${cardStyle} transition: all 0.2s ease;">
          <span style="font-size: 1.4rem;">${c.icon}</span>
          <div>
            <div style="font-weight: bold; font-size: 0.95rem; color: #fff;">${c.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${c.start} – ${c.end}</div>
          </div>
          ${activeBadge}
        </div>
      `;
    }).join('');

    resultDiv.style.display = '';
  }

  birthYearInput.addEventListener('input', calculate);

  // Initial calculation
  calculate();

  return () => {
    birthYearInput.removeEventListener('input', calculate);
  };
}
