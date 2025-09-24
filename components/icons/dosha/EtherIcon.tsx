import React from 'react';

export const EtherIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="etherGradient" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#d9c2ff" />
        <stop offset="100%" stopColor="#8e44ad" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#etherGradient)" />
    <path
      d="M32,12 A20,20 0 1,1 12,32"
      stroke="#ffffff"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M32,18 A14,14 0 1,1 18,32"
      stroke="#d9c2ff"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M32,24 A8,8 0 1,1 24,32"
      stroke="#ffffff"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);