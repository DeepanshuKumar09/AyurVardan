import React, { useState } from 'react';
import type { Doctor, Patient } from '../types';
import { MicOnIcon } from './icons/MicOnIcon';
import { MicOffIcon } from './icons/MicOffIcon';
import { VideoOnIcon } from './icons/VideoOnIcon';
import { VideoOffIcon } from './icons/VideoOffIcon';
import { EndCallIcon } from './icons/EndCallIcon';

interface VideoCallModalProps {
    localUser: Doctor | Patient;
    remoteUser: Doctor | Patient;
    onClose: () => void;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ localUser, remoteUser, onClose }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    return (
         <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col animate-fade-in">
            {/* Remote video (Doctor/Patient) */}
            <div className="flex-1 bg-slate-800 flex items-center justify-center relative">
                <img src={remoteUser.photoUrl} alt={remoteUser.name} className="h-48 w-48 rounded-full object-cover" />
                <p className="absolute bottom-4 left-4 text-white font-semibold bg-black/50 px-3 py-1 rounded-lg">{remoteUser.name}</p>
            </div>
            
            {/* Local video (Patient/Doctor) */}
            <div className={`absolute top-4 right-4 h-40 w-28 rounded-lg bg-slate-700 transition-all flex items-center justify-center overflow-hidden ${isCameraOff ? 'opacity-50' : 'opacity-100'}`}>
                 <img src={localUser.photoUrl} alt={localUser.name} className={`h-full w-full object-cover ${isCameraOff ? 'hidden' : ''}`} />
                {isCameraOff && <VideoOffIcon className="h-12 w-12 text-white" />}
            </div>

            {/* Controls */}
            <div className="bg-slate-900/80 py-4 flex justify-center items-center gap-6">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-white text-slate-800' : 'bg-white/20 text-white'}`}>
                    {isMuted ? <MicOffIcon className="h-6 w-6" /> : <MicOnIcon className="h-6 w-6" />}
                </button>
                <button onClick={() => setIsCameraOff(!isCameraOff)} className={`p-4 rounded-full transition-colors ${isCameraOff ? 'bg-white text-slate-800' : 'bg-white/20 text-white'}`}>
                    {isCameraOff ? <VideoOffIcon className="h-6 w-6" /> : <VideoOnIcon className="h-6 w-6" />}
                </button>
                <button onClick={onClose} className="p-4 rounded-full bg-red-600 text-white transition-colors">
                   <EndCallIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default VideoCallModal;
