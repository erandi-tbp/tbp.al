import { getMeta, setMeta } from './metaHelper';

/**
 * Excerpt Helper - Manages excerpt and meta_description sync
 *
 * Logic:
 * 1. Excerpt is stored in the main entity table
 * 2. meta_description is stored in the meta table
 * 3. If meta_description is not set, use excerpt
 * 4. Users can override meta_description independently
 */

/**
 * Check if meta_description has been manually overridden
 * @param {string} metaCollection - Meta collection name
 * @param {string} entityId - Entity ID
 * @param {string} excerpt - Current excerpt value
 * @returns {boolean} True if manually overridden
 */
export async function isMetaDescriptionOverridden(metaCollection, entityId, excerpt) {
  const metaDescription = await getMeta(metaCollection, entityId, 'meta_description', null);

  // If no meta_description exists, it's not overridden
  if (!metaDescription) return false;

  // If meta_description differs from excerpt, it's been overridden
  return metaDescription !== excerpt;
}

/**
 * Sync excerpt to meta_description (only if not overridden)
 * @param {string} metaCollection - Meta collection name
 * @param {string} entityId - Entity ID
 * @param {string} excerpt - Excerpt value
 * @param {boolean} force - Force sync even if overridden
 * @returns {Promise<void>}
 */
export async function syncExcerptToMeta(metaCollection, entityId, excerpt, force = false) {
  if (!excerpt) return;

  // Check if it's been manually overridden
  if (!force) {
    const isOverridden = await isMetaDescriptionOverridden(metaCollection, entityId, excerpt);
    if (isOverridden) {
      // Don't sync if user has manually set a different meta_description
      return;
    }
  }

  // Sync excerpt to meta_description
  await setMeta(metaCollection, entityId, 'meta_description', excerpt);
}

/**
 * Get effective meta description (from meta or excerpt fallback)
 * @param {string} metaCollection - Meta collection name
 * @param {string} entityId - Entity ID
 * @param {string} excerpt - Excerpt as fallback
 * @returns {Promise<string>} The meta description to use
 */
export async function getEffectiveMetaDescription(metaCollection, entityId, excerpt) {
  const metaDescription = await getMeta(metaCollection, entityId, 'meta_description', null);

  // Use meta_description if set, otherwise fallback to excerpt
  return metaDescription || excerpt || '';
}

/**
 * Save entity with smart excerpt/meta sync
 * @param {Object} options
 * @param {string} options.metaCollection - Meta collection name
 * @param {string} options.entityId - Entity ID
 * @param {string} options.excerpt - Excerpt value
 * @param {string} options.metaDescription - Meta description value (if manually set)
 * @param {boolean} options.metaDescriptionChanged - Whether meta_description was changed by user
 * @returns {Promise<void>}
 */
export async function saveWithExcerptSync({
  metaCollection,
  entityId,
  excerpt,
  metaDescription,
  metaDescriptionChanged = false
}) {
  // If user explicitly changed meta_description, save it
  if (metaDescriptionChanged && metaDescription !== null && metaDescription !== undefined) {
    await setMeta(metaCollection, entityId, 'meta_description', metaDescription);
  } else {
    // Auto-sync excerpt to meta_description
    await syncExcerptToMeta(metaCollection, entityId, excerpt);
  }
}

/**
 * Helper to determine if meta_description field should show as "synced"
 * This is useful for UI to show when meta_description is auto-populated
 * @param {string} metaCollection - Meta collection name
 * @param {string} entityId - Entity ID
 * @param {string} excerpt - Current excerpt
 * @returns {Promise<boolean>} True if synced from excerpt
 */
export async function isMetaSyncedFromExcerpt(metaCollection, entityId, excerpt) {
  if (!excerpt) return false;

  const metaDescription = await getMeta(metaCollection, entityId, 'meta_description', null);

  // If no meta_description, it will be synced
  if (!metaDescription) return true;

  // If meta_description equals excerpt, it's synced
  return metaDescription === excerpt;
}

/**
 * Clear meta_description override (revert to excerpt sync)
 * @param {string} metaCollection - Meta collection name
 * @param {string} entityId - Entity ID
 * @param {string} excerpt - Current excerpt to sync
 * @returns {Promise<void>}
 */
export async function revertToExcerptSync(metaCollection, entityId, excerpt) {
  await syncExcerptToMeta(metaCollection, entityId, excerpt, true);
}
