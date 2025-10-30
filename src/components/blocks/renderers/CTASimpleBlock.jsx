/**
 * CTASimpleBlock - Renders a simple call-to-action
 */
export const CTASimpleBlock = ({ data }) => {
  const { title, description, buttonText, buttonLink } = data;

  return (
    <section className="py-12 md:py-16 bg-bg-primary">
      <div className="container mx-auto px-4 text-center">
        {title && (
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            {title}
          </h2>
        )}

        {description && (
          <p className="text-lg text-text-secondary font-body mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        {buttonText && buttonLink && (
          <a
            href={buttonLink}
            className="inline-block px-8 py-4 bg-accent text-white font-body font-bold rounded-lg hover:bg-accent/90 transition-colors"
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
};
