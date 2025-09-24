import React, { useMemo, useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { doctors as allDoctors } from '../data/mockData';
import type { Patient, Doctor, Review, YogaAsana, UpcomingAppointment, ChatMessage, Product, DietPlan, FoodLibraryItem, Herb, BlogPost, CommunityPost, CommunityComment, UserProfile } from '../types';
import type { CallState } from '../App';
import { HomeIcon } from '../components/icons/HomeIcon';
import { ShopIcon } from '../components/icons/ShopIcon';
import { ConsultIcon } from '../components/icons/ConsultIcon';
import { DietIcon } from '../components/icons/DietIcon';
import { GoogleHealthIcon } from '../components/icons/GoogleHealthIcon';
import AyurvedicQuestionnaire from '../components/AyurvedicQuestionnaire';
import { AyurVardanLogo } from '../components/icons/AyurVardanLogo';
import { CycleIcon } from '../components/icons/CycleIcon';
import { AirIcon } from '../components/icons/dosha/AirIcon';
import { EtherIcon } from '../components/icons/dosha/EtherIcon';
import { FireIcon } from '../components/icons/dosha/FireIcon';
import { WaterIcon } from '../components/icons/dosha/WaterIcon';
import { EarthIcon } from '../components/icons/dosha/EarthIcon';
import { XIcon } from '../components/icons/XIcon';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';
import { LogSymptomsIcon } from '../components/icons/LogSymptomsIcon';
import { OvulationIcon } from '../components/icons/OvulationIcon';
import { products as allProducts, filters } from '../data/shopData';
import { SearchIcon } from '../components/icons/SearchIcon';
import { CameraIcon } from '../components/icons/CameraIcon';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { LocationIcon } from '../components/icons/LocationIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { YogaIcon } from '../components/icons/YogaIcon';
import { yogaAsanas } from '../data/yogaData';
import { SendIcon } from '../components/icons/SendIcon';
import { VideoOnIcon } from '../components/icons/VideoOnIcon';
import { AudioCallIcon } from '../components/icons/AudioCallIcon';
import { UploadIcon } from '../components/icons/UploadIcon';
// FIX: Changed to a named import since DietView does not have a default export.
import { DietView } from './DietView';
import { BenefitIcon } from '../components/icons/BenefitIcon';
import { TimeIcon } from '../components/icons/TimeIcon';
import { RepeatIcon } from '../components/icons/RepeatIcon';
import { herbsData } from '../data/herbsData';
import { blogData } from '../data/blogData';
import { communityPostsData } from '../data/communityData';
import HerbDetailsModal from '../components/HerbDetailsModal';
import BlogModal from '../components/BlogModal';
import CommunityModal from '../components/CommunityModal';
import Chatbot from '../components/Chatbot';
import { HerbsIcon } from '../components/icons/HerbsIcon';
import { BlogIcon } from '../components/icons/BlogIcon';
import { CommunityIcon } from '../components/icons/CommunityIcon';
import { ChatbotIcon } from '../components/icons/ChatbotIcon';
import { CalculatorIcon } from '../components/icons/CalculatorIcon';
import { DocumentReportIcon } from '../components/icons/DocumentReportIcon';
import HealthReport from '../components/HealthReport';
import PrintableDietPlan from '../components/PrintableDietPlan';


type PatientTab = 'Home' | 'Diet' | 'Consult' | 'Yoga' | 'Shop';

interface PatientViewProps {
    patient: Patient;
    onAddToCart: (product: Product) => void;
    upcomingAppointment: UpcomingAppointment | null;
    onSendMessage: (text: string, type: 'text' | 'image' | 'document', data?: any) => void;
    onBookAppointment: (doctor: Doctor, details: { date: string; time: string }) => void;
    onCancelAppointment: () => void;
    callState: CallState;
    onInitiateCall: (doctorId: number, type: 'video' | 'audio') => void;
    onRequestCallback: (doctorId: number) => void;
}

const navItems: { name: PatientTab, icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { name: 'Home', icon: HomeIcon },
    { name: 'Diet', icon: DietIcon },
    { name: 'Consult', icon: ConsultIcon },
    { name: 'Yoga', icon: YogaIcon },
    { name: 'Shop', icon: ShopIcon },
];

const ConnectHealth: React.FC<{ onConnect: () => void }> = ({ onConnect }) => (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <GoogleHealthIcon className="h-8 w-8 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-slate-800">Sync Health Data</h3>
                <p className="text-sm text-slate-500">Connect to view live vitals.</p>
            </div>
        </div>
        <button
            onClick={onConnect}
            className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-900 transition-colors whitespace-nowrap"
        >
            Connect
        </button>
    </div>
);

const CircularProgress: React.FC<{ progress: number; size: number; strokeWidth: number; color: string }> = ({ progress, size, strokeWidth, color }) => {
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#E5E5E5"
                strokeWidth={strokeWidth}
                fill="transparent"
            />
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
            />
        </svg>
    );
};

const NutritionDashboard: React.FC = () => {
    const steps = 8150;
    const stepGoal = 10000;
    const stepProgress = (steps / stepGoal) * 100;

    const sleepHours = 7.7;
    const sleepGoal = 8;
    const sleepProgress = (sleepHours / sleepGoal) * 100;
    
    const heartRate = 72;
    const heartRateGoal = 100; // Example goal/max for progress bar
    const heartRateProgress = (heartRate/heartRateGoal) * 100;
    
    const spo2 = 98;
    const spo2Goal = 100;
    const spo2Progress = (spo2 / spo2Goal) * 100;

    return (
        <div className="bg-[#A7C957] p-4 rounded-xl shadow-md text-white">
            <div className="flex justify-center items-center">
                <div className="relative w-36 h-36">
                    <CircularProgress progress={stepProgress} size={144} strokeWidth={12} color="#FACC15" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-slate-800">{steps.toLocaleString()}</span>
                        <span className="text-sm text-slate-600">of {stepGoal/1000}k steps</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-x-4 text-center">
                <div>
                    <p className="font-semibold text-sm text-slate-800">Heart Rate</p>
                    <div className="bg-white/30 rounded-full h-2 my-1">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${heartRateProgress}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{heartRate} bpm</p>
                </div>
                <div>
                    <p className="font-semibold text-sm text-slate-800">Sleep</p>
                    <div className="bg-white/30 rounded-full h-2 my-1">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${sleepProgress}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{sleepHours} / {sleepGoal}h</p>
                </div>
                 <div>
                    <p className="font-semibold text-sm text-slate-800">SpO2</p>
                    <div className="bg-white/30 rounded-full h-2 my-1">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${spo2Progress}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{spo2}%</p>
                </div>
            </div>
        </div>
    );
};

const KnowYourPrakritiCard: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <AyurVardanLogo className="h-16 w-16 mx-auto mb-4 text-[#386641]" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Know your Prakriti & Vikriti</h2>
        <p className="text-slate-500 mb-4 text-sm max-w-xs mx-auto">
            Take a short assessment to discover your unique mind-body constitution and current imbalances.
        </p>
        <button
            onClick={onStart}
            className="w-full max-w-xs mx-auto px-6 py-2.5 bg-[#386641] text-white font-semibold rounded-lg hover:bg-[#2c5134] transition-colors"
        >
            Start Assessment
        </button>
    </div>
);

