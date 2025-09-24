import React from 'react';

export const RepeatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M17 2.1l4 4-4 4" />
    <path d="M3 12.6v-2.6a4 4 0 0 1 4-4h14" />
    <path d="M7 21.9l-4-4 4-4" />
    <path d="M21 11.4v2.6a4 4 0 0 1-4 4H3" />
  </svg>
);