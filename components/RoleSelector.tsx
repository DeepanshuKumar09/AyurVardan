import React from 'react';
import type { UserRole as UserRoleType } from '../types';
import { UserRole } from '../types';
import { PatientIcon } from './icons/PatientIcon';
import { DietitianIcon } from './icons/DietitianIcon';

interface RoleSelectorProps {
  onSelectRole: (role: UserRoleType) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-12 px-4 min-h-[calc(100vh-80px)]">
      <h2 className="text-3xl font-bold text-center text-slate-700 mb-2">Welcome to Ayur Vardan</h2>
      <p className="text-lg text-slate-500 mb-12 text-center">Please select your role to continue</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full max-w-2xl">
        <RoleCard
          icon={<DietitianIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-[#386641]" />}
          title="I am a Dietitian"
          description="Create personalized diet plans, manage consultations, and guide patients to wellness."
          onClick={() => onSelectRole(UserRole.DOCTOR)}
        />
        <RoleCard
          icon={<PatientIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-[#6A994E]" />}
          title="I am a Patient"
          description="View your medical history, check consultation notes, and connect with your dietitian."
          onClick={() => onSelectRole(UserRole.PATIENT)}
        />
      </div>
    </div>
  );
};

interface RoleCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, onClick }) => (
    <div
      onClick={onClick}
      className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-100 text-center"
    >
      {icon}
      <h3 className="text-base sm:text-xl font-bold text-slate-800 mt-4 mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500">{description}</p>
    </div>
);


export default RoleSelector;