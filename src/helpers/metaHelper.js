import { databases } from '../lib/appwrite';
import { Query, ID } from 'appwrite';
import { appwriteConfig } from '../config/appwrite';

const DATABASE_ID = appwriteConfig.databaseId;

/**
 * Meta Helper - Manage metadata for any entity
 *
 * Provides CRUD operations for metadata across all entities:
 * - serviceGroupsMeta
 * - servicesMeta
 * - projectsMeta
 * - caseStudiesMeta
 * - testimonialsMeta
 * - pagesMeta
 */

/**
 * Get all metadata for an entity
 * @param {string} collectionName - Meta collection name (e.g., 'serviceGroupsMeta')
 * @param {string} entityId - The entity ID
 * @returns {Object} Object with metaKey as keys and metaValue as values
 */
export async function getAllMeta(collectionName, entityId) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      collectionName,
      [Query.equal('entityId', entityId)]
    );

    // Convert array to object for easier access
    const metaObject = {};
    response.documents.forEach(doc => {
      metaObject[doc.metaKey] = parseMetaValue(doc.metaValue);
    });

    return metaObject;
  } catch (error) {
    console.error(`Error getting meta for ${entityId}:`, error);
    return {};
  }
}

/**
 * Get a specific meta value
 * @param {string} collectionName - Meta collection name
 * @param {string} entityId - The entity ID
 * @param {string} metaKey - The meta key to retrieve
 * @param {*} defaultValue - Default value if not found
 * @returns {*} The meta value or default
 */
export async function getMeta(collectionName, entityId, metaKey, defaultValue = null) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      collectionName,
      [
        Query.equal('entityId', entityId),
        Query.equal('metaKey', metaKey)
      ]
    );

    if (response.documents.length > 0) {
      return parseMetaValue(response.documents[0].metaValue);
    }

    return defaultValue;
  } catch (error) {
    console.error(`Error getting meta ${metaKey} for ${entityId}:`, error);
    return defaultValue;
  }
}

/**
 * Set/Update a meta value
 * @param {string} collectionName - Meta collection name
 * @param {string} entityId - The entity ID
 * @param {string} metaKey - The meta key
 * @param {*} metaValue - The meta value (will be stringified if object/array)
 * @returns {Object} The created/updated meta document
 */
export async function setMeta(collectionName, entityId, metaKey, metaValue) {
  try {
    const stringValue = stringifyMetaValue(metaValue);

    // Check if meta already exists
    const existing = await databases.listDocuments(
      DATABASE_ID,
      collectionName,
      [
        Query.equal('entityId', entityId),
        Query.equal('metaKey', metaKey)
      ]
    );

    if (existing.documents.length > 0) {
      // Update existing
      return await databases.updateDocument(
        DATABASE_ID,
        collectionName,
        existing.documents[0].$id,
        { metaValue: stringValue }
      );
    } else {
      // Create new
      return await databases.createDocument(
        DATABASE_ID,
        collectionName,
        ID.unique(),
        {
          entityId,
          metaKey,
          metaValue: stringValue
        }
      );
    }
  } catch (error) {
    console.error(`Error setting meta ${metaKey} for ${entityId}:`, error);
    throw error;
  }
}

/**
 * Set multiple meta values at once
 * @param {string} collectionName - Meta collection name
 * @param {string} entityId - The entity ID
 * @param {Object} metaObject - Object with metaKey: metaValue pairs
 * @returns {Array} Array of created/updated documents
 */
export async function setMultipleMeta(collectionName, entityId, metaObject) {
  const promises = Object.entries(metaObject).map(([key, value]) =>
    setMeta(collectionName, entityId, key, value)
  );

  return await Promise.all(promises);
}

/**
 * Delete a meta value
 * @param {string} collectionName - Meta collection name
 * @param {string} entityId - The entity ID
 * @param {string} metaKey - The meta key to delete
 * @returns {boolean} Success status
 */
export async function deleteMeta(collectionName, entityId, metaKey) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      collectionName,
      [
        Query.equal('entityId', entityId),
        Query.equal('metaKey', metaKey)
      ]
    );

    if (response.documents.length > 0) {
      await databases.deleteDocument(
        DATABASE_ID,
        collectionName,
        response.documents[0].$id
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error deleting meta ${metaKey} for ${entityId}:`, error);
    return false;
  }
}

/**
 * Delete all metadata for an entity
 * @param {string} collectionName - Meta collection name
 * @param {string} entityId - The entity ID
 * @returns {boolean} Success status
 */
export async function deleteAllMeta(collectionName, entityId) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      collectionName,
      [Query.equal('entityId', entityId)]
    );

    const promises = response.documents.map(doc =>
      databases.deleteDocument(DATABASE_ID, collectionName, doc.$id)
    );

    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error(`Error deleting all meta for ${entityId}:`, error);
    return false;
  }
}

/**
 * Search entities by meta value
 * @param {string} collectionName - Meta collection name
 * @param {string} metaKey - The meta key to search
 * @param {*} metaValue - The meta value to match
 * @returns {Array} Array of entityIds that match
 */
export async function findEntitiesByMeta(collectionName, metaKey, metaValue) {
  try {
    const stringValue = stringifyMetaValue(metaValue);

    const response = await databases.listDocuments(
      DATABASE_ID,
      collectionName,
      [
        Query.equal('metaKey', metaKey),
        Query.equal('metaValue', stringValue)
      ]
    );

    return response.documents.map(doc => doc.entityId);
  } catch (error) {
    console.error(`Error finding entities by meta ${metaKey}:`, error);
    return [];
  }
}

/**
 * Helper: Parse meta value (handles JSON strings)
 */
function parseMetaValue(value) {
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
 * Helper: Stringify meta value (converts objects/arrays to JSON)
 */
function stringifyMetaValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

// Export collection names for convenience
export const META_COLLECTIONS = {
  SERVICE_GROUPS: 'serviceGroupsMeta',
  SERVICES: 'servicesMeta',
  PROJECTS: 'projectsMeta',
  CASE_STUDIES: 'caseStudiesMeta',
  TESTIMONIALS: 'testimonialsMeta',
  PAGES: 'pagesMeta',
  SETTINGS: 'settingsMeta'
};
