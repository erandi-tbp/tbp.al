import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Theme mode: 'light', 'dark', or 'system'
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    return saved || 'system';
  });

  // Actual applied theme (resolved from mode)
  const [isDark, setIsDark] = useState(false);

  // Get system preference
  const getSystemPreference = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Resolve the actual theme based on mode
  useEffect(() => {
    let newIsDark = false;

    if (themeMode === 'system') {
      newIsDark = getSystemPreference();
    } else {
      newIsDark = themeMode === 'dark';
    }

    setIsDark(newIsDark);
  }, [themeMode]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      setIsDark(e.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [themeMode]);

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Save theme mode to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const setTheme = (mode) => {
    setThemeMode(mode);
  };

  // Legacy toggle function for backward compatibility
  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ isDark, themeMode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
