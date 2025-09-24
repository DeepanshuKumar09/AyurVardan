import React from 'react';

export const AirIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="30" fill="#8d8d8d" />
    <path
      d="M15 44 C 25 34, 40 34, 50 44"
      stroke="#ffffff"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M12 32 C 22 22, 42 22, 52 32"
      stroke="#b0b0b0"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
     <path
      d="M18 20 C 28 10, 44 10, 54 20"
      stroke="#ffffff"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);