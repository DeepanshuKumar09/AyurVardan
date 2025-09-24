import React from 'react';
import { AudioCallIcon } from './icons/AudioCallIcon';
import { VideoOnIcon } from './icons/VideoOnIcon';
import { EndCallIcon } from './icons/EndCallIcon';

interface IncomingCallModalProps {
    callerName: string;
    callerPhotoUrl: string;
    callType: 'video' | 'audio';
    onAccept: () => void;
    onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ callerName, callerPhotoUrl, callType, onAccept, onDecline }) => {
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col items-center p-8 animate-fade-in text-center">
                <img src={callerPhotoUrl} alt={callerName} className="h-28 w-28 rounded-full object-cover mb-4 ring-4 ring-green-200" />
                <h2 className="text-2xl font-bold text-slate-800">{callerName}</h2>
                <p className="text-slate-500 mt-1">is making a {callType} call...</p>
                <div className="mt-8 flex justify-center gap-6 w-full">
                    <button onClick={onDecline} className="flex-1 flex flex-col items-center gap-2 text-red-600">
                        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                            <EndCallIcon className="h-8 w-8 text-red-600" fill="none"/>
                        </div>
                        <span className="font-semibold">Decline</span>
                    </button>
                    <button onClick={onAccept} className="flex-1 flex flex-col items-center gap-2 text-green-600">
                         <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                             {callType === 'video' ? <VideoOnIcon className="h-8 w-8" /> : <AudioCallIcon className="h-8 w-8" />}
                        </div>
                        <span className="font-semibold">Accept</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;
