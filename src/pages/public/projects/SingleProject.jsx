import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { BlockRenderer } from '../../../components/blocks/renderers/BlockRenderer';
import { getAllMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';
import { SEO } from '../../../components/common/SEO';
import { DesktopHeader, MobileHeader } from '../../../components/public/PrimaryHeader';
import { PrimaryFooter } from '../../../components/public/PrimaryFooter';

export const SingleProject = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [serviceGroup, setServiceGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [slug]);

  const loadProject = async () => {
    try {
      setLoading(true);

      // Get project by slug
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'projects',
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        navigate('/404');
        return;
      }

      const projectDoc = response.documents[0];

      // Load meta data
      const meta = await getAllMeta(META_COLLECTIONS.PROJECTS, projectDoc.$id);

      const projectData = {
        ...projectDoc,
        seoTitle: meta.seo_title || projectDoc.title,
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || projectDoc.excerpt || '',
        contentBlocks: meta.content_blocks || []
      };

      setProject(projectData);

      // Load service group if exists
      if (projectDoc.serviceGroupId) {
        try {
          const groupDoc = await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            'serviceGroups',
            projectDoc.serviceGroupId
          );
          setServiceGroup(groupDoc);
        } catch (error) {
          console.error('Error loading service group:', error);
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-text-secondary font-body">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <>
      <SEO
        title={project.seoTitle || project.title}
        description={project.metaDescription}
        keywords={project.seoKeywords}
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
              <Link to="/projects" className="text-text-secondary hover:text-accent transition-colors">
                Projects
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
              <span className="text-text-primary font-bold">{project.title}</span>
            </nav>
          </div>
        </div>

        {/* Dynamic Content Blocks */}
        {project.contentBlocks && project.contentBlocks.length > 0 && (
          <BlockRenderer
            blocks={project.contentBlocks}
            context={{ serviceGroupId: project.serviceGroupId }}
          />
        )}

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Have a Similar Project in Mind?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how we can help bring your vision to life.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-accent font-body font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Project
            </Link>
          </div>
        </section>
      </div>

      <PrimaryFooter />
    </>
  );
};
