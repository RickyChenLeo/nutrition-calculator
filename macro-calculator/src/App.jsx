import { useState, useCallback } from 'react';
import Header from './components/Header';
import CalculatorForm from './components/CalculatorForm';
import ResultCard from './components/ResultCard';
import { calculateMifflinStJeor, calculateKatchMcArdle, calculateTDEE, calculateExerciseBurn, calculateGoalCalories, calculateGoalMacros, calculateMicros, TAIWAN_SPORTS_METS } from './utils/calculator';
import { TRANSLATIONS } from './utils/translations';

function App() {
  const [lang, setLang] = useState('zh');
  const t = TRANSLATIONS[lang];

  if (!t) return <div className="p-10 text-center">Loading resources... (Language: {lang})</div>;

  const [formData, setFormData] = useState({
    gender: 'male',
    age: '25',
    weight: '70',
    height: '175',
    bodyFat: '',
    activity: 'sedentary',
    // New Multi-Exercise State
    exercises: [], // Array of { id, type, duration, intensity }

    // Goals
    goal: 'maintain',
    athleteProfile: 'enthusiast', // Default to Sports Enthusiast
    targetBodyFat: '12',
    targetTimeWeeks: '12',
    targetGainKg: '2', // Default 2kg lean mass
    bulkTargetType: 'weight', // 'weight' or 'ffmi'
    targetFFMI: '22' // Default target FFMI
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Multi-Exercise Handlers ---
  const handleAddExercise = (selectedExerciseType = null) => {
    // If coming from search/select, selectedExerciseType might be passed, 
    // but current flow adds generic then user changes it. 
    // If we want to check duplicates *before* adding, we need to know what's being added.
    // Assuming default add is a specific placeholder or prompt. 

    // However, the requirement says "check if exercise id or NAME already exists".
    // Since duplicates usually matter when they are the SAME sport.
    // Let's assume the user selects from a dropdown to add? 
    // Actually, looking at MultiExerciseForm logic (which I assume exists inside CalculatorForm or is inline),
    // usually users add a row then select type. 
    // CAUTION: The prompt implies intercepting the addition. 
    // If the tool is "Add Row" -> "Select Type", checking at "Add Row" is hard unless we default to a type.
    // Let's implement the check for the DEFAULT type being added, OR if we are adding a specific one.

    // For now, let's assume we are adding a default 'walking_brisk'.
    const typeToAdd = 'walking_brisk';

    // Logic removed: Smart Dropdown will prevent duplicates.

    setFormData(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { id: Date.now(), type: typeToAdd, duration: '30', intensity: 5 }
      ]
    }));
  };

  const handleRemoveExercise = (id) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== id)
    }));
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setFormData(prev => ({ ...prev, exercises: newExercises }));
  };
  // -------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    // Debug Data Wiring
    console.log('Form Data:', formData);

    // 1. Calculate BMR
    let bmr;
    if (formData.bodyFat) {
      bmr = Math.round(calculateKatchMcArdle(
        parseFloat(formData.weight),
        parseFloat(formData.bodyFat)
      ));
    } else {
      bmr = Math.round(calculateMifflinStJeor(
        parseFloat(formData.weight),
        parseFloat(formData.height),
        parseFloat(formData.age),
        formData.gender
      ));
    }

    // 2. Calculate Exercise Burn (Sum of all exercises)
    let totalExerciseBurn = 0;
    let exerciseDetails = []; // Store detailed objects for breakdown UI

    if (formData.exercises.length > 0) {
      formData.exercises.forEach(ex => {
        if (ex.type) {
          const sportObj = TAIWAN_SPORTS_METS[ex.type];
          if (sportObj) {
            const burn = calculateExerciseBurn(
              parseFloat(formData.weight),
              sportObj,
              parseFloat(ex.duration) || 0,
              ex.intensity
            );
            totalExerciseBurn += burn;

            // Store detail for UI
            const label = sportObj.label;
            exerciseDetails.push({
              name: t[label] || label,
              calories: burn
            });
          }
        }
      });
    }

    // 3. Calculate TDEE
    // Note: If exercises exist, calculateTDEE will use 'sedentary' as base multiplier (implemented in logic below)
    const effectiveActivity = formData.exercises.length > 0 ? 'sedentary' : formData.activity;

    const tdee = calculateTDEE(bmr, effectiveActivity, totalExerciseBurn);

    // 3.5 Determine Effective Target Gain based on FFMI if needed
    let effectiveTargetGainKg = parseFloat(formData.targetGainKg);
    if (formData.goal === 'bulk' && formData.bulkTargetType === 'ffmi') {
      if (formData.bodyFat) {
        const heightM = parseFloat(formData.height) / 100;
        const weight = parseFloat(formData.weight);
        const bodyFat = parseFloat(formData.bodyFat);

        const currentLeanMass = weight * (1 - bodyFat / 100);
        const targetFFMI = parseFloat(formData.targetFFMI);
        const reqLeanMass = targetFFMI * (heightM * heightM);

        effectiveTargetGainKg = Math.max(0, reqLeanMass - currentLeanMass);
      } else {
        // Missing Body Fat catch: Do not calculate yet or default safely
        // Using alert to prompt user, then returning early
        alert("FFMI calculation requires Body Fat %. Please enter it.");
        return;
      }
    }

    // 4. Calculate Goal Calories & Macros
    const goalResults = calculateGoalCalories(tdee, formData.goal, {
      currentWeight: parseFloat(formData.weight),
      currentBodyFat: parseFloat(formData.bodyFat),
      targetBodyFat: parseFloat(formData.targetBodyFat),
      targetGainKg: effectiveTargetGainKg,
      timeWeeks: parseFloat(formData.targetTimeWeeks)
    });

    const macros = calculateGoalMacros(
      goalResults.calories,
      formData.goal,
      formData.athleteProfile, // Pass athlete profile
      parseFloat(formData.weight), // Pass current weight (New Requirement)
      formData.exercises // Pass exercises for Daily Load (New Requirement)
    );

    const micros = calculateMicros(
      formData.gender,
      macros.dailyLoad
    );

    setResults({
      bmr,
      tdee,
      macros, // Now contains .ratios and .dailyLoad
      micros, // New Micronutrient Data
      athleteProfile: formData.athleteProfile,
      exerciseBurn: totalExerciseBurn,
      exerciseDetails, // Pass the array
      goal: formData.goal,
      goalCalories: goalResults.calories,
      dailyDiff: goalResults.dailyDiff,
      warning: goalResults.warning,
      gymTime: 0, // Legacy
      range: {
        min: Math.round(goalResults.calories * 0.95),
        max: Math.round(goalResults.calories * 1.05)
      }
    });
  };

  const handleReset = () => {
    setResults(null);
  };

  return (

    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-apple-green selection:text-white pb-24 md:pb-10" >
      <div className="max-w-7xl mx-auto min-h-screen flex flex-col md:px-6 md:py-8">

        {/* Header - Fixed on Mobile, Relative on Desktop */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md md:static md:bg-transparent md:backdrop-blur-none border-b border-gray-200 md:border-0 px-4 py-3 mb-4 md:mb-8 flex justify-between items-center">
          <div className="md:hidden">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">{t.title}</h1>
          </div>
          <Header lang={lang} setLang={setLang} t={t} />
        </div>

        <main className="flex-1 px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN: Form (40% on Desktop) */}
            <div className="md:col-span-5 lg:col-span-4 space-y-6">
              <div className="hidden md:block mb-6">
                <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">
                  {t.title}
                </h1>
                <p className="text-gray-500 font-medium">
                  {results ? t.subtitle_result : t.subtitle_init}
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-6">
                <CalculatorForm
                  values={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onExerciseChange={handleExerciseChange}
                  onAddExercise={handleAddExercise}
                  onRemoveExercise={handleRemoveExercise}
                  t={t}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Results (60% on Desktop) - Sticky */}
            <div className="md:col-span-7 lg:col-span-8 mt-8 md:mt-0 md:sticky md:top-8 transition-all duration-500">
              {results ? (
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-white p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-apple-green to-emerald-400"></div>
                  <ResultCard
                    results={results}
                    onReset={handleReset}
                    t={t}
                  />
                </div>
              ) : (
                /* Initial Placeholder State for Desktop */
                <div className="hidden md:flex flex-col items-center justify-center h-[600px] bg-white rounded-[2.5rem] border border-dashed border-gray-200 text-gray-400 p-10 text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Calculate?</h3>
                  <p className="max-w-xs mx-auto">Fill in your details on the left, and your personalized plan will appear here.</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div >
  );
}

export default App;
