import React from 'react';

export const HerbsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 2a10 10 0 0 0-3.5 19.33" />
    <path d="M12 2a10 10 0 0 1 3.5 19.33" />
    <path d="M2 12a10 10 0 0 0 19.33 3.5" />
    <path d="M2 12a10 10 0 0 1 19.33-3.5" />
  </svg>
);
