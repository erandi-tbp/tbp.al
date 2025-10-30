import { useEffect, useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useTheme } from '../../contexts/ThemeContext';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export const MaintenancePage = () => {
  const { settings, getLogoUrl } = useSettings();
  const { isDark } = useTheme();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (settings?.maintenanceContacts) {
      // settingsHelper already parses JSON, so maintenanceContacts is already an array
      if (Array.isArray(settings.maintenanceContacts)) {
        setContacts(settings.maintenanceContacts);
      } else {
        // Fallback: try parsing if it's still a string (shouldn't happen)
        try {
          const parsed = JSON.parse(settings.maintenanceContacts);
          setContacts(parsed);
        } catch (error) {
          console.error('Error parsing maintenance contacts:', error);
          setContacts([]);
        }
      }
    } else {
      setContacts([]);
    }
  }, [settings]);

  const defaultMessage = "We're currently working on something amazing! We'll be back soon.";

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo or Website Name */}
        <div className="mb-8">
          {getLogoUrl(isDark) ? (
            <img
              src={getLogoUrl(isDark)}
              alt={settings?.websiteName || 'Logo'}
              className="h-16 w-auto object-contain mx-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <h1 className="text-4xl font-heading font-bold text-text-primary">
              {settings?.websiteName || 'TBP.AL'}
            </h1>
          )}
        </div>

        {/* Maintenance Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 border-4 border-accent/20">
            <WrenchScrewdriverIcon className="w-12 h-12 text-accent" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
          We'll Be Back Soon
        </h2>

        {/* Message */}
        <div className="mb-8">
          <p className="text-lg text-text-secondary font-body leading-relaxed whitespace-pre-wrap">
            {settings?.maintenanceMessage || defaultMessage}
          </p>
        </div>

        {/* Contact Options */}
        {contacts.length > 0 && (
          <div className="bg-bg-secondary border border-border rounded-lg p-6 inline-block">
            <h3 className="text-sm font-body font-bold text-text-secondary uppercase tracking-wider mb-4">
              Need to reach us?
            </h3>
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-center gap-3 text-text-primary">
                  <span className="font-body font-medium">{contact.label}:</span>
                  <a
                    href={
                      contact.label.toLowerCase().includes('email')
                        ? `mailto:${contact.value}`
                        : contact.label.toLowerCase().includes('phone')
                        ? `tel:${contact.value}`
                        : contact.value.startsWith('http')
                        ? contact.value
                        : '#'
                    }
                    className="font-body text-accent hover:underline"
                  >
                    {contact.value}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12">
          <p className="text-sm text-text-secondary font-body">
            Thank you for your patience!
          </p>
        </div>
      </div>
    </div>
  );
};
