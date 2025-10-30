import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export const SettingsCard = ({ title, description, icon: Icon, path }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group relative bg-bg-secondary border border-border rounded-lg p-6 hover:border-accent transition-all hover:shadow-lg text-left"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-heading font-bold text-text-primary">
              {title}
            </h3>
          </div>
          <p className="text-sm font-body text-text-secondary">
            {description}
          </p>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors flex-shrink-0 mt-3" />
      </div>
    </button>
  );
};
