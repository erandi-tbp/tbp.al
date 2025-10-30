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

export const SingleServiceGroup = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [serviceGroup, setServiceGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceGroup();
  }, [slug]);

  const loadServiceGroup = async () => {
    try {
      setLoading(true);

      // Get service group by slug
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        'serviceGroups',
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        navigate('/404');
        return;
      }

      const groupDoc = response.documents[0];

      // Load meta data (SEO + content blocks)
      const meta = await getAllMeta(META_COLLECTIONS.SERVICE_GROUPS, groupDoc.$id);

      const groupData = {
        ...groupDoc,
        seoTitle: meta.seo_title || groupDoc.name,
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || groupDoc.description || '',
        contentBlocks: meta.content_blocks || []
      };

      setServiceGroup(groupData);
    } catch (error) {
      console.error('Error loading service group:', error);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-text-secondary font-body">Loading...</p>
      </div>
    );
  }

  if (!serviceGroup) {
    return null;
  }

  return (
    <>
      <SEO
        title={serviceGroup.seoTitle || serviceGroup.name}
        description={serviceGroup.metaDescription}
        keywords={serviceGroup.seoKeywords}
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
              <Link to="/service-groups" className="text-text-secondary hover:text-accent transition-colors">
                Service Groups
              </Link>
              <span className="text-text-secondary">/</span>
              <span className="text-text-primary font-bold">{serviceGroup.name}</span>
            </nav>
          </div>
        </div>

        {/* Dynamic Content Blocks */}
        {serviceGroup.contentBlocks && serviceGroup.contentBlocks.length > 0 && (
          <BlockRenderer
            blocks={serviceGroup.contentBlocks}
            context={{ serviceGroupId: serviceGroup.$id }}
          />
        )}

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Interested in {serviceGroup.name}?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how our services can help you achieve your goals.
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
