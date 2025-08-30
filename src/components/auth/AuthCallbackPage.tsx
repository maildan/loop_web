import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from '../ui/Container';

export function AuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // Optionally, you could also fetch user info here with the token
      // and store it in local storage or a state management library.
      navigate('/cloud');
    } else {
      // Handle error case where token is not present
      console.error('Authentication failed: No token received.');
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
