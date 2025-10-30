import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export const UserAvatarDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/admin/login');
    }
  };

  const menuItems = [
    {
      label: 'Profile',
      Icon: UserCircleIcon,
      onClick: () => {
        navigate('/admin/profile');
        setIsOpen(false);
      }
    },
    {
      label: 'Settings',
      Icon: Cog6ToothIcon,
      onClick: () => {
        navigate('/admin/settings');
        setIsOpen(false);
      }
    }
  ];

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'AD';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-primary transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-body font-bold text-sm">
          {getInitials()}
        </div>

        {/* User Name (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm font-body text-text-primary max-w-32 truncate">
            {user?.name || user?.email || 'Admin'}
          </span>
          <ChevronDownIcon className="w-4 h-4 text-text-secondary" />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-bg-secondary border border-border rounded-lg shadow-xl overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-body font-bold">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-bold text-text-primary truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-sm text-text-secondary font-body truncate">
                  {user?.email || 'admin@tbp.al'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => {
              const Icon = item.Icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full px-4 py-2.5 text-left hover:bg-bg-primary transition-colors flex items-center gap-3 text-text-primary"
                >
                  <Icon className="w-5 h-5 text-text-secondary" />
                  <span className="font-body">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <div className="py-1 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left hover:bg-red-500/10 transition-colors flex items-center gap-3 text-red-500"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-body font-bold">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
