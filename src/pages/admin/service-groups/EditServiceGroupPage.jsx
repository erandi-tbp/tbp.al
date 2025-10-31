import { useState, useEffect } from 'react';
import { appwriteConfig } from '../../../config/appwrite';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { ServiceGroupForm } from '../../../components/admin/ServiceGroupForm';
import { DataTable } from '../../../components/DataTable/DataTable';
import { ArrowLeftIcon, PlusIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { getAllMeta, setMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';

export const EditServiceGroupPage = () => {
  usePageTitle('Edit Service Group');
  const navigate = useNavigate();
  const { id } = useParams();
  const [serviceGroup, setServiceGroup] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    loadServiceGroup();
    loadRelatedServices();
  }, [id]);

  const loadServiceGroup = async () => {
    try {
      setLoading(true);
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        'serviceGroups',
        id
      );

      // Load SEO metadata from meta table
      const meta = await getAllMeta(META_COLLECTIONS.SERVICE_GROUPS, id);

      // Combine entity data with meta data
      const combinedData = {
        ...response,
        seoTitle: meta.seo_title || '',
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || '',
        contentBlocks: meta.content_blocks || []
      };

      setServiceGroup(combinedData);
    } catch (error) {
      console.error('Error loading service group:', error);
      alert('Failed to load service group');
      navigate('/admin/service-groups');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedServices = async () => {
    try {
      setServicesLoading(true);

      // Get all services
      const servicesResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        'services',
        [Query.orderAsc('name')]
      );

      // Filter services that belong to this service group by checking meta
      const servicesWithMeta = await Promise.all(
        servicesResponse.documents.map(async (service) => {
          const meta = await getAllMeta(META_COLLECTIONS.SERVICES, service.$id);
          return {
            ...service,
            serviceGroupId: meta.service_group_id
          };
        })
      );

      // Filter only services belonging to this group
      const filtered = servicesWithMeta.filter(
        service => service.serviceGroupId === id
      );

      setRelatedServices(filtered);
    } catch (error) {
      console.error('Error loading related services:', error);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Separate entity fields from meta fields
      const { seoTitle, seoKeywords, metaDescription, contentBlocks, ...entityData } = formData;

      // Update main entity document (without SEO fields and content blocks)
      await databases.updateDocument(
        appwriteConfig.databaseId,
        'serviceGroups',
        id,
        entityData
      );

      // Save SEO fields and content blocks to meta table
      await setMeta(META_COLLECTIONS.SERVICE_GROUPS, id, 'seo_title', seoTitle);
      await setMeta(META_COLLECTIONS.SERVICE_GROUPS, id, 'seo_keywords', seoKeywords);
      await setMeta(META_COLLECTIONS.SERVICE_GROUPS, id, 'meta_description', metaDescription);
      await setMeta(META_COLLECTIONS.SERVICE_GROUPS, id, 'content_blocks', contentBlocks);

      navigate('/admin/service-groups');
    } catch (error) {
      console.error('Error updating service group:', error);
      alert('Failed to update service group');
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
          to="/admin/service-groups"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent font-body mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Service Groups
        </Link>

        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Edit Service Group
        </h1>
        <p className="text-text-secondary font-body">
          Update the details of "{serviceGroup?.name}"
        </p>
      </div>

      {/* Form */}
      {serviceGroup && (
        <>
          <ServiceGroupForm
            initialData={serviceGroup}
            onSubmit={handleSubmit}
            submitLabel="Update Service Group"
          />

          {/* Related Services Table */}
          <div className="mt-8 bg-bg-secondary rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold text-text-primary">
                Related Services
              </h2>
              <Link
                to={`/admin/services/new?groupId=${id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white font-body font-medium rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add Service
              </Link>
            </div>

            <DataTable
              tableId="service-group-services"
              columns={[
                {
                  key: 'name',
                  label: 'Name',
                  sortable: true
                },
                {
                  key: 'isActive',
                  label: 'Status',
                  sortable: true,
                  render: (value) => (
                    <span className={`px-2 py-1 rounded text-xs font-body font-bold ${
                      value ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {value ? 'Active' : 'Inactive'}
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
                        to={`/admin/services/${row.$id}`}
                        className="p-2 text-text-secondary hover:text-accent transition-colors"
                        title="View"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/admin/services/${row.$id}/edit`}
                        className="p-2 text-text-secondary hover:text-accent transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                    </div>
                  )
                }
              ]}
              data={relatedServices}
              loading={servicesLoading}
              enableBulkActions={false}
              enableSearch={true}
              searchPlaceholder="Search services..."
              enableExport={false}
              enableColumnManager={false}
              emptyMessage="No services in this group yet. Click 'Add Service' to get started."
            />
          </div>
        </>
      )}
    </div>
  );
};
