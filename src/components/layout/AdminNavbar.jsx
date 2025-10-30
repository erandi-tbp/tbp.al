import { SearchBar } from '../admin/SearchBar';
import { ThemeToggle } from '../common/ThemeToggle';

export const AdminNavbar = () => {
  return (
    <header className="bg-bg-secondary border-b border-text-primary/10 px-6 py-4 flex items-center gap-4">
      {/* Search Bar - Fluid */}
      <SearchBar />

      {/* Right Side Widgets */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle (will be replaced with dropdown later) */}
        <ThemeToggle />

        {/* Placeholder for future widgets:
            - Notification Icon with dropdown
            - Theme Mode with Dropdown
            - User avatar with dropdown
        */}
      </div>
    </header>
  );
};
