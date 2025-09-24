import React, { useState } from 'react';
import { AyurVardanLogo } from '../components/icons/AyurVardanLogo';
import { UserRole } from '../types';
import type { Patient, Doctor } from '../types';
import { BackArrowIcon } from '../components/icons/BackArrowIcon';

interface LoginViewProps {
  role: UserRole;
  onLogin: (user: { id: number; role: UserRole }) => void;
  onSignUp: (newUser: Patient | Doctor) => void;
  onBack: () => void;
  patients: Patient[];
  doctors: Doctor[];
}

const InputField: React.FC<{ id: string, label: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, placeholder?: string, autoComplete?: string }> = 
({ id, label, type = "text", value, onChange, required = true, placeholder, autoComplete }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-[#6A994E] focus:border-[#6A994E] sm:text-sm"
            placeholder={placeholder}
            autoComplete={autoComplete}
        />
    </div>
);

const LoginView: React.FC<LoginViewProps> = ({ role, onLogin, onSignUp, onBack, patients, doctors }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [specialty, setSpecialty] = useState('');
  const [degree, setDegree] = useState('');

  const [error, setError] = useState('');
  
  const resetForm = () => {
      setEmail('');
      setPassword('');
      setName('');
      setAge('');
      setGender('Male');
      setSpecialty('');
      setDegree('');
      setError('');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authMode === 'LOGIN') {
        if (role === UserRole.PATIENT) {
            const patient = patients.find(p => p.email === email && p.password === password);
            if (patient) {
                onLogin({ id: patient.id, role: UserRole.PATIENT });
            } else {
                setError('Invalid patient credentials. Please try again.');
            }
        } else {
            const doctor = doctors.find(d => d.email === email && d.password === password);
            if (doctor) {
                onLogin({ id: doctor.id, role: UserRole.DOCTOR });
            } else {
                setError('Invalid dietitian credentials. Please try again.');
            }
        }
    } else { // SIGNUP mode
        const emailExists = patients.some(p => p.email === email) || doctors.some(d => d.email === email);
        if (emailExists) {
            setError('An account with this email already exists.');
            return;
        }

        if (role === UserRole.PATIENT) {
            const newPatient: Patient = {
                id: Date.now(),
                name,
                age: parseInt(age, 10),
                gender,
                email,
                password,
                photoUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
                assignedDoctorId: 1,
                consultationType: 'Online',
                relationship: 'Self',
                consultations: [],
            };
            onSignUp(newPatient);
        } else { // DIETITIAN signup
            const newDoctor: Doctor = {
                id: Date.now(),
                name,
                email,
                password,
                specialty,
                degree,
                photoUrl: `https://picsum.photos/seed/doc${Date.now()}/200/200`,
                rating: 0,
                isOnline: true,
                location: { address: 'Online Only', lat: 0, lng: 0 },
                reviews: [],
                availableSlots: [],
            };
            onSignUp(newDoctor);
        }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 p-4 relative">
      <button onClick={onBack} className="absolute top-4 left-4 flex items-center gap-2 text-slate-600 font-semibold hover:text-slate-800 transition-colors p-2 rounded-lg hover:bg-slate-100">
          <BackArrowIcon className="h-5 w-5" />
          <span>Back</span>
      </button>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <AyurVardanLogo className="h-20 w-20 mx-auto text-[#386641]" />
          <h1 className="text-3xl font-bold mt-4" style={{color: '#386641'}}>
            Ayur<span style={{color: '#603808'}}>Vardan</span>
          </h1>
          <p className="text-slate-500 mt-2">Your journey to holistic wellness starts here.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{authMode === 'LOGIN' ? 'Login' : 'Sign Up'} as a {role === UserRole.PATIENT ? 'Patient' : 'Dietitian'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'SIGNUP' && (
                <InputField id="name" label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Jane Doe" autoComplete="name" />
            )}
            <InputField id="email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com" autoComplete="email" />
            <InputField id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete={authMode === 'LOGIN' ? 'current-password' : 'new-password'} />
            
            {authMode === 'SIGNUP' && role === UserRole.PATIENT && (
                <>
                    <InputField id="age" label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g., 30" />
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-slate-700">Gender</label>
                        <select id="gender" value={gender} onChange={e => setGender(e.target.value as any)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-[#6A994E] focus:border-[#6A994E] sm:text-sm">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </>
            )}

            {authMode === 'SIGNUP' && role === UserRole.DOCTOR && (
                 <>
                    <InputField id="specialty" label="Specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="e.g., Ayurvedic Nutritionist" />
                    <InputField id="degree" label="Degree" value={degree} onChange={e => setDegree(e.target.value)} placeholder="e.g., Certified Dietitian" />
                </>
            )}

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center mt-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#386641] hover:bg-[#2c5134] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A994E]"
              >
                {authMode === 'LOGIN' ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </form>
           <p className="mt-6 text-center text-sm text-slate-500">
              {authMode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => { setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'); resetForm(); }} 
                className="font-semibold text-[#386641] hover:underline ml-1"
              >
                {authMode === 'LOGIN' ? "Sign Up" : "Login"}
              </button>
            </p>
        </div>
        
        {authMode === 'LOGIN' && (
            <div className="text-center mt-4 text-xs text-slate-400 space-y-1">
                <p className="font-semibold">Demo Credentials:</p>
                {role === UserRole.PATIENT ? <p>Email: patient.arjun@ayurvardan.com / Pass: pass123</p> : <p>Email: doctor.sharma@ayurvardan.com / Pass: pass123</p>}
            </div>
        )}
      </div>
    </div>
  );
};

export default LoginView;