import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from '../ui/Container';

export function AuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userParam = params.get('user');

    if (token && userParam) {
      localStorage.setItem('token', token);
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        navigate('/login');
        return;
      }
      navigate('/cloud');
    } else {
      // Handle error case where token or user is not present
      console.error('Authentication failed: No token or user data received.');
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Container>
        <div className="text-center">
          <p className="text-lg">Authenticating, please wait...</p>
        </div>
      </Container>
    </div>
  );
}
