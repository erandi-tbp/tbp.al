import { Client, Databases } from 'node-appwrite';
import 'dotenv/config';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

async function addFeaturedImageToServices() {
  console.log('Adding featuredImage to services collection...');

  try {
    await databases.createStringAttribute(
      DATABASE_ID,
      'services',
      'featuredImage',
      255,
      false // optional
    );
    console.log('✓ Added featuredImage attribute to services');
  } catch (error) {
    if (error.code === 409) {
      console.log('  ℹ featuredImage already exists in services');
    } else {
      console.error('✗ Error adding featuredImage to services:', error.message);
    }
  }
}

async function main() {
  console.log('🚀 Adding missing attributes...\n');
  await addFeaturedImageToServices();
  console.log('\n✅ Done!');
}

main().catch(console.error);
