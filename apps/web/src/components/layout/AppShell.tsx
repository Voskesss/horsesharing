import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import BottomNavigation from './BottomNavigation';
import Navbar from './Navbar';
import Footer from './Footer';

const AppShell: React.FC = () => {
  const { isAuthenticated } = useKindeAuth();
  const location = useLocation();

  // Pages that should show bottom navigation
  const bottomNavPages = ['/dashboard', '/discover', '/matches', '/messages', '/profile'];
  const showBottomNav = isAuthenticated && bottomNavPages.includes(location.pathname);

  // Pages that should hide the main navbar
  const hideNavbarPages = ['/login', '/register'];
  const showNavbar = !hideNavbarPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showNavbar && <Navbar />}
      
      <main className={`flex-1 ${showBottomNav ? 'pb-16' : ''}`}>
        <Outlet />
      </main>

      {!showBottomNav && <Footer />}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default AppShell;
