import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg bg-accent text-white font-body font-medium hover:opacity-90 transition-opacity"
      aria-label="Toggle theme"
    >
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};
