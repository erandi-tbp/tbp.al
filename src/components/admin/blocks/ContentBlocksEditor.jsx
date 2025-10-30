import { BlockTypeSelector } from './BlockTypeSelector';
import { BlockItem } from './BlockItem';

/**
 * ContentBlocksEditor - Main reusable component for editing content blocks
 *
 * Usage:
 * <ContentBlocksEditor
 *   blocks={contentBlocks}
 *   onChange={(updatedBlocks) => setContentBlocks(updatedBlocks)}
 * />
 */
export const ContentBlocksEditor = ({ blocks = [], onChange }) => {

  const handleAddBlock = (blockType) => {
    const newBlock = {
      id: Date.now() + Math.random(), // Temporary ID
      type: blockType.id,
      order: blocks.length,
      data: {}
    };

    // Initialize with default values
    blockType.fields.forEach(field => {
      if (field.default !== undefined) {
        newBlock.data[field.name] = field.default;
      } else if (field.type === 'repeater') {
        newBlock.data[field.name] = [];
      } else if (field.type === 'toggle') {
        newBlock.data[field.name] = false;
      } else {
        newBlock.data[field.name] = '';
      }
    });

    onChange([...blocks, newBlock]);
  };

  const handleBlockChange = (index, updatedBlock) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = updatedBlock;
    onChange(updatedBlocks);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;

    const updatedBlocks = [...blocks];
    [updatedBlocks[index - 1], updatedBlocks[index]] = [updatedBlocks[index], updatedBlocks[index - 1]];

    // Update order values
    updatedBlocks.forEach((block, i) => {
      block.order = i;
    });

    onChange(updatedBlocks);
  };

  const handleMoveDown = (index) => {
    if (index === blocks.length - 1) return;

    const updatedBlocks = [...blocks];
    [updatedBlocks[index], updatedBlocks[index + 1]] = [updatedBlocks[index + 1], updatedBlocks[index]];

    // Update order values
    updatedBlocks.forEach((block, i) => {
      block.order = i;
    });

    onChange(updatedBlocks);
  };

  const handleDelete = (index) => {
    if (!confirm('Are you sure you want to delete this block?')) return;

    const updatedBlocks = blocks.filter((_, i) => i !== index);

    // Update order values
    updatedBlocks.forEach((block, i) => {
      block.order = i;
    });

    onChange(updatedBlocks);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-bold text-text-primary">
            Content Blocks
          </h3>
          <p className="text-sm text-text-secondary font-body mt-1">
            Build your page content using flexible blocks
          </p>
        </div>
        <BlockTypeSelector onSelectBlock={handleAddBlock} />
      </div>

      {/* Blocks List */}
      {blocks.length === 0 ? (
        <div className="bg-bg-secondary border-2 border-dashed border-border rounded-lg p-12 text-center">
          <p className="text-text-secondary font-body mb-4">
            No content blocks yet. Click "Add Content Block" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <BlockItem
              key={block.id || index}
              block={block}
              index={index}
              totalBlocks={blocks.length}
              onChange={(updatedBlock) => handleBlockChange(index, updatedBlock)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      )}

      {/* Add Block Button (bottom) */}
      {blocks.length > 0 && (
        <div className="pt-4">
          <BlockTypeSelector onSelectBlock={handleAddBlock} />
        </div>
      )}
    </div>
  );
};
