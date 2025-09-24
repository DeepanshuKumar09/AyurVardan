import React from 'react';
import type { Patient } from '../types';
import type { FoodItem } from '../views/DietView';
import { AyurVardanLogo } from './icons/AyurVardanLogo';

interface PrintableDailyLogProps {
    patient: Patient;
    loggedMeals: FoodItem[];
    nutrition: {
        totalKcal: number;
        carbsPercent: number;
        proteinPercent: number;
        fatsPercent: number;
    };
}

const PrintableDailyLog: React.FC<PrintableDailyLogProps> = ({ patient, loggedMeals, nutrition }) => {
    const mealsByCategory = loggedMeals.reduce((acc, meal) => {
        if (!acc[meal.category]) {
            acc[meal.category] = [];
        }
        acc[meal.category].push(meal);
        return acc;
    }, {} as Record<'Breakfast' | 'Lunch' | 'Dinner', FoodItem[]>);

    return (
        <div className="p-10 font-sans text-sm bg-white text-slate-800">
            {/* Header */}
            <header className="flex justify-between items-center border-b border-slate-200 pb-4 mb-8">
                <div className="flex items-center gap-3">
                    <AyurVardanLogo className="h-16 w-16" />
                    <div>
                         <h1 className="text-3xl font-bold text-[#386641]">
                            Ayur<span className="text-[#603808]">Vardan</span>
                        </h1>
                        <p className="text-slate-500">Daily Food Log</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg">{patient.name}</p>
                    <p className="text-slate-600">Date: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
            </header>

            {/* Summary */}
            <section className="bg-slate-50 p-4 rounded-lg mb-8 text-center">
                <h2 className="text-xl font-bold mb-2 text-slate-800">Daily Nutrition Summary</h2>
                <div className="flex justify-around items-center">
                    <div>
                        <p className="text-xs text-slate-600">Total Calories</p>
                        <p className="font-bold text-2xl text-slate-800">{nutrition.totalKcal}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600">Protein</p>
                        <p className="font-bold text-2xl text-slate-800">{nutrition.proteinPercent}%</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600">Carbs</p>
                        <p className="font-bold text-2xl text-slate-800">{nutrition.carbsPercent}%</p>
                    </div>
                     <div>
                        <p className="text-xs text-slate-600">Fats</p>
                        <p className="font-bold text-2xl text-slate-800">{nutrition.fatsPercent}%</p>
                    </div>
                </div>
            </section>

            {/* Meals */}
            <section className="space-y-6">
                {(Object.keys(mealsByCategory) as Array<keyof typeof mealsByCategory>).map((mealType) => {
                    const items = mealsByCategory[mealType];
                    if (!items || items.length === 0) return null;
                    return (
                        <div key={mealType} className="break-inside-avoid">
                            <h3 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-1 mb-3">{mealType}</h3>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                {items.map((item, index) => (
                                    <li key={`${item.id}-${index}`}>
                                        <span className="font-semibold">{item.name}</span>
                                        <span className="text-slate-500 text-xs ml-2">
                                            ({item.nutrients.calories} kcal) - {item.servingSize}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </section>

            {/* Footer */}
            <footer className="mt-10 text-center text-xs text-slate-400 border-t border-slate-200 pt-4">
                This is a log of your daily food intake.
                <br />
                Ayur Vardan - Holistic Wellness
            </footer>
        </div>
    );
};

export default PrintableDailyLog;