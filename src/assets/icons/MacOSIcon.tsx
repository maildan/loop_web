import React from 'react';

interface MacOSIconProps {
  className?: string;
  size?: number;
}

export const MacOSIcon: React.FC<MacOSIconProps> = ({ className = '', size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M17.05 20.28C16.03 21.23 14.96 21.31 13.93 20.84C12.84 20.36 11.81 20.33 10.68 20.84C9.26 21.51 8.5 21.39 7.62 20.28C3.87 16.1 4.56 9.81 8.92 9.6C10.04 9.66 10.8 10.31 11.41 10.35C12.34 10.15 13.23 9.48 14.26 9.57C15.6 9.7 16.6 10.25 17.24 11.22C14.13 13.06 14.88 17.18 17.05 20.28ZM11.27 9.52C11.09 7.2 12.97 5.34 15.15 5.2C15.43 7.91 12.85 9.85 11.27 9.52Z"
      fill="currentColor"
    />
  </svg>
);
