import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Sprout, TrendingUp, Info } from 'lucide-react';
import { recommendCrops, getCategoryDistribution } from '../../ml/cropRecommendation';
import type { SensorReading } from '../../ml/types';

interface CropRecommendationsProps {
    reading: SensorReading;
}

export const CropRecommendations: React.FC<CropRecommendationsProps> = ({ reading }) => {
    const topRecommendations = recommendCrops(reading, 8);
    const categoryDist = getCategoryDistribution(topRecommendations);

    // Icon map for categories
    const categoryIcons: Record<string, string> = {
        vegetable: '🥬',
        grain: '🌾',
        legume: '🫘',
        fruit: '🍓',
        herb: '🌿',
    };

    const categoryColors: Record<string, string> = {
        vegetable: '#10b981',
        grain: '#f59e0b',
        legume: '#8b5cf6',
        fruit: '#ef4444',
        herb: '#06b6d4',
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Sprout className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Crop Recommendations for Current Conditions
                </h3>
            </div>

            {/* Category Distribution */}
            <GlassCard className="bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border-emerald-500/20">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-white">Category Distribution</span>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {Object.entries(categoryDist).map(([category, count]) => (
                        <div
                            key={category}
                            className="px-3 py-1.5 rounded-lg border flex items-center gap-2"
                            style={{
                                backgroundColor: `${categoryColors[category]}15`,
                                borderColor: `${categoryColors[category]}30`,
                            }}
                        >
                            <span className="text-base">{categoryIcons[category]}</span>
                            <span className="text-xs font-bold capitalize" style={{ color: categoryColors[category] }}>
                                {category}
                            </span>
                            <span className="text-xs text-slate-400">({count})</span>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Top Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topRecommendations.map((rec, idx) => {
                    const categoryColor = categoryColors[rec.crop.category];
                    const categoryIcon = categoryIcons[rec.crop.category];

                    return (
                        <GlassCard
                            key={rec.crop.name}
                            className="relative overflow-hidden transition-all hover:scale-[1.02] cursor-pointer"
                        >
                            {/* Rank Badge */}
                            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">#{idx + 1}</span>
                            </div>

                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 border"
                                    style={{
                                        backgroundColor: `${categoryColor}15`,
                                        borderColor: `${categoryColor}30`,
                                    }}
                                >
                                    {categoryIcon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-display font-bold text-white text-lg mb-1">{rec.crop.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                                            style={{
                                                backgroundColor: `${categoryColor}20`,
                                                borderColor: `${categoryColor}40`,
                                                color: categoryColor,
                                            }}
                                        >
                                            {rec.crop.category}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-300 leading-relaxed mb-4">{rec.crop.description}</p>

                            {/* Benefits */}
                            <div className="pt-3 border-t border-white/5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                                    Key Benefits
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {rec.crop.benefits.slice(0, 3).map((benefit, i) => (
                                        <span
                                            key={i}
                                            className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/5"
                                        >
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Info Footer */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <span className="font-bold text-blue-300">Smart Crop Recommendations: </span>
                    These crops are well-suited to your current environmental conditions (temperature, humidity, soil moisture, and pH).
                    Consider local climate, market demand, and available resources when selecting crops.
                </div>
            </div>
        </div>
    );
};

export default CropRecommendations;
