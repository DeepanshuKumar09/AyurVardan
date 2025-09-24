import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { XIcon } from './icons/XIcon';
// FIX: UserProfile type should be imported from the central types file.
import type { UserProfile } from '../types';
import type { FoodItem } from '../views/DietView';

interface MealLogModalProps {
    userProfile: UserProfile;
    onClose: () => void;
    onLog: (selectedFoods: FoodItem[]) => void;
}

const MealLogModal: React.FC<MealLogModalProps> = ({ userProfile, onClose, onLog }) => {
    const [foodList, setFoodList] = useState<FoodItem[]>([]);
    const [selectedFoodIds, setSelectedFoodIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'All' | 'Breakfast' | 'Lunch' | 'Dinner'>('All');

    useEffect(() => {
        const fetchFoodSuggestions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

                const prompt = `Generate a list of 20 diverse Indian food items suitable for a person with Prakriti: ${userProfile.prakriti} and Vikriti: ${userProfile.vikriti}. For each item, provide its 'name', 'category' ('Breakfast', 'Lunch', or 'Dinner'), a 'servingSize' string (e.g., '1 bowl (200g)'), and a 'nutrients' object with 'calories' (number), 'carbs' (number in grams), 'protein' (number in grams), and 'fats' (number in grams).`;

                const foodItemSchema = {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        category: { type: Type.STRING },
                        servingSize: { type: Type.STRING },
                        nutrients: {
                            type: Type.OBJECT,
                            properties: {
                                calories: { type: Type.NUMBER },
                                carbs: { type: Type.NUMBER },
                                protein: { type: Type.NUMBER },
                                fats: { type: Type.NUMBER },
                            },
                             required: ["calories", "carbs", "protein", "fats"]
                        },
                    },
                    required: ["name", "category", "servingSize", "nutrients"]
                };

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.ARRAY,
                            items: foodItemSchema,
                        },
                    },
                });

                const resultJson = JSON.parse(response.text) as Omit<FoodItem, 'id'>[];
                const foodsWithIds: FoodItem[] = resultJson.map((food, index) => ({
                    ...food,
                    id: `${Date.now()}-${index}`
                }));
                setFoodList(foodsWithIds);

            } catch (err) {
                console.error("Failed to fetch food suggestions:", err);
                setError("Could not fetch personalized food suggestions. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFoodSuggestions();
    }, [userProfile]);

    const handleSelectFood = (foodId: string) => {
        setSelectedFoodIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(foodId)) {
                newSet.delete(foodId);
            } else {
                newSet.add(foodId);
            }
            return newSet;
        });
    };

    const handleSubmit = () => {
        const selectedFoods = foodList.filter(food => selectedFoodIds.has(food.id));
        onLog(selectedFoods);
    };

    const filteredFoodList = useMemo(() => {
        if (activeTab === 'All') return foodList;
        return foodList.filter(food => food.category === activeTab);
    }, [activeTab, foodList]);

    const tabs: ('All' | 'Breakfast' | 'Lunch' | 'Dinner')[] = ['All', 'Breakfast', 'Lunch', 'Dinner'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in">
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">Log Your Meal</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors" aria-label="Close">
                        <XIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>

                <div className="p-4 flex-shrink-0 border-b">
                    <div className="flex space-x-2">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#386641] text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <main className="flex-grow overflow-y-auto p-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-600">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#386641]"></div>
                            <p className="mt-3 font-semibold">Generating personalized suggestions...</p>
                        </div>
                    )}
                    {error && <div className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}
                    {!isLoading && !error && (
                        <ul className="space-y-3">
                            {filteredFoodList.map(food => (
                                <li key={food.id}>
                                    <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedFoodIds.has(food.id) ? 'bg-[#E9F5DB] border-[#6A994E]' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedFoodIds.has(food.id)}
                                            onChange={() => handleSelectFood(food.id)}
                                            className="h-5 w-5 rounded border-gray-300 text-[#6A994E] focus:ring-[#A7C957] flex-shrink-0"
                                        />
                                        <div className="ml-4 flex-grow">
                                            <p className="font-bold text-slate-800">{food.name}</p>
                                            <p className="text-xs text-slate-500">{food.servingSize}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-600">{food.nutrients.calories} kcal</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </main>

                <footer className="p-4 border-t flex-shrink-0 flex justify-end gap-3 bg-white/50 rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={selectedFoodIds.size === 0}
                        className="px-5 py-2 bg-[#386641] text-white text-sm font-semibold rounded-lg hover:bg-[#2c5134] transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Add to Log ({selectedFoodIds.size})
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MealLogModal;