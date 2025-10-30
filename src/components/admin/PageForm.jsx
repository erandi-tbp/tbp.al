import { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TagInput } from '../common/TagInput';
import { MediaPicker } from '../common/MediaPicker';

export const PageForm = ({ initialData, onSubmit, submitLabel = 'Save' }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featuredImage: initialData?.featuredImage || '',
    template: initialData?.template || 'default',
    isPublished: initialData?.isPublished !== undefined ? initialData.isPublished : false,
    seoTitle: initialData?.seoTitle || '',
    seoKeywords: initialData?.seoKeywords ? initialData.seoKeywords.split(',').map(k => k.trim()) : [],
    metaDescription: initialData?.metaDescription || ''
  });

  const [metaDescriptionOverridden, setMetaDescriptionOverridden] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [preview, setPreview] = useState(
    initialData?.featuredImage ? getFileUrl(initialData.featuredImage) : null
  );

  function getFileUrl(fileId) {
    if (!fileId) return null;
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';
    return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
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

    if (name === 'title' && !initialData) {
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
              <div>
                <label className="block text-sm font-body font-medium text-text-primary mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent"
                  placeholder="e.g., About Us"
                />
              </div>

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
                  placeholder="e.g., about-us"
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-primary mb-2">
                  Template
                </label>
                <select
                  name="template"
                  value={formData.template}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
                >
                  <option value="default">Default</option>
                  <option value="full-width">Full Width</option>
                  <option value="landing">Landing Page</option>
                  <option value="contact">Contact</option>
                </select>
              </div>

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

              <div>
                <label className="block text-sm font-body font-medium text-text-primary mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={10}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent resize-none"
                  placeholder="Page content..."
                />
              </div>

              <div>
                <label className="flex items-center gap-3 px-4 py-2 bg-bg-primary border border-border rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-text-primary font-body">Published</span>
                </label>
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