const AyurvedicProfileSummaryCard: React.FC<{ prakriti: string; vikriti: string; onLearnMore: () => void; }> = ({ prakriti, vikriti, onLearnMore }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Ayurvedic Profile</h3>
                    <p className="text-xs text-slate-500">Prakriti: <span className="font-bold text-slate-700">{prakriti}</span> | Vikriti: <span className="font-bold text-slate-700">{vikriti}</span></p>
                </div>
                 <button
                    onClick={onLearnMore}
                    className="px-4 py-2 bg-[#E9F5DB] text-[#386641] font-semibold rounded-lg hover:bg-[#dbecc6] transition-colors text-sm whitespace-nowrap"
                >
                    Learn More
                </button>
            </div>
        </div>
    );
};

const doshaInfo: { [key: string]: { icons: React.FC<React.SVGProps<SVGSVGElement>>[]; description: string; color: string; } } = {
    Vata: {
        icons: [AirIcon, EtherIcon],
        description: "Governs movement and communication. Associated with elements of air and ether. Qualities are light, dry, and cool.",
        color: "bg-gray-100 text-gray-800",
    },
    Pitta: {
        icons: [FireIcon],
        description: "Governs digestion and transformation. Associated with elements of fire and water. Qualities are hot, sharp, and oily.",
        color: "bg-orange-100 text-orange-800",
    },
    Kapha: {
        icons: [WaterIcon, EarthIcon],
        description: "Governs structure and lubrication. Associated with elements of earth and water. Qualities are heavy, slow, and cool.",
        color: "bg-green-100 text-green-800",
    },
};

const DoshaCard: React.FC<{ doshaName: string }> = ({ doshaName }) => {
    const info = doshaInfo[doshaName as keyof typeof doshaInfo];
    if (!info) return null;

    return (
        <div className={`p-4 rounded-lg ${info.color}`}>
            <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                    {info.icons.map((Icon, index) => <Icon key={index} className="h-8 w-8" />)}
                </div>
                <h3 className="text-xl font-bold">{doshaName}</h3>
            </div>
            <p className="mt-2 text-sm">{info.description}</p>
        </div>
    );
};


const ProfileDetailsView: React.FC<{ prakriti: string; vikriti: string; onClose: () => void; }> = ({ prakriti, vikriti, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 animate-fade-in">
        <div className="bg-slate-50 rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative text-center">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 transition-colors z-10">
                <XIcon className="w-6 h-6 text-slate-600" />
            </button>
             <h1 className="text-3xl font-bold text-[#386641] mb-2">Your Ayurvedic Profile</h1>
             <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              This is a summary of your core constitution (Prakriti) and current state of imbalance (Vikriti).
            </p>

            <div className="space-y-6 text-left">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Prakriti (Your Constitution)</h2>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                   <p className="text-lg font-semibold text-center text-[#6A994E] mb-3">{prakriti}</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {prakriti.split(' - ').map(dosha => <DoshaCard key={dosha} doshaName={dosha} />)}
                   </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Vikriti (Your Current Imbalance)</h2>
                 <div className="bg-white p-4 rounded-xl shadow-sm">
                   <p className="text-lg font-semibold text-center text-[#6A994E] mb-3">{vikriti}</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {vikriti !== 'Balanced' ? vikriti.split(' - ').map(dosha => <DoshaCard key={dosha} doshaName={dosha} />) : <p className="text-center col-span-3 py-4 text-slate-500">Your current state appears balanced.</p>}
                   </div>
                </div>
              </div>
            </div>
        </div>
    </div>
  );
};

// --- MENSTRUAL TRACKER COMPONENTS ---

const TrackCycleCard: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <CycleIcon className="h-8 w-8 flex-shrink-0 text-pink-500" />
            <div>
                <h3 className="font-bold text-slate-800">Track Your Cycle</h3>
                <p className="text-sm text-slate-500">Log your period to see predictions.</p>
            </div>
        </div>
        <button
            onClick={onStart}
            className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-900 transition-colors whitespace-nowrap"
        >
            Start Tracking
        </button>
    </div>
);

