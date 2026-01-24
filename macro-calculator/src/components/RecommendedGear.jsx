import React from 'react';

// --- Affiliate Configuration (管理推廣連結) ---
const affiliateConfig = {
    protein: {
        text: "Build Muscle Stack",
        description: "Whey Protein Isolate + Creatine (Myprotein)",
        url: "#", // 待審核通過後替換
        color: "#00A4E4",
        img: "💪",
        cta: "Check Price"
    },
    endurance: {
        text: "Long Distance Essentials",
        description: "Energy Gels + Electrolytes",
        url: "#",
        color: "#364151",
        img: "👟",
        cta: "Check Price"
    },
    fatBurner: {
        text: "Fat Loss Support",
        description: "Omega-3 + L-Carnitine",
        url: "#",
        color: "#EE4D2D",
        img: "🔥",
        cta: "Check Price"
    },
    general: {
        text: "Essential Nutrition Stack",
        description: "Whey Protein + Multivitamin",
        url: "#",
        color: "#4ade80",
        img: "🥤",
        cta: "Check Price"
    }
};

export default function RecommendedGear({ athleteProfile, goal, t = {} }) {
    // Default Fallback
    let recommendationKey = 'general';

    // Logic for Specific Profiles matching Config Keys
    if (athleteProfile === 'strength_power' || athleteProfile === 'enthusiast' || goal === 'bulk') {
        recommendationKey = 'protein';
    } else if (athleteProfile === 'endurance' || athleteProfile === 'mixed_team') {
        recommendationKey = 'endurance';
    } else if (goal === 'cut') {
        recommendationKey = 'fatBurner';
    }

    const rec = affiliateConfig[recommendationKey];

    return (
        <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Recommended Gear & Supplements
            </h4>

            <a
                href={rec.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative bg-white border border-gray-200 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:border-apple-green/30 transition-all duration-300 cursor-pointer text-left"
            >
                <div className="flex items-center gap-4">
                    {/* Placeholder Image Area */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-xl flex items-center justify-center text-3xl md:text-4xl shadow-sm group-hover:scale-105 transition-transform">
                        {rec.img}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h5 className="text-base md:text-lg font-bold text-gray-900 truncate group-hover:text-apple-green transition-colors">
                            {rec.text}
                        </h5>
                        <p className="text-sm text-gray-500 line-clamp-2">
                            {rec.description}
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <span className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg group-hover:bg-apple-green transition-colors">
                            {rec.cta}
                        </span>
                    </div>
                </div>

                {/* Mobile CTA (Full Width) */}
                <div className="mt-4 md:hidden">
                    <span className="flex items-center justify-center w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg group-hover:bg-apple-green transition-colors">
                        {rec.cta}
                    </span>
                </div>

                {/* Affiliate Disclosure Badge */}
                <div className="absolute top-2 right-2 text-[10px] text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                    Ad
                </div>
            </a>
        </div>
    );
}
