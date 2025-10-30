import { usePageTitle } from '../../../hooks/usePageTitle';
import { SettingsCard } from '../../../components/admin/SettingsCard';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export const SettingsPage = () => {
  usePageTitle('Settings');

  const settingsCategories = [
    {
      title: 'General Settings',
      description: 'Manage website branding, contact information, and basic configuration',
      icon: Cog6ToothIcon,
      path: '/admin/settings/general'
    }
    // Future settings categories can be added here:
    // {
    //   title: 'Security & Privacy',
    //   description: 'Configure authentication, permissions, and privacy settings',
    //   icon: ShieldCheckIcon,
    //   path: '/admin/settings/security'
    // },
    // {
    //   title: 'Notifications',
    //   description: 'Set up email notifications and alerts',
    //   icon: BellIcon,
    //   path: '/admin/settings/notifications'
    // },
    // {
    //   title: 'Integrations',
    //   description: 'Connect third-party services and APIs',
    //   icon: GlobeAltIcon,
    //   path: '/admin/settings/integrations'
    // }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Settings
        </h1>
        <p className="text-text-secondary font-body">
          Configure your website settings and preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category) => (
          <SettingsCard
            key={category.path}
            title={category.title}
            description={category.description}
            icon={category.icon}
            path={category.path}
          />
        ))}
      </div>
    </div>
  );
};
