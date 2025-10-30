import { Client, Databases } from 'node-appwrite';
import 'dotenv/config';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

/**
 * Remove hardcoded relationship columns from entity collections
 * These relationships are now stored in meta tables for flexibility
 */

const COLUMNS_TO_REMOVE = [
  { collection: 'services', attribute: 'serviceGroupId' },
  { collection: 'projects', attribute: 'serviceGroupIds' },
  { collection: 'caseStudies', attribute: 'projectId' },
  { collection: 'caseStudies', attribute: 'serviceGroupId' },
  { collection: 'testimonials', attribute: 'relatedType' },
  { collection: 'testimonials', attribute: 'relatedId' }
];

async function removeAttributeIfExists(collectionId, attributeKey) {
  try {
    await databases.deleteAttribute(DATABASE_ID, collectionId, attributeKey);
    console.log(`✓ Removed "${attributeKey}" from "${collectionId}"`);
    return true;
  } catch (error) {
    if (error.code === 404) {
      console.log(`  ℹ Attribute "${attributeKey}" does not exist in "${collectionId}"`);
      return false;
    }
    console.error(`✗ Error removing "${attributeKey}" from "${collectionId}":`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Removing hardcoded relationship columns...\n');
  console.log('These relationships will now be stored in meta tables for flexibility.\n');

  for (const item of COLUMNS_TO_REMOVE) {
    await removeAttributeIfExists(item.collection, item.attribute);
    // Wait between deletions to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n✅ Migration completed!');
  console.log('\nRelationships are now stored in meta tables:');
  console.log('  - services.service_group_id → servicesMeta');
  console.log('  - caseStudies.project_id → caseStudiesMeta');
  console.log('  - testimonials.testimonial_entity_type + testimonial_entity_id → testimonialsMeta');
}

main().catch(console.error);
