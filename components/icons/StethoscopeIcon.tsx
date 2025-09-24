
import React from 'react';

export const StethoscopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M4 18a4 4 0 0 0 4 4h8" />
    <path d="M4 14v-4a4 4 0 0 1 4-4v0" />
    <path d="M16 14v-4a4 4 0 0 0-4-4v0" />
    <path d="M12 10v4" />
    <path d="M12 6V4" />
    <circle cx="12" cy="4" r="2" />
  </svg>
);
