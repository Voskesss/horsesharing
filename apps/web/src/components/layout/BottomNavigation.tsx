import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  HeartIcon as HeartIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Home',
    icon: HomeIcon,
    activeIcon: HomeIconSolid
  },
  {
    path: '/discover',
    label: 'Ontdekken',
    icon: MagnifyingGlassIcon,
    activeIcon: MagnifyingGlassIconSolid
  },
  {
    path: '/matches',
    label: 'Matches',
    icon: HeartIcon,
    activeIcon: HeartIconSolid
  },
  {
    path: '/messages',
    label: 'Berichten',
    icon: ChatBubbleLeftRightIcon,
    activeIcon: ChatBubbleLeftRightIconSolid
  },
  {
    path: '/profile',
    label: 'Profiel',
    icon: UserIcon,
    activeIcon: UserIconSolid
  }
];

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 py-1 relative"
            >
              {({ isActive: linkActive }) => (
                <>
                  <motion.div
                    className="flex flex-col items-center justify-center"
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      color: linkActive ? '#3CBF8C' : '#6B7280'
                    }}
                  >
                    <Icon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">
                      {item.label}
                    </span>
                  </motion.div>
                  
                  {linkActive && (
                    <motion.div
                      className="absolute -top-0.5 left-1/2 w-8 h-1 bg-primary rounded-full"
                      layoutId="bottomNavIndicator"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ x: '-50%' }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
