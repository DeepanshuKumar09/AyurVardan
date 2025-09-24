import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Patient, Doctor, DietPlan, ChatMessage, GeneratedRecipe, FoodLibraryItem } from '../types';
import type { CallState } from '../App';
import { HomeIcon } from '../components/icons/HomeIcon';
import { DietIcon } from '../components/icons/DietIcon';
import { ConsultIcon } from '../components/icons/ConsultIcon';
import { RecipeIcon } from '../components/icons/RecipeIcon';
import DoctorDietPlanView from './DoctorDietPlanView';
import PatientDashboard from '../components/PatientDashboard';
import { SendIcon } from '../components/icons/SendIcon';
import { AudioCallIcon } from '../components/icons/AudioCallIcon';
import { VideoOnIcon } from '../components/icons/VideoOnIcon';

type DoctorTab = 'Patients' | 'Diet Plan' | 'Chats' | 'Recipe';

interface DoctorViewProps {
  doctorId: number;
  patients: Patient[];
  doctors: Doctor[];
  chatHistories: Record<number, ChatMessage[]>;
  onSendMessage: (patientId: number, text: string, sender: 'doctor', type?: 'text' | 'image' | 'document' | 'prescription' | 'diet', data?: any) => void;
  callState: CallState;
  onInitiateCall: (patientId: number, type: 'video' | 'audio') => void;
}

const navItems: { name: DoctorTab; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { name: 'Patients', icon: HomeIcon },
  { name: 'Diet Plan', icon: DietIcon },
  { name: 'Chats', icon: ConsultIcon },
  { name: 'Recipe', icon: RecipeIcon },
];

