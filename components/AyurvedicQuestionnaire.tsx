import React, { useState, useMemo, useEffect } from 'react';
import { questionnaireData } from '../data/questionnaireData';
import type { Question, QuestionOption } from '../data/questionnaireData';
import { XIcon } from './icons/XIcon';
import type { Patient, UserProfile } from '../types';


interface AyurvedicQuestionnaireProps {
    patient: Patient;
    onComplete: (profile: UserProfile) => void;
    onClose: () => void;
}

const allQuestions = questionnaireData.flatMap(section =>
    section.questions.map(q => ({ ...q, sectionTitle: section.title, sectionId: section.id }))
);

const AyurvedicQuestionnaire: React.FC<AyurvedicQuestionnaireProps> = ({ patient, onComplete, onClose }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
    });
    const [animationClass, setAnimationClass] = useState('opacity-0');
    const [slideDirection, setSlideDirection] = useState<'right' | 'left' | 'none'>('none');

    useEffect(() => {
        // Fade in the whole questionnaire on mount
        setAnimationClass('opacity-100');
    }, []);

    useEffect(() => {
        if (slideDirection !== 'none') {
            const timer = setTimeout(() => setSlideDirection('none'), 300); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [slideDirection]);

    const calculateDoshas = (answers: Record<string, any>): { prakriti: string; vikriti: string } => {
        const prakritiScores: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 };
        const vikritiScores: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0 };

        allQuestions.forEach(q => {
            const answer = answers[q.id];
            if (!answer || !q.options || (q.sectionId !== 'prakriti' && q.sectionId !== 'vikriti')) return;

            const scores = q.sectionId === 'prakriti' ? prakritiScores : vikritiScores;

            if (q.type === 'single-choice') {
                const selectedOption = q.options.find(opt => opt.text === answer);
                if (selectedOption?.dosha) {
                    scores[selectedOption.dosha]++;
                }
            } else if (q.type === 'multiple-choice' && Array.isArray(answer)) {
                answer.forEach(ansText => {
                    const selectedOption = q.options.find(opt => opt.text === ansText);
                    if (selectedOption?.dosha) {
                        scores[selectedOption.dosha]++;
                    }
                });
            }
        });

        const getDominantDosha = (scores: Record<string, number>): string => {
            const maxScore = Math.max(...Object.values(scores));
            if (maxScore === 0) return 'Balanced';
            const dominant = Object.keys(scores).filter(key => scores[key] === maxScore);
            return dominant.join(' - ');
        };

        return {
            prakriti: getDominantDosha(prakritiScores),
            vikriti: getDominantDosha(vikritiScores),
        };
    };
    
    const handleNext = () => {
        if (currentQuestionIndex === allQuestions.length - 1) {
            const { prakriti, vikriti } = calculateDoshas(formData);
            const fullProfile: UserProfile = {
                name: formData['name'] || '',
                age: parseInt(formData['age'], 10) || 0,
                gender: formData['gender'] || 'Other',
                weight: formData['weight'] ? parseInt(formData['weight'], 10) : undefined,
                prakriti,
                vikriti,
            };
            setAnimationClass('opacity-0');
            setTimeout(() => onComplete(fullProfile), 300);
            return;
        }

        setSlideDirection('left');
        setTimeout(() => {
             if (currentQuestionIndex < allQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }, 150);
    };

    const handleBack = () => {
        setSlideDirection('right');
        setTimeout(() => {
            if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
            }
        }, 150);
    };

    const handleAnswerChange = (questionId: string, value: string | string[] | number) => {
        setFormData(prev => ({ ...prev, [questionId]: value }));
    };

    const handleClose = () => {
        setAnimationClass('opacity-0');
        setTimeout(onClose, 300); // Call onClose after fade out
    };

    const currentQuestion = allQuestions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
    
    const getAnimationClass = () => {
        if (slideDirection === 'left') return 'opacity-0 -translate-x-8';
        if (slideDirection === 'right') return 'opacity-0 translate-x-8';
        return 'opacity-100 translate-x-0';
    }


    return (
        <div className={`fixed inset-0 bg-slate-50 z-50 flex flex-col p-4 overflow-hidden transition-opacity duration-300 ${animationClass}`}>
            <div className="flex items-center">
                <div className="w-full bg-slate-200 rounded-full h-2.5 my-4">
                    <div className="bg-[#6A994E] h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <button onClick={handleClose} className="ml-4 p-2 rounded-full flex-shrink-0 hover:bg-slate-200 transition-colors">
                    <XIcon className="w-6 h-6 text-slate-600" />
                </button>
            </div>
            
            <div className={`flex-grow flex flex-col transition-all duration-300 ${getAnimationClass()}`}>
                <p className="text-sm font-semibold text-[#6A994E] mb-2">{currentQuestion.sectionTitle}</p>
                <QuestionInput
                    key={currentQuestion.id}
                    question={currentQuestion}
                    value={formData[currentQuestion.id]}
                    onChange={handleAnswerChange}
                    isPersonalDetail={currentQuestion.sectionId === 'onboarding'}
                />
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between items-center">
                {currentQuestionIndex > 0 ? (
                     <button onClick={handleBack} className="px-6 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                        Back
                    </button>
                ) : <div />}
                <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-[#386641] text-white font-semibold rounded-lg hover:bg-[#2c5134] transition-colors"
                >
                    {currentQuestionIndex === allQuestions.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
};

interface QuestionInputProps {
    question: Question;
    value: any;
    onChange: (questionId: string, value: any) => void;
    isPersonalDetail?: boolean;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ question, value, onChange, isPersonalDetail }) => {
    return (
        <div className="flex-grow flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-8">{question.text}</h2>
            <div>
                {question.type === 'single-choice' && (
                    <div className="grid grid-cols-1 gap-3">
                        {question.options?.map(option => (
                            <button
                                key={option.text}
                                onClick={() => onChange(question.id, option.text)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${value === option.text ? 'bg-[#E9F5DB] border-[#6A994E]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                disabled={isPersonalDetail}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                )}
                {question.type === 'multiple-choice' && (
                     <div className="space-y-3">
                        {question.options?.map(option => {
                            const currentValues: string[] = value || [];
                             const handleMultiChoiceChange = (optText: string) => {
                                const newValues = currentValues.includes(optText)
                                    ? currentValues.filter(item => item !== optText)
                                    : [...currentValues, optText];
                                onChange(question.id, newValues);
                            };
                            return (
                               <label key={option.text} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${currentValues.includes(option.text) ? 'bg-[#E9F5DB] border-[#6A994E]' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                                    <input
                                        type="checkbox"
                                        checked={currentValues.includes(option.text)}
                                        onChange={() => handleMultiChoiceChange(option.text)}
                                        className="h-5 w-5 rounded border-gray-300 text-[#6A994E] focus:ring-[#A7C957]"
                                    />
                                    <span className="ml-3 text-slate-800">{option.text}</span>
                                </label>
                            );
                        })}
                    </div>
                )}
                {(question.type === 'text' || question.type === 'number') && (
                     <input
                        type={question.type === 'number' ? 'text' : 'text'}
                        inputMode={question.type === 'number' ? 'numeric' : 'text'}
                        id={question.id}
                        value={value || ''}
                        onChange={(e) => {
                            let val = e.target.value;
                            if (question.type === 'number') {
                                // Allow only positive integers by removing non-digit characters
                                val = val.replace(/\D/g, '');
                            }
                            onChange(question.id, val);
                        }}
                        className="w-full text-2xl p-3 border-b-2 border-slate-300 focus:border-[#6A994E] focus:outline-none transition bg-transparent disabled:bg-slate-100 disabled:text-slate-500"
                        placeholder={question.placeholder}
                        autoFocus
                        disabled={isPersonalDetail && question.id !== 'weight'}
                     />
                )}
                {question.type === 'textarea' && (
                    <textarea
                        id={question.id}
                        value={value || ''}
                        onChange={(e) => onChange(question.id, e.target.value)}
                        className="w-full h-32 p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-[#6A994E] focus:border-[#6A994E] transition bg-white"
                        placeholder={question.placeholder || "Type your answer here..."}
                    />
                )}
            </div>
        </div>
    )
}

export default AyurvedicQuestionnaire;