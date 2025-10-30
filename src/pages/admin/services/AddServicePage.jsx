import { useNavigate, Link } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { ID } from 'appwrite';
import { ServiceForm } from '../../../components/admin/ServiceForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { setMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';

export const AddServicePage = () => {
  usePageTitle('Add Service');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Separate entity fields from meta fields
      const { seoTitle, seoKeywords, metaDescription, serviceGroupId, contentBlocks, ...entityData } = formData;

      // Create main entity document
      const newDocId = ID.unique();
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'services',
        newDocId,
        entityData
      );

      // Save SEO fields and content blocks to meta table
      await setMeta(META_COLLECTIONS.SERVICES, newDocId, 'seo_title', seoTitle);
      await setMeta(META_COLLECTIONS.SERVICES, newDocId, 'seo_keywords', seoKeywords);
      await setMeta(META_COLLECTIONS.SERVICES, newDocId, 'meta_description', metaDescription);
      await setMeta(META_COLLECTIONS.SERVICES, newDocId, 'content_blocks', contentBlocks);

      // Save service group relationship to meta table
      if (serviceGroupId) {
        await setMeta(META_COLLECTIONS.SERVICES, newDocId, 'service_group_id', serviceGroupId);
      }

      navigate('/admin/services');
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Failed to create service');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/services"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent font-body mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Services
        </Link>

        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Add Service
        </h1>
        <p className="text-text-secondary font-body">
          Create a new service for your agency
        </p>
      </div>

      {/* Form */}
      <ServiceForm onSubmit={handleSubmit} submitLabel="Create Service" />
    </div>
  );
};
