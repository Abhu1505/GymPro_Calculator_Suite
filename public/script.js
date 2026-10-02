// ===== GYM CALCULATOR SUITE - VANILLA JS =====

// ===== STATE =====
const userData = {
  weight: 75,
  height: 175,
  age: 25,
  gender: 'male',
  activityLevel: 'moderate',
  bodyFat: 15,
  benchPress: 80,
  goal: 'maintain',
  waist: 85,
  neck: 38,
  hip: 95,
};

let activeTab = 'all';

// ===== CALCULATION FUNCTIONS =====

function calculateBMI(weight, height) {
  const heightM = height / 100;
  const value = weight / (heightM * heightM);
  let category = '';
  if (value < 18.5) category = 'Underweight';
  else if (value < 25) category = 'Normal Weight';
  else if (value < 30) category = 'Overweight';
  else category = 'Obese';
  return { value, category };
}

function calculateBMR(weight, height, age, gender) {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return bmr * (multipliers[activityLevel] || 1.55);
}

function calculateBodyFat(gender, height, waist, neck, hip) {
  let bodyFat;
  if (gender === 'male') {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  } else {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
  }
  bodyFat = Math.max(bodyFat, 3);

  let category = '';
  if (gender === 'male') {
    if (bodyFat < 6) category = 'Essential Fat';
    else if (bodyFat < 14) category = 'Athletic';
    else if (bodyFat < 18) category = 'Fitness';
    else if (bodyFat < 25) category = 'Average';
    else category = 'Above Average';
  } else {
    if (bodyFat < 14) category = 'Essential Fat';
    else if (bodyFat < 21) category = 'Athletic';
    else if (bodyFat < 25) category = 'Fitness';
    else if (bodyFat < 32) category = 'Average';
    else category = 'Above Average';
  }
  return { value: bodyFat, category };
}

function calculateIdealWeight(height, gender) {
  const heightInches = height / 2.54;
  const inchesOver5Feet = Math.max(0, heightInches - 60);
  if (gender === 'male') {
    return 50 + 2.3 * inchesOver5Feet;
  } else {
    return 45.5 + 2.3 * inchesOver5Feet;
  }
}

