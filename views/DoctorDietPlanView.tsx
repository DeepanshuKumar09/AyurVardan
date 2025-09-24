import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { FoodLibraryItem, DietPlan, Patient, ChatMessage, UpcomingAppointment, GeneratedRecipe } from '../types';
import { foodLibraryData } from '../data/foodLibraryData';
import { doctors } from '../data/mockData';
import { SearchIcon } from '../components/icons/SearchIcon';
import { PlusCircleSolidIcon } from '../components/icons/PlusCircleSolidIcon';
import { MinusCircleIcon } from '../components/icons/MinusCircleIcon';
import { XIcon } from '../components/icons/XIcon';
import { RecipeIcon } from '../components/icons/RecipeIcon';
import { DocumentReportIcon } from '../components/icons/DocumentReportIcon';
import PrintableDietPlan from '../components/PrintableDietPlan';

interface DoctorDietPlanViewProps {
    doctorId: number;
    patients: Patient[];
    onRecipeGenerated: (recipe: GeneratedRecipe) => void;
    onSendMessage: (patientId: number, text: string, sender: 'doctor', type?: 'text' | 'image' | 'document' | 'prescription' | 'diet', data?: any) => void;
}

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

interface PlanItem {
    food: FoodLibraryItem;
    meal: MealType;
    uniqueId: number;
}

const prakritiColors: { [key in FoodLibraryItem['prakriti']]: string } = {
  Vata: 'bg-blue-100 text-blue-800',
  Pitta: 'bg-red-100 text-red-800',
  Kapha: 'bg-green-100 text-green-800',
  Tridoshic: 'bg-purple-100 text-purple-800',
};

