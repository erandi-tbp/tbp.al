import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

const META_COLLECTIONS = [
  {
    id: 'serviceGroupsMeta',
    name: 'Service Groups Meta'
  },
  {
    id: 'servicesMeta',
    name: 'Services Meta'
  },
  {
    id: 'projectsMeta',
    name: 'Projects Meta'
  },
  {
    id: 'caseStudiesMeta',
    name: 'Case Studies Meta'
  },
  {
    id: 'testimonialsMeta',
    name: 'Testimonials Meta'
  }
];

async function createMetaCollection(collectionId, collectionName) {
  try {
    console.log(`\n📦 Creating ${collectionName} collection...`);

    // Create collection
    await databases.createCollection(
      DATABASE_ID,
      collectionId,
      collectionName,
      [
        // Anyone can read, only authenticated users can write
        'read("any")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ]
    );

    console.log(`✅ Collection "${collectionName}" created`);

    // Add attributes
    console.log('   Adding attributes...');

    // Entity ID - links to parent entity (serviceGroup, service, etc.)
    await databases.createStringAttribute(
      DATABASE_ID,
      collectionId,
      'entityId',
      255,
      true // required
    );
    console.log('   ✓ entityId attribute added');

    // Meta key (e.g., "custom_field", "extra_info", "settings")
    await databases.createStringAttribute(
      DATABASE_ID,
      collectionId,
      'metaKey',
      255,
      true // required
    );
    console.log('   ✓ metaKey attribute added');

    // Meta value (stored as text, can hold JSON strings)
    await databases.createStringAttribute(
      DATABASE_ID,
      collectionId,
      'metaValue',
      10000, // Large enough for JSON data
      false // optional
    );
    console.log('   ✓ metaValue attribute added');

    // Wait for attributes to be available
    console.log('   ⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create indexes for better query performance
    console.log('   Creating indexes...');

    // Index on entityId for fast lookups
    await databases.createIndex(
      DATABASE_ID,
      collectionId,
      'entityId_idx',
      'key',
      ['entityId'],
      ['asc']
    );
    console.log('   ✓ entityId index created');

    // Composite index on entityId + metaKey for unique constraints
    await databases.createIndex(
      DATABASE_ID,
      collectionId,
      'entityId_metaKey_idx',
      'unique',
      ['entityId', 'metaKey'],
      ['asc', 'asc']
    );
    console.log('   ✓ entityId + metaKey unique index created');

    // Index on metaKey for filtering by key
    await databases.createIndex(
      DATABASE_ID,
      collectionId,
      'metaKey_idx',
      'key',
      ['metaKey'],
      ['asc']
    );
    console.log('   ✓ metaKey index created');

    console.log(`✅ ${collectionName} fully configured!`);

  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  Collection "${collectionName}" already exists, skipping...`);
    } else {
      console.error(`❌ Error creating ${collectionName}:`, error.message);
      throw error;
    }
  }
}

async function main() {
  console.log('🚀 Creating Meta Collections for all entities...\n');

  for (const metaCollection of META_COLLECTIONS) {
    await createMetaCollection(metaCollection.id, metaCollection.name);
  }

  console.log('\n✨ All meta collections created successfully!');
  console.log('\n📋 Structure for each meta collection:');
  console.log('   - entityId: Links to parent entity (indexed)');
  console.log('   - metaKey: Metadata key name (indexed)');
  console.log('   - metaValue: Metadata value (supports JSON)');
  console.log('   - Unique constraint: entityId + metaKey');
  console.log('\n💡 Usage examples:');
  console.log('   - Custom fields per entity');
  console.log('   - Dynamic settings');
  console.log('   - Extra attributes without schema changes');
  console.log('   - Store JSON data as strings in metaValue');
}

main().catch(console.error);
