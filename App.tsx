import React, { useState, useEffect, useMemo } from 'react';
import { UserRole } from './types';
import type { Product, Patient, Doctor, ChatMessage, UpcomingAppointment, DietPlan, UserRole as UserRoleType } from './types';
import { allPatients as initialPatients, doctors as initialDoctors, familyProfiles as initialFamilyProfiles } from './data/mockData';
import LoginView from './views/LoginView';
import DoctorView from './views/DoctorView';
import PatientView from './views/PatientView';
import { AyurVardanLogo } from './components/icons/AyurVardanLogo';
import LoadingScreen from './components/LoadingScreen';
import { CartIcon } from './components/icons/CartIcon';
import CartModal from './components/CartModal';
import ProfileSwitcher from './components/ProfileSwitcher';
import AddProfileModal from './components/AddProfileModal';
import IncomingCallModal from './components/IncomingCallModal';
import VideoCallModal from './components/VideoCallModal';
import AudioCallModal from './components/AudioCallModal';
import RoleSelector from './components/RoleSelector';

interface CurrentUser {
  id: number;
  role: UserRole;
}

export type CallState = {
  patientId: number;
  doctorId: number;
  type: 'video' | 'audio';
  status: 'ringing' | 'active';
  initiatedBy: UserRole;
} | null;


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.UNSELECTED);

  // Centralized state for user data
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [userProfiles, setUserProfiles] = useState<Patient[]>(initialFamilyProfiles);
  const [activeProfileId, setActiveProfileId] = useState<number>(initialFamilyProfiles[0].id);

  // Centralized state for chat and appointments
  const [chatHistories, setChatHistories] = useState<Record<number, ChatMessage[]>>({});
  const [upcomingAppointment, setUpcomingAppointment] = useState<UpcomingAppointment | null>(null);

  // Real-time call state
  const [callState, setCallState] = useState<CallState>(null);

  const activePatient = useMemo(() => 
    userProfiles.find(p => p.id === activeProfileId)!, 
    [userProfiles, activeProfileId]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second delay
    return () => clearTimeout(timer);
  }, []);
  
   useEffect(() => {
    const histories: Record<number, ChatMessage[]> = {};
    patients.forEach(p => {
        const key = `upcomingAppointment_${p.id}`;
        const stored = localStorage.getItem(key);
        if (stored) {
            const appointment = JSON.parse(stored);
            histories[p.id] = appointment.chatHistory || [];
        } else {
            histories[p.id] = [];
        }
    });
    setChatHistories(histories);
  }, [patients]);


  const handleLogin = (user: { id: number; role: UserRole }) => {
    setCurrentUser(user);
    if (user.role === UserRole.PATIENT) {
        const loggedInPatient = patients.find(p => p.id === user.id);
        if (loggedInPatient) {
            // For the main demo user, show their family. For others, show just their own profile.
            if (loggedInPatient.id === 1) { 
                setUserProfiles(initialFamilyProfiles);
                setActiveProfileId(initialFamilyProfiles[0].id);
            } else {
                const selfProfile = { ...loggedInPatient, relationship: 'Self' };
                setUserProfiles([selfProfile]);
                setActiveProfileId(selfProfile.id);
            }
            const appointmentKey = `upcomingAppointment_${user.id}`;
            const savedAppointment = localStorage.getItem(appointmentKey);
            setUpcomingAppointment(savedAppointment ? JSON.parse(savedAppointment) : null);
        }
    } else { // Doctor logged in
        setUpcomingAppointment(null);
    }
    
    // Check if there's a pending call and if it's for the user logging in
    if (callState && callState.status === 'ringing') {
        const isCallForThisUser = 
            (user.role === UserRole.PATIENT && user.id === callState.patientId && callState.initiatedBy === UserRole.DOCTOR) ||
            (user.role === UserRole.DOCTOR && user.id === callState.doctorId && callState.initiatedBy === UserRole.PATIENT);

        if (!isCallForThisUser) {
            // The pending call is not for this user, so clear it.
            setCallState(null);
        }
    }
  };
  
  const handleSignUp = (newUser: Patient | Doctor) => {
    if ('specialty' in newUser) { // It's a Doctor
      const newDoctor = newUser as Doctor;
      setDoctors(prev => [...prev, newDoctor]);
      setCurrentUser({ id: newDoctor.id, role: UserRole.DOCTOR });
    } else { // It's a Patient
      const newPatient = newUser as Patient;
      setPatients(prev => [...prev, newPatient]);
      const selfProfile = { ...newPatient, relationship: 'Self' };
      setUserProfiles([selfProfile]); 
      setActiveProfileId(selfProfile.id);
      setCurrentUser({ id: newPatient.id, role: UserRole.PATIENT });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setIsCartOpen(false);
    // State such as `callState` and `upcomingAppointment` is intentionally not cleared
    // to allow simulating real-time interactions between a doctor and patient view
    // by logging out and logging in as the other user.
    setSelectedRole(UserRole.UNSELECTED); // Go back to role selection
  };
  
  const handleSendMessage = (patientId: number, text: string, sender: 'user' | 'doctor', type: 'text' | 'image' | 'document' | 'prescription' | 'diet' = 'text', data?: any) => {
    const newMessage: ChatMessage = {
        id: Date.now(),
        text,
        sender,
        type,
        data,
    };

    setChatHistories(prev => {
        const newHistory = [...(prev[patientId] || []), newMessage];
        const updatedHistories = { ...prev, [patientId]: newHistory };

        // Persist to localStorage
        const key = `upcomingAppointment_${patientId}`;
        const stored = localStorage.getItem(key);
        
        const patientForMessage = patients.find(p => p.id === patientId);
        const doctorForMessage = doctors.find(d => d.id === patientForMessage?.assignedDoctorId);

        if (doctorForMessage) {
            const appointmentData = stored ? JSON.parse(stored) : { doctor: doctorForMessage, date: new Date().toISOString().split('T')[0], time: 'Chat', chatHistory: [] };
            appointmentData.chatHistory = newHistory;
            localStorage.setItem(key, JSON.stringify(appointmentData));

            // If a patient is logged in and the message is for them, update their live appointment view
            if (currentUser?.role === UserRole.PATIENT && currentUser.id === patientId) {
                setUpcomingAppointment(appointmentData);
            }
        }
        
        // --- Real-time Simulation Logic ---
        if (sender === 'user' && doctorForMessage) {
            setTimeout(() => {
                const isFirstMessage = newHistory.filter(m => m.sender === 'user').length <= 1;
                
                if (isFirstMessage) {
                    const sampleDietPlan: DietPlan = {
                        totalCalories: 1850,
                        totalProtein: 95.5,
                        meals: {
                            Breakfast: [{ id: 14, name: 'Oats with berries', prakriti: 'Kapha', rasa: 'Sweet', calories: 300, protein: 10 }, { id: 8, name: 'Handful of Almonds', prakriti: 'Vata', rasa: 'Sweet', calories: 164, protein: 6 }],
                            Lunch: [{ id: 3, name: 'Basmati Rice', prakriti: 'Tridoshic', rasa: 'Sweet', calories: 205, protein: 4.3 }, { id: 15, name: 'Mung Daal', prakriti: 'Tridoshic', rasa: 'Astringent, Sweet', calories: 212, protein: 14 }],
                            Dinner: [{ id: 5, name: 'Sautéed Spinach', prakriti: 'Pitta', rasa: 'Bitter, Astringent', calories: 100, protein: 5 }, { id: 6, name: 'Grilled Chicken Breast', prakriti: 'Vata', rasa: 'Sweet', calories: 165, protein: 31 }],
                            Snacks: [{ id: 1, name: 'Apple', prakriti: 'Vata', rasa: 'Sweet, Astringent', calories: 95, protein: 0.5 }]
                        }
                    };
                    handleSendMessage(patientId, "Welcome! I've received your message. Here is a starting diet plan for you based on your profile. Please review it.", 'doctor', 'diet', sampleDietPlan);
                } else {
                    handleSendMessage(patientId, "Thanks for the update. I'm reviewing your message and will get back to you shortly.", 'doctor', 'text');
                }
            }, 2000);
        }

        return updatedHistories;
    });
  };

  const handleBookAppointment = (patientId: number, doctor: Doctor, details: { date: string; time: string }) => {
    const newAppointment: UpcomingAppointment = {
        doctor: doctor,
        ...details,
        chatHistory: [],
    };
    const key = `upcomingAppointment_${patientId}`;
    localStorage.setItem(key, JSON.stringify(newAppointment));
    setUpcomingAppointment(newAppointment);
    setChatHistories(prev => ({...prev, [patientId]: []})); // Reset chat history in central state
    alert(`Appointment confirmed with ${newAppointment.doctor.name}!`);
  };

  const handleCancelAppointment = (patientId: number) => {
      const key = `upcomingAppointment_${patientId}`;
      localStorage.removeItem(key);
      setUpcomingAppointment(null);
      setChatHistories(prev => ({...prev, [patientId]: []})); // Clear chat history
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => [...prevItems, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prevItems => {
        const indexToRemove = prevItems.findIndex(item => item.id === productId);
        if (indexToRemove > -1) {
            const newItems = [...prevItems];
            newItems.splice(indexToRemove, 1);
            return newItems;
        }
        return prevItems;
    });
  };
  
  const handleAddProfile = (profileData: Omit<Patient, 'id' | 'photoUrl' | 'assignedDoctorId' | 'consultations' | 'consultationType'>) => {
    const newProfile: Patient = {
      ...profileData,
      id: Date.now(),
      photoUrl: `https://picsum.photos/seed/new${Date.now()}/200/200`,
      assignedDoctorId: 1, // Default doctor
      consultations: [],
      consultationType: 'Online',
    };
    const newProfiles = [...userProfiles, newProfile];
    setUserProfiles(newProfiles);
    setActiveProfileId(newProfile.id); // Switch to the new profile
    setIsAddProfileModalOpen(false);
  };

  const handleToggleCart = () => {
      setIsCartOpen(!isCartOpen);
  };

  // --- Call Handlers ---
  const handleInitiateCall = (patientId: number, doctorId: number, type: 'video' | 'audio') => {
    if (!currentUser) return;
    setCallState({ patientId, doctorId, type, status: 'ringing', initiatedBy: currentUser.role });
  };
  
  const handleSimulatedIncomingCall = (patientId: number, doctorId: number, type: 'video' | 'audio') => {
      // Bypasses the currentUser check to simulate a call from the other party
      setCallState({ patientId, doctorId, type, status: 'ringing', initiatedBy: UserRole.DOCTOR });
  };

  const handleRequestCallback = (doctorId: number) => {
    alert("Your callback request has been sent to the doctor. They will call you back shortly.");
    setTimeout(() => {
        if(currentUser?.role === UserRole.PATIENT) {
            handleSimulatedIncomingCall(currentUser.id, doctorId, 'video');
        }
    }, 3000);
  };

  const handleAcceptCall = () => {
    if (callState) {
        setCallState({ ...callState, status: 'active' });
    }
  };

  const handleEndCall = () => {
    setCallState(null);
  };
  
  const handleSelectRole = (role: UserRoleType) => {
      setSelectedRole(role);
  };

  const handleBackToRoleSelection = () => {
      setSelectedRole(UserRole.UNSELECTED);
  };


  const renderCallModals = () => {
    if (!callState || !currentUser) return null;

    // Check if current user is receiving a call
    const isRingingForCurrentUser = callState.status === 'ringing' && callState.initiatedBy !== currentUser.role;
    if (isRingingForCurrentUser && ( (currentUser.role === UserRole.DOCTOR && currentUser.id === callState.doctorId) || (currentUser.role === UserRole.PATIENT && currentUser.id === callState.patientId) ) ) {
      const caller = callState.initiatedBy === UserRole.DOCTOR 
        ? doctors.find(d => d.id === callState.doctorId)
        : patients.find(p => p.id === callState.patientId);
      
      if (!caller) return null;

      return (
        <IncomingCallModal
          callerName={caller.name}
          callerPhotoUrl={caller.photoUrl}
          callType={callState.type}
          onAccept={handleAcceptCall}
          onDecline={handleEndCall}
        />
      );
    }

    // Check if current user is in an active call
    const isActiveCallForCurrentUser = callState.status === 'active' && ( (currentUser.role === UserRole.DOCTOR && currentUser.id === callState.doctorId) || (currentUser.role === UserRole.PATIENT && currentUser.id === callState.patientId) );
    if (isActiveCallForCurrentUser) {
      const localUser = currentUser.role === UserRole.DOCTOR ? doctors.find(d => d.id === currentUser.id) : patients.find(p => p.id === currentUser.id);
      const remoteUser = currentUser.role === UserRole.DOCTOR ? patients.find(p => p.id === callState.patientId) : doctors.find(d => d.id === callState.doctorId);

      if (!localUser || !remoteUser) return null;

      if (callState.type === 'video') {
        return <VideoCallModal localUser={localUser} remoteUser={remoteUser} onClose={handleEndCall} />;
      }
      if (callState.type === 'audio') {
        return <AudioCallModal user={remoteUser} onClose={handleEndCall} />;
      }
    }

    // If the user is the one initiating the call, show a "calling..." screen
    const isInitiatingCall = callState.status === 'ringing' && callState.initiatedBy === currentUser.role;
    if (isInitiatingCall) {
        const remoteUser = currentUser.role === UserRole.DOCTOR ? patients.find(p => p.id === callState.patientId) : doctors.find(d => d.id === callState.doctorId);
        if (remoteUser) {
            return <AudioCallModal user={remoteUser} onClose={handleEndCall} isCalling={true} callType={callState.type} />;
        }
    }

    return null;
  }

  const renderContent = () => {
    if (selectedRole === UserRole.UNSELECTED && !currentUser) {
        return <RoleSelector onSelectRole={handleSelectRole} />;
    }

    if (!currentUser) {
        return <LoginView 
          role={selectedRole}
          onLogin={handleLogin} 
          onSignUp={handleSignUp}
          onBack={handleBackToRoleSelection}
          patients={patients}
          doctors={doctors}
        />;
    }

    switch (currentUser.role) {
      case UserRole.DOCTOR:
        return <DoctorView 
          doctorId={currentUser.id} 
          patients={patients}
          doctors={doctors}
          chatHistories={chatHistories}
          onSendMessage={handleSendMessage}
          callState={callState}
          onInitiateCall={(patientId, type) => handleInitiateCall(patientId, currentUser.id, type)}
        />;
      case UserRole.PATIENT:
        if (!activePatient) return <div className="p-4">Loading patient profile...</div>;
        return <PatientView 
          patient={activePatient} 
          onAddToCart={handleAddToCart}
          upcomingAppointment={upcomingAppointment}
          onSendMessage={(text, type, data) => handleSendMessage(activePatient.id, text, 'user', type, data)}
          onBookAppointment={(doctor, details) => handleBookAppointment(activePatient.id, doctor, details)}
          onCancelAppointment={() => handleCancelAppointment(activePatient.id)}
          callState={callState}
          onInitiateCall={(doctorId, type) => handleInitiateCall(activePatient.id, doctorId, type)}
          onRequestCallback={(doctorId) => handleRequestCallback(doctorId)}
        />;
      default:
        return <RoleSelector onSelectRole={handleSelectRole} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800">
      <LoadingScreen isVisible={isLoading} />
      
      {renderCallModals()}

      <CartModal 
        isOpen={isCartOpen}
        onClose={handleToggleCart}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
      />

      {isAddProfileModalOpen && (
          <AddProfileModal 
            onSave={handleAddProfile}
            onClose={() => setIsAddProfileModalOpen(false)}
          />
      )}
      
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <nav className="mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AyurVardanLogo className="h-10 w-10 text-[#386641]" />
              <h1 className="text-2xl font-bold" style={{color: '#386641'}}>
                Ayur<span style={{color: '#603808'}}>Vardan</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
               {currentUser?.role === UserRole.PATIENT && (
                  <>
                    <ProfileSwitcher 
                      profiles={userProfiles}
                      activeProfileId={activeProfileId}
                      onSwitchProfile={setActiveProfileId}
                      onAddProfile={() => setIsAddProfileModalOpen(true)}
                    />
                    <button onClick={handleToggleCart} className="relative p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label={`View cart with ${cartItems.length} items`}>
                        <CartIcon className="h-6 w-6 text-slate-600" />
                        {cartItems.length > 0 && (
                            <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                                {cartItems.length}
                            </span>
                        )}
                    </button>
                  </>
              )}
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
                  style={{backgroundColor: '#E9F5DB', color: '#386641', fontWeight: '600'}}
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </header>
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;