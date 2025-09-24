import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Patient, DietPlan, FoodLibraryItem, UserProfile } from '../types';
import { AyurVardanLogo } from './icons/AyurVardanLogo';

interface HealthReportProps {
    patient: Patient;
    dietPlan?: DietPlan;
    userProfile: UserProfile | null;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl font-bold text-slate-800 border-b-2 border-[#386641] pb-2 mb-4">{children}</h2>
);

const HealthReport: React.FC<HealthReportProps> = ({ patient, dietPlan, userProfile }) => {
    const formattedWeightData = patient.progress?.weightHistory.map(d => ({ ...d, date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }));
    const formattedSymptomData = patient.progress?.symptomLog.map(d => ({ ...d, date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }));

    return (
        <div className="p-10 font-sans text-sm bg-white text-slate-800">
            {/* Header */}
            <header className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                    <AyurVardanLogo className="h-16 w-16" />
                    <div>
                         <h1 className="text-3xl font-bold text-[#386641]">
                            Ayur<span className="text-[#603808]">Vardan</span>
                        </h1>
                        <p className="text-slate-500">Personalized Health Report</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg">{patient.name}</p>
                    <p className="text-slate-600">{patient.age}, {patient.gender}</p>
                </div>
            </header>

            {/* Ayurvedic Profile Summary */}
            {userProfile && (
                 <section className="mt-8">
                    <SectionTitle>Ayurvedic Profile Summary</SectionTitle>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-700">Prakriti (Constitution)</h3>
                            <p className="text-2xl font-semibold text-green-700 mt-1">{userProfile.prakriti}</p>
                            <p className="text-xs text-slate-500 mt-2">Your fundamental, unchanging mind-body constitution.</p>
                        </div>
                        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-700">Vikriti (Current Imbalance)</h3>
                            <p className="text-2xl font-semibold text-orange-600 mt-1">{userProfile.vikriti}</p>
                            <p className="text-xs text-slate-500 mt-2">Your current state of balance or imbalance, which can change over time.</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Consultation History */}
            <section className="mt-8">
                <SectionTitle>Consultation History</SectionTitle>
                <div className="space-y-4">
                    {patient.consultations.length > 0 ? patient.consultations.map(c => (
                        <div key={c.id} className="p-4 border border-slate-200 rounded-lg break-inside-avoid">
                            <p className="font-bold">Date: {new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p className="mt-2"><strong className="font-semibold text-slate-600">Symptoms:</strong> {c.symptoms.join(', ')}</p>
                            <p className="mt-1"><strong className="font-semibold text-slate-600">Doctor's Notes:</strong> {c.notes}</p>
                        </div>
                    )) : <p className="text-slate-500">No consultation records available.</p>}
                </div>
            </section>

            {/* Health Progress */}
            {patient.progress && (
                <section className="mt-8 break-before-page">
                    <SectionTitle>Health Progress</SectionTitle>
                    <div className="space-y-8">
                        <div className="p-4 border border-slate-200 rounded-lg">
                            <h3 className="font-semibold text-center text-lg mb-2">Diet Plan Adherence (%)</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={patient.progress.dietAdherence} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[0, 100]} unit="%" />
                                    <Tooltip />
                                    <Bar dataKey="adherence" fill="#3b82f6" name="Adherence %" isAnimationActive={false} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="p-4 border border-slate-200 rounded-lg">
                            <h3 className="font-semibold text-center text-lg mb-2">Weight Trend (kg)</h3>
                             <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={formattedWeightData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="weight" stroke="#16a34a" name="Weight (kg)" isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="p-4 border border-slate-200 rounded-lg">
                            <h3 className="font-semibold text-center text-lg mb-2">Symptom Log (Severity)</h3>
                             <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={formattedSymptomData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[0, 5]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="severity" stroke="#dc2626" name={patient.progress.symptomLog[0]?.symptom || 'Symptom'} isAnimationActive={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>
            )}

            {/* Diet Plan */}
            {dietPlan && (
                <section className="mt-8 break-before-page">
                    <SectionTitle>Prescribed Diet Plan</SectionTitle>
                    <div className="border border-slate-200 rounded-lg p-4">
                        <div className="bg-green-50 p-3 rounded-lg mb-4 text-center">
                            <div className="flex justify-around">
                                <div><p className="text-xs text-slate-600">Total Calories</p><p className="font-bold text-lg text-green-800">{dietPlan.totalCalories}</p></div>
                                <div><p className="text-xs text-slate-600">Total Protein</p><p className="font-bold text-lg text-green-800">{dietPlan.totalProtein.toFixed(1)}g</p></div>
                            </div>
                        </div>
                         <div className="space-y-4">
                            {Object.entries(dietPlan.meals).map(([mealType, items]) => {
                                if (!Array.isArray(items) || items.length === 0) return null;
                                return (
                                    <div key={mealType}>
                                        <h4 className="font-bold text-green-700 mb-1">{mealType}</h4>
                                        <ul className="list-disc list-inside ml-4">
                                            {items.map((item: FoodLibraryItem) => (
                                                <li key={item.id}>
                                                    {item.name} <span className="text-slate-500 text-xs">({item.calories} kcal, {item.protein}g protein)</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

             {/* Footer */}
            <footer className="mt-10 text-center text-xs text-slate-400 border-t border-slate-200 pt-4">
                Generated on {new Date().toLocaleDateString()}. This report is for informational purposes only and does not replace professional medical advice.
            </footer>
        </div>
    );
};

export default HealthReport;
