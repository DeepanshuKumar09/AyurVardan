import React, { useState, useRef, useEffect } from 'react';
import type { Patient } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface ProfileSwitcherProps {
    profiles: Patient[];
    activeProfileId: number;
    onSwitchProfile: (profileId: number) => void;
    onAddProfile: () => void;
}

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ profiles, activeProfileId, onSwitchProfile, onAddProfile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const activeProfile = profiles.find(p => p.id === activeProfileId);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const handleSwitch = (id: number) => {
        onSwitchProfile(id);
        setIsOpen(false);
    }

    if (!activeProfile) return null;

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
                <img src={activeProfile.photoUrl} alt={activeProfile.name} className="h-7 w-7 rounded-full object-cover" />
                <span className="font-semibold text-sm text-slate-700 hidden sm:block">{activeProfile.name}</span>
                <ChevronDownIcon className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border z-30 animate-fade-in-fast">
                    <div className="p-2">
                        <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase">Switch Profile</p>
                        <ul className="mt-1">
                            {profiles.map(profile => (
                                <li key={profile.id}>
                                    <button 
                                        onClick={() => handleSwitch(profile.id)}
                                        className={`w-full flex items-center gap-3 p-2 text-left rounded-lg transition-colors ${activeProfileId === profile.id ? 'bg-[#E9F5DB]' : 'hover:bg-slate-100'}`}
                                    >
                                        <img src={profile.photoUrl} alt={profile.name} className="h-9 w-9 rounded-full object-cover" />
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{profile.name}</p>
                                            <p className="text-xs text-slate-500">{profile.relationship}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="border-t p-2">
                        <button 
                            onClick={() => { onAddProfile(); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 p-2 text-left rounded-lg transition-colors hover:bg-slate-100"
                        >
                            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
                                <PlusIcon className="h-5 w-5 text-slate-600" />
                            </div>
                            <p className="font-semibold text-slate-700 text-sm">Add New Profile</p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSwitcher;
