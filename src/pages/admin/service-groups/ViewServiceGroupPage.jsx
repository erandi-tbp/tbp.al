import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { DataTable } from '../../../components/DataTable';
import { ArrowLeftIcon, PencilIcon, TrashIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getAllMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';

export const ViewServiceGroupPage = () => {
  usePageTitle('View Service Group');
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
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
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
        metaDescription: meta.meta_description || ''
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
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
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

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${serviceGroup?.name}"?`)) {
      return;
    }

    try {
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'serviceGroups',
        id
      );
      navigate('/admin/service-groups');
    } catch (error) {
      console.error('Error deleting service group:', error);
      alert('Failed to delete service group');
    }
  };

  const getImageUrl = (fileId) => {
    if (!fileId) return null;
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';
    return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-text-secondary font-body">Loading...</p>
      </div>
    );
  }

  if (!serviceGroup) {
    return null;
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

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              {serviceGroup.name}
            </h1>
            <p className="text-text-secondary font-body">
              View service group details
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/admin/service-groups/${id}/edit`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              <PencilIcon className="w-5 h-5" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-body font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              <TrashIcon className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
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
                  Name
                </label>
                <p className="text-text-primary font-body font-medium">
                  {serviceGroup.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Slug
                </label>
                <p className="text-text-primary font-body font-mono text-sm">
                  {serviceGroup.slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Description
                </label>
                <p className="text-text-primary font-body">
                  {serviceGroup.description || '-'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Created
                </label>
                <p className="text-text-primary font-body text-sm">
                  {new Date(serviceGroup.$createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Last Updated
                </label>
                <p className="text-text-primary font-body text-sm">
                  {new Date(serviceGroup.$updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Media */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
            <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
              Featured Media
            </h2>

            <div className="space-y-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-2">
                  Featured Image
                </label>
                {serviceGroup.featuredImage && getImageUrl(serviceGroup.featuredImage) ? (
                  <img
                    src={getImageUrl(serviceGroup.featuredImage)}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-lg border border-border"
                  />
                ) : (
                  <div className="w-full h-64 bg-bg-primary rounded-lg border border-border flex items-center justify-center">
                    <p className="text-text-secondary font-body text-sm">No image uploaded</p>
                  </div>
                )}
              </div>

              {/* Featured Icon */}
              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-2">
                  Featured Icon
                </label>
                {serviceGroup.featuredIcon && getImageUrl(serviceGroup.featuredIcon) ? (
                  <img
                    src={getImageUrl(serviceGroup.featuredIcon)}
                    alt="Icon"
                    className="w-full h-64 object-cover rounded-lg border border-border"
                  />
                ) : (
                  <div className="w-full h-64 bg-bg-primary rounded-lg border border-border flex items-center justify-center">
                    <p className="text-text-secondary font-body text-sm">No icon uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                <p className="text-text-primary font-body">
                  {serviceGroup.seoTitle || '-'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Meta Description
                </label>
                <p className="text-text-primary font-body">
                  {serviceGroup.metaDescription || '-'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  SEO Keywords
                </label>
                <p className="text-text-primary font-body">
                  {serviceGroup.seoKeywords || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Related Services */}
          <div className="bg-bg-secondary rounded-lg p-6 border border-border">
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
        </div>
      </div>
    </div>
  );
};
