import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

const ENTITY_COLLECTIONS = [
  { id: 'serviceGroups', name: 'Service Groups' },
  { id: 'services', name: 'Services' },
  { id: 'projects', name: 'Projects' },
  { id: 'caseStudies', name: 'Case Studies' },
  { id: 'testimonials', name: 'Testimonials' }
];

async function addExcerptField(collectionId, collectionName) {
  try {
    console.log(`\n📝 Adding excerpt field to ${collectionName}...`);

    await databases.createStringAttribute(
      DATABASE_ID,
      collectionId,
      'excerpt',
      500, // Max 500 characters for excerpt
      false // Optional field
    );

    console.log(`✅ Excerpt field added to ${collectionName}`);

  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  Excerpt field already exists in ${collectionName}`);
    } else {
      console.error(`❌ Error adding excerpt to ${collectionName}:`, error.message);
      throw error;
    }
  }
}

async function main() {
  console.log('🚀 Adding excerpt field to all entity collections...\n');
  console.log('📋 Excerpt field details:');
  console.log('   - Type: String');
  console.log('   - Max length: 500 characters');
  console.log('   - Optional: Yes');
  console.log('   - Purpose: Short summary that syncs to meta_description\n');

  for (const collection of ENTITY_COLLECTIONS) {
    await addExcerptField(collection.id, collection.name);
    // Wait a bit between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✨ All excerpt fields added successfully!');
  console.log('\n💡 Usage:');
  console.log('   1. Excerpt auto-populates meta_description if not manually set');
  console.log('   2. Users can override meta_description independently');
  console.log('   3. Excerpt is displayed in listings/previews');
  console.log('   4. Meta description is for SEO only');
}

main().catch(console.error);
