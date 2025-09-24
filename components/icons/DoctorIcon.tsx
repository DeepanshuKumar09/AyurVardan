
import React from 'react';

export const DoctorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5.5 4.5A3.5 3.5 0 0 1 9 8v5.5a3.5 3.5 0 0 1-7 0V8a3.5 3.5 0 0 1 3.5-3.5z" />
        <path d="M2 14h7" />
        <path d="M12 20a4 4 0 0 0 4-4V4" />
        <path d="M12 4h4" />
        <path d="M18 11h2" />
        <path d="M18 15h2" />
        <path d="M18 19h2" />
    </svg>
);
