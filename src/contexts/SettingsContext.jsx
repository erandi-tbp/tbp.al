import { createContext, useState, useEffect } from 'react';
import { getAllSettings } from '../helpers/settingsHelper';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const settingsData = await getAllSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Helper function to get logo URL
  const getLogoUrl = (isDark = false) => {
    if (!settings) return null;

    const logoId = isDark ? settings.logoDark : settings.logoLight;
    if (!logoId) return null;

    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';
    return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${logoId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
  };

  // Helper function to get favicon URL
  const getFaviconUrl = () => {
    if (!settings || !settings.favicon) return null;

    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';
    return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${settings.favicon}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
  };

  const value = {
    settings,
    loading,
    getLogoUrl,
    getFaviconUrl,
    refreshSettings: loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
