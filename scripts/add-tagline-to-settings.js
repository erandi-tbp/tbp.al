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

async function addTaglineField() {
  console.log('🚀 Adding siteTagline field to settings collection...\n');

  try {
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'siteTagline', 500, false);

    console.log('✅ Site Tagline field added successfully!\n');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

addTaglineField();
