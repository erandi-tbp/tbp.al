import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { BlockRenderer } from '../../../components/blocks/renderers/BlockRenderer';
import { getAllMeta, META_COLLECTIONS } from '../../../helpers/metaHelper';
import { SEO } from '../../../components/common/SEO';
import { DesktopHeader, MobileHeader } from '../../../components/public/PrimaryHeader';
import { PrimaryFooter } from '../../../components/public/PrimaryFooter';

export const SingleCaseStudy = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState(null);
  const [serviceGroup, setServiceGroup] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaseStudy();
  }, [slug]);

  const loadCaseStudy = async () => {
    try {
      setLoading(true);

      // Get case study by slug
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'caseStudies',
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        navigate('/404');
        return;
      }

      const caseStudyDoc = response.documents[0];

      // Load meta data
      const meta = await getAllMeta(META_COLLECTIONS.CASE_STUDIES, caseStudyDoc.$id);

      const caseStudyData = {
        ...caseStudyDoc,
        seoTitle: meta.seo_title || caseStudyDoc.title,
        seoKeywords: meta.seo_keywords || '',
        metaDescription: meta.meta_description || caseStudyDoc.excerpt || '',
        contentBlocks: meta.content_blocks || [],
        projectId: meta.project_id || ''
      };

      setCaseStudy(caseStudyData);

      // Load service group if exists
      if (caseStudyDoc.serviceGroupId) {
        try {
          const groupDoc = await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            'serviceGroups',
            caseStudyDoc.serviceGroupId
          );
          setServiceGroup(groupDoc);
        } catch (error) {
          console.error('Error loading service group:', error);
        }
      }

      // Load related project if exists
      if (meta.project_id) {
        try {
          const projectDoc = await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            'projects',
            meta.project_id
          );
          setProject(projectDoc);
        } catch (error) {
          console.error('Error loading project:', error);
        }
      }
    } catch (error) {
      console.error('Error loading case study:', error);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-text-secondary font-body">Loading case study...</p>
      </div>
    );
  }

  if (!caseStudy) {
    return null;
  }

  return (
    <>
      <SEO
        title={caseStudy.seoTitle || caseStudy.title}
        description={caseStudy.metaDescription}
        keywords={caseStudy.seoKeywords}
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
              <Link to="/case-studies" className="text-text-secondary hover:text-accent transition-colors">
                Case Studies
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
              <span className="text-text-primary font-bold">{caseStudy.title}</span>
            </nav>
          </div>
        </div>

        {/* Dynamic Content Blocks */}
        {caseStudy.contentBlocks && caseStudy.contentBlocks.length > 0 && (
          <BlockRenderer
            blocks={caseStudy.contentBlocks}
            context={{ serviceGroupId: caseStudy.serviceGroupId }}
          />
        )}

        {/* Related Project */}
        {project && (
          <section className="py-12 md:py-16 bg-bg-secondary">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-heading font-bold text-text-primary mb-6">
                Related Project
              </h2>
              <Link
                to={`/projects/${project.slug}`}
                className="inline-flex items-center text-accent font-body font-semibold hover:gap-2 transition-all"
              >
                View {project.title}
                <svg
                  className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Achieve Similar Results?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's create a success story for your business too.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-accent font-body font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </div>

      <PrimaryFooter />
    </>
  );
};
