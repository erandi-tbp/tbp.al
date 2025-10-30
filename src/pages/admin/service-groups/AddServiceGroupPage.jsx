import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { ID } from 'appwrite';
import { ServiceGroupForm } from '../../../components/admin/ServiceGroupForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { setMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';

export const AddServiceGroupPage = () => {
  usePageTitle('Add Service Group');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Separate entity fields from meta fields
      const { seoTitle, seoKeywords, metaDescription, contentBlocks, ...entityData } = formData;

      // Create main entity document (without SEO fields and content blocks)
      const newDocId = ID.unique();
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'serviceGroups',
        newDocId,
        entityData
      );

      // Save SEO fields and content blocks to meta table
      await setMeta(META_COLLECTIONS.SERVICE_GROUPS, newDocId, 'seo_title', seoTitle);
      await setMeta(META_COLLECTIONS.SERVICE_GROUPS, newDocId, 'seo_keywords', seoKeywords);
      await setMeta(META_COLLECTIONS.SERVICE_GROUPS, newDocId, 'meta_description', metaDescription);
      await setMeta(META_COLLECTIONS.SERVICE_GROUPS, newDocId, 'content_blocks', contentBlocks);

      navigate('/admin/service-groups');
    } catch (error) {
      console.error('Error creating service group:', error);
      alert('Failed to create service group');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/service-groups"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent font-body mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Service Groups
        </Link>

        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Add Service Group
        </h1>
        <p className="text-text-secondary font-body">
          Create a new service category for your agency
        </p>
      </div>

      {/* Form */}
      <ServiceGroupForm onSubmit={handleSubmit} submitLabel="Create Service Group" />
    </div>
  );
};
