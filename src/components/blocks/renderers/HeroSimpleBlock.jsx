/**
 * HeroSimpleBlock - Renders a simple hero section
 */
export const HeroSimpleBlock = ({ data }) => {
  const { title, subtitle, backgroundImage, ctaText, ctaLink } = data;

  const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_SETTINGS || '69037a5a0013327b7dd0';
  const backgroundUrl = backgroundImage
    ? `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${backgroundImage}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`
    : null;

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center bg-cover bg-center"
      style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : {}}
    >
      {/* Overlay */}
      {backgroundUrl && (
        <div className="absolute inset-0 bg-black/50"></div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {title && (
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 font-body mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}

        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            className="inline-block px-8 py-4 bg-accent text-white font-body font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
};
