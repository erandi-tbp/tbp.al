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

export const ViewCaseStudyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaseStudy();
  }, [id]);

  const loadCaseStudy = async () => {
    try {
      setLoading(true);
      const doc = await databases.getDocument(DATABASE_ID, 'caseStudies', id);

      // Load meta data
      const meta = await getAllMeta(META_COLLECTIONS.CASE_STUDIES, id);

      // Load related project if exists
      if (meta.project_id) {
        try {
          const projectDoc = await databases.getDocument(DATABASE_ID, 'projects', meta.project_id);
          setProject(projectDoc);
        } catch (error) {
          console.error('Error loading project:', error);
        }
      }

      setCaseStudy({
        ...doc,
        seoTitle: meta.seo_title || '',
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || '',
        projectId: meta.project_id || ''
      });
    } catch (error) {
      console.error('Error loading case study:', error);
      alert('Failed to load case study');
      navigate('/admin/case-studies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this case study?')) {
      return;
    }

    try {
      await databases.deleteDocument(DATABASE_ID, 'caseStudies', id);
      alert('Case study deleted successfully!');
      navigate('/admin/case-studies');
    } catch (error) {
      console.error('Error deleting case study:', error);
      alert('Failed to delete case study');
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

  if (!caseStudy) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/case-studies')}
            className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">
              {caseStudy.title}
            </h1>
            <p className="text-text-secondary font-body mt-2">
              Case Study Details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/case-studies/${id}/edit`)}
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
                <p className="text-text-primary font-body font-bold">{caseStudy.title}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Slug</p>
                <p className="text-text-primary font-body font-mono">{caseStudy.slug}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Related Project</p>
                {project ? (
                  <button
                    onClick={() => navigate(`/admin/projects/${project.$id}`)}
                    className="text-accent font-body hover:underline"
                  >
                    {project.title}
                  </button>
                ) : (
                  <p className="text-text-secondary font-body">No project linked</p>
                )}
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {caseStudy.isPublished ? (
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
              {caseStudy.publishDate && (
                <div>
                  <p className="text-sm text-text-secondary font-body">Publish Date</p>
                  <p className="text-text-primary font-body">{new Date(caseStudy.publishDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
              Content
            </h2>
            <div className="space-y-3">
              {caseStudy.excerpt && (
                <div>
                  <p className="text-sm text-text-secondary font-body">Excerpt</p>
                  <p className="text-text-primary font-body">{caseStudy.excerpt}</p>
                </div>
              )}
              {caseStudy.description && (
                <div>
                  <p className="text-sm text-text-secondary font-body">Description</p>
                  <p className="text-text-primary font-body whitespace-pre-wrap">{caseStudy.description}</p>
                </div>
              )}
              {caseStudy.templateData && (
                <div>
                  <p className="text-sm text-text-secondary font-body">Template Data</p>
                  <pre className="text-text-primary font-body font-mono text-xs bg-bg-primary p-3 rounded border border-border overflow-x-auto mt-1">
                    {caseStudy.templateData}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {caseStudy.featuredImage && (
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
                Featured Image
              </h2>
              <img
                src={getFileUrl(caseStudy.featuredImage)}
                alt={caseStudy.title}
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
                <p className="text-text-primary font-body">{caseStudy.seoTitle || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Meta Description</p>
                <p className="text-text-primary font-body">{caseStudy.metaDescription || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Keywords</p>
                {caseStudy.seoKeywords ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {caseStudy.seoKeywords.split(',').map((keyword, index) => (
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
                  {new Date(caseStudy.$createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">Last Updated</p>
                <p className="text-text-primary font-body">
                  {new Date(caseStudy.$updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary font-body">ID</p>
                <p className="text-text-primary font-body font-mono text-xs">{caseStudy.$id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
