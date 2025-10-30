/**
 * TextContentBlock - Renders a text content section
 */
export const TextContentBlock = ({ data }) => {
  const { title, content } = data;

  return (
    <section className="py-12 md:py-16 bg-bg-primary">
      <div className="container mx-auto px-4 max-w-4xl">
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
    </section>
  );
};
