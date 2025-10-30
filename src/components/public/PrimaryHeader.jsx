import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../common/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';
import { getAllSettings, SETTING_KEYS } from '../../helpers/settingsHelper';

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';

/**
 * DesktopHeader - Header for desktop viewport
 */
export const DesktopHeader = () => {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const allSettings = await getAllSettings();
      setSettings(allSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const logoLight = settings[SETTING_KEYS.LOGO_LIGHT] || '';
  const logoDark = settings[SETTING_KEYS.LOGO_DARK] || '';
  const websiteName = settings[SETTING_KEYS.WEBSITE_NAME] || 'TBP';
  const currentLogo = isDark ? logoDark : logoLight;

  return (
    <header className="hidden md:block bg-bg-secondary border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {currentLogo ? (
              <img
                src={`${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${currentLogo}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`}
                alt={websiteName}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl font-heading font-bold text-text-primary">
                {websiteName}
              </span>
            )}
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="font-body text-text-primary hover:text-accent transition-colors"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="font-body text-text-primary hover:text-accent transition-colors"
            >
              Services
            </Link>
            <Link
              to="/projects"
              className="font-body text-text-primary hover:text-accent transition-colors"
            >
              Projects
            </Link>
            <Link
              to="/case-studies"
              className="font-body text-text-primary hover:text-accent transition-colors"
            >
              Case Studies
            </Link>
            <Link
              to="/about"
              className="font-body text-text-primary hover:text-accent transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-6 py-2 bg-accent text-white font-body font-bold rounded-lg hover:bg-accent/90 transition-colors"
            >
              Contact
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

/**
 * MobileHeader - Header for mobile viewport with hamburger menu
 */
export const MobileHeader = () => {
  const { isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const allSettings = await getAllSettings();
      setSettings(allSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const logoLight = settings[SETTING_KEYS.LOGO_LIGHT] || '';
  const logoDark = settings[SETTING_KEYS.LOGO_DARK] || '';
  const websiteName = settings[SETTING_KEYS.WEBSITE_NAME] || 'TBP';
  const currentLogo = isDark ? logoDark : logoLight;

  return (
    <header className="md:hidden bg-bg-secondary border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            {currentLogo ? (
              <img
                src={`${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${currentLogo}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`}
                alt={websiteName}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className="text-xl font-heading font-bold text-text-primary">
                {websiteName}
              </span>
            )}
          </Link>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-text-primary hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="font-body text-text-primary hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="font-body text-text-primary hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/projects"
                className="font-body text-text-primary hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                to="/case-studies"
                className="font-body text-text-primary hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Case Studies
              </Link>
              <Link
                to="/about"
                className="font-body text-text-primary hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="inline-block text-center px-6 py-3 bg-accent text-white font-body font-bold rounded-lg hover:bg-accent/90 transition-colors mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-2 border-t border-border mt-2">
                <ThemeToggle />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
