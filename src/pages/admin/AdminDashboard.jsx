import { usePageTitle } from '../../hooks/usePageTitle';
import {
  FolderIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export const AdminDashboard = () => {
  usePageTitle('Dashboard');

  const stats = [
    { label: 'Service Groups', count: 6, Icon: FolderIcon, color: 'bg-blue-500' },
    { label: 'Projects', count: 0, Icon: BriefcaseIcon, color: 'bg-green-500' },
    { label: 'Case Studies', count: 0, Icon: DocumentTextIcon, color: 'bg-purple-500' },
    { label: 'Testimonials', count: 0, Icon: StarIcon, color: 'bg-yellow-500' }
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.Icon;
          return (
            <div
              key={stat.label}
              className="bg-bg-secondary rounded-lg p-6 border border-text-primary/10"
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
        })}
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
              <button
                key={action.label}
                className="bg-bg-secondary rounded-lg p-6 border border-text-primary/10 hover:border-accent transition-colors text-left"
              >
                <Icon className="w-8 h-8 text-accent mb-3" />
                <p className="font-body font-bold text-text-primary">
                  {action.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">
          Recent Activity
        </h2>
        <div className="bg-bg-secondary rounded-lg p-6 border border-text-primary/10">
          <p className="text-text-secondary font-body text-center py-8">
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  );
};
