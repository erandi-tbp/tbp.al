// Service Groups Configuration
export const SERVICE_GROUPS = [
  {
    id: 1,
    name: 'Website Design',
    slug: 'website-design',
    description: 'Creative and user-focused web design solutions',
    caseStudyTemplate: 'website-design'
  },
  {
    id: 2,
    name: 'Website Development',
    slug: 'website-development',
    description: 'Custom web development with modern technologies',
    caseStudyTemplate: 'website-development'
  },
  {
    id: 3,
    name: 'Branding & Identity',
    slug: 'branding-identity',
    description: 'Building memorable brand identities',
    caseStudyTemplate: 'branding'
  },
  {
    id: 4,
    name: 'Graphic Design',
    slug: 'graphic-design',
    description: 'Professional graphic design services',
    caseStudyTemplate: 'graphic-design'
  },
  {
    id: 5,
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Strategic digital marketing and advertising',
    caseStudyTemplate: 'digital-marketing'
  },
  {
    id: 6,
    name: 'Managed IT Service',
    slug: 'managed-it-service',
    description: 'Comprehensive IT management solutions',
    caseStudyTemplate: 'managed-it'
  }
];

// Case Study Templates Configuration
export const CASE_STUDY_TEMPLATES = {
  'website-design': {
    name: 'Website Design',
    fields: [
      { key: 'wireframes', label: 'Wireframes', type: 'images' },
      { key: 'mockups', label: 'Mockups', type: 'images' },
      { key: 'colorScheme', label: 'Color Scheme', type: 'text' },
      { key: 'typography', label: 'Typography', type: 'text' }
    ]
  },
  'website-development': {
    name: 'Website Development',
    fields: [
      { key: 'techStack', label: 'Technology Stack', type: 'array' },
      { key: 'features', label: 'Key Features', type: 'array' },
      { key: 'performance', label: 'Performance Metrics', type: 'text' },
      { key: 'repository', label: 'Repository Link', type: 'url' }
    ]
  },
  'branding': {
    name: 'Branding & Identity',
    fields: [
      { key: 'logoVariations', label: 'Logo Variations', type: 'images' },
      { key: 'brandGuidelines', label: 'Brand Guidelines', type: 'file' },
      { key: 'colorPalette', label: 'Color Palette', type: 'text' },
      { key: 'applications', label: 'Brand Applications', type: 'images' }
    ]
  },
  'graphic-design': {
    name: 'Graphic Design',
    fields: [
      { key: 'designType', label: 'Design Type', type: 'text' },
      { key: 'software', label: 'Software Used', type: 'array' },
      { key: 'finalDeliverables', label: 'Final Deliverables', type: 'images' },
      { key: 'process', label: 'Design Process', type: 'richtext' }
    ]
  },
  'digital-marketing': {
    name: 'Digital Marketing',
    fields: [
      { key: 'platforms', label: 'Advertising Platforms', type: 'array' },
      { key: 'metrics', label: 'Key Metrics', type: 'json' },
      { key: 'reach', label: 'Total Reach', type: 'number' },
      { key: 'conversions', label: 'Conversions', type: 'number' },
      { key: 'roi', label: 'ROI', type: 'text' }
    ]
  },
  'managed-it': {
    name: 'Managed IT Service',
    fields: [
      { key: 'infrastructure', label: 'Infrastructure', type: 'text' },
      { key: 'issues', label: 'Issues Resolved', type: 'array' },
      { key: 'solutions', label: 'Solutions Implemented', type: 'richtext' },
      { key: 'uptime', label: 'Uptime Percentage', type: 'number' }
    ]
  }
};

// Appwrite Collection IDs (to be filled after creation)
export const COLLECTION_IDS = {
  SERVICE_GROUPS: 'serviceGroups',
  SERVICES: 'services',
  PROJECTS: 'projects',
  CASE_STUDIES: 'caseStudies',
  TESTIMONIALS: 'testimonials',
  RATINGS: 'ratings'
};

// Database ID
export const DATABASE_ID = 'tbp-agency';
