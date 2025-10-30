import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { appwriteConfig } from '../../../config/appwrite';

/**
 * LoopGridBlock - Renders a grid of related content (services, projects, case studies)
 * with responsive column configuration and filtering by service group
 */
export const LoopGridBlock = ({ data, context = {} }) => {
  const {
    title,
    entityType = 'services',
    filterBy = 'all',
    serviceGroupId,
    limit = '6',
    columnsDesktop = '3',
    columnsTablet = '2',
    columnsMobile = '1',
    rows = '2'
  } = data;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [entityType, filterBy, serviceGroupId, limit]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const queries = [Query.limit(parseInt(limit))];

      // Apply filtering
      if (filterBy === 'current_service_group' && context.serviceGroupId) {
        queries.push(Query.equal('serviceGroupId', context.serviceGroupId));
      } else if (filterBy === 'specific_service_group' && serviceGroupId) {
        queries.push(Query.equal('serviceGroupId', serviceGroupId));
      }

      // Add active/published filter
      if (entityType === 'services') {
        queries.push(Query.equal('isActive', true));
      } else {
        queries.push(Query.equal('isPublished', true));
      }

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        entityType,
        queries
      );

      setItems(response.documents);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntityUrl = (item) => {
    const slug = item.slug || item.$id;
    switch (entityType) {
      case 'services':
        return `/services/${slug}`;
      case 'projects':
        return `/projects/${slug}`;
      case 'caseStudies':
        return `/case-studies/${slug}`;
      default:
        return '#';
    }
  };

  const getImageUrl = (item) => {
    const imageId = item.featuredImage;
    if (!imageId) return null;
    return `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketSettings}/files/${imageId}/view?project=${appwriteConfig.projectId}`;
  };

  const gridCols = {
    mobile: `grid-cols-${columnsMobile}`,
    tablet: `md:grid-cols-${columnsTablet}`,
    desktop: `lg:grid-cols-${columnsDesktop}`
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-bg-primary">
        <div className="container mx-auto px-4">
          {title && (
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-12 text-center">
              {title}
            </h2>
          )}
          <div className={`grid ${gridCols.mobile} ${gridCols.tablet} ${gridCols.desktop} gap-6`}>
            {Array.from({ length: parseInt(limit) }).map((_, idx) => (
              <div key={idx} className="bg-bg-secondary border border-border rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-border"></div>
                <div className="p-6">
                  <div className="bg-border h-6 w-3/4 mb-3 rounded"></div>
                  <div className="bg-border h-4 w-full mb-2 rounded"></div>
                  <div className="bg-border h-4 w-2/3 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-12 text-center">
            {title}
          </h2>
        )}

        <div className={`grid ${gridCols.mobile} ${gridCols.tablet} ${gridCols.desktop} gap-6`}>
          {items.map((item) => {
            const imageUrl = getImageUrl(item);
            const itemTitle = item.title || item.name;
            const itemExcerpt = item.excerpt || '';

            return (
              <Link
                key={item.$id}
                to={getEntityUrl(item)}
                className="bg-bg-secondary border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={itemTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-heading font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                    {itemTitle}
                  </h3>

                  {itemExcerpt && (
                    <p className="text-text-secondary font-body line-clamp-3">
                      {itemExcerpt}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
