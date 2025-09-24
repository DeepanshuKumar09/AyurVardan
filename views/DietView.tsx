import React, { useState, useRef, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import DonutChart from '../components/DonutChart';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { UploadIcon } from '../components/icons/UploadIcon';
import { XIcon } from '../components/icons/XIcon';
import type { UserProfile } from '../types';
import MealLogModal from '../components/MealLogModal';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import type { Patient, DietPlan, FoodLibraryItem } from '../types';
import { DocumentReportIcon } from '../components/icons/DocumentReportIcon';
import PrintableDailyLog from '../components/PrintableDailyLog';

interface DietViewProps {
    patient: Patient;
    userProfile: UserProfile | null;
    dietPlan?: DietPlan;
    onDownloadDietPdf: () => void;
    isGeneratingPdf: boolean;
}

interface AnalysisResult {
    foodName: string;
    prakriti: string;
    rasa: string;
    vikritiEffect: string;
    recommendation: 'Yes' | 'No' | 'In Moderation';
    explanation: string;
}

export interface FoodItem {
    id: string;
    name: string;
    category: 'Breakfast' | 'Lunch' | 'Dinner';
    servingSize: string;
    nutrients: {
        calories: number;
        carbs: number; // in grams
        protein: number; // in grams
        fats: number; // in grams
    };
}


const FoodAnalysisResultCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const recommendationStyles = {
        Yes: {
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-500',
            text: 'Recommended'
        },
        'In Moderation': {
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            borderColor: 'border-yellow-500',
            text: 'In Moderation'
        },
        No: {
            bgColor: 'bg-red-100',
            textColor: 'text-red-800',
            borderColor: 'border-red-500',
            text: 'Not Recommended'
        },
    };

    const style = recommendationStyles[result.recommendation] || recommendationStyles['In Moderation'];

    return (
        <div className={`mt-6 bg-white p-4 rounded-2xl shadow-lg border-t-4 ${style.borderColor} animate-fade-in`}>
            <div className={`inline-block px-3 py-1 text-sm font-bold rounded-full mb-3 ${style.bgColor} ${style.textColor}`}>
                {style.text}
            </div>
            <p className="text-slate-600 mb-4">{result.explanation}</p>
            <div className="border-t border-slate-200 pt-3">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{result.foodName}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <p><strong className="text-slate-500 block">Qualities (Prakriti):</strong> {result.prakriti}</p>
                    <p><strong className="text-slate-500 block">Taste (Rasa):</strong> {result.rasa}</p>
                </div>
                <p className="mt-3"><strong className="text-slate-500 block">Effect on your balance (Vikriti):</strong> {result.vikritiEffect}</p>
            </div>
        </div>
    );
};

