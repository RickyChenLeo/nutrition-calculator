import React, { useState } from 'react';
import { TAIWAN_SPORTS_METS } from '../utils/calculator';
import SearchableSelect from './SearchableSelect';

const InputField = ({ label, name, type = "number", value, onChange, placeholder, suffix, optional = false }) => (
    <div className="flex flex-col min-w-0">
        {label && (
            <label className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mb-1.5 ml-1 whitespace-normal h-8 flex items-end pb-1 font-medium leading-tight">
                {label}
                {optional && <span className="text-gray-400 normal-case ml-1">(Optional)</span>}
            </label>
        )}
        <div className="relative w-full">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-apple-green focus:border-transparent transition-all placeholder:text-gray-400 min-w-0"
            />
            {suffix && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                    {suffix}
                </span>
            )}
        </div>
    </div>
);

const RadioGroup = ({ label, name, options, value, onChange }) => (
    <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
            {label}
        </label>
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange({ target: { name, value: option.value } })}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${value === option.value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
);

export default function CalculatorForm({ values, onChange, onSubmit, onExerciseChange, onAddExercise, onRemoveExercise, t }) {
    // Transform sports map to array for Select options
    // Transform sports map to array for Select options
    const sportOptions = Object.entries(TAIWAN_SPORTS_METS).map(([key, sport]) => ({
        value: key,
        label: t[sport.label] || sport.label,
        description: sport.description ? (t[sport.description] || sport.description) : null
    }));

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <RadioGroup
                label={t.gender}
                name="gender"
                value={values.gender}
                onChange={onChange}
                options={[
                    { label: t.male, value: 'male' },
                    { label: t.female, value: 'female' },
                ]}
            />

            <div className="grid grid-cols-2 gap-2 md:gap-4">
                <InputField
                    label={t.age}
                    name="age"
                    value={values.age}
                    onChange={onChange}
                    placeholder="25"
                    suffix={t.years}
                />
                <InputField
                    label={t.bodyFat}
                    name="bodyFat"
                    value={values.bodyFat}
                    onChange={onChange}
                    placeholder="15"
                    suffix="%"
                    optional={t.optional}
                />
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-4">
                <InputField
                    label={t.weight}
                    name="weight"
                    value={values.weight}
                    onChange={onChange}
                    placeholder="70"
                    suffix="kg"
                />
                <InputField
                    label={t.height}
                    name="height"
                    value={values.height}
                    onChange={onChange}
                    placeholder="175"
                    suffix="cm"
                />
            </div>

            {/* Exercise Tracking Section - MULTI */}
            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {t.specificActivity}
                    </label>
                </div>

                {/* List of Exercises */}
                <div className="space-y-4 mb-4">
                    {values.exercises.map((ex, index) => {
                        const sportDef = TAIWAN_SPORTS_METS[ex.type];
                        return (
                            <div key={ex.id} className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-sm animate-in fade-in slide-in-from-top-1">
                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => onRemoveExercise(ex.id)}
                                    className="absolute -top-2 -right-2 bg-gray-200 hover:bg-red-100 hover:text-red-500 text-gray-500 rounded-full p-1 transition-colors"
                                    title={t.removeExercise}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                <div className="mb-3">
                                    <SearchableSelect
                                        options={sportOptions.filter(opt =>
                                            // Smart Filter: Show if it's the CURRENT value of this row, OR if it's NOT selected in any other row
                                            opt.value === ex.type || !values.exercises.some(otherEx => otherEx.type === opt.value)
                                        )}
                                        value={ex.type}
                                        onChange={(val) => onExerciseChange(index, 'type', val)}
                                        placeholder={t.searchPlaceholder}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 items-end">
                                    <InputField
                                        name={`duration_${index}`}
                                        value={ex.duration}
                                        onChange={(e) => onExerciseChange(index, 'duration', e.target.value)}
                                        placeholder="60"
                                        suffix={t.mins}
                                    />

                                    {sportDef?.hasIntensity ? (
                                        <div className="flex flex-col pb-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-[10px] uppercase font-bold text-gray-400">{t.intensity}</label>
                                                <span className="text-xs font-bold text-apple-green">{ex.intensity}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                step="1"
                                                value={ex.intensity}
                                                onChange={(e) => onExerciseChange(index, 'intensity', parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-apple-green"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-10"></div> // Spacer
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add Button */}
                <button
                    type="button"
                    onClick={onAddExercise}
                    className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl hover:border-apple-green hover:text-apple-green hover:bg-green-50 transition-all font-medium text-sm flex items-center justify-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    {t.addExercise}
                </button>

                {/* Non-Exercise fallback only if list is empty */}
                {values.exercises.length === 0 && (
                    <div className="mt-4 animate-in fade-in">
                        <div className="flex flex-col">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
                                {t.dailyActivity}
                            </label>
                            <select
                                name="activity"
                                value={values.activity}
                                onChange={onChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-apple-green focus:border-transparent transition-all appearance-none"
                            >
                                <option value="sedentary">{t.sedentary}</option>
                                <option value="light">{t.light}</option>
                                <option value="moderate">{t.moderate}</option>
                                <option value="active">{t.active}</option>
                                <option value="veryActive">{t.veryActive}</option>
                            </select>
                        </div>
                    </div>
                )}

                {values.exercises.length > 0 && (
                    <p className="mt-2 text-xs text-apple-green font-medium px-1 text-center">
                        {t.note_exercise}
                    </p>
                )}
            </div>

            {/* Goal Selection Section */}
            <div className="border-t border-gray-100 pt-6">

                {/* Athlete Profile Strategy */}
                <div className="mb-6">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
                        {t.athleteProfile}
                    </label>
                    <div className="text-xs text-gray-400 mb-2 ml-1">
                        Select your training style to optimize macro ratios.
                    </div>
                    <select
                        name="athleteProfile"
                        value={values.athleteProfile}
                        onChange={onChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-apple-green focus:border-transparent transition-all appearance-none"
                    >
                        <option value="enthusiast">運動愛好者</option>
                        <option value="strength_power">力量型</option>
                        <option value="mixed_team">混合型</option>
                        <option value="endurance">耐力型</option>
                        <option value="physique">體態雕塑</option>
                    </select>
                </div>

                <RadioGroup
                    label={t.selectGoal}
                    name="goal"
                    value={values.goal}
                    onChange={onChange}
                    options={[
                        { label: t.goal_maintain, value: 'maintain' },
                        { label: t.goal_cut, value: 'cut' },
                        { label: t.goal_bulk, value: 'bulk' },
                    ]}
                />

                {/* Conditional Inputs for Fat Loss (Cut) */}
                {values.goal === 'cut' && (
                    <div className="grid grid-cols-2 gap-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="col-span-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                            To calculate your personalized plan, we need a bit more detail.
                        </div>
                        <InputField
                            label={values.bulkTargetType === 'ffmi' ? t.bodyFat_required : t.bodyFat}
                            name="targetBodyFat"
                            value={values.targetBodyFat}
                            onChange={onChange}
                            placeholder="12"
                            suffix="%"
                        />
                        <InputField
                            label={t.targetTime}
                            name="targetTimeWeeks"
                            value={values.targetTimeWeeks}
                            onChange={onChange}
                            placeholder="12"
                            suffix={t.weeks}
                        />
                    </div>
                )}
                {values.goal === 'bulk' && (() => {
                    // --- Real-time Calculation Logic for Hint ---
                    const weight = parseFloat(values.weight);
                    const heightM = parseFloat(values.height) / 100;
                    const bodyFat = parseFloat(values.bodyFat);
                    const weeks = parseFloat(values.targetTimeWeeks);

                    let hint = null;
                    let warning = null;
                    let currentFFMI = 0;

                    let canCalculate = weight > 0 && heightM > 0 && !isNaN(bodyFat);

                    if (canCalculate) {
                        const leanMass = weight * (1 - bodyFat / 100);
                        currentFFMI = leanMass / (heightM * heightM);


                        let gainNeeded = 0;
                        let projectedFFMI = 0;

                        if (values.bulkTargetType === 'weight') {
                            gainNeeded = parseFloat(values.targetGainKg) || 0;
                            // Assume 100% Lean Mass gain for projection (Optimistic)
                            const newLeanMass = leanMass + gainNeeded;
                            projectedFFMI = newLeanMass / (heightM * heightM);
                        } else {
                            const targetFFMI = parseFloat(values.targetFFMI) || currentFFMI;
                            const reqLeanMass = targetFFMI * (heightM * heightM);
                            gainNeeded = reqLeanMass - leanMass;
                            projectedFFMI = targetFFMI;
                        }

                        let label = t.ffmi_label_untrained;
                        if (projectedFFMI > 25) label = t.ffmi_label_limit;
                        else if (projectedFFMI > 22) label = t.ffmi_label_elite;
                        else if (projectedFFMI > 19) label = t.ffmi_label_trained;
                    }

                    return (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">


                            {/* Bulk Target Type Selector */}
                            <RadioGroup
                                label={t.bulkTargetType}
                                name="bulkTargetType"
                                value={values.bulkTargetType}
                                onChange={onChange}
                                options={[
                                    { label: t.target_weight, value: 'weight' },
                                    { label: t.target_ffmi, value: 'ffmi' },
                                ]}
                            />

                            {/* Dynamic Inputs */}
                            <div className="grid grid-cols-2 gap-2 md:gap-4 mt-4">
                                {values.bulkTargetType === 'weight' ? (
                                    <InputField
                                        label={t.targetGain}
                                        name="targetGainKg"
                                        value={values.targetGainKg}
                                        onChange={onChange}
                                        placeholder="2"
                                        suffix="kg"
                                    />
                                ) : (
                                    <div className="flex flex-col min-w-0">
                                        <InputField
                                            label={t.target_ffmi_input}
                                            name="targetFFMI"
                                            value={values.targetFFMI}
                                            onChange={onChange}
                                            placeholder="22"
                                            suffix="FFMI"
                                        />
                                        {values.targetFFMI && currentFFMI > 0 && Number(values.targetFFMI) <= Number(currentFFMI) && (
                                            <div className="text-red-500 text-xs font-bold mt-1.5 animate-in fade-in bg-red-50 p-2 rounded-lg border border-red-100">
                                                ⚠️ {(t.warning_ffmi_low || "Invalid: Current FFMI is {current}").replace('{current}', currentFFMI.toFixed(1))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <InputField
                                    label={t.targetTime}
                                    name="targetTimeWeeks"
                                    value={values.targetTimeWeeks}
                                    onChange={onChange}
                                    placeholder="12"
                                    suffix={t.weeks}
                                />
                            </div>

                            {/* Hint & Warning Box Removed */}
                            {(!canCalculate) && (
                                <div className="mt-3 p-3 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 text-xs leading-relaxed transition-all">
                                    <div className="font-bold mb-1">
                                        * {t.bodyFat || "Body Fat"} is required for accurate FFMI calculation.
                                    </div>
                                </div>
                            )}

                            {/* FFMI Reference Table (Collapsible) */}
                            {values.bulkTargetType === 'ffmi' && (
                                <div className="mt-3">
                                    <details className="group">
                                        <summary className="flex items-center gap-2 text-xs font-medium text-gray-400 cursor-pointer list-none hover:text-apple-green transition-colors">
                                            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                            {t.ffmi_reference_title}
                                        </summary>
                                        <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg space-y-1 pl-4 border-l-2 border-apple-green">
                                            <p>{t.ffmi_ref_low}</p>
                                            <p>{t.ffmi_ref_avg}</p>
                                            <p className="font-bold text-apple-green">{t.ffmi_ref_trained}</p>
                                            <p className="font-bold text-apple-green">{t.ffmi_ref_athlete}</p>
                                            <p className="text-purple-600 font-bold">{t.ffmi_ref_superior}</p>
                                            <p className="text-red-500">{t.ffmi_ref_enhanced}</p>
                                        </div>
                                    </details>
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* Sticky Action Bar for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 md:static md:bg-transparent md:border-0 md:p-0 z-30">
                <button
                    type="submit"
                    className="w-full h-14 md:h-auto bg-apple-green hover:bg-opacity-90 active:scale-[0.98] text-white font-bold text-lg md:text-base py-3 rounded-2xl md:rounded-xl shadow-lg shadow-green-500/30 md:shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                >
                    {t.calculate}
                </button>
            </div>
        </form>
    );
}
