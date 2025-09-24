import React from 'react';

export const GoogleHealthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M12 22V12"/>
        <path d="M12 12V2"/>
        <path d="M22 12H12"/>
        <path d="M12 12H2"/>
        <path d="M12 22a2.5 2.5 0 0 0 2.5-2.5V12" stroke="#4285F4" strokeWidth="3"/>
        <path d="M12 12V2a2.5 2.5 0 0 1 2.5 2.5H12" stroke="#EA4335" strokeWidth="3"/>
        <path d="M2 12h10v2.5A2.5 2.5 0 0 1 9.5 17H2" stroke="#FBBC05" strokeWidth="3"/>
        <path d="M12 12v-2.5A2.5 2.5 0 0 1 14.5 7H22v5h-7.5A2.5 2.5 0 0 1 12 14.5V12" stroke="#34A853" strokeWidth="3"/>
    </svg>
);