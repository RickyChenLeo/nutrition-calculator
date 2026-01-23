import { describe, it, expect } from 'vitest';
import { calculateGoalCalories, calculateGoalMacros, calculateExerciseBurn, calculateMicros } from './calculator';

describe('Calculator Logic - The Gold Standard', () => {

    // Scenario A: Mixed Sports (Basketball) - High Intensity
    it('Scenario A: Mixed Sports (Basketball) - High Intensity', () => {
        const input = {
            weight: 80, // kg
            gender: 'male',
            goal: 'maintain',
            profile: 'mixed_team',
            exercises: [
                { type: 'basketball_5v5', duration: 95 } // > 90 mins -> High
            ]
        };

        // 1. Calculate Calories (Need TDEE first, but macros depend on target calories)
        // For unit testing macros, we can pass a dummy calorie amount if the logic is isolated, 
        // OR we should calculate flow appropriately. 
        // The prompt specifically asks to check "gramsPerKg".
        // calculateGoalMacros(calories, goal, athleteProfile, weightKg, exercises)

        const result = calculateGoalMacros(3000, input.goal, input.profile, input.weight, input.exercises);

        expect(result.gramsPerKg.c).toBe(8.0);
        expect(result.gramsPerKg.p).toBe(1.7);
    });

    // Scenario B: Strength Athlete - Cutting Phase
    it('Scenario B: Strength Athlete - Cutting Phase', () => {
        const input = {
            weight: 90,
            gender: 'male',
            goal: 'cut',
            profile: 'strength_power',
            exercises: [
                { type: 'weight_training_traditional', duration: 60 }
            ]
        };

        const result = calculateGoalMacros(2500, input.goal, input.profile, input.weight, input.exercises);

        // Expected: Protein 2.4 g/kg (High protein for retention in deficit)
        expect(result.gramsPerKg.p).toBe(2.4);
    });

    // Scenario C: Endurance Athlete - Race Day Prep
    it('Scenario C: Endurance Athlete - Race Day Prep', () => {
        const input = {
            weight: 60,
            gender: 'female',
            goal: 'maintain', // Assuming maintenance for race prep/loading
            profile: 'endurance',
            exercises: [
                { type: 'jogging', duration: 125 } // > 120 mins
            ]
        };

        const result = calculateGoalMacros(2000, input.goal, input.profile, input.weight, input.exercises);

        // Expected: Carbs should be 10.0 g/kg (ACSM Glycogen Loading)
        expect(result.gramsPerKg.c).toBe(10.0);
    });

    // Scenario D: Safety Floor Check (The Hormonal Guard)
    it('Scenario D: Safety Floor Check (The Hormonal Guard)', () => {
        // Input: User with extremely high activity but low calorie target.
        // We force a low calorie input relative to weight to trigger the floor.
        const weight = 80;
        const lowCalories = 1500; // Very low for 80kg

        const result = calculateGoalMacros(lowCalories, 'cut', 'enthusiast', weight, []);

        // Expected Logic: Fat must NEVER drop below 0.6 g/kg.
        const minFatGrams = weight * 0.6;
        expect(result.fats).toBeGreaterThanOrEqual(minFatGrams);
    });

    // Scenario E: The "NaN" Killer
    it('Scenario E: The "NaN" Killer', () => {
        // Input: Missing weight, missing height, missing age (Empty/Undefined inputs).

        // Helper function params: tdee, goal, params
        const goalResult = calculateGoalCalories(undefined, 'cut', {});

        expect(goalResult.calories).not.toBeNaN();
        expect(goalResult.calories).toBeGreaterThan(0); // Should have a fallback

        // Check Macros as well
        const macroResult = calculateGoalMacros(undefined, undefined, undefined, undefined, undefined);
        expect(macroResult.protein).not.toBeNaN();
        expect(macroResult.fats).not.toBeNaN();
        expect(macroResult.carbs).not.toBeNaN();
    });

    // Scenario F: Micronutrient Optimization
    it('Scenario F: Micronutrient Optimization - B6 & Vit D', () => {
        // 1. High Protein diet -> Should have higher B6
        // Protein = 200g
        const highProteinMicros = calculateMicros('male', 'moderate', 200);
        // 200 * 0.02 = 4.0mg
        expect(highProteinMicros.vitaminB6.val).toBe(4.0);

        // 2. Low Protein -> Should default to 1.3mg baseline
        // 40 * 0.02 = 0.8 -> Should be floored at 1.3
        const lowProteinMicros = calculateMicros('female', 'light', 40);
        expect(lowProteinMicros.vitaminB6.val).toBe(1.3);

        // 3. High Load -> Higher Vit D
        const highLoadD = calculateMicros('male', 'high', 150);
        expect(highLoadD.vitaminD.val).toContain('1000 - 2000');

        // 4. Low Load -> Standard Vit D
        const lowLoadD = calculateMicros('female', 'light', 100);
        expect(lowLoadD.vitaminD.val).toContain('600 - 1000');
    });

});
