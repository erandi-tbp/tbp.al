import { useNavigate, Link } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { appwriteConfig } from '../../../config/appwrite';
import { ID } from 'appwrite';
import { ProjectForm } from '../../../components/admin/ProjectForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { setMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';

export const AddProjectPage = () => {
  usePageTitle('Add Project');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Separate entity fields from meta fields
      const { seoTitle, seoKeywords, metaDescription, contentBlocks, ...entityData } = formData;

      // Create main entity document
      const newDocId = ID.unique();
      await databases.createDocument(
        appwriteConfig.databaseId,
        'projects',
        newDocId,
        entityData
      );

      // Save SEO fields and content blocks to meta table
      await setMeta(META_COLLECTIONS.PROJECTS, newDocId, 'seo_title', seoTitle);
      await setMeta(META_COLLECTIONS.PROJECTS, newDocId, 'seo_keywords', seoKeywords);
      await setMeta(META_COLLECTIONS.PROJECTS, newDocId, 'meta_description', metaDescription);
      await setMeta(META_COLLECTIONS.PROJECTS, newDocId, 'content_blocks', contentBlocks);

      navigate('/admin/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

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
          Add Project
        </h1>
        <p className="text-text-secondary font-body">
          Create a new client project
        </p>
      </div>

      {/* Form */}
      <ProjectForm onSubmit={handleSubmit} submitLabel="Create Project" />
    </div>
  );
};
