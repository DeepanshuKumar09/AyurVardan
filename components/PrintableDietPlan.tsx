import React from 'react';
import type { Patient, DietPlan, FoodLibraryItem } from '../types';
import { AyurVardanLogo } from './icons/AyurVardanLogo';

interface PrintableDietPlanProps {
    patient: Patient;
    dietPlan: DietPlan;
}

const PrintableDietPlan: React.FC<PrintableDietPlanProps> = ({ patient, dietPlan }) => {
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
                        <p className="text-slate-500">Personalized Diet Plan</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg">{patient.name}</p>
                    <p className="text-slate-600">Date: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
            </header>

            {/* Summary */}
            <section className="bg-green-50 p-4 rounded-lg mb-8 text-center">
                <h2 className="text-xl font-bold mb-2 text-slate-800">Daily Nutritional Goals</h2>
                <div className="flex justify-around items-center">
                    <div>
                        <p className="text-xs text-slate-600">Total Calories</p>
                        <p className="font-bold text-2xl text-green-800">{dietPlan.totalCalories}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-600">Total Protein</p>
                        <p className="font-bold text-2xl text-green-800">{dietPlan.totalProtein.toFixed(1)}g</p>
                    </div>
                </div>
            </section>

            {/* Meals */}
            <section className="space-y-6">
                {Object.entries(dietPlan.meals).map(([mealType, items]) => {
                    if (!Array.isArray(items) || items.length === 0) return null;
                    return (
                        <div key={mealType} className="break-inside-avoid">
                            <h3 className="text-xl font-bold text-slate-800 border-b-2 border-[#A7C957] pb-1 mb-3">{mealType}</h3>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                {items.map((item: FoodLibraryItem) => (
                                    <li key={item.id}>
                                        <span className="font-semibold">{item.name}</span>
                                        <span className="text-slate-500 text-xs ml-2">
                                            ({item.calories} kcal, {item.protein}g protein)
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
                This diet plan is a recommendation. Please consult with your doctor for any adjustments.
                <br />
                Ayur Vardan - Holistic Wellness
            </footer>
        </div>
    );
};

export default PrintableDietPlan;