const MenstrualSetupModal: React.FC<{ onSave: (data: { lastPeriodStart: string; cycleLength: number }) => void; onClose: () => void; }> = ({ onSave, onClose }) => {
    const [lastPeriodStart, setLastPeriodStart] = useState(new Date().toISOString().split('T')[0]);
    const [cycleLength, setCycleLength] = useState(28);

    const handleSave = () => {
        if (lastPeriodStart && cycleLength > 0) {
            onSave({ lastPeriodStart, cycleLength });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Cycle Tracking Setup</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="lastPeriodDate" className="block text-sm font-medium text-slate-600 mb-1">First day of your last period</label>
                        <input
                            type="date"
                            id="lastPeriodDate"
                            value={lastPeriodStart}
                            onChange={(e) => setLastPeriodStart(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="cycleLength" className="block text-sm font-medium text-slate-600 mb-1">Average cycle length (days)</label>
                        <input
                            type="number"
                            id="cycleLength"
                            value={cycleLength}
                            onChange={(e) => setCycleLength(parseInt(e.target.value, 10) || 0)}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                            min="1"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-[#386641] text-white text-sm font-semibold rounded-lg hover:bg-[#2c5134] transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};

const MenstrualSummaryCard: React.FC<{ cycleData: { lastPeriodStart: string; cycleLength: number }, onOpenDetails: () => void }> = ({ cycleData, onOpenDetails }) => {
    const { lastPeriodStart, cycleLength } = cycleData;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(lastPeriodStart + 'T00:00:00');
    const diffTime = today.getTime() - startDate.getTime();
    const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) % cycleLength + 1;
    
    const nextPeriodDate = new Date(startDate);
    nextPeriodDate.setDate(startDate.getDate() + cycleLength);
    const nextPeriodFormatted = nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return (
        <div onClick={onOpenDetails} className="bg-white p-4 rounded-xl shadow-md cursor-pointer active:bg-slate-50 transition-colors">
            <h3 className="font-bold text-slate-800 mb-2">Your Cycle</h3>
            <div className="flex justify-between items-center">
                <div className="text-center">
                    <p className="text-3xl font-bold text-pink-500">{currentDay}</p>
                    <p className="text-sm text-slate-500">Day</p>
                </div>
                 <div className="text-center">
                    <p className="text-lg font-bold text-slate-700">{nextPeriodFormatted}</p>
                    <p className="text-sm text-slate-500">Next Period</p>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-slate-400"/>
            </div>
        </div>
    );
};

const MenstrualDetailsModal: React.FC<{ cycleData: { lastPeriodStart: string; cycleLength: number }, onClose: () => void }> = ({ cycleData, onClose }) => {
    const { lastPeriodStart, cycleLength } = cycleData;
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

    const cycleInfo = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let mostRecentStartDate = new Date(lastPeriodStart + 'T00:00:00');
        while (mostRecentStartDate.getTime() + cycleLength * 24 * 60 * 60 * 1000 < today.getTime()) {
            mostRecentStartDate.setDate(mostRecentStartDate.getDate() + cycleLength);
        }

        const diffTime = today.getTime() - mostRecentStartDate.getTime();
        const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        const nextPeriodDate = new Date(mostRecentStartDate);
        nextPeriodDate.setDate(mostRecentStartDate.getDate() + cycleLength);

        const daysUntilNextPeriod = Math.ceil((nextPeriodDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        const ovulationDay = Math.round(cycleLength - 14);
        const fertileStart = ovulationDay - 3;
        const fertileEnd = ovulationDay + 2;
        
        const nextOvulationDate = new Date(mostRecentStartDate);
        nextOvulationDate.setDate(mostRecentStartDate.getDate() + ovulationDay -1);

        const getPhase = (day: number) => {
             if (day >= 1 && day <= 5) return "Menstruation";
             if (day >= fertileStart && day <= fertileEnd) return "Fertile";
             if (day > 5 && day < fertileStart) return "Follicular";
             return "Luteal";
        };

        return { currentDay, daysUntilNextPeriod, ovulationDay, fertileStart, fertileEnd, getPhase, nextPeriodDate, nextOvulationDate, mostRecentStartDate };
    }, [lastPeriodStart, cycleLength]);
    
    useEffect(() => {
      if(cycleInfo) {
        setSelectedPhase(cycleInfo.getPhase(cycleInfo.currentDay))
      }
    }, [cycleInfo]);


    const phaseInfo: { [key: string]: { title: string; description: string; titleColor: string; } } = {
        Menstruation: {
            title: "Menstruation",
            description: "Your cycle begins with your period as the uterine lining is shed. It's common to experience cramps, bloating, and fatigue.",
            titleColor: "text-rose-600",
        },
        Follicular: {
            title: "Follicular Phase",
            description: "After your period, your body prepares for ovulation. Estrogen levels rise, which helps thicken the uterine lining and stimulates follicle growth.",
            titleColor: "text-purple-600",
        },
        Fertile: {
            title: "Fertile Window & Ovulation",
            description: "This is your most fertile time. A surge in hormones triggers the release of an egg from an ovary (ovulation). Conception chances are highest.",
            titleColor: "text-blue-600",
        },
        Luteal: {
            title: "Luteal Phase",
            description: "After ovulation, progesterone levels rise to prepare the uterus for a potential pregnancy. If not, hormone levels drop and a new cycle begins.",
            titleColor: "text-orange-600",
        },
    };

    const weekDays = useMemo(() => {
        const startOfWeek = new Date(viewDate);
        startOfWeek.setDate(startOfWeek.getDate() - viewDate.getDay()); // Start from Sunday
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    }, [viewDate]);

    const changeWeek = (direction: 'prev' | 'next') => {
        setViewDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
            return newDate;
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };
    
    const getPointOnCircle = (day: number) => {
        const angle = (day / cycleLength) * 360;
        const radian = (angle - 90) * (Math.PI / 180);
        const radius = 105;
        const cx = 125;
        const cy = 125;
        const x = cx + radius * Math.cos(radian);
        const y = cy + radius * Math.sin(radian);
        return { x, y };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-orange-50 rounded-2xl shadow-xl w-full max-w-sm max-h-[95vh] overflow-y-auto animate-fade-in flex flex-col">
                <div className="p-4 bg-white rounded-t-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeWeek('prev')} className="p-2 bg-rose-100 text-rose-600 rounded-full"><ChevronLeftIcon /></button>
                        <span className="font-bold text-slate-700 text-lg">{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => changeWeek('next')} className="p-2 bg-rose-100 text-rose-600 rounded-full"><ChevronRightIcon /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {weekDays.map(day => (
                            <div key={day.toISOString()} className={`p-2 rounded-xl ${isToday(day) ? 'bg-rose-500 text-white' : 'bg-slate-100'}`}>
                                <span className="text-xs font-semibold">{day.toLocaleDateString('en-US', { weekday: 'short' }).slice(0,3)}</span>
                                <span className="block font-bold text-lg">{day.getDate()}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 flex-grow">
                     <div className="relative w-[250px] h-[250px] mx-auto">
                        <svg viewBox="0 0 250 250" className="w-full h-full">
                            <circle cx="125" cy="125" r="120" fill="none" stroke="#E0E0E0" strokeWidth="10" />
                            {Array.from({ length: cycleLength }).map((_, i) => {
                                const day = i + 1;
                                const phase = cycleInfo.getPhase(day);
                                let color = "transparent";
                                if (phase === "Menstruation") color = "#f43f5e"; // Rose 500
                                if (phase === "Fertile") color = "#3b82f6"; // Blue 500
                                if (phase === "Follicular") color = "#a855f7"; // Purple 500
                                if (phase === "Luteal") color = "#f97316"; // Orange 500

                                const startAngle = ((day - 1) / cycleLength) * 360 - 90;
                                const endAngle = (day / cycleLength) * 360 - 90;
                                const largeArcFlag = 1/cycleLength > 0.5 ? 1 : 0;
                                
                                const start = {
                                    x: 125 + 110 * Math.cos(startAngle * Math.PI / 180),
                                    y: 125 + 110 * Math.sin(startAngle * Math.PI / 180)
                                };
                                const end = {
                                    x: 125 + 110 * Math.cos(endAngle * Math.PI / 180),
                                    y: 125 + 110 * Math.sin(endAngle * Math.PI / 180)
                                };
                                
                                const isSelected = selectedPhase === phase;

                                return (
                                    <path 
                                      key={day}
                                      d={`M ${start.x} ${start.y} A 110 110 0 ${largeArcFlag} 1 ${end.x} ${end.y}`}
                                      fill="none"
                                      stroke={color}
                                      strokeWidth={isSelected ? 20 : 10}
                                      onClick={() => setSelectedPhase(phase)}
                                      className="cursor-pointer transition-all duration-300"
                                    />
                                );
                            })}
                             {/* Day numbers */}
                            {Array.from({ length: cycleLength }).map((_, i) => {
                                 const day = i + 1;
                                 const { x, y } = getPointOnCircle(day);
                                 return (
                                     <text 
                                         key={`num-${day}`}
                                         x={x}
                                         y={y}
                                         textAnchor="middle"
                                         dominantBaseline="middle"
                                         fontSize="9"
                                         fill={cycleInfo.getPhase(day) === "Menstruation" || cycleInfo.getPhase(day) === "Fertile" ? 'white' : 'black'}
                                     >
                                        {day}
                                     </text>
                                 )
                             })}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <p className="text-xl font-bold">
                                {cycleInfo.daysUntilNextPeriod > 0 ? (
                                    <>
                                        <span className="text-4xl">{cycleInfo.daysUntilNextPeriod}</span> Days
                                    </>
                                ) : 'Today'}
                            </p>
                            <p className="font-bold text-rose-500 text-lg">until next period</p>
                            <p className="text-sm text-slate-500 mt-1">
                                {cycleInfo.getPhase(cycleInfo.currentDay) === 'Fertile' ? 'High' : 'Low'} chances of getting pregnant
                            </p>
                        </div>
                    </div>
                    {selectedPhase && phaseInfo[selectedPhase] && (
                        <div className="mt-4 p-4 bg-white rounded-xl shadow-inner">
                           <h4 className={`text-lg font-bold ${phaseInfo[selectedPhase].titleColor}`}>{phaseInfo[selectedPhase].title}</h4>
                           <p className="text-sm text-slate-600">{phaseInfo[selectedPhase].description}</p>
                        </div>
                    )}
                    <button className="mt-4 w-full py-2 bg-rose-500 text-white font-bold rounded-lg">Edit Period</button>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="bg-white p-2 rounded-lg text-center"><LogSymptomsIcon className="mx-auto h-6 w-6 text-rose-500 mb-1" /><span className="text-xs font-bold">Log Symptoms</span></div>
                        <div className="bg-rose-100 p-2 rounded-lg text-center"><CycleIcon className="mx-auto h-6 w-6 text-rose-500 mb-1" /><span className="text-xs font-bold">Next Period</span><span className="text-xs block">{cycleInfo.nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>
                        <div className="bg-purple-100 p-2 rounded-lg text-center"><OvulationIcon className="mx-auto h-6 w-6 text-purple-500 mb-1" /><span className="text-xs font-bold">Next Ovulation</span><span className="text-xs block">{cycleInfo.nextOvulationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>
                    </div>

                </div>
                 <button onClick={onClose} className="w-full text-center py-4 font-bold text-rose-500 bg-rose-100 rounded-b-2xl">Close</button>
            </div>
        </div>
    );
};


// --- SHOP COMPONENTS ---
const ProductCard: React.FC<{ product: Product, onAddToCart: (product: Product) => void }> = ({ product, onAddToCart }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
        <div className="p-4">
            <h3 className="font-bold truncate">{product.name}</h3>
            <p className="text-sm text-slate-500">{product.category}</p>
            <div className="mt-3 flex justify-between items-center">
                <p className="font-bold text-lg text-[#386641]">₹{product.price}</p>
                <button onClick={() => onAddToCart(product)} className="px-3 py-1.5 bg-[#E9F5DB] text-[#386641] text-xs font-bold rounded-full hover:bg-[#dbecc6]">Add to Cart</button>
            </div>
        </div>
    </div>
);


const PatientShop: React.FC<{ onAddToCart: (product: Product) => void }> = ({ onAddToCart }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'All' || product.tags.includes(activeFilter);
            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, activeFilter]);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="p-4 bg-slate-100 min-h-[calc(100vh-140px)]">
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-md"
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
            
            <div className="mb-4 overflow-x-auto" ref={scrollContainerRef}>
              <div className="flex space-x-2 pb-2">
                {filters.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-[#386641] text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>
        </div>
    );
};

// --- YOGA COMPONENTS ---
const AsanaCard: React.FC<{ asana: YogaAsana }> = ({ asana }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col p-4">
    <div className="flex justify-between items-start">
        <div>
            <h3 className="font-bold text-lg text-slate-800">{asana.name}</h3>
            <p className="text-sm text-slate-500 italic">{asana.sanskritName}</p>
        </div>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 whitespace-nowrap">
          For {asana.doshas.join(' & ')}
        </span>
    </div>

    <p className="text-sm text-slate-600 mt-3 border-t border-slate-200 pt-3">{asana.description}</p>
    
    <div className="mt-4">
        <h4 className="font-bold text-slate-700 mb-2">How to Perform</h4>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-slate-600 pl-2">
            {asana.steps.map((step, index) => <li key={index}>{step}</li>)}
        </ol>
    </div>

    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-200 pt-4">
      <div className="flex items-start gap-2">
          <BenefitIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
              <h5 className="font-semibold text-sm text-slate-700">Benefits</h5>
              <p className="text-xs text-slate-500">{asana.benefits}</p>
          </div>
      </div>
      <div className="flex items-start gap-2">
          <TimeIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
              <h5 className="font-semibold text-sm text-slate-700">Best Time</h5>
              <p className="text-xs text-slate-500">{asana.timeOfDay}</p>
          </div>
      </div>
      <div className="flex items-start gap-2">
          <RepeatIcon className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
              <h5 className="font-semibold text-sm text-slate-700">Repetitions</h5>
              <p className="text-xs text-slate-500">{asana.repetitions}</p>
          </div>
      </div>
    </div>
  </div>
);


const PatientYoga: React.FC<{ profile: UserProfile | null, onStartAssessment: () => void }> = ({ profile, onStartAssessment }) => {
  const recommendedAsanas = useMemo(() => {
    if (!profile) return [];

    const targetDoshas = new Set<string>();
    if (profile.vikriti && profile.vikriti !== 'Balanced') {
      profile.vikriti.split(' - ').forEach(d => targetDoshas.add(d));
    } else {
      profile.prakriti.split(' - ').forEach(d => targetDoshas.add(d));
    }

    return yogaAsanas.filter(asana =>
      asana.doshas.some(d => targetDoshas.has(d))
    );
  }, [profile]);

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Discover Your Personalized Yoga Plan</h2>
        <p className="text-slate-500 mb-4">Complete your Ayurvedic assessment to get yoga asanas recommended just for you.</p>
        <button
          onClick={onStartAssessment}
          className="px-6 py-2.5 bg-[#386641] text-white font-semibold rounded-lg hover:bg-[#2c5134] transition-colors"
        >
          Start Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-100 min-h-[calc(100vh-140px)]">
      <h2 className="text-xl font-bold mb-1">Recommended Asanas</h2>
      <p className="text-slate-500 mb-4">Based on your {profile.vikriti !== 'Balanced' ? 'Vikriti' : 'Prakriti'}: <span className="font-semibold">{profile.vikriti !== 'Balanced' ? profile.vikriti : profile.prakriti}</span></p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendedAsanas.map(asana => (
          <AsanaCard key={asana.id} asana={asana} />
        ))}
      </div>
    </div>
  );
};


// --- CONSULT COMPONENTS ---

const PermissionsRequest: React.FC<{ onGrant: () => void; }> = ({ onGrant }) => (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-full"><CameraIcon className="h-8 w-8 text-green-700" /></div>
            <div className="p-3 bg-green-100 rounded-full"><MicrophoneIcon className="h-8 w-8 text-green-700" /></div>
            <div className="p-3 bg-green-100 rounded-full"><LocationIcon className="h-8 w-8 text-green-700" /></div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Enable Permissions</h2>
        <p className="text-slate-500 mb-6 max-w-sm">
            To find nearby doctors and enable video consultations, please grant access to your camera, microphone, and location.
        </p>
        <button
            onClick={onGrant}
            className="w-full max-w-xs px-6 py-3 bg-[#386641] text-white font-semibold rounded-lg hover:bg-[#2c5134] transition-colors"
        >
            Allow Access
        </button>
    </div>
);

const DoctorCard: React.FC<{ doctor: Doctor, onClick: () => void }> = ({ doctor, onClick }) => (
    <div onClick={onClick} className="bg-white p-4 rounded-xl shadow-md flex gap-4 cursor-pointer active:bg-slate-50">
        <img src={doctor.photoUrl} alt={doctor.name} className="h-24 w-24 rounded-lg object-cover" />
        <div className="flex-1">
            <h3 className="font-bold text-lg">{doctor.name}</h3>
            <p className="text-sm text-[#386641] font-semibold">{doctor.specialty}</p>
            <p className="text-sm text-slate-500">{doctor.degree}</p>
            <div className="flex items-center gap-1 mt-2">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="font-bold text-slate-700">{doctor.rating}</span>
            </div>
             <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs">
                <LocationIcon className="h-4 w-4" />
                <span>{doctor.location.address}</span>
            </div>
        </div>
    </div>
);

const DoctorProfileModal: React.FC<{ 
    doctor: Doctor, 
    onClose: () => void,
    onBookAppointment: (details: { date: string; time: string }) => void 
}> = ({ doctor, onClose, onBookAppointment }) => {
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    
    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingDate || !bookingTime) {
            alert("Please select a date and time.");
            return;
        }
        onBookAppointment({ date: bookingDate, time: bookingTime });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] relative flex flex-col animate-fade-in">
                <header className="p-4 border-b sticky top-0 bg-slate-50 rounded-t-2xl z-10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Doctor Profile</h2>
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <XIcon className="w-6 h-6 text-slate-600" />
                    </button>
                </header>
                
                <div className="overflow-y-auto p-6 space-y-6">
                    {/* Doctor Info */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <img src={doctor.photoUrl} alt={doctor.name} className="h-32 w-32 rounded-full object-cover mx-auto sm:mx-0" />
                        <div className="text-center sm:text-left">
                            <h3 className="text-2xl font-bold">{doctor.name}</h3>
                            <p className="text-lg text-[#386641] font-semibold">{doctor.specialty}</p>
                            <p className="text-md text-slate-500">{doctor.degree}</p>
                             <div className="flex items-center gap-1 mt-2 justify-center sm:justify-start">
                                <StarIcon className="h-6 w-6 text-yellow-400" />
                                <span className="text-xl font-bold text-slate-700">{doctor.rating}</span>
                                <span className="text-slate-500">({doctor.reviews.length} reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Book an Appointment</h3>
                        <form onSubmit={handleBooking} className="space-y-4">
                           <div className="relative">
                                <label htmlFor="booking-date" className="text-sm font-medium text-slate-500 absolute -top-2 left-2 bg-white px-1">Date</label>
                                <input type="date" id="booking-date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg" />
                           </div>
                            <div>
                                <label className="text-sm font-medium text-slate-600 mb-2 block">Time Slot</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {doctor.availableSlots.map(slot => (
                                        <button 
                                            key={slot} 
                                            type="button"
                                            onClick={() => setBookingTime(slot)}
                                            className={`p-2 rounded-lg border text-sm font-semibold transition-colors ${bookingTime === slot ? 'bg-[#386641] text-white border-[#386641]' : 'bg-slate-100 hover:bg-slate-200'}`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-[#386641] text-white font-bold rounded-lg hover:bg-[#2c5134] transition-colors">Confirm Booking</button>
                        </form>
                    </div>

                    {/* Patient Reviews */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Patient Reviews</h3>
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {doctor.reviews.map((review, index) => (
                                <div key={index} className="border-b pb-3 last:border-b-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold">{review.patientName}</p>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600">"{review.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PatientChatView: React.FC<{
    appointment: UpcomingAppointment;
    patient: Patient;
    onSendMessage: (message: string) => void;
    onFileUpload: () => void;
    onStartVideoCall: () => void;
    onStartAudioCall: () => void;
    onRequestCallback: () => void;
}> = ({ appointment, patient, onSendMessage, onFileUpload, onStartVideoCall, onStartAudioCall, onRequestCallback }) => {
    const [message, setMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [appointment.chatHistory]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const renderMessageContent = (msg: ChatMessage) => {
        switch (msg.type) {
            case 'prescription':
                return (
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-green-700 mb-2">Prescription Details</h4>
                        <ul className="space-y-1 text-sm">
                            {msg.data.items.map((item: any, index: number) => (
                                <li key={index}><strong>{item.med}</strong> - {item.dosage}</li>
                            ))}
                        </ul>
                        <p className="text-xs text-slate-500 mt-2">{msg.data.notes}</p>
                    </div>
                );
            case 'diet':
                const dietPlan = msg.data as DietPlan;
                return (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 w-80">
                        <h4 className="font-bold text-slate-800 text-base mb-2">{msg.text || "Your Daily Diet Plan"}</h4>
                        
                        <div className="bg-green-50 p-3 rounded-lg mb-3">
                            <div className="flex justify-around text-center">
                                <div>
                                    <p className="text-xs text-slate-600">Total Calories</p>
                                    <p className="font-bold text-lg text-green-800">{dietPlan.totalCalories}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-600">Total Protein</p>
                                    <p className="font-bold text-lg text-green-800">{dietPlan.totalProtein.toFixed(1)}g</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                            {Object.entries(dietPlan.meals).map(([mealType, items]) => {
                                if (!Array.isArray(items) || items.length === 0) return null;
                                return (
                                    <div key={mealType}>
                                        <h5 className="font-bold text-green-700 mb-1">{mealType}</h5>
                                        <ul className="space-y-1">
                                            {(items as FoodLibraryItem[]).map((item: FoodLibraryItem, index: number) => (
                                                <li key={item.id || index} className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded">
                                                    <span>{item.name}</span>
                                                    <span className="text-xs text-slate-500">{item.calories} kcal</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'image':
                return <img src={msg.data.url} alt="Uploaded content" className="rounded-lg max-w-full h-auto" />;
            case 'document':
                return <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm">File: {msg.data.name}</div>
            default:
                return <p className="whitespace-pre-wrap">{msg.text}</p>;
        }
    };

    return (
        <div className="h-full bg-slate-100 flex flex-col">
            <header className="bg-white p-3 shadow-sm flex items-center justify-between gap-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img src={appointment.doctor.photoUrl} alt={appointment.doctor.name} className="h-10 w-10 rounded-full" />
                    <h2 className="font-bold text-lg">{appointment.doctor.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onRequestCallback} title="Request a callback from the doctor" className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors">Request Call</button>
                    <button onClick={onStartAudioCall} className="p-2 rounded-full hover:bg-slate-100 text-slate-600" aria-label="Start Audio Call"><AudioCallIcon className="h-6 w-6" /></button>
                    <button onClick={onStartVideoCall} className="p-2 rounded-full hover:bg-slate-100 text-slate-600" aria-label="Start Video Call"><VideoOnIcon className="h-6 w-6" /></button>
                </div>
            </header>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {appointment.chatHistory.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'doctor' && <img src={appointment.doctor.photoUrl} className="h-8 w-8 rounded-full flex-shrink-0" alt={appointment.doctor.name} />}
                        <div className={`max-w-[85%] p-1 rounded-2xl ${msg.sender === 'user' ? 'bg-[#386641] text-white rounded-br-none' : 'bg-transparent text-slate-800 rounded-bl-none'}`}>
                           <div className={`${msg.sender === 'user' ? 'p-2' : ''} ${msg.type !== 'diet' && msg.sender === 'doctor' ? 'bg-white shadow-sm p-3 rounded-2xl rounded-bl-none' : ''}`}>
                             {renderMessageContent(msg)}
                           </div>
                        </div>
                        {msg.sender === 'user' && <img src={patient.photoUrl} className="h-8 w-8 rounded-full flex-shrink-0" alt={patient.name} />}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSend} className="bg-white p-3 border-t flex items-center gap-2 flex-shrink-0">
                <button type="button" onClick={onFileUpload} className="p-3 text-slate-500 hover:text-slate-800" aria-label="Upload file">
                    <UploadIcon className="h-6 w-6" />
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-slate-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6A994E]"
                />
                <button type="submit" className="p-3 bg-[#386641] rounded-full text-white" aria-label="Send message">
                    <SendIcon className="h-5 w-5" />
                </button>
            </form>
        </div>
    );
};


const PatientConsult: React.FC<{ 
    appointment: UpcomingAppointment | null;
    patient: Patient;
    onSelectDoctor: (doctor: Doctor) => void;
    onSendMessage: (message: string) => void;
    onFileUpload: () => void;
    onStartVideoCall: () => void;
    onStartAudioCall: () => void;
    onRequestCallback: () => void;
}> = ({ appointment, patient, onSelectDoctor, onSendMessage, onFileUpload, onStartVideoCall, onStartAudioCall, onRequestCallback }) => {
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [consultViewMode, setConsultViewMode] = useState<'chat' | 'book'>('chat');
    
    useEffect(() => {
        const savedPermission = localStorage.getItem('permissionsGranted');
        if (savedPermission === 'true' && !location) {
            handleGrantPermissions();
        } else if (savedPermission !== 'true') {
            setPermissionsGranted(false);
        } else {
            setPermissionsGranted(true);
        }
    }, []);

    const handleGrantPermissions = () => {
        if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                    setPermissionsGranted(true);
                    localStorage.setItem('permissionsGranted', 'true');
                },
                (err) => {
                    console.error("Location check on load failed:", err.message);
                    setError(err.message);
                    setLocation({ lat: 23.2355, lng: 77.4345 }); 
                    setPermissionsGranted(true);
                    localStorage.setItem('permissionsGranted', 'true');
                }
            );
        } else {
             setError("Geolocation is not supported by this browser.");
             setLocation({ lat: 23.2355, lng: 77.4345 });
             setPermissionsGranted(true);
             localStorage.setItem('permissionsGranted', 'true');
        }
    };
    
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const nearbyDoctors = useMemo(() => {
        if (!location) return [];
        return allDoctors
            .filter(doc => !doc.isOnline)
            .map(doc => ({ ...doc, distance: calculateDistance(location.lat, location.lng, doc.location.lat, doc.location.lng) }))
            .filter(doc => doc.distance < 100) 
            .sort((a, b) => a.distance - b.distance);
    }, [location]);

    const onlineDoctors = useMemo(() => allDoctors.filter(doc => doc.isOnline), []);
    
    const DoctorListView = () => (
        <div className="h-full overflow-y-auto bg-slate-100">
            <div className="p-4 space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-3">{appointment ? 'Book Another Appointment' : 'Find a Doctor'}</h2>
                    {nearbyDoctors.length > 0 && (
                        <div className='space-y-3'>
                            <h3 className="text-lg font-semibold text-slate-600 mt-4 mb-2">Nearby Doctors</h3>
                            {nearbyDoctors.map(doctor => (
                                <DoctorCard key={doctor.id} doctor={doctor} onClick={() => onSelectDoctor(doctor)} />
                            ))}
                        </div>
                    )}
                    {onlineDoctors.length > 0 && (
                        <div className='space-y-3'>
                            <h3 className="text-lg font-semibold text-slate-600 mt-4 mb-2">Online Doctors</h3>
                            {onlineDoctors.map(doctor => (
                                <DoctorCard key={doctor.id} doctor={doctor} onClick={() => onSelectDoctor(doctor)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
    if (!permissionsGranted) {
        return <div className="h-[calc(100vh-140px)] bg-slate-100"><PermissionsRequest onGrant={handleGrantPermissions} /></div>;
    }

    if (!appointment) {
        return (
            <div className="h-[calc(100vh-140px)]">
                <DoctorListView />
            </div>
        );
    }
    
    return (
        <div className="h-[calc(100vh-140px)] bg-slate-100 flex flex-col">
            <div className="p-2 bg-slate-200 flex justify-center gap-2 flex-shrink-0">
                <button
                    onClick={() => setConsultViewMode('chat')}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                        consultViewMode === 'chat' 
                        ? 'bg-[#386641] text-white shadow-md' 
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    Chat
                </button>
                <button
                    onClick={() => setConsultViewMode('book')}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                        consultViewMode === 'book' 
                        ? 'bg-[#386641] text-white shadow-md' 
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    Book New
                </button>
            </div>
            
            <div className="flex-grow overflow-hidden">
                {consultViewMode === 'chat' ? (
                     <PatientChatView
                        appointment={appointment}
                        patient={patient}
                        onSendMessage={onSendMessage}
                        onFileUpload={onFileUpload}
                        onStartVideoCall={onStartVideoCall}
                        onStartAudioCall={onStartAudioCall}
                        onRequestCallback={onRequestCallback}
                    />
                ) : (
                    <DoctorListView />
                )}
            </div>
        </div>
    );
};

const UpcomingAppointmentCard: React.FC<{ 
    appointment: UpcomingAppointment; 
    onCancel: () => void;
    onStartVideoCall: () => void;
}> = ({ appointment, onCancel, onStartVideoCall }) => {
    const { doctor, date, time } = appointment;
    const appointmentDate = new Date(date + 'T00:00:00');
    const formattedDate = appointmentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-[#386641]">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Upcoming Appointment</h3>
            <div className="flex gap-4 items-center">
                <img src={doctor.photoUrl} alt={doctor.name} className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1">
                    <p className="font-bold text-lg text-slate-800">{doctor.name}</p>
                    <p className="text-sm text-slate-600 font-medium">{doctor.specialty}</p>
                    <div className="mt-2 text-sm text-slate-700 font-semibold bg-green-100 px-3 py-1 rounded-full inline-block">
                        <span>{formattedDate} at {time}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                 <button 
                    onClick={onCancel} 
                    className="px-4 py-2 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Cancel Appointment
                </button>
                 {doctor.isOnline && (
                    <button
                        onClick={onStartVideoCall}
                        className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Start Video Call
                    </button>
                )}
            </div>
        </div>
    );
};

const Section: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode}> = ({title, icon, children}) => (
    <div>
        <div className="flex items-center gap-2 mb-3">
            {icon}
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        {children}
    </div>
);

const BMICalculatorCard: React.FC = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [result, setResult] = useState<{ value: string; category: string; color: string } | null>(null);

    const handleCalculate = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height);

        if (w > 0 && h > 0) {
            const hMeters = h / 100;
            const bmi = w / (hMeters * hMeters);
            const bmiString = bmi.toFixed(1);

            let category = '';
            let color = '';
            if (bmi < 18.5) {
                category = 'Underweight';
                color = 'bg-blue-100 text-blue-800';
            } else if (bmi >= 18.5 && bmi < 25) {
                category = 'Normal weight';
                color = 'bg-green-100 text-green-800';
            } else if (bmi >= 25 && bmi < 30) {
                category = 'Overweight';
                color = 'bg-yellow-100 text-yellow-800';
            } else {
                category = 'Obesity';
                color = 'bg-red-100 text-red-800';
            }
            setResult({ value: bmiString, category, color });
        } else {
            setResult(null);
        }
    };

    return (
        <Section title="BMI Calculator" icon={<CalculatorIcon className="h-6 w-6 text-indigo-700"/>}>
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-slate-600 mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            id="weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="e.g., 65"
                            className="w-full p-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                     <div>
                        <label htmlFor="height" className="block text-sm font-medium text-slate-600 mb-1">Height (cm)</label>
                        <input
                            type="number"
                            id="height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="e.g., 170"
                            className="w-full p-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                </div>
                 <button
                    onClick={handleCalculate}
                    className="w-full px-6 py-2.5 bg-[#386641] text-white font-semibold rounded-lg hover:bg-[#2c5134] transition-colors"
                >
                    Calculate BMI
                </button>
                {result && (
                    <div className="mt-4 text-center bg-slate-50 p-3 rounded-lg">
                        <p className="text-slate-600">Your BMI is</p>
                        <p className="text-3xl font-bold text-slate-800 my-1">{result.value}</p>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${result.color}`}>
                            {result.category}
                        </span>
                    </div>
                )}
            </div>
        </Section>
    );
};


export const PatientView: React.FC<PatientViewProps> = ({ patient, onAddToCart, upcomingAppointment, onSendMessage, onBookAppointment, onCancelAppointment, callState, onInitiateCall, onRequestCallback }) => {
    const [activeTab, setActiveTab] = useState<PatientTab>('Home');
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isHealthConnected, setIsHealthConnected] = useState(false);
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [showProfileDetails, setShowProfileDetails] = useState(false);
    const [showMenstrualSetup, setShowMenstrualSetup] = useState(false);
    const [menstrualData, setMenstrualData] = useState<{ lastPeriodStart: string; cycleLength: number } | null>(null);
    const [showMenstrualDetails, setShowMenstrualDetails] = useState(false);
    const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState<Doctor | null>(null);
    
    // New state for home features
    const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null);
    const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
    const [isCommunityOpen, setIsCommunityOpen] = useState(false);
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(communityPostsData);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    
    // Health Report State
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [isGeneratingDietPdf, setIsGeneratingDietPdf] = useState(false);
    const reportContainerRef = useRef<HTMLDivElement>(null);
    const dietPdfRef = useRef<HTMLDivElement>(null);

    const dietPlan = useMemo(() => {
        if (!upcomingAppointment) return undefined;
        // Find the last message that is a diet plan
        return upcomingAppointment.chatHistory
            .slice()
            .reverse()
            .find(msg => msg.type === 'diet')?.data as DietPlan | undefined;
    }, [upcomingAppointment]);

    useEffect(() => {
        // This effect runs whenever the active patient profile changes.
        const profileKey = `userProfile_${patient.id}`;
        const cycleKey = `menstrualData_${patient.id}`;

        const savedProfile = localStorage.getItem(profileKey);
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            setUserProfile(profile);
            initializeChatbot(profile.name);
        } else {
            setUserProfile(null); // Reset profile if not found for this user
            initializeChatbot(patient.name);
        }

        const savedCycleData = localStorage.getItem(cycleKey);
        setMenstrualData(savedCycleData ? JSON.parse(savedCycleData) : null);

    }, [patient]);
    
    const initializeChatbot = (name: string) => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const chat: Chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are a friendly and helpful AI assistant of AyurVardan. You can answer general questions about Ayurveda, herbs, and wellness concepts. You must not provide any medical advice, diagnosis, or treatment plans. If a user asks for medical advice, you must gently decline and strongly recommend they consult with a qualified Ayurvedic doctor through the app. The user you are talking to is named ' + name + '.',
                },
            });
            setChatSession(chat);
            setChatMessages([{
                id: Date.now(),
                text: `Hello ${name}! I am the AI assistant of AyurVardan. How can I help you with your general Ayurvedic questions today?`,
                sender: 'bot',
                type: 'text'
            }]);
        } catch (error) {
            console.error("Failed to initialize chatbot:", error);
            setChatMessages([{
                id: Date.now(),
                text: "Sorry, the chatbot is currently unavailable.",
                sender: 'bot',
                type: 'text'
            }]);
        }
    };

    const handleSendMessageToBot = async (messageText: string) => {
        if (!chatSession) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user',
            type: 'text',
        };

        const loadingMessage: ChatMessage = {
            id: Date.now() + 1,
            text: '',
            sender: 'bot',
            type: 'text',
            isLoading: true,
        };
        
        setChatMessages(prev => [...prev, userMessage, loadingMessage]);

        try {
            const response = await chatSession.sendMessage({ message: messageText });
            const botMessage: ChatMessage = {
                id: Date.now() + 2,
                text: response.text,
                sender: 'bot',
                type: 'text',
            };
            setChatMessages(prev => [...prev.slice(0, -1), botMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
             const errorMessage: ChatMessage = {
                id: Date.now() + 2,
                text: "I'm sorry, I encountered an error. Please try again.",
                sender: 'bot',
                type: 'text',
            };
            setChatMessages(prev => [...prev.slice(0, -1), errorMessage]);
        }
    };

    const handleAddPost = (content: string) => {
        const newPost: CommunityPost = {
            id: Date.now(),
            author: userProfile?.name || 'You',
            authorImageUrl: 'https://picsum.photos/seed/currentuser/100/100',
            content,
            timestamp: 'Just now',
            comments: []
        };
        setCommunityPosts(prev => [newPost, ...prev]);
    };

    const handleAddComment = (postId: number, content: string) => {
        const newComment: CommunityComment = {
            id: Date.now(),
            author: userProfile?.name || 'You',
            authorImageUrl: 'https://picsum.photos/seed/currentuser/100/100',
            content,
            timestamp: 'Just now',
        };
        setCommunityPosts(prev => prev.map(post => 
            post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
        ));
    };


    const handleQuestionnaireComplete = (profile: UserProfile) => {
        setUserProfile(profile);
        localStorage.setItem(`userProfile_${patient.id}`, JSON.stringify(profile));
        setShowQuestionnaire(false);
        initializeChatbot(profile.name);
    };
    
    const handleSaveMenstrualData = (data: { lastPeriodStart: string; cycleLength: number }) => {
        setMenstrualData(data);
        localStorage.setItem(`menstrualData_${patient.id}`, JSON.stringify(data));
        setShowMenstrualSetup(false);
    };
    
    const handleAppointmentBooked = (bookingDetails: { date: string; time: string }) => {
        if (!selectedDoctorForProfile) return;
        onBookAppointment(selectedDoctorForProfile, bookingDetails);
        setSelectedDoctorForProfile(null); 
    };

    const handleSendMessageInternal = (messageText: string) => {
        onSendMessage(messageText, 'text', undefined);
    };

    const handleFileUploadInternal = () => {
       const newImageMessageData = { url: 'https://picsum.photos/seed/upload/300/200' };
       onSendMessage('', 'image', newImageMessageData);
   };

    useEffect(() => {
        if (isGeneratingReport) {
            const generatePdf = async () => {
                const reportElement = reportContainerRef.current;
                 if (!(window as any).jspdf || !(window as any).html2canvas) {
                    alert("PDF generation library is not loaded yet. Please try again in a moment.");
                    setIsGeneratingReport(false);
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
                    pdf.save(`Health_Report_${patient.name.replace(/\s+/g, '_')}.pdf`);
                }
                setIsGeneratingReport(false);
            };
            const timer = setTimeout(generatePdf, 100);
            return () => clearTimeout(timer);
        }
    }, [isGeneratingReport, patient, dietPlan, userProfile]);

    useEffect(() => {
        if (isGeneratingDietPdf && dietPlan) {
            const generatePdf = async () => {
                const reportElement = dietPdfRef.current;
                 if (!(window as any).jspdf || !(window as any).html2canvas) {
                    alert("PDF generation library is not loaded yet. Please try again in a moment.");
                    setIsGeneratingDietPdf(false);
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
                    pdf.save(`Diet_Plan_${patient.name.replace(/\s+/g, '_')}.pdf`);
                }
                setIsGeneratingDietPdf(false);
            };
            const timer = setTimeout(generatePdf, 100);
            return () => clearTimeout(timer);
        }
    }, [isGeneratingDietPdf, patient, dietPlan]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Home':
                return (
                    <div className="p-4 space-y-8">
                        <h2 className="text-2xl font-bold">Hello, {patient.name}!</h2>
                        
                        {upcomingAppointment && (
                            <UpcomingAppointmentCard 
                                appointment={upcomingAppointment}
                                onCancel={onCancelAppointment}
                                onStartVideoCall={() => onInitiateCall(upcomingAppointment.doctor.id, 'video')}
                            />
                        )}

                        {userProfile ? (
                            <AyurvedicProfileSummaryCard
                                prakriti={userProfile.prakriti}
                                vikriti={userProfile.vikriti}
                                onLearnMore={() => setShowProfileDetails(true)}
                            />
                        ) : (
                             <KnowYourPrakritiCard onStart={() => setShowQuestionnaire(true)} />
                        )}

                        <Section title="Discover Local Herbs" icon={<HerbsIcon className="h-6 w-6 text-green-700"/>}>
                            <div className="flex overflow-x-auto space-x-4 -mx-4 px-4 pb-3">
                                {herbsData.map(herb => (
                                    <div key={herb.id} onClick={() => setSelectedHerb(herb)} className="flex-shrink-0 w-40 cursor-pointer group">
                                        <img src={herb.imageUrl} alt={herb.name} className="w-full h-48 object-cover rounded-xl shadow-lg transition-transform group-hover:scale-105"/>
                                        <h3 className="mt-2 font-bold text-center">{herb.name}</h3>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section title="Ayurvedic Insights" icon={<BlogIcon className="h-6 w-6 text-blue-700"/>}>
                             <div className="flex overflow-x-auto space-x-4 -mx-4 px-4 pb-3">
                                {blogData.map(post => (
                                    <div key={post.id} onClick={() => setSelectedBlogPost(post)} className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md cursor-pointer group overflow-hidden">
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-32 object-cover"/>
                                        <div className="p-3">
                                          <h3 className="font-bold truncate">{post.title}</h3>
                                          <p className="text-xs text-slate-500">{post.author} &bull; {post.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                        
                        <Section title="Community Hub" icon={<CommunityIcon className="h-6 w-6 text-purple-700"/>}>
                            <div onClick={() => setIsCommunityOpen(true)} className="bg-white p-6 rounded-xl shadow-md text-center cursor-pointer hover:shadow-lg transition-shadow">
                                <CommunityIcon className="h-12 w-12 mx-auto mb-3 text-purple-500" />
                                <h3 className="text-xl font-bold text-slate-800">Join the Conversation</h3>
                                <p className="text-slate-500 text-sm">Share your journey and learn from others.</p>
                            </div>
                        </Section>
                        
                        <Section title="Your Records" icon={<DocumentReportIcon className="h-6 w-6 text-cyan-700" />}>
                            <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
                                <p className="text-slate-600">Download a summary of your health journey.</p>
                                <button
                                    onClick={() => setIsGeneratingReport(true)}
                                    disabled={isGeneratingReport}
                                    className="px-4 py-2 bg-[#386641] text-white text-sm font-semibold rounded-lg hover:bg-[#2c5134] transition-colors whitespace-nowrap disabled:bg-slate-400"
                                >
                                    {isGeneratingReport ? 'Generating...' : 'Download Report'}
                                </button>
                            </div>
                        </Section>

                        {!isHealthConnected ? (
                            <ConnectHealth onConnect={() => setIsHealthConnected(true)} />
                        ) : (
                            <NutritionDashboard />
                        )}

                        <BMICalculatorCard />

                        {patient.gender === 'Female' && (
                            <>
                                {!menstrualData ? (
                                    <TrackCycleCard onStart={() => setShowMenstrualSetup(true)} />
                                ) : (
                                    <MenstrualSummaryCard cycleData={menstrualData} onOpenDetails={() => setShowMenstrualDetails(true)} />
                                )}
                            </>
                        )}

                    </div>
                );
            case 'Diet':
                return <DietView 
                    patient={patient}
                    userProfile={userProfile} 
                    dietPlan={dietPlan}
                    onDownloadDietPdf={() => {
                        if (dietPlan) {
                            setIsGeneratingDietPdf(true);
                        } else {
                            alert("No diet plan has been prescribed yet.");
                        }
                    }}
                    isGeneratingPdf={isGeneratingDietPdf}
                />;
            case 'Consult':
                return <PatientConsult 
                            appointment={upcomingAppointment}
                            patient={patient}
                            onSelectDoctor={setSelectedDoctorForProfile} 
                            onSendMessage={handleSendMessageInternal}
                            onFileUpload={handleFileUploadInternal}
                            onStartVideoCall={() => upcomingAppointment && onInitiateCall(upcomingAppointment.doctor.id, 'video')}
                            onStartAudioCall={() => upcomingAppointment && onInitiateCall(upcomingAppointment.doctor.id, 'audio')}
                            onRequestCallback={() => upcomingAppointment && onRequestCallback(upcomingAppointment.doctor.id)}
                        />;
            case 'Yoga':
                return <PatientYoga profile={userProfile} onStartAssessment={() => setShowQuestionnaire(true)} />;
            case 'Shop':
                return <PatientShop onAddToCart={onAddToCart} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-slate-50">
            {isGeneratingReport && (
                <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px', backgroundColor: 'white' }}>
                    <div ref={reportContainerRef}>
                        <HealthReport patient={patient} dietPlan={dietPlan} userProfile={userProfile} />
                    </div>
                </div>
            )}
            {isGeneratingDietPdf && dietPlan && (
                <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '800px', backgroundColor: 'white' }}>
                    <div ref={dietPdfRef}>
                        <PrintableDietPlan patient={patient} dietPlan={dietPlan} />
                    </div>
                </div>
            )}
            {showQuestionnaire && <AyurvedicQuestionnaire patient={patient} onComplete={handleQuestionnaireComplete} onClose={() => setShowQuestionnaire(false)} />}
            {showProfileDetails && userProfile && (
                <ProfileDetailsView
                    prakriti={userProfile.prakriti}
                    vikriti={userProfile.vikriti}
                    onClose={() => setShowProfileDetails(false)}
                />
            )}
             {showMenstrualSetup && (
                <MenstrualSetupModal onSave={handleSaveMenstrualData} onClose={() => setShowMenstrualSetup(false)} />
            )}
            {showMenstrualDetails && menstrualData && (
                <MenstrualDetailsModal cycleData={menstrualData} onClose={() => setShowMenstrualDetails(false)} />
            )}
            {selectedDoctorForProfile && (
                <DoctorProfileModal 
                    doctor={selectedDoctorForProfile} 
                    onClose={() => setSelectedDoctorForProfile(null)}
                    onBookAppointment={handleAppointmentBooked} 
                />
            )}
            {selectedHerb && <HerbDetailsModal herb={selectedHerb} onClose={() => setSelectedHerb(null)} />}
            {selectedBlogPost && <BlogModal post={selectedBlogPost} onClose={() => setSelectedBlogPost(null)} />}
            {isCommunityOpen && <CommunityModal posts={communityPosts} onAddPost={handleAddPost} onAddComment={handleAddComment} onClose={() => setIsCommunityOpen(null)} />}
             
             {activeTab === 'Home' && (
                <>
                    <button 
                        onClick={() => setIsChatbotOpen(true)} 
                        className="fixed bottom-20 right-4 bg-gradient-to-br from-[#6A994E] to-[#386641] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-30"
                        aria-label="Open Chatbot"
                    >
                        <ChatbotIcon className="h-7 w-7" />
                    </button>
                    {isChatbotOpen && (
                        <Chatbot 
                            messages={chatMessages}
                            onSendMessage={handleSendMessageToBot}
                            onClose={() => setIsChatbotOpen(false)}
                        />
                    )}
                </>
            )}

            <div className="pb-20">
              {renderTabContent()}
            </div>

            <nav className="fixed bottom-0 left-0 right-0 bg-[#386641] text-white shadow-lg rounded-t-2xl z-20">
                <div className="flex justify-around items-center h-16">
                    {navItems.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => setActiveTab(name)}
                            className={`flex flex-col items-center justify-center w-full transition-colors duration-300 relative ${activeTab === name ? 'text-white' : 'text-green-200 hover:text-white'}`}
                        >
                            <Icon className="h-6 w-6 mb-0.5" />
                            <span className="text-xs font-bold">{name}</span>
                            {activeTab === name && (
                                <div className="absolute bottom-1 w-8 h-1 bg-white rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default PatientView;