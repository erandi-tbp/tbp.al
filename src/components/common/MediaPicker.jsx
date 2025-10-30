import { useState, useEffect } from 'react';
import { storage } from '../../lib/appwrite';
import { Query, ID } from 'appwrite';
import {
  XMarkIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

/**
 * MediaPicker Component
 *
 * Modal that allows users to either:
 * 1. Upload a new file
 * 2. Select from existing files in the media library
 *
 * @param {boolean} isOpen - Whether the picker is open
 * @param {function} onClose - Close callback
 * @param {function} onSelect - Called with fileId when a file is selected
 * @param {string} accept - File types to accept (e.g., "image/*")
 * @param {string} selectedFileId - Currently selected file ID (for highlighting)
 */
export const MediaPicker = ({
  isOpen,
  onClose,
  onSelect,
  accept = '*/*',
  selectedFileId = null
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'upload'

  const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';

  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await storage.listFiles(bucketId, [
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]);
      setFiles(response.files);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    try {
      setUploading(true);
      const file = fileList[0]; // Single file upload for now
      const response = await storage.createFile(bucketId, ID.unique(), file);

      // Auto-select the uploaded file
      onSelect(response.$id);
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    handleUpload(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleUpload(e.dataTransfer.files);
  };

  const getFileUrl = (fileId) => {
    return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
  };

  const filteredFiles = files.filter(file => {
    if (!searchTerm) return true;
    return file.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Filter by accept type
  const typeFilteredFiles = filteredFiles.filter(file => {
    if (accept === '*/*') return true;
    if (accept.startsWith('image/')) return file.mimeType.startsWith('image/');
    if (accept.startsWith('video/')) return file.mimeType.startsWith('video/');
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-bg-secondary rounded-lg border border-border max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-heading font-bold text-text-primary">
            Select Media
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-lg p-8 bg-bg-primary hover:border-accent transition-colors mb-6"
          >
            <div className="flex flex-col items-center justify-center">
              <CloudArrowUpIcon className="w-12 h-12 text-text-secondary mb-3" />
              <h3 className="text-base font-heading font-bold text-text-primary mb-1">
                {uploading ? 'Uploading...' : 'Drop file here or click to upload'}
              </h3>
              <p className="text-text-secondary font-body text-sm mb-3">
                {accept === 'image/*' ? 'Images only' : 'All file types'} (max 50MB)
              </p>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white font-body font-medium rounded-lg hover:opacity-90 transition-opacity">
                  <CloudArrowUpIcon className="w-5 h-5" />
                  Choose File
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept={accept}
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-border"></div>
            <span className="text-text-secondary font-body text-sm">or select from library</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-text-secondary absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary font-body focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Files Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-text-secondary font-body">Loading files...</p>
            </div>
          ) : typeFilteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <PhotoIcon className="w-16 h-16 text-text-secondary mb-4" />
              <p className="text-text-secondary font-body">
                {searchTerm ? 'No files found' : 'No files uploaded yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {typeFilteredFiles.map((file) => {
                const isImage = file.mimeType.startsWith('image/');
                const isSelected = file.$id === selectedFileId;

                return (
                  <div
                    key={file.$id}
                    onClick={() => {
                      onSelect(file.$id);
                      onClose();
                    }}
                    className={`relative aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent'
                    }`}
                  >
                    {isImage ? (
                      <img
                        src={getFileUrl(file.$id)}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-bg-primary rounded-lg">
                        <PhotoIcon className="w-12 h-12 text-text-secondary" />
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg truncate">
                      {file.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-bg-primary border border-border text-text-primary font-body font-medium rounded-lg hover:bg-bg-secondary transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
