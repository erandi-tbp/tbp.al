import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { ProjectForm } from '../../../components/admin/ProjectForm';
import { DataTable } from '../../../components/DataTable/DataTable';
import { ArrowLeftIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { getAllMeta, setMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';

export const EditProjectPage = () => {
  usePageTitle('Edit Project');
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
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
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
        metaDescription: meta.meta_description || '',
        contentBlocks: meta.content_blocks || []
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
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
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

  const handleSubmit = async (formData) => {
    try {
      // Separate entity fields from meta fields
      const { seoTitle, seoKeywords, metaDescription, contentBlocks, ...entityData } = formData;

      // Update main entity document
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'projects',
        id,
        entityData
      );

      // Save SEO fields and content blocks to meta table
      await setMeta(META_COLLECTIONS.PROJECTS, id, 'seo_title', seoTitle);
      await setMeta(META_COLLECTIONS.PROJECTS, id, 'seo_keywords', seoKeywords);
      await setMeta(META_COLLECTIONS.PROJECTS, id, 'meta_description', metaDescription);
      await setMeta(META_COLLECTIONS.PROJECTS, id, 'content_blocks', contentBlocks);

      navigate('/admin/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

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
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent font-body mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Projects
        </Link>

        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Edit Project
        </h1>
        <p className="text-text-secondary font-body">
          Update the details of "{project?.title}"
        </p>
      </div>

      {/* Form */}
      {project && (
        <>
          <ProjectForm
            initialData={project}
            onSubmit={handleSubmit}
            submitLabel="Update Project"
          />

          {/* Related Case Studies Table */}
          <div className="mt-8 bg-bg-secondary rounded-lg p-6 border border-border">
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
        </>
      )}
    </div>
  );
};
