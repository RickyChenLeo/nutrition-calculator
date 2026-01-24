import React from 'react';

// --- Affiliate Configuration (Product Inventory) ---
const affiliateConfig = {
    protein: {
        id: 'protein',
        text: "Impact Whey Protein",
        description: "Must-have for muscle repair & growth.",
        url: "#",
        color: "#00A4E4", // Myprotein Blue
        img: "💪",
        cta: "Best Seller"
    },
    creatine: {
        id: 'creatine',
        text: "Creatine Monohydrate",
        description: "Explosive power & performance.",
        url: "#",
        color: "#364151", // Dark Grey
        img: "⚡",
        cta: "Boost Power"
    },
    fatBurner: {
        id: 'fatBurner',
        text: "Thermogenic Burner",
        description: "Accelerate metabolism & fat loss.",
        url: "#",
        color: "#EE4D2D", // Hot Red
        img: "🔥",
        cta: "Burn Fat"
    },
    preWorkout: {
        id: 'preWorkout',
        text: "Pre-Workout Blend",
        description: "Energy boost for heavy lifting.",
        url: "#",
        color: "#FFD700", // Gold
        img: "�",
        cta: "Get Hype"
    },
    energyGels: {
        id: 'energyGels',
        text: "Energy Gels",
        description: "Instant fuel for long duration.",
        url: "#",
        color: "#F97316", // Orange
        img: "🏃",
        cta: "Refuel"
    },
    electrolytes: {
        id: 'electrolytes',
        text: "Electrolytes Plus",
        description: "Hydration & cramp prevention.",
        url: "#",
        color: "#3B82F6", // Blue
        img: "💧",
        cta: "Hydrate"
    },
    multivitamin: {
        id: 'multivitamin',
        text: "Daily Multivitamin",
        description: "Overall health foundation.",
        url: "#",
        color: "#10B981", // Green
        img: "💊",
        cta: "Health"
    },
    omega3: {
        id: 'omega3',
        text: "Essential Omega-3",
        description: "Joint health & inflammation support.",
        url: "#",
        color: "#F59E0B", // Amber
        img: "🐟",
        cta: "Joints"
    }
};

export default function RecommendedGear({ athleteProfile, goal, t = {} }) {

    // --- Smart Stack Logic (Generates 3-Item Array) ---
    const getRecommendedStack = () => {
        let stack = [];

        // 1. Base (Always included) - High Conversion
        stack.push(affiliateConfig.protein);

        // 2. Goal-Based Addition
        if (goal === 'cut') {
            stack.push(affiliateConfig.fatBurner);
            stack.push(affiliateConfig.multivitamin);
        } else if (goal === 'bulk') {
            stack.push(affiliateConfig.creatine);
            stack.push(affiliateConfig.preWorkout);
        } else {
            // Maintenance / Default
            // Check Profile for specific needs
            if (athleteProfile === 'endurance' || athleteProfile === 'mixed_team') {
                stack.push(affiliateConfig.energyGels);
                stack.push(affiliateConfig.electrolytes);
            } else if (athleteProfile === 'strength_power') {
                stack.push(affiliateConfig.creatine);
                stack.push(affiliateConfig.multivitamin);
            } else {
                // General health stack
                stack.push(affiliateConfig.multivitamin);
                stack.push(affiliateConfig.omega3);
            }
        }

        // 3. Profile-Specific Overrides/Adjustments (Hybrid Logic)
        // If user is 'Endurance' but Goal is 'Cut' -> [Protein, FatBurner, Multivitamin] (Goal wins)
        // If user is 'Endurance' but Goal is 'Maintain' -> [Protein, EnergyGels, Electrolytes] 

        // Edge Case: If mixed_team (Basketball) + Cut -> [Protein, FatBurner, EnergyGels] ??
        // Conversion Logic: Fat Burner is #1 priority for Cut. 
        // Let's keep logic simple: Goal First. If Goal doesn't fill 3 slots, use Profile.

        // Ensure max 3 items
        return stack.slice(0, 3);
    };

    const recommendedItems = getRecommendedStack();

    return (
        <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>🔥</span> Optimized Supplement Stack for You
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {recommendedItems.map((item, index) => (
                    <a
                        key={item.id + index}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-apple-green/30 transition-all duration-300 cursor-pointer flex flex-col h-full"
                    >
                        {/* Header: Icon + Title */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                {item.img}
                            </div>
                            <h5 className="text-sm font-bold text-gray-900 leading-tight group-hover:text-apple-green transition-colors">
                                {item.text}
                            </h5>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-500 mb-3 flex-grow leading-relaxed">
                            {item.description}
                        </p>

                        {/* CTA Button */}
                        <div className="mt-auto">
                            <span
                                className="block w-full text-center py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                                style={{ backgroundColor: item.color }}
                            >
                                {item.cta}
                            </span>
                        </div>

                        {/* Ad Badge */}
                        <div className="absolute top-2 right-2 text-[8px] text-gray-300 border border-gray-100 px-1 rounded">
                            Ad
                        </div>
                    </a>
                ))}
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-3">
                *Recommendations based on your {goal === 'cut' ? 'fat loss' : goal === 'bulk' ? 'muscle building' : 'performance'} goal.
            </p>
        </div>
    );
}
