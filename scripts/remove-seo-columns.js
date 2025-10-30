import { Client, Databases } from 'node-appwrite';
import 'dotenv/config';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

/**
 * Remove SEO columns from entity collections
 * These fields are now stored in meta tables
 */

const COLLECTIONS = [
  { id: 'serviceGroups', name: 'Service Groups' },
  { id: 'services', name: 'Services' },
  { id: 'projects', name: 'Projects' },
  { id: 'caseStudies', name: 'Case Studies' },
  { id: 'testimonials', name: 'Testimonials' }
];

const SEO_ATTRIBUTES = ['seoTitle', 'seoKeywords', 'metaDescription'];

async function removeAttributeIfExists(collectionId, attributeKey) {
  try {
    await databases.deleteAttribute(DATABASE_ID, collectionId, attributeKey);
    console.log(`✓ Removed attribute "${attributeKey}" from collection "${collectionId}"`);
    return true;
  } catch (error) {
    if (error.code === 404) {
      console.log(`  ℹ Attribute "${attributeKey}" does not exist in collection "${collectionId}"`);
      return false;
    }
    console.error(`✗ Error removing attribute "${attributeKey}" from collection "${collectionId}":`, error.message);
    return false;
  }
}

async function removeSeoColumnsFromCollection(collectionId, collectionName) {
  console.log(`\n📦 Processing collection: ${collectionName} (${collectionId})`);

  for (const attribute of SEO_ATTRIBUTES) {
    await removeAttributeIfExists(collectionId, attribute);
    // Wait a bit between deletions to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function deleteSeoMetadataCollection() {
  console.log('\n📦 Deleting old seoMetadata collection...');
  try {
    await databases.deleteCollection(DATABASE_ID, 'seoMetadata');
    console.log('✓ Successfully deleted seoMetadata collection');
  } catch (error) {
    if (error.code === 404) {
      console.log('  ℹ seoMetadata collection does not exist');
    } else {
      console.error('✗ Error deleting seoMetadata collection:', error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting SEO columns removal migration...\n');
  console.log('This will:');
  console.log('  1. Remove SEO attributes from all entity collections:');
  console.log('     - seoTitle');
  console.log('     - seoKeywords');
  console.log('     - metaDescription');
  console.log('  2. Delete the old seoMetadata collection');
  console.log('\nThese fields are now stored in entity-specific meta tables.\n');

  for (const collection of COLLECTIONS) {
    await removeSeoColumnsFromCollection(collection.id, collection.name);
  }

  await deleteSeoMetadataCollection();

  console.log('\n✅ Migration completed!');
  console.log('\nSEO data is now stored in entity-specific meta tables:');
  console.log('  - serviceGroupsMeta');
  console.log('  - servicesMeta');
  console.log('  - projectsMeta');
  console.log('  - caseStudiesMeta');
  console.log('  - testimonialsMeta');
}

main().catch(console.error);
