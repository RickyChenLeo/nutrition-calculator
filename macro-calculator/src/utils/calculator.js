// BMR Formulas
export const calculateMifflinStJeor = (gender, weightKg, heightCm, ageYears) => {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
    return gender === 'male' ? base + 5 : base - 161;
};

export const calculateKatchMcArdle = (weightKg, bodyFatPercentage) => {
    const leanBodyMass = weightKg * (1 - bodyFatPercentage / 100);
    return 370 + (21.6 * leanBodyMass);
};

export const calculateBMR = (gender, weightKg, heightCm, ageYears, bodyFat = null) => {
    if (bodyFat && bodyFat > 0) {
        return Math.round(calculateKatchMcArdle(weightKg, parseFloat(bodyFat)));
    }
    return Math.round(calculateMifflinStJeor(gender, weightKg, heightCm, ageYears));
};

// Activity & Exercise Database (Taiwan Localized)
export const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,      // Office job, little exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Heavy exercise 6-7 days/week
    veryActive: 1.9      // Physical job or training 2x/day
};

// METs (Metabolic Equivalent of Task) - Taiwan Common Activities
export const TAIWAN_SPORTS_METS = {
    // Yoga & Light
    yoga: { label: 'yoga', met: 2.5 },
    stretching_mild: { label: 'stretching_mild', met: 2.3 },
    walking_slow: { label: 'walking_slow', met: 3.0 },
    walking_brisk: { label: 'walking_brisk', met: 4.3 },

    // Daily / Commute
    youbike_mod: { label: 'youbike_mod', met: 4.0 },
    youbike_fast: { label: 'youbike_fast', met: 6.8 },

    // Gym / Fitness
    weight_training_traditional: {
        label: 'weight_training_traditional',
        description: 'weight_training_traditional_sub',
        hasIntensity: true,
        minMet: 3.5,
        maxMet: 6.0
    },

    weight_training_hiit: {
        label: 'weight_training_hiit',
        description: 'weight_training_hiit_sub',
        hasIntensity: true,
        minMet: 7.0,
        maxMet: 12.0
    },

    crossfit: {
        label: 'crossfit',
        description: 'weight_training_functional_sub',
        hasIntensity: true,
        minMet: 6.0,
        maxMet: 13.0
    },
    pilates: { label: 'pilates', met: 3.0 },

    // Ball Sports - Basketball
    basketball_3v3: {
        label: 'basketball_3v3',
        hasIntensity: true,
        minMet: 6.0,
        maxMet: 10.5
    },
    basketball_5v5: {
        label: 'basketball_5v5',
        hasIntensity: true,
        minMet: 5.5,
        maxMet: 9.0
    },
    basketball_shoot: { label: 'basketball_shoot', met: 4.5 },

    // Ball Sports - Baseball
    baseball_game: {
        label: 'baseball_game',
        hasIntensity: true,
        minMet: 4.0,
        maxMet: 6.0
    },
    baseball_pitch: {
        label: 'baseball_pitch',
        hasIntensity: true,
        minMet: 4.5,
        maxMet: 7.5
    },
    baseball_field: {
        label: 'baseball_field',
        hasIntensity: true,
        minMet: 3.5,
        maxMet: 6.5
    },
    baseball_bat: { label: 'baseball_bat', met: 5.0 },

    // Racket Sports
    badminton_fun: {
        label: 'badminton_fun',
        hasIntensity: true,
        minMet: 4.0,
        maxMet: 6.0
    },
    badminton_comp: {
        label: 'badminton_comp',
        hasIntensity: true,
        minMet: 6.0,
        maxMet: 9.0
    },
    tennis_general: {
        label: 'tennis_general',
        hasIntensity: true,
        minMet: 5.0,
        maxMet: 8.5
    },
    table_tennis: { label: 'table_tennis', met: 4.0 },

    // Outdoor & Cardio
    hiking: { label: 'hiking', met: 6.5 },
    jogging: {
        label: 'jogging',
        hasIntensity: true,
        minMet: 6.5,
        maxMet: 11.0
    },
    cycling_indoor: {
        label: 'cycling_indoor',
        hasIntensity: true,
        minMet: 5.0,
        maxMet: 10.0
    },
    swimming: {
        label: 'swimming',
        hasIntensity: true,
        minMet: 6.0,
        maxMet: 11.0
    },
    golf_walking: { label: 'golf_walking', met: 4.8 },
    volleyball: {
        label: 'volleyball',
        hasIntensity: true,
        minMet: 3.5,
        maxMet: 8.0
    },
    soccer: {
        label: 'soccer',
        hasIntensity: true,
        minMet: 6.0,
        maxMet: 11.5
    }
};

