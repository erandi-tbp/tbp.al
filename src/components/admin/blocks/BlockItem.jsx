import { useState } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon as ExpandIcon,
  PlusIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getBlockById } from '../../blocks/blockRegistry';
import { MediaPicker } from '../../common/MediaPicker';
import { appwriteConfig } from '../../../config/appwrite';

/**
 * BlockItem - Renders a single content block with its form fields
 */
export const BlockItem = ({ block, index, totalBlocks, onChange, onMoveUp, onMoveDown, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(null); // Stores field name when picker is open
  const blockDef = getBlockById(block.type);

  const bucketId = appwriteConfig.bucketSettings;

  if (!blockDef) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 font-body">Unknown block type: {block.type}</p>
      </div>
    );
  }

  const handleFieldChange = (fieldName, value) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        [fieldName]: value
      }
    });
  };

  const handleRepeaterAdd = (fieldName) => {
    const currentValue = block.data[fieldName] || [];
    const field = blockDef.fields.find(f => f.name === fieldName);

    // Create empty item with default values
    const newItem = {};
    field.fields.forEach(subField => {
      newItem[subField.name] = '';
    });

    handleFieldChange(fieldName, [...currentValue, newItem]);
  };

  const handleRepeaterRemove = (fieldName, itemIndex) => {
    const currentValue = block.data[fieldName] || [];
    handleFieldChange(fieldName, currentValue.filter((_, i) => i !== itemIndex));
  };

  const handleRepeaterChange = (fieldName, itemIndex, subFieldName, value) => {
    const currentValue = [...(block.data[fieldName] || [])];
    currentValue[itemIndex] = {
      ...currentValue[itemIndex],
      [subFieldName]: value
    };
    handleFieldChange(fieldName, currentValue);
  };

  const renderField = (field) => {
    const value = block.data[field.name] || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            required={field.required}
            className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            required={field.required}
            rows={4}
            className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent resize-none"
          />
        );

      case 'richtext':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label + ' (Rich text editor - placeholder for now)'}
            required={field.required}
            rows={8}
            className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent resize-none font-mono text-sm"
          />
        );

      case 'select':
        return (
          <select
            value={value || field.default}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'toggle':
        return (
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value === true || value === 'true'}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-accent after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
            {field.description && (
              <p className="text-sm text-text-secondary font-body mt-1">{field.description}</p>
            )}
          </div>
        );

      case 'image':
        return (
          <div>
            {value ? (
              <div className="relative mb-2">
                <img
                  src={`${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${value}/view?project=${appwriteConfig.projectId}`}
                  alt="Selected"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => handleFieldChange(field.name, '')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setMediaPickerOpen(field.name)}
                className="flex flex-col items-center justify-center w-full h-48 border border-border border-dashed rounded-lg bg-bg-primary hover:bg-bg-secondary hover:border-accent transition-colors"
              >
                <PhotoIcon className="w-10 h-10 text-text-secondary mb-2" />
                <p className="text-sm text-text-secondary font-body font-medium">
                  Select from Media Library
                </p>
              </button>
            )}
          </div>
        );

      case 'gallery':
        const galleryImages = value ? value.split(',').filter(id => id.trim()) : [];
        return (
          <div>
            {/* Display selected images */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {galleryImages.map((imageId, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={`${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${imageId.trim()}/view?project=${appwriteConfig.projectId}`}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedImages = galleryImages.filter((_, i) => i !== idx);
                        handleFieldChange(field.name, updatedImages.join(','));
                      }}
                      className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add image button */}
            <button
              type="button"
              onClick={() => setMediaPickerOpen(field.name)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border border-dashed rounded-lg bg-bg-primary hover:bg-bg-secondary hover:border-accent transition-colors"
            >
              <PhotoIcon className="w-5 h-5 text-text-secondary" />
              <span className="text-sm text-text-secondary font-body font-medium">
                {galleryImages.length > 0 ? 'Add More Images' : 'Add Images'}
              </span>
            </button>
          </div>
        );

      case 'repeater':
        const repeaterValue = block.data[field.name] || [];
        return (
          <div className="space-y-3">
            {repeaterValue.map((item, itemIndex) => (
              <div key={itemIndex} className="bg-bg-primary border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-body font-bold text-text-primary">
                    Item {itemIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRepeaterRemove(field.name, itemIndex)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {field.fields.map(subField => (
                    <div key={subField.name}>
                      <label className="block text-sm font-body font-medium text-text-primary mb-1">
                        {subField.label}
                        {subField.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {subField.type === 'text' && (
                        <input
                          type="text"
                          value={item[subField.name] || ''}
                          onChange={(e) => handleRepeaterChange(field.name, itemIndex, subField.name, e.target.value)}
                          placeholder={subField.label}
                          required={subField.required}
                          className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary font-body text-sm focus:outline-none focus:border-accent"
                        />
                      )}
                      {subField.type === 'textarea' && (
                        <textarea
                          value={item[subField.name] || ''}
                          onChange={(e) => handleRepeaterChange(field.name, itemIndex, subField.name, e.target.value)}
                          placeholder={subField.label}
                          required={subField.required}
                          rows={3}
                          className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary font-body text-sm focus:outline-none focus:border-accent resize-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleRepeaterAdd(field.name)}
              className="flex items-center gap-2 px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body hover:border-accent transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add {field.label} Item
            </button>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            className="w-full px-4 py-2 bg-bg-primary border border-border rounded-lg text-text-primary font-body focus:outline-none focus:border-accent"
          />
        );
    }
  };

  const handleMediaSelect = (fileId) => {
    const fieldName = mediaPickerOpen;
    const fieldDef = blockDef.fields.find(f => f.name === fieldName);

    if (fieldDef.type === 'gallery') {
      // For gallery, append to existing images
      const currentImages = block.data[fieldName] ? block.data[fieldName].split(',').filter(id => id.trim()) : [];
      handleFieldChange(fieldName, [...currentImages, fileId].join(','));
    } else {
      // For single image, replace
      handleFieldChange(fieldName, fileId);
    }

    setMediaPickerOpen(null);
  };

  return (
    <>
      <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-primary border-b border-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            {isExpanded ? (
              <ExpandIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
          <span className="font-body font-bold text-text-primary">
            {blockDef.label}
          </span>
          <span className="text-xs text-text-secondary font-body">
            ({blockDef.category})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Move Up */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1 text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Move up"
          >
            <ChevronUpIcon className="w-5 h-5" />
          </button>

          {/* Move Down */}
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalBlocks - 1}
            className="p-1 text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Move down"
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1 text-red-500 hover:text-red-600 transition-colors"
            title="Delete block"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {blockDef.fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-body font-bold text-text-primary mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      )}
    </div>

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen !== null}
        onClose={() => setMediaPickerOpen(null)}
        onSelect={handleMediaSelect}
        accept="image/*"
        selectedFileId={mediaPickerOpen ? block.data[mediaPickerOpen] : null}
      />
    </>
  );
};
