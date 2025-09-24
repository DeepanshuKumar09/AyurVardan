import React from 'react';

export const DietitianIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    {/* Clipboard */}
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    
    {/* Apple in the middle */}
    <path d="M12 17a2.5 2.5 0 0 1-2.5-2.5c0-1.5 1.5-3.5 2.5-3.5s2.5 2 2.5 3.5A2.5 2.5 0 0 1 12 17z"/>
    <path d="M11.5 11.5c.5-1.5 1.5-2 2-2"/>
  </svg>
);