export const calculateExerciseBurn = (weightKg, metOrSport, durationMinutes, intensity = 5) => {
    let metValue = 0;

    // Check if first arg is an object (sport definition) or a number (direct MET)
    if (typeof metOrSport === 'object') {
        if (metOrSport.hasIntensity && metOrSport.minMet && metOrSport.maxMet) {
            // Linear interpolation: 1 -> minMet, 10 -> maxMet
            const range = metOrSport.maxMet - metOrSport.minMet;
            const progress = (intensity - 1) / 9;
            metValue = metOrSport.minMet + (progress * range);
        } else {
            metValue = metOrSport.met;
        }
    } else {
        metValue = metOrSport; // Legacy or direct number support
    }

    return Math.round((metValue * 3.5 * weightKg / 200) * durationMinutes);
};

export const calculateTDEE = (bmr, activityLevel, exerciseBurn = 0) => {
    // If specific exercise is logged, we use sedentary base to avoid double counting
    // otherwise we use the general activity multiplier
    const multiplier = exerciseBurn > 0 ? 1.2 : (ACTIVITY_MULTIPLIERS[activityLevel] || 1.2);
    const baseTDEE = Math.round(bmr * multiplier);
    return baseTDEE + exerciseBurn;
};

/**
 * Calculates Target Daily Calories based on Goal
 * Includes Strict NaN Safety Defaults
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goal - 'maintain', 'cut', 'bulk'
 * @param {object} params - { currentWeight, currentBodyFat, targetBodyFat, timeWeeks }
 * @returns {object} { calories, dailyDeficit, warning }
 */
export const calculateGoalCalories = (tdee, goal, params = {}) => {
    // Safety Force TDEE to Number
    let safeTDEE = Math.round(Number(tdee));
    if (!safeTDEE || safeTDEE <= 0) {
        safeTDEE = 2000; // Safe Fallback for invalid inputs
    }

    let targetCalories = safeTDEE;
    let warning = null;

    // Ensure parameters are valid numbers to prevent early NaN
    const currentWeight = parseFloat(params.currentWeight) || 0;
    const currentBodyFat = parseFloat(params.currentBodyFat) || 0;
    const targetBodyFat = parseFloat(params.targetBodyFat) || 0;
    const timeWeeks = parseFloat(params.timeWeeks) || 0;
    const targetGainKg = parseFloat(params.targetGainKg) || 0;

    if (goal === 'maintain') {
        targetCalories = safeTDEE;
    }
    else if (goal === 'cut') {
        let calculateDeficit = 0;

        // Strategy 1: Calculate based on Logic if inputs exist
        if (currentBodyFat && targetBodyFat && currentWeight) {
            const lbm = currentWeight * (1 - (currentBodyFat / 100));
            const targetWeight = lbm / (1 - (targetBodyFat / 100));
            const weightLossKg = currentWeight - targetWeight;

            if (weightLossKg > 0 && timeWeeks > 0) {
                const totalDeficit = weightLossKg * 7700;
                calculateDeficit = totalDeficit / (timeWeeks * 7);
            }
        }

        // Strategy 2: Fallback (or if Logic resulted in NaN/0)
        if (!calculateDeficit || isNaN(calculateDeficit) || calculateDeficit <= 0) {
            calculateDeficit = 500; // Default Standard Deficit
        }

        // Safety: Warn if > 1200
        if (calculateDeficit > 1200) {
            warning = "High Deficit Warning: Losing weight this fast requires a dangerous calorie deficit (>1200kcal). Consider increasing the timeframe.";
        }

        // Calculate Target
        targetCalories = safeTDEE - calculateDeficit;

        // BMR Floor Safety
        if (targetCalories < 1200 && safeTDEE > 0) {
            warning = "Very Low Rank Warning: Resulting calories < 1200. This is generally unsafe without medical supervision.";
        }
    }
    else if (goal === 'bulk') {
        let calculatedSurplus = 0;

        // Attempt Calculation
        if (targetGainKg > 0 && timeWeeks > 0) {
            const totalSurplusNeeded = targetGainKg * 7700;
            calculatedSurplus = totalSurplusNeeded / (timeWeeks * 7);
        }

        // Safety Check
        if (!calculatedSurplus || isNaN(calculatedSurplus) || calculatedSurplus <= 0 || !isFinite(calculatedSurplus)) {
            // Default Standard Lean Bulk
            calculatedSurplus = 300;
        }

        if (calculatedSurplus > 500) {
            warning = "high_surplus";
        }

        // Calculate Target
        targetCalories = safeTDEE + calculatedSurplus;
    }

    // --- REVERSE CALCULATION (Fix for NaN Display) ---
    // Ensure we always return consistent data derived from the final numbers
    const finalCalories = Math.round(targetCalories);
    const dailyDiff = finalCalories - safeTDEE;

    return {
        calories: finalCalories,
        dailyDiff: dailyDiff, // This will now ALWAYS be (Target - TDEE)
        warning: warning
    };
};

