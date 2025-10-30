import { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TagInput } from '../common/TagInput';
import { MediaPicker } from '../common/MediaPicker';
import { ContentBlocksEditor } from './blocks/ContentBlocksEditor';

export const ServiceGroupForm = ({ initialData, onSubmit, submitLabel = 'Save' }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    description: initialData?.description || '',
    featuredImage: initialData?.featuredImage || '',
    featuredIcon: initialData?.featuredIcon || '',
    seoTitle: initialData?.seoTitle || '',
    seoKeywords: initialData?.seoKeywords ? initialData.seoKeywords.split(',').map(k => k.trim()) : [],
    metaDescription: initialData?.metaDescription || '',
    contentBlocks: initialData?.contentBlocks || []
  });

  const [metaDescriptionOverridden, setMetaDescriptionOverridden] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(null); // 'featuredImage' | 'featuredIcon' | null

  const [previews, setPreviews] = useState({
    featuredImage: initialData?.featuredImage ? getFileUrl(initialData.featuredImage) : null,
    featuredIcon: initialData?.featuredIcon ? getFileUrl(initialData.featuredIcon) : null
  });

  function getFileUrl(fileId) {
    if (!fileId) return null;
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';
    return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
  }

  // Generate slug from name
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updates = { [name]: value };

    // Auto-generate slug when name changes (only for new entries)
    if (name === 'name' && !initialData) {
      updates.slug = generateSlug(value);
    }

    // Sync excerpt to metaDescription if not overridden
    if (name === 'excerpt' && !metaDescriptionOverridden) {
      updates.metaDescription = value;
    }

    // Mark metaDescription as overridden if user manually changes it
    if (name === 'metaDescription') {
      setMetaDescriptionOverridden(true);
    }

    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleMediaSelect = (fileId, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fileId
    }));

    setPreviews(prev => ({
      ...prev,
      [fieldName]: getFileUrl(fileId)
    }));
  };

  const handleRemoveFile = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    setPreviews(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert tags array back to comma-separated string for storage
    const dataToSubmit = {
      ...formData,
      seoKeywords: formData.seoKeywords.join(', ')
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
              Basic Information
            </h2>

            <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent"
              placeholder="e.g., Web Design & Development"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent font-mono"
              placeholder="e.g., web-design-and-development"
            />
            <p className="mt-1 text-xs text-text-secondary font-body">
              Auto-generated from name. Used in URLs (lowercase, hyphens only)
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-2">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent resize-none"
              placeholder="Brief summary (auto-syncs to SEO meta description)"
            />
            <p className="mt-1 text-xs text-text-secondary font-body">
              {formData.excerpt.length}/500 characters • Auto-syncs to meta description
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent resize-none"
              placeholder="Brief description of this service group..."
            />
          </div>
        </div>
          </div>

          {/* Featured Media */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
              Featured Media
            </h2>

            <div className="space-y-6">
          {/* Featured Image */}
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-2">
              Featured Image
            </label>

            {previews.featuredImage ? (
              <div className="relative">
                <img
                  src={previews.featuredImage}
                  alt="Featured"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile('featuredImage')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMediaPickerOpen('featuredImage')}
                className="flex flex-col items-center justify-center w-full h-48 border border-border border-dashed rounded-lg bg-bg-primary hover:bg-bg-secondary hover:border-accent transition-colors"
              >
                <PhotoIcon className="w-10 h-10 text-text-secondary mb-2" />
                <p className="text-sm text-text-secondary font-body font-medium mb-1">
                  Select from Media Library
                </p>
                <p className="text-xs text-text-secondary font-body">
                  or upload a new image
                </p>
              </button>
            )}
          </div>

          {/* Featured Icon */}
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-2">
              Featured Icon
            </label>

            {previews.featuredIcon ? (
              <div className="relative">
                <img
                  src={previews.featuredIcon}
                  alt="Icon"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile('featuredIcon')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMediaPickerOpen('featuredIcon')}
                className="flex flex-col items-center justify-center w-full h-48 border border-border border-dashed rounded-lg bg-bg-primary hover:bg-bg-secondary hover:border-accent transition-colors"
              >
                <PhotoIcon className="w-10 h-10 text-text-secondary mb-2" />
                <p className="text-sm text-text-secondary font-body font-medium mb-1">
                  Select from Media Library
                </p>
                <p className="text-xs text-text-secondary font-body">
                  or upload a new image
                </p>
              </button>
            )}
          </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* SEO Settings */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
        <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
          SEO Settings
        </h2>

        <div className="space-y-4">
          {/* SEO Title */}
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-2">
              SEO Title
            </label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleInputChange}
              maxLength={60}
              className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent"
              placeholder="Optimized title for search engines"
            />
            <p className="mt-1 text-xs text-text-secondary font-body">
              {formData.seoTitle.length}/60 characters
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-body font-medium text-text-primary">
                Meta Description (SEO)
              </label>
              {!metaDescriptionOverridden && formData.excerpt && (
                <span className="text-xs text-accent font-body">
                  ✓ Auto-synced from excerpt
                </span>
              )}
            </div>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              maxLength={160}
              rows={3}
              className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent resize-none"
              placeholder="Appears in search results (auto-filled from excerpt)"
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-text-secondary font-body">
                {formData.metaDescription.length}/160 characters
              </p>
              {metaDescriptionOverridden && (
                <button
                  type="button"
                  onClick={() => {
                    setMetaDescriptionOverridden(false);
                    setFormData(prev => ({ ...prev, metaDescription: prev.excerpt }));
                  }}
                  className="text-xs text-accent font-body hover:underline"
                >
                  Reset to excerpt
                </button>
              )}
            </div>
          </div>

          {/* SEO Keywords */}
          <div>
            <label className="block text-sm font-body font-medium text-text-primary mb-2">
              SEO Keywords
            </label>
            <TagInput
              tags={formData.seoKeywords}
              onChange={(newTags) => setFormData(prev => ({ ...prev, seoKeywords: newTags }))}
              placeholder="Type keywords and press comma or Enter..."
              maxTags={15}
            />
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Content Blocks Section - Full Width Below Grid */}
      <div className="mt-8">
        <ContentBlocksEditor
          blocks={formData.contentBlocks}
          onChange={(updatedBlocks) => {
            setFormData(prev => ({
              ...prev,
              contentBlocks: updatedBlocks
            }));
          }}
        />
      </div>

      {/* Submit Button - Full Width Below Grid */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="submit"
          className="px-8 py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          {submitLabel}
        </button>
      </div>

      {/* Media Pickers */}
      <MediaPicker
        isOpen={mediaPickerOpen === 'featuredImage'}
        onClose={() => setMediaPickerOpen(null)}
        onSelect={(fileId) => handleMediaSelect(fileId, 'featuredImage')}
        accept="image/*"
        selectedFileId={formData.featuredImage}
      />

      <MediaPicker
        isOpen={mediaPickerOpen === 'featuredIcon'}
        onClose={() => setMediaPickerOpen(null)}
        onSelect={(fileId) => handleMediaSelect(fileId, 'featuredIcon')}
        accept="image/*"
        selectedFileId={formData.featuredIcon}
      />
    </form>
  );
};
