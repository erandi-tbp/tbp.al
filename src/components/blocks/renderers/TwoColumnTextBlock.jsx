/**
 * TwoColumnTextBlock - Renders text in two columns
 */
export const TwoColumnTextBlock = ({ data }) => {
  const { title, leftContent, rightContent } = data;

  return (
    <section className="py-12 md:py-16 bg-bg-primary">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-8 text-center">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          {leftContent && (
            <div
              className="prose prose-lg max-w-none text-text-secondary font-body"
              dangerouslySetInnerHTML={{ __html: leftContent }}
            />
          )}

          {/* Right Column */}
          {rightContent && (
            <div
              className="prose prose-lg max-w-none text-text-secondary font-body"
              dangerouslySetInnerHTML={{ __html: rightContent }}
            />
          )}
        </div>
      </div>
    </section>
  );
};
