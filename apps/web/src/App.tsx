import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Horses from './pages/Horses';
import Callback from './pages/Callback';

function App() {
  // Homepage en login zijn publiek toegankelijk, geen loading spinner nodig

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/discover" element={
            <ProtectedRoute>
              <Discover />
            </ProtectedRoute>
          } />
          <Route path="/matches" element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/horses" element={
            <ProtectedRoute>
              <Horses />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;
