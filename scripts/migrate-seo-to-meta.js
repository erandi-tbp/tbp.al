import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

/**
 * Migrate SEO fields from serviceGroups to serviceGroupsMeta
 *
 * SEO fields to migrate:
 * - seoTitle
 * - seoKeywords
 * - metaDescription
 */

async function migrateSeoToMeta() {
  try {
    console.log('🚀 Migrating SEO fields from serviceGroups to serviceGroupsMeta...\n');

    // Get all service groups
    const response = await databases.listDocuments(
      DATABASE_ID,
      'serviceGroups'
    );

    console.log(`📊 Found ${response.documents.length} service groups\n`);

    for (const serviceGroup of response.documents) {
      console.log(`Processing: ${serviceGroup.name}`);

      const metaToCreate = [];

      // Migrate seoTitle
      if (serviceGroup.seoTitle) {
        metaToCreate.push({
          entityId: serviceGroup.$id,
          metaKey: 'seo_title',
          metaValue: serviceGroup.seoTitle
        });
        console.log(`  ✓ seoTitle: "${serviceGroup.seoTitle}"`);
      }

      // Migrate seoKeywords
      if (serviceGroup.seoKeywords) {
        metaToCreate.push({
          entityId: serviceGroup.$id,
          metaKey: 'seo_keywords',
          metaValue: serviceGroup.seoKeywords
        });
        console.log(`  ✓ seoKeywords: "${serviceGroup.seoKeywords}"`);
      }

      // Migrate metaDescription
      if (serviceGroup.metaDescription) {
        metaToCreate.push({
          entityId: serviceGroup.$id,
          metaKey: 'meta_description',
          metaValue: serviceGroup.metaDescription
        });
        console.log(`  ✓ metaDescription: "${serviceGroup.metaDescription.substring(0, 50)}..."`);
      }

      // Create meta entries
      for (const meta of metaToCreate) {
        try {
          await databases.createDocument(
            DATABASE_ID,
            'serviceGroupsMeta',
            'unique()',
            meta
          );
        } catch (error) {
          if (error.code === 409) {
            console.log(`  ⚠️  Meta already exists for key: ${meta.metaKey}`);
          } else {
            throw error;
          }
        }
      }

      console.log('');
    }

    console.log('✅ Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Verify the migrated data in Appwrite Console');
    console.log('2. Update your forms to use meta helper functions');
    console.log('3. After testing, you can remove SEO columns from serviceGroups');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

migrateSeoToMeta().catch(console.error);
