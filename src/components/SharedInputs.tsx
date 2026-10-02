import { UserData } from '../utils/calculations';

interface SharedInputsProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export default function SharedInputs({ userData, setUserData }: SharedInputsProps) {
  const updateField = (field: keyof UserData, value: number | string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-sm">
          👤
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Your Profile</h2>
          <p className="text-xs text-gray-400">Enter once — all calculators update automatically</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Weight */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>⚖️</span> Weight (kg)
          </label>
          <input
            type="number"
            value={userData.weight}
            onChange={(e) => updateField('weight', Number(e.target.value))}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
            min="20"
            max="300"
            step="0.1"
          />
        </div>

        {/* Height */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>📏</span> Height (cm)
          </label>
          <input
            type="number"
            value={userData.height}
            onChange={(e) => updateField('height', Number(e.target.value))}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
            min="100"
            max="250"
            step="0.1"
          />
        </div>

        {/* Age */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>🎂</span> Age
          </label>
          <input
            type="number"
            value={userData.age}
            onChange={(e) => updateField('age', Number(e.target.value))}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
            min="10"
            max="100"
          />
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>👤</span> Gender
          </label>
          <select
            value={userData.gender}
            onChange={(e) => updateField('gender', e.target.value)}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Activity Level */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>🏃</span> Activity
          </label>
          <select
            value={userData.activityLevel}
            onChange={(e) => updateField('activityLevel', e.target.value)}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly Active</option>
            <option value="moderate">Moderately Active</option>
            <option value="active">Very Active</option>
            <option value="very_active">Extremely Active</option>
          </select>
        </div>

        {/* Goal */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>🎯</span> Goal
          </label>
          <select
            value={userData.goal}
            onChange={(e) => updateField('goal', e.target.value)}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
          >
            <option value="cut">Cut (Lose Fat)</option>
            <option value="maintain">Maintain</option>
            <option value="bulk">Bulk (Build Muscle)</option>
          </select>
        </div>

        {/* Waist */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>📐</span> Waist (cm)
          </label>
          <input
            type="number"
            value={userData.waist}
            onChange={(e) => updateField('waist', Number(e.target.value))}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
            min="40"
            max="200"
          />
        </div>

        {/* Neck */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>📐</span> Neck (cm)
          </label>
          <input
            type="number"
            value={userData.neck}
            onChange={(e) => updateField('neck', Number(e.target.value))}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
            min="20"
            max="60"
          />
        </div>

        {/* Hip (for females) */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>📐</span> Hip (cm)
          </label>
          <input
            type="number"
            value={userData.hip}
            onChange={(e) => updateField('hip', Number(e.target.value))}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
            min="50"
            max="200"
          />
        </div>

        {/* Bench Press */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>🏋️</span> Bench Press (kg)
          </label>
          <input
            type="number"
            value={userData.benchPress}
            onChange={(e) => updateField('benchPress', Number(e.target.value))}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
            min="10"
            max="400"
          />
        </div>

        {/* Body Fat (manual) */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
            <span>📊</span> Body Fat % (opt)
          </label>
          <input
            type="number"
            value={userData.bodyFat}
            onChange={(e) => updateField('bodyFat', Number(e.target.value))}
            className="w-full bg-gray-900/60 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
            min="3"
            max="60"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}
