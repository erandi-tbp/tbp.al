# Database Collections Setup Guide

Since collection creation requires server-side API keys, you need to create collections manually through the Appwrite Console.

## Quick Setup via Console

Go to: https://cloud.appwrite.io/console/project-6903529600346ac783d8/databases/database-tbp-agency

### Create These 7 Collections:

---

## 1. Service Groups
**Collection ID:** `serviceGroups`

**Attributes:**
- `name` - String (255) - Required
- `slug` - String (255) - Required
- `description` - String (1000) - Optional
- `order` - Integer - Required - Default: 0
- `isActive` - Boolean - Required - Default: true

**Indexes:**
- `slug` - Unique - Attributes: [slug]

**Permissions:**
- Read: Any
- Create/Update/Delete: Users

---

## 2. Services
**Collection ID:** `services`

**Attributes:**
- `name` - String (255) - Required
- `slug` - String (255) - Required
- `description` - String (2000) - Optional
- `serviceGroupId` - String (255) - Required
- `features` - String (10000) - Optional (JSON array of features)
- `order` - Integer - Required - Default: 0
- `isActive` - Boolean - Required - Default: true

**Indexes:**
- `slug` - Unique - Attributes: [slug]
- `serviceGroupId` - Key - Attributes: [serviceGroupId]

**Permissions:**
- Read: Any
- Create/Update/Delete: Users

---

## 3. Projects
**Collection ID:** `projects`

**Attributes:**
- `title` - String (255) - Required
- `slug` - String (255) - Required
- `description` - String (2000) - Optional
- `clientName` - String (255) - Optional
- `serviceGroupIds` - String (1000) - Required (JSON array)
- `featuredImage` - String (255) - Optional (File ID)
- `gallery` - String (5000) - Optional (JSON array of file IDs)
- `completedDate` - DateTime - Optional
- `isPublished` - Boolean - Required - Default: false
- `order` - Integer - Required - Default: 0

**Indexes:**
- `slug` - Unique - Attributes: [slug]

**Permissions:**
- Read: Any
- Create/Update/Delete: Users

---

## 4. Case Studies
**Collection ID:** `caseStudies`

**Attributes:**
- `title` - String (255) - Required
- `slug` - String (255) - Required
- `description` - String (2000) - Optional
- `projectId` - String (255) - Required
- `serviceGroupId` - String (255) - Required
- `templateData` - String (65535) - Optional (JSON with service-specific fields)
- `featuredImage` - String (255) - Optional
- `publishDate` - DateTime - Optional
- `isPublished` - Boolean - Required - Default: false

**Indexes:**
- `slug` - Unique - Attributes: [slug]
- `projectId` - Key - Attributes: [projectId]
- `serviceGroupId` - Key - Attributes: [serviceGroupId]

**Permissions:**
- Read: Any
- Create/Update/Delete: Users

---

## 5. Testimonials
**Collection ID:** `testimonials`

**Attributes:**
- `clientName` - String (255) - Required
- `clientRole` - String (255) - Optional
- `clientCompany` - String (255) - Optional
- `testimonial` - String (5000) - Required
- `rating` - Integer - Required (1-5)
- `avatar` - String (255) - Optional (File ID)
- `relatedType` - String (50) - Optional (service/project/case-study/general)
- `relatedId` - String (255) - Optional
- `isApproved` - Boolean - Required - Default: false
- `createdAt` - DateTime - Required

**Indexes:**
- `relatedId` - Key - Attributes: [relatedId]

**Permissions:**
- Read: Any
- Create/Update/Delete: Users

---

## 6. SEO Metadata
**Collection ID:** `seoMetadata`

**Attributes:**
- `entityType` - String (50) - Required (page/service/project/case-study)
- `entityId` - String (255) - Required
- `metaTitle` - String (255) - Optional
- `metaDescription` - String (500) - Optional
- `metaKeywords` - String (1000) - Optional
- `ogTitle` - String (255) - Optional
- `ogDescription` - String (500) - Optional
- `ogImage` - String (255) - Optional (File ID)
- `twitterCard` - String (50) - Optional (summary/summary_large_image)
- `canonicalUrl` - String (500) - Optional
- `noIndex` - Boolean - Required - Default: false
- `noFollow` - Boolean - Required - Default: false

**Indexes:**
- `entityId` - Key - Attributes: [entityId]
- `entity_composite` - Key - Attributes: [entityType, entityId]

**Permissions:**
- Read: Any
- Create/Update/Delete: Users

---

## 7. Pages
**Collection ID:** `pages`

**Attributes:**
- `title` - String (255) - Required
- `slug` - String (255) - Required
- `content` - String (65535) - Optional (JSON page builder data)
- `template` - String (50) - Optional (home/about/contact/custom)
- `isPublished` - Boolean - Required - Default: false
- `order` - Integer - Required - Default: 0

**Indexes:**
- `slug` - Unique - Attributes: [slug]

**Permissions:**
- Read: Any
- Create/Update/Delete: Users

---

## After Creating Collections

Run this command to verify:
```bash
npm run dev
```

The admin panel will be able to manage all content once authentication is set up.