const DoctorView: React.FC<DoctorViewProps> = ({ doctorId, patients, doctors, chatHistories, onSendMessage, callState, onInitiateCall }) => {
  const [activeTab, setActiveTab] = useState<DoctorTab>('Patients');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients.length > 0 ? patients[0] : null);
  const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Chat state
  const [selectedPatientForChat, setSelectedPatientForChat] = useState<Patient | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);


  const doctor = useMemo(() => doctors.find(d => d.id === doctorId), [doctors, doctorId]);
  const filteredPatients = useMemo(() => patients.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery, patients]);

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistories, selectedPatientForChat]);

  const handleRecipeGenerated = (recipe: GeneratedRecipe) => {
    setGeneratedRecipes(prev => [...prev, recipe]);
    setActiveTab('Recipe');
  };
  
  const handleSendTextMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPatientForChat) return;

    onSendMessage(selectedPatientForChat.id, newMessage, 'doctor', 'text');
    setNewMessage('');
  };
  
  const renderMessageContent = (msg: ChatMessage) => {
    switch (msg.type) {
        case 'diet':
            const dietPlan = msg.data as DietPlan;
            if (!dietPlan) return <p>Diet plan attached.</p>;
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
                                        {items.map((item: FoodLibraryItem, index: number) => (
                                            <li key={index} className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded">
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
            return <img src={msg.data.url} alt="Uploaded content" className="rounded-lg max-w-xs h-auto" />;
        default:
            return <p>{msg.text}</p>;
    }
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'Patients':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 h-full">
            <div className="md:col-span-1 h-full flex flex-col gap-4">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="bg-white rounded-xl shadow-md flex-grow overflow-y-auto">
                <ul className="divide-y divide-slate-100">
                  {filteredPatients.map(p => (
                    <li
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${selectedPatient?.id === p.id ? 'bg-green-100' : 'hover:bg-slate-50'}`}
                    >
                      <img src={p.photoUrl} alt={p.name} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-sm text-slate-500">{p.age}, {p.gender}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:col-span-2 h-full">
              {selectedPatient ? <PatientDashboard patient={selectedPatient} /> : <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-md"><p>Select a patient to view details</p></div>}
            </div>
          </div>
        );
      case 'Diet Plan':
        return <DoctorDietPlanView doctorId={doctorId} patients={patients} onRecipeGenerated={handleRecipeGenerated} onSendMessage={onSendMessage} />;
      case 'Chats':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full">
            <div className="md:col-span-1 bg-white rounded-xl shadow-md flex-col flex h-full">
                <h2 className="text-xl font-bold p-4 border-b">Conversations</h2>
                <ul className="divide-y divide-slate-100 overflow-y-auto flex-grow">
                  {patients.map(p => (
                    <li
                      key={p.id}
                      onClick={() => setSelectedPatientForChat(p)}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${selectedPatientForChat?.id === p.id ? 'bg-green-100' : 'hover:bg-slate-50'}`}
                    >
                      <img src={p.photoUrl} alt={p.name} className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-sm text-slate-500 truncate">{chatHistories[p.id]?.[chatHistories[p.id].length - 1]?.text || 'No messages yet'}</p>
                      </div>
                    </li>
                  ))}
                </ul>
            </div>
            <div className="md:col-span-2 bg-white rounded-xl shadow-md flex flex-col h-full">
                {selectedPatientForChat ? (
                    <>
                        <header className="p-3 shadow-sm flex items-center justify-between gap-3 border-b flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <img src={selectedPatientForChat.photoUrl} alt={selectedPatientForChat.name} className="h-10 w-10 rounded-full" />
                                <h2 className="font-bold text-lg">{selectedPatientForChat.name}</h2>
                           </div>
                           <div className="flex items-center gap-2">
                                <button onClick={() => onInitiateCall(selectedPatientForChat.id, 'audio')} className="p-2 rounded-full hover:bg-slate-100 text-slate-600" aria-label="Start Audio Call">
                                    <AudioCallIcon className="h-6 w-6" />
                                </button>
                                <button onClick={() => onInitiateCall(selectedPatientForChat.id, 'video')} className="p-2 rounded-full hover:bg-slate-100 text-slate-600" aria-label="Start Video Call">
                                    <VideoOnIcon className="h-6 w-6" />
                                </button>
                           </div>
                        </header>
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                             {(chatHistories[selectedPatientForChat.id] || []).map(msg => (
                                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'user' && <img src={selectedPatientForChat.photoUrl} className="h-8 w-8 rounded-full flex-shrink-0" alt={selectedPatientForChat.name} />}
                                    <div className={`max-w-[85%] p-1 rounded-2xl ${msg.sender === 'doctor' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none shadow-sm'}`}>
                                        <div className={msg.type !== 'diet' ? 'px-2 py-1' : ''}>
                                            {renderMessageContent(msg)}
                                        </div>
                                    </div>
                                    {msg.sender === 'doctor' && doctor && <img src={doctor.photoUrl} className="h-8 w-8 rounded-full flex-shrink-0" alt={doctor.name} />}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendTextMessage} className="p-3 border-t flex items-center gap-2 flex-shrink-0">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-slate-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button type="submit" className="p-3 bg-green-600 rounded-full text-white">
                                <SendIcon className="h-5 w-5" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <p>Select a patient to start a conversation.</p>
                    </div>
                )}
            </div>
          </div>
        );
      case 'Recipe':
        const patientRecipes = generatedRecipes.filter(r => selectedPatient ? r.patientId === selectedPatient.id : true);
        return (
          <div className="p-4 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">AI Generated Recipes</h2>
            {generatedRecipes.length === 0 ? (
                <div className="text-center text-slate-500 mt-16">
                    <p>No recipes have been generated yet.</p>
                    <p className="text-sm">Go to the "Diet Plan" tab to generate recipes for a patient's meal plan.</p>
                </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedRecipes.map(recipe => {
                  const patient = patients.find(p => p.id === recipe.patientId);
                  return (
                    <div key={recipe.id} className="bg-white rounded-xl shadow-sm p-4">
                      <h3 className="text-lg font-bold text-green-700">{recipe.title}</h3>
                      <p className="text-sm font-semibold text-slate-600">For {patient?.name || 'Patient'} - {recipe.mealType}</p>
                      <div className="mt-3">
                        <h4 className="font-bold text-sm mb-1">Ingredients:</h4>
                        <ul className="list-disc list-inside text-xs space-y-0.5 text-slate-500">
                          {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                        </ul>
                      </div>
                       <div className="mt-3">
                        <h4 className="font-bold text-sm mb-1">Instructions:</h4>
                        <ol className="list-decimal list-inside text-xs space-y-1 text-slate-500">
                          {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                        </ol>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!doctor) {
    return <div>Doctor not found.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <nav className="w-20 bg-[#386641] flex flex-col items-center justify-center text-white space-y-6 p-2">
        {navItems.map(({ name, icon: Icon }) => (
          <button
            key={name}
            onClick={() => setActiveTab(name)}
            className={`flex flex-col items-center justify-center w-full aspect-square rounded-lg transition-colors duration-200 relative ${activeTab === name ? 'bg-white/20' : 'hover:bg-white/10'}`}
            aria-label={name}
          >
            <Icon className="h-7 w-7" />
            <span className="text-[10px] font-bold mt-1">{name}</span>
            {activeTab === name && <div className="absolute left-0 top-1/4 h-1/2 w-1 bg-white rounded-r-full" />}
          </button>
        ))}
      </nav>
      <main className="flex-1 bg-slate-100 overflow-hidden">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default DoctorView;