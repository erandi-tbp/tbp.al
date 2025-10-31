import { useState, useEffect } from 'react';
import { appwriteConfig } from '../../../config/appwrite';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { databases } from '../../../lib/appwrite';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getAllMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';

export const ViewServicePage = () => {
  usePageTitle('View Service');
  const navigate = useNavigate();
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [serviceGroup, setServiceGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      setLoading(true);
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        'services',
        id
      );

      // Load metadata from meta table
      const meta = await getAllMeta(META_COLLECTIONS.SERVICES, id);

      // Load service group if exists
      if (meta.service_group_id) {
        try {
          const groupResponse = await databases.getDocument(
            appwriteConfig.databaseId,
            'serviceGroups',
            meta.service_group_id
          );
          setServiceGroup(groupResponse);
        } catch (error) {
          console.error('Error loading service group:', error);
        }
      }

      // Combine entity data with meta data
      const combinedData = {
        ...response,
        seoTitle: meta.seo_title || '',
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || ''
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

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${service?.name}"?`)) {
      return;
    }

    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        'services',
        id
      );
      navigate('/admin/services');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
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

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
              {service.name}
            </h1>
            <p className="text-text-secondary font-body">
              Service Details
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/admin/services/${id}/edit`}
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
                  Name
                </label>
                <p className="text-text-primary font-body">{service.name}</p>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Slug
                </label>
                <p className="text-text-primary font-body font-mono text-sm">{service.slug}</p>
              </div>

              {serviceGroup && (
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    Service Group
                  </label>
                  <Link
                    to={`/admin/service-groups/${serviceGroup.$id}`}
                    className="text-accent font-body hover:underline"
                  >
                    {serviceGroup.name}
                  </Link>
                </div>
              )}

              {service.excerpt && (
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    Excerpt
                  </label>
                  <p className="text-text-primary font-body">{service.excerpt}</p>
                </div>
              )}

              {service.description && (
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    Description
                  </label>
                  <p className="text-text-primary font-body whitespace-pre-wrap">{service.description}</p>
                </div>
              )}

              {service.features && JSON.parse(service.features).length > 0 && (
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    Features
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {JSON.parse(service.features).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent/10 text-accent rounded border border-accent/20 font-body text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    Order
                  </label>
                  <p className="text-text-primary font-body">{service.order}</p>
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    Status
                  </label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    service.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {service.featuredImage && (
            <div className="bg-bg-secondary rounded-lg p-6 border border-border">
              <h2 className="text-xl font-heading font-bold text-text-primary mb-6">
                Featured Image
              </h2>
              <img
                src={getImageUrl(service.featuredImage)}
                alt={service.name}
                className="w-full h-64 object-cover rounded-lg border border-border"
              />
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
                <p className="text-text-primary font-body">{service.seoTitle || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                  Meta Description
                </label>
                <p className="text-text-primary font-body">{service.metaDescription || '-'}</p>
              </div>

              {service.seoKeywords && (
                <div>
                  <label className="block text-sm font-body font-medium text-text-secondary mb-1">
                    SEO Keywords
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {service.seoKeywords.split(',').map((keyword, index) => (
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
        </div>
      </div>
    </div>
  );
};
