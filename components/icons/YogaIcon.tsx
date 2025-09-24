import React from 'react';

export const YogaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M12 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
        <path d="M4 18c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
        <path d="M12 14v-4"/>
        <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
        <path d="M4.2 12.8c-.8.8-.8 2 0 2.8l2 2c.8.8 2 .8 2.8 0"/>
        <path d="M15 17.8c.8.8 2 .8 2.8 0l2-2c.8-.8.8-2 0-2.8"/>
    </svg>
);