/**
 * Calculates Daily Training Load based on duration & intensity
 * @param {Array} exercises - Array of goal exercise objects
 * @returns {string} - 'rest', 'light', 'moderate', 'high'
 */
export const calculateDailyLoad = (exercises = []) => {
    if (!exercises || exercises.length === 0) return 'rest';

    // Calculate total duration
    const totalDuration = exercises.reduce((sum, ex) => sum + (parseFloat(ex.duration) || 0), 0);
    if (totalDuration === 0) return 'rest';

    // Check for "Rest" only activities (e.g. just stretching/walking)
    const restTypes = ['yoga', 'stretching_mild', 'walking_slow'];
    const isOnlyRest = exercises.every(ex => restTypes.includes(ex.type));
    if (isOnlyRest) return 'rest';

    // Check for High Intensity Interval (HIIT/CrossFit/Tabata) > 60 mins
    const hiitTypes = ['weight_training_hiit', 'hiit_cardio', 'crossfit'];
    const hiitDuration = exercises.reduce((sum, ex) => {
        if (hiitTypes.includes(ex.type)) return sum + (parseFloat(ex.duration) || 0);
        return sum;
    }, 0);

    // Logic Tree (Strict)
    // High: > 90 mins OR HIIT > 60 mins
    if (totalDuration > 90 || hiitDuration > 60) return 'high';

    // Moderate: 45 - 90 mins
    if (totalDuration >= 45) return 'moderate';

    // Light: < 45 mins
    return 'light';
};

/**
 * Calculates Goal-Specific Macros based on ISSN/ACSM Matrix
 * @param {number} calories - Target Daily Calories
 * @param {string} goal - 'cut', 'bulk', 'maintain'
 * @param {string} athleteProfile - 'enthusiast', 'strength_power', 'mixed_team', 'endurance', 'physique'
 * @param {number} weightKg - Current weight
 * @param {Array} exercises - Exercise list for load calculation
 * @returns {object} { protein, fats, carbs, ratios, dailyLoad }
 */
