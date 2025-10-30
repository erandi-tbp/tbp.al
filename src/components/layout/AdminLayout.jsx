import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { AdminMainContent } from './AdminMainContent';
import { AdminFooter } from './AdminFooter';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area - offset by sidebar width */}
      <div className="ml-72 min-h-screen flex flex-col">
        {/* Fixed Top Bar */}
        <AdminNavbar />

        {/* Scrollable Page Content */}
        <div className="mt-[73px] mb-[73px] flex-1 overflow-y-auto">
          <AdminMainContent />
        </div>

        {/* Fixed Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};
