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
          
          // Voor nu skippen we de backend check en gaan altijd naar onboarding
          // Later implementeren we echte token handling
          console.log('Skipping backend check for now, redirecting to onboarding');
          navigate('/onboarding', { replace: true });
          
          /* TODO: Implementeer echte backend check
          console.log('Using placeholder token for backend check...');
          const token = 'placeholder-token';
          
          console.log('Checking if user exists in backend...');
          const userExists = await api.checkUserExists(token);
          console.log('User exists in backend:', userExists);
          
          if (userExists) {
            console.log('User exists, redirecting to dashboard');
            navigate('/dashboard', { replace: true });
          } else {
            console.log('User does not exist, redirecting to onboarding');
            navigate('/onboarding', { replace: true });
          }
          */
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
