import React from 'react';

export const AyurVardanLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="48" fill="#386641" stroke="currentColor" strokeWidth="2" />
    <path
      d="M50 45 C 45 55, 55 55, 50 45 Z M 50 50 C 40 65, 60 65, 50 50"
      fill="#FBF7F0"
    />
    <circle cx="50" cy="40" r="5" fill="#FBF7F0" />
    <path
      d="M50 52 C 35 55, 30 70, 30 70 L 70 70 C 70 70, 65 55, 50 52 Z"
      fill="#FBF7F0"
    />
    <path
      d="M 25 75 Q 50 65, 75 75 Q 65 85, 35 85 Z"
      fill="#603808"
      stroke="#FBF7F0"
      strokeWidth="1"
    />
    <path
      d="M50 35 C 40 15, 30 25, 30 35 C 30 45, 40 45, 50 35"
      fill="#6A994E"
    />
    <path
      d="M50 35 C 60 15, 70 25, 70 35 C 70 45, 60 45, 50 35"
      fill="#A7C957"
    />
  </svg>
);
