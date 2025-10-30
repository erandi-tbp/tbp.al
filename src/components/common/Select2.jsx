import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/outline';

/**
 * Select2 Component - Advanced select with search, single/multi-select support
 *
 * @param {Object} props
 * @param {Array} props.options - Array of options: [{ value, label, disabled? }]
 * @param {String|Array} props.value - Selected value(s). String for single, Array for multi
 * @param {Function} props.onChange - Change handler. Receives (value) for single, (values) for multi
 * @param {Boolean} props.multiple - Enable multi-select mode
 * @param {String} props.placeholder - Placeholder text
 * @param {Boolean} props.searchable - Enable search functionality
 * @param {Boolean} props.disabled - Disable the select
 * @param {Boolean} props.clearable - Show clear button (single-select only)
 * @param {String} props.emptyMessage - Message when no options match search
 * @param {String} props.className - Additional classes for container
 */
export const Select2 = ({
  options = [],
  value,
  onChange,
  multiple = false,
  placeholder = 'Select...',
  searchable = true,
  disabled = false,
  clearable = true,
  emptyMessage = 'No options found',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize value to always work with arrays internally
  const selectedValues = multiple
    ? (Array.isArray(value) ? value : [])
    : (value ? [value] : []);

  // Filter options based on search term
  const filteredOptions = searchTerm
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get display label for selected values
  const getDisplayLabel = () => {
    if (selectedValues.length === 0) return placeholder;

    if (multiple) {
      if (selectedValues.length === 1) {
        const selected = options.find(opt => opt.value === selectedValues[0]);
        return selected?.label || placeholder;
      }
      return `${selectedValues.length} selected`;
    }

    const selected = options.find(opt => opt.value === selectedValues[0]);
    return selected?.label || placeholder;
  };

  // Handle option selection
  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    onChange(multiple ? [] : '');
  };

  // Handle remove single item in multi-select
  const handleRemoveItem = (e, optionValue) => {
    e.stopPropagation();
    if (multiple) {
      onChange(selectedValues.filter(v => v !== optionValue));
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Check if option is selected
  const isSelected = (optionValue) => selectedValues.includes(optionValue);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-left flex items-center justify-between gap-2 font-body transition-colors ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-accent focus:outline-none focus:border-accent cursor-pointer'
        }`}
      >
        {/* Display selected values */}
        <div className="flex-1 flex items-center gap-2 overflow-hidden">
          {multiple && selectedValues.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedValues.slice(0, 3).map(val => {
                const opt = options.find(o => o.value === val);
                return opt ? (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/20 text-accent rounded text-sm"
                  >
                    <span className="max-w-[100px] truncate">{opt.label}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveItem(e, val)}
                      className="hover:text-accent-dark"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ) : null;
              })}
              {selectedValues.length > 3 && (
                <span className="text-sm text-text-secondary">
                  +{selectedValues.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <span className={selectedValues.length === 0 ? 'text-text-secondary' : 'text-text-primary'}>
              {getDisplayLabel()}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {clearable && selectedValues.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-bg-secondary rounded transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-text-secondary" />
            </button>
          )}
          <ChevronDownIcon
            className={`w-4 h-4 text-text-secondary transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-bg-secondary border border-border rounded-lg shadow-lg max-h-64 flex flex-col">
          {/* Search */}
          {searchable && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-bg-primary border border-border rounded text-text-primary placeholder:text-text-secondary font-body text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-text-secondary font-body text-sm">
                {emptyMessage}
              </div>
            ) : (
              <ul>
                {filteredOptions.map((option) => {
                  const selected = isSelected(option.value);

                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        disabled={option.disabled}
                        className={`w-full px-4 py-2 text-left font-body text-sm flex items-center justify-between gap-2 transition-colors ${
                          option.disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : selected
                              ? 'bg-accent/10 text-accent font-bold'
                              : 'hover:bg-bg-primary text-text-primary'
                        }`}
                      >
                        <span className="flex-1">{option.label}</span>
                        {selected && (
                          <CheckIcon className="w-4 h-4 text-accent" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
