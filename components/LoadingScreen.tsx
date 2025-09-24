import React from 'react';
import { AyurVardanLogo } from './icons/AyurVardanLogo';

interface LoadingScreenProps {
  isVisible: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 flex flex-col items-center justify-center ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Background structure */}
      <div className="absolute inset-0">
        <div className="h-1/3 bg-[#386641]"></div>
        <div className="h-2/3 bg-[#FBF7F0] relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-[140%] h-[140%] opacity-5 text-[#603808]">
                <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 35C41.716 35 35 41.716 35 50V60H65V50C65 41.716 58.284 35 50 35Z" />
                    <path d="M50 15C41.716 15 35 21.716 35 30C35 38.284 41.716 45 50 45C58.284 45 65 38.284 65 30C65 21.716 58.284 15 50 15Z"/>
                    <path d="M25 60H35V50C35 33.431 48.431 20 65 20V30C53.954 30 45 38.954 45 50V60H55V50C55 41.716 48.284 35 40 35H60C51.716 35 45 41.716 45 50V60H55V80H45V60H25Z" transform="scale(1, -1) translate(0, -95)"/>
                </svg>
            </div>
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-4" style={{marginTop: '-20vh'}}>
          <AyurVardanLogo className="h-24 w-24" />
          <span className="text-6xl font-light text-white tracking-widest" style={{ fontFamily: "'Times New Roman', Times, serif" }}>AYUR</span>
        </div>
        <h1 className="text-8xl font-bold text-[#603808] tracking-wider mt-2" style={{ fontFamily: "'Times New Roman', Times, serif" }}>VARDAN</h1>
        <p className="mt-16 text-xl italic text-[#603808]" style={{ fontFamily: 'cursive' }}>
          Unpacking Ayurveda as the new luxury!!
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
