/**
 * VermIQ-Lite ML Module — Crop Recommendation Engine
 *
 * Recommends suitable crops/vegetables based on current environmental conditions.
 * Data sourced from agricultural research and standard crop recommendation datasets.
 */

import type { SensorReading } from './types';

// ─── Crop Database ────────────────────────────────────────────────────────────

export interface CropRequirements {
    name: string;
    category: 'vegetable' | 'grain' | 'legume' | 'fruit' | 'herb';
    tempMin: number;      // °C
    tempMax: number;      // °C
    humidityMin: number;  // %
    humidityMax: number;  // %
    moistureMin: number;  // %
    moistureMax: number;  // %
    phMin: number;
    phMax: number;
    description: string;
    benefits: string[];
}

export const CROP_DATABASE: CropRequirements[] = [
    // ── Vegetables ─────────────────────────────────────────────────────────────
    {
        name: 'Tomato',
        category: 'vegetable',
        tempMin: 21, tempMax: 27,
        humidityMin: 60, humidityMax: 85,
        moistureMin: 60, moistureMax: 80,
        phMin: 6.0, phMax: 7.0,
        description: 'High-yield vegetable, rich in vitamins A and C',
        benefits: ['Fast growing', 'High market demand', 'Multiple harvests possible'],
    },
    {
        name: 'Lettuce',
        category: 'vegetable',
        tempMin: 15, tempMax: 22,
        humidityMin: 60, humidityMax: 80,
        moistureMin: 55, moistureMax: 75,
        phMin: 6.0, phMax: 7.0,
        description: 'Cool-season leafy green, ideal for quick turnover',
        benefits: ['Short growing cycle (30-45 days)', 'High nutritional value', 'Year-round production'],
    },
    {
        name: 'Cucumber',
        category: 'vegetable',
        tempMin: 20, tempMax: 30,
        humidityMin: 60, humidityMax: 85,
        moistureMin: 60, moistureMax: 80,
        phMin: 6.0, phMax: 7.0,
        description: 'Warm-season vegetable with high water content',
        benefits: ['High yield per plant', 'Continuous harvest', 'Good market value'],
    },
    {
        name: 'Spinach',
        category: 'vegetable',
        tempMin: 15, tempMax: 25,
        humidityMin: 50, humidityMax: 75,
        moistureMin: 55, moistureMax: 75,
        phMin: 6.5, phMax: 7.5,
        description: 'Nutrient-dense leafy green, iron and vitamin-rich',
        benefits: ['Fast growing (40-50 days)', 'Cold tolerant', 'Multiple cuttings'],
    },
    {
        name: 'Carrot',
        category: 'vegetable',
        tempMin: 16, tempMax: 21,
        humidityMin: 55, humidityMax: 75,
        moistureMin: 50, moistureMax: 70,
        phMin: 5.5, phMax: 7.0,
        description: 'Root vegetable, high in beta-carotene',
        benefits: ['Long storage life', 'High nutritional value', 'Good for cool climates'],
    },
    {
        name: 'Bell Pepper',
        category: 'vegetable',
        tempMin: 21, tempMax: 29,
        humidityMin: 60, humidityMax: 80,
        moistureMin: 60, moistureMax: 80,
        phMin: 6.0, phMax: 7.0,
        description: 'Colorful vegetable rich in vitamin C',
        benefits: ['High market price', 'Long harvest period', 'Multiple colors available'],
    },
    {
        name: 'Cabbage',
        category: 'vegetable',
        tempMin: 15, tempMax: 21,
        humidityMin: 60, humidityMax: 80,
        moistureMin: 55, moistureMax: 75,
        phMin: 6.0, phMax: 7.5,
        description: 'Cool-season brassica, versatile in cooking',
        benefits: ['Long shelf life', 'Cold hardy', 'High yield per hectare'],
    },
    {
        name: 'Broccoli',
        category: 'vegetable',
        tempMin: 15, tempMax: 23,
        humidityMin: 60, humidityMax: 80,
        moistureMin: 60, moistureMax: 75,
        phMin: 6.0, phMax: 7.0,
        description: 'Superfood vegetable, high in fiber and vitamins',
        benefits: ['Premium pricing', 'Nutritional powerhouse', 'Growing demand'],
    },
    {
        name: 'Eggplant',
        category: 'vegetable',
        tempMin: 21, tempMax: 30,
        humidityMin: 60, humidityMax: 85,
        moistureMin: 60, moistureMax: 80,
        phMin: 5.5, phMax: 7.0,
        description: 'Heat-loving vegetable, popular in diverse cuisines',
        benefits: ['Long fruiting season', 'Multiple varieties', 'Heat tolerant'],
    },
    {
        name: 'Zucchini',
        category: 'vegetable',
        tempMin: 20, tempMax: 28,
        humidityMin: 60, humidityMax: 80,
        moistureMin: 60, moistureMax: 80,
        phMin: 6.0, phMax: 7.5,
        description: 'Summer squash with rapid growth',
        benefits: ['Extremely fast growing', 'High productivity', 'Continuous harvest'],
    },
    {
        name: 'Kale',
        category: 'vegetable',
        tempMin: 12, tempMax: 24,
        humidityMin: 55, humidityMax: 75,
        moistureMin: 55, moistureMax: 75,
        phMin: 6.0, phMax: 7.5,
        description: 'Hardy superfood, extremely nutrient-dense',
        benefits: ['Cold hardy', 'Multiple harvests', 'Growing health trend'],
    },
    {
        name: 'Radish',
        category: 'vegetable',
        tempMin: 15, tempMax: 24,
        humidityMin: 55, humidityMax: 75,
        moistureMin: 50, moistureMax: 70,
        phMin: 6.0, phMax: 7.0,
        description: 'Fast-growing root vegetable, crisp and peppery',
        benefits: ['Ultra-fast (20-30 days)', 'Good for intercropping', 'Low maintenance'],
    },

    // ── Legumes ────────────────────────────────────────────────────────────────
    {
        name: 'Green Beans',
        category: 'legume',
        tempMin: 18, tempMax: 27,
        humidityMin: 60, humidityMax: 80,
        moistureMin: 55, moistureMax: 75,
        phMin: 6.0, phMax: 7.0,
        description: 'Nitrogen-fixing legume with high protein',
        benefits: ['Improves soil nitrogen', 'Multiple pickings', 'Easy to grow'],
    },
    {
        name: 'Peas',
        category: 'legume',
        tempMin: 13, tempMax: 21,
        humidityMin: 55, humidityMax: 75,
        moistureMin: 55, moistureMax: 75,
        phMin: 6.0, phMax: 7.5,
        description: 'Cool-season legume, sweet and nutritious',
        benefits: ['Nitrogen fixation', 'Cold tolerant', 'High protein content'],
    },
    {
        name: 'Lentils',
        category: 'legume',
        tempMin: 18, tempMax: 27,
        humidityMin: 50, humidityMax: 70,
        moistureMin: 45, moistureMax: 65,
        phMin: 6.0, phMax: 8.0,
        description: 'Protein-rich pulse, excellent for rotations',
        benefits: ['Drought tolerant', 'Soil improvement', 'Long storage'],
    },

    // ── Grains ─────────────────────────────────────────────────────────────────
    {
        name: 'Corn (Maize)',
        category: 'grain',
        tempMin: 20, tempMax: 30,
        humidityMin: 60, humidityMax: 85,
        moistureMin: 60, moistureMax: 80,
        phMin: 5.8, phMax: 7.0,
        description: 'High-energy cereal crop, versatile use',
        benefits: ['High caloric yield', 'Multiple uses', 'Good market demand'],
    },
    {
        name: 'Rice',
        category: 'grain',
        tempMin: 20, tempMax: 35,
        humidityMin: 70, humidityMax: 95,
        moistureMin: 70, moistureMax: 95,
        phMin: 5.0, phMax: 7.0,
        description: 'Staple grain crop, prefers flooded conditions',
        benefits: ['Global staple food', 'High demand', 'Flood tolerant'],
    },
    {
        name: 'Wheat',
        category: 'grain',
        tempMin: 12, tempMax: 25,
        humidityMin: 50, humidityMax: 70,
        moistureMin: 45, moistureMax: 65,
        phMin: 6.0, phMax: 7.5,
        description: 'Cool-season cereal, global staple',
        benefits: ['Cold tolerant', 'Staple crop', 'High global demand'],
    },

    // ── Herbs ──────────────────────────────────────────────────────────────────
    {
        name: 'Basil',
        category: 'herb',
        tempMin: 20, tempMax: 30,
        humidityMin: 60, humidityMax: 80,
        moistureMin: 55, moistureMax: 75,
        phMin: 5.5, phMax: 7.0,
        description: 'Aromatic herb, popular in cooking',
        benefits: ['High value crop', 'Fast growing', 'Multiple harvests'],
    },
    {
        name: 'Cilantro (Coriander)',
        category: 'herb',
        tempMin: 15, tempMax: 25,
        humidityMin: 55, humidityMax: 75,
        moistureMin: 50, moistureMax: 70,
        phMin: 6.0, phMax: 7.0,
        description: 'Fast-growing herb with bold flavor',
        benefits: ['Quick harvest (3-4 weeks)', 'Dual purpose (leaves & seeds)', 'High demand'],
    },

    // ── Fruits ─────────────────────────────────────────────────────────────────
    {
        name: 'Strawberry',
        category: 'fruit',
        tempMin: 15, tempMax: 26,
        humidityMin: 60, humidityMax: 80,
        moistureMin: 60, moistureMax: 80,
        phMin: 5.5, phMax: 6.5,
        description: 'High-value berry fruit, perennial producer',
        benefits: ['Premium pricing', 'Extended harvest', 'High market value'],
    },
    {
        name: 'Watermelon',
        category: 'fruit',
        tempMin: 22, tempMax: 30,
        humidityMin: 65, humidityMax: 85,
        moistureMin: 60, moistureMax: 80,
        phMin: 6.0, phMax: 7.0,
        description: 'Summer fruit with high water content',
        benefits: ['High yield', 'Summer favorite', 'Good profit margins'],
    },
];

