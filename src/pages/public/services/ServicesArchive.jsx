import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { SEO } from '../../../components/common/SEO';
import { DesktopHeader, MobileHeader } from '../../../components/public/PrimaryHeader';
import { PrimaryFooter } from '../../../components/public/PrimaryFooter';

export const ServicesArchive = () => {
  const [services, setServices] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load service groups
      const groupsResponse = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'serviceGroups',
        [Query.equal('isActive', true), Query.orderAsc('name')]
      );
      setServiceGroups(groupsResponse.documents);

      // Load services
      const servicesResponse = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'services',
        [Query.equal('isActive', true), Query.orderAsc('name')]
      );
      setServices(servicesResponse.documents);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = selectedGroup === 'all'
    ? services
    : services.filter(service => service.serviceGroupId === selectedGroup);

  const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-text-secondary font-body">Loading services...</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Our Services"
        description="Explore our comprehensive range of services designed to help your business grow and succeed."
        keywords="services, business solutions, consulting"
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
              <span className="text-text-primary font-bold">Services</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="py-12 md:py-16 bg-bg-secondary">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-4">
              Our Services
            </h1>
            <p className="text-xl text-text-secondary font-body max-w-3xl">
              Discover the full range of services we offer to help your business thrive in today's competitive landscape.
            </p>
          </div>
        </section>

        {/* Filter by Service Group */}
        {serviceGroups.length > 0 && (
          <section className="py-8 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGroup('all')}
                  className={`px-4 py-2 rounded-lg font-body transition-colors ${
                    selectedGroup === 'all'
                      ? 'bg-accent text-white'
                      : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80'
                  }`}
                >
                  All Services
                </button>
                {serviceGroups.map(group => (
                  <button
                    key={group.$id}
                    onClick={() => setSelectedGroup(group.$id)}
                    className={`px-4 py-2 rounded-lg font-body transition-colors ${
                      selectedGroup === group.$id
                        ? 'bg-accent text-white'
                        : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80'
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Services Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary font-body text-lg">
                  No services found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map(service => {
                  const featuredImageUrl = service.featuredImage
                    ? `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${service.featuredImage}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`
                    : null;

                  return (
                    <Link
                      key={service.$id}
                      to={`/services/${service.slug}`}
                      className="bg-bg-secondary border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      {/* Featured Image */}
                      {featuredImageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={featuredImageUrl}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-2xl font-heading font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                          {service.name}
                        </h3>

                        {service.excerpt && (
                          <p className="text-text-secondary font-body mb-4 line-clamp-3">
                            {service.excerpt}
                          </p>
                        )}

                        <span className="inline-flex items-center text-accent font-body font-semibold group-hover:gap-2 transition-all">
                          Learn More
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
                      </div>
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
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss your specific needs and how we can help.
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