export const DietView: React.FC<DietViewProps> = ({ patient, userProfile, dietPlan, onDownloadDietPdf, isGeneratingPdf }) => {
    const formattedDate = "March, 22";
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isMealLogOpen, setIsMealLogOpen] = useState(false);
    const [loggedMeals, setLoggedMeals] = useState<FoodItem[]>([]);

    // PDF generation state for daily log
    const [isGeneratingDailyLogPdf, setIsGeneratingDailyLogPdf] = useState(false);
    const dailyLogPdfRef = useRef<HTMLDivElement>(null);

    const calorieGoal = useMemo(() => {
        if (userProfile?.weight && userProfile.weight > 0) {
            // A simple heuristic for daily calorie needs: 30 kcal per kg
            return Math.round(userProfile.weight * 30);
        }
        return 2000; // Default goal if no weight is provided
    }, [userProfile?.weight]);

    const [nutrition, setNutrition] = useState({
        totalKcal: 0,
        carbsPercent: 0,
        proteinPercent: 0,
        fatsPercent: 0,
        otherPercent: 0,
    });

    const { chartData, legendData } = useMemo(() => {
        const { totalKcal, carbsPercent, proteinPercent, fatsPercent, otherPercent } = nutrition;
        
        if (totalKcal === 0) {
            // Display a gray, empty circle when nothing has been logged
            return {
                chartData: [{ name: 'Empty', value: 100, color: '#e5e7eb' }],
                legendData: [
                    { name: 'Carbs', value: 0, color: '#ec4899' },
                    { name: 'Protein', value: 0, color: '#3b82f6' },
                    { name: 'Fats', value: 0, color: '#f59e0b' },
                    { name: 'Other', value: 0, color: '#8b5cf6' },
                ]
            };
        }

        const newChartData = [
            { name: 'Fats', value: fatsPercent, color: '#f59e0b' },
            { name: 'Carbs', value: carbsPercent, color: '#ec4899' },
            { name: 'Other', value: otherPercent, color: '#8b5cf6' },
            { name: 'Protein', value: proteinPercent, color: '#3b82f6' },
        ];
        const newLegendData = [
            { name: 'Carbs', value: carbsPercent, color: '#ec4899' },
            { name: 'Protein', value: proteinPercent, color: '#3b82f6' },
            { name: 'Fats', value: fatsPercent, color: '#f59e0b' },
            { name: 'Other', value: otherPercent, color: '#8b5cf6' },
        ];
        return { chartData: newChartData, legendData: newLegendData };
    }, [nutrition]);


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setSelectedImage({
                    data: result,
                    mimeType: file.type,
                });
                setAnalysisResult(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearImage = () => {
        setSelectedImage(null);
        setAnalysisResult(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage || !userProfile) return;

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const base64Data = selectedImage.data.split(',')[1];

            const imagePart = {
                inlineData: {
                    mimeType: selectedImage.mimeType,
                    data: base64Data,
                },
            };

            const prompt = `Analyze the food in the image from an Ayurvedic perspective. Based on the user's profile (Prakriti: ${userProfile.prakriti}, Vikriti: ${userProfile.vikriti}), determine the food's properties and provide a personalized recommendation.
                1.  **foodName**: Identify the primary food item(s).
                2.  **prakriti**: The inherent qualities of the food (e.g., "Heating", "Cooling", "Dry", "Oily").
                3.  **rasa**: The dominant taste(s) (e.g., "Sweet", "Sour", "Salty", "Pungent", "Bitter", "Astringent").
                4.  **vikritiEffect**: How this food is likely to affect the user's current imbalance (Vikriti). Explain if it will aggravate or pacify the imbalanced doshas.
                5.  **recommendation**: A clear 'Yes', 'No', or 'In Moderation' recommendation for the user.
                6.  **explanation**: A brief, easy-to-understand explanation for the recommendation.
            `;
            
            const schema = {
              type: Type.OBJECT,
              properties: {
                foodName: { type: Type.STRING },
                prakriti: { type: Type.STRING },
                rasa: { type: Type.STRING },
                vikritiEffect: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                explanation: { type: Type.STRING },
              }
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, { text: prompt }] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });
            
            const resultJson = JSON.parse(response.text);
            setAnalysisResult(resultJson);

        } catch (err) {
            console.error("AI analysis failed:", err);
            setError("Sorry, I couldn't analyze the image. Please try another one.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogMeal = (newlyLoggedMeals: FoodItem[]) => {
        setLoggedMeals(prev => [...prev, ...newlyLoggedMeals]);

        const loggedTotals = newlyLoggedMeals.reduce((acc, meal) => {
            acc.calories += meal.nutrients.calories;
            acc.carbsGrams += meal.nutrients.carbs;
            acc.proteinGrams += meal.nutrients.protein;
            acc.fatsGrams += meal.nutrients.fats;
            return acc;
        }, { calories: 0, carbsGrams: 0, proteinGrams: 0, fatsGrams: 0 });

        if (loggedTotals.calories === 0) {
            setIsMealLogOpen(false);
            return;
        }

        const currentCarbsKcal = (nutrition.carbsPercent / 100) * nutrition.totalKcal;
        const currentProteinKcal = (nutrition.proteinPercent / 100) * nutrition.totalKcal;
        const currentFatsKcal = (nutrition.fatsPercent / 100) * nutrition.totalKcal;

        const loggedCarbsKcal = loggedTotals.carbsGrams * 4;
        const loggedProteinKcal = loggedTotals.proteinGrams * 4;
        const loggedFatsKcal = loggedTotals.fatsGrams * 9;

        const newTotalKcal = nutrition.totalKcal + loggedTotals.calories;
        
        const newTotalCarbsKcal = currentCarbsKcal + loggedCarbsKcal;
        const newTotalProteinKcal = currentProteinKcal + loggedProteinKcal;
        const newTotalFatsKcal = currentFatsKcal + loggedFatsKcal;
        
        const newCarbsPercent = newTotalKcal > 0 ? Math.round((newTotalCarbsKcal / newTotalKcal) * 100) : 0;
        const newProteinPercent = newTotalKcal > 0 ? Math.round((newTotalProteinKcal / newTotalKcal) * 100) : 0;
        const newFatsPercent = newTotalKcal > 0 ? Math.round((newTotalFatsKcal / newTotalKcal) * 100) : 0;
        const newOtherPercent = 100 - newCarbsPercent - newProteinPercent - newFatsPercent;
        
        setNutrition({
            totalKcal: Math.round(newTotalKcal),
            carbsPercent: newCarbsPercent,
            proteinPercent: newProteinPercent,
            fatsPercent: newFatsPercent,
            otherPercent: newOtherPercent >= 0 ? newOtherPercent : 0,
        });
        
        setIsMealLogOpen(false);
    };

    useEffect(() => {
        if (isGeneratingDailyLogPdf) {
            const generatePdf = async () => {
                const reportElement = dailyLogPdfRef.current;
                if (!(window as any).jspdf || !(window as any).html2canvas) {
                    alert("PDF generation library is not loaded yet. Please try again in a moment.");
                    setIsGeneratingDailyLogPdf(false);
                    return;
                }
                if (reportElement) {
                    const { jsPDF } = (window as any).jspdf;
                    const html2canvas = (window as any).html2canvas;

                    const canvas = await html2canvas(reportElement, { 
                        scale: 2,
                        useCORS: true 
                    });
                    
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'pt',
                        format: 'a4'
                    });
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Daily_Log_${patient.name.replace(/\s+/g, '_')}.pdf`);
                }
                setIsGeneratingDailyLogPdf(false);
            };
            const timer = setTimeout(generatePdf, 100);
            return () => clearTimeout(timer);
        }
    }, [isGeneratingDailyLogPdf, patient, loggedMeals, nutrition]);

    return (
        <div className="p-4 space-y-8">
            {isGeneratingDailyLogPdf && loggedMeals.length > 0 && (
                <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px', backgroundColor: 'white' }}>
                    <div ref={dailyLogPdfRef}>
                        <PrintableDailyLog patient={patient} loggedMeals={loggedMeals} nutrition={nutrition} />
                    </div>
                </div>
            )}

            {userProfile && isMealLogOpen && (
                <MealLogModal
                    userProfile={userProfile}
                    onClose={() => setIsMealLogOpen(false)}
                    onLog={handleLogMeal}
                />
            )}

            {/* Daily Activity */}
            <div className="bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">Daily Activity</h2>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <DonutChart
                        data={chartData}
                        size={180}
                        strokeWidth={25}
                        totalValue={nutrition.totalKcal}
                        totalLabel={`kcal / ${calorieGoal} goal`}
                    />
                    <div className="w-full flex-1">
                        <ul className="space-y-2">
                            {legendData.map(item => (
                                <li key={item.name} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-bold">{item.value}%</span>
                                </li>
                            ))}
                        </ul>
                         {loggedMeals.length > 0 && (
                            <div className="mt-4 border-t pt-2">
                                <h3 className="font-semibold text-sm mb-1">Logged Items:</h3>
                                <ul className="text-xs text-slate-500 list-disc list-inside">
                                    {loggedMeals.map((meal, index) => <li key={index}>{meal.name}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => {
                            if (!userProfile) {
                                alert("Please complete your Ayurvedic profile first to get personalized suggestions.");
                                return;
                            }
                            setIsMealLogOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#386641] text-white font-semibold rounded-lg hover:bg-[#2c5134] transition-colors"
                    >
                        <PlusCircleIcon className="h-5 w-5" /> Add Meal
                    </button>
                    <button 
                        onClick={() => setIsGeneratingDailyLogPdf(true)}
                        disabled={isGeneratingDailyLogPdf || loggedMeals.length === 0}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors disabled:bg-slate-300"
                    >
                        <DocumentReportIcon className="h-5 w-5" /> Download Log
                    </button>
                </div>
            </div>
            
            {/* Prescribed Diet Plan */}
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">Prescribed Diet Plan</h2>
                    <button
                        onClick={onDownloadDietPdf}
                        disabled={!dietPlan || isGeneratingPdf}
                        className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap disabled:bg-slate-100 disabled:text-slate-400"
                    >
                       {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
                    </button>
                </div>
                {dietPlan ? (
                    <div>
                        <div className="bg-green-50 p-3 rounded-lg mb-3 text-center">
                            <div className="flex justify-around">
                                <div><p className="text-xs text-slate-600">Total Calories</p><p className="font-bold text-lg text-green-800">{dietPlan.totalCalories}</p></div>
                                <div><p className="text-xs text-slate-600">Total Protein</p><p className="font-bold text-lg text-green-800">{dietPlan.totalProtein.toFixed(1)}g</p></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {Object.entries(dietPlan.meals).map(([mealType, items]) => {
                                if (!Array.isArray(items) || items.length === 0) return null;
                                return (
                                <div key={mealType}>
                                    <h3 className="font-bold text-green-700">{mealType}</h3>
                                    <ul className="list-disc list-inside ml-4 text-sm text-slate-600">
                                        {items.map((item: FoodLibraryItem) => <li key={item.id}>{item.name}</li>)}
                                    </ul>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-500 text-center py-8">No diet plan has been prescribed by your doctor yet.</p>
                )}
            </div>

            {/* Analyze Meal */}
            <div className="bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">Analyze Your Meal</h2>
                {!userProfile ? (
                     <p className="text-slate-500 text-center py-4">Complete your Ayurvedic profile on the Home tab to unlock personalized food analysis.</p>
                ) : (
                    <div>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
                            {selectedImage ? (
                                <div className="relative">
                                    <img src={selectedImage.data} alt="Selected meal" className="max-h-48 rounded-lg" />
                                    <button onClick={handleClearImage} className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md"><XIcon className="h-4 w-4 text-slate-600" /></button>
                                </div>
                            ) : (
                                <>
                                    <UploadIcon className="h-10 w-10 text-slate-400 mb-2" />
                                    <p className="text-slate-600 font-semibold mb-2">Upload a photo of your meal</p>
                                    <p className="text-xs text-slate-500">Get an instant Ayurvedic analysis.</p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        <button
                            onClick={() => selectedImage ? handleAnalyze() : fileInputRef.current?.click()}
                            disabled={isLoading}
                            className="w-full mt-4 py-3 bg-[#386641] text-white font-semibold rounded-lg hover:bg-[#2c5134] transition-colors disabled:bg-slate-400 disabled:cursor-wait"
                        >
                            {isLoading ? 'Analyzing...' : (selectedImage ? 'Analyze Now' : 'Upload Image')}
                        </button>

                        {error && <p className="text-center text-red-500 mt-3">{error}</p>}
                        {analysisResult && <FoodAnalysisResultCard result={analysisResult} />}
                    </div>
                )}
            </div>
        </div>
    );
};
