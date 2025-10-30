import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { appwriteConfig } from '../../../config/appwrite';

/**
 * LoopCarouselBlock - Renders a carousel of related content (services, projects, case studies)
 * with responsive slides configuration and filtering by service group
 */
export const LoopCarouselBlock = ({ data, context = {} }) => {
  const {
    title,
    entityType = 'services',
    filterBy = 'all',
    serviceGroupId,
    limit = '10',
    slidesPerViewDesktop = '3',
    slidesPerViewTablet = '2',
    slidesPerViewMobile = '1',
    autoplay = false,
    loop = true
  } = data;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadItems();
  }, [entityType, filterBy, serviceGroupId, limit]);

  useEffect(() => {
    if (autoplay && items.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoplay, items, currentIndex]);

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

  const nextSlide = () => {
    if (loop) {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
    }
  };

  const prevSlide = () => {
    if (loop) {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-bg-secondary">
        <div className="container mx-auto px-4">
          {title && (
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-12 text-center">
              {title}
            </h2>
          )}
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">
                <div className="bg-bg-primary border border-border rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-video bg-border"></div>
                  <div className="p-6">
                    <div className="bg-border h-6 w-3/4 mb-3 rounded"></div>
                    <div className="bg-border h-4 w-full mb-2 rounded"></div>
                  </div>
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

  // Calculate visible slides based on screen size (simplified for SSR)
  const slidesPerView = parseInt(slidesPerViewDesktop);

  return (
    <section className="py-12 md:py-16 bg-bg-secondary">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-12 text-center">
            {title}
          </h2>
        )}

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`
              }}
            >
              {items.map((item) => {
                const imageUrl = getImageUrl(item);
                const itemTitle = item.title || item.name;
                const itemExcerpt = item.excerpt || '';

                return (
                  <Link
                    key={item.$id}
                    to={getEntityUrl(item)}
                    className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 group"
                    style={{ width: `calc(${100 / slidesPerView}% - 1.5rem)` }}
                  >
                    <div className="bg-bg-primary border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full">
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
                          <p className="text-text-secondary font-body line-clamp-2">
                            {itemExcerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          {items.length > slidesPerView && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                disabled={!loop && currentIndex === 0}
                className="p-3 rounded-full bg-bg-primary border border-border hover:bg-accent hover:text-white hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(items.length / slidesPerView) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * slidesPerView)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      Math.floor(currentIndex / slidesPerView) === index ? 'bg-accent' : 'bg-border'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={!loop && currentIndex >= items.length - slidesPerView}
                className="p-3 rounded-full bg-bg-primary border border-border hover:bg-accent hover:text-white hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
