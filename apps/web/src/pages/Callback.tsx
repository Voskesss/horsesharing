import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

const Callback = () => {
  const { isAuthenticated, isLoading, user } = useKindeAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Callback - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    console.log('Callback - user:', user);
    console.log('Callback - URL params:', window.location.search);
    
    // Simple redirect logic - wait for loading to finish
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('User authenticated, redirecting to onboarding');
        navigate('/onboarding', { replace: true });
      } else {
        console.log('User not authenticated, redirecting to login');
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-text-secondary">Inloggen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-text-secondary">Doorverwijzen...</p>
      </div>
    </div>
  );
};

export default Callback;
