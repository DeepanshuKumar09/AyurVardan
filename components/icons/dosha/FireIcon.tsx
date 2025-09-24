import React from 'react';

export const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="30" fill="#d38c22" />
    <path
      d="M32 50 C 20 50, 20 30, 32 20 C 44 30, 44 50, 32 50 Z"
      fill="#f1c40f"
    />
    <path
      d="M32 50 C 25 50, 25 35, 32 28 C 39 35, 39 50, 32 50 Z"
      fill="#f39c12"
    />
     <path
      d="M26 48 C 22 48, 22 38, 26 34 C 30 38, 30 48, 26 48 Z"
      fill="#f39c12"
      transform="rotate(20 26 41)"
    />
     <path
      d="M38 48 C 34 48, 34 38, 38 34 C 42 38, 42 48, 38 48 Z"
      fill="#f39c12"
      transform="rotate(-20 38 41)"
    />
  </svg>
);