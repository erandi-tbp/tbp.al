import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { BlockRenderer } from '../../../components/blocks/renderers/BlockRenderer';
import { getAllMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';
import { SEO } from '../../../components/common/SEO';
import { DesktopHeader, MobileHeader } from '../../../components/public/PrimaryHeader';
import { PrimaryFooter } from '../../../components/public/PrimaryFooter';
import { appwriteConfig } from '../../../config/appwrite';

export const SingleService = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [serviceGroup, setServiceGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [slug]);

  const loadService = async () => {
    try {
      setLoading(true);

      // Get service by slug
      const servicesResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        'services',
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (servicesResponse.documents.length === 0) {
        navigate('/404');
        return;
      }

      const serviceDoc = servicesResponse.documents[0];

      // Load meta data (SEO + content blocks + service group)
      const meta = await getAllMeta(META_COLLECTIONS.SERVICES, serviceDoc.$id);

      const serviceData = {
        ...serviceDoc,
        seoTitle: meta.seo_title || serviceDoc.name,
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || serviceDoc.excerpt || '',
        contentBlocks: meta.content_blocks || [],
        serviceGroupId: meta.service_group_id || ''
      };

      setService(serviceData);

      // Load service group if exists
      if (serviceData.serviceGroupId) {
        try {
          const groupDoc = await databases.getDocument(
            appwriteConfig.databaseId,
            'serviceGroups',
            serviceData.serviceGroupId
          );
          setServiceGroup(groupDoc);
        } catch (error) {
          console.error('Error loading service group:', error);
        }
      }
    } catch (error) {
      console.error('Error loading service:', error);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-text-secondary font-body">Loading service...</p>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  const bucketId = appwriteConfig.bucketSettings;
  const featuredImageUrl = service.featuredImage
    ? `${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${service.featuredImage}/view?project=${appwriteConfig.projectId}`
    : null;

  return (
    <>
      <SEO
        title={service.seoTitle || service.name}
        description={service.metaDescription}
        keywords={service.seoKeywords}
      />

      <DesktopHeader />
      <MobileHeader />

      <div className="min-h-screen bg-bg-primary">
        {/* Breadcrumbs */}
        <div className="bg-bg-secondary border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm font-body">
              <Link to="/" className="text-text-secondary hover:text-accent transition-colors">
                Home
              </Link>
              <span className="text-text-secondary">/</span>
              <Link to="/services" className="text-text-secondary hover:text-accent transition-colors">
                Services
              </Link>
              {serviceGroup && (
                <>
                  <span className="text-text-secondary">/</span>
                  <Link
                    to={`/service-groups/${serviceGroup.slug}`}
                    className="text-text-secondary hover:text-accent transition-colors"
                  >
                    {serviceGroup.name}
                  </Link>
                </>
              )}
              <span className="text-text-secondary">/</span>
              <span className="text-text-primary font-bold">{service.name}</span>
            </nav>
          </div>
        </div>

        {/* Dynamic Content Blocks */}
        {service.contentBlocks && service.contentBlocks.length > 0 && (
          <BlockRenderer blocks={service.contentBlocks} />
        )}

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Interested in {service.name}?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how we can help you achieve your goals.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-accent font-body font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </div>

      <PrimaryFooter />
    </>
  );
};
