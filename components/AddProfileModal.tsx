import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import type { Patient } from '../types';

type NewProfileData = Omit<Patient, 'id' | 'photoUrl' | 'assignedDoctorId' | 'consultations' | 'consultationType'>;

interface AddProfileModalProps {
    onSave: (profileData: NewProfileData) => void;
    onClose: () => void;
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [relationship, setRelationship] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !age || !relationship) {
            alert('Please fill in all fields.');
            return;
        }
        onSave({
            name,
            age: parseInt(age, 10),
            gender,
            relationship,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Add New Profile</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100"><XIcon className="w-5 h-5"/></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-slate-600 mb-1">Age</label>
                            <input type="number" id="age" value={age} onChange={e => setAge(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Gender</label>
                            <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="relationship" className="block text-sm font-medium text-slate-600 mb-1">Relationship</label>
                            <input type="text" id="relationship" value={relationship} onChange={e => setRelationship(e.target.value)} placeholder="e.g., Spouse, Child, Parent" className="w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                    </div>
                    <footer className="p-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                         <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-200">Cancel</button>
                         <button type="submit" className="px-4 py-2 bg-[#386641] text-white text-sm font-semibold rounded-lg hover:bg-[#2c5134]">Save Profile</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default AddProfileModal;
