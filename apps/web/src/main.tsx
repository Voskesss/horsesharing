import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Clear all Kinde localStorage data to fix token errors
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('kinde') || key.startsWith('@kinde')) {
    localStorage.removeItem(key);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <KindeProvider
        clientId="d80a119a2a8a453a899f05af988a592b"
        domain="https://horsesharing.kinde.com"
        redirectUri="http://localhost:3000/callback"
        logoutUri="http://localhost:3000"
        audience=""
        scope="openid profile email offline"
        isDangerouslyUseLocalStorage={false}
        onRedirectCallback={() => {
          console.log('Kinde redirect callback triggered');
        }}
      >
        <App />
      </KindeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
