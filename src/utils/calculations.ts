export interface UserData {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  bodyFat: number;
  benchPress: number;
  goal: 'cut' | 'maintain' | 'bulk';
  waist: number;
  neck: number;
  hip: number;
}

// BMI Calculator
export function calculateBMI(weight: number, height: number) {
  const heightM = height / 100;
  const value = weight / (heightM * heightM);
  let category = '';
  if (value < 18.5) category = 'Underweight';
  else if (value < 25) category = 'Normal Weight';
  else if (value < 30) category = 'Overweight';
  else category = 'Obese';
  return { value, category };
}

// BMR Calculator (Mifflin-St Jeor Equation)
export function calculateBMR(weight: number, height: number, age: number, gender: string) {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// TDEE Calculator
export function calculateTDEE(bmr: number, activityLevel: string) {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return bmr * (multipliers[activityLevel] || 1.55);
}

// Body Fat Calculator (Navy Method)
export function calculateBodyFat(gender: string, height: number, waist: number, neck: number, hip: number) {
  let bodyFat: number;
  const heightCm = height;

  if (gender === 'male') {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(heightCm)) - 450;
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

// Ideal Body Weight (Devine Formula)
export function calculateIdealWeight(height: number, gender: string) {
  const heightInches = height / 2.54;
  const inchesOver5Feet = Math.max(0, heightInches - 60);

  if (gender === 'male') {
    return 50 + 2.3 * inchesOver5Feet;
  } else {
    return 45.5 + 2.3 * inchesOver5Feet;
  }
}

// One Rep Max Calculator (Epley Formula)
export function calculateOneRepMax(weight: number, reps: number) {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

// Calorie Goal Calculator
export function calculateCalorieGoal(tdee: number, goal: string) {
  switch (goal) {
    case 'cut': return tdee - 500;
    case 'bulk': return tdee + 300;
    default: return tdee;
  }
}

// Protein Intake Calculator
export function calculateProteinIntake(weight: number, goal: string) {
  let gramsPerKg: number;
  switch (goal) {
    case 'cut': gramsPerKg = 2.2; break;
    case 'bulk': gramsPerKg = 2.0; break;
    default: gramsPerKg = 1.6; break;
  }
  return weight * gramsPerKg;
}

// Water Intake Calculator
export function calculateWaterIntake(weight: number, activityLevel: string) {
  let baseWater = weight * 0.033; // 33ml per kg
  const activityMultiplier: Record<string, number> = {
    sedentary: 1.0,
    light: 1.1,
    moderate: 1.2,
    active: 1.4,
    very_active: 1.6,
  };
  return baseWater * (activityMultiplier[activityLevel] || 1.2);
}

// Heart Rate Zones (Karvonen Method)
export function calculateHeartRateZones(age: number) {
  const maxHR = 220 - age;
  const restingHR = 60; // assumed resting HR

  const zones = [
    {
      name: 'Warm Up',
      min: Math.round(maxHR * 0.50),
      max: Math.round(maxHR * 0.60),
      color: 'bg-blue-400',
    },
    {
      name: 'Fat Burn',
      min: Math.round(maxHR * 0.60),
      max: Math.round(maxHR * 0.70),
      color: 'bg-green-400',
    },
    {
      name: 'Cardio',
      min: Math.round(maxHR * 0.70),
      max: Math.round(maxHR * 0.80),
      color: 'bg-yellow-400',
    },
    {
      name: 'Peak',
      min: Math.round(maxHR * 0.80),
      max: Math.round(maxHR * 0.90),
      color: 'bg-orange-400',
    },
    {
      name: 'Max Effort',
      min: Math.round(maxHR * 0.90),
      max: maxHR,
      color: 'bg-red-400',
    },
  ];

  return { max: maxHR, resting: restingHR, zones };
}

// Macros Calculator
export function calculateMacros(calories: number, weight: number, goal: string) {
  let proteinRatio: number, fatRatio: number, carbRatio: number;

  switch (goal) {
    case 'cut':
      proteinRatio = 0.40;
      fatRatio = 0.30;
      carbRatio = 0.30;
      break;
    case 'bulk':
      proteinRatio = 0.30;
      fatRatio = 0.25;
      carbRatio = 0.45;
      break;
    default:
      proteinRatio = 0.30;
      fatRatio = 0.30;
      carbRatio = 0.40;
      break;
  }

  const proteinCal = Math.round(calories * proteinRatio);
  const carbsCal = Math.round(calories * carbRatio);
  const fatCal = Math.round(calories * fatRatio);

  return {
    protein: Math.round(proteinCal / 4),
    carbs: Math.round(carbsCal / 4),
    fat: Math.round(fatCal / 9),
    proteinCal,
    carbsCal,
    fatCal,
  };
}
