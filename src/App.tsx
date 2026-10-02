import { useState } from 'react';
import SharedInputs from './components/SharedInputs';
import CalculatorCard from './components/CalculatorCard';
import { UserData, calculateBMI, calculateBMR, calculateTDEE, calculateBodyFat, calculateIdealWeight, calculateOneRepMax, calculateCalorieGoal, calculateProteinIntake, calculateWaterIntake, calculateHeartRateZones, calculateMacros } from './utils/calculations';

export default function App() {
  const [userData, setUserData] = useState<UserData>({
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
  });

  const [activeTab, setActiveTab] = useState<string>('all');

  const bmi = calculateBMI(userData.weight, userData.height);
  const bmr = calculateBMR(userData.weight, userData.height, userData.age, userData.gender);
  const tdee = calculateTDEE(bmr, userData.activityLevel);
  const bodyFatResult = calculateBodyFat(userData.gender, userData.height, userData.waist, userData.neck, userData.hip);
  const idealWeight = calculateIdealWeight(userData.height, userData.gender);
  const oneRepMax = calculateOneRepMax(userData.benchPress, 1);
  const calorieGoal = calculateCalorieGoal(tdee, userData.goal);
  const proteinIntake = calculateProteinIntake(userData.weight, userData.goal);
  const waterIntake = calculateWaterIntake(userData.weight, userData.activityLevel);
  const heartRateZones = calculateHeartRateZones(userData.age);
  const macros = calculateMacros(calorieGoal, userData.weight, userData.goal);

  const tabs = [
    { id: 'all', label: 'All Calculators', icon: '📊' },
    { id: 'body', label: 'Body Metrics', icon: '🏋️' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'strength', label: 'Strength', icon: '💪' },
    { id: 'health', label: 'Health', icon: '❤️' },
  ];

  const shouldShow = (category: string) => activeTab === 'all' || activeTab === category;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-500/20">
                G
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  GymPro Calculator Suite
                </h1>
                <p className="text-xs text-gray-400">Enter your details once — get all results instantly</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Calculations
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Shared Inputs Section */}
        <SharedInputs userData={userData} setUserData={setUserData} />

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-8 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white border border-gray-700/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Body Metrics */}
          {shouldShow('body') && (
            <>
              <CalculatorCard
                title="BMI"
                subtitle="Body Mass Index"
                icon="⚖️"
                color="from-blue-500 to-cyan-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {bmi.value.toFixed(1)}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">{bmi.category}</div>
                  <div className="mt-3 w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        bmi.value < 18.5 ? 'bg-cyan-400' :
                        bmi.value < 25 ? 'bg-green-400' :
                        bmi.value < 30 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.min((bmi.value / 40) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="Body Fat %"
                subtitle="Navy Method Estimate"
                icon="📐"
                color="from-purple-500 to-pink-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {bodyFatResult.value.toFixed(1)}%
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">{bodyFatResult.category}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Lean Mass</span>
                      <div className="text-white font-semibold">{(userData.weight * (1 - bodyFatResult.value / 100)).toFixed(1)} kg</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Fat Mass</span>
                      <div className="text-white font-semibold">{(userData.weight * bodyFatResult.value / 100).toFixed(1)} kg</div>
                    </div>
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="Ideal Weight"
                subtitle="Based on Height"
                icon="🎯"
                color="from-emerald-500 to-teal-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {idealWeight.toFixed(1)}
                  </div>
                  <div className="text-gray-400 text-sm">kg</div>
                  <div className="mt-3 text-sm">
                    <div className={`font-medium ${
                      Math.abs(userData.weight - idealWeight) <= 5 ? 'text-green-400' :
                      userData.weight > idealWeight ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {Math.abs(userData.weight - idealWeight) <= 5 ? '✅ At ideal weight!' :
                       userData.weight > idealWeight ? `↑ ${((userData.weight - idealWeight) / idealWeight * 100).toFixed(1)}% above ideal` :
                       `↓ ${((idealWeight - userData.weight) / idealWeight * 100).toFixed(1)}% below ideal`}
                    </div>
                  </div>
                </div>
              </CalculatorCard>
            </>
          )}

          {/* Nutrition */}
          {shouldShow('nutrition') && (
            <>
              <CalculatorCard
                title="BMR"
                subtitle="Basal Metabolic Rate"
                icon="🔥"
                color="from-orange-500 to-amber-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    {bmr.toFixed(0)}
                  </div>
                  <div className="text-gray-400 text-sm">calories/day at rest</div>
                  <div className="mt-3 text-xs text-gray-400">
                    This is the minimum calories your body needs for basic functions like breathing, circulation, and cell production.
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="TDEE"
                subtitle="Total Daily Energy Expenditure"
                icon="⚡"
                color="from-yellow-500 to-orange-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {tdee.toFixed(0)}
                  </div>
                  <div className="text-gray-400 text-sm">calories/day</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Activity Factor</span>
                      <div className="text-white font-semibold">
                        {userData.activityLevel === 'sedentary' ? '1.2x' :
                         userData.activityLevel === 'light' ? '1.375x' :
                         userData.activityLevel === 'moderate' ? '1.55x' :
                         userData.activityLevel === 'active' ? '1.725x' : '1.9x'}
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Per Meal (4x)</span>
                      <div className="text-white font-semibold">{(tdee / 4).toFixed(0)} cal</div>
                    </div>
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="Calorie Goal"
                subtitle={`Goal: ${userData.goal}`}
                icon="🎯"
                color="from-red-500 to-pink-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                    {calorieGoal.toFixed(0)}
                  </div>
                  <div className="text-gray-400 text-sm">calories/day</div>
                  <div className="mt-3 text-xs text-gray-400">
                    {userData.goal === 'cut' ? `Deficit of 500 cal from TDEE (${tdee.toFixed(0)})` :
                     userData.goal === 'bulk' ? `Surplus of 300 cal from TDEE (${tdee.toFixed(0)})` :
                     `Equal to TDEE (${tdee.toFixed(0)})`}
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="Protein Intake"
                subtitle="Daily Protein Target"
                icon="🥩"
                color="from-rose-500 to-red-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
                    {proteinIntake.toFixed(0)}g
                  </div>
                  <div className="text-gray-400 text-sm">protein/day</div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Per kg</span>
                      <div className="text-white font-semibold">
                        {userData.goal === 'cut' ? '2.2' : userData.goal === 'bulk' ? '2.0' : '1.6'}g
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Calories</span>
                      <div className="text-white font-semibold">{(proteinIntake * 4).toFixed(0)}</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Per Meal</span>
                      <div className="text-white font-semibold">{(proteinIntake / 4).toFixed(0)}g</div>
                    </div>
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="Macros Split"
                subtitle="Daily Macronutrients"
                icon="🍽️"
                color="from-indigo-500 to-purple-500"
              >
                <div className="text-center">
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="bg-gradient-to-b from-blue-500/20 to-blue-500/5 rounded-xl p-3 border border-blue-500/30">
                      <div className="text-2xl font-bold text-blue-400">{macros.protein}g</div>
                      <div className="text-xs text-gray-400">Protein</div>
                      <div className="text-xs text-blue-300">{macros.proteinCal} cal</div>
                    </div>
                    <div className="bg-gradient-to-b from-yellow-500/20 to-yellow-500/5 rounded-xl p-3 border border-yellow-500/30">
                      <div className="text-2xl font-bold text-yellow-400">{macros.carbs}g</div>
                      <div className="text-xs text-gray-400">Carbs</div>
                      <div className="text-xs text-yellow-300">{macros.carbsCal} cal</div>
                    </div>
                    <div className="bg-gradient-to-b from-pink-500/20 to-pink-500/5 rounded-xl p-3 border border-pink-500/30">
                      <div className="text-2xl font-bold text-pink-400">{macros.fat}g</div>
                      <div className="text-xs text-gray-400">Fat</div>
                      <div className="text-xs text-pink-300">{macros.fatCal} cal</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    Total: {calorieGoal.toFixed(0)} cal/day
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="Water Intake"
                subtitle="Daily Hydration Target"
                icon="💧"
                color="from-cyan-500 to-blue-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {waterIntake.toFixed(1)}L
                  </div>
                  <div className="text-gray-400 text-sm">water/day</div>
                  <div className="mt-3 flex justify-center gap-1">
                    {Array.from({ length: Math.round(waterIntake / 0.25) }).map((_, i) => (
                      <div key={i} className="w-3 h-6 bg-cyan-400/60 rounded-sm"></div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    ≈ {Math.round(waterIntake / 0.25)} glasses (250ml each)
                  </div>
                </div>
              </CalculatorCard>
            </>
          )}

          {/* Strength */}
          {shouldShow('strength') && (
            <>
              <CalculatorCard
                title="One Rep Max"
                subtitle="Estimated 1RM (Bench Press)"
                icon="🏆"
                color="from-amber-500 to-yellow-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                    {oneRepMax.toFixed(1)}
                  </div>
                  <div className="text-gray-400 text-sm">kg estimated 1RM</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">5 Reps</span>
                      <div className="text-white font-semibold">{(oneRepMax * 0.87).toFixed(1)} kg</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">8 Reps</span>
                      <div className="text-white font-semibold">{(oneRepMax * 0.80).toFixed(1)} kg</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">10 Reps</span>
                      <div className="text-white font-semibold">{(oneRepMax * 0.75).toFixed(1)} kg</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">12 Reps</span>
                      <div className="text-white font-semibold">{(oneRepMax * 0.70).toFixed(1)} kg</div>
                    </div>
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="Strength Level"
                subtitle="Based on Bodyweight Ratio"
                icon="⭐"
                color="from-violet-500 to-purple-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                    {(oneRepMax / userData.weight).toFixed(2)}x
                  </div>
                  <div className="text-gray-400 text-sm">bodyweight ratio</div>
                  <div className="mt-3">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      oneRepMax / userData.weight >= 2 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      oneRepMax / userData.weight >= 1.5 ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      oneRepMax / userData.weight >= 1 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {oneRepMax / userData.weight >= 2 ? '🏆 Elite' :
                       oneRepMax / userData.weight >= 1.5 ? '💪 Advanced' :
                       oneRepMax / userData.weight >= 1 ? '🔥 Intermediate' :
                       oneRepMax / userData.weight >= 0.75 ? '📈 Novice' : '🌱 Beginner'}
                    </div>
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="Training Volume"
                subtitle="Weekly Volume Recommendation"
                icon="📈"
                color="from-green-500 to-emerald-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {userData.activityLevel === 'sedentary' ? '10-12' :
                     userData.activityLevel === 'light' ? '12-15' :
                     userData.activityLevel === 'moderate' ? '15-20' :
                     userData.activityLevel === 'active' ? '18-22' : '20-25'}
                  </div>
                  <div className="text-gray-400 text-sm">sets/week recommended</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Sessions</span>
                      <div className="text-white font-semibold">
                        {userData.activityLevel === 'sedentary' ? '3x' :
                         userData.activityLevel === 'light' ? '4x' :
                         userData.activityLevel === 'moderate' ? '5x' :
                         userData.activityLevel === 'active' ? '5-6x' : '6x'} /week
                      </div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Rest Days</span>
                      <div className="text-white font-semibold">
                        {userData.activityLevel === 'sedentary' ? '4' :
                         userData.activityLevel === 'light' ? '3' :
                         userData.activityLevel === 'moderate' ? '2' :
                         userData.activityLevel === 'active' ? '1-2' : '1'} days
                      </div>
                    </div>
                  </div>
                </div>
              </CalculatorCard>
            </>
          )}

          {/* Health */}
          {shouldShow('health') && (
            <>
              <CalculatorCard
                title="Heart Rate Zones"
                subtitle="Training Zones (Karvonen)"
                icon="❤️"
                color="from-red-500 to-rose-500"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                    {heartRateZones.max} BPM
                  </div>
                  <div className="text-gray-400 text-sm">Max Heart Rate</div>
                  <div className="mt-3 space-y-2">
                    {heartRateZones.zones.map((zone, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded-full ${zone.color}`}></div>
                        <span className="text-gray-300 w-20">{zone.name}</span>
                        <span className="text-white font-medium">{zone.min}-{zone.max} bpm</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="Calories Burned"
                subtitle="Estimated per workout"
                icon="🔥"
                color="from-orange-500 to-red-500"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    {Math.round(tdee * 0.15)}
                  </div>
                  <div className="text-gray-400 text-sm">cal/hour (moderate workout)</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Light (30min)</span>
                      <div className="text-white font-semibold">{Math.round(tdee * 0.05)} cal</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Intense (1hr)</span>
                      <div className="text-white font-semibold">{Math.round(tdee * 0.25)} cal</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">HIIT (30min)</span>
                      <div className="text-white font-semibold">{Math.round(tdee * 0.12)} cal</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-400">Cardio (1hr)</span>
                      <div className="text-white font-semibold">{Math.round(tdee * 0.2)} cal</div>
                    </div>
                  </div>
                </div>
              </CalculatorCard>

              <CalculatorCard
                title="BMI Categories"
                subtitle="Where you stand"
                icon="📋"
                color="from-teal-500 to-cyan-500"
              >
                <div className="space-y-2 text-sm">
                  <div className={`flex justify-between p-2 rounded-lg ${bmi.value < 18.5 ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-gray-700/30'}`}>
                    <span className="text-gray-300">Underweight</span>
                    <span className="text-gray-400">&lt; 18.5</span>
                  </div>
                  <div className={`flex justify-between p-2 rounded-lg ${bmi.value >= 18.5 && bmi.value < 25 ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-700/30'}`}>
                    <span className="text-gray-300">Normal</span>
                    <span className="text-gray-400">18.5 - 24.9</span>
                  </div>
                  <div className={`flex justify-between p-2 rounded-lg ${bmi.value >= 25 && bmi.value < 30 ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-gray-700/30'}`}>
                    <span className="text-gray-300">Overweight</span>
                    <span className="text-gray-400">25 - 29.9</span>
                  </div>
                  <div className={`flex justify-between p-2 rounded-lg ${bmi.value >= 30 ? 'bg-red-500/20 border border-red-500/30' : 'bg-gray-700/30'}`}>
                    <span className="text-gray-300">Obese</span>
                    <span className="text-gray-400">≥ 30</span>
                  </div>
                </div>
              </CalculatorCard>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pb-8 text-center text-gray-500 text-sm">
          <p>GymPro Calculator Suite — All calculations are estimates. Consult a professional for personalized advice.</p>
        </footer>
      </main>
    </div>
  );
}
