import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { ServiceForm } from '../../../components/admin/ServiceForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getAllMeta, setMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';

export const EditServicePage = () => {
  usePageTitle('Edit Service');
  const navigate = useNavigate();
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      setLoading(true);
      const response = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'services',
        id
      );

      // Load metadata from meta table
      const meta = await getAllMeta(META_COLLECTIONS.SERVICES, id);

      // Combine entity data with meta data
      const combinedData = {
        ...response,
        seoTitle: meta.seo_title || '',
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || '',
        serviceGroupId: meta.service_group_id || '',
        contentBlocks: meta.content_blocks || []
      };

      setService(combinedData);
    } catch (error) {
      console.error('Error loading service:', error);
      alert('Failed to load service');
      navigate('/admin/services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Separate entity fields from meta fields
      const { seoTitle, seoKeywords, metaDescription, serviceGroupId, contentBlocks, ...entityData } = formData;

      // Update main entity document
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'services',
        id,
        entityData
      );

      // Save SEO fields and content blocks to meta table
      await setMeta(META_COLLECTIONS.SERVICES, id, 'seo_title', seoTitle);
      await setMeta(META_COLLECTIONS.SERVICES, id, 'seo_keywords', seoKeywords);
      await setMeta(META_COLLECTIONS.SERVICES, id, 'meta_description', metaDescription);
      await setMeta(META_COLLECTIONS.SERVICES, id, 'content_blocks', contentBlocks);

      // Save service group relationship to meta table
      if (serviceGroupId) {
        await setMeta(META_COLLECTIONS.SERVICES, id, 'service_group_id', serviceGroupId);
      }

      navigate('/admin/services');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service');
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
          to="/admin/services"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent font-body mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Services
        </Link>

        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Edit Service
        </h1>
        <p className="text-text-secondary font-body">
          Update the details of "{service?.name}"
        </p>
      </div>

      {/* Form */}
      {service && (
        <ServiceForm
          initialData={service}
          onSubmit={handleSubmit}
          submitLabel="Update Service"
        />
      )}
    </div>
  );
};
