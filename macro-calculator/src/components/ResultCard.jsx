import React from 'react';

const InfoRow = ({ label, value, subtext, highlight = false, sign = null }) => (
    <div className={`flex justify-between items-center py-3 border-b border-gray-100 last:border-0 ${highlight ? 'bg-green-50/50 -mx-5 px-5' : ''}`}>
        <div>
            <span className={`font-medium ${highlight ? 'text-apple-green' : 'text-gray-500'}`}>{label}</span>
            {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
        </div>
        <div className="text-right">
            <span className={`font-bold font-mono tracking-tight block ${highlight ? 'text-apple-green' : 'text-gray-900'}`}>
                {sign && <span className="text-gray-400 mr-1">{sign}</span>}
                {value}
            </span>
        </div>
    </div>
);

const SectionHeader = ({ title }) => (
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
        {title}
    </h3>
);

const MacroCard = ({ label, grams, calories, color }) => (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center flex-1">
        <span className={`text-xs font-bold uppercase tracking-wider mb-2 ${color}`}>{label}</span>
        <span className="text-2xl font-bold text-gray-900 mb-0.5">{grams}g</span>
        <span className="text-xs text-gray-400 font-medium">{calories} kcal</span>
    </div>
);

export default function ResultCard({ results, onReset, t }) {
    const { bmr, tdee, macros, exerciseBurn, exerciseLabelKey, range, goal, goalCalories, dailyDiff, warning } = results;

    const copyToClipboard = () => {
        const text = `${t.dailyTarget}: ${goalCalories} kcal\n${t.protein}: ${macros.protein}g\n${t.fats}: ${macros.fats}g\n${t.carbs}: ${macros.carbs}g\n(${t[goal ? `goal_${goal}` : 'goal_maintain']})`;
        navigator.clipboard.writeText(text);
        alert(t.copied);
    };

    return (
        <div className="animate-fade-in space-y-8">
            {/* HER0: Main Target Display */}
            <div className="text-center">
                <p className="text-gray-400 font-medium mb-2 uppercase tracking-wide text-xs">
                    {t.dailyTarget} ({t[goal ? `goal_${goal}` : 'goal_maintain']})
                </p>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-gray-900 tracking-tighter mb-2">
                        {goalCalories}
                        <span className="text-2xl text-gray-400 font-medium ml-2">kcal</span>
                    </span>
                    {range && (
                        <span className="inline-block bg-green-50 text-apple-green text-xs font-bold px-3 py-1 rounded-full border border-green-100">
                            {t.range}: {range.min} - {range.max} kcal
                        </span>
                    )}
                </div>
            </div>

            {/* Safety Warning */}
            {warning && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                    <div className="text-red-500 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-red-700 mb-1">{t.warning}</h4>
                        <p className="text-xs text-red-600 leading-relaxed opacity-90">
                            {/* Check if warning key exists in translations (e.g. 'warning_high_surplus'), else show raw text */}
                            {t[`warning_${warning}`] || t[warning] || warning}
                        </p>
                    </div>
                </div>
            )}

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-3">
                <MacroCard label={t.protein} grams={macros.protein} calories={macros.protein * 4} color="text-blue-500" />
                <MacroCard label={t.fats} grams={macros.fats} calories={macros.fats * 9} color="text-yellow-500" />
                <MacroCard label={t.carbs} grams={macros.carbs} calories={macros.carbs * 4} color="text-pink-500" />
            </div>

            {/* Methodology Section */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm md:text-xs">
                <h4 className="font-bold text-gray-400 uppercase tracking-wide mb-2">
                    {t.methodology_title}
                </h4>
                <p className="text-gray-600 mb-1 leading-relaxed">
                    {t.methodology_text
                        .replace('{diet}', t[`profile_${results.athleteProfile}`] || results.athleteProfile)
                        .replace('{p}', macros.ratios.p)
                        .replace('{f}', macros.ratios.f)
                        .replace('{c}', macros.ratios.c)
                    }
                </p>
                <p className="text-gray-400 italic">
                    {t.methodology_tip.replace('{goal}', t[`goal_${results.goal}`] || results.goal)}
                </p>
            </div>

            {/* Micros Grid (New) */}
            <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
                <SectionHeader title={t.micros_title || "重點微量營養素建議"} />

                {results.micros && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-bold uppercase">{t.micro_vitaminD || "Vitamin D"}</p>
                            <p className="text-lg font-black text-gray-900">{results.micros?.vitaminD?.val} <span className="text-xs font-medium text-gray-400">{results.micros?.vitaminD?.unit}</span></p>
                        </div>
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-bold uppercase">{t.micro_magnesium || "Magnesium"}</p>
                            <p className="text-lg font-black text-gray-900">{Math.round(results.micros?.magnesium?.val || 0)} <span className="text-xs font-medium text-gray-400">{results.micros?.magnesium?.unit}</span></p>
                        </div>
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-bold uppercase">{t.micro_zinc || "Zinc"}</p>
                            <p className="text-lg font-black text-gray-900">{results.micros?.zinc?.val} <span className="text-xs font-medium text-gray-400">{results.micros?.zinc?.unit}</span></p>
                        </div>
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-bold uppercase">{t.micro_iron || "Iron"}</p>
                            <p className="text-lg font-black text-gray-900">{results.micros?.iron?.val} <span className="text-xs font-medium text-gray-400">{results.micros?.iron?.unit}</span></p>
                        </div>
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-bold uppercase">{t.micro_calcium || "Calcium"}</p>
                            <p className="text-lg font-black text-gray-900">{results.micros?.calcium?.val} <span className="text-xs font-medium text-gray-400">{results.micros?.calcium?.unit}</span></p>
                        </div>
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                            <p className="text-xs text-gray-500 font-bold uppercase">{t.micro_bComplex || "B-Complex"}</p>
                            <p className="text-lg font-black text-gray-900">{results.micros?.bComplex?.val}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-xs">⚠️</span>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        {t.micros_disclaimer || "數值參考 NIH/ISSN 建議，僅供飲食規劃參考，非醫療處方。"}
                    </p>
                </div>
            </div>

            {/* SECTION 1: Target Calculation Logic */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <SectionHeader title={t.targetCalculation} />

                <InfoRow
                    label={t.maintenanceCals}
                    value={`${tdee} kcal`}
                    subtext={t.totalTDEE}
                />

                {dailyDiff !== 0 && (
                    <InfoRow
                        label={dailyDiff < 0 ? t.dailyDeficit : t.dailySurplus}
                        value={`${Math.abs(dailyDiff)} kcal`} // Keep value absolute, sign is explicit in 'sign' prop
                        sign={dailyDiff < 0 ? '-' : '+'}
                        subtext={goal === 'cut' ? t.goal_cut : t.goal_bulk}
                        highlight={true}
                    />
                )}
                {dailyDiff === 0 && (
                    <div className="py-2 text-center text-xs text-gray-400 italic">
                        {t.goal_maintain}
                    </div>
                )}

                <div className="border-t border-gray-100 mt-2"></div>
                <div className="flex justify-between items-center py-3">
                    <span className="font-bold text-gray-900">{t.dailyTarget}</span>
                    <span className="font-black text-xl text-gray-900">{goalCalories} kcal</span>
                </div>
            </div>

            {/* SECTION 2: TDEE Breakdown */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <SectionHeader title={t.tdeeBreakdown} />

                <InfoRow
                    label={t.bmr}
                    value={`${bmr} kcal`}
                    subtext={t.bmr_sub}
                />

                {exerciseBurn > 0 ? (
                    <>
                        <InfoRow
                            label={t.baseActivity}
                            value={`${Math.round(tdee - exerciseBurn - bmr)} kcal`}
                            sign="+"
                            subtext={t.baseActivity_sub}
                        />

                        {/* Detailed Exercise Breakdown */}
                        {results.exerciseDetails && results.exerciseDetails.length > 0 ? (
                            results.exerciseDetails.map((ex, i) => (
                                <InfoRow
                                    key={i}
                                    label={ex.name}
                                    value={`${ex.calories} kcal`}
                                    sign="+"
                                    subtext={t.exercise}
                                />
                            ))
                        ) : (
                            /* Fallback for legacy or unknown */
                            <InfoRow
                                label={t.exercise}
                                value={`${exerciseBurn} kcal`}
                                sign="+"
                                subtext={t.exercise_sub}
                            />
                        )}

                        <div className="border-t border-gray-200 my-2 opacity-50"></div>

                        <div className="flex justify-between items-center py-2 px-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{t.totalExerciseBurn}</span>
                            <span className="font-bold text-gray-700">+{exerciseBurn} kcal</span>
                        </div>
                    </>
                ) : (
                    <InfoRow
                        label={t.dailyActivity_plain}
                        value={`${tdee - bmr} kcal`}
                        sign="+"
                        subtext={t.dailyActivity_plain_sub}
                    />
                )}

                <div className="border-t border-gray-200 mt-2"></div>
                <div className="flex justify-between items-center py-3">
                    <span className="font-bold text-gray-500 text-sm">{t.totalTDEE}</span>
                    <span className="font-bold text-gray-700">{tdee} kcal</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onReset}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition-all"
                >
                    {t.recalculate}
                </button>
                <button
                    onClick={copyToClipboard}
                    className="w-full bg-apple-green hover:bg-opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/20 transition-all"
                >
                    {t.copyResult}
                </button>
            </div>
        </div>
    );
}
