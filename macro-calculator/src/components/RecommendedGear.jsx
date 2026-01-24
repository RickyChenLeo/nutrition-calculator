import React from 'react';

export default function RecommendedGear({ athleteProfile, goal, t = {} }) {
    // Default Fallback
    let recommendation = {
        title: "Essential Nutrition Stack",
        description: "Whey Protein + Multivitamin",
        img: "🥤",  // Placeholder Icon
        link: "#",
        cta: "Check Price"
    };

    // Logic for Specific Profiles
    if (athleteProfile === 'strength_power' || athleteProfile === 'enthusiast' || goal === 'bulk') {
        recommendation = {
            title: "Build Muscle Stack",
            description: "Whey Protein Isolate + Creatine (Myprotein)",
            img: "💪", // Placeholder Icon
            link: "#",
            cta: "Check Price"
        };
    } else if (athleteProfile === 'endurance' || athleteProfile === 'mixed_team') {
        recommendation = {
            title: "Long Distance Essentials",
            description: "Energy Gels + Electrolytes",
            img: "👟", // Placeholder Icon
            link: "#",
            cta: "Check Price"
        };
    } else if (goal === 'cut') {
        recommendation = {
            title: "Fat Loss Support",
            description: "Omega-3 + L-Carnitine",
            img: "🔥", // Placeholder Icon
            link: "#",
            cta: "Check Price"
        };
    }

    return (
        <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Recommended Gear & Supplements
            </h4>

            <div className="group relative bg-white border border-gray-200 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:border-apple-green/30 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                    {/* Placeholder Image Area */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-xl flex items-center justify-center text-3xl md:text-4xl shadow-sm group-hover:scale-105 transition-transform">
                        {recommendation.img}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h5 className="text-base md:text-lg font-bold text-gray-900 truncate group-hover:text-apple-green transition-colors">
                            {recommendation.title}
                        </h5>
                        <p className="text-sm text-gray-500 line-clamp-2">
                            {recommendation.description}
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <span className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg group-hover:bg-apple-green transition-colors">
                            {recommendation.cta}
                        </span>
                    </div>
                </div>

                {/* Mobile CTA (Full Width) */}
                <div className="mt-4 md:hidden">
                    <span className="flex items-center justify-center w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg group-hover:bg-apple-green transition-colors">
                        {recommendation.cta}
                    </span>
                </div>

                {/* Affiliate Disclosure Badge */}
                <div className="absolute top-2 right-2 text-[10px] text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                    Ad
                </div>
            </div>
        </div>
    );
}
