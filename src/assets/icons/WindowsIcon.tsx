import React from 'react';

interface WindowsIconProps {
  className?: string;
  size?: number;
}

export const WindowsIcon: React.FC<WindowsIconProps> = ({ className = '', size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 5.557L9.455 4.726V11.273H3V5.557ZM9.455 19.274L3 18.443V12.727H9.455V19.274ZM10.909 4.485L21 3V11.273H10.909V4.485ZM10.909 12.727H21V21L10.909 19.515V12.727Z"
      fill="currentColor"
    />
  </svg>
);
