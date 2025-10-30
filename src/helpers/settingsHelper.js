import { databases } from '../lib/appwrite';
import { Query, ID } from 'appwrite';
import { appwriteConfig } from '../config/appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const SETTINGS_COLLECTION = 'settings';

/**
 * Settings Helper - Manage key-value settings
 *
 * All settings are stored as key-value pairs in a single collection
 * No more schema changes needed for new settings!
 */

/**
 * Get all settings as an object
 * @returns {Object} Object with settingsKey as keys and settingsValue as values
 */
export async function getAllSettings() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SETTINGS_COLLECTION,
      [Query.limit(500)] // Get all settings
    );

    // Convert array to object for easier access
    const settingsObject = {};
    response.documents.forEach(doc => {
      settingsObject[doc.settingsKey] = parseSettingValue(doc.settingsValue);
    });

    return settingsObject;
  } catch (error) {
    console.error('Error getting all settings:', error);
    return {};
  }
}

/**
 * Get a specific setting value
 * @param {string} key - The setting key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} The setting value or default
 */
export async function getSetting(key, defaultValue = null) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SETTINGS_COLLECTION,
      [Query.equal('settingsKey', key)]
    );

    if (response.documents.length > 0) {
      return parseSettingValue(response.documents[0].settingsValue);
    }

    return defaultValue;
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Set/Update a setting value
 * @param {string} key - The setting key
 * @param {*} value - The setting value (will be stringified if object/array)
 * @returns {Object} The created/updated document
 */
export async function setSetting(key, value) {
  try {
    const stringValue = stringifySettingValue(value);

    // Check if setting already exists
    const existing = await databases.listDocuments(
      DATABASE_ID,
      SETTINGS_COLLECTION,
      [Query.equal('settingsKey', key)]
    );

    if (existing.documents.length > 0) {
      // Update existing
      return await databases.updateDocument(
        DATABASE_ID,
        SETTINGS_COLLECTION,
        existing.documents[0].$id,
        { settingsValue: stringValue }
      );
    } else {
      // Create new
      return await databases.createDocument(
        DATABASE_ID,
        SETTINGS_COLLECTION,
        ID.unique(),
        {
          settingsKey: key,
          settingsValue: stringValue
        }
      );
    }
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    throw error;
  }
}

/**
 * Set multiple settings at once
 * @param {Object} settingsObject - Object with key: value pairs
 * @returns {Array} Array of created/updated documents
 */
export async function setMultipleSettings(settingsObject) {
  const promises = Object.entries(settingsObject).map(([key, value]) =>
    setSetting(key, value)
  );

  return await Promise.all(promises);
}

/**
 * Delete a setting
 * @param {string} key - The setting key to delete
 * @returns {boolean} Success status
 */
export async function deleteSetting(key) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SETTINGS_COLLECTION,
      [Query.equal('settingsKey', key)]
    );

    if (response.documents.length > 0) {
      await databases.deleteDocument(
        DATABASE_ID,
        SETTINGS_COLLECTION,
        response.documents[0].$id
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error deleting setting ${key}:`, error);
    return false;
  }
}

/**
 * Helper: Parse setting value (handles JSON strings)
 */
function parseSettingValue(value) {
  if (!value) return value;

  // Try to parse as JSON
  try {
    return JSON.parse(value);
  } catch {
    // Return as-is if not valid JSON
    return value;
  }
}

/**
 * Helper: Stringify setting value (converts objects/arrays to JSON)
 */
function stringifySettingValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

// Common setting keys for reference
export const SETTING_KEYS = {
  // Branding
  LOGO_LIGHT: 'logoLight',
  LOGO_DARK: 'logoDark',
  FAVICON: 'favicon',
  WEBSITE_NAME: 'websiteName',
  SITE_TAGLINE: 'siteTagline',

  // Contact Info
  TAX_ID: 'taxId',
  EMAIL: 'email',
  PHONE: 'phone',
  ADDRESS_STREET: 'addressStreet',
  ADDRESS_CITY: 'addressCity',
  ADDRESS_COUNTRY: 'addressCountry',
  ADDRESS_ZIP: 'addressZip',

  // Maintenance Mode
  MAINTENANCE_ENABLED: 'maintenanceEnabled',
  MAINTENANCE_MESSAGE: 'maintenanceMessage',
  MAINTENANCE_CONTACTS: 'maintenanceContacts'
};
