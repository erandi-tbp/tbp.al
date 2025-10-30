import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export const ThemeDropdown = () => {
  const { themeMode, setTheme } = useTheme();
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

  const handleThemeChange = (mode) => {
    setTheme(mode);
    setIsOpen(false);
  };

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      Icon: SunIcon
    },
    {
      value: 'dark',
      label: 'Dark',
      Icon: MoonIcon
    },
    {
      value: 'system',
      label: 'System',
      Icon: ComputerDesktopIcon
    }
  ];

  const currentTheme = themeOptions.find(t => t.value === themeMode);
  const CurrentIcon = currentTheme.Icon;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-bg-primary transition-colors"
      >
        <CurrentIcon className="w-5 h-5 text-text-secondary" />
        <ChevronDownIcon className="w-4 h-4 text-text-secondary" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-text-primary/20 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="py-1">
            {themeOptions.map((option) => {
              const Icon = option.Icon;
              const isActive = themeMode === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`w-full px-4 py-2.5 text-left hover:bg-bg-primary transition-colors flex items-center justify-between gap-3 ${
                    isActive ? 'text-accent' : 'text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className={`font-body ${isActive ? 'font-bold' : ''}`}>
                      {option.label}
                    </span>
                  </div>
                  {isActive && <CheckIcon className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
