import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AdminRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary font-body">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if logged in, otherwise to login
  return <Navigate to={isAuthenticated ? '/admin/dashboard' : '/admin/login'} replace />;
};