function calculateOneRepMax(weight, reps) {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

function calculateCalorieGoal(tdee, goal) {
  switch (goal) {
    case 'cut': return tdee - 500;
    case 'bulk': return tdee + 300;
    default: return tdee;
  }
}

function calculateProteinIntake(weight, goal) {
  let gramsPerKg;
  switch (goal) {
    case 'cut': gramsPerKg = 2.2; break;
    case 'bulk': gramsPerKg = 2.0; break;
    default: gramsPerKg = 1.6; break;
  }
  return weight * gramsPerKg;
}

function calculateWaterIntake(weight, activityLevel) {
  const baseWater = weight * 0.033;
  const activityMultiplier = {
    sedentary: 1.0,
    light: 1.1,
    moderate: 1.2,
    active: 1.4,
    very_active: 1.6,
  };
  return baseWater * (activityMultiplier[activityLevel] || 1.2);
}

function calculateHeartRateZones(age) {
  const maxHR = 220 - age;
  const zones = [
    { name: 'Warm Up', min: Math.round(maxHR * 0.50), max: Math.round(maxHR * 0.60), color: '#60a5fa' },
    { name: 'Fat Burn', min: Math.round(maxHR * 0.60), max: Math.round(maxHR * 0.70), color: '#4ade80' },
    { name: 'Cardio', min: Math.round(maxHR * 0.70), max: Math.round(maxHR * 0.80), color: '#facc15' },
    { name: 'Peak', min: Math.round(maxHR * 0.80), max: Math.round(maxHR * 0.90), color: '#fb923c' },
    { name: 'Max Effort', min: Math.round(maxHR * 0.90), max: maxHR, color: '#f87171' },
  ];
  return { max: maxHR, zones };
}

function calculateMacros(calories, weight, goal) {
  let proteinRatio, fatRatio, carbRatio;
  switch (goal) {
    case 'cut':
      proteinRatio = 0.40; fatRatio = 0.30; carbRatio = 0.30; break;
    case 'bulk':
      proteinRatio = 0.30; fatRatio = 0.25; carbRatio = 0.45; break;
    default:
      proteinRatio = 0.30; fatRatio = 0.30; carbRatio = 0.40; break;
  }
  const proteinCal = Math.round(calories * proteinRatio);
  const carbsCal = Math.round(calories * carbRatio);
  const fatCal = Math.round(calories * fatRatio);
  return {
    protein: Math.round(proteinCal / 4),
    carbs: Math.round(carbsCal / 4),
    fat: Math.round(fatCal / 9),
    proteinCal, carbsCal, fatCal,
  };
}

// ===== RENDER FUNCTIONS =====

function getActivityFactor(level) {
  const map = { sedentary: '1.2x', light: '1.375x', moderate: '1.55x', active: '1.725x', very_active: '1.9x' };
  return map[level] || '1.55x';
}

function getTrainingVolume(level) {
  const map = {
    sedentary: { sets: '10-12', sessions: '3x', rest: '4' },
    light: { sets: '12-15', sessions: '4x', rest: '3' },
    moderate: { sets: '15-20', sessions: '5x', rest: '2' },
    active: { sets: '18-22', sessions: '5-6x', rest: '1-2' },
    very_active: { sets: '20-25', sessions: '6x', rest: '1' },
  };
  return map[level] || map.moderate;
}

function getStrengthLevel(ratio) {
  if (ratio >= 2) return { label: '🏆 Elite', cls: 'background:rgba(234,179,8,0.2);color:#facc15;border:1px solid rgba(234,179,8,0.3)' };
  if (ratio >= 1.5) return { label: '💪 Advanced', cls: 'background:rgba(168,85,247,0.2);color:#c084fc;border:1px solid rgba(168,85,247,0.3)' };
  if (ratio >= 1) return { label: '🔥 Intermediate', cls: 'background:rgba(59,130,246,0.2);color:#60a5fa;border:1px solid rgba(59,130,246,0.3)' };
  if (ratio >= 0.75) return { label: '📈 Novice', cls: 'background:rgba(107,114,128,0.2);color:#9ca3af;border:1px solid rgba(107,114,128,0.3)' };
  return { label: '🌱 Beginner', cls: 'background:rgba(107,114,128,0.2);color:#9ca3af;border:1px solid rgba(107,114,128,0.3)' };
}

function renderAll() {
  // Calculate all values
  const bmi = calculateBMI(userData.weight, userData.height);
  const bmr = calculateBMR(userData.weight, userData.height, userData.age, userData.gender);
  const tdee = calculateTDEE(bmr, userData.activityLevel);
  const bodyFat = calculateBodyFat(userData.gender, userData.height, userData.waist, userData.neck, userData.hip);
  const idealWeight = calculateIdealWeight(userData.height, userData.gender);
  const oneRepMax = calculateOneRepMax(userData.benchPress, 1);
  const calorieGoal = calculateCalorieGoal(tdee, userData.goal);
  const proteinIntake = calculateProteinIntake(userData.weight, userData.goal);
  const waterIntake = calculateWaterIntake(userData.weight, userData.activityLevel);
  const heartRateZones = calculateHeartRateZones(userData.age);
  const macros = calculateMacros(calorieGoal, userData.weight, userData.goal);
  const trainingVol = getTrainingVolume(userData.activityLevel);
  const strengthLevel = getStrengthLevel(oneRepMax / userData.weight);

  // BMI Progress bar color
  let bmiBarColor = '#22d3ee';
  if (bmi.value >= 30) bmiBarColor = '#f87171';
  else if (bmi.value >= 25) bmiBarColor = '#facc15';
  else if (bmi.value >= 18.5) bmiBarColor = '#4ade80';

  // Ideal weight status
  let idealStatus = '';
  let idealStatusColor = '';
  const diff = userData.weight - idealWeight;
  if (Math.abs(diff) <= 5) {
    idealStatus = '✅ At ideal weight!';
    idealStatusColor = '#4ade80';
  } else if (diff > 0) {
    idealStatus = `↑ ${((diff / idealWeight) * 100).toFixed(1)}% above ideal`;
    idealStatusColor = '#facc15';
  } else {
    idealStatus = `↓ ${((Math.abs(diff) / idealWeight) * 100).toFixed(1)}% below ideal`;
    idealStatusColor = '#60a5fa';
  }

  // Calorie goal note
  let calorieNote = '';
  if (userData.goal === 'cut') calorieNote = `Deficit of 500 cal from TDEE (${tdee.toFixed(0)})`;
  else if (userData.goal === 'bulk') calorieNote = `Surplus of 300 cal from TDEE (${tdee.toFixed(0)})`;
  else calorieNote = `Equal to TDEE (${tdee.toFixed(0)})`;

  // Protein per kg
  let proteinPerKg = '1.6';
  if (userData.goal === 'cut') proteinPerKg = '2.2';
  else if (userData.goal === 'bulk') proteinPerKg = '2.0';

  // Water glasses
  const glassCount = Math.round(waterIntake / 0.25);
  let waterGlassesHTML = '';
  for (let i = 0; i < Math.min(glassCount, 20); i++) {
    waterGlassesHTML += '<div class="water-glass"></div>';
  }

  // Heart rate zones
  let zonesHTML = '';
  heartRateZones.zones.forEach(zone => {
    zonesHTML += `
      <div class="zone-item">
        <div class="zone-dot" style="background:${zone.color}"></div>
        <span class="zone-name">${zone.name}</span>
        <span class="zone-range">${zone.min}-${zone.max} bpm</span>
      </div>`;
  });

  // BMI categories
  const bmiCategories = [
    { name: 'Underweight', range: '< 18.5', active: bmi.value < 18.5, color: '#22d3ee' },
    { name: 'Normal', range: '18.5 - 24.9', active: bmi.value >= 18.5 && bmi.value < 25, color: '#4ade80' },
    { name: 'Overweight', range: '25 - 29.9', active: bmi.value >= 25 && bmi.value < 30, color: '#facc15' },
    { name: 'Obese', range: '≥ 30', active: bmi.value >= 30, color: '#f87171' },
  ];

  let bmiCatHTML = '';
  bmiCategories.forEach(cat => {
    const activeClass = cat.active ? `active-cat` : '';
    const activeStyle = cat.active ? `border-color:${cat.color};background:${cat.color}20` : '';
    bmiCatHTML += `
      <div class="category-item ${activeClass}" style="${activeStyle}">
        <span class="cat-name">${cat.name}</span>
        <span class="cat-range">${cat.range}</span>
      </div>`;
  });

  // ===== BUILD CALCULATOR CARDS HTML =====
  const cards = [];

  // Body Metrics
  if (activeTab === 'all' || activeTab === 'body') {
    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#3b82f6,#06b6d4)">⚖️</div>
            <div><div class="card-title">BMI</div><div class="card-subtitle">Body Mass Index</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-blue">${bmi.value.toFixed(1)}</div>
          <div class="result-category">${bmi.category}</div>
          <div class="progress-bar"><div class="progress-fill" style="width:${Math.min((bmi.value / 40) * 100, 100)}%;background:${bmiBarColor}"></div></div>
          <div class="progress-labels"><span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span></div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#a855f7,#ec4899)">📐</div>
            <div><div class="card-title">Body Fat %</div><div class="card-subtitle">Navy Method Estimate</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-purple">${bodyFat.value.toFixed(1)}%</div>
          <div class="result-category">${bodyFat.category}</div>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-box-label">Lean Mass</div><div class="stat-box-value">${(userData.weight * (1 - bodyFat.value / 100)).toFixed(1)} kg</div></div>
            <div class="stat-box"><div class="stat-box-label">Fat Mass</div><div class="stat-box-value">${(userData.weight * bodyFat.value / 100).toFixed(1)} kg</div></div>
          </div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#10b981,#14b8a6)">🎯</div>
            <div><div class="card-title">Ideal Weight</div><div class="card-subtitle">Based on Height</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-emerald">${idealWeight.toFixed(1)}</div>
          <div class="result-label">kg</div>
          <div class="weight-status" style="color:${idealStatusColor}">${idealStatus}</div>
        </div>
      </div>`);
  }

  // Nutrition
  if (activeTab === 'all' || activeTab === 'nutrition') {
    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#f97316,#f59e0b)">🔥</div>
            <div><div class="card-title">BMR</div><div class="card-subtitle">Basal Metabolic Rate</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-orange">${bmr.toFixed(0)}</div>
          <div class="result-label">calories/day at rest</div>
          <div class="note-text">This is the minimum calories your body needs for basic functions like breathing, circulation, and cell production.</div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#eab308,#f97316)">⚡</div>
            <div><div class="card-title">TDEE</div><div class="card-subtitle">Total Daily Energy Expenditure</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-yellow">${tdee.toFixed(0)}</div>
          <div class="result-label">calories/day</div>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-box-label">Activity Factor</div><div class="stat-box-value">${getActivityFactor(userData.activityLevel)}</div></div>
            <div class="stat-box"><div class="stat-box-label">Per Meal (4x)</div><div class="stat-box-value">${(tdee / 4).toFixed(0)} cal</div></div>
          </div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#ef4444,#ec4899)">🎯</div>
            <div><div class="card-title">Calorie Goal</div><div class="card-subtitle">Goal: ${userData.goal}</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-red">${calorieGoal.toFixed(0)}</div>
          <div class="result-label">calories/day</div>
          <div class="note-text">${calorieNote}</div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#f43f5e,#ef4444)">🥩</div>
            <div><div class="card-title">Protein Intake</div><div class="card-subtitle">Daily Protein Target</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-rose">${proteinIntake.toFixed(0)}g</div>
          <div class="result-label">protein/day</div>
          <div class="stat-grid-3">
            <div class="stat-box"><div class="stat-box-label">Per kg</div><div class="stat-box-value">${proteinPerKg}g</div></div>
            <div class="stat-box"><div class="stat-box-label">Calories</div><div class="stat-box-value">${(proteinIntake * 4).toFixed(0)}</div></div>
            <div class="stat-box"><div class="stat-box-label">Per Meal</div><div class="stat-box-value">${(proteinIntake / 4).toFixed(0)}g</div></div>
          </div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#6366f1,#a855f7)">🍽️</div>
            <div><div class="card-title">Macros Split</div><div class="card-subtitle">Daily Macronutrients</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="macros-grid">
            <div class="macro-box protein"><div class="macro-value">${macros.protein}g</div><div class="macro-label">Protein</div><div class="macro-cal">${macros.proteinCal} cal</div></div>
            <div class="macro-box carbs"><div class="macro-value">${macros.carbs}g</div><div class="macro-label">Carbs</div><div class="macro-cal">${macros.carbsCal} cal</div></div>
            <div class="macro-box fat"><div class="macro-value">${macros.fat}g</div><div class="macro-label">Fat</div><div class="macro-cal">${macros.fatCal} cal</div></div>
          </div>
          <div class="total-text">Total: ${calorieGoal.toFixed(0)} cal/day</div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#06b6d4,#3b82f6)">💧</div>
            <div><div class="card-title">Water Intake</div><div class="card-subtitle">Daily Hydration Target</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-cyan">${waterIntake.toFixed(1)}L</div>
          <div class="result-label">water/day</div>
          <div class="water-glasses">${waterGlassesHTML}</div>
          <div class="note-text">≈ ${glassCount} glasses (250ml each)</div>
        </div>
      </div>`);
  }

  // Strength
  if (activeTab === 'all' || activeTab === 'strength') {
    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#f59e0b,#eab308)">🏆</div>
            <div><div class="card-title">One Rep Max</div><div class="card-subtitle">Estimated 1RM (Bench Press)</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-amber">${oneRepMax.toFixed(1)}</div>
          <div class="result-label">kg estimated 1RM</div>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-box-label">5 Reps</div><div class="stat-box-value">${(oneRepMax * 0.87).toFixed(1)} kg</div></div>
            <div class="stat-box"><div class="stat-box-label">8 Reps</div><div class="stat-box-value">${(oneRepMax * 0.80).toFixed(1)} kg</div></div>
            <div class="stat-box"><div class="stat-box-label">10 Reps</div><div class="stat-box-value">${(oneRepMax * 0.75).toFixed(1)} kg</div></div>
            <div class="stat-box"><div class="stat-box-label">12 Reps</div><div class="stat-box-value">${(oneRepMax * 0.70).toFixed(1)} kg</div></div>
          </div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#8b5cf6,#a855f7)">⭐</div>
            <div><div class="card-title">Strength Level</div><div class="card-subtitle">Based on Bodyweight Ratio</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-violet">${(oneRepMax / userData.weight).toFixed(2)}x</div>
          <div class="result-label">bodyweight ratio</div>
          <div style="text-align:center"><span class="strength-badge" style="${strengthLevel.cls}">${strengthLevel.label}</span></div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#22c55e,#10b981)">📈</div>
            <div><div class="card-title">Training Volume</div><div class="card-subtitle">Weekly Volume Recommendation</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-green">${trainingVol.sets}</div>
          <div class="result-label">sets/week recommended</div>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-box-label">Sessions</div><div class="stat-box-value">${trainingVol.sessions} /week</div></div>
            <div class="stat-box"><div class="stat-box-label">Rest Days</div><div class="stat-box-value">${trainingVol.rest} days</div></div>
          </div>
        </div>
      </div>`);
  }

  // Health
  if (activeTab === 'all' || activeTab === 'health') {
    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#ef4444,#f43f5e)">❤️</div>
            <div><div class="card-title">Heart Rate Zones</div><div class="card-subtitle">Training Zones (Karvonen)</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-red" style="font-size:30px">${heartRateZones.max} BPM</div>
          <div class="result-label">Max Heart Rate</div>
          <div class="zone-list">${zonesHTML}</div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#f97316,#ef4444)">🔥</div>
            <div><div class="card-title">Calories Burned</div><div class="card-subtitle">Estimated per workout</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="result-big gradient-orange">${Math.round(tdee * 0.15)}</div>
          <div class="result-label">cal/hour (moderate workout)</div>
          <div class="stat-grid">
            <div class="stat-box"><div class="stat-box-label">Light (30min)</div><div class="stat-box-value">${Math.round(tdee * 0.05)} cal</div></div>
            <div class="stat-box"><div class="stat-box-label">Intense (1hr)</div><div class="stat-box-value">${Math.round(tdee * 0.25)} cal</div></div>
            <div class="stat-box"><div class="stat-box-label">HIIT (30min)</div><div class="stat-box-value">${Math.round(tdee * 0.12)} cal</div></div>
            <div class="stat-box"><div class="stat-box-label">Cardio (1hr)</div><div class="stat-box-value">${Math.round(tdee * 0.2)} cal</div></div>
          </div>
        </div>
      </div>`);

    cards.push(`
      <div class="calc-card">
        <div class="card-header">
          <div class="card-header-inner">
            <div class="card-icon" style="background:linear-gradient(135deg,#14b8a6,#06b6d4)">📋</div>
            <div><div class="card-title">BMI Categories</div><div class="card-subtitle">Where you stand</div></div>
          </div>
        </div>
        <div class="card-body">
          <div class="category-list">${bmiCatHTML}</div>
        </div>
      </div>`);
  }

  // Render cards into grid
  document.getElementById('calcGrid').innerHTML = cards.join('');
}

// ===== EVENT HANDLERS =====

function setupInputs() {
  // Number inputs
  const numberFields = ['weight', 'height', 'age', 'waist', 'neck', 'hip', 'benchPress', 'bodyFat'];
  numberFields.forEach(field => {
    const el = document.getElementById(`input-${field}`);
    if (el) {
      el.addEventListener('input', (e) => {
        userData[field] = parseFloat(e.target.value) || 0;
        renderAll();
      });
    }
  });

  // Select inputs
  const selectFields = ['gender', 'activityLevel', 'goal'];
  selectFields.forEach(field => {
    const el = document.getElementById(`input-${field}`);
    if (el) {
      el.addEventListener('change', (e) => {
        userData[field] = e.target.value;
        renderAll();
      });
    }
  });
}

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      renderAll();
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  setupInputs();
  setupTabs();
  renderAll();
});
