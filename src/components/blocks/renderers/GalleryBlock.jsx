/**
 * GalleryBlock - Renders an image gallery
 */
export const GalleryBlock = ({ data }) => {
  const { title, images, columns = '3' } = data;

  const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';

  // Parse images (comma-separated file IDs)
  const imageIds = images ? images.split(',').filter(id => id.trim()) : [];

  const columnClass = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-12 md:py-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-8 text-center">
            {title}
          </h2>
        )}

        {imageIds.length > 0 ? (
          <div className={`grid ${columnClass} gap-4`}>
            {imageIds.map((imageId, index) => {
              const imageUrl = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${imageId.trim()}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;

              return (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-text-secondary font-body">No images available</p>
        )}
      </div>
    </section>
  );
};
