/**
 * Appwrite Configuration
 * Centralized configuration with fallback values for production
 */

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '6903529600346ac783d8',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'tbp-agency',
  bucketSettings: import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0'
};
