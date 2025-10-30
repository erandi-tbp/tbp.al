import { Client, Databases } from 'node-appwrite';
import 'dotenv/config';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

async function checkCollections() {
  console.log('🔍 Checking database collections...\n');

  const collections = [
    'serviceGroups',
    'services',
    'projects',
    'caseStudies',
    'testimonials',
    'pages'
  ];

  for (const collectionId of collections) {
    try {
      const collection = await databases.getCollection(DATABASE_ID, collectionId);
      console.log(`✓ ${collection.name} (${collectionId})`);
      console.log(`  Attributes: ${collection.attributes.map(a => a.key).join(', ')}`);
      console.log('');
    } catch (error) {
      if (error.code === 404) {
        console.log(`✗ ${collectionId} - DOES NOT EXIST`);
        console.log('');
      } else {
        console.error(`✗ Error checking ${collectionId}:`, error.message);
        console.log('');
      }
    }
  }
}

checkCollections().catch(console.error);
