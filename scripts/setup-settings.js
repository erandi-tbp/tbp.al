import { Client, Databases, Permission, Role } from 'node-appwrite';
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

async function setupSettings() {
  console.log('🚀 Starting settings collection setup...\n');

  try {
    // Create Settings Collection
    console.log('📝 Creating Settings collection...');
    await databases.createCollection(
      DATABASE_ID,
      'settings',
      'Settings',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );

    // Branding
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'logoLight', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'logoDark', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'favicon', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'websiteName', 255, false);

    // General Information
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'taxId', 100, false);
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'email', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'phone', 50, false);
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'addressStreet', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'addressCity', 100, false);
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'addressCountry', 100, false);
    await databases.createStringAttribute(DATABASE_ID, 'settings', 'addressZip', 20, false);

    console.log('✅ Settings collection created\n');

    console.log('🎉 Settings collection setup completed successfully!');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

setupSettings();
