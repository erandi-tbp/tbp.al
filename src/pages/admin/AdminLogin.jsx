import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';

export const AdminLogin = () => {
  usePageTitle('Admin Login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  if (!authLoading && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary font-body">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-text-primary mb-2">
            TBP.AL
          </h1>
          <p className="text-text-secondary font-body">
            Admin Login
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-bg-secondary rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-sm font-body">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-text-primary font-body font-bold mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border text-text-primary font-body focus:outline-none focus:border-accent transition-colors"
                placeholder="admin@tbp.al"
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-text-primary font-body font-bold mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-bg-primary border border-border text-text-primary font-body focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-text-secondary text-sm font-body mt-6">
          Access restricted to authorized administrators only
        </p>
      </div>
    </div>
  );
};
