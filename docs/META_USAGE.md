# Meta Tables Usage Guide

## Overview

Each entity has its own metadata table for maximum flexibility:
- `serviceGroupsMeta` - Metadata for service groups
- `servicesMeta` - Metadata for services
- `projectsMeta` - Metadata for projects
- `caseStudiesMeta` - Metadata for case studies
- `testimonialsMeta` - Metadata for testimonials

## Structure

Each meta table has:
- `entityId` - Links to the parent entity (indexed)
- `metaKey` - The metadata key name (indexed)
- `metaValue` - The metadata value (supports text and JSON)
- **Unique constraint**: `entityId + metaKey` (no duplicate keys per entity)

## Common Use Cases

### 1. SEO Metadata
```javascript
import { setMeta, getMeta, META_COLLECTIONS } from '@/lib/metaHelper';

// Set SEO metadata for a service group
await setMeta(META_COLLECTIONS.SERVICE_GROUPS, serviceGroupId, 'seo_title', 'My SEO Title');
await setMeta(META_COLLECTIONS.SERVICE_GROUPS, serviceGroupId, 'meta_description', 'Description here');
await setMeta(META_COLLECTIONS.SERVICE_GROUPS, serviceGroupId, 'seo_keywords', 'keyword1, keyword2');

// Get SEO title
const seoTitle = await getMeta(META_COLLECTIONS.SERVICE_GROUPS, serviceGroupId, 'seo_title');
```

### 2. Custom Fields
```javascript
// Add custom fields dynamically
await setMeta(META_COLLECTIONS.PROJECTS, projectId, 'client_name', 'Acme Corp');
await setMeta(META_COLLECTIONS.PROJECTS, projectId, 'project_duration', '6 months');
await setMeta(META_COLLECTIONS.PROJECTS, projectId, 'budget', '50000');
```

### 3. Complex Data (JSON)
```javascript
// Store arrays or objects
const technologies = ['React', 'Node.js', 'MongoDB'];
await setMeta(META_COLLECTIONS.PROJECTS, projectId, 'technologies', technologies);

const pricing = { basic: 99, pro: 199, enterprise: 499 };
await setMeta(META_COLLECTIONS.SERVICES, serviceId, 'pricing_tiers', pricing);

// Retrieve and use
const techs = await getMeta(META_COLLECTIONS.PROJECTS, projectId, 'technologies');
// Returns: ['React', 'Node.js', 'MongoDB']
```

### 4. Settings & Configuration
```javascript
// Store entity-specific settings
await setMeta(META_COLLECTIONS.SERVICES, serviceId, 'is_featured', true);
await setMeta(META_COLLECTIONS.SERVICES, serviceId, 'display_order', 1);
await setMeta(META_COLLECTIONS.SERVICES, serviceId, 'color_scheme', '#ff6600');
```

## API Reference

### `getAllMeta(collectionName, entityId)`
Get all metadata for an entity as an object.

```javascript
const allMeta = await getAllMeta(META_COLLECTIONS.SERVICE_GROUPS, serviceGroupId);
// Returns: { seo_title: '...', meta_description: '...', custom_field: '...' }
```

### `getMeta(collectionName, entityId, metaKey, defaultValue)`
Get a specific meta value.

```javascript
const title = await getMeta(META_COLLECTIONS.PROJECTS, projectId, 'seo_title', 'Default Title');
```

### `setMeta(collectionName, entityId, metaKey, metaValue)`
Set or update a meta value. Automatically creates if doesn't exist, updates if it does.

```javascript
await setMeta(META_COLLECTIONS.SERVICES, serviceId, 'featured', true);
```

### `setMultipleMeta(collectionName, entityId, metaObject)`
Set multiple meta values at once.

```javascript
await setMultipleMeta(META_COLLECTIONS.CASE_STUDIES, caseStudyId, {
  seo_title: 'My Case Study',
  meta_description: 'Study description',
  featured: true,
  category: 'Web Development'
});
```

### `deleteMeta(collectionName, entityId, metaKey)`
Delete a specific meta value.

```javascript
await deleteMeta(META_COLLECTIONS.TESTIMONIALS, testimonialId, 'featured');
```

### `deleteAllMeta(collectionName, entityId)`
Delete all metadata for an entity (useful when deleting the entity).

```javascript
await deleteAllMeta(META_COLLECTIONS.PROJECTS, projectId);
```

### `findEntitiesByMeta(collectionName, metaKey, metaValue)`
Find all entities with a specific meta value.

```javascript
// Find all featured services
const featuredIds = await findEntitiesByMeta(META_COLLECTIONS.SERVICES, 'featured', true);
// Returns: ['id1', 'id2', 'id3']
```

## Recommended Meta Keys

### SEO
- `seo_title` - SEO title
- `meta_description` - Meta description
- `seo_keywords` - SEO keywords
- `og_image` - Open Graph image
- `og_title` - Open Graph title
- `og_description` - Open Graph description
- `twitter_card` - Twitter card type

### Display
- `featured` - Is featured (boolean)
- `display_order` - Sort order (number)
- `status` - Custom status
- `color` - Color theme
- `icon` - Icon identifier

### Custom Fields
- `custom_*` - Any custom field prefixed with "custom_"
- Use snake_case for consistency

## Example: Service Group Form with Meta

```javascript
import { setMultipleMeta, getAllMeta, META_COLLECTIONS } from '@/lib/metaHelper';

// When saving a service group
async function saveServiceGroup(serviceGroupId, formData) {
  // Save core entity data
  await databases.updateDocument(DATABASE_ID, 'serviceGroups', serviceGroupId, {
    name: formData.name,
    slug: formData.slug,
    description: formData.description
  });

  // Save all metadata
  await setMultipleMeta(META_COLLECTIONS.SERVICE_GROUPS, serviceGroupId, {
    seo_title: formData.seoTitle,
    meta_description: formData.metaDescription,
    seo_keywords: formData.seoKeywords,
    featured: formData.featured,
    custom_field: formData.customValue
  });
}

// When loading a service group
async function loadServiceGroup(serviceGroupId) {
  // Load core entity
  const serviceGroup = await databases.getDocument(DATABASE_ID, 'serviceGroups', serviceGroupId);

  // Load all metadata
  const meta = await getAllMeta(META_COLLECTIONS.SERVICE_GROUPS, serviceGroupId);

  return {
    ...serviceGroup,
    ...meta  // Merge metadata into entity
  };
}
```

## Best Practices

1. **Use consistent naming**: `snake_case` for meta keys
2. **Prefix custom fields**: `custom_`, `settings_`, `seo_`, etc.
3. **Store complex data as JSON**: Arrays and objects are automatically handled
4. **Clean up meta on delete**: Use `deleteAllMeta()` when deleting entities
5. **Use indexes**: Meta keys are indexed for fast queries
6. **Batch operations**: Use `setMultipleMeta()` for multiple values
7. **Default values**: Always provide defaults with `getMeta()`

## Performance Tips

- Meta keys are indexed - queries by key are fast
- `entityId + metaKey` is uniquely indexed - updates are fast
- Use `getAllMeta()` once instead of multiple `getMeta()` calls
- Cache meta data client-side when possible
- Limit meta values to 10KB for best performance

## Migration Notes

SEO fields have been migrated from entity tables to meta tables:
- `seoTitle` → `seo_title`
- `metaDescription` → `meta_description`
- `seoKeywords` → `seo_keywords`

Old columns can be removed after testing.
