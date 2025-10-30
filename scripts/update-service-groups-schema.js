import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = 'tbp-agency';

async function updateServiceGroupsSchema() {
  console.log('🚀 Updating serviceGroups collection schema...\n');

  try {
    // Add featuredImage field
    console.log('Adding featuredImage field...');
    await databases.createStringAttribute(DATABASE_ID, 'serviceGroups', 'featuredImage', 255, false);
    console.log('✅ featuredImage field added\n');

    // Add featuredIcon field
    console.log('Adding featuredIcon field...');
    await databases.createStringAttribute(DATABASE_ID, 'serviceGroups', 'featuredIcon', 255, false);
    console.log('✅ featuredIcon field added\n');

    // Add SEO fields
    console.log('Adding SEO fields...');
    await databases.createStringAttribute(DATABASE_ID, 'serviceGroups', 'seoTitle', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'serviceGroups', 'seoKeywords', 1000, false);
    await databases.createStringAttribute(DATABASE_ID, 'serviceGroups', 'metaDescription', 500, false);
    console.log('✅ SEO fields added\n');

    console.log('🎉 serviceGroups schema updated successfully!');

  } catch (error) {
    console.error('❌ Error during update:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

updateServiceGroupsSchema();
