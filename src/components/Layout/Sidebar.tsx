import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BrainCircuit,
  Users,
  MessageSquare,
  Shield,
  Gamepad2,
  BookOpen,
  Heart,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Brain,
  Search,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const Sidebar = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  const { user } = useAuth();
  const location = useLocation();

  const role = user?.profile?.role;
  const name = user?.profile?.display_name || user?.email;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=random`;

  const getNavigationItems = (): NavItem[] => {
    const commonItems: NavItem[] = [
      { path: '/community', icon: Users, label: 'Community' },
      { path: '/chat', icon: MessageSquare, label: 'Chat' },
      { path: '/safety', icon: Shield, label: 'Safety' },
      { path: '/resources', icon: BookOpen, label: 'Resources' },
      { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const roleSpecificItems: Record<string, NavItem[]> = {
      patient: [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/assessment', icon: BrainCircuit, label: 'Assessments' },
        { path: '/cognitive-games', icon: Gamepad2, label: 'Games' },
        { path: '/wellness', icon: Heart, label: 'Wellness' },
        { path: '/connections', icon: Search, label: 'Find Clinicians' },
      ],
      psychologist: [
        { path: '/psychologist-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/patients', icon: Users, label: 'Patients' },
        { path: '/reports', icon: FileText, label: 'Reports' },
      ],
      admin: [
        { path: '/admin', icon: Settings, label: 'Admin Panel' },
      ],
    };

    return [...(roleSpecificItems[role || ''] || []), ...commonItems];
  };

  const navigationItems = getNavigationItems();

  return (
    <motion.aside
      animate={{ width: isOpen ? '16rem' : '5rem' }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-card border-r z-40 flex flex-col"
    >
      <div className="p-4 border-b flex items-center justify-between h-16">
        <div className={cn("flex items-center gap-3 overflow-hidden", !isOpen && "w-8")}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          {isOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold"
            >
              NeuroAssist
            </motion.h1>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-full hover:bg-muted -mr-2"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                isActive && "bg-primary/10 text-primary font-semibold",
                !isOpen && "justify-center"
              )}
              title={!isOpen ? item.label : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-2 border-t">
         <NavLink
            to="/profile"
            className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                 location.pathname.startsWith('/profile') && "bg-primary/10 text-primary font-semibold",
                !isOpen && "justify-center"
            )}
            title={!isOpen ? 'Profile' : ''}
        >
            <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full flex-shrink-0" />
            {isOpen && (
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{role}</p>
                </div>
            )}
        </NavLink>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
