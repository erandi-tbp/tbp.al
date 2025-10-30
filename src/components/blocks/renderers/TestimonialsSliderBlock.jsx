import { useState, useEffect } from 'react';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * TestimonialsSliderBlock - Renders testimonials in a slider
 */
export const TestimonialsSliderBlock = ({ data }) => {
  const { title, showRelated = true } = data;
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        'testimonials',
        [
          Query.equal('isApproved', true),
          Query.orderDesc('$createdAt'),
          Query.limit(10)
        ]
      );
      setTestimonials(response.documents);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-secondary font-body">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-12 md:py-16 bg-bg-secondary">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-12 text-center">
            {title}
          </h2>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="bg-bg-primary border border-border rounded-lg p-8 md:p-12 relative">
            {/* Quote */}
            <div className="mb-6">
              <p className="text-xl md:text-2xl text-text-primary font-body italic">
                "{currentTestimonial.testimonial}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              {currentTestimonial.avatar && (
                <img
                  src={`${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS}/files/${currentTestimonial.avatar}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`}
                  alt={currentTestimonial.clientName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-heading font-bold text-text-primary">
                  {currentTestimonial.clientName}
                </div>
                {currentTestimonial.clientRole && (
                  <div className="text-text-secondary font-body text-sm">
                    {currentTestimonial.clientRole}
                    {currentTestimonial.clientCompany && ` at ${currentTestimonial.clientCompany}`}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-bg-secondary hover:bg-accent hover:text-white transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-accent' : 'bg-border'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-bg-secondary hover:bg-accent hover:text-white transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
