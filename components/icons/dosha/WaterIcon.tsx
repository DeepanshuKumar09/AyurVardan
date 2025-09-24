import React from 'react';

export const WaterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="30" fill="#3498db" />
    <path
      d="M22 50 C 28 42, 36 42, 42 50"
      stroke="#a9cce3"
      strokeWidth="5"
      fill="none"
    />
    <path
      d="M18 42 C 26 34, 38 34, 46 42"
      stroke="#5dade2"
      strokeWidth="5"
      fill="none"
    />
    <path
      d="M32 14 C 20 28, 44 28, 32 14 L 32 38 C 32 45, 25 45, 25 38 C 25 31, 32 31, 32 38 C 32 45, 39 45, 39 38 C 39 31, 32 31, 32 38"
      transform="M32 14 C 20 28, 44 28, 32 14 L 32 35 C 32 45 22 45 22 35 C 22 25 32 25 32 35 C 32 45 42 45 42 35 C 42 25 32 25 32 35 Z"
      fill="white"
    />
     <path d="M 32 12 A 14 14 0 0 0 18 26 C 18 36 32 52 32 52 C 32 52 46 36 46 26 A 14 14 0 0 0 32 12 Z"
      fill="white"
    />

  </svg>
);