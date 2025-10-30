import { useState, useEffect } from 'react';
import { useNotification } from '../../../hooks/useNotification';
import { storage } from '../../../lib/appwrite';
import { ID } from 'appwrite';
import { SEO } from '../../../components/common/SEO';
import { getAllSettings, setSetting, SETTING_KEYS } from '../../../helpers/settingsHelper';
import {
  PhotoIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0'; // settings-assets bucket

export const GeneralSettingsPage = () => {
  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state - Branding
  const [logoLight, setLogoLight] = useState('');
  const [logoDark, setLogoDark] = useState('');
  const [favicon, setFavicon] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [siteTagline, setSiteTagline] = useState('');

  // Form state - General Information
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressCountry, setAddressCountry] = useState('');
  const [addressZip, setAddressZip] = useState('');

  // Form state - Maintenance Mode
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [maintenanceContacts, setMaintenanceContacts] = useState([]);

  // Upload states
  const [uploadingLogoLight, setUploadingLogoLight] = useState(false);
  const [uploadingLogoDark, setUploadingLogoDark] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settings = await getAllSettings();

      // Branding
      setLogoLight(settings[SETTING_KEYS.LOGO_LIGHT] || '');
      setLogoDark(settings[SETTING_KEYS.LOGO_DARK] || '');
      setFavicon(settings[SETTING_KEYS.FAVICON] || '');
      setWebsiteName(settings[SETTING_KEYS.WEBSITE_NAME] || '');
      setSiteTagline(settings[SETTING_KEYS.SITE_TAGLINE] || '');

      // General Information
      setTaxId(settings[SETTING_KEYS.TAX_ID] || '');
      setEmail(settings[SETTING_KEYS.EMAIL] || '');
      setPhone(settings[SETTING_KEYS.PHONE] || '');
      setAddressStreet(settings[SETTING_KEYS.ADDRESS_STREET] || '');
      setAddressCity(settings[SETTING_KEYS.ADDRESS_CITY] || '');
      setAddressCountry(settings[SETTING_KEYS.ADDRESS_COUNTRY] || '');
      setAddressZip(settings[SETTING_KEYS.ADDRESS_ZIP] || '');

      // Maintenance Mode
      const maintenanceEnabledValue = settings[SETTING_KEYS.MAINTENANCE_ENABLED];
      setMaintenanceEnabled(maintenanceEnabledValue === 'true' || maintenanceEnabledValue === true);
      setMaintenanceMessage(settings[SETTING_KEYS.MAINTENANCE_MESSAGE] || '');

      const contactsValue = settings[SETTING_KEYS.MAINTENANCE_CONTACTS];
      if (typeof contactsValue === 'string') {
        try {
          setMaintenanceContacts(JSON.parse(contactsValue));
        } catch {
          setMaintenanceContacts([]);
        }
      } else if (Array.isArray(contactsValue)) {
        setMaintenanceContacts(contactsValue);
      } else {
        setMaintenanceContacts([]);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      addNotification('Error', 'Failed to load settings', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, field) => {
    if (!file) return null;

    try {
      // Upload to Appwrite Storage
      const response = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      );

      // Return the file ID to store in database
      return response.$id;
    } catch (error) {
      console.error('Error uploading file:', error);
      addNotification('Error', `Failed to upload ${field}`, { type: 'error' });
      return null;
    }
  };

  const handleLogoLightChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogoLight(true);
    const fileId = await handleFileUpload(file, 'logo (light mode)');
    if (fileId) {
      setLogoLight(fileId);
      addNotification('Success', 'Light mode logo uploaded');
    }
    setUploadingLogoLight(false);
  };

  const handleLogoDarkChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogoDark(true);
    const fileId = await handleFileUpload(file, 'logo (dark mode)');
    if (fileId) {
      setLogoDark(fileId);
      addNotification('Success', 'Dark mode logo uploaded');
    }
    setUploadingLogoDark(false);
  };

  const handleFaviconChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFavicon(true);
    const fileId = await handleFileUpload(file, 'favicon');
    if (fileId) {
      setFavicon(fileId);
      addNotification('Success', 'Favicon uploaded');
    }
    setUploadingFavicon(false);
  };

  const addContact = () => {
    setMaintenanceContacts([...maintenanceContacts, { label: '', value: '' }]);
  };

  const removeContact = (index) => {
    setMaintenanceContacts(maintenanceContacts.filter((_, i) => i !== index));
  };

  const updateContact = (index, field, value) => {
    const updated = [...maintenanceContacts];
    updated[index][field] = value;
    setMaintenanceContacts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save all settings using the helper
      await Promise.all([
        // Branding
        setSetting(SETTING_KEYS.LOGO_LIGHT, logoLight),
        setSetting(SETTING_KEYS.LOGO_DARK, logoDark),
        setSetting(SETTING_KEYS.FAVICON, favicon),
        setSetting(SETTING_KEYS.WEBSITE_NAME, websiteName),
        setSetting(SETTING_KEYS.SITE_TAGLINE, siteTagline),

        // General Information
        setSetting(SETTING_KEYS.TAX_ID, taxId),
        setSetting(SETTING_KEYS.EMAIL, email),
        setSetting(SETTING_KEYS.PHONE, phone),
        setSetting(SETTING_KEYS.ADDRESS_STREET, addressStreet),
        setSetting(SETTING_KEYS.ADDRESS_CITY, addressCity),
        setSetting(SETTING_KEYS.ADDRESS_COUNTRY, addressCountry),
        setSetting(SETTING_KEYS.ADDRESS_ZIP, addressZip),

        // Maintenance Mode
        setSetting(SETTING_KEYS.MAINTENANCE_ENABLED, maintenanceEnabled.toString()),
        setSetting(SETTING_KEYS.MAINTENANCE_MESSAGE, maintenanceMessage),
        setSetting(SETTING_KEYS.MAINTENANCE_CONTACTS, JSON.stringify(maintenanceContacts))
      ]);

      addNotification('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      addNotification('Error', 'Failed to save settings', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEO
          title="General Settings"
          description="Manage your website branding and general information"
          noIndex={true}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-text-secondary font-body">Loading settings...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="General Settings"
        description="Manage your website branding and general information"
        noIndex={true}
      />
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          General Settings
        </h1>
        <p className="text-text-secondary font-body">
          Manage your website branding and general information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Two Column Grid for Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Branding Section */}
          <div className="bg-bg-secondary border border-border rounded-lg p-6">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
              Branding
            </h2>

          <div className="space-y-6">
            {/* Website Name */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                Website Name
              </label>
              <input
                type="text"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                placeholder="Trusted Business Partners"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>

            {/* Site Tagline */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                Site Tagline
              </label>
              <input
                type="text"
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
                placeholder="Your Success, Our Commitment!"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>

            {/* Logo Light Mode */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                Logo (Light Mode)
              </label>
              <div className="flex items-center gap-4">
                {logoLight && (
                  <div className="w-32 h-32 bg-white border border-border rounded-lg flex items-center justify-center overflow-hidden p-2">
                    <img
                      src={`${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${logoLight}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`}
                      alt="Logo Light"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-primary border border-border rounded-lg hover:border-accent transition-colors">
                    {uploadingLogoLight ? (
                      <span className="text-text-secondary font-body">Uploading...</span>
                    ) : (
                      <>
                        <ArrowUpTrayIcon className="w-5 h-5 text-text-secondary" />
                        <span className="text-text-primary font-body">
                          {logoLight ? 'Change Logo' : 'Upload Logo'}
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoLightChange}
                    className="hidden"
                    disabled={uploadingLogoLight}
                  />
                </label>
              </div>
            </div>

            {/* Logo Dark Mode */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                Logo (Dark Mode)
              </label>
              <div className="flex items-center gap-4">
                {logoDark && (
                  <div className="w-32 h-32 bg-gray-900 border border-border rounded-lg flex items-center justify-center overflow-hidden p-2">
                    <img
                      src={`${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${logoDark}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`}
                      alt="Logo Dark"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-primary border border-border rounded-lg hover:border-accent transition-colors">
                    {uploadingLogoDark ? (
                      <span className="text-text-secondary font-body">Uploading...</span>
                    ) : (
                      <>
                        <ArrowUpTrayIcon className="w-5 h-5 text-text-secondary" />
                        <span className="text-text-primary font-body">
                          {logoDark ? 'Change Logo' : 'Upload Logo'}
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoDarkChange}
                    className="hidden"
                    disabled={uploadingLogoDark}
                  />
                </label>
              </div>
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                Favicon
              </label>
              <div className="flex items-center gap-4">
                {favicon && (
                  <div className="w-16 h-16 bg-bg-primary border border-border rounded-lg flex items-center justify-center overflow-hidden p-1">
                    <img
                      src={`${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${favicon}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`}
                      alt="Favicon"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-primary border border-border rounded-lg hover:border-accent transition-colors">
                    {uploadingFavicon ? (
                      <span className="text-text-secondary font-body">Uploading...</span>
                    ) : (
                      <>
                        <ArrowUpTrayIcon className="w-5 h-5 text-text-secondary" />
                        <span className="text-text-primary font-body">
                          {favicon ? 'Change Favicon' : 'Upload Favicon'}
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/x-icon,image/png"
                    onChange={handleFaviconChange}
                    className="hidden"
                    disabled={uploadingFavicon}
                  />
                </label>
              </div>
              <p className="text-xs text-text-secondary font-body mt-2">
                Recommended: 32x32 or 64x64 pixels, .ico or .png format
              </p>
            </div>
          </div>
          </div>

          {/* General Information Section */}
          <div className="bg-bg-secondary border border-border rounded-lg p-6">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
              General Information
            </h2>

            <div className="space-y-6">
            {/* TAX ID */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                TAX ID
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="123456789"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                E-mail Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@tbp.al"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+355 XX XXX XXXX"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={addressStreet}
                onChange={(e) => setAddressStreet(e.target.value)}
                placeholder="Rruga Dëshmorët e 4 Shkurtit"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                City
              </label>
              <input
                type="text"
                value={addressCity}
                onChange={(e) => setAddressCity(e.target.value)}
                placeholder="Tirana"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                Country
              </label>
              <input
                type="text"
                value={addressCountry}
                onChange={(e) => setAddressCountry(e.target.value)}
                placeholder="Albania"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>

            {/* ZIP */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={addressZip}
                onChange={(e) => setAddressZip(e.target.value)}
                placeholder="1001"
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>
            </div>
          </div>
        </div>

        {/* Maintenance Mode Section - Full Width */}
        <div className="bg-bg-secondary border border-border rounded-lg p-6">
          <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
            Maintenance Mode
          </h2>

          <div className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceEnabled}
                  onChange={(e) => setMaintenanceEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
              <div>
                <p className="text-sm font-body font-bold text-text-primary">
                  {maintenanceEnabled ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled'}
                </p>
                <p className="text-xs text-text-secondary font-body">
                  {maintenanceEnabled
                    ? 'Your website is currently in maintenance mode. Only admin pages are accessible.'
                    : 'Enable this to show a maintenance page to visitors while keeping admin access.'}
                </p>
              </div>
            </div>

            {/* Coming Soon Message */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                Coming Soon / Maintenance Message
              </label>
              <textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                rows={4}
                placeholder="We're currently working on something amazing! We'll be back soon..."
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent resize-none"
              />
              <p className="text-xs text-text-secondary font-body mt-1">
                This message will be displayed to visitors during maintenance mode
              </p>
            </div>

            {/* Contact Options Repeater */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-body font-bold text-text-primary">
                  Contact Options
                </label>
                <button
                  type="button"
                  onClick={addContact}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-white font-body text-sm rounded-lg hover:opacity-90 transition-opacity"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Contact
                </button>
              </div>

              {maintenanceContacts.length === 0 ? (
                <div className="text-center py-8 bg-bg-primary border border-dashed border-border rounded-lg">
                  <p className="text-text-secondary font-body text-sm">
                    No contact options added. Click "Add Contact" to add email, phone, or other contact methods.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {maintenanceContacts.map((contact, index) => (
                    <div key={index} className="flex gap-3 items-start bg-bg-primary border border-border rounded-lg p-4">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-body font-medium text-text-secondary mb-1">
                            Label (e.g., Email, Phone)
                          </label>
                          <input
                            type="text"
                            value={contact.label}
                            onChange={(e) => updateContact(index, 'label', e.target.value)}
                            placeholder="Email"
                            className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-text-primary font-body text-sm focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-body font-medium text-text-secondary mb-1">
                            Value (e.g., contact@example.com)
                          </label>
                          <input
                            type="text"
                            value={contact.value}
                            onChange={(e) => updateContact(index, 'value', e.target.value)}
                            placeholder="info@tbp.al"
                            className="w-full px-3 py-2 bg-bg-secondary border border-border rounded text-text-primary font-body text-sm focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors mt-5"
                        title="Remove"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-accent text-white font-body font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
      </div>
    </>
  );
};
