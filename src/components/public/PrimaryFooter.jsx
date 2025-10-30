import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllSettings, SETTING_KEYS } from '../../helpers/settingsHelper';

/**
 * PrimaryFooter - Footer for all public pages
 */
export const PrimaryFooter = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const allSettings = await getAllSettings();
      setSettings(allSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const websiteName = settings[SETTING_KEYS.WEBSITE_NAME] || 'TBP';
  const email = settings[SETTING_KEYS.EMAIL] || '';
  const phone = settings[SETTING_KEYS.PHONE] || '';
  const addressStreet = settings[SETTING_KEYS.ADDRESS_STREET] || '';
  const addressCity = settings[SETTING_KEYS.ADDRESS_CITY] || '';
  const addressCountry = settings[SETTING_KEYS.ADDRESS_COUNTRY] || '';
  const addressZip = settings[SETTING_KEYS.ADDRESS_ZIP] || '';

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-heading font-bold text-text-primary mb-4">
              {websiteName}
            </h3>
            <p className="text-text-secondary font-body text-sm">
              Trusted Business Partners delivering excellence in every project.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-bold text-text-primary mb-4">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-text-secondary hover:text-accent font-body text-sm transition-colors">
                Home
              </Link>
              <Link to="/services" className="text-text-secondary hover:text-accent font-body text-sm transition-colors">
                Services
              </Link>
              <Link to="/projects" className="text-text-secondary hover:text-accent font-body text-sm transition-colors">
                Projects
              </Link>
              <Link to="/case-studies" className="text-text-secondary hover:text-accent font-body text-sm transition-colors">
                Case Studies
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-heading font-bold text-text-primary mb-4">
              Company
            </h3>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-text-secondary hover:text-accent font-body text-sm transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-text-secondary hover:text-accent font-body text-sm transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="text-text-secondary hover:text-accent font-body text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-text-secondary hover:text-accent font-body text-sm transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-heading font-bold text-text-primary mb-4">
              Contact
            </h3>
            <div className="flex flex-col gap-2 text-text-secondary font-body text-sm">
              {email && (
                <a href={`mailto:${email}`} className="hover:text-accent transition-colors">
                  {email}
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`} className="hover:text-accent transition-colors">
                  {phone}
                </a>
              )}
              {(addressStreet || addressCity || addressCountry) && (
                <address className="not-italic">
                  {addressStreet && <div>{addressStreet}</div>}
                  {(addressCity || addressZip || addressCountry) && (
                    <div>
                      {addressCity}{addressZip && `, ${addressZip}`}
                      {addressCountry && `, ${addressCountry}`}
                    </div>
                  )}
                </address>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-text-secondary font-body text-sm">
            &copy; {currentYear} {websiteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
