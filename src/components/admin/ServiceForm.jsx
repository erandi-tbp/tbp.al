import { useState, useEffect } from 'react';
import { appwriteConfig } from '../../config/appwrite';
import { databases } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TagInput } from '../common/TagInput';
import { MediaPicker } from '../common/MediaPicker';
import { Select2 } from '../common/Select2';
import { ContentBlocksEditor } from './blocks/ContentBlocksEditor';

export const ServiceForm = ({ initialData, onSubmit, submitLabel = 'Save' }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    description: initialData?.description || '',
    features: initialData?.features ? JSON.parse(initialData.features) : [],
    order: initialData?.order || 0,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    featuredImage: initialData?.featuredImage || '',
    serviceGroupId: initialData?.serviceGroupId || '', // Will be stored in meta
    seoTitle: initialData?.seoTitle || '',
    seoKeywords: initialData?.seoKeywords ? initialData.seoKeywords.split(',').map(k => k.trim()) : [],
    metaDescription: initialData?.metaDescription || '',
    contentBlocks: initialData?.contentBlocks || []
  });

  const [serviceGroups, setServiceGroups] = useState([]);
  const [metaDescriptionOverridden, setMetaDescriptionOverridden] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [preview, setPreview] = useState(
    initialData?.featuredImage ? getFileUrl(initialData.featuredImage) : null
  );

  useEffect(() => {
    loadServiceGroups();
  }, []);

  const loadServiceGroups = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        'serviceGroups',
        [Query.orderAsc('name')]
      );
      setServiceGroups(response.documents);
    } catch (error) {
      console.error('Error loading service groups:', error);
    }
  };

  function getFileUrl(fileId) {
    if (!fileId) return null;
    const bucketId = appwriteConfig.bucketSettings;
    return `${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
  }

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updates = { [name]: type === 'checkbox' ? checked : value };

    if (name === 'name' && !initialData) {
      updates.slug = generateSlug(value);
    }

    if (name === 'excerpt' && !metaDescriptionOverridden) {
      updates.metaDescription = value;
    }

    if (name === 'metaDescription') {
      setMetaDescriptionOverridden(true);
    }

    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleMediaSelect = (fileId) => {
    setFormData(prev => ({ ...prev, featuredImage: fileId }));
    setPreview(getFileUrl(fileId));
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, featuredImage: '' }));
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      features: JSON.stringify(formData.features),
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
                  placeholder="e.g., SEO Optimization"
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
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent font-mono"
                  placeholder="e.g., seo-optimization"
                />
                <p className="mt-1 text-xs text-text-secondary font-body">
                  Auto-generated from name. Used in URLs
                </p>
              </div>

              {/* Service Group */}
              <div>
                <label className="block text-sm font-body font-medium text-text-primary mb-2">
                  Service Group <span className="text-red-500">*</span>
                </label>
                <Select2
                  options={serviceGroups.map(group => ({
                    value: group.$id,
                    label: group.name
                  }))}
                  value={formData.serviceGroupId}
                  onChange={(value) => setFormData(prev => ({ ...prev, serviceGroupId: value }))}
                  placeholder="Select a service group"
                  searchable
                  clearable
                />
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
                  {formData.excerpt.length}/500 characters
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
                  placeholder="Detailed description..."
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-body font-medium text-text-primary mb-2">
                  Features
                </label>
                <TagInput
                  tags={formData.features}
                  onChange={(newFeatures) => setFormData(prev => ({ ...prev, features: newFeatures }))}
                  placeholder="Type features and press comma or Enter..."
                  maxTags={20}
                />
              </div>

              {/* Order & Active Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium text-text-primary mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-text-primary mb-2">
                    Status
                  </label>
                  <label className="flex items-center gap-3 px-4 py-2 bg-bg-primary border border-border rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-text-primary font-body">Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
              Featured Image
            </h2>

            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Featured"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
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

      {/* Content Blocks Section */}
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

      {/* Submit Button */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="submit"
          className="px-8 py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          {submitLabel}
        </button>
      </div>

      {/* Media Picker */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(fileId) => handleMediaSelect(fileId)}
        accept="image/*"
        selectedFileId={formData.featuredImage}
      />
    </form>
  );
};
