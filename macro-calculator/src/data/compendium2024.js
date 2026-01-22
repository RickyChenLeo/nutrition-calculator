export const COMPENDIUM_2024 = [
    {
        category: "cat_bicycling",
        items: [
            { id: 'bicycling_leisure', met: 6.8 },
            { id: 'bicycling_stationary', met: 6.8 },
            { id: 'bicycling_mountain', met: 8.5 },
        ]
    },
    {
        category: "cat_conditioning",
        items: [
            { id: 'weight_lifting', met: 6.0, pinned: true }, // Vigorous
            { id: 'weight_lifting_light', met: 3.5 }, // New: Light/Moderate
            { id: 'calisthenics', met: 8.0 }, // Updated MET 8.0
            { id: 'pilates', met: 3.0 },
            { id: 'circuit_training', met: 8.0 },
        ]
    },
    {
        category: "cat_dancing",
        items: [
            { id: 'dancing_general', met: 4.8 },
            { id: 'zumba', met: 7.3 },
            { id: 'tap_dance', met: 4.8 },
        ]
    },
    {
        category: "cat_fishing_hunting",
        items: [
            { id: 'fishing_general', met: 3.5 },
            { id: 'hunting_general', met: 5.0 },
        ]
    },
    {
        category: "cat_home_activities",
        items: [
            { id: 'cleaning_house', met: 3.5 }, // Updated MET 3.5
            { id: 'cooking', met: 2.5 },
            { id: 'playing_kids', met: 3.5 },
        ]
    },
    {
        category: "cat_home_repair",
        items: [
            { id: 'carpentry', met: 3.6 },
            { id: 'painting_house', met: 3.3 },
        ]
    },
    {
        category: "cat_inactivity",
        items: [
            { id: 'sleeping', met: 0.95, pinned: true },
            { id: 'sitting_quietly', met: 1.3 },
            { id: 'desk_work', met: 1.3 },
        ]
    },
    {
        category: "cat_lawn_garden",
        items: [
            { id: 'mowing_lawn', met: 5.0 },
            { id: 'gardening', met: 3.8 },
            { id: 'weeding', met: 3.5 },
        ]
    },
    {
        category: "cat_music_playing",
        items: [
            { id: 'piano', met: 2.3 },
            { id: 'guitar', met: 3.0 },
            { id: 'drums', met: 3.8 },
        ]
    },
    {
        category: "cat_occupation",
        items: [
            { id: 'farming_feeding', met: 4.3 },
            { id: 'construction_work', met: 5.3 },
            { id: 'fire_fighter', met: 8.0 },
        ]
    },
    {
        category: "cat_running",
        items: [
            { id: 'jogging', met: 7.0, pinned: true },
            { id: 'running_10kmh', met: 9.8 },
            { id: 'running_13kmh', met: 11.5 },
        ]
    },
    {
        category: "cat_self_care",
        items: [
            { id: 'showering', met: 2.0 },
            { id: 'dressing_undressing', met: 2.5 },
        ]
    },
    // Removed specific Sexual Activity Category (merged to Miscellaneous/Lifestyle)
    {
        category: "cat_sports",
        items: [
            { id: 'basketball_game', met: 8.0 },
            { id: 'basketball_shoot', met: 4.5 }, // New
            { id: 'basketball_3v3', met: 6.0 }, // New
            { id: 'baseball_game', met: 5.0 }, // New
            { id: 'baseball_pitch', met: 5.0 }, // Updated/Mapped
            { id: 'baseball_bat', met: 4.0 }, // New
            { id: 'soccer', met: 10.0 }, // Updated MET 10.0
            { id: 'tennis_singles', met: 8.0 }, // Updated MET 8.0
            { id: 'badminton', met: 7.0 },
        ]
    },
    {
        category: "cat_transportation",
        items: [
            { id: 'driving_car', met: 1.3 },
            { id: 'motorcycling', met: 2.3 },
        ]
    },
    {
        category: "cat_walking",
        items: [
            { id: 'walking_commuting', met: 3.5, pinned: true },
            { id: 'walking_brisk', met: 4.3 }, // New: Brisk Pace
            { id: 'walking_dog', met: 3.0 },
            { id: 'walking_stroll', met: 2.0 },
            { id: 'hiking', met: 6.0 },
        ]
    },
    {
        category: "cat_water_activities",
        items: [
            { id: 'swimming_laps', met: 8.3 },
            { id: 'surfing', met: 3.0 },
            { id: 'kayaking', met: 5.0 },
        ]
    },
    {
        category: "cat_winter_activities",
        items: [
            { id: 'skiing_downhill', met: 5.3 },
            { id: 'skating_ice', met: 5.5 },
        ]
    },
    {
        category: "cat_religious_activities",
        items: [
            { id: 'sitting_church', met: 1.3 },
            { id: 'standing_church', met: 1.8 },
            { id: 'praising', met: 5.0 },
        ]
    },
    {
        category: "cat_volunteer_activities",
        items: [
            { id: 'volunteering_sitting', met: 1.5 },
            { id: 'volunteering_standing', met: 2.5 },
        ]
    },
    {
        category: "cat_video_games",
        items: [
            { id: 'gaming_seated', met: 1.0 },
            { id: 'gaming_active', met: 3.8 },
        ]
    },
    {
        category: "cat_miscellaneous", // "Lifestyle & Others" mapped here
        items: [
            { id: 'sitting_playing_cards', met: 1.5 },
            { id: 'standing_talking', met: 1.8 },
            { id: 'sexual_activity_active', met: 2.8 }, // Moved here (Bottom)
        ]
    },
];

// Helper to get formatted options including Pinned items at top
// NOW REQUIRES translation object 't'
export const getExerciseOptions = (t) => {
    // Helper to safely lookup translation or return key
    const translate = (key) => (t && t[key]) ? t[key] : key;
    const options = [];

    // 1. Add Pinned Items First (Sorted by label for neatness if needed, or by specific order)
    const pinnedItems = [];
    COMPENDIUM_2024.forEach(cat => {
        cat.items.forEach(item => {
            if (item.pinned) {
                pinnedItems.push({
                    value: item.id,
                    label: translate(item.id),
                    met: item.met, // Ensure MET matches the updated values
                    category: translate(cat.category),
                    pinned: true
                });
            }
        });
    });

    // Sort pinned items by specific order requested
    const pinnedOrder = ['sleeping', 'walking_commuting', 'weight_lifting', 'jogging'];
    pinnedItems.sort((a, b) => {
        return pinnedOrder.indexOf(a.value) - pinnedOrder.indexOf(b.value);
    });

    // Add Pinned Group Header
    if (pinnedItems.length > 0) {
        options.push({ label: `--- ${translate('header_popular') || 'Popular'} ---`, value: 'header_pinned', isHeader: true });
        options.push(...pinnedItems);
    }

    // 2. Add All Items by Category
    COMPENDIUM_2024.forEach(cat => {
        options.push({ label: translate(cat.category), value: `header_${cat.category}`, isHeader: true });
        cat.items.forEach(item => {
            options.push({
                value: item.id,
                label: translate(item.id),
                met: item.met,
                category: translate(cat.category)
            });
        });
    });

    return options;
};
