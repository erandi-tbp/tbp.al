import { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MediaPicker } from '../common/MediaPicker';

export const TestimonialForm = ({ initialData, onSubmit, submitLabel = 'Save' }) => {
  const [formData, setFormData] = useState({
    clientName: initialData?.clientName || '',
    clientPosition: initialData?.clientPosition || '',
    clientCompany: initialData?.clientCompany || '',
    testimonial: initialData?.testimonial || '',
    rating: initialData?.rating || 5,
    featuredImage: initialData?.featuredImage || '',
    isPublished: initialData?.isPublished !== undefined ? initialData.isPublished : true
  });

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [preview, setPreview] = useState(
    initialData?.featuredImage ? getFileUrl(initialData.featuredImage) : null
  );

  function getFileUrl(fileId) {
    if (!fileId) return null;
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';
    return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
    }));
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
              Client Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body font-medium text-text-primary mb-2">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-primary mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="clientPosition"
                  value={formData.clientPosition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent"
                  placeholder="e.g., CEO"
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-primary mb-2">
                  Company
                </label>
                <input
                  type="text"
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent"
                  placeholder="e.g., Acme Corporation"
                />
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-primary mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
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

          {/* Client Photo */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
              Client Photo (Optional)
            </h2>

            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Client"
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
          {/* Testimonial Content */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
              Testimonial Content
            </h2>

            <div>
              <label className="block text-sm font-body font-medium text-text-primary mb-2">
                Testimonial <span className="text-red-500">*</span>
              </label>
              <textarea
                name="testimonial"
                value={formData.testimonial}
                onChange={handleInputChange}
                required
                rows={12}
                className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent resize-none"
                placeholder="What did the client say about your work?"
              />
              <p className="mt-1 text-xs text-text-secondary font-body">
                {formData.testimonial.length} characters
              </p>
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
