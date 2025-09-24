import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Brain,
  Users,
  MessageSquare,
  Shield,
  Gamepad2,
  BookOpen,
  Heart,
  Settings,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  const role = user?.profile?.role || user?.user_metadata?.role;
  const name = user?.profile?.name;
  const avatar =
    user?.profile?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || 'U'
    )}&background=0D8ABC&color=fff`;

  const getNavigationItems = () => {
    const commonItems = [
      { path: '/community', icon: Users, label: 'Community' },
      { path: '/chat', icon: MessageSquare, label: 'Chat' },
      { path: '/safety', icon: Shield, label: 'Safety Panel' },
      { path: '/resources', icon: BookOpen, label: 'Resources' },
    ];

    const roleSpecificItems = {
      patient: [
        { path: '/home', icon: Home, label: 'Home' },
        { path: '/diagnosis', icon: Brain, label: 'Diagnosis' },
        { path: '/cognitive-game', icon: Gamepad2, label: 'Cognitive Games' },
        { path: '/wellness', icon: Heart, label: 'Wellness' },
      ],
      psychologist: [
        { path: '/psychologist-home', icon: Home, label: 'Home' },
        { path: '/patients', icon: Users, label: 'Patients' },
        { path: '/reports', icon: FileText, label: 'Reports' },
      ],
      admin: [
        { path: '/admin', icon: Settings, label: 'Admin Panel' },
        { path: '/users', icon: User, label: 'User Management' },
      ],
    };

    return [...(roleSpecificItems[role] || []), ...commonItems];
  };

  const navigationItems = getNavigationItems();

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo + Toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              MindBridge
            </motion.h1>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gray-200 dark:bg-gray-700 font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${!isOpen ? 'justify-center' : ''}`}
              title={!isOpen ? item.label : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info */}
      {isOpen && user?.profile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-4 left-4 right-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {role}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