// ─── Scoring Functions ────────────────────────────────────────────────────────

/**
 * Calculate how well a crop matches current conditions (0-100 score).
 */
function calculateCropScore(crop: CropRequirements, reading: SensorReading): number {
    let score = 0;
    let totalWeight = 0;

    // Temperature match (weight: 30%)
    const tempWeight = 0.30;
    const tempScore = calculateRangeScore(
        reading.dht22_temp,
        crop.tempMin,
        crop.tempMax,
        crop.tempMin - 5,
        crop.tempMax + 5
    );
    score += tempScore * tempWeight;
    totalWeight += tempWeight;

    // Humidity match (weight: 20%)
    const humidWeight = 0.20;
    const humidScore = calculateRangeScore(
        reading.dht22_humidity,
        crop.humidityMin,
        crop.humidityMax,
        crop.humidityMin - 10,
        crop.humidityMax + 10
    );
    score += humidScore * humidWeight;
    totalWeight += humidWeight;

    // Moisture match (weight: 30%)
    const moistWeight = 0.30;
    const moistScore = calculateRangeScore(
        reading.moisture_percent,
        crop.moistureMin,
        crop.moistureMax,
        crop.moistureMin - 10,
        crop.moistureMax + 10
    );
    score += moistScore * moistWeight;
    totalWeight += moistWeight;

    // pH match (weight: 20%)
    const phWeight = 0.20;
    const phScore = calculateRangeScore(
        reading.ph,
        crop.phMin,
        crop.phMax,
        crop.phMin - 0.5,
        crop.phMax + 0.5
    );
    score += phScore * phWeight;
    totalWeight += phWeight;

    return Math.round((score / totalWeight) * 100);
}

