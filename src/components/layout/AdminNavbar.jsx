import { SearchBar } from '../admin/SearchBar';
import { NotificationDropdown } from '../admin/NotificationDropdown';
import { ThemeDropdown } from '../admin/ThemeDropdown';
import { UserAvatarDropdown } from '../admin/UserAvatarDropdown';

export const AdminNavbar = () => {
  return (
    <header className="bg-bg-secondary border-b border-text-primary/10 px-6 py-4 flex items-center justify-between gap-6">
      {/* Left Side - Search Bar */}
      <div className="flex-1 max-w-2xl">
        <SearchBar />
      </div>

      {/* Right Side - Widgets Grouped */}
      <div className="flex items-center gap-1">
        <NotificationDropdown />
        <ThemeDropdown />
        <UserAvatarDropdown />
      </div>
    </header>
  );
};