export const calculateGoalMacros = (calories, goal, athleteProfile = 'enthusiast', weightKg, exercises = []) => {
    // Ensure inputs are valid numbers
    const safeCalories = Math.round(Number(calories)) || 2000;
    const safeWeight = parseFloat(weightKg) || 70;

    // 1. Determine Daily Load
    const load = calculateDailyLoad(exercises);

    // 2. Set Grams per Kg based on Profile & Logic (ISSN/ACSM)
    let p_g = 1.5; // Default Protein g/kg
    let c_g = 3.5; // Default Carb g/kg

    switch (athleteProfile) {
        case 'enthusiast': // Type A: Sports Enthusiast
            // Goal: Health consistency
            p_g = 1.5;
            c_g = 3.5; // Fixed
            break;

        case 'strength_power': // Type B: Strength/Power
            // Ref: ISSN 2018
            // Protein: Cut=2.4, Maintain/Bulk=2.0
            p_g = (goal === 'cut') ? 2.4 : 2.0;

            // Carbs: Rest: 3.0 | Mod: 4.5 | High: 5.5
            // (Assuming Light falls into Moderate bucket or interpolated)
            if (load === 'rest') c_g = 3.0;
            else if (load === 'high') c_g = 5.5;
            else c_g = 4.5; // Moderate/Light
            break;

        case 'mixed_team': // Type C: Mixed/Team Sports
            // Ref: ACSM "Stop-and-Go"
            // Protein: 1.7
            p_g = 1.7;

            // Carbs: Rest: 2.5 | Light: 4.0 | Mod: 6.0 | High: 8.0
            if (load === 'rest') c_g = 2.5;
            else if (load === 'light') c_g = 4.0;
            else if (load === 'moderate') c_g = 6.0;
            else c_g = 8.0; // High
            break;

        case 'endurance': // Type D: Endurance
            // Ref: ACSM 2016
            // Protein: 1.4
            p_g = 1.4;

            // Carbs: Rest: 5.0 | Mod: 7.0 | High: 10.0
            // (Mapping Light to 6.0 as intermediate)
            if (load === 'rest') c_g = 5.0;
            else if (load === 'light') c_g = 6.0;
            else if (load === 'moderate') c_g = 7.0;
            else c_g = 10.0; // High
            break;

        case 'physique': // Type E: Physique/Aesthetic
            // Ref: ISSN Hypocaloric
            // Protein: 2.3
            p_g = 2.3;

            // Carbs: Rest: 2.0 | Training: 4.0
            if (load === 'rest') c_g = 2.0;
            else c_g = 4.0; // Any Training (Light/Mod/High)
            break;

        default:
            // Fallback (Should be Enthusiast)
            p_g = 1.5;
            c_g = 3.5;
            break;
    }

    // 3. Step A: Calculate Protein Grams & Cals
    let proteinGrams = Math.round(p_g * safeWeight);
    const proteinCals = proteinGrams * 4;

    // 4. Step B: Calculate Carb Grams & Cals
    let carbGrams = Math.round(c_g * safeWeight);
    let carbCals = carbGrams * 4;

    // 5. Step C: Fats as Remainder (The Balancer)
    let fatCals = safeCalories - proteinCals - carbCals;
    // Initial floor check (must be non-negative)
    let fatGrams = Math.max(0, Math.round(fatCals / 9));

    // 6. CRITICAL SAFETY CONSTRAINT (Fat Floor)
    // IF Fat_Grams < (Weight * 0.6), Force Fat = 0.6 * Weight, Reduce Carbs
    // Hormonal health check
    const minFatGrams = Math.round(0.6 * safeWeight);

    if (fatGrams < minFatGrams) {
        fatGrams = minFatGrams;
        fatCals = fatGrams * 9;

        // Recalculate Carbs with remaining calories
        // Total - Protein - FixedFat
        const remainingForCarbs = safeCalories - proteinCals - fatCals;
        carbGrams = Math.max(0, Math.round(remainingForCarbs / 4));
        carbCals = carbGrams * 4;
    }

    return {
        protein: proteinGrams,
        fats: fatGrams,
        carbs: carbGrams,
        ratios: {
            p: safeCalories > 0 ? Math.round((proteinCals / safeCalories) * 100) : 0,
            f: safeCalories > 0 ? Math.round((fatCals / safeCalories) * 100) : 0,
            c: safeCalories > 0 ? Math.round((carbCals / safeCalories) * 100) : 0
        },
        dailyLoad: load,
        gramsPerKg: { p: p_g, c: c_g }
    };
};

/**
 * Calculates Micronutrient Targets based on Gender & Daily Load
 * Ref: NIH / ISSN / AIS Guidelines
 * @param {string} gender - 'male' | 'female'
 * @param {string} dailyLoad - 'rest' | 'light' | 'moderate' | 'high'
 * @returns {object} { magnesium, zinc, iron, vitaminD, calcium, bComplex }
 */
export const calculateMicros = (gender, dailyLoad) => {
    const isMale = gender === 'male';
    const isHighLoad = dailyLoad === 'high' || dailyLoad === 'moderate'; // Assumption for increased needs

    return {
        magnesium: {
            val: (isMale ? 420 : 320) * (isHighLoad ? 1.1 : 1.0), // +10% for active sweating
            unit: 'mg'
        },
        zinc: {
            val: isMale ? 11 : 8,
            unit: 'mg'
        },
        iron: {
            val: isMale ? 8 : 18,
            unit: 'mg'
        },
        vitaminD: {
            val: '600 - 2000', // Range
            unit: 'IU'
        },
        calcium: {
            val: 1000,
            unit: 'mg'
        },
        bComplex: {
            val: 'B6/B12',
            unit: 'Complex'
        }
    };
};
