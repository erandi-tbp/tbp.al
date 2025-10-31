import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { appwriteConfig } from '../../../config/appwrite';
import { Query } from 'appwrite';
import { DataTable } from '../../../components/DataTable';
import { ArrowLeftIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getAllMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';

export const ViewProjectPage = () => {
  usePageTitle('View Project');
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [relatedCaseStudies, setRelatedCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caseStudiesLoading, setCaseStudiesLoading] = useState(true);

  useEffect(() => {
    loadProject();
    loadRelatedCaseStudies();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        'projects',
        id
      );

      // Load metadata from meta table
      const meta = await getAllMeta(META_COLLECTIONS.PROJECTS, id);

      // Combine entity data with meta data
      const combinedData = {
        ...response,
        seoTitle: meta.seo_title || '',
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || ''
      };

      setProject(combinedData);
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedCaseStudies = async () => {
    try {
      setCaseStudiesLoading(true);

      // Get all case studies
      const caseStudiesResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        'caseStudies',
        [Query.orderDesc('$createdAt')]
      );

      // Filter case studies that belong to this project by checking meta
      const caseStudiesWithMeta = await Promise.all(
        caseStudiesResponse.documents.map(async (caseStudy) => {
          const meta = await getAllMeta(META_COLLECTIONS.CASE_STUDIES, caseStudy.$id);
          return {
            ...caseStudy,
            projectId: meta.project_id
          };
        })
      );

      // Filter only case studies belonging to this project
      const filtered = caseStudiesWithMeta.filter(
        caseStudy => caseStudy.projectId === id
      );

      setRelatedCaseStudies(filtered);
    } catch (error) {
      console.error('Error loading related case studies:', error);
    } finally {
      setCaseStudiesLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${project?.title}"?`)) {
      return;
    }

    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        'projects',
        id
      );
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const getImageUrl = (fileId) => {
    if (!fileId) return null;
    const bucketId = appwriteConfig.bucketSettings;
    return `${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${appwriteConfig.projectId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-text-secondary font-body">Loading...</p>
      </div>
    );
  }

  const gallery = project.gallery ? JSON.parse(project.gallery) : [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent font-body mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              {project.title}
            </h1>
            <p className="text-text-secondary font-body">
              Project Details
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/admin/projects/${id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border text-text-primary font-body font-medium rounded-lg hover:bg-bg-primary transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 font-body font-medium rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
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
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Title
                </label>
                <p className="text-text-primary font-body">{project.title}</p>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Slug
                </label>
                <p className="text-text-primary font-body font-mono text-sm">{project.slug}</p>
              </div>

              {project.clientName && (
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    Client Name
                  </label>
                  <p className="text-text-primary font-body">{project.clientName}</p>
                </div>
              )}

              {project.excerpt && (
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    Excerpt
                  </label>
                  <p className="text-text-primary font-body">{project.excerpt}</p>
                </div>
              )}

              {project.description && (
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    Description
                  </label>
                  <p className="text-text-primary font-body whitespace-pre-wrap">{project.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {project.completedDate && (
                  <div>
                    <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                      Completed Date
                    </label>
                    <p className="text-text-primary font-body">
                      {new Date(project.completedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    Order
                  </label>
                  <p className="text-text-primary font-body">{project.order}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Status
                </label>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  project.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                }`}>
                  {project.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {project.featuredImage && (
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
                Featured Image
              </h2>
              <img
                src={getImageUrl(project.featuredImage)}
                alt={project.title}
                className="w-full h-64 object-cover rounded-lg border border-border"
              />
            </div>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
                Gallery ({gallery.length} images)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {gallery.map((fileId) => (
                  <img
                    key={fileId}
                    src={getImageUrl(fileId)}
                    alt="Gallery"
                    className="w-full h-32 object-cover rounded border border-border"
                  />
                ))}
              </div>
            </div>
          )}
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
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  SEO Title
                </label>
                <p className="text-text-primary font-body">{project.seoTitle || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Meta Description
                </label>
                <p className="text-text-primary font-body">{project.metaDescription || '-'}</p>
              </div>

              {project.seoKeywords && (
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    SEO Keywords
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.seoKeywords.split(',').map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent/10 text-accent rounded border border-accent/20 font-body text-sm"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Case Studies */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
              Related Case Studies
            </h2>
            <DataTable
              tableId="project-case-studies"
              columns={[
                {
                  key: 'title',
                  label: 'Title',
                  sortable: true
                },
                {
                  key: 'isPublished',
                  label: 'Status',
                  sortable: true,
                  render: (value) => (
                    <span className={`px-2 py-1 rounded text-xs font-body font-bold ${
                      value ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {value ? 'Published' : 'Draft'}
                    </span>
                  )
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  sortable: false,
                  render: (_, row) => (
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/admin/case-studies/${row.$id}`}
                        className="p-2 text-text-secondary hover:text-accent transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/admin/case-studies/${row.$id}/edit`}
                        className="p-2 text-text-secondary hover:text-accent transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  )
                }
              ]}
              data={relatedCaseStudies}
              loading={caseStudiesLoading}
              enableBulkActions={false}
              enableSearch={true}
              searchPlaceholder="Search case studies..."
              enableExport={false}
              enableColumnManager={false}
              emptyMessage="No case studies for this project yet. Case studies will appear here once you link them to this project"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
