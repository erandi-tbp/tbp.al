import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { SEO } from '../../../components/common/SEO';
import { DesktopHeader, MobileHeader } from '../../../components/public/PrimaryHeader';
import { PrimaryFooter } from '../../../components/public/PrimaryFooter';
import { appwriteConfig } from '../../../config/appwrite';

export const ProjectsArchive = () => {
  const [projects, setProjects] = useState([]);
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
        appwriteConfig.databaseId,
        'serviceGroups',
        [Query.equal('isActive', true), Query.orderAsc('name')]
      );
      setServiceGroups(groupsResponse.documents);

      // Load projects
      const projectsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        'projects',
        [Query.equal('isPublished', true), Query.orderDesc('completedDate')]
      );
      setProjects(projectsResponse.documents);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedGroup === 'all'
    ? projects
    : projects.filter(project => project.serviceGroupId === selectedGroup);

  const bucketId = appwriteConfig.bucketSettings;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-text-secondary font-body">Loading projects...</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Our Projects"
        description="Explore our portfolio of successful projects and see how we deliver excellence in every engagement."
        keywords="projects, portfolio, case studies, client work"
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
              <span className="text-text-primary font-bold">Projects</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <section className="py-12 md:py-16 bg-bg-secondary">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-4">
              Our Projects
            </h1>
            <p className="text-xl text-text-secondary font-body max-w-3xl">
              Discover how we've helped businesses transform and grow through our innovative solutions.
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
                  All Projects
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

        {/* Projects Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary font-body text-lg">
                  No projects found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map(project => {
                  const featuredImageUrl = project.featuredImage
                    ? `${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${project.featuredImage}/view?project=${appwriteConfig.projectId}`
                    : null;

                  return (
                    <Link
                      key={project.$id}
                      to={`/projects/${project.slug}`}
                      className="bg-bg-secondary border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      {/* Featured Image */}
                      {featuredImageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={featuredImageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Client Name */}
                        {project.clientName && (
                          <p className="text-sm text-accent font-body font-semibold mb-2">
                            {project.clientName}
                          </p>
                        )}

                        <h3 className="text-2xl font-heading font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>

                        {project.excerpt && (
                          <p className="text-text-secondary font-body mb-4 line-clamp-3">
                            {project.excerpt}
                          </p>
                        )}

                        <span className="inline-flex items-center text-accent font-body font-semibold group-hover:gap-2 transition-all">
                          View Project
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
              Ready to Start Your Project?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's create something amazing together.
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
