import { useState, useEffect } from 'react';

interface User {
  name: string;
  profilePictureUrl: string;
  // 다른 사용자 속성들을 여기에 추가할 수 있습니다.
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    console.log('🔍 localStorage user data:', userData);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('🔍 Parsed user object:', parsedUser);
        console.log('🔍 Profile picture URL:', parsedUser?.profilePictureUrl);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        setUser(null);
      }
    } else {
      console.log('🔍 No user data found in localStorage');
    }
  }, []);

  return { user };
};
