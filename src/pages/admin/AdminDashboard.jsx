import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { databases } from '../../lib/appwrite';
import {
  FolderIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CogIcon,
  RectangleStackIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export const AdminDashboard = () => {
  usePageTitle('Dashboard');

  const [stats, setStats] = useState([
    { label: 'Service Groups', count: 0, Icon: FolderIcon, color: 'bg-blue-500' },
    { label: 'Services', count: 0, Icon: CogIcon, color: 'bg-indigo-500' },
    { label: 'Projects', count: 0, Icon: BriefcaseIcon, color: 'bg-green-500' },
    { label: 'Case Studies', count: 0, Icon: DocumentTextIcon, color: 'bg-purple-500' },
    { label: 'Testimonials', count: 0, Icon: StarIcon, color: 'bg-yellow-500' },
    { label: 'Pages', count: 0, Icon: RectangleStackIcon, color: 'bg-pink-500' },
    { label: 'Media Files', count: 0, Icon: PhotoIcon, color: 'bg-orange-500' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;

      // Load all counts in parallel
      const [
        serviceGroupsCount,
        servicesCount,
        projectsCount,
        caseStudiesCount,
        testimonialsCount,
        pagesCount,
        mediaCount
      ] = await Promise.all([
        databases.listDocuments(databaseId, 'serviceGroups').then(res => res.total),
        databases.listDocuments(databaseId, 'services').then(res => res.total),
        databases.listDocuments(databaseId, 'projects').then(res => res.total),
        databases.listDocuments(databaseId, 'caseStudies').then(res => res.total),
        databases.listDocuments(databaseId, 'testimonials').then(res => res.total),
        databases.listDocuments(databaseId, 'pages').then(res => res.total),
        databases.listDocuments(databaseId, 'media').then(res => res.total)
      ]);

      setStats([
        { label: 'Service Groups', count: serviceGroupsCount, Icon: FolderIcon, color: 'bg-blue-500' },
        { label: 'Services', count: servicesCount, Icon: CogIcon, color: 'bg-indigo-500' },
        { label: 'Projects', count: projectsCount, Icon: BriefcaseIcon, color: 'bg-green-500' },
        { label: 'Case Studies', count: caseStudiesCount, Icon: DocumentTextIcon, color: 'bg-purple-500' },
        { label: 'Testimonials', count: testimonialsCount, Icon: StarIcon, color: 'bg-yellow-500' },
        { label: 'Pages', count: pagesCount, Icon: RectangleStackIcon, color: 'bg-pink-500' },
        { label: 'Media Files', count: mediaCount, Icon: PhotoIcon, color: 'bg-orange-500' }
      ]);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Add Service Group', path: '/admin/service-groups/new', Icon: PlusIcon },
    { label: 'Add Project', path: '/admin/projects/new', Icon: PlusIcon },
    { label: 'Add Case Study', path: '/admin/case-studies/new', Icon: PlusIcon },
    { label: 'Manage SEO', path: '/admin/seo', Icon: MagnifyingGlassIcon }
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Welcome Back!
        </h1>
        <p className="text-text-secondary font-body">
          Here's what's happening with your agency website.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-bg-secondary rounded-lg p-6 border border-border animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-border w-12 h-12 rounded-lg"></div>
                <div className="bg-border w-16 h-8 rounded"></div>
              </div>
              <div className="bg-border w-24 h-4 rounded"></div>
            </div>
          ))
        ) : (
          stats.map((stat) => {
            const Icon = stat.Icon;
            return (
              <div
                key={stat.label}
                className="bg-bg-secondary rounded-lg p-6 border border-border hover-lift transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-heading font-bold text-text-primary">
                    {stat.count}
                  </span>
                </div>
                <p className="text-text-secondary font-body">{stat.label}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.Icon;
            return (
              <Link
                key={action.label}
                to={action.path}
                className="bg-bg-secondary rounded-lg p-6 border border-border hover-lift text-left transition-all block"
              >
                <Icon className="w-8 h-8 text-accent mb-3" />
                <p className="font-body font-bold text-text-primary">
                  {action.label}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">
          Recent Activity
        </h2>
        <div className="bg-bg-secondary rounded-lg p-6 border border-border">
          <p className="text-text-secondary font-body text-center py-8">
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  );
};
