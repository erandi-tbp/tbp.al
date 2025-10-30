import { Client, Databases } from 'node-appwrite';
import 'dotenv/config';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

/**
 * Create pagesMeta collection for storing custom page metadata
 */

async function createPagesMetaCollection() {
  console.log('📦 Creating pagesMeta collection...');

  try {
    // Create collection
    await databases.createCollection(
      DATABASE_ID,
      'pagesMeta',
      'Pages Meta'
    );
    console.log('✓ Created pagesMeta collection');

    // Wait for collection to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create attributes
    console.log('\n📝 Creating attributes...');

    await databases.createStringAttribute(
      DATABASE_ID,
      'pagesMeta',
      'entityId',
      255,
      true // required
    );
    console.log('✓ Created entityId attribute');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await databases.createStringAttribute(
      DATABASE_ID,
      'pagesMeta',
      'metaKey',
      255,
      true // required
    );
    console.log('✓ Created metaKey attribute');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await databases.createStringAttribute(
      DATABASE_ID,
      'pagesMeta',
      'metaValue',
      10000,
      false // optional
    );
    console.log('✓ Created metaValue attribute');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create indexes
    console.log('\n🔍 Creating indexes...');

    await databases.createIndex(
      DATABASE_ID,
      'pagesMeta',
      'entityId_idx',
      'key',
      ['entityId'],
      ['asc']
    );
    console.log('✓ Created entityId index');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await databases.createIndex(
      DATABASE_ID,
      'pagesMeta',
      'entityId_metaKey_idx',
      'unique',
      ['entityId', 'metaKey'],
      ['asc', 'asc']
    );
    console.log('✓ Created entityId + metaKey unique index');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await databases.createIndex(
      DATABASE_ID,
      'pagesMeta',
      'metaKey_idx',
      'key',
      ['metaKey'],
      ['asc']
    );
    console.log('✓ Created metaKey index');

    console.log('\n✅ Successfully created pagesMeta collection with all attributes and indexes!');

  } catch (error) {
    if (error.code === 409) {
      console.log('  ℹ pagesMeta collection already exists');
    } else {
      console.error('✗ Error creating pagesMeta collection:', error.message);
      throw error;
    }
  }
}

async function main() {
  console.log('🚀 Creating pagesMeta collection...\n');
  await createPagesMetaCollection();
  console.log('\n✅ Migration completed!');
  console.log('\nAll meta collections:');
  console.log('  - serviceGroupsMeta');
  console.log('  - servicesMeta');
  console.log('  - projectsMeta');
  console.log('  - caseStudiesMeta');
  console.log('  - testimonialsMeta');
  console.log('  - pagesMeta ← NEW');
}

main().catch(console.error);
