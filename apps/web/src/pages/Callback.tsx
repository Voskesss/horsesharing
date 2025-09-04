import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { api } from '../utils/api';

const Callback = () => {
  const kindeAuth = useKindeAuth();
  const { isAuthenticated, isLoading, user } = kindeAuth;
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Callback - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    console.log('Callback - user:', user);
    console.log('Callback - user email:', user?.email);
    console.log('Callback - URL params:', window.location.search);
    
    const checkUserInDatabase = async () => {
      if (!isLoading && isAuthenticated && user) {
        try {
          console.log(`Checking login for user: ${user.email}`);
          
          // Probeer echte Kinde token op te halen
          console.log('Getting Kinde access token...');
          let token;
          try {
            token = await kindeAuth.getToken();
            console.log('Token received:', token ? 'Success' : 'Failed');
          } catch (tokenError) {
            console.error('Error getting token:', tokenError);
            console.log('Using placeholder token as fallback');
            token = 'placeholder-token';
          }
          
          if (token && token !== 'placeholder-token') {
            console.log('Checking if user exists in backend with real token...');
            const userExists = await api.checkUserExists(token);
            console.log('User exists in backend:', userExists);
            
            if (userExists) {
              console.log('User exists, redirecting to dashboard');
              navigate('/dashboard', { replace: true });
            } else {
              console.log('User does not exist, redirecting to onboarding');
              navigate('/onboarding', { replace: true });
            }
          } else {
            console.log('No valid token available, redirecting to onboarding');
            navigate('/onboarding', { replace: true });
          }
        } catch (error) {
          console.error('Error in callback:', error);
          console.log('Error occurred, redirecting to onboarding');
          navigate('/onboarding', { replace: true });
        }
      } else if (!isLoading && !isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        navigate('/login', { replace: true });
      }
    };
    
    checkUserInDatabase();
  }, [isAuthenticated, isLoading, navigate, user]);

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
