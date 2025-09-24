import React, { useEffect, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Patient } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface PatientDashboardProps {
    patient: Patient;
}

const ChartCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
            {icon}
            <h3 className="text-lg font-bold text-slate-700">{title}</h3>
        </div>
        <div className="h-48">
            {children}
        </div>
    </div>
);

const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient }) => {
    const [aiInsight, setAiInsight] = useState<string>('');
    const [isLoadingInsight, setIsLoadingInsight] = useState<boolean>(true);

    useEffect(() => {
        const fetchInsight = async () => {
            if (!patient.progress) {
                setAiInsight("No progress data available to analyze.");
                setIsLoadingInsight(false);
                return;
            }
            setIsLoadingInsight(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                const progressSummary = `
                    Patient: ${patient.name}
                    Diet Adherence (%): ${JSON.stringify(patient.progress.dietAdherence)}
                    Weight History (kg): ${JSON.stringify(patient.progress.weightHistory)}
                    Symptom Log (1-5 severity): ${JSON.stringify(patient.progress.symptomLog)}
                `;

                const prompt = `Analyze the following patient progress data. Provide a brief, encouraging summary for the dietitian and suggest one small, actionable tweak to their diet or lifestyle plan. Keep the tone professional and concise.
                ${progressSummary}
                `;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                setAiInsight(response.text);

            } catch (error) {
                console.error("Failed to fetch AI insight:", error);
                setAiInsight("Could not generate AI summary at this time.");
            } finally {
                setIsLoadingInsight(false);
            }
        };

        fetchInsight();
    }, [patient]);

    if (!patient.progress) {
        return (
            <div className="p-4 text-center bg-white rounded-xl shadow-sm animate-fade-in">
                <p className="text-slate-500">No progress data has been logged for this patient yet.</p>
            </div>
        );
    }
    
    // Format data for charts
    const formattedWeightData = patient.progress.weightHistory.map(d => ({...d, date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}));
    const formattedSymptomData = patient.progress.symptomLog.map(d => ({...d, date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}));


    return (
        <div className="p-4 space-y-4 animate-fade-in">
            <div className="bg-gradient-to-r from-green-100 via-blue-50 to-purple-100 p-4 rounded-xl shadow-md">
                <div className="flex items-start gap-3">
                    <SparklesIcon className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">AI-Powered Insight</h3>
                        {isLoadingInsight ? (
                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
                            </div>
                        ) : (
                            <p className="text-slate-700 mt-1 text-sm">{aiInsight}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChartCard title="Diet Plan Adherence" icon={<BarChartIcon className="h-6 w-6 text-blue-600" />}>
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={patient.progress.dietAdherence} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} unit="%" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="adherence" fill="#3b82f6" name="Adherence %" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Weight Trend (kg)" icon={<TrendingUpIcon className="h-6 w-6 text-green-600" />}>
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedWeightData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="weight" stroke="#16a34a" name="Weight (kg)" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
                
                 <ChartCard title="Symptom Log" icon={<TrendingUpIcon className="h-6 w-6 text-red-600 rotate-90" />}>
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedSymptomData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 5]} label={{ value: 'Severity', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="severity" stroke="#dc2626" name={patient.progress.symptomLog[0]?.symptom || 'Symptom'} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
};

export default PatientDashboard;