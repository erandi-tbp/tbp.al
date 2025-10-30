import { getMeta, setMeta, deleteMeta } from './metaHelper';

/**
 * Relationship Helper - Manage entity relationships using meta tables
 *
 * Relationships are stored as meta values:
 * - service_group_id: Links Service to ServiceGroup (many-to-one)
 * - project_id: Links CaseStudy to Project (many-to-one)
 * - testimonial_entity_type: Type of entity testimonial is linked to
 * - testimonial_entity_id: ID of entity testimonial is linked to
 *
 * Examples:
 * - Service -> ServiceGroup: setRelationship('servicesMeta', serviceId, 'service_group_id', groupId)
 * - CaseStudy -> Project: setRelationship('caseStudiesMeta', caseStudyId, 'project_id', projectId)
 * - Testimonial -> Service: setTestimonialRelationship('testimonialsMeta', testimonialId, 'service', serviceId)
 */

/**
 * Set a relationship between entities
 * @param {string} metaCollection - Meta collection name
 * @param {string} entityId - The entity ID
 * @param {string} relationKey - The relationship key (e.g., 'service_group_id')
 * @param {string} relatedEntityId - The related entity ID
 * @returns {Promise<Object>} The meta document
 */
export async function setRelationship(metaCollection, entityId, relationKey, relatedEntityId) {
  return await setMeta(metaCollection, entityId, relationKey, relatedEntityId);
}

/**
 * Get a relationship
 * @param {string} metaCollection - Meta collection name
 * @param {string} entityId - The entity ID
 * @param {string} relationKey - The relationship key
 * @returns {Promise<string|null>} The related entity ID or null
 */
export async function getRelationship(metaCollection, entityId, relationKey) {
  return await getMeta(metaCollection, entityId, relationKey, null);
}

/**
 * Remove a relationship
 * @param {string} metaCollection - Meta collection name
 * @param {string} entityId - The entity ID
 * @param {string} relationKey - The relationship key
 * @returns {Promise<boolean>} Success status
 */
export async function removeRelationship(metaCollection, entityId, relationKey) {
  return await deleteMeta(metaCollection, entityId, relationKey);
}

/**
 * Set testimonial relationship (special case - can link to multiple entity types)
 * @param {string} metaCollection - Should be 'testimonialsMeta'
 * @param {string} testimonialId - The testimonial ID
 * @param {string} entityType - Type of entity ('service_group', 'service', 'project', 'case_study')
 * @param {string} entityId - The entity ID
 * @returns {Promise<void>}
 */
export async function setTestimonialRelationship(metaCollection, testimonialId, entityType, entityId) {
  await setMeta(metaCollection, testimonialId, 'testimonial_entity_type', entityType);
  await setMeta(metaCollection, testimonialId, 'testimonial_entity_id', entityId);
}

/**
 * Get testimonial relationship
 * @param {string} metaCollection - Should be 'testimonialsMeta'
 * @param {string} testimonialId - The testimonial ID
 * @returns {Promise<Object>} Object with entityType and entityId
 */
export async function getTestimonialRelationship(metaCollection, testimonialId) {
  const entityType = await getMeta(metaCollection, testimonialId, 'testimonial_entity_type', null);
  const entityId = await getMeta(metaCollection, testimonialId, 'testimonial_entity_id', null);

  return {
    entityType,
    entityId
  };
}

/**
 * Remove testimonial relationship
 * @param {string} metaCollection - Should be 'testimonialsMeta'
 * @param {string} testimonialId - The testimonial ID
 * @returns {Promise<void>}
 */
export async function removeTestimonialRelationship(metaCollection, testimonialId) {
  await deleteMeta(metaCollection, testimonialId, 'testimonial_entity_type');
  await deleteMeta(metaCollection, testimonialId, 'testimonial_entity_id');
}

// Relationship key constants
export const RELATIONSHIP_KEYS = {
  SERVICE_GROUP: 'service_group_id',
  PROJECT: 'project_id',
  TESTIMONIAL_TYPE: 'testimonial_entity_type',
  TESTIMONIAL_ID: 'testimonial_entity_id'
};

// Entity types for testimonials
export const TESTIMONIAL_ENTITY_TYPES = {
  SERVICE_GROUP: 'service_group',
  SERVICE: 'service',
  PROJECT: 'project',
  CASE_STUDY: 'case_study'
};
