import { useState, useEffect } from 'react';
import { appwriteConfig } from '../../../config/appwrite';
import { useParams, useNavigate } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { META_COLLECTIONS, getAllMeta } from '../../../helpers/metaHelper';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const DATABASE_ID = appwriteConfig.databaseId;

export const ViewPagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPage();
  }, [id]);

  const loadPage = async () => {
    try {
      setLoading(true);
      const doc = await databases.getDocument(DATABASE_ID, 'pages', id);

      // Load meta data
      const meta = await getAllMeta(META_COLLECTIONS.PAGES, id);

      setPage({
        ...doc,
        seoTitle: meta.seo_title || '',
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || ''
      });
    } catch (error) {
      console.error('Error loading page:', error);
      alert('Failed to load page');
      navigate('/admin/pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      await databases.deleteDocument(DATABASE_ID, 'pages', id);
      alert('Page deleted successfully!');
      navigate('/admin/pages');
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  function getFileUrl(fileId) {
    if (!fileId) return null;
    const bucketId = appwriteConfig.bucketSettings;
    return `${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary font-body">Loading...</p>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/pages')}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">
              {page.title}
            </h1>
            <p className="text-text-secondary font-body mt-2">
              Page Details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/pages/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-body font-bold rounded-lg hover:bg-red-600 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
              Basic Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary font-body">Title</p>
                <p className="text-text-primary font-body font-bold">{page.title}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Slug</p>
                <p className="text-text-primary font-body font-mono">{page.slug}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Template</p>
                <p className="text-text-primary font-body">{page.template}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {page.isPublished ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-green-500 font-body font-bold">Published</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                      <span className="text-red-500 font-body font-bold">Draft</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
              Content
            </h2>
            <div className="space-y-3">
              {page.excerpt && (
                <div>
                  <p className="text-sm text-text-secondary font-body">Excerpt</p>
                  <p className="text-text-primary font-body">{page.excerpt}</p>
                </div>
              )}
              {page.content && (
                <div>
                  <p className="text-sm text-text-secondary font-body">Page Content</p>
                  <p className="text-text-primary font-body whitespace-pre-wrap">{page.content}</p>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {page.featuredImage && (
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
                Featured Image
              </h2>
              <img
                src={getFileUrl(page.featuredImage)}
                alt={page.title}
                className="w-full h-64 object-cover rounded-lg border border-border"
              />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* SEO Information */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
              SEO Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary font-body">SEO Title</p>
                <p className="text-text-primary font-body">{page.seoTitle || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Meta Description</p>
                <p className="text-text-primary font-body">{page.metaDescription || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Keywords</p>
                {page.seoKeywords ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {page.seoKeywords.split(',').map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-body"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary font-body">No keywords</p>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
              Metadata
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary font-body">Created</p>
                <p className="text-text-primary font-body">
                  {new Date(page.$createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Last Updated</p>
                <p className="text-text-primary font-body">
                  {new Date(page.$updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">ID</p>
                <p className="text-text-primary font-body font-mono text-xs">{page.$id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
