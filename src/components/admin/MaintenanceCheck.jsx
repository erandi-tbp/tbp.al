import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSettings } from '../../hooks/useSettings';

/**
 * MaintenanceCheck Component
 *
 * Checks if maintenance mode is enabled and redirects public pages to maintenance page
 * Admin pages (/admin/*) are always accessible regardless of maintenance mode
 */
export const MaintenanceCheck = ({ children }) => {
  const location = useLocation();
  const { settings, loading } = useSettings();
  const [shouldShowMaintenance, setShouldShowMaintenance] = useState(false);

  useEffect(() => {
    // Skip check while loading settings
    if (loading) return;

    // Allow all admin routes
    if (location.pathname.startsWith('/admin')) {
      setShouldShowMaintenance(false);
      return;
    }

    // Allow maintenance page itself
    if (location.pathname === '/maintenance') {
      setShouldShowMaintenance(false);
      return;
    }

    // Check if maintenance mode is enabled
    if (settings?.maintenanceEnabled) {
      setShouldShowMaintenance(true);
    } else {
      setShouldShowMaintenance(false);
    }
  }, [location.pathname, settings, loading]);

  // Show loading state while checking
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-secondary font-body">Loading...</p>
      </div>
    );
  }

  // Redirect to maintenance page if needed
  if (shouldShowMaintenance) {
    return <Navigate to="/maintenance" replace />;
  }

  // Render children if not in maintenance or on admin pages
  return children;
};
