import React, { useState } from 'react';
import type { Doctor, Patient } from '../types';
import { MicOnIcon } from './icons/MicOnIcon';
import { MicOffIcon } from './icons/MicOffIcon';
import { EndCallIcon } from './icons/EndCallIcon';

interface AudioCallModalProps {
    user: Doctor | Patient;
    onClose: () => void;
    isCalling?: boolean;
    callType?: 'video' | 'audio';
}

const AudioCallModal: React.FC<AudioCallModalProps> = ({ user, onClose, isCalling = false, callType = 'audio' }) => {
    const [isMuted, setIsMuted] = useState(false);

    const statusText = isCalling ? `Calling for ${callType} call...` : 'Connecting...';

    return (
         <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="relative mb-6">
                <img src={user.photoUrl} alt={user.name} className="h-40 w-40 rounded-full object-cover ring-4 ring-white/20" />
                {isCalling && (
                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50">
                        <div className="h-6 w-6 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
            <h2 className="text-3xl font-bold text-white">{user.name}</h2>
            <p className="text-lg text-white/70 mb-8">{statusText}</p>
            <div className="flex justify-center items-center gap-6">
                <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-white text-slate-800' : 'bg-white/20 text-white'}`}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    disabled={isCalling}
                >
                    {isMuted ? <MicOffIcon className="h-6 w-6" /> : <MicOnIcon className="h-6 w-6" />}
                </button>
                <button 
                    onClick={onClose} 
                    className="p-4 rounded-full bg-red-600 text-white transition-transform hover:scale-110"
                    aria-label="End call"
                >
                   <EndCallIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default AudioCallModal;
