import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getBlocksByCategory } from '../../blocks/blockRegistry';

/**
 * BlockTypeSelector - Dropdown to select and add a new block
 */
export const BlockTypeSelector = ({ onSelectBlock }) => {
  const [isOpen, setIsOpen] = useState(false);
  const blocksByCategory = getBlocksByCategory();

  const handleSelectBlock = (blockType) => {
    onSelectBlock(blockType);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-accent text-white font-body font-bold rounded-lg hover:bg-accent/90 transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        Add Content Block
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute left-0 mt-2 w-80 bg-bg-secondary border border-border rounded-lg shadow-xl overflow-hidden z-20 max-h-96 overflow-y-auto">
            {Object.entries(blocksByCategory).map(([category, blocks]) => (
              <div key={category} className="border-b border-border last:border-b-0">
                {/* Category Header */}
                <div className="px-4 py-2 bg-bg-primary">
                  <h4 className="text-xs font-body font-bold text-text-secondary uppercase tracking-wider">
                    {category}
                  </h4>
                </div>

                {/* Block Options */}
                <div className="py-1">
                  {blocks.map(block => (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => handleSelectBlock(block)}
                      className="w-full px-4 py-3 text-left hover:bg-bg-primary transition-colors"
                    >
                      <div className="font-body font-medium text-text-primary">
                        {block.label}
                      </div>
                      <div className="text-xs text-text-secondary font-body mt-1">
                        {block.fields.length} field{block.fields.length !== 1 ? 's' : ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
