import { usePageTitle } from '../../hooks/usePageTitle';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

export const SettingsPage = () => {
  usePageTitle('Settings');

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-bg-secondary mb-6">
          <WrenchScrewdriverIcon className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-3">
          Settings
        </h1>
        <p className="text-text-secondary font-body text-lg mb-2">
          Coming Soon
        </p>
        <p className="text-text-secondary font-body text-sm max-w-md mx-auto">
          Settings page for managing site configuration, preferences, and integrations will be available here.
        </p>
      </div>
    </div>
  );
};
