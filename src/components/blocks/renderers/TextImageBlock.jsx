/**
 * TextImageBlock - Renders text with an image (left or right)
 */
export const TextImageBlock = ({ data }) => {
  const { title, content, image, imagePosition = 'right' } = data;

  const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';
  const imageUrl = image
    ? `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${image}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`
    : null;

  return (
    <section className="py-12 md:py-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text Content */}
          <div className={imagePosition === 'left' ? 'lg:order-2' : ''}>
            {title && (
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-6">
                {title}
              </h2>
            )}

            {content && (
              <div
                className="prose prose-lg max-w-none text-text-secondary font-body"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>

          {/* Image */}
          {imageUrl && (
            <div className={imagePosition === 'left' ? 'lg:order-1' : ''}>
              <img
                src={imageUrl}
                alt={title || 'Content image'}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
