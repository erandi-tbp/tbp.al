/**
 * Block Registry - Defines all available content blocks
 *
 * Each block has:
 * - id: Unique identifier
 * - label: Display name in admin
 * - category: For grouping blocks
 * - icon: Icon component (optional)
 * - fields: Form fields for this block type
 */

export const BLOCK_CATEGORIES = {
  HERO: 'Hero Sections',
  CONTENT: 'Content',
  MEDIA: 'Media',
  FEATURES: 'Features & Lists',
  CALL_TO_ACTION: 'Call to Action',
  TESTIMONIALS: 'Testimonials',
  RELATIONSHIPS: 'Relationships'
};

export const BLOCK_TYPES = {
  // Hero Sections
  HERO_SIMPLE: {
    id: 'hero_simple',
    label: 'Simple Hero',
    category: BLOCK_CATEGORIES.HERO,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea', required: false },
      { name: 'backgroundImage', label: 'Background Image', type: 'image', required: false },
      { name: 'ctaText', label: 'CTA Button Text', type: 'text', required: false },
      { name: 'ctaLink', label: 'CTA Button Link', type: 'text', required: false }
    ]
  },

  // Content Blocks
  TEXT_CONTENT: {
    id: 'text_content',
    label: 'Text Content',
    category: BLOCK_CATEGORIES.CONTENT,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: false },
      { name: 'content', label: 'Content', type: 'richtext', required: true }
    ]
  },

  TEXT_IMAGE: {
    id: 'text_image',
    label: 'Text + Image',
    category: BLOCK_CATEGORIES.CONTENT,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: false },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'image', label: 'Image', type: 'image', required: true },
      {
        name: 'imagePosition',
        label: 'Image Position',
        type: 'select',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' }
        ],
        default: 'right'
      }
    ]
  },

  TWO_COLUMN_TEXT: {
    id: 'two_column_text',
    label: 'Two Column Text',
    category: BLOCK_CATEGORIES.CONTENT,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: false },
      { name: 'leftContent', label: 'Left Column Content', type: 'richtext', required: true },
      { name: 'rightContent', label: 'Right Column Content', type: 'richtext', required: true }
    ]
  },

  // Media Blocks
  GALLERY: {
    id: 'gallery',
    label: 'Image Gallery',
    category: BLOCK_CATEGORIES.MEDIA,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: false },
      { name: 'images', label: 'Images', type: 'gallery', required: true },
      {
        name: 'columns',
        label: 'Columns',
        type: 'select',
        options: [
          { value: '2', label: '2 Columns' },
          { value: '3', label: '3 Columns' },
          { value: '4', label: '4 Columns' }
        ],
        default: '3'
      }
    ]
  },

  VIDEO: {
    id: 'video',
    label: 'Video',
    category: BLOCK_CATEGORIES.MEDIA,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: false },
      { name: 'videoUrl', label: 'Video URL (YouTube/Vimeo)', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false }
    ]
  },

  // Features & Lists
  FEATURES_GRID: {
    id: 'features_grid',
    label: 'Features Grid',
    category: BLOCK_CATEGORIES.FEATURES,
    fields: [
      { name: 'title', label: 'Section Title', type: 'text', required: false },
      { name: 'subtitle', label: 'Section Subtitle', type: 'textarea', required: false },
      {
        name: 'features',
        label: 'Features',
        type: 'repeater',
        required: true,
        fields: [
          { name: 'icon', label: 'Icon (optional)', type: 'text' },
          { name: 'title', label: 'Feature Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', required: true }
        ]
      },
      {
        name: 'columns',
        label: 'Columns',
        type: 'select',
        options: [
          { value: '2', label: '2 Columns' },
          { value: '3', label: '3 Columns' },
          { value: '4', label: '4 Columns' }
        ],
        default: '3'
      }
    ]
  },

  ICON_LIST: {
    id: 'icon_list',
    label: 'Icon List',
    category: BLOCK_CATEGORIES.FEATURES,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: false },
      {
        name: 'items',
        label: 'List Items',
        type: 'repeater',
        required: true,
        fields: [
          { name: 'text', label: 'Text', type: 'text', required: true }
        ]
      }
    ]
  },

  STATS: {
    id: 'stats',
    label: 'Statistics',
    category: BLOCK_CATEGORIES.FEATURES,
    fields: [
      { name: 'title', label: 'Section Title', type: 'text', required: false },
      {
        name: 'stats',
        label: 'Statistics',
        type: 'repeater',
        required: true,
        fields: [
          { name: 'number', label: 'Number', type: 'text', required: true },
          { name: 'label', label: 'Label', type: 'text', required: true },
          { name: 'suffix', label: 'Suffix (e.g., +, %, K)', type: 'text' }
        ]
      }
    ]
  },

  // Call to Action
  CTA_SIMPLE: {
    id: 'cta_simple',
    label: 'Simple CTA',
    category: BLOCK_CATEGORIES.CALL_TO_ACTION,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'buttonText', label: 'Button Text', type: 'text', required: true },
      { name: 'buttonLink', label: 'Button Link', type: 'text', required: true }
    ]
  },

  CTA_BOXED: {
    id: 'cta_boxed',
    label: 'Boxed CTA',
    category: BLOCK_CATEGORIES.CALL_TO_ACTION,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: false },
      { name: 'buttonText', label: 'Button Text', type: 'text', required: true },
      { name: 'buttonLink', label: 'Button Link', type: 'text', required: true },
      { name: 'backgroundColor', label: 'Background Color', type: 'select', options: [
        { value: 'accent', label: 'Accent' },
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' }
      ], default: 'accent' }
    ]
  },

  // Testimonials
  TESTIMONIALS_SLIDER: {
    id: 'testimonials_slider',
    label: 'Testimonials Slider',
    category: BLOCK_CATEGORIES.TESTIMONIALS,
    fields: [
      { name: 'title', label: 'Section Title', type: 'text', required: false },
      {
        name: 'showRelated',
        label: 'Show Related Testimonials',
        type: 'toggle',
        description: 'Automatically show testimonials related to this entity',
        default: true
      }
    ]
  },

  // Relationship Blocks
  LOOP_GRID: {
    id: 'loop_grid',
    label: 'Loop Grid',
    category: BLOCK_CATEGORIES.RELATIONSHIPS,
    fields: [
      { name: 'title', label: 'Section Title', type: 'text', required: false },
      {
        name: 'entityType',
        label: 'Entity Type',
        type: 'select',
        required: true,
        options: [
          { value: 'services', label: 'Services' },
          { value: 'projects', label: 'Projects' },
          { value: 'caseStudies', label: 'Case Studies' }
        ]
      },
      {
        name: 'filterBy',
        label: 'Filter By',
        type: 'select',
        required: false,
        options: [
          { value: 'all', label: 'Show All' },
          { value: 'current_service_group', label: 'Current Service Group' },
          { value: 'specific_service_group', label: 'Specific Service Group' }
        ],
        default: 'all'
      },
      { name: 'serviceGroupId', label: 'Specific Service Group ID', type: 'text', required: false },
      { name: 'limit', label: 'Items Limit', type: 'text', required: false, default: '6' },
      { name: 'columnsDesktop', label: 'Columns (Desktop)', type: 'text', required: false, default: '3' },
      { name: 'columnsTablet', label: 'Columns (Tablet)', type: 'text', required: false, default: '2' },
      { name: 'columnsMobile', label: 'Columns (Mobile)', type: 'text', required: false, default: '1' },
      { name: 'rows', label: 'Rows', type: 'text', required: false, default: '2' }
    ]
  },

  LOOP_CAROUSEL: {
    id: 'loop_carousel',
    label: 'Loop Carousel',
    category: BLOCK_CATEGORIES.RELATIONSHIPS,
    fields: [
      { name: 'title', label: 'Section Title', type: 'text', required: false },
      {
        name: 'entityType',
        label: 'Entity Type',
        type: 'select',
        required: true,
        options: [
          { value: 'services', label: 'Services' },
          { value: 'projects', label: 'Projects' },
          { value: 'caseStudies', label: 'Case Studies' }
        ]
      },
      {
        name: 'filterBy',
        label: 'Filter By',
        type: 'select',
        required: false,
        options: [
          { value: 'all', label: 'Show All' },
          { value: 'current_service_group', label: 'Current Service Group' },
          { value: 'specific_service_group', label: 'Specific Service Group' }
        ],
        default: 'all'
      },
      { name: 'serviceGroupId', label: 'Specific Service Group ID', type: 'text', required: false },
      { name: 'limit', label: 'Items Limit', type: 'text', required: false, default: '10' },
      { name: 'slidesPerViewDesktop', label: 'Slides Per View (Desktop)', type: 'text', required: false, default: '3' },
      { name: 'slidesPerViewTablet', label: 'Slides Per View (Tablet)', type: 'text', required: false, default: '2' },
      { name: 'slidesPerViewMobile', label: 'Slides Per View (Mobile)', type: 'text', required: false, default: '1' },
      { name: 'autoplay', label: 'Autoplay', type: 'toggle', required: false, default: false },
      { name: 'loop', label: 'Loop', type: 'toggle', required: false, default: true }
    ]
  }
};

/**
 * Get blocks grouped by category
 */
export const getBlocksByCategory = () => {
  const grouped = {};

  Object.values(BLOCK_TYPES).forEach(block => {
    if (!grouped[block.category]) {
      grouped[block.category] = [];
    }
    grouped[block.category].push(block);
  });

  return grouped;
};

/**
 * Get block definition by ID
 */
export const getBlockById = (blockId) => {
  return Object.values(BLOCK_TYPES).find(block => block.id === blockId);
};
