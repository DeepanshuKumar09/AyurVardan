import React from 'react';

export const EarthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="30" fill="#a2d5ac" />
    <path d="M4 44 C 22 40, 42 40, 60 44 L 60 60 L 4 60 Z" fill="#588157" />
    <path d="M4 48 C 22 45, 42 45, 60 48 L 60 60 L 4 60 Z" fill="#3a5a40" />
    <rect x="30" y="28" width="4" height="18" fill="white" />
    <circle cx="32" cy="22" r="10" fill="white" />
  </svg>
);