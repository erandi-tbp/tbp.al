import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { SEO } from '../../../components/common/SEO';
import { DesktopHeader, MobileHeader } from '../../../components/public/PrimaryHeader';
import { PrimaryFooter } from '../../../components/public/PrimaryFooter';

export const ServiceGroupsArchive = () => {
  const [serviceGroups, setServiceGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceGroups();
  }, []);

  const loadServiceGroups = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'serviceGroups',
        [Query.equal('isActive', true), Query.orderAsc('name')]
      );
      setServiceGroups(response.documents);
    } catch (error) {
      console.error('Error loading service groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-text-secondary font-body">Loading service groups...</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Service Groups"
        description="Browse our service categories and explore our comprehensive range of business solutions."
        keywords="service categories, business services, solutions"
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
              <span className="text-text-primary font-bold">Service Groups</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="py-12 md:py-16 bg-bg-secondary">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-4">
              Service Groups
            </h1>
            <p className="text-xl text-text-secondary font-body max-w-3xl">
              Explore our organized service categories to find the perfect solutions for your business needs.
            </p>
          </div>
        </section>

        {/* Service Groups Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {serviceGroups.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary font-body text-lg">
                  No service groups available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceGroups.map(group => {
                  const iconUrl = group.icon
                    ? `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${group.icon}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`
                    : null;

                  return (
                    <Link
                      key={group.$id}
                      to={`/service-groups/${group.slug}`}
                      className="bg-bg-secondary border border-border rounded-lg p-8 hover:shadow-lg transition-shadow group"
                    >
                      {/* Icon */}
                      {iconUrl && (
                        <div className="mb-6">
                          <img
                            src={iconUrl}
                            alt={group.name}
                            className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
                          />
                        </div>
                      )}

                      {/* Name */}
                      <h3 className="text-2xl font-heading font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                        {group.name}
                      </h3>

                      {/* Description */}
                      {group.description && (
                        <p className="text-text-secondary font-body line-clamp-3 mb-4">
                          {group.description}
                        </p>
                      )}

                      {/* Learn More Link */}
                      <span className="inline-flex items-center text-accent font-body font-semibold group-hover:gap-2 transition-all">
                        Explore Services
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
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-accent text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Need Help Finding the Right Service?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss your specific requirements and find the perfect solution.
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
