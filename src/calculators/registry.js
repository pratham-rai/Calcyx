/* ============================================================
   CALCYX — Master Calculator Registry
   ============================================================ */

export const categories = [
  { id: 'finance', name: 'Finance', icon: '💰', description: 'Loans, investments, margins & tax calculators' },
  { id: 'health', name: 'Health & Fitness', icon: '🏥', description: 'BMI, calorie, ideal weight & body metrics' },
  { id: 'math', name: 'Math & Equations', icon: '🔢', description: 'Percentages, standard deviation, algebra & average' },
  { id: 'datetime', name: 'Date & Time', icon: '📅', description: 'Age trackers, countdowns & date subtraction' },
  { id: 'conversion', name: 'Conversion', icon: '⚖️', description: 'Length, weight, temperature & speed units' },
  { id: 'everyday', name: 'Everyday Life', icon: '🛒', description: 'Fuel pricing, unit comparisons & helper tools' },
  { id: 'science', name: 'Science & Physics', icon: '🧪', description: "Ohm's law, half-life, gravity, and physics calculators" },
  { id: 'business', name: 'Business & Marketing', icon: '📈', description: 'CAC, Customer Lifetime Value, conversion rates, and ROI' }
];

export const calculators = [
  // --- Finance ---
  {
    slug: 'emi',
    category: 'finance',
    icon: '🏦',
    name: 'EMI / Loan Calculator',
    description: 'Calculate monthly loan EMI payments, total interest and principal components.',
    keywords: ['emi', 'loan', 'mortgage', 'repayment', 'finance'],
    loader: () => import('./finance/emi.js')
  },
  {
    slug: 'compound-interest',
    category: 'finance',
    icon: '📈',
    name: 'Compound Interest',
    description: 'Project future investment growth using compound interest and compounding frequencies.',
    keywords: ['compound interest', 'growth', 'investment', 'savings', 'earnings'],
    loader: () => import('./finance/compound-interest.js')
  },
  {
    slug: 'simple-interest',
    category: 'finance',
    icon: '💰',
    name: 'Simple Interest',
    description: 'Calculate simple interest earnings on principal amount with ease.',
    keywords: ['simple interest', 'earnings', 'payout', 'interest'],
    loader: () => import('./finance/simple-interest.js')
  },
  {
    slug: 'tip',
    category: 'finance',
    icon: '🍽️',
    name: 'Tip / Bill Split',
    description: 'Split restaurant bills, calculate tips with customizable percentages instantly.',
    keywords: ['tip', 'bill split', 'restaurant', 'diners', 'splitwise'],
    loader: () => import('./finance/tip.js')
  },
  {
    slug: 'discount',
    category: 'finance',
    icon: '🏷️',
    name: 'Discount & Margins',
    description: 'Determine sale prices, discount savings, markup values and profit margins.',
    keywords: ['discount', 'sale', 'markup', 'profit margin', 'margin'],
    loader: () => import('./finance/discount.js')
  },
  {
    slug: 'sip',
    category: 'finance',
    icon: '📊',
    name: 'SIP / Investment',
    description: 'Forecast mutual fund returns via Systematic Investment Plans.',
    keywords: ['sip', 'mutual fund', 'recurring deposit', 'investment', 'wealth'],
    loader: () => import('./finance/sip.js')
  },
  {
    slug: 'mortgage',
    category: 'finance',
    icon: '🏡',
    name: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments including principal, interest, taxes, insurance, and HOA fees.',
    keywords: ['mortgage', 'home loan', 'house payment', 'piti', 'tax', 'insurance'],
    loader: () => import('./finance/mortgage.js')
  },
  {
    slug: 'sales-tax',
    category: 'finance',
    icon: '🏷️',
    name: 'Sales Tax / GST / VAT',
    description: 'Calculate sales tax, GST, or VAT to add to or remove from a price.',
    keywords: ['sales tax', 'gst', 'vat', 'tax calculator', 'add tax', 'remove tax'],
    loader: () => import('./finance/sales-tax.js')
  },
  {
    slug: 'salary',
    category: 'finance',
    icon: '💵',
    name: 'Salary / Take-Home Pay',
    description: 'Calculate your net take-home pay after federal taxes, state taxes, and monthly deductions.',
    keywords: ['salary', 'take-home pay', 'net income', 'income tax', 'paycheck', 'deductions'],
    loader: () => import('./finance/salary.js')
  },
  {
    slug: 'retirement',
    category: 'finance',
    icon: '👴',
    name: 'Retirement / 401k Planner',
    description: 'Calculate your retirement nest egg balance and project how much your savings will grow by your target age.',
    keywords: ['retirement', '401k', 'savings', 'pension', 'investment', 'nest egg', 'retirement planner'],
    loader: () => import('./finance/retirement.js')
  },
  {
    slug: 'inflation',
    category: 'finance',
    icon: '🎈',
    name: 'Inflation Calculator',
    description: 'Calculate the future nominal cost of goods and the purchasing power of cash adjusted for inflation.',
    keywords: ['inflation', 'purchasing power', 'future value', 'cpi', 'cash value', 'real value'],
    loader: () => import('./finance/inflation.js')
  },
  {
    slug: 'break-even',
    category: 'finance',
    icon: '📊',
    name: 'Break-Even Analysis',
    description: 'Calculate the break-even point in units and revenue, and analyze profit/loss for a custom sales volume.',
    keywords: ['break even', 'margin', 'fixed cost', 'variable cost', 'profit margin', 'profit analysis'],
    loader: () => import('./finance/break-even.js')
  },
  {
    slug: 'credit-card',
    category: 'finance',
    icon: '💳',
    name: 'Credit Card Payoff',
    description: 'Calculate time to pay off credit card balances or find the required monthly payment to be debt-free.',
    keywords: ['credit card', 'card payoff', 'debt calculator', 'credit card interest', 'minimum payment'],
    loader: () => import('./finance/credit-card.js')
  },
  {
    slug: 'roi',
    category: 'finance',
    icon: '📈',
    name: 'ROI (Return on Investment)',
    description: 'Calculate total investment returns, percentage gains, and annualized ROI rates.',
    keywords: ['roi', 'return on investment', 'investment gain', 'annualized return', 'profit rate'],
    loader: () => import('./finance/roi.js')
  },
  {
    slug: 'savings-goal',
    category: 'finance',
    icon: '🎯',
    name: 'Savings Goal Planner',
    description: 'Calculate the monthly deposit needed to reach a specific financial savings target.',
    keywords: ['savings goal', 'goal planner', 'monthly deposit', 'investment goal', 'accumulate wealth'],
    loader: () => import('./finance/savings-goal.js')
  },
  {
    slug: 'cagr',
    category: 'finance',
    icon: '📊',
    name: 'CAGR Calculator',
    description: 'Calculate the Compound Annual Growth Rate of investments over multiple years.',
    keywords: ['cagr', 'compound annual growth', 'annual return', 'investment growth rate'],
    loader: () => import('./finance/cagr.js')
  },
  {
    slug: 'markup-margin',
    category: 'finance',
    icon: '🏷️',
    name: 'Markup & Margin',
    description: 'Solve profit margins, markup values, selling prices, and item costs interactively.',
    keywords: ['markup margin', 'profit margin', 'markup percent', 'sales pricing', 'cost price'],
    loader: () => import('./finance/markup-margin.js')
  },
  {
    slug: 'commission',
    category: 'finance',
    icon: '💼',
    name: 'Sales Commission',
    description: 'Calculate flat rate or tiered/graduated sales commission percentages and base salary additions.',
    keywords: ['sales commission', 'commission calculation', 'tiered rate', 'sales bonus'],
    loader: () => import('./finance/commission.js')
  },
  {
    slug: 'rental-yield',
    category: 'finance',
    icon: '🏢',
    name: 'Rental Yield Calculator',
    description: 'Compute gross and net annual rental yield percentages on property investments.',
    keywords: ['rental yield', 'rental return', 'property investment', 'rental yield calculator', 'gross yield'],
    loader: () => import('./finance/rental-yield.js')
  },
  {
    slug: 'rule-of-72',
    category: 'finance',
    icon: '➗',
    name: 'Rule of 72 / Doubling Time',
    description: 'Estimate years or interest rates needed to double investments using standard and exact rules.',
    keywords: ['rule of 72', 'doubling time', 'exact doubling', 'compound rate', 'growth projection'],
    loader: () => import('./finance/rule-of-72.js')
  },


  // --- Health ---
  {
    slug: 'bmi',
    category: 'health',
    icon: '⚖️',
    name: 'BMI Calculator',
    description: 'Calculate Body Mass Index (BMI) and discover your health category.',
    keywords: ['bmi', 'body mass index', 'weight', 'height', 'obesity'],
    loader: () => import('./health/bmi.js')
  },
  {
    slug: 'bmr',
    category: 'health',
    icon: '🔥',
    name: 'BMR / Calorie',
    description: 'Estimate daily Basal Metabolic Rate (BMR) and total calorie needs for goal tracking.',
    keywords: ['bmr', 'tdee', 'calories', 'weight loss', 'daily calorie intake'],
    loader: () => import('./health/bmr.js')
  },
  {
    slug: 'ideal-weight',
    category: 'health',
    icon: '🏃',
    name: 'Ideal Weight',
    description: 'Find your target weight range using standard scientific formula options.',
    keywords: ['ideal weight', 'target weight', 'devine formula', 'healthy weight'],
    loader: () => import('./health/ideal-weight.js')
  },
  {
    slug: 'body-fat',
    category: 'health',
    icon: '📏',
    name: 'Body Fat %',
    description: 'Estimate your body fat percentage using the U.S. Navy circumference method.',
    keywords: ['body fat', 'navy method', 'waist ratio', 'body composition'],
    loader: () => import('./health/body-fat.js')
  },
  {
    slug: 'pregnancy',
    category: 'health',
    icon: '🤰',
    name: 'Pregnancy Due Date',
    description: 'Track gestational age, trimesters, and estimate your target delivery due date.',
    keywords: ['pregnancy', 'due date', 'gestational age', 'conception', 'trimester'],
    loader: () => import('./health/pregnancy.js')
  },
  {
    slug: 'ovulation',
    category: 'health',
    icon: '🥚',
    name: 'Ovulation Calendar',
    description: 'Estimate your fertile window, next period date, and peak ovulation windows.',
    keywords: ['ovulation', 'fertility', 'menstrual cycle', 'fertile window', 'conception'],
    loader: () => import('./health/ovulation.js')
  },
  {
    slug: 'water-intake',
    category: 'health',
    icon: '💧',
    name: 'Water Intake Tracker',
    description: 'Determine your recommended daily water volume based on body weight, climate, and exercise.',
    keywords: ['water intake', 'hydration', 'glasses of water', 'daily water'],
    loader: () => import('./health/water-intake.js')
  },
  {
    slug: 'heart-rate',
    category: 'health',
    icon: '💓',
    name: 'Heart Rate Zones',
    description: 'Calculate target heart rate zones for warm up, fat burn, cardio, and peak performance.',
    keywords: ['heart rate', 'training zones', 'karvonen formula', 'fat burn zone', 'cardio'],
    loader: () => import('./health/heart-rate.js')
  },
  {
    slug: 'macros',
    category: 'health',
    icon: '🍽️',
    name: 'Macro / Nutrition Split',
    description: 'Determine target daily grams of proteins, fats, and carbohydrates based on your diet goals.',
    keywords: ['macros', 'protein split', 'carbohydrates', 'ketogenic diet', 'nutrition'],
    loader: () => import('./health/macros.js')
  },
  {
    slug: 'waist-hip',
    category: 'health',
    icon: '📐',
    name: 'Waist-to-Hip Ratio',
    description: 'Calculate your WHR waist-to-hip ratio and check structural body health indicators.',
    keywords: ['waist hip ratio', 'body shape', 'pear shape', 'apple shape', 'whr'],
    loader: () => import('./health/waist-hip.js')
  },
  {
    slug: 'calorie-burned',
    category: 'health',
    icon: '🏃',
    name: 'Calorie Burned / Activity',
    description: 'Estimate overall calories burned during exercises and sports based on body weight.',
    keywords: ['calorie burned', 'met value', 'activity calorie', 'exercise burn', 'workout calorie'],
    loader: () => import('./health/calorie-burned.js')
  },
  {
    slug: 'waist-height',
    category: 'health',
    icon: '📏',
    name: 'Waist-to-Height (WHtR)',
    description: 'Determine your waist-to-height ratio to evaluate body fat distribution and cardiovascular risks.',
    keywords: ['waist height ratio', 'whtr', 'body shape', 'health risk', 'fat distribution'],
    loader: () => import('./health/waist-height.js')
  },
  {
    slug: 'period-tracker',
    category: 'health',
    icon: '📅',
    name: 'Period Tracker & Cycle',
    description: 'Track periods, cycles, and estimate dates of next periods and peak fertile windows.',
    keywords: ['period tracker', 'cycle predictor', 'fertile days', 'period cycle', 'menstruation'],
    loader: () => import('./health/period-tracker.js')
  },
  {
    slug: 'blood-volume',
    category: 'health',
    icon: '🩸',
    name: 'Blood Volume Calculator',
    description: 'Estimate total body blood volume using Nadler and Lemmens-Bernstein formulas.',
    keywords: ['blood volume', 'nadler formula', 'body fluid', 'plasma volume', 'blood capacity'],
    loader: () => import('./health/blood-volume.js')
  },
  {
    slug: 'sleep-cycle',
    category: 'health',
    icon: '😴',
    name: 'Sleep Cycle Calculator',
    description: 'Calculate optimal wake-up or bedtimes based on 90-minute sleep cycles.',
    keywords: ['sleep cycle', 'sleep calculator', 'bedtime', 'rem sleep', 'wake up time'],
    loader: () => import('./health/sleep-cycle.js')
  },
  {
    slug: 'vo2max',
    category: 'health',
    icon: '🫁',
    name: 'VO2 Max Estimator',
    description: 'Estimate your maximal oxygen uptake (VO2 Max) from a simple fitness test.',
    keywords: ['vo2 max', 'cardio fitness', 'aerobic capacity', 'cooper test', 'rockport test'],
    loader: () => import('./health/vo2max.js')
  },
  {
    slug: 'protein-intake',
    category: 'health',
    icon: '🥩',
    name: 'Protein Intake Calculator',
    description: 'Calculate your optimal daily protein intake based on weight, activity level, and fitness goal.',
    keywords: ['protein intake', 'protein needs', 'macros', 'daily protein', 'protein calculator'],
    loader: () => import('./health/protein-intake.js')
  },
  {
    slug: 'blood-pressure',
    category: 'health',
    icon: '💉',
    name: 'Blood Pressure Analyzer',
    description: 'Classify your blood pressure reading and understand cardiovascular health risk.',
    keywords: ['blood pressure', 'hypertension', 'systolic', 'diastolic', 'bp calculator'],
    loader: () => import('./health/blood-pressure.js')
  },
  {
    slug: 'running-pace',
    category: 'health',
    icon: '🏃',
    name: 'Running Pace Calculator',
    description: 'Calculate running pace, speed, finish time, or distance for any race.',
    keywords: ['running pace', 'pace calculator', 'race split', 'marathon pace', 'running speed'],
    loader: () => import('./health/running-pace.js')
  },
  {
    slug: 'alcohol-units',
    category: 'health',
    icon: '🍺',
    name: 'Alcohol Units & BAC',
    description: 'Calculate alcohol units, estimated BAC, and safe drinking guidelines.',
    keywords: ['alcohol units', 'bac calculator', 'sober time', 'widmark formula', 'blood alcohol'],
    loader: () => import('./health/alcohol-units.js')
  },
  {
    slug: 'steps-to-calories',
    category: 'health',
    icon: '👟',
    name: 'Steps to Calories',
    description: 'Convert daily step count to calories burned, distance, and active minutes.',
    keywords: ['steps to calories', 'walking distance', 'calorie burn', 'activity tracker'],
    loader: () => import('./health/steps-to-calories.js')
  },
  {
    slug: 'due-date',
    category: 'health',
    icon: '🍼',
    name: 'IVF & Due Date (Detailed)',
    description: 'Calculate an IVF or LMP-based due date with a full pregnancy milestone timeline.',
    keywords: ['pregnancy due date', 'ivf due date', 'pregnancy milestone', 'milestone timeline'],
    loader: () => import('./health/due-date.js')
  },

  // --- Math ---
  {
    slug: 'percentage',
    category: 'math',
    icon: '➗',
    name: 'Percentage',
    description: 'Calculate percentage values, percentage increments/decrements, and ratios.',
    keywords: ['percentage', 'percent increase', 'ratio', 'math'],
    loader: () => import('./math/percentage.js')
  },
  {
    slug: 'average',
    category: 'math',
    icon: '📊',
    name: 'Average Calculator',
    description: 'Calculate mean, median, mode, range and sum from a set of numbers.',
    keywords: ['average', 'mean', 'median', 'mode', 'range', 'dataset'],
    loader: () => import('./math/average.js')
  },
  {
    slug: 'gcd-lcm',
    category: 'math',
    icon: '🔢',
    name: 'GCD / LCM Calculator',
    description: 'Compute Greatest Common Divisor and Least Common Multiple with step-by-step logic.',
    keywords: ['gcd', 'lcm', 'greatest common divisor', 'least common multiple', 'factors'],
    loader: () => import('./math/gcd-lcm.js')
  },
  {
    slug: 'quadratic',
    category: 'math',
    icon: '📐',
    name: 'Quadratic Equation',
    description: 'Solve quadratic equation roots, discriminants, and vertex configurations.',
    keywords: ['quadratic', 'roots', 'discriminant', 'equation solver', 'algebra'],
    loader: () => import('./math/quadratic.js')
  },
  {
    slug: 'standard-deviation',
    category: 'math',
    icon: '📉',
    name: 'Standard Deviation',
    description: 'Compute population and sample standard deviation, variance, and mean.',
    keywords: ['standard deviation', 'variance', 'population variance', 'statistics', 'sd'],
    loader: () => import('./math/standard-deviation.js')
  },
  {
    slug: 'fraction',
    category: 'math',
    icon: '➗',
    name: 'Fraction Calculator',
    description: 'Add, subtract, multiply, and divide fractions and simplify to lowest terms.',
    keywords: ['fraction', 'numerator', 'denominator', 'fraction arithmetic', 'simplify fraction'],
    loader: () => import('./math/fraction.js')
  },
  {
    slug: 'permutation-combination',
    category: 'math',
    icon: '📊',
    name: 'Permutation & Combination',
    description: 'Compute permutations (nPr) and combinations (nCr) with step-by-step factorial math.',
    keywords: ['permutation', 'combination', 'npr', 'ncr', 'probability', 'factorial'],
    loader: () => import('./math/permutation-combination.js')
  },
  {
    slug: 'base-converter',
    category: 'math',
    icon: '🔢',
    name: 'Number Base Converter',
    description: 'Convert numbers between Binary, Octal, Decimal, Hexadecimal, and arbitrary bases (2-36).',
    keywords: ['base converter', 'binary', 'hexadecimal', 'octal', 'decimal converter'],
    loader: () => import('./math/base-converter.js')
  },
  {
    slug: 'gpa',
    category: 'math',
    icon: '🎓',
    name: 'GPA / Grade Calculator',
    description: 'Calculate your weighted semester or cumulative GPA based on letter grades and credits.',
    keywords: ['gpa', 'gpa calculator', 'semester grade', 'credits', 'grade points'],
    loader: () => import('./math/gpa.js')
  },
  {
    slug: 'matrix',
    category: 'math',
    icon: '🔲',
    name: 'Matrix Calculator',
    description: 'Solve determinants, transposes, and inverses for 2x2 and 3x3 matrices.',
    keywords: ['matrix', 'determinant', 'matrix inverse', 'matrix transpose', 'linear algebra'],
    loader: () => import('./math/matrix.js')
  },
  {
    slug: 'scientific-notation',
    category: 'math',
    icon: '🔬',
    name: 'Scientific Notation',
    description: 'Convert numbers to scientific notation (e.g. 1.2 x 10^5) and back to standard decimals.',
    keywords: ['scientific notation', 'scientific converter', 'exponents', 'powers of 10'],
    loader: () => import('./math/scientific-notation.js')
  },
  {
    slug: 'logarithm',
    category: 'math',
    icon: '🪵',
    name: 'Logarithm Calculator',
    description: 'Calculate logarithms for base 2, base 10, natural log (ln), or custom bases.',
    keywords: ['logarithm', 'log', 'natural log', 'log base 10', 'ln calculator'],
    loader: () => import('./math/logarithm.js')
  },
  {
    slug: 'z-score',
    category: 'math',
    icon: '📉',
    name: 'Z-Score / Statistics',
    description: 'Calculate standard Z-scores and corresponding normal distribution probabilities.',
    keywords: ['z-score', 'standard score', 'normal distribution', 'probability area', 'statistics calculator'],
    loader: () => import('./math/z-score.js')
  },
  {
    slug: 'prime-factors',
    category: 'math',
    icon: '🔢',
    name: 'Prime Factorization',
    description: 'Find the prime factorization of any number with step-by-step factor trees.',
    keywords: ['prime factors', 'prime factorization', 'factors', 'divisors', 'divisibility'],
    loader: () => import('./math/prime-factors.js')
  },
  {
    slug: 'triangle',
    category: 'math',
    icon: '📐',
    name: 'Triangle Solver',
    description: 'Solve any triangle — find sides, angles, area, and perimeter from any 3 known values.',
    keywords: ['triangle calculator', 'triangle solver', 'solve triangle', 'law of sines', 'law of cosines'],
    loader: () => import('./math/triangle.js')
  },
  {
    slug: 'ratio',
    category: 'math',
    icon: '⚖️',
    name: 'Ratio & Proportion',
    description: 'Simplify ratios, solve proportions, scale recipes, and divide quantities.',
    keywords: ['ratio calculator', 'simplify ratio', 'proportion solver', 'recipe scaling', 'shares'],
    loader: () => import('./math/ratio.js')
  },
  {
    slug: 'series',
    category: 'math',
    icon: '📈',
    name: 'Sequence & Series',
    description: 'Calculate terms, common difference/ratio, and sums for Arithmetic and Geometric progressions.',
    keywords: ['arithmetic progression', 'geometric progression', 'series sum', 'nth term', 'sequence'],
    loader: () => import('./math/series.js')
  },
  {
    slug: 'area-shapes',
    category: 'math',
    icon: '🔲',
    name: '2D Shape Area & Perimeter',
    description: 'Calculate area, perimeter, and dimensions for circles, rectangles, ellipses, trapezoids, and polygons.',
    keywords: ['area calculator', 'perimeter calculator', 'circle area', 'polygon area', 'shape dimensions'],
    loader: () => import('./math/area-shapes.js')
  },
  {
    slug: 'volume-shapes',
    category: 'math',
    icon: '📦',
    name: '3D Shape Volume & Surface Area',
    description: 'Calculate volume and surface area for spheres, cylinders, cones, pyramids, and prisms.',
    keywords: ['volume calculator', 'surface area', 'sphere volume', 'cylinder volume', 'cone volume'],
    loader: () => import('./math/volume-shapes.js')
  },
  {
    slug: 'linear-equations',
    category: 'math',
    icon: '🔲',
    name: 'Linear Equations Solver',
    description: 'Solve systems of 2 linear equations with 2 variables step-by-step using Cramers rule.',
    keywords: ['linear equations', 'system of equations', 'cramer rule', 'algebra solver', 'equations solver'],
    loader: () => import('./math/linear-equations.js')
  },

  // --- Date & Time ---
  {
    slug: 'age',
    category: 'datetime',
    icon: '🎂',
    name: 'Age Calculator',
    description: 'Find your exact age in years, months, days and count down to your next birthday.',
    keywords: ['age', 'birthday', 'exact age', 'days lived', 'chronological age'],
    loader: () => import('./datetime/age.js')
  },
  {
    slug: 'days-between',
    category: 'datetime',
    icon: '📅',
    name: 'Days Between Dates',
    description: 'Count exact calendar days, business days, and weeks between selected dates.',
    keywords: ['days between', 'date difference', 'working days', 'business days'],
    loader: () => import('./datetime/days-between.js')
  },
  {
    slug: 'countdown',
    category: 'datetime',
    icon: '⏳',
    name: 'Countdown Timer',
    description: 'Set a custom countdown timer towards any specific date and time.',
    keywords: ['countdown', 'timer', 'days until', 'event timer'],
    loader: () => import('./datetime/countdown.js')
  },
  {
    slug: 'add-subtract-days',
    category: 'datetime',
    icon: '📅',
    name: 'Add / Subtract Days',
    description: 'Calculate the resulting date after adding or subtracting days, weeks, months, or years.',
    keywords: ['add days', 'subtract days', 'date calculation', 'date adder', 'target date'],
    loader: () => import('./datetime/add-subtract-days.js')
  },
  {
    slug: 'work-days',
    category: 'datetime',
    icon: '💼',
    name: 'Work Days Calculator',
    description: 'Calculate the number of working days, weekend days, and total days between two dates.',
    keywords: ['work days', 'business days', 'working days calculator', 'net work days'],
    loader: () => import('./datetime/work-days.js')
  },
  {
    slug: 'timezone',
    category: 'datetime',
    icon: '🌐',
    name: 'Time Zone Converter',
    description: 'Convert date and time values between major global time zones (GMT, EST, PST, IST, JST).',
    keywords: ['timezone converter', 'time zones', 'timezone offset', 'est to ist', 'utc converter'],
    loader: () => import('./datetime/timezone.js')
  },
  {
    slug: 'time-duration',
    category: 'datetime',
    icon: '⏱️',
    name: 'Time Duration / Add',
    description: 'Calculate the elapsed duration between times or add/subtract time durations.',
    keywords: ['time duration', 'elapsed time', 'time adder', 'time subtraction', 'hours minutes'],
    loader: () => import('./datetime/time-duration.js')
  },
  {
    slug: 'time-card',
    category: 'datetime',
    icon: '📋',
    name: 'Time Card / Decimal Hours',
    description: 'Calculate standard and decimal working hours for your weekly timesheet.',
    keywords: ['time card', 'decimal hours', 'timesheet', 'hours worked', 'overtime'],
    loader: () => import('./datetime/time-card.js')
  },
  {
    slug: 'leap-year',
    category: 'datetime',
    icon: '🗓️',
    name: 'Leap Year Calculator',
    description: 'Check if a year is a leap year and view standard Gregorian leap rules.',
    keywords: ['leap year', 'february 29', 'calendar year', 'leap check'],
    loader: () => import('./datetime/leap-year.js')
  },
  {
    slug: 'dob-details',
    category: 'datetime',
    icon: '👶',
    name: 'Date of Birth Details',
    description: 'Find your weekday of birth, zodiac sign, Chinese zodiac, birthstone, and birth flower.',
    keywords: ['dob details', 'zodiac sign', 'chinese zodiac', 'birthstone', 'star sign'],
    loader: () => import('./datetime/dob-details.js')
  },
  {
    slug: 'unix-timestamp',
    category: 'datetime',
    icon: '🖥️',
    name: 'Unix Time Converter',
    description: 'Convert Unix epoch timestamps (seconds/ms) to standard dates and vice-versa.',
    keywords: ['unix time', 'epoch timestamp', 'datetime converter', 'utc timestamp'],
    loader: () => import('./datetime/unix-timestamp.js')
  },
  {
    slug: 'sunrise-sunset',
    category: 'datetime',
    icon: '☀️',
    name: 'Sunrise & Sunset',
    description: 'Approximate local sunrise times, sunset times, and day length by latitude and longitude.',
    keywords: ['sunrise', 'sunset', 'day length', 'solar noon', 'golden hour'],
    loader: () => import('./datetime/sunrise-sunset.js')
  },
  {
    slug: 'year-progress',
    category: 'datetime',
    icon: '⏳',
    name: 'Year Progress',
    description: 'View current year percentage elapsed, days remaining, and month breakdowns.',
    keywords: ['year progress', 'time progress', 'days left', 'calendar progress'],
    loader: () => import('./datetime/year-progress.js')
  },
  {
    slug: 'moon-phase',
    category: 'datetime',
    icon: '🌙',
    name: 'Moon Phase Calculator',
    description: 'Calculate current moon age, phase name, and illumination percentage.',
    keywords: ['moon phase', 'lunar cycle', 'illumination', 'lunar age', 'full moon'],
    loader: () => import('./datetime/moon-phase.js')
  },
  {
    slug: 'iso-week',
    category: 'datetime',
    icon: '📅',
    name: 'ISO Week Date',
    description: 'Convert calendar dates to ISO 8601 week date representation and vice-versa.',
    keywords: ['iso week', 'week date', 'iso 8601', 'week number'],
    loader: () => import('./datetime/iso-week.js')
  },
  {
    slug: 'easter-finder',
    category: 'datetime',
    icon: '🐣',
    name: 'Easter & Holiday Finder',
    description: 'Find Easter Sunday and related Gregorian holidays for any calendar year.',
    keywords: ['easter sunday', 'good friday', 'pentecost', 'holiday finder'],
    loader: () => import('./datetime/easter-finder.js')
  },
  {
    slug: 'stopwatch',
    category: 'datetime',
    icon: '⏱️',
    name: 'Stopwatch & Timer',
    description: 'Track lap times with a precise stopwatch or set standard countdown alarms.',
    keywords: ['stopwatch', 'lap timer', 'countdown alarm', 'interval timer'],
    loader: () => import('./datetime/stopwatch.js')
  },
  {
    slug: 'time-adder',
    category: 'datetime',
    icon: '➕',
    name: 'Time Adder/Subtracter',
    description: 'Add or subtract hours, minutes, and seconds from a base time duration.',
    keywords: ['time adder', 'time subtracter', 'duration math', 'time math'],
    loader: () => import('./datetime/time-adder.js')
  },
  {
    slug: 'generation',
    category: 'datetime',
    icon: '👪',
    name: 'Generational Era Finder',
    description: 'Discover your generation (Gen Z, Gen Alpha, Millennial) and historical era context.',
    keywords: ['generation finder', 'millennial', 'gen z', 'baby boomer', 'generational cohort'],
    loader: () => import('./datetime/generation.js')
  },
  {
    slug: 'julian-date',
    category: 'datetime',
    icon: '📜',
    name: 'Julian Date Converter',
    description: 'Convert Gregorian dates to astronomical Julian Dates (JD) and Modified Julian Dates (MJD).',
    keywords: ['julian date', 'astronomical time', 'mjd converter', 'epoch time'],
    loader: () => import('./datetime/julian-date.js')
  },

  // --- Conversion ---
  {
    slug: 'length',
    category: 'conversion',
    icon: '📏',
    name: 'Length Converter',
    description: 'Convert between metric and imperial length units such as meters, feet, and miles.',
    keywords: ['length', 'distance', 'meters', 'inches', 'feet', 'miles', 'conversion'],
    loader: () => import('./conversion/length.js')
  },
  {
    slug: 'weight',
    category: 'conversion',
    icon: '⚖️',
    name: 'Weight / Mass',
    description: 'Convert weights easily across metric and imperial systems.',
    keywords: ['weight', 'mass', 'kg to lbs', 'pounds', 'ounces', 'kilograms'],
    loader: () => import('./conversion/weight.js')
  },
  {
    slug: 'temperature',
    category: 'conversion',
    icon: '🌡️',
    name: 'Temperature Converter',
    description: 'Interconvert temperatures instantly between Celsius, Fahrenheit and Kelvin scales.',
    keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'temp conversion'],
    loader: () => import('./conversion/temperature.js')
  },
  {
    slug: 'data-storage',
    category: 'conversion',
    icon: '💾',
    name: 'Data Storage',
    description: 'Convert units of digital data sizes between decimal and binary systems.',
    keywords: ['data storage', 'gb to mb', 'megabytes', 'gigabytes', 'binary conversion', 'bytes'],
    loader: () => import('./conversion/data-storage.js')
  },
  {
    slug: 'speed',
    category: 'conversion',
    icon: '🚀',
    name: 'Speed Converter',
    description: 'Convert velocities between meters/sec, km/h, mph, knots, and Mach speed.',
    keywords: ['speed', 'velocity', 'mph to kmh', 'knots', 'mach', 'km/h'],
    loader: () => import('./conversion/speed.js')
  },
  {
    slug: 'area',
    category: 'conversion',
    icon: '📐',
    name: 'Area Converter',
    description: 'Convert values between square meters, square feet, acres, hectares, and square miles.',
    keywords: ['area converter', 'square feet', 'acres', 'hectares', 'square meters'],
    loader: () => import('./conversion/area.js')
  },
  {
    slug: 'volume',
    category: 'conversion',
    icon: '🧪',
    name: 'Volume Converter',
    description: 'Convert fluid volumes between liters, milliliters, gallons, pints, cups, and ounces.',
    keywords: ['volume converter', 'liters to gallons', 'milliliters', 'cups', 'fluid ounces'],
    loader: () => import('./conversion/volume.js')
  },
  {
    slug: 'currency',
    category: 'conversion',
    icon: '💱',
    name: 'Currency Converter',
    description: 'Convert values between major international currencies using daily-cached exchange rates.',
    keywords: ['currency converter', 'exchange rates', 'forex', 'usd to eur', 'inr converter'],
    loader: () => import('./conversion/currency.js')
  },
  {
    slug: 'cooking',
    category: 'conversion',
    icon: '🍳',
    name: 'Cooking Measurements',
    description: 'Convert kitchen volumes (cups, spoons, ml) and weights (grams) adjusted for ingredient densities.',
    keywords: ['cooking converter', 'cups to grams', 'tablespoons', 'kitchen conversion', 'ingredient weight'],
    loader: () => import('./conversion/cooking.js')
  },
  {
    slug: 'angle',
    category: 'conversion',
    icon: '📐',
    name: 'Angle Converter',
    description: 'Convert values between degrees, radians, gradians, and revolutions.',
    keywords: ['angle converter', 'degrees to radians', 'gradians', 'revolutions'],
    loader: () => import('./conversion/angle.js')
  },
  {
    slug: 'pressure',
    category: 'conversion',
    icon: '🎈',
    name: 'Pressure Converter',
    description: 'Convert pressures between pascals, bars, PSI, and atmospheric units.',
    keywords: ['pressure converter', 'psi to bar', 'pascals', 'atmospheres'],
    loader: () => import('./conversion/pressure.js')
  },
  {
    slug: 'energy',
    category: 'conversion',
    icon: '💥',
    name: 'Energy Converter',
    description: 'Convert energy units between joules, calories, watt-hours, and BTUs.',
    keywords: ['energy converter', 'joules to calories', 'kilowatt hours', 'btu'],
    loader: () => import('./conversion/energy.js')
  },
  {
    slug: 'power',
    category: 'conversion',
    icon: '🔌',
    name: 'Power Converter',
    description: 'Convert power units between watts, kilowatts, horsepower, and BTUs/hour.',
    keywords: ['power converter', 'watts to horsepower', 'kilowatts', 'mechanical power'],
    loader: () => import('./conversion/power.js')
  },
  {
    slug: 'fuel-economy',
    category: 'conversion',
    icon: '⛽',
    name: 'Fuel Economy Converter',
    description: 'Convert fuel efficiency between MPG, L/100km, and kilometers/liter.',
    keywords: ['fuel economy', 'mpg to l100km', 'fuel efficiency', 'miles per gallon'],
    loader: () => import('./conversion/fuel-economy.js')
  },
  {
    slug: 'force',
    category: 'conversion',
    icon: '🏋️',
    name: 'Force Converter',
    description: 'Convert force measurements between newtons, dynes, and pound-force.',
    keywords: ['force converter', 'newtons', 'pound force', 'dynes'],
    loader: () => import('./conversion/force.js')
  },
  {
    slug: 'torque',
    category: 'conversion',
    icon: '🔧',
    name: 'Torque Converter',
    description: 'Convert torque values between newton-meters, pound-feet, and kilogram-meters.',
    keywords: ['torque converter', 'newton meters', 'pound feet', 'rotational force'],
    loader: () => import('./conversion/torque.js')
  },
  {
    slug: 'density',
    category: 'conversion',
    icon: '🧪',
    name: 'Density Converter',
    description: 'Convert density values between g/cm³, kg/m³, and lb/ft³.',
    keywords: ['density converter', 'density units', 'specific gravity', 'mass density'],
    loader: () => import('./conversion/density.js')
  },
  {
    slug: 'flow-rate',
    category: 'conversion',
    icon: '🌊',
    name: 'Flow Rate Converter',
    description: 'Convert volumetric flow rates between liters/min, cfm, and gallons/min.',
    keywords: ['flow rate', 'cfm to gpm', 'liters per second', 'volumetric flow'],
    loader: () => import('./conversion/flow-rate.js')
  },
  {
    slug: 'frequency',
    category: 'conversion',
    icon: '📡',
    name: 'Frequency & Wavelength',
    description: 'Convert signal frequencies to corresponding vacuum wavelengths and vice-versa.',
    keywords: ['frequency converter', 'wavelength', 'hertz to meters', 'gigahertz'],
    loader: () => import('./conversion/frequency.js')
  },
  {
    slug: 'shoe-size',
    category: 'conversion',
    icon: '👟',
    name: 'Shoe Size Converter',
    description: 'Convert international shoe sizes between US, UK, EU, JP, and CM scales.',
    keywords: ['shoe size converter', 'shoe sizes', 'us to eu shoe', 'boot size'],
    loader: () => import('./conversion/shoe-size.js')
  },

  // --- Everyday ---
  {
    slug: 'fuel-cost',
    category: 'everyday',
    icon: '🚗',
    name: 'Fuel Cost Estimator',
    description: 'Estimate overall trip fuel costs, liters/gallons required based on efficiency.',
    keywords: ['fuel cost', 'trip cost', 'mileage', 'gas calculator', 'fuel consumption'],
    loader: () => import('./everyday/fuel-cost.js')
  },
  {
    slug: 'unit-price',
    category: 'everyday',
    icon: '🏷️',
    name: 'Unit Price Comparison',
    description: 'Compare multiple items by price and quantity to evaluate the best bargain.',
    keywords: ['unit price', 'bargain', 'grocery compare', 'best value', 'shopping compare'],
    loader: () => import('./everyday/unit-price.js')
  },
  {
    slug: 'random-decision',
    category: 'everyday',
    icon: '🎲',
    name: 'Random Decision Maker',
    description: 'Enter your choices and let the random selector decide for you with fun selection animations.',
    keywords: ['random chooser', 'decision maker', 'pick choice', 'selection', 'randomizer'],
    loader: () => import('./everyday/random-decision.js')
  },
  {
    slug: 'tally-counter',
    category: 'everyday',
    icon: '🔢',
    name: 'Tally Counter',
    description: 'Keep count with custom step sizes, reset states, click sound toggles, and target goal progress.',
    keywords: ['counter', 'tally', 'clicker', 'number tracker', 'inventory count'],
    loader: () => import('./everyday/tally-counter.js')
  },
  {
    slug: 'roman-numerals',
    category: 'everyday',
    icon: '🏛️',
    name: 'Roman Numerals Converter',
    description: 'Convert Arabic numbers to Roman numerals and vice-versa, complete with step computations.',
    keywords: ['roman numerals', 'arabic numbers', 'numeral converter', 'history math'],
    loader: () => import('./everyday/roman-numerals.js')
  },
  {
    slug: 'morse-code',
    category: 'everyday',
    icon: '📡',
    name: 'Morse Code Translator',
    description: 'Translate text to Morse code and vice-versa, complete with an interactive blinking transmitter.',
    keywords: ['morse code', 'translator', 'code text', 'cipher', 'transmitter'],
    loader: () => import('./everyday/morse-code.js')
  },
  {
    slug: 'binary-text',
    category: 'everyday',
    icon: '💻',
    name: 'Binary / Text Translator',
    description: 'Convert text to binary, hex, ASCII, or octal representations and decode them back.',
    keywords: ['binary text', 'hex converter', 'ascii', 'encoder', 'decoder'],
    loader: () => import('./everyday/binary-text.js')
  },
  {
    slug: 'password-generator',
    category: 'everyday',
    icon: '🔑',
    name: 'Password Generator',
    description: 'Create strong passwords with security estimations, entropy checks, and crack-time metrics.',
    keywords: ['password generator', 'random password', 'passphrase', 'security tool', 'entropy'],
    loader: () => import('./everyday/password-generator.js')
  },
  {
    slug: 'solar-payoff',
    category: 'everyday',
    icon: '☀️',
    name: 'Solar Panel Payoff',
    description: 'Project break-even years, net system costs, and 25-year ROI on solar panel investments.',
    keywords: ['solar energy', 'payoff period', 'break even', 'solar roi', 'green energy'],
    loader: () => import('./everyday/solar-payoff.js')
  },
  {
    slug: 'loan-to-value',
    category: 'everyday',
    icon: '🏡',
    name: 'Loan-to-Value (LTV)',
    description: 'Determine your loan-to-value equity ratio and check if PMI insurance payments are required.',
    keywords: ['ltv', 'loan to value', 'appraisal ratio', 'mortgage risk', 'pmi insurance'],
    loader: () => import('./everyday/loan-to-value.js')
  },
  {
    slug: 'auto-loan',
    category: 'everyday',
    icon: '🚗',
    name: 'Auto Loan Calculator',
    description: 'Calculate vehicle monthly loan payments, sales tax, dealer fees, and total depreciation costs.',
    keywords: ['auto loan', 'car payment', 'trade in', 'car depreciation', 'loan calculator'],
    loader: () => import('./everyday/auto-loan.js')
  },
  {
    slug: 'rent-vs-buy',
    category: 'everyday',
    icon: '🏠',
    name: 'Rent vs Buy Home',
    description: 'Compare overall costs of renting vs purchasing a home over a customized stay length.',
    keywords: ['rent vs buy', 'housing comparison', 'mortgage rent', 'equity growth'],
    loader: () => import('./everyday/rent-vs-buy.js')
  },
  {
    slug: 'appliance-energy',
    category: 'everyday',
    icon: '⚡',
    name: 'Appliance Energy Cost',
    description: 'Estimate daily, monthly, and annual utility bills of home appliances by power wattage.',
    keywords: ['electricity bill', 'appliance power', 'wattage cost', 'utility savings'],
    loader: () => import('./everyday/appliance-energy.js')
  },
  {
    slug: 'car-depreciation',
    category: 'everyday',
    icon: '📉',
    name: 'Car Depreciation',
    description: 'Project vehicle market value year-by-year based on mileage and standard depreciation rates.',
    keywords: ['car depreciation', 'depreciation rate', 'resale value', 'car value'],
    loader: () => import('./everyday/car-depreciation.js')
  },
  {
    slug: 'list-shuffler',
    category: 'everyday',
    icon: '🔀',
    name: 'List Randomizer & Shuffler',
    description: 'Shuffle list elements randomly or split names into balanced groups for drawings or teams.',
    keywords: ['list shuffler', 'randomizer', 'group split', 'name drawing', 'lucky draw'],
    loader: () => import('./everyday/list-shuffler.js')
  },
  {
    slug: 'ascii-hex',
    category: 'everyday',
    icon: '🔡',
    name: 'ASCII / Hex Converter',
    description: 'Convert characters to ASCII values, Hex codes, URL encoding, and decode them back.',
    keywords: ['ascii converter', 'hex code', 'url encode', 'character converter'],
    loader: () => import('./everyday/ascii-hex.js')
  },
  {
    slug: 'tip-tax',
    category: 'everyday',
    icon: '💸',
    name: 'Tip & Tax Combined',
    description: 'Calculate restaurant tabs combining custom tip percentages, local sales taxes, and split shares.',
    keywords: ['tip tax', 'restaurant tab', 'bill splitter', 'group dining'],
    loader: () => import('./everyday/tip-tax.js')
  },
  {
    slug: 'biorhythm',
    category: 'everyday',
    icon: '🧬',
    name: 'Biorhythm Calculator',
    description: 'Calculate physical, emotional, and intellectual biorhythm cycle sine wave percentages.',
    keywords: ['biorhythm', 'life cycles', 'emotional cycle', 'physical cycle', 'birth cycle'],
    loader: () => import('./everyday/biorhythm.js')
  },
  {
    slug: 'ip-subnet',
    category: 'everyday',
    icon: '🌐',
    name: 'IP Subnet Calculator',
    description: 'Solve CIDR network details, usable IP address ranges, broadcast addresses, and subnets.',
    keywords: ['subnet calculator', 'cidr mask', 'ip subnetting', 'network broadcast', 'wildcard mask'],
    loader: () => import('./everyday/ip-subnet.js')
  },
  {
    slug: 'percent-error',
    category: 'everyday',
    icon: '⚠️',
    name: 'Percent Error',
    description: 'Calculate the percentage difference between theoretical values and experimental results.',
    keywords: ['percent error', 'measured value', 'deviation rate', 'experiment error'],
    loader: () => import('./everyday/percent-error.js')
  },
  {
    slug: 'ratio-divider',
    category: 'everyday',
    icon: '⚖️',
    name: 'Ratio Divider',
    description: 'Divide a total amount into a specific ratio with percentage breakdowns.',
    keywords: ['ratio divider', 'split ratio', 'simplify ratio', 'ratio math'],
    loader: () => import('./everyday/ratio-divider.js')
  },
  {
    slug: 'detailed-age',
    category: 'everyday',
    icon: '⏱️',
    name: 'Detailed Age Timer',
    description: 'See your age update in real-time in years, weeks, days, minutes, seconds, and milliseconds.',
    keywords: ['detailed age', 'life timer', 'seconds lived', 'age milestone', 'age timer'],
    loader: () => import('./everyday/detailed-age.js')
  },

  // --- Science & Physics ---
  {
    slug: 'ohms-law',
    category: 'science',
    icon: '⚡',
    name: "Ohm's Law",
    description: "Solve for Voltage, Current, Resistance, or Power using Ohm's Law.",
    keywords: ['ohms law', 'voltage', 'current', 'resistance', 'watts', 'amps', 'volts', 'ohms'],
    loader: () => import('./science/ohms-law.js')
  },
  {
    slug: 'half-life',
    category: 'science',
    icon: '☢️',
    name: 'Radioactive Half-Life',
    description: 'Solve radioactive decay properties — initial quantity, remaining quantity, half-life, or time elapsed.',
    keywords: ['half life', 'radioactive decay', 'half-life', 'isotope decay', 'decay constant'],
    loader: () => import('./science/half-life.js')
  },
  {
    slug: 'projectile-motion',
    category: 'science',
    icon: '☄️',
    name: 'Projectile Motion Solver',
    description: 'Calculate flight duration, maximum height, range, and final velocity for ideal projectiles.',
    keywords: ['projectile motion', 'kinematics', 'trajectory', 'launch angle', 'velocity'],
    loader: () => import('./science/projectile-motion.js')
  },
  {
    slug: 'wave-properties',
    category: 'science',
    icon: '🌊',
    name: 'Wave Speed & Frequency',
    description: 'Solve wave speed, frequency, or wavelength parameters with preset speed standards.',
    keywords: ['wave speed', 'frequency', 'wavelength', 'sound speed', 'light speed'],
    loader: () => import('./science/wave-properties.js')
  },
  {
    slug: 'gravitational-force',
    category: 'science',
    icon: '🌌',
    name: 'Gravitational Force',
    description: 'Calculate the gravitational attraction between two masses at a distance using Newtons Law of Universal Gravitation.',
    keywords: ['gravity', 'gravitational force', 'newton gravity', 'mass attraction'],
    loader: () => import('./science/gravitational-force.js')
  },

  // --- Business & Marketing ---
  {
    slug: 'cac-ltv',
    category: 'business',
    icon: '📈',
    name: 'CAC & LTV Unit Economics',
    description: 'Evaluate your business unit economics — calculate Customer Acquisition Cost (CAC), Customer Lifetime Value (LTV), and LTV:CAC ratios.',
    keywords: ['cac', 'ltv', 'unit economics', 'customer lifetime value', 'customer acquisition cost'],
    loader: () => import('./business/cac-ltv.js')
  },
  {
    slug: 'conversion-rate',
    category: 'business',
    icon: '🎯',
    name: 'Marketing Conversion Rate',
    description: 'Calculate marketing conversion rates, total clicks/visitors, or number of conversions.',
    keywords: ['conversion rate', 'marketing rate', 'click rate', 'conversion calculator'],
    loader: () => import('./business/conversion-rate.js')
  },
  {
    slug: 'roi-roas',
    category: 'business',
    icon: '💸',
    name: 'ROI & ROAS',
    description: 'Calculate Return on Investment (ROI) and Return on Ad Spend (ROAS) for marketing campaigns and investments.',
    keywords: ['roi', 'roas', 'ad spend', 'marketing roi', 'return on investment'],
    loader: () => import('./business/roi-roas.js')
  },
  {
    slug: 'cpm',
    category: 'business',
    icon: '📺',
    name: 'CPM Ad Cost',
    description: 'Solve Cost Per Mille (CPM) ad campaign metrics — calculate cost, impressions, or CPM rate.',
    keywords: ['cpm', 'cost per mille', 'ad cost', 'impressions', 'cpm rate'],
    loader: () => import('./business/cpm.js')
  },
  {
    slug: 'nps',
    category: 'business',
    icon: '🗣️',
    name: 'Net Promoter Score (NPS)',
    description: 'Calculate your Net Promoter Score (NPS) based on Promoters, Passives, and Detractors survey segments.',
    keywords: ['nps', 'net promoter score', 'customer satisfaction', 'nps survey'],
    loader: () => import('./business/nps.js')
  },
];

/**
 * Find calculator by its slug
 * @param {string} slug
 * @returns {object|null}
 */
export function getBySlug(slug) {
  return calculators.find(c => c.slug === slug) || null;
}

/**
 * Filter calculators by category
 * @param {string} categoryId
 * @returns {object[]}
 */
export function getByCategory(categoryId) {
  return calculators.filter(c => c.category === categoryId);
}

/**
 * Search calculators by query
 * @param {string} query
 * @returns {object[]}
 */
export function search(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return calculators.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.keywords.some(kw => kw.toLowerCase().includes(q))
  );
}
