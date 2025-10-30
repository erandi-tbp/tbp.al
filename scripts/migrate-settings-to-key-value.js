import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;

async function migrateSettings() {
  try {
    console.log('🔄 Starting settings migration to key-value store...\n');

    // Step 1: Backup existing settings data
    console.log('📦 Backing up existing settings...');
    let existingSettings = null;
    try {
      const response = await databases.listDocuments(databaseId, 'settings');
      if (response.documents.length > 0) {
        existingSettings = response.documents[0];
        console.log('✅ Settings backed up successfully');
      } else {
        console.log('ℹ️  No existing settings found');
      }
    } catch (error) {
      console.log('ℹ️  Settings collection does not exist yet');
    }

    // Step 2: Delete old settings collection
    console.log('\n🗑️  Deleting old settings collection...');
    try {
      await databases.deleteCollection(databaseId, 'settings');
      console.log('✅ Old settings collection deleted');
    } catch (error) {
      console.log('ℹ️  Settings collection did not exist');
    }

    // Step 3: Delete old settingsMeta collection (we don't need it anymore)
    console.log('\n🗑️  Deleting old settingsMeta collection...');
    try {
      await databases.deleteCollection(databaseId, 'settingsMeta');
      console.log('✅ Old settingsMeta collection deleted');
    } catch (error) {
      console.log('ℹ️  settingsMeta collection did not exist');
    }

    // Step 4: Create new settings collection with key-value structure
    console.log('\n📝 Creating new settings collection with key-value structure...');
    await databases.createCollection(
      databaseId,
      'settings',
      'settings',
      [
        'read("any")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ]
    );
    console.log('✅ Settings collection created');

    // Step 5: Create attributes
    console.log('\n🔧 Creating attributes...');

    // settingsKey - string attribute (unique)
    await databases.createStringAttribute(
      databaseId,
      'settings',
      'settingsKey',
      255,
      true, // required
      null, // default
      false, // array
      false // encrypt
    );
    console.log('✅ Created settingsKey attribute');

    // settingsValue - string attribute (large for JSON)
    await databases.createStringAttribute(
      databaseId,
      'settings',
      'settingsValue',
      10000, // Large enough for complex data
      false, // not required (some settings might be empty)
      null,
      false,
      false
    );
    console.log('✅ Created settingsValue attribute');

    // Wait for attributes to be ready
    console.log('\n⏳ Waiting for attributes to be available...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 6: Create unique index on settingsKey
    console.log('\n🔍 Creating unique index on settingsKey...');
    await databases.createIndex(
      databaseId,
      'settings',
      'settingsKey_unique',
      'unique',
      ['settingsKey']
    );
    console.log('✅ Unique index created');

    // Wait for index to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 7: Migrate old data if it existed
    if (existingSettings) {
      console.log('\n📤 Migrating old settings data to new structure...');

      const settingsToMigrate = [
        { key: 'logoLight', value: existingSettings.logoLight || '' },
        { key: 'logoDark', value: existingSettings.logoDark || '' },
        { key: 'favicon', value: existingSettings.favicon || '' },
        { key: 'websiteName', value: existingSettings.websiteName || '' },
        { key: 'siteTagline', value: existingSettings.siteTagline || '' },
        { key: 'taxId', value: existingSettings.taxId || '' },
        { key: 'email', value: existingSettings.email || '' },
        { key: 'phone', value: existingSettings.phone || '' },
        { key: 'addressStreet', value: existingSettings.addressStreet || '' },
        { key: 'addressCity', value: existingSettings.addressCity || '' },
        { key: 'addressCountry', value: existingSettings.addressCountry || '' },
        { key: 'addressZip', value: existingSettings.addressZip || '' }
      ];

      for (const setting of settingsToMigrate) {
        if (setting.value) { // Only migrate non-empty values
          await databases.createDocument(
            databaseId,
            'settings',
            ID.unique(),
            {
              settingsKey: setting.key,
              settingsValue: setting.value
            }
          );
          console.log(`  ✓ Migrated ${setting.key}`);
        }
      }

      console.log('✅ All settings migrated successfully');
    }

    // Step 8: Create default settings if none existed
    if (!existingSettings) {
      console.log('\n📝 Creating default settings...');

      const defaultSettings = [
        { key: 'websiteName', value: 'TBP.AL' },
        { key: 'siteTagline', value: 'Your Success, Our Commitment!' },
        { key: 'maintenanceEnabled', value: 'false' },
        { key: 'maintenanceMessage', value: "We're currently working on something amazing! We'll be back soon." }
      ];

      for (const setting of defaultSettings) {
        await databases.createDocument(
          databaseId,
          'settings',
          ID.unique(),
          {
            settingsKey: setting.key,
            settingsValue: setting.value
          }
        );
        console.log(`  ✓ Created default ${setting.key}`);
      }

      console.log('✅ Default settings created');
    }

    console.log('\n✨ Migration completed successfully!');
    console.log('\n📋 New Settings Structure:');
    console.log('   - Collection: settings');
    console.log('   - Attributes: settingsKey (string, unique), settingsValue (string)');
    console.log('   - All settings are now stored as key-value pairs');
    console.log('   - No more schema changes needed for new settings!');

  } catch (error) {
    console.error('\n❌ Error during migration:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run migration
migrateSettings();
