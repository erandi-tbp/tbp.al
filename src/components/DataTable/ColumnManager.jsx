import { useState } from 'react';
import {
  AdjustmentsHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

/**
 * ColumnManager Component - Manage column visibility and pinning
 *
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions
 * @param {Function} props.onChange - Callback when columns change
 */
export const ColumnManager = ({ columns = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleVisibility = (columnKey) => {
    const updated = columns.map(col =>
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    );
    onChange(updated);
  };

  const handlePin = (columnKey, position) => {
    const updated = columns.map(col => {
      if (col.key === columnKey) {
        return { ...col, pinned: col.pinned === position ? null : position };
      }
      return col;
    });
    onChange(updated);
  };

  const visibleCount = columns.filter(col => col.visible).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary font-body font-medium hover:bg-bg-primary transition-colors"
        title="Manage Columns"
      >
        <AdjustmentsHorizontalIcon className="w-5 h-5" />
        Columns
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-full mt-2 right-0 bg-bg-secondary border border-border rounded-lg shadow-xl overflow-hidden z-20 w-80">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-body font-semibold text-text-primary">
                Manage Columns
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-text-secondary hover:text-accent transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Column List */}
            <div className="max-h-96 overflow-y-auto">
              {columns.map(col => (
                <div
                  key={col.key}
                  className="p-3 border-b border-border hover:bg-bg-primary transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleVisibility(col.key)}
                        className={`p-1 rounded transition-colors ${
                          col.visible
                            ? 'text-accent hover:text-accent/80'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                        title={col.visible ? 'Hide column' : 'Show column'}
                      >
                        {col.visible ? (
                          <EyeIcon className="w-5 h-5" />
                        ) : (
                          <EyeSlashIcon className="w-5 h-5" />
                        )}
                      </button>
                      <span className={`font-body text-sm ${
                        col.visible ? 'text-text-primary font-medium' : 'text-text-secondary'
                      }`}>
                        {col.label}
                      </span>
                    </div>

                    {col.visible && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePin(col.key, 'left')}
                          className={`p-1 rounded transition-colors ${
                            col.pinned === 'left'
                              ? 'bg-accent/10 text-accent'
                              : 'text-text-secondary hover:text-accent'
                          }`}
                          title="Pin to left"
                        >
                          <ArrowLeftIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePin(col.key, 'right')}
                          className={`p-1 rounded transition-colors ${
                            col.pinned === 'right'
                              ? 'bg-accent/10 text-accent'
                              : 'text-text-secondary hover:text-accent'
                          }`}
                          title="Pin to right"
                        >
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {col.pinned && (
                    <span className="text-xs text-accent font-body">
                      Pinned to {col.pinned}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 bg-bg-primary border-t border-border">
              <p className="text-xs text-text-secondary font-body">
                {visibleCount} of {columns.length} columns visible
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
