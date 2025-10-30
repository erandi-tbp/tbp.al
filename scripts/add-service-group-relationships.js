/**
 * Migration Script: Add Service Group Relationships to Projects and Case Studies
 *
 * This script adds a serviceGroupId attribute to both projects and caseStudies collections
 * to enable categorization and filtering by service groups.
 */

import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;

async function addServiceGroupRelationships() {
  console.log('Starting migration: Add Service Group Relationships...\n');

  try {
    // Add serviceGroupId to projects collection
    console.log('Adding serviceGroupId to projects collection...');
    try {
      await databases.createStringAttribute(
        databaseId,
        'projects',
        'serviceGroupId',
        255,
        false // not required
      );
      console.log('✓ Added serviceGroupId to projects');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠ serviceGroupId already exists in projects');
      } else {
        throw error;
      }
    }

    // Add serviceGroupId to caseStudies collection
    console.log('Adding serviceGroupId to caseStudies collection...');
    try {
      await databases.createStringAttribute(
        databaseId,
        'caseStudies',
        'serviceGroupId',
        255,
        false // not required
      );
      console.log('✓ Added serviceGroupId to caseStudies');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠ serviceGroupId already exists in caseStudies');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update ProjectForm and CaseStudyForm to include service group selection');
    console.log('2. Update Add/Edit pages to save/load the serviceGroupId relationship');
    console.log('3. Create Loop Grid and Loop Carousel blocks for displaying related content');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

addServiceGroupRelationships();
