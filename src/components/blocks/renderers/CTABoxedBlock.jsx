/**
 * CTABoxedBlock - Renders a boxed call-to-action with background
 */
export const CTABoxedBlock = ({ data }) => {
  const { title, description, buttonText, buttonLink, backgroundColor = 'accent' } = data;

  const bgClass = {
    'accent': 'bg-accent text-white',
    'primary': 'bg-bg-primary text-text-primary border border-border',
    'secondary': 'bg-bg-secondary text-text-primary border border-border'
  }[backgroundColor] || 'bg-accent text-white';

  return (
    <section className="py-12 md:py-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        <div className={`${bgClass} rounded-lg p-8 md:p-12 text-center`}>
          {title && (
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {title}
            </h2>
          )}

          {description && (
            <p className="text-lg font-body mb-8 max-w-2xl mx-auto opacity-90">
              {description}
            </p>
          )}

          {buttonText && buttonLink && (
            <a
              href={buttonLink}
              className={`inline-block px-8 py-4 font-body font-bold rounded-lg transition-colors ${
                backgroundColor === 'accent'
                  ? 'bg-white text-accent hover:bg-gray-100'
                  : 'bg-accent text-white hover:bg-accent/90'
              }`}
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
