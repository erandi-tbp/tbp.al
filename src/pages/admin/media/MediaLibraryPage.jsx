import { useState, useEffect } from 'react';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { storage } from '../../../lib/appwrite';
import { Query, ID } from 'appwrite';
import { DataTable } from '../../../components/DataTable';
import {
  PhotoIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  FilmIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

export const MediaLibraryPage = () => {
  usePageTitle('Media Library');

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';

  useEffect(() => {
    loadFiles();
  }, []);

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
      alert('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    try {
      setUploading(true);

      // Upload files one by one
      for (const file of Array.from(fileList)) {
        await storage.createFile(bucketId, ID.unique(), file);
      }

      await loadFiles();
      alert(`Successfully uploaded ${fileList.length} file(s)`);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload some files');
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

  const handleDelete = async (fileId, fileName) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      await storage.deleteFile(bucketId, fileId);
      await loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} file(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedIds.map(id => storage.deleteFile(bucketId, id))
      );
      await loadFiles();
    } catch (error) {
      console.error('Error deleting files:', error);
      alert('Failed to delete some files');
    }
  };

  const handleDownload = (fileId, fileName) => {
    const url = getFileUrl(fileId);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyUrl = (fileId) => {
    const url = getFileUrl(fileId);
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const getFileUrl = (fileId) => {
    return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return <PhotoIcon className="w-5 h-5 text-blue-500" />;
    } else if (mimeType.startsWith('video/')) {
      return <FilmIcon className="w-5 h-5 text-purple-500" />;
    } else if (mimeType.includes('pdf')) {
      return <DocumentTextIcon className="w-5 h-5 text-red-500" />;
    } else if (mimeType.includes('document') || mimeType.includes('word')) {
      return <DocumentIcon className="w-5 h-5 text-blue-600" />;
    } else {
      return <ClipboardDocumentIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('document')) return 'Document';
    return 'File';
  };

  const columns = [
    {
      key: 'name',
      label: 'Preview',
      pinned: 'left',
      sortable: false,
      render: (_, file) => {
        const isImage = file.mimeType.startsWith('image/');
        return (
          <div className="flex items-center gap-3">
            {isImage ? (
              <img
                src={getFileUrl(file.$id)}
                alt={file.name}
                className="w-16 h-16 object-cover rounded border border-border cursor-pointer"
                onClick={() => setSelectedFile(file)}
              />
            ) : (
              <div className="w-16 h-16 bg-bg-primary rounded border border-border flex items-center justify-center">
                {getFileTypeIcon(file.mimeType)}
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'name',
      label: 'File Name',
      pinned: 'left',
      render: (value, file) => (
        <div>
          <p className="font-medium text-text-primary">{value}</p>
          <p className="text-xs text-text-secondary mt-1">{file.$id}</p>
        </div>
      )
    },
    {
      key: 'mimeType',
      label: 'Type',
      render: (value) => (
        <span className="inline-flex items-center gap-2 px-2 py-1 bg-bg-primary rounded border border-border text-sm">
          {getFileTypeIcon(value)}
          {getFileType(value)}
        </span>
      )
    },
    {
      key: 'sizeOriginal',
      label: 'Size',
      render: (value) => (
        <span className="text-text-secondary text-sm">{formatFileSize(value)}</span>
      )
    },
    {
      key: '$createdAt',
      label: 'Uploaded',
      render: (value) => (
        <span className="text-text-secondary text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, file) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleCopyUrl(file.$id)}
            className="p-2 text-text-secondary hover:text-accent transition-colors"
            title="Copy URL"
          >
            <ClipboardDocumentIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDownload(file.$id, file.name)}
            className="p-2 text-text-secondary hover:text-accent transition-colors"
            title="Download"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(file.$id, file.name);
            }}
            className="p-2 text-text-secondary hover:text-red-500 transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: TrashIcon,
      variant: 'danger',
      onClick: handleBulkDelete
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-text-secondary font-body">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Media Library
        </h1>
        <p className="text-text-secondary font-body">
          Manage all your website assets in one place
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="mb-6 border-2 border-dashed border-border rounded-lg p-8 bg-bg-secondary hover:border-accent transition-colors"
      >
        <div className="flex flex-col items-center justify-center">
          <CloudArrowUpIcon className="w-12 h-12 text-text-secondary mb-4" />
          <h3 className="text-lg font-heading font-bold text-text-primary mb-2">
            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
          </h3>
          <p className="text-text-secondary font-body text-sm mb-4">
            Supports images, videos, documents, and more (max 50MB per file)
          </p>
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity">
              <CloudArrowUpIcon className="w-5 h-5" />
              Choose Files
            </span>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        tableId="media-library"
        columns={columns}
        data={files}
        onRowClick={(file) => {
          if (file.mimeType.startsWith('image/')) {
            setSelectedFile(file);
          }
        }}
        enableBulkActions={true}
        bulkActions={bulkActions}
        enableSearch={true}
        enableExport={false}
        enableColumnManager={true}
        searchPlaceholder="Search files..."
        emptyMessage="No files uploaded yet. Drop some files above!"
      />

      {/* Image Preview Modal */}
      {selectedFile && selectedFile.mimeType.startsWith('image/') && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedFile(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={getFileUrl(selectedFile.$id)}
              alt={selectedFile.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
