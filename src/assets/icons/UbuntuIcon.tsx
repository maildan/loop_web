import React from 'react';

interface UbuntuIconProps {
  className?: string;
  size?: number;
}

export const UbuntuIcon: React.FC<UbuntuIconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    className={className}
    fill="currentColor"
  >
    <circle cx="16" cy="16" r="16" fill="#E95420"/>
    <circle cx="7.5" cy="16" r="2.5" fill="white"/>
    <circle cx="22" cy="9" r="2.5" fill="white"/>
    <circle cx="22" cy="23" r="2.5" fill="white"/>
    <path d="M16 8c-1.1 0-2.1.2-3.1.6l1.2 2.1c.6-.2 1.2-.3 1.9-.3 2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1c-.7 0-1.3-.1-1.9-.3l-1.2 2.1c1 .4 2 .6 3.1.6 4.4 0 8-3.6 8-8s-3.6-8-8-8z" fill="white"/>
    <path d="M12.8 13.6c.8-1.4 2.3-2.3 3.9-2.3.4 0 .8.1 1.2.2l1.2-2.1c-.7-.3-1.5-.4-2.4-.4-2.6 0-4.9 1.3-6.2 3.3l2.3 1.3z" fill="white"/>
    <path d="M12.8 18.4l-2.3 1.3c1.3 2 3.6 3.3 6.2 3.3.9 0 1.7-.1 2.4-.4l-1.2-2.1c-.4.1-.8.2-1.2.2-1.6 0-3.1-.9-3.9-2.3z" fill="white"/>
  </svg>
);
