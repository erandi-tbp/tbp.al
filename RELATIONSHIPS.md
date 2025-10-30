# Entity Relationships via Meta Tables

All entity relationships are stored in meta tables for maximum flexibility.

## Relationship Structure

### Services → Service Groups (Many-to-One)
**Meta Collection**: `servicesMeta`
**Meta Key**: `service_group_id`
**Meta Value**: ID of the service group

```javascript
// Set relationship
await setRelationship('servicesMeta', serviceId, 'service_group_id', serviceGroupId);

// Get relationship
const serviceGroupId = await getRelationship('servicesMeta', serviceId, 'service_group_id');
```

### Case Studies → Projects (Many-to-One)
**Meta Collection**: `caseStudiesMeta`
**Meta Key**: `project_id`
**Meta Value**: ID of the project

```javascript
// Set relationship
await setRelationship('caseStudiesMeta', caseStudyId, 'project_id', projectId);

// Get relationship
const projectId = await getRelationship('caseStudiesMeta', caseStudyId, 'project_id');
```

### Testimonials → Any Entity (Many-to-One Polymorphic)
**Meta Collection**: `testimonialsMeta`
**Meta Keys**:
- `testimonial_entity_type` (values: 'service_group', 'service', 'project', 'case_study')
- `testimonial_entity_id` (ID of the related entity)

```javascript
// Set testimonial relationship to a service
await setTestimonialRelationship('testimonialsMeta', testimonialId, 'service', serviceId);

// Get testimonial relationship
const { entityType, entityId } = await getTestimonialRelationship('testimonialsMeta', testimonialId);
```

## SEO Fields (All Entities)

All SEO fields are stored in respective meta tables:

**Meta Keys**:
- `seo_title` - Page title for SEO
- `seo_keywords` - Comma-separated keywords
- `meta_description` - Meta description (auto-syncs from excerpt if not overridden)

## Core Entity Fields

### Service Groups
- name, slug, description, excerpt
- featuredImage, featuredIcon
- order, isActive

### Services
- name, slug, description, excerpt
- features (JSON array)
- order, isActive
- **Relationship**: service_group_id (in meta)

### Projects
- title, slug, description, excerpt
- clientName
- featuredImage, gallery (JSON array)
- completedDate
- order, isPublished
- **Note**: serviceGroupIds removed - use tags in meta instead

### Case Studies
- title, slug, description, excerpt
- templateData (JSON)
- featuredImage
- publishDate, isPublished
- **Relationship**: project_id (in meta)

### Testimonials
- clientName, clientRole, clientCompany
- testimonial, rating
- avatar, excerpt
- isApproved, createdAt
- **Relationship**: testimonial_entity_type + testimonial_entity_id (in meta)

### Pages
- title, slug, content
- template
- isPublished, order

## Benefits of Meta-Based Relationships

1. **Flexibility**: Add new relationship types without schema changes
2. **Unlimited Relationships**: Can add multiple relationship types per entity
3. **Easy Querying**: Use metaHelper functions to manage relationships
4. **No Migration Needed**: Add/remove relationships without altering collections
5. **Consistency**: Same pattern across all entities
