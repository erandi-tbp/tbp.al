import { useState, useEffect } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { databases, storage } from '../../lib/appwrite';
import { ID } from 'appwrite';
import { SEO } from '../../components/common/SEO';
import {
  PhotoIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0'; // settings-assets bucket

export const GeneralSettingsPage = () => {
  const { addNotification } = useNotification();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

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
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'settings'
      );

      if (response.documents.length > 0) {
        const settings = response.documents[0];
        setSettingsId(settings.$id);

        // Branding
        setLogoLight(settings.logoLight || '');
        setLogoDark(settings.logoDark || '');
        setFavicon(settings.favicon || '');
        setWebsiteName(settings.websiteName || '');
        setSiteTagline(settings.siteTagline || '');

        // General Information
        setTaxId(settings.taxId || '');
        setEmail(settings.email || '');
        setPhone(settings.phone || '');
        setAddressStreet(settings.addressStreet || '');
        setAddressCity(settings.addressCity || '');
        setAddressCountry(settings.addressCountry || '');
        setAddressZip(settings.addressZip || '');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const settingsData = {
        // Branding
        logoLight,
        logoDark,
        favicon,
        websiteName,
        siteTagline,

        // General Information
        taxId,
        email,
        phone,
        addressStreet,
        addressCity,
        addressCountry,
        addressZip
      };

      if (settingsId) {
        // Update existing settings
        await databases.updateDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          'settings',
          settingsId,
          settingsData
        );
      } else {
        // Create new settings document
        const response = await databases.createDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          'settings',
          ID.unique(),
          settingsData
        );
        setSettingsId(response.$id);
      }

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
          <div className="bg-bg-secondary border border-text-primary/10 rounded-lg p-6">
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
                className="w-full px-4 py-2 bg-bg-primary border border-text-primary/20 rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
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
                className="w-full px-4 py-2 bg-bg-primary border border-text-primary/20 rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>

            {/* Logo Light Mode */}
            <div>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                Logo (Light Mode)
              </label>
              <div className="flex items-center gap-4">
                {logoLight && (
                  <div className="w-32 h-32 bg-white border border-text-primary/10 rounded-lg flex items-center justify-center overflow-hidden p-2">
                    <img
                      src={`${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${logoLight}/preview?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}&width=200&height=200`}
                      alt="Logo Light"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        // Fallback to view endpoint if preview fails (for SVGs)
                        e.target.src = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${logoLight}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
                      }}
                    />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-primary border border-text-primary/20 rounded-lg hover:border-accent transition-colors">
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
                  <div className="w-32 h-32 bg-gray-900 border border-text-primary/10 rounded-lg flex items-center justify-center overflow-hidden p-2">
                    <img
                      src={`${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${logoDark}/preview?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}&width=200&height=200`}
                      alt="Logo Dark"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        // Fallback to view endpoint if preview fails (for SVGs)
                        e.target.src = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${logoDark}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
                      }}
                    />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-primary border border-text-primary/20 rounded-lg hover:border-accent transition-colors">
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
                  <div className="w-16 h-16 bg-bg-primary border border-text-primary/10 rounded-lg flex items-center justify-center overflow-hidden p-1">
                    <img
                      src={`${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${favicon}/preview?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}&width=64&height=64`}
                      alt="Favicon"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        // Fallback to view endpoint if preview fails (for SVGs/ICO)
                        e.target.src = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${favicon}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
                      }}
                    />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-primary border border-text-primary/20 rounded-lg hover:border-accent transition-colors">
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
          <div className="bg-bg-secondary border border-text-primary/10 rounded-lg p-6">
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
                className="w-full px-4 py-2 bg-bg-primary border border-text-primary/20 rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
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
                className="w-full px-4 py-2 bg-bg-primary border border-text-primary/20 rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
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
                className="w-full px-4 py-2 bg-bg-primary border border-text-primary/20 rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
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
                className="w-full px-4 py-2 bg-bg-primary border border-text-primary/20 rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
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
                className="w-full px-4 py-2 bg-bg-primary border border-text-primary/20 rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
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
                className="w-full px-4 py-2 bg-bg-primary border border-text-primary/20 rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
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
                className="w-full px-4 py-2 bg-bg-primary border border-text-primary/20 rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
              />
            </div>
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
