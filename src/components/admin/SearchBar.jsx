import { useState, useEffect, useRef } from 'react';
import { appwriteConfig } from '../../config/appwrite';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  FolderIcon,
  Cog6ToothIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  StarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { databases } from '../../lib/appwrite';
import { Query } from 'appwrite';

const ENTITY_CONFIGS = [
  {
    type: 'serviceGroups',
    label: 'Service Groups',
    Icon: FolderIcon,
    collection: 'serviceGroups',
    searchFields: ['name', 'description'],
    getPath: (id) => `/admin/service-groups/${id}`,
    displayField: 'name'
  },
  {
    type: 'services',
    label: 'Services',
    Icon: Cog6ToothIcon,
    collection: 'services',
    searchFields: ['name', 'description'],
    getPath: (id) => `/admin/services/edit/${id}`,
    displayField: 'name'
  },
  {
    type: 'projects',
    label: 'Projects',
    Icon: BriefcaseIcon,
    collection: 'projects',
    searchFields: ['title', 'description'],
    getPath: (id) => `/admin/projects/edit/${id}`,
    displayField: 'title'
  },
  {
    type: 'caseStudies',
    label: 'Case Studies',
    Icon: DocumentTextIcon,
    collection: 'caseStudies',
    searchFields: ['title', 'description'],
    getPath: (id) => `/admin/case-studies/edit/${id}`,
    displayField: 'title'
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    Icon: StarIcon,
    collection: 'testimonials',
    searchFields: ['clientName', 'testimonial'],
    getPath: (id) => `/admin/testimonials/edit/${id}`,
    displayField: 'clientName'
  }
  // Users collection can be added later when created
  // {
  //   type: 'users',
  //   label: 'Users',
  //   Icon: UserIcon,
  //   collection: 'users',
  //   searchFields: ['name', 'email'],
  //   getPath: (id) => `/admin/users/edit/${id}`,
  //   displayField: 'name'
  // }
];

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchTerm('');
        setResults({});
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setResults({});
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Live search
  useEffect(() => {
    const searchAllEntities = async () => {
      if (searchTerm.trim().length < 2) {
        setResults({});
        return;
      }

      setLoading(true);
      const allResults = {};
      const searchLower = searchTerm.toLowerCase();

      try {
        await Promise.all(
          ENTITY_CONFIGS.map(async (config) => {
            try {
              // Fetch all documents (we'll filter client-side)
              const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                config.collection,
                [Query.limit(100)] // Adjust limit as needed
              );

              // Client-side filtering across all searchFields
              const filteredItems = response.documents.filter(doc => {
                return config.searchFields.some(field => {
                  const value = doc[field];
                  if (!value) return false;
                  return value.toLowerCase().includes(searchLower);
                });
              });

              if (filteredItems.length > 0) {
                allResults[config.type] = {
                  config,
                  items: filteredItems
                };
              }
            } catch (error) {
              console.error(`Error searching ${config.type}:`, error);
              // Continue with other entities even if one fails
            }
          })
        );

        setResults(allResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAllEntities, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Get flattened results for keyboard navigation
  const getFlatResults = () => {
    const flat = [];
    Object.values(results).forEach(({ config, items }) => {
      items.forEach(item => {
        flat.push({ config, item });
      });
    });
    return flat;
  };

  // Keyboard navigation
  const handleKeyboardNav = (e) => {
    const flatResults = getFlatResults();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
      e.preventDefault();
      const { config, item } = flatResults[selectedIndex];
      handleResultClick(config, item);
    }
  };

  const handleResultClick = (config, item) => {
    navigate(config.getPath(item.$id));
    setIsOpen(false);
    setSearchTerm('');
    setResults({});
    setSelectedIndex(0);
  };

  const getTotalResults = () => {
    return Object.values(results).reduce((sum, { items }) => sum + items.length, 0);
  };

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-2 bg-bg-secondary border border-border rounded-lg hover:border-accent transition-colors"
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-text-secondary" />
        <span className="flex-1 text-left text-text-secondary font-body">
          Search...
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-bg-primary rounded text-xs text-text-secondary font-body border border-border">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[10vh] px-4">
          <div
            ref={modalRef}
            className="w-full max-w-2xl bg-bg-secondary rounded-lg shadow-2xl border border-border overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <MagnifyingGlassIcon className="w-5 h-5 text-text-secondary" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyboardNav}
                placeholder="Search for service groups, services, projects, case studies..."
                className="flex-1 bg-transparent border-none outline-none text-text-primary font-body placeholder:text-text-secondary"
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm('');
                  setResults({});
                }}
                className="p-1 hover:bg-bg-primary rounded transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading && (
                <div className="p-8 text-center">
                  <p className="text-text-secondary font-body">Searching...</p>
                </div>
              )}

              {!loading && searchTerm.trim().length > 0 && getTotalResults() === 0 && (
                <div className="p-8 text-center">
                  <p className="text-text-secondary font-body">No results found for "{searchTerm}"</p>
                </div>
              )}

              {!loading && searchTerm.trim().length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-text-secondary font-body text-sm">
                    Start typing to search across all content...
                  </p>
                  <p className="text-text-secondary font-body text-xs mt-2">
                    Use ↑↓ to navigate, Enter to select, Esc to close
                  </p>
                </div>
              )}

              {!loading && getTotalResults() > 0 && (
                <div className="py-2">
                  {Object.entries(results).map(([type, { config, items }]) => {
                    const Icon = config.Icon;
                    let currentIndex = 0;

                    // Calculate the starting index for this group
                    const flatResults = getFlatResults();
                    const groupStartIndex = flatResults.findIndex(
                      r => r.config.type === type
                    );

                    return (
                      <div key={type} className="mb-4">
                        {/* Group Header */}
                        <div className="px-4 py-2 flex items-center gap-2">
                          <Icon className="w-4 h-4 text-accent" />
                          <h3 className="text-sm font-body font-bold text-text-primary">
                            {config.label}
                          </h3>
                          <span className="text-xs text-text-secondary font-body">
                            ({items.length})
                          </span>
                        </div>

                        {/* Results */}
                        <div>
                          {items.map((item, idx) => {
                            const itemIndex = groupStartIndex + idx;
                            const isSelected = itemIndex === selectedIndex;

                            return (
                              <button
                                key={item.$id}
                                onClick={() => handleResultClick(config, item)}
                                className={`w-full px-6 py-3 text-left transition-colors ${
                                  isSelected
                                    ? 'bg-accent/10 border-l-2 border-accent'
                                    : 'hover:bg-bg-primary border-l-2 border-transparent'
                                }`}
                              >
                                <p className="font-body font-bold text-text-primary">
                                  {item[config.displayField] || 'Untitled'}
                                </p>
                                {(item.description || item.testimonial) && (
                                  <p className="text-sm text-text-secondary font-body mt-1 line-clamp-1">
                                    {item.description || item.testimonial}
                                  </p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
