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

// Helper to wait for attributes to be available
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');
  console.log('📦 Using existing database: tbp-agency\n');

  try {

    // Create Service Groups Collection
    console.log('📝 Creating Service Groups collection...');
    const serviceGroups = await databases.createCollection(
      DATABASE_ID,
      'serviceGroups',
      'Service Groups',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );

    await databases.createStringAttribute(DATABASE_ID, 'serviceGroups', 'name', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'serviceGroups', 'slug', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'serviceGroups', 'description', 1000, false);
    await databases.createIntegerAttribute(DATABASE_ID, 'serviceGroups', 'order', false, 0);
    await databases.createBooleanAttribute(DATABASE_ID, 'serviceGroups', 'isActive', false, true);

    await wait(2000); // Wait for attributes to be available
    await databases.createIndex(DATABASE_ID, 'serviceGroups', 'slug_unique', 'unique', ['slug']);
    console.log('✅ Service Groups collection created\n');

    // Create Services Collection
    console.log('📝 Creating Services collection...');
    await databases.createCollection(
      DATABASE_ID,
      'services',
      'Services',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );

    await databases.createStringAttribute(DATABASE_ID, 'services', 'name', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'services', 'slug', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'services', 'description', 2000, false);
    await databases.createStringAttribute(DATABASE_ID, 'services', 'serviceGroupId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'services', 'features', 10000, false);
    await databases.createIntegerAttribute(DATABASE_ID, 'services', 'order', false, 0);
    await databases.createBooleanAttribute(DATABASE_ID, 'services', 'isActive', false, true);

    await wait(2000); // Wait for attributes to be available
    await databases.createIndex(DATABASE_ID, 'services', 'slug_unique', 'unique', ['slug']);
    await databases.createIndex(DATABASE_ID, 'services', 'serviceGroupId_idx', 'key', ['serviceGroupId']);
    console.log('✅ Services collection created\n');

    // Create Projects Collection
    console.log('📝 Creating Projects collection...');
    await databases.createCollection(
      DATABASE_ID,
      'projects',
      'Projects',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );

    await databases.createStringAttribute(DATABASE_ID, 'projects', 'title', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'projects', 'slug', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'projects', 'description', 2000, false);
    await databases.createStringAttribute(DATABASE_ID, 'projects', 'clientName', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'projects', 'serviceGroupIds', 1000, true);
    await databases.createStringAttribute(DATABASE_ID, 'projects', 'featuredImage', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'projects', 'gallery', 5000, false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'projects', 'completedDate', false);
    await databases.createBooleanAttribute(DATABASE_ID, 'projects', 'isPublished', false, false);
    await databases.createIntegerAttribute(DATABASE_ID, 'projects', 'order', false, 0);

    await wait(2000); // Wait for attributes to be available
    await databases.createIndex(DATABASE_ID, 'projects', 'slug_unique', 'unique', ['slug']);
    console.log('✅ Projects collection created\n');

    // Create Case Studies Collection
    console.log('📝 Creating Case Studies collection...');
    await databases.createCollection(
      DATABASE_ID,
      'caseStudies',
      'Case Studies',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );

    await databases.createStringAttribute(DATABASE_ID, 'caseStudies', 'title', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'caseStudies', 'slug', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'caseStudies', 'description', 2000, false);
    await databases.createStringAttribute(DATABASE_ID, 'caseStudies', 'projectId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'caseStudies', 'serviceGroupId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'caseStudies', 'templateData', 65535, false);
    await databases.createStringAttribute(DATABASE_ID, 'caseStudies', 'featuredImage', 255, false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'caseStudies', 'publishDate', false);
    await databases.createBooleanAttribute(DATABASE_ID, 'caseStudies', 'isPublished', false, false);

    await wait(2000); // Wait for attributes to be available
    await databases.createIndex(DATABASE_ID, 'caseStudies', 'slug_unique', 'unique', ['slug']);
    await databases.createIndex(DATABASE_ID, 'caseStudies', 'projectId_idx', 'key', ['projectId']);
    await databases.createIndex(DATABASE_ID, 'caseStudies', 'serviceGroupId_idx', 'key', ['serviceGroupId']);
    console.log('✅ Case Studies collection created\n');

    // Create Testimonials Collection
    console.log('📝 Creating Testimonials collection...');
    await databases.createCollection(
      DATABASE_ID,
      'testimonials',
      'Testimonials',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );

    await databases.createStringAttribute(DATABASE_ID, 'testimonials', 'clientName', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'testimonials', 'clientRole', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'testimonials', 'clientCompany', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'testimonials', 'testimonial', 5000, true);
    await databases.createIntegerAttribute(DATABASE_ID, 'testimonials', 'rating', true);
    await databases.createStringAttribute(DATABASE_ID, 'testimonials', 'avatar', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'testimonials', 'relatedType', 50, false);
    await databases.createStringAttribute(DATABASE_ID, 'testimonials', 'relatedId', 255, false);
    await databases.createBooleanAttribute(DATABASE_ID, 'testimonials', 'isApproved', false, false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'testimonials', 'createdAt', false);

    await wait(2000); // Wait for attributes to be available
    await databases.createIndex(DATABASE_ID, 'testimonials', 'relatedId_idx', 'key', ['relatedId']);
    console.log('✅ Testimonials collection created\n');

    // Create SEO Metadata Collection
    console.log('📝 Creating SEO Metadata collection...');
    await databases.createCollection(
      DATABASE_ID,
      'seoMetadata',
      'SEO Metadata',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );

    await databases.createStringAttribute(DATABASE_ID, 'seoMetadata', 'entityType', 50, true);
    await databases.createStringAttribute(DATABASE_ID, 'seoMetadata', 'entityId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'seoMetadata', 'metaTitle', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'seoMetadata', 'metaDescription', 500, false);
    await databases.createStringAttribute(DATABASE_ID, 'seoMetadata', 'metaKeywords', 1000, false);
    await databases.createStringAttribute(DATABASE_ID, 'seoMetadata', 'ogTitle', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'seoMetadata', 'ogDescription', 500, false);
    await databases.createStringAttribute(DATABASE_ID, 'seoMetadata', 'ogImage', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'seoMetadata', 'twitterCard', 50, false);
    await databases.createStringAttribute(DATABASE_ID, 'seoMetadata', 'canonicalUrl', 500, false);
    await databases.createBooleanAttribute(DATABASE_ID, 'seoMetadata', 'noIndex', false, false);
    await databases.createBooleanAttribute(DATABASE_ID, 'seoMetadata', 'noFollow', false, false);

    await wait(2000); // Wait for attributes to be available
    await databases.createIndex(DATABASE_ID, 'seoMetadata', 'entityId_idx', 'key', ['entityId']);
    await databases.createIndex(DATABASE_ID, 'seoMetadata', 'entity_composite_idx', 'key', ['entityType', 'entityId']);
    console.log('✅ SEO Metadata collection created\n');

    // Create Pages Collection
    console.log('📝 Creating Pages collection...');
    await databases.createCollection(
      DATABASE_ID,
      'pages',
      'Pages',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );

    await databases.createStringAttribute(DATABASE_ID, 'pages', 'title', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'pages', 'slug', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'pages', 'content', 65535, false);
    await databases.createStringAttribute(DATABASE_ID, 'pages', 'template', 50, false);
    await databases.createBooleanAttribute(DATABASE_ID, 'pages', 'isPublished', false, false);
    await databases.createIntegerAttribute(DATABASE_ID, 'pages', 'order', false, 0);

    await wait(2000); // Wait for attributes to be available
    await databases.createIndex(DATABASE_ID, 'pages', 'slug_unique', 'unique', ['slug']);
    console.log('✅ Pages collection created\n');

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Database: tbp-agency');
    console.log('   - Collections: 7');
    console.log('   - Service Groups');
    console.log('   - Services');
    console.log('   - Projects');
    console.log('   - Case Studies');
    console.log('   - Testimonials');
    console.log('   - SEO Metadata');
    console.log('   - Pages');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

setupDatabase();
