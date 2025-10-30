import { SearchBar } from '../admin/SearchBar';
import { NotificationDropdown } from '../admin/NotificationDropdown';
import { ThemeDropdown } from '../admin/ThemeDropdown';
import { UserAvatarDropdown } from '../admin/UserAvatarDropdown';

export const AdminNavbar = () => {
  return (
    <header className="bg-bg-secondary border-b border-border px-6 py-4 flex items-center justify-between gap-6 fixed top-0 right-0 left-72 z-20">
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
