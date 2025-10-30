import { useState } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * BulkActions Component - Dropdown menu for bulk actions
 *
 * @param {Object} props
 * @param {Number} props.selectedCount - Number of selected rows
 * @param {Array} props.actions - Array of action objects: [{ label, onClick, icon?, variant? }]
 * @param {Array} props.selectedRows - Array of selected row IDs
 * @param {Function} props.onClearSelection - Callback to clear selection
 */
export const BulkActions = ({
  selectedCount,
  actions = [],
  selectedRows = [],
  onClearSelection
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action) => {
    action.onClick(selectedRows);
    setIsOpen(false);
  };

  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <p className="text-text-primary font-body font-medium">
          {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
        </p>

        {actions.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white font-body font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Bulk Actions
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {isOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />

                {/* Dropdown Menu */}
                <div className="absolute top-full mt-2 left-0 bg-bg-secondary border border-border rounded-lg shadow-xl overflow-hidden z-20 min-w-[200px]">
                  {actions.map((action, index) => {
                    const Icon = action.icon;
                    const variant = action.variant || 'default';

                    return (
                      <button
                        key={index}
                        onClick={() => handleAction(action)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left font-body transition-colors ${
                          variant === 'danger'
                            ? 'text-red-500 hover:bg-red-500/10'
                            : 'text-text-primary hover:bg-bg-primary'
                        }`}
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onClearSelection}
        className="p-2 text-text-secondary hover:text-accent transition-colors"
        title="Clear selection"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
