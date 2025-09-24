import React from 'react';

export const VideoOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2l4-4 4 4h2a2 2 0 0 1 2 2v2" />
    <line x1="16" y1="12" x2="23" y2="12" />
    <line x1="23" y1="7" x2="16" y2="17" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);