const DoctorDietPlanView: React.FC<DoctorDietPlanViewProps> = ({ doctorId, patients, onRecipeGenerated, onSendMessage }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [dailyPlan, setDailyPlan] = useState<PlanItem[]>([]);
    const [activeMeal, setActiveMeal] = useState<MealType>('Breakfast');
    const [showPatientModal, setShowPatientModal] = useState(false);
    
    const [targetCalories, setTargetCalories] = useState('2000');
    const [dietaryGoals, setDietaryGoals] = useState('Weight loss, pitta-pacifying');
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(patients.length > 0 ? patients[0].id : null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [generatingRecipeFor, setGeneratingRecipeFor] = useState<MealType | null>(null);

    // State for PDF generation
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const dietPdfRef = useRef<HTMLDivElement>(null);

    const selectedPatient = useMemo(() => patients.find(p => p.id === selectedPatientId), [patients, selectedPatientId]);

    const filteredFoodLibrary = useMemo(() => {
        return foodLibraryData.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const { totalCalories, totalProtein } = useMemo(() => {
        return dailyPlan.reduce(
            (totals, item) => {
                totals.totalCalories += item.food.calories;
                totals.totalProtein += item.food.protein;
                return totals;
            },
            { totalCalories: 0, totalProtein: 0 }
        );
    }, [dailyPlan]);

    const meals = useMemo(() => {
        const mealMap: { [key in MealType]: FoodLibraryItem[] } = {
            Breakfast: [],
            Lunch: [],
            Dinner: [],
            Snacks: [],
        };
        dailyPlan.forEach(item => {
            mealMap[item.meal].push(item.food);
        });
        return mealMap;
    }, [dailyPlan]);

    useEffect(() => {
        if (isGeneratingPdf && selectedPatient) {
            const generatePdf = async () => {
                const reportElement = dietPdfRef.current;
                if (!(window as any).jspdf || !(window as any).html2canvas) {
                    alert("PDF generation library is not loaded yet. Please try again in a moment.");
                    setIsGeneratingPdf(false);
                    return;
                }
                if (reportElement) {
                    const { jsPDF } = (window as any).jspdf;
                    const html2canvas = (window as any).html2canvas;
                    const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Diet_Plan_${selectedPatient.name.replace(/\s+/g, '_')}.pdf`);
                }
                setIsGeneratingPdf(false);
            };
            const timer = setTimeout(generatePdf, 100);
            return () => clearTimeout(timer);
        }
    }, [isGeneratingPdf, selectedPatient, totalCalories, totalProtein, meals]);

    const handleAddItem = (food: FoodLibraryItem) => {
        const newItem: PlanItem = {
            food,
            meal: activeMeal,
            uniqueId: Date.now() + Math.random(),
        };
        setDailyPlan(prevPlan => [...prevPlan, newItem]);
    };
    
    const handleRemoveItem = (uniqueId: number) => {
        setDailyPlan(prevPlan => prevPlan.filter(item => item.uniqueId !== uniqueId));
    };

    const handleClearAll = () => {
        setDailyPlan([]);
    };

    const handleSendPlan = (patient: Patient) => {
        setShowPatientModal(false);
        const dietPlan: DietPlan = { totalCalories, totalProtein, meals };
        onSendMessage(patient.id, "Here's your personalized diet plan.", 'doctor', 'diet', dietPlan);
        alert(`Diet plan sent to ${patient.name}!`);
        handleClearAll();
    };

    const handleGeneratePlan = async () => {
        const selectedPatient = patients.find(p => p.id === selectedPatientId);
        if (!selectedPatient) {
            setGenerationError("Please select a patient.");
            return;
        }
        setIsGenerating(true);
        setGenerationError(null);
        try {
            const mockProfiles = [
                { prakriti: 'Vata - Pitta', vikriti: 'Pitta' },
                { prakriti: 'Pitta - Kapha', vikriti: 'Kapha' },
                { prakriti: 'Kapha - Vata', vikriti: 'Vata' },
            ];
            const patientProfile = mockProfiles[selectedPatient.id % mockProfiles.length];
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are an expert Ayurvedic dietitian. Create a personalized daily diet plan for a patient.
                Patient Profile: Prakriti is ${patientProfile.prakriti}, current imbalance (Vikriti) is ${patientProfile.vikriti}.
                Dietary Goals: ${dietaryGoals}.
                Target Calories: Approximately ${targetCalories} kcal.
                The plan should include meals for Breakfast, Lunch, Dinner, and Snacks.
                For each food item in each meal, provide its name, estimated calories (number), and protein (number in grams).
            `;
            const foodItemSchema = { type: Type.OBJECT, properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER } }, required: ["name", "calories", "protein"] };
            const schema = { type: Type.OBJECT, properties: { Breakfast: { type: Type.ARRAY, items: foodItemSchema }, Lunch: { type: Type.ARRAY, items: foodItemSchema }, Dinner: { type: Type.ARRAY, items: foodItemSchema }, Snacks: { type: Type.ARRAY, items: foodItemSchema } } };

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema } });
            const resultJson = JSON.parse(response.text);
            const newPlan: PlanItem[] = [];
            Object.entries(resultJson).forEach(([mealType, items]) => {
                if (Array.isArray(items)) {
                    items.forEach((item: any) => {
                        const foodItem: FoodLibraryItem = { id: Date.now() + Math.random(), name: item.name, calories: item.calories, protein: item.protein, prakriti: 'Tridoshic', rasa: 'Varies' };
                        newPlan.push({ food: foodItem, meal: mealType as MealType, uniqueId: Date.now() + Math.random() });
                    });
                }
            });
            setDailyPlan(newPlan);
        } catch (err) {
            console.error("AI plan generation failed:", err);
            setGenerationError("Sorry, the AI couldn't generate a plan. Please check your goals or try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateRecipe = async (mealType: MealType, items: FoodLibraryItem[]) => {
        if (!selectedPatientId) {
            alert("Please ensure a patient is selected before generating a recipe.");
            return;
        }
        setGeneratingRecipeFor(mealType);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const ingredientsList = items.map(i => i.name).join(', ');
            const prompt = `Create a simple, healthy, and quick-to-prepare Ayurvedic recipe for ${mealType.toLowerCase()} using these ingredients: ${ingredientsList}. The recipe should be generally balancing. Provide a title, a list of ingredients with quantities, and step-by-step instructions.`;
            
            const schema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["title", "ingredients", "instructions"]
            };

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: schema }});
            const recipeData = JSON.parse(response.text);

            const newRecipe: GeneratedRecipe = {
                id: Date.now(),
                patientId: selectedPatientId,
                mealType,
                ...recipeData
            };
            onRecipeGenerated(newRecipe);

        } catch(err) {
            console.error("Recipe generation failed:", err);
            alert(`Could not generate a recipe for ${mealType}. Please try again.`);
        } finally {
            setGeneratingRecipeFor(null);
        }
    };

    return (
        <>
            {isGeneratingPdf && selectedPatient && (
                <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px', backgroundColor: 'white' }}>
                    <div ref={dietPdfRef}>
                        <PrintableDietPlan patient={selectedPatient} dietPlan={{ totalCalories, totalProtein, meals }} />
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-4 h-[calc(100vh-140px)] bg-slate-50">
                <div className="lg:col-span-3 flex flex-col gap-6 h-full">
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <h2 className="text-xl font-bold mb-3">Generate Plan with AI</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Patient</label>
                                <select value={selectedPatientId ?? ''} onChange={(e) => setSelectedPatientId(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Target Daily Calories</label>
                                    <input type="number" value={targetCalories} onChange={e => setTargetCalories(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
                                </div>
                                <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Dietary Goals</label>
                                <input type="text" value={dietaryGoals} onChange={e => setDietaryGoals(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
                            </div>
                            </div>
                            <button onClick={handleGeneratePlan} disabled={isGenerating} className="w-full py-2.5 bg-[#386641] text-white font-semibold rounded-lg hover:bg-[#2c5134] transition-colors disabled:bg-slate-300 disabled:cursor-wait">
                                {isGenerating ? 'Generating...' : 'Generate Plan'}
                            </button>
                            {generationError && <p className="text-sm text-red-600 text-center mt-2">{generationError}</p>}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md flex flex-col flex-grow h-0 min-h-[300px]">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-bold mb-3">Food Library</h2>
                            <div className="relative">
                                <input type="text" placeholder="Search for a food..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg" />
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 sticky top-0">
                                    <tr>
                                        <th className="p-3 font-semibold">FOOD</th>
                                        <th className="p-3 font-semibold">PRAKRITI</th>
                                        <th className="p-3 font-semibold hidden md:table-cell">RASA</th>
                                        <th className="p-3 font-semibold">NUTRITION (CAL/PROT)</th>
                                        <th className="p-3 font-semibold text-center">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredFoodLibrary.map(item => (
                                        <tr key={item.id}>
                                            <td className="p-3 font-semibold">{item.name}</td>
                                            <td className="p-3"><span className={`px-2 py-1 text-xs font-bold rounded-full ${prakritiColors[item.prakriti]}`}>{item.prakriti}</span></td>
                                            <td className="p-3 text-slate-600 hidden md:table-cell">{item.rasa}</td>
                                            <td className="p-3 text-slate-600">{item.calories} / {item.protein}g</td>
                                            <td className="p-3 text-center"><button onClick={() => handleAddItem(item)} className="text-green-600 hover:text-green-800"><PlusCircleSolidIcon className="h-7 w-7" /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col h-full">
                    <div className="p-4 border-b flex justify-between items-center"><h2 className="text-xl font-bold">Your Daily Plan</h2><button onClick={handleClearAll} className="text-sm font-semibold text-red-500 hover:text-red-700">Clear All</button></div>
                    <div className="p-4 bg-green-50"><div className="flex justify-around text-center"><div><p className="text-sm text-slate-600">Total Calories</p><p className="font-bold text-2xl text-green-800">{totalCalories}</p></div><div><p className="text-sm text-slate-600">Total Protein</p><p className="font-bold text-2xl text-green-800">{totalProtein.toFixed(1)}g</p></div></div></div>
                    <div className="p-3 border-b"><div className="flex gap-2">{(['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as MealType[]).map(meal => (<button key={meal} onClick={() => setActiveMeal(meal)} className={`px-3 py-1.5 text-sm font-semibold rounded-full ${activeMeal === meal ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>{meal}</button>))}</div></div>

                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                        {dailyPlan.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-slate-400"><p>Add items from the library or generate a plan.</p></div>
                        ) : (
                            Object.entries(meals).map(([mealType, items]) => {
                                if (!Array.isArray(items) || items.length === 0) return null;
                                return(
                                    <div key={mealType}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold">{mealType}</h3>
                                            <button 
                                                onClick={() => handleGenerateRecipe(mealType as MealType, items)}
                                                disabled={generatingRecipeFor === mealType}
                                                className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full hover:bg-green-200 disabled:opacity-50"
                                            >
                                                <RecipeIcon className="h-4 w-4" />
                                                {generatingRecipeFor === mealType ? 'Generating...' : 'Generate Recipe'}
                                            </button>
                                        </div>
                                        <ul className="space-y-2">
                                            {dailyPlan.filter(i => i.meal === mealType).map(item => (
                                                <li key={item.uniqueId} className="flex justify-between items-center bg-slate-50 p-2 rounded-md text-sm">
                                                    <span>{item.food.name} <span className="text-slate-500">({item.food.calories} kcal)</span></span>
                                                    <button onClick={() => handleRemoveItem(item.uniqueId)} className="text-slate-400 hover:text-red-500"><MinusCircleIcon className="h-5 w-5" /></button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    <div className="p-4 border-t flex flex-col sm:flex-row gap-2">
                        <button onClick={() => setShowPatientModal(true)} disabled={dailyPlan.length === 0} className="w-full py-3 bg-[#386641] text-white font-bold rounded-lg hover:bg-[#2c5134] transition-colors disabled:bg-slate-300">
                            Send Plan
                        </button>
                         <button
                            onClick={() => { if(selectedPatient) setIsGeneratingPdf(true) }}
                            disabled={dailyPlan.length === 0 || isGeneratingPdf || !selectedPatient}
                            className="w-full py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors disabled:bg-slate-300 flex items-center justify-center gap-2"
                        >
                            <DocumentReportIcon className="h-5 w-5" />
                            {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
                        </button>
                    </div>
                </div>

                {showPatientModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
                            <div className="p-4 border-b flex justify-between items-center"><h3 className="font-bold">Select a Patient</h3><button onClick={() => setShowPatientModal(false)}><XIcon className="w-5 h-5" /></button></div>
                            <ul className="p-2 max-h-60 overflow-y-auto">
                                {patients.map(p => (
                                    <li key={p.id} onClick={() => handleSendPlan(p)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
                                        <img src={p.photoUrl} alt={p.name} className="h-10 w-10 rounded-full" />
                                        <span className="font-semibold">{p.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default DoctorDietPlanView;