/**
 * Score a value based on ideal and acceptable ranges.
 * Returns 100 if in ideal range, scales down in acceptable range, 0 if outside.
 */
function calculateRangeScore(
    value: number,
    idealMin: number,
    idealMax: number,
    acceptableMin: number,
    acceptableMax: number
): number {
    // Perfect score if in ideal range
    if (value >= idealMin && value <= idealMax) {
        return 100;
    }

    // Partial score if in acceptable range
    if (value >= acceptableMin && value < idealMin) {
        const range = idealMin - acceptableMin;
        const distance = idealMin - value;
        return 50 + ((range - distance) / range) * 50;
    }

    if (value > idealMax && value <= acceptableMax) {
        const range = acceptableMax - idealMax;
        const distance = value - idealMax;
        return 50 + ((range - distance) / range) * 50;
    }

    // Outside acceptable range
    return 0;
}

// ─── Main Recommendation Engine ──────────────────────────────────────────────

export interface CropRecommendation {
    crop: CropRequirements;
    matchScore: number;
    matchLevel: 'excellent' | 'good' | 'fair' | 'poor';
    matchColor: string;
    reasoning: string[];
}

/**
 * Recommend top crops based on current environmental conditions.
 * Returns up to `limit` recommendations sorted by match score.
 */
export function recommendCrops(
    reading: SensorReading,
    limit: number = 5
): CropRecommendation[] {
    const recommendations = CROP_DATABASE.map(crop => {
        const matchScore = calculateCropScore(crop, reading);

        // Determine match level
        let matchLevel: CropRecommendation['matchLevel'];
        let matchColor: string;
        if (matchScore >= 80) {
            matchLevel = 'excellent';
            matchColor = '#10b981'; // emerald
        } else if (matchScore >= 65) {
            matchLevel = 'good';
            matchColor = '#06b6d4'; // cyan
        } else if (matchScore >= 50) {
            matchLevel = 'fair';
            matchColor = '#f59e0b'; // amber
        } else {
            matchLevel = 'poor';
            matchColor = '#ef4444'; // red
        }

        // Generate reasoning
        const reasoning: string[] = [];

        // Temperature check
        if (reading.dht22_temp >= crop.tempMin && reading.dht22_temp <= crop.tempMax) {
            reasoning.push(`Temperature (${reading.dht22_temp.toFixed(1)}°C) is in optimal range`);
        } else if (reading.dht22_temp < crop.tempMin) {
            reasoning.push(`Temperature is ${(crop.tempMin - reading.dht22_temp).toFixed(1)}°C below optimal`);
        } else {
            reasoning.push(`Temperature is ${(reading.dht22_temp - crop.tempMax).toFixed(1)}°C above optimal`);
        }

        // Moisture check
        if (reading.moisture_percent >= crop.moistureMin && reading.moisture_percent <= crop.moistureMax) {
            reasoning.push(`Soil moisture (${reading.moisture_percent.toFixed(0)}%) is ideal`);
        } else if (reading.moisture_percent < crop.moistureMin) {
            reasoning.push(`Needs ${(crop.moistureMin - reading.moisture_percent).toFixed(0)}% more soil moisture`);
        } else {
            reasoning.push(`Soil moisture is ${(reading.moisture_percent - crop.moistureMax).toFixed(0)}% too high`);
        }

        // pH check
        if (reading.ph >= crop.phMin && reading.ph <= crop.phMax) {
            reasoning.push(`pH level (${reading.ph.toFixed(1)}) is perfect`);
        } else if (reading.ph < crop.phMin) {
            reasoning.push(`pH is ${(crop.phMin - reading.ph).toFixed(1)} points too acidic`);
        } else {
            reasoning.push(`pH is ${(reading.ph - crop.phMax).toFixed(1)} points too alkaline`);
        }

        return {
            crop,
            matchScore,
            matchLevel,
            matchColor,
            reasoning,
        };
    });

    // Sort by match score (descending) and return top matches
    return recommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
}

/**
 * Get category distribution of top recommendations.
 */
export function getCategoryDistribution(recommendations: CropRecommendation[]): Record<string, number> {
    const distribution: Record<string, number> = {};

    recommendations.forEach(rec => {
        const category = rec.crop.category;
        distribution[category] = (distribution[category] || 0) + 1;
    });

    return distribution;
}
