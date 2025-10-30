import { useState, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * TagInput Component - Input field that creates tags on comma
 *
 * @param {Object} props
 * @param {Array<string>} props.tags - Current tags
 * @param {Function} props.onChange - Callback when tags change
 * @param {string} props.placeholder - Input placeholder
 * @param {number} props.maxTags - Maximum number of tags
 * @param {string} props.className - Additional CSS classes
 */
export const TagInput = ({
  tags = [],
  onChange,
  placeholder = 'Type and press comma to add tags...',
  maxTags = 20,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Check if comma is pressed
    if (value.includes(',')) {
      const newTags = value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0 && !tags.includes(tag));

      if (newTags.length > 0 && tags.length + newTags.length <= maxTags) {
        onChange([...tags, ...newTags]);
        setInputValue('');
      } else {
        // Remove the comma but keep the text
        setInputValue(value.replace(',', ''));
      }
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e) => {
    // Handle backspace on empty input to remove last tag
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }

    // Handle Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim() && tags.length < maxTags) {
        const newTag = inputValue.trim();
        if (!tags.includes(newTag)) {
          onChange([...tags, newTag]);
          setInputValue('');
        }
      }
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={className}>
      <div
        onClick={handleContainerClick}
        className="min-h-[42px] px-3 py-2 bg-bg-primary border border-border rounded-lg cursor-text hover:border-accent transition-colors focus-within:border-accent"
      >
        <div className="flex flex-wrap gap-2">
          {/* Tags */}
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded border border-accent/20 font-body text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                title="Remove tag"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary font-body text-sm"
            disabled={tags.length >= maxTags}
          />
        </div>
      </div>

      {/* Helper text */}
      <div className="mt-1 flex items-center justify-between">
        <p className="text-xs text-text-secondary font-body">
          Press comma or Enter to add tags • Backspace to remove
        </p>
        {maxTags && (
          <p className="text-xs text-text-secondary font-body">
            {tags.length}/{maxTags} tags
          </p>
        )}
      </div>
    </div>
  